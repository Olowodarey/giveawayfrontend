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
import { u256ToStrk, codeToFelt, feltToString } from "@/lib/contract-utils"
import { getTokenByAddress, formatTokenAmount, SUPPORTED_TOKENS } from "@/lib/token-config"

interface Giveaway {
  id: string
  name: string
  totalAmount: number
  tokenAddress: string
  tokenSymbol: string
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

interface ClaimedPrize {
  giveawayId: string
  giveawayName: string
  amount: number
  tokenSymbol: string
  claimedAt: string
}

interface UserStats {
  createdCount: number
  claimedCount: number
  totalClaimedAmount: number
}

export default function DashboardPage() {
  const [selectedGiveaway, setSelectedGiveaway] = useState<Giveaway | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [isReclaiming, setIsReclaiming] = useState(false)
  const [giveaways, setGiveaways] = useState<Giveaway[]>([])
  const [isLoadingGiveaways, setIsLoadingGiveaways] = useState(true)
  const [claimedPrizes, setClaimedPrizes] = useState<ClaimedPrize[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'reclaimable'>('all')
  const [reclaimableGiveaways, setReclaimableGiveaways] = useState<Giveaway[]>([])
  const { toast } = useToast()
  const { wallet, isConnected } = useWallet()
  const walletPin = useWalletPin()
  const { getToken } = useAuth()
  const { callAnyContractAsync, isLoading: isCallingContract } = useCallAnyContract()
  
  // Initialize provider and contract
  const provider = new RpcProvider({ nodeUrl: 'https://starknet-mainnet.public.blastapi.io' })
  const contract = new Contract(GIVEAWAY_ABI, GIVEAWAY_CONTRACT_ADDRESS, provider)

  // Fetch user's giveaways using the new efficient contract function
  const fetchGiveaways = async () => {
    setIsLoadingGiveaways(true)
    try {
      if (!wallet?.address) {
        setGiveaways([])
        setIsLoadingGiveaways(false)
        return
      }

      console.log("Fetching giveaways for wallet:", wallet.address)

      // Use the new get_user_created_giveaways function
      const userGiveaways = await contract.get_user_created_giveaways(
        wallet.address,
        0, // offset
        100 // limit - fetch up to 100 giveaways
      )
      
      console.log("Raw giveaways from contract:", userGiveaways)
      console.log("Number of giveaways:", userGiveaways?.length || 0)
      
      // Parse the giveaways
      const parsedGiveaways: Giveaway[] = []
      for (let i = 0; i < userGiveaways.length; i++) {
        const giveaway = userGiveaways[i]
        console.log(`Parsing giveaway ${i}:`, giveaway)
        const parsed = parseUserGiveaway(giveaway)
        if (parsed) {
          parsedGiveaways.push(parsed)
          console.log(`Successfully parsed giveaway ${i}:`, parsed)
        } else {
          console.log(`Failed to parse giveaway ${i}`)
        }
      }
      
      console.log("Total parsed giveaways:", parsedGiveaways.length)
      setGiveaways(parsedGiveaways)
    } catch (error) {
      console.error("Error fetching giveaways:", error)
      setGiveaways([])
      toast({
        title: "Error Loading Giveaways",
        description: `Could not fetch giveaways: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setIsLoadingGiveaways(false)
    }
  }

  // Parse UserCreatedGiveaway struct from contract
  const parseUserGiveaway = (giveaway: any): Giveaway | null => {
    try {
      const giveawayId = giveaway?.giveaway_id ? Number(giveaway.giveaway_id) : 0
      const name = giveaway?.name ? feltToString(giveaway.name) : `Giveaway #${giveawayId}`
      
      // Get token info - handle different address formats
      let tokenAddress = giveaway?.token_address || ''
      
      // Convert address to string if it's not already
      if (typeof tokenAddress !== 'string') {
        tokenAddress = tokenAddress?.toString ? tokenAddress.toString() : String(tokenAddress)
      }
      
      console.log("Token address from contract:", tokenAddress, typeof tokenAddress)
      
      const tokenInfo = getTokenByAddress(tokenAddress)
      console.log("Token info found:", tokenInfo)
      
      const tokenSymbol = tokenInfo?.symbol || 'STRK'
      const decimals = tokenInfo?.decimals || 18
      
      // Parse amount with correct decimals
      const amountLow = giveaway?.total_amount?.low?.toString() || '0'
      const amountHigh = giveaway?.total_amount?.high?.toString() || '0'
      const totalAmount = parseFloat(u256ToStrk(amountLow, amountHigh))
      
      const numWinners = giveaway?.num_winners ? Number(giveaway.num_winners) : 0
      const claimedCount = giveaway?.claimed_count ? Number(giveaway.claimed_count) : 0
      const createdAt = giveaway?.created_at ? Number(giveaway.created_at) : 0
      const expiryTime = giveaway?.expiry_time ? Number(giveaway.expiry_time) : 0
      const isActive = giveaway?.is_active !== undefined ? giveaway.is_active : false
      
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
      const createdDate = createdAt > 0 ? new Date(createdAt * 1000) : new Date(expiryDate.getTime() - 24 * 60 * 60 * 1000)
      
      // Format dates with time
      const formatDateTime = (date: Date) => {
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      }
      
      return {
        id: giveawayId.toString(),
        name,
        totalAmount,
        tokenAddress,
        tokenSymbol,
        numWinners,
        claimed: claimedCount,
        status,
        createdAt: formatDateTime(createdDate),
        expiresAt: formatDateTime(expiryDate),
        creator: wallet?.address || '',
      }
    } catch (error) {
      console.error("Error parsing giveaway:", error, giveaway)
      return null
    }
  }
  
  // Fetch user stats
  const fetchUserStats = async () => {
    try {
      if (!wallet?.address) return
      
      const stats = await contract.get_user_stats(wallet.address)
      
      const createdCount = Number(stats[0])
      const claimedCount = Number(stats[1])
      const totalClaimedAmount = parseFloat(u256ToStrk(stats[2].low?.toString() || '0', stats[2].high?.toString() || '0'))
      
      setUserStats({
        createdCount,
        claimedCount,
        totalClaimedAmount
      })
    } catch (error) {
    }
  }

  // Fetch claimed prizes
  const fetchClaimedPrizes = async () => {
    try {
      if (!wallet?.address) return
      
      const prizes = await contract.get_user_claimed_prizes(
        wallet.address,
        0, // offset
        50 // limit
      )
      
      const parsedPrizes: ClaimedPrize[] = []
      for (let i = 0; i < prizes.length; i++) {
        const prize = prizes[i]
        const giveawayId = prize.giveaway_id?.toString() || '0'
        
        // Try to fetch giveaway details to get token info
        let tokenSymbol = 'STRK'
        try {
          const giveawayDetails = await contract.get_giveaway_by_id(Number(giveawayId))
          if (giveawayDetails && giveawayDetails.token_address) {
            const tokenInfo = getTokenByAddress(giveawayDetails.token_address)
            tokenSymbol = tokenInfo?.symbol || 'STRK'
          }
        } catch (e) {
          // If we can't fetch details, default to STRK
        }
        
        const amountLow = prize.amount?.low?.toString() || '0'
        const amountHigh = prize.amount?.high?.toString() || '0'
        const amount = parseFloat(u256ToStrk(amountLow, amountHigh))
        
        parsedPrizes.push({
          giveawayId,
          giveawayName: feltToString(prize.giveaway_name),
          amount,
          tokenSymbol,
          claimedAt: new Date(Number(prize.claimed_at) * 1000).toISOString().split('T')[0]
        })
      }
      
      setClaimedPrizes(parsedPrizes)
    } catch (error) {
    }
  }

  // Fetch reclaimable giveaways
  const fetchReclaimableGiveaways = async () => {
    try {
      if (!wallet?.address) return
      
      const reclaimable = await contract.get_reclaimable_giveaways(wallet.address)
      
      const parsedGiveaways: Giveaway[] = []
      for (let i = 0; i < reclaimable.length; i++) {
        const giveaway = reclaimable[i]
        const parsed = parseUserGiveaway(giveaway)
        if (parsed) {
          parsedGiveaways.push(parsed)
        }
      }
      
      setReclaimableGiveaways(parsedGiveaways)
    } catch (error) {
    }
  }

  useEffect(() => {
    if (wallet?.address) {
      fetchGiveaways()
      fetchUserStats()
      fetchClaimedPrizes()
      fetchReclaimableGiveaways()
    }
  }, [wallet?.address])

  const totalGiveaways = userStats?.createdCount || giveaways.length
  const totalDistributed = giveaways.reduce((sum, g) => {
    const distributed = (g.totalAmount * g.claimed) / g.numWinners
    return sum + distributed
  }, 0)
  const distributedTokenSymbol = giveaways.length > 0 ? giveaways[0].tokenSymbol : 'STRK'
  const totalClaimed = userStats?.claimedCount || 0
  const activeGiveaways = giveaways.filter((g) => g.status === "active").length

  // Get filtered giveaways based on active tab
  const getFilteredGiveaways = () => {
    switch (activeTab) {
      case 'active':
        return giveaways.filter(g => g.status === 'active')
      case 'reclaimable':
        return reclaimableGiveaways
      default:
        return giveaways
    }
  }

  const filteredGiveaways = getFilteredGiveaways()

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
        description: `${unclaimedAmount.toFixed(4)} ${giveaway.tokenSymbol} returned to your wallet`,
      })

      // Refresh the giveaway list
      setTimeout(() => {
        fetchGiveaways()
      }, 3000)
    } catch (error: any) {
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
                    <p className="text-2xl font-bold text-foreground">{totalDistributed.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Mixed tokens</p>
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
                    <p className="text-sm text-muted-foreground mb-1">Prizes Won</p>
                    <p className="text-2xl font-bold text-foreground">{totalClaimed}</p>
                    {userStats && userStats.totalClaimedAmount > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {userStats.totalClaimedAmount.toFixed(2)} STRK earned
                      </p>
                    )}
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

          {/* Claimed Prizes Section */}
          {claimedPrizes.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Claimed Prizes</CardTitle>
                <CardDescription>Prizes you've won from giveaways</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {claimedPrizes.map((prize, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div>
                        <p className="font-medium text-foreground">{prize.giveawayName}</p>
                        <p className="text-sm text-muted-foreground">Claimed on {prize.claimedAt}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-success">{prize.amount.toFixed(4)} {prize.tokenSymbol}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Giveaways Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Your Giveaways</CardTitle>
                  <CardDescription>View and manage all your created giveaways</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {/* Tab Buttons */}
                  <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                    <Button
                      onClick={() => setActiveTab('all')}
                      variant={activeTab === 'all' ? 'default' : 'ghost'}
                      size="sm"
                      className="text-xs"
                    >
                      All ({giveaways.length})
                    </Button>
                    <Button
                      onClick={() => setActiveTab('active')}
                      variant={activeTab === 'active' ? 'default' : 'ghost'}
                      size="sm"
                      className="text-xs"
                    >
                      Active ({activeGiveaways})
                    </Button>
                    <Button
                      onClick={() => setActiveTab('reclaimable')}
                      variant={activeTab === 'reclaimable' ? 'default' : 'ghost'}
                      size="sm"
                      className="text-xs"
                    >
                      Reclaimable ({reclaimableGiveaways.length})
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mobile View */}
              <div className="lg:hidden space-y-4">
                {isLoadingGiveaways ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <span className="text-muted-foreground">Loading giveaways from blockchain...</span>
                  </div>
                ) : filteredGiveaways.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground mb-4">
                      {activeTab === 'reclaimable' 
                        ? 'No reclaimable giveaways found.'
                        : activeTab === 'active'
                        ? 'No active giveaways found.'
                        : 'No giveaways found.'}
                    </div>
                    {activeTab === 'all' && (
                      <Button onClick={() => window.location.href = '/create'}>Create Your First Giveaway</Button>
                    )}
                  </div>
                ) : (
                  filteredGiveaways.map((giveaway) => (
                  <Card key={giveaway.id} className="border-border">
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{giveaway.id}</span>
                        <Badge className={getStatusColor(giveaway.status)}>{giveaway.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="ml-2 font-medium text-foreground">{giveaway.totalAmount.toFixed(4)} {giveaway.tokenSymbol}</span>
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
                        <TableHead>Name</TableHead>
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
                      {filteredGiveaways.map((giveaway) => (
                      <TableRow key={giveaway.id}>
                        <TableCell className="font-medium">{giveaway.id}</TableCell>
                        <TableCell className="font-mono text-sm">{giveaway.name}</TableCell>
                        <TableCell>{giveaway.totalAmount.toFixed(4)} {giveaway.tokenSymbol}</TableCell>
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
                  <div className="text-lg font-semibold text-foreground">{selectedGiveaway.totalAmount.toFixed(4)} {selectedGiveaway.tokenSymbol}</div>
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
