"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useCreateWallet, useGetWallet } from "@chipi-stack/nextjs"
import { useAuth, useUser } from "@clerk/nextjs"

interface WalletData {
  publicKey: string
  encryptedPrivateKey: string
  address?: string
}

interface WalletContextType {
  wallet: WalletData | null
  isConnected: boolean
  isLoading: boolean
  connectWallet: (pin: string) => Promise<void>
  disconnectWallet: () => void
  error: string | null
  autoConnectWallet: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Generate a secure PIN for automatic wallet creation
function generateSecurePin(userId: string): string {
  // Create a deterministic but secure PIN based on user ID
  // In production, this should use a more secure method
  const hash = userId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  return Math.abs(hash).toString().padStart(6, '0').slice(0, 6);
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false)
  
  const { createWalletAsync } = useCreateWallet()
  const { getWalletAsync } = useGetWallet()
  const { getToken, isLoaded: isAuthLoaded } = useAuth()
  const { user, isLoaded: isUserLoaded } = useUser()

  // Load wallet from localStorage on mount AND verify it matches current user
  useEffect(() => {
    const savedWallet = localStorage.getItem("chipi_wallet")
    const savedUserId = localStorage.getItem("wallet_user_id")
    const currentUserId = user?.primaryEmailAddress?.emailAddress || user?.id
    
    if (savedWallet && savedUserId === currentUserId) {
      try {
        setWallet(JSON.parse(savedWallet))
        console.log("Loaded wallet for user:", currentUserId)
      } catch (e) {
        console.error("Failed to parse saved wallet:", e)
        localStorage.removeItem("chipi_wallet")
        localStorage.removeItem("wallet_pin")
        localStorage.removeItem("wallet_user_id")
      }
    } else if (savedWallet && savedUserId !== currentUserId) {
      // Different user logged in, clear old wallet
      console.log("Different user detected, clearing old wallet")
      console.log("Old user:", savedUserId, "New user:", currentUserId)
      localStorage.removeItem("chipi_wallet")
      localStorage.removeItem("wallet_pin")
      localStorage.removeItem("wallet_user_id")
      localStorage.removeItem("wallet_toast_shown")
      setWallet(null)
      setAutoConnectAttempted(false) // Reset so new user's wallet can be created
    }
  }, [user])

  // Automatic wallet connection when user signs in
  useEffect(() => {
    if (isAuthLoaded && isUserLoaded && user && !wallet && !autoConnectAttempted) {
      setAutoConnectAttempted(true)
      autoConnectWallet().catch((err: any) => {
        console.error("Auto-connect failed:", err)
        // Don't show error to user for auto-connect failures
      })
    }
  }, [isAuthLoaded, isUserLoaded, user, wallet, autoConnectAttempted])

