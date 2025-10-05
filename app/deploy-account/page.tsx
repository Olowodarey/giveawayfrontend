"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/components/footer"
import { useWallet, useWalletPin } from "@/contexts/wallet-context"
import { useAuth } from "@clerk/nextjs"
import { useTransfer } from "@chipi-stack/nextjs"

export default function DeployAccountPage() {
  const [isDeploying, setIsDeploying] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)
  
  const { toast } = useToast()
  const { wallet, isConnected } = useWallet()
  const walletPin = useWalletPin()
  const { getToken } = useAuth()
  const { transferAsync } = useTransfer()

  const deployAccount = async () => {
    if (!isConnected || !wallet || !walletPin) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    setIsDeploying(true)

    try {
      const bearerToken = await getToken({ template: "giveawayapp" })
      if (!bearerToken) {
        throw new Error("Failed to get authentication token")
      }

      toast({
        title: "Deploying Account",
        description: "Sending a small transaction to deploy your account...",
      })

      // Send a tiny amount to yourself to trigger account deployment
      await transferAsync({
        params: {
          amount: "0.000001", // Very small amount
          encryptKey: walletPin,
          wallet: wallet,
          recipient: wallet.address, // Send to yourself
          token: "STRK" as any,
        },
        bearerToken: bearerToken,
      })

      setIsDeployed(true)
      toast({
        title: "Account Deployed!",
        description: "Your account has been deployed. You can now send transactions.",
      })
    } catch (error: any) {
      console.error("Deployment error:", error)
      
      let errorMessage = error.message || "Failed to deploy account"
      
      if (errorMessage.includes("Insufficient")) {
        errorMessage = "You need some STRK tokens to deploy. Please fund your wallet first."
      }
      
      toast({
        title: "Deployment Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsDeploying(false)
    }
  }

  if (!isConnected || !wallet) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Wallet Not Connected</CardTitle>
              <CardDescription>
                Please connect your wallet to deploy your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => window.location.href = "/"}>
                Go to Home
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Deploy Your Account</CardTitle>
              <CardDescription>
                Your Starknet account needs to be deployed before you can send transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status */}
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-500 mb-2">Why do I need to deploy?</div>
                    <div className="text-muted-foreground space-y-2">
                      <p>
                        In Starknet, your wallet is a smart contract that needs to be deployed to the network before you can use it.
                      </p>
                      <p>
                        This is a one-time process. After deployment, you can send transactions normally.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet Info */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Your Wallet Address</div>
                <div className="p-3 rounded-lg bg-muted font-mono text-xs break-all">
                  {wallet.address}
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <div className="text-sm font-medium">Before deploying:</div>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Make sure you have some STRK tokens in your wallet (you already have 150 STRK!)</li>
                  <li>Click the "Deploy Account" button below</li>
                  <li>Wait for the transaction to complete</li>
                  <li>Your account will be deployed and ready to use</li>
                </ol>
              </div>

              {/* Deploy Button */}
              {!isDeployed ? (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={deployAccount}
                  disabled={isDeploying}
                >
                  {isDeploying ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Deploying Account...
                    </>
                  ) : (
                    "Deploy Account"
                  )}
                </Button>
              ) : (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium text-green-500">Account Deployed!</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        You can now use all features of the app
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => window.location.href = "/wallet"}
                  >
                    Go to Wallet
                  </Button>
                </div>
              )}

              {/* Help */}
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="text-sm">
                  <div className="font-medium text-yellow-600 dark:text-yellow-400 mb-1">
                    Need help?
                  </div>
                  <div className="text-muted-foreground">
                    If deployment fails, make sure you have STRK tokens in your wallet. You can check your balance on the Wallet page.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
