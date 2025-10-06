"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Gift, TrendingUp, Users, Clock, Eye, RefreshCw, Loader2 } from "lucide-react"
import { Footer } from "@/components/footer"
import { useToast } from "@/hooks/use-toast"
import { useCallAnyContract } from "@chipi-stack/nextjs"
import { GIVEAWAY_CONTRACT_ADDRESS, GIVEAWAY_ABI } from "@/lib/contract-config"
import { useWallet, useWalletPin } from "@/contexts/wallet-context"
import { useAuth } from "@clerk/nextjs"
import { Contract, RpcProvider } from "starknet"
import { u256ToStrk, codeToFelt } from "@/lib/contract-utils"

interface Giveaway {
  id: string
  name: string
  totalAmount: number
  numWinners: number
  claimed: number
  status: "active" | "expired" | "completed"
  createdAt: string
  expiresAt: string
  creator?: string
}

interface ClaimDetail {
  wallet: string
  amount: number
  claimedAt: string
}

export default function DashboardPage() {
  const [selectedGiveaway, setSelectedGiveaway] = useState<Giveaway | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [isReclaiming, setIsReclaiming] = useState(false)
  const [giveaways, setGiveaways] = useState<Giveaway[]>([])
  const [isLoadingGiveaways, setIsLoadingGiveaways] = useState(true)
  const { toast } = useToast()
  const { wallet, isConnected } = useWallet()
  const walletPin = useWalletPin()
  const { getToken } = useAuth()
  const { callAnyContractAsync, isLoading: isCallingContract } = useCallAnyContract()
  
  // Initialize provider and contract
  const provider = new RpcProvider({ nodeUrl: 'https://starknet-mainnet.public.blastapi.io' })
  const contract = new Contract(GIVEAWAY_ABI, GIVEAWAY_CONTRACT_ADDRESS, provider)

  // Fetch real giveaway data from contract
  const fetchGiveaways = async () => {
    setIsLoadingGiveaways(true)
    try {
      // Get total giveaway count from contract
      const countResult = await contract.get_giveaway_count()
      const totalCount = Number(countResult)
      
      console.log('Total giveaways on contract:', totalCount)
      
      if (totalCount === 0) {
        setGiveaways([])
        setIsLoadingGiveaways(false)
        return
      }
      
      // Fetch all giveaways
      const giveawayPromises = []
      for (let i = 1; i <= totalCount; i++) {
        giveawayPromises.push(fetchGiveawayInfo(i))
      }
      
      const allGiveaways = await Promise.all(giveawayPromises)
      
      // Filter to only show user's giveaways if wallet is connected
      let userGiveaways = allGiveaways.filter(g => g !== null) as Giveaway[]
      
      if (wallet?.address) {
        userGiveaways = userGiveaways.filter(
          g => g.creator?.toLowerCase() === wallet.address.toLowerCase()
        )
      }
      
      console.log('User giveaways:', userGiveaways)
      setGiveaways(userGiveaways)
    } catch (error) {
      console.error('Error fetching giveaways:', error)
      setGiveaways([])
      toast({
        title: "Error Loading Giveaways",
        description: "Could not fetch giveaways from the blockchain. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingGiveaways(false)
    }
  }
  
  const fetchGiveawayInfo = async (giveawayId: number): Promise<Giveaway | null> => {
    try {
      const info = await contract.get_giveaway_info(giveawayId)
      
      // Parse the response
      const name = info.name
      const creator = info.creator
      const totalAmount = parseFloat(u256ToStrk(info.total_amount.low.toString(), info.total_amount.high.toString()))
      const numWinners = Number(info.num_winners)
      const claimedCount = Number(info.claimed_count)
      const expiryTime = Number(info.expiry_time)
      const isActive = info.is_active
      
      // Determine status
      const now = Math.floor(Date.now() / 1000)
      let status: "active" | "expired" | "completed"
      
      if (claimedCount === numWinners) {
        status = "completed"
      } else if (now > expiryTime || !isActive) {
        status = "expired"
      } else {
        status = "active"
      }
      
      // Calculate dates
      const expiryDate = new Date(expiryTime * 1000)
      const createdDate = new Date(expiryDate.getTime() - 24 * 60 * 60 * 1000) // Assume created 24h before expiry
      
      return {
        id: giveawayId.toString(),
        name: name.toString(),
        totalAmount,
        numWinners,
        claimed: claimedCount,
        status,
        createdAt: createdDate.toISOString().split('T')[0],
        expiresAt: expiryDate.toISOString().split('T')[0],
        creator: creator.toString(),
      }
    } catch (error) {
      console.error(`Error fetching giveaway ${giveawayId}:`, error)
      return null
    }
  }

  useEffect(() => {
    fetchGiveaways()
  }, [wallet?.address])

  const totalGiveaways = giveaways.length
  const totalDistributed = giveaways.reduce((sum, g) => sum + (g.totalAmount * g.claimed) / g.numWinners, 0)
  const totalClaimed = giveaways.reduce((sum, g) => sum + g.claimed, 0)
  const activeGiveaways = giveaways.filter((g) => g.status === "active").length

  const getStatusColor = (status: Giveaway["status"]) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground"
      case "completed":
        return "bg-accent text-accent-foreground"
      case "expired":
        return "bg-muted text-muted-foreground"
    }
  }

  const handleViewDetails = (giveaway: Giveaway) => {
    setSelectedGiveaway(giveaway)
    setDetailsOpen(true)
  }

  const handleReclaimFunds = async (giveaway: Giveaway) => {
    // Check if wallet is connected
    if (!isConnected || !wallet) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    if (!walletPin) {
      toast({
        title: "PIN Not Found",
        description: "Please reconnect your wallet to set up your PIN",
        variant: "destructive",
      })
      return
    }

    setIsReclaiming(true)

    try {
      const bearerToken = await getToken({ template: "giveawayapp" })
      if (!bearerToken) {
        throw new Error("Failed to get authentication token")
      }

      // Convert giveaway name to felt252 for the contract call
      const nameFelt = codeToFelt(giveaway.name)

      toast({
        title: "Reclaiming Funds",
        description: "Processing your request...",
      })

      // Call reclaim_funds on the contract
      const result = await callAnyContractAsync({
        params: {
          encryptKey: walletPin,
          wallet: wallet,
          contractAddress: GIVEAWAY_CONTRACT_ADDRESS,
          calls: [
            {
              contractAddress: GIVEAWAY_CONTRACT_ADDRESS,
              entrypoint: "reclaim_funds",
              calldata: [nameFelt],
            },
          ],
        },
        bearerToken: bearerToken,
      })

      const unclaimedAmount = (giveaway.totalAmount * (giveaway.numWinners - giveaway.claimed)) / giveaway.numWinners
      
      toast({
        title: "Funds Reclaimed Successfully!",
        description: `${unclaimedAmount.toFixed(2)} STRK returned to your wallet`,
      })

      // Refresh the giveaway list
      setTimeout(() => {
        fetchGiveaways()
      }, 3000)
    } catch (error: any) {
      console.error("Error reclaiming funds:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to reclaim funds. Please ensure the giveaway has expired and you are the creator.",
        variant: "destructive",
      })
    } finally {
      setIsReclaiming(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your giveaways and track performance</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Giveaways</p>
                    <p className="text-2xl font-bold text-foreground">{totalGiveaways}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Distributed</p>
                    <p className="text-2xl font-bold text-foreground">{totalDistributed.toFixed(0)} STRK</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Claims</p>
                    <p className="text-2xl font-bold text-foreground">{totalClaimed}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active</p>
                    <p className="text-2xl font-bold text-foreground">{activeGiveaways}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Giveaways Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Giveaways</CardTitle>
              <CardDescription>View and manage all your created giveaways</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mobile View */}
              <div className="lg:hidden space-y-4">
                {isLoadingGiveaways ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <span className="text-muted-foreground">Loading giveaways from blockchain...</span>
                  </div>
                ) : giveaways.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground mb-4">No giveaways found.</div>
                    <Button onClick={() => window.location.href = '/create'}>Create Your First Giveaway</Button>
                  </div>
                ) : (
                  giveaways.map((giveaway) => (
                  <Card key={giveaway.id} className="border-border">
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{giveaway.id}</span>
                        <Badge className={getStatusColor(giveaway.status)}>{giveaway.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="ml-2 font-medium text-foreground">{giveaway.totalAmount} STRK</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Winners:</span>
                          <span className="ml-2 font-medium text-foreground">{giveaway.numWinners}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Claimed:</span>
                          <span className="ml-2 font-medium text-foreground">
                            {giveaway.claimed}/{giveaway.numWinners}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Created:</span>
                          <span className="ml-2 font-medium text-foreground">{giveaway.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(giveaway)}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        {giveaway.status === "expired" && giveaway.claimed < giveaway.numWinners && (
                          <Button
                            size="sm"
                            variant="default"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleReclaimFunds(giveaway)}
                            disabled={isReclaiming}
                          >
                            {isReclaiming ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Reclaiming...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Reclaim Funds
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  ))
                )}
              </div>

              {/* Desktop View */}
              <div className="hidden lg:block overflow-x-auto">
                {isLoadingGiveaways ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <span className="text-muted-foreground">Loading giveaways from blockchain...</span>
                  </div>
                ) : giveaways.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground mb-4">No giveaways found.</div>
                    <Button onClick={() => window.location.href = '/create'}>Create Your First Giveaway</Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Winners</TableHead>
                        <TableHead>Claimed</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {giveaways.map((giveaway) => (
                      <TableRow key={giveaway.id}>
                        <TableCell className="font-medium">{giveaway.id}</TableCell>
                        <TableCell>{giveaway.totalAmount} STRK</TableCell>
                        <TableCell>{giveaway.numWinners}</TableCell>
                        <TableCell>
                          {giveaway.claimed}/{giveaway.numWinners}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(giveaway.status)}>{giveaway.status}</Badge>
                        </TableCell>
                        <TableCell>{giveaway.createdAt}</TableCell>
                        <TableCell>{giveaway.expiresAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewDetails(giveaway)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {giveaway.status === "expired" && giveaway.claimed < giveaway.numWinners && (
                              <Button 
                                size="sm" 
                                variant="default"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleReclaimFunds(giveaway)}
                                disabled={isReclaiming}
                              >
                                {isReclaiming ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    Reclaiming...
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-1" />
                                    Reclaim
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Giveaway Details - {selectedGiveaway?.id}</DialogTitle>
            <DialogDescription>View claim history and giveaway statistics</DialogDescription>
          </DialogHeader>

          {selectedGiveaway && (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Amount</div>
                  <div className="text-lg font-semibold text-foreground">{selectedGiveaway.totalAmount} STRK</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Claimed</div>
                  <div className="text-lg font-semibold text-foreground">
                    {selectedGiveaway.claimed}/{selectedGiveaway.numWinners}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <Badge className={getStatusColor(selectedGiveaway.status)}>{selectedGiveaway.status}</Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Expires</div>
                  <div className="text-sm font-medium text-foreground">{selectedGiveaway.expiresAt}</div>
                </div>
              </div>

              {/* Claim History */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">Giveaway Summary</h4>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Claim history tracking coming soon. For now, you can view your giveaway status and reclaim unclaimed funds after expiry.
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