  const connectWallet = async (pin: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if user is authenticated with Clerk
      if (!user) {
        throw new Error("Please sign in first")
      }

      // Get bearer token from Clerk using custom template
      // Using the "giveawayapp" template created in Clerk dashboard
      const token = await getToken({ template: "giveawayapp" })
      if (!token) {
        throw new Error("Failed to get authentication token")
      }

      // Debug: Log token info
      console.log("Token received:", token.substring(0, 50) + "...")
      console.log("User email:", user.primaryEmailAddress?.emailAddress)
      console.log("User ID:", user.id)

      // Use email as external user identifier (must match ChipiPay configuration)
      const userId = user.primaryEmailAddress?.emailAddress || user.id
      console.log("Using userId:", userId)
      
      // Try to get existing wallet first
      let walletData: WalletData | null = null
      
      try {
        const existingWallet = await getWalletAsync({
          externalUserId: userId,
          bearerToken: token,
        })
        
        if (existingWallet) {
          console.log("Existing wallet data:", existingWallet)
          
          walletData = {
            publicKey: (existingWallet as any)?.publicKey || "",
            encryptedPrivateKey: (existingWallet as any)?.encryptedPrivateKey || "",
            address: (existingWallet as any)?.accountAddress || (existingWallet as any)?.address || (existingWallet as any)?.publicKey || "",
          }
          console.log("Processed wallet data:", walletData)
        }
      } catch (e) {
        // Wallet doesn't exist, create new one
        console.log("No existing wallet, creating new one")
      }

      // If no existing wallet, create new one
      if (!walletData) {
        console.log("Creating new wallet with:")
        console.log("- externalUserId:", userId)
        console.log("- bearerToken length:", token.length)
        
        const walletResponse = await createWalletAsync({
          params: {
            encryptKey: pin,
            externalUserId: userId,
          },
          bearerToken: token,
        })

        console.log("Wallet response:", walletResponse)

        walletData = {
          publicKey: (walletResponse as any)?.publicKey || "",
          encryptedPrivateKey: (walletResponse as any)?.encryptedPrivateKey || "",
          address: (walletResponse as any)?.accountAddress || (walletResponse as any)?.address || "",
        }
      }

      if (!walletData || !walletData.publicKey) {
        throw new Error("Failed to create or retrieve wallet")
      }

      // Save wallet to state and localStorage with user ID
      setWallet(walletData)
      localStorage.setItem("chipi_wallet", JSON.stringify(walletData))
      localStorage.setItem("wallet_pin", pin) // Store PIN (encrypted in production!)
      localStorage.setItem("wallet_user_id", userId) // Store user ID to verify on reload
      
    } catch (err: any) {
      console.error("Wallet connection error:", err)
      setError(err.message || "Failed to connect wallet")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Automatic wallet connection (silent, no user interaction)
  const autoConnectWallet = async () => {
    if (!user) {
      console.log("No user found for auto-connect")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Get bearer token from Clerk
      const token = await getToken({ template: "giveawayapp" })
      if (!token) {
        throw new Error("Failed to get authentication token")
      }

      // Use email as external user identifier
      const userId = user.primaryEmailAddress?.emailAddress || user.id
      console.log("Auto-connecting wallet for user:", userId)
      
      // Try to get existing wallet first
      let walletData: WalletData | null = null
      
      try {
        const existingWallet = await getWalletAsync({
          externalUserId: userId,
          bearerToken: token,
        })
        
        if (existingWallet) {
          console.log("Found existing wallet")
          
          walletData = {
            publicKey: (existingWallet as any)?.publicKey || "",
            encryptedPrivateKey: (existingWallet as any)?.encryptedPrivateKey || "",
            address: (existingWallet as any)?.accountAddress || (existingWallet as any)?.address || (existingWallet as any)?.publicKey || "",
          }
        }
      } catch (e) {
        console.log("No existing wallet found, will create new one")
      }

      // If no existing wallet, create new one automatically
      if (!walletData) {
        console.log("Creating new wallet automatically...")
        
        // Generate a secure PIN automatically
        const autoPin = generateSecurePin(userId)
        
        const walletResponse = await createWalletAsync({
          params: {
            encryptKey: autoPin,
            externalUserId: userId,
          },
          bearerToken: token,
        })

        console.log("Wallet created successfully")

        walletData = {
          publicKey: (walletResponse as any)?.publicKey || "",
          encryptedPrivateKey: (walletResponse as any)?.encryptedPrivateKey || "",
          address: (walletResponse as any)?.accountAddress || (walletResponse as any)?.address || "",
        }
        
        // Store the auto-generated PIN
        localStorage.setItem("wallet_pin", autoPin)
      } else {
        // For existing wallets, regenerate the PIN (it should be deterministic)
        const autoPin = generateSecurePin(userId)
        localStorage.setItem("wallet_pin", autoPin)
      }

      if (!walletData || !walletData.publicKey) {
        throw new Error("Failed to create or retrieve wallet")
      }

      // Save wallet to state and localStorage with user ID
      setWallet(walletData)
      localStorage.setItem("chipi_wallet", JSON.stringify(walletData))
      localStorage.setItem("wallet_user_id", userId) // Store user ID to verify on reload
      
      console.log("Wallet auto-connected successfully!")
      
    } catch (err: any) {
      console.error("Auto wallet connection error:", err)
      setError(err.message || "Failed to auto-connect wallet")
      // Don't throw error for auto-connect - fail silently
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setWallet(null)
    localStorage.removeItem("chipi_wallet")
    localStorage.removeItem("wallet_pin")
    localStorage.removeItem("wallet_user_id")
    localStorage.removeItem("wallet_toast_shown")
    setError(null)
  }

  const value: WalletContextType = {
    wallet,
    isConnected: !!wallet,
    isLoading,
    connectWallet,
    disconnectWallet,
    error,
    autoConnectWallet,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// Helper hook to get PIN from localStorage
export function useWalletPin() {
  const [pin, setPin] = useState<string>("")

  useEffect(() => {
    const savedPin = localStorage.getItem("wallet_pin")
    if (savedPin) {
      setPin(savedPin)
    }
  }, [])

  return pin
}
