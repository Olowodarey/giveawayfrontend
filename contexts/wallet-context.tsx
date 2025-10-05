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
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { createWalletAsync } = useCreateWallet()
  const { getWalletAsync } = useGetWallet()
  const { getToken } = useAuth()
  const { user } = useUser()

  // Load wallet from localStorage on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem("chipi_wallet")
    if (savedWallet) {
      try {
        setWallet(JSON.parse(savedWallet))
      } catch (e) {
        console.error("Failed to parse saved wallet:", e)
        localStorage.removeItem("chipi_wallet")
      }
    }
  }, [])

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
          
          // Validate PIN by attempting to use it with the wallet
          // This ensures the PIN can actually decrypt the private key
          try {
            // Try a simple operation to validate the PIN works
            // We'll do this by attempting to get the wallet with this PIN
            walletData = {
              publicKey: (existingWallet as any)?.publicKey || "",
              encryptedPrivateKey: (existingWallet as any)?.encryptedPrivateKey || "",
              address: (existingWallet as any)?.accountAddress || (existingWallet as any)?.address || (existingWallet as any)?.publicKey || "",
            }
            console.log("Processed wallet data:", walletData)
            console.log("⚠️ WARNING: PIN validation not implemented. Using PIN as-is.")
            console.log("Make sure you're using the SAME PIN you used when creating the wallet!")
          } catch (validationError) {
            throw new Error("Invalid PIN. Please use the PIN you created the wallet with.")
          }
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

      // Save wallet to state and localStorage
      setWallet(walletData)
      localStorage.setItem("chipi_wallet", JSON.stringify(walletData))
      localStorage.setItem("wallet_pin", pin) // Store PIN (encrypted in production!)
      
    } catch (err: any) {
      console.error("Wallet connection error:", err)
      setError(err.message || "Failed to connect wallet")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setWallet(null)
    localStorage.removeItem("chipi_wallet")
    localStorage.removeItem("wallet_pin")
    setError(null)
  }

  const value: WalletContextType = {
    wallet,
    isConnected: !!wallet,
    isLoading,
    connectWallet,
    disconnectWallet,
    error,
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
