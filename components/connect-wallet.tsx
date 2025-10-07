"use client"

import { useState } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wallet, Loader2, Copy, ExternalLink, LogOut } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { useToast } from "@/hooks/use-toast"

export function ConnectWallet() {
  const { wallet, isConnected, isLoading, connectWallet, disconnectWallet } = useWallet()
  const { toast } = useToast()
  const { user, isSignedIn } = useUser()
  const { openSignIn } = useClerk()
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [pin, setPin] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    if (!pin || pin.length < 4) {
      toast({
        title: "Invalid PIN",
        description: "Please enter a PIN with at least 4 characters",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    try {
      await connectWallet(pin)
      setShowPinDialog(false)
      setPin("")
      toast({
        title: "Wallet Connected!",
        description: "Your gasless wallet is ready to use",
      })
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    disconnectWallet()
    toast({
      title: "Wallet Disconnected",
      description: "You've been logged out",
    })
  }

  const copyAddress = () => {
    if (wallet?.address || wallet?.publicKey) {
      navigator.clipboard.writeText(wallet.address || wallet.publicKey)
      toast({
        title: "Copied!",
        description: "Address copied to clipboard",
      })
    }
  }

  const formatAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isConnected && wallet) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">
                {formatAddress(wallet.address || wallet.publicKey)}
              </span>
              <span className="sm:hidden">Wallet</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
            <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy Address</span>
            </DropdownMenuItem>
            {wallet.address && (
              <DropdownMenuItem asChild>
                <a
                  href={`https://starkscan.co/contract/${wallet.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>View on Starkscan</span>
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Disconnect</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Visible Disconnect Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDisconnect}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">Disconnect</span>
        </Button>
      </div>
    )
  }

  // If not signed in, show sign-in button
  if (!isSignedIn) {
    return (
      <Button onClick={() => openSignIn()} className="gap-2">
        <Wallet className="h-4 w-4" />
        <span>Sign In</span>
      </Button>
    )
  }

  return (
    <>
      <Button onClick={() => setShowPinDialog(true)} disabled={isLoading} className="gap-2">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4" />
            <span>Connect Wallet</span>
          </>
        )}
      </Button>

      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>
              Create or access your gasless wallet with a secure PIN. No gas fees required!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-pin">Wallet PIN</Label>
              <Input
                id="wallet-pin"
                type="password"
                placeholder="Enter your PIN (4+ characters)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && pin.length >= 4) {
                    handleConnect()
                  }
                }}
                minLength={4}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                This PIN encrypts your wallet locally. If you're new, we'll create a wallet for you!
              </p>
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 mt-2">
                <p className="text-xs text-orange-700 dark:text-orange-400 font-semibold mb-1">
                  ⚠️ Important: Use the SAME PIN every time!
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-300">
                  If you already have a wallet, you <strong>MUST</strong> use the exact same PIN you used when creating it. Using a different PIN will show "Wrong Password" errors when claiming prizes or sending tokens.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPinDialog(false)
                  setPin("")
                }}
                className="flex-1"
                disabled={isConnecting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConnect}
                className="flex-1"
                disabled={isConnecting || pin.length < 4}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
