"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  Send,
  Copy,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/footer";
import { useWallet, useWalletPin } from "@/contexts/wallet-context";
import { useAuth } from "@clerk/nextjs";
import { useTransfer, useCallAnyContract } from "@chipi-stack/nextjs";
import { STRK_TOKEN_ADDRESS } from "@/lib/contract-config";
import { SUPPORTED_TOKENS, type TokenSymbol } from "@/lib/token-config";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function WalletPage() {
  const [sendAmount, setSendAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [showAddress, setShowAddress] = useState(true); // Show by default
  const [isSending, setIsSending] = useState(false);
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenSymbol>("STRK");

  const { toast } = useToast();
  const { wallet, isConnected } = useWallet();
  const walletPin = useWalletPin();
  const { getToken } = useAuth();
  const { transferAsync } = useTransfer();
  const { callAnyContractAsync } = useCallAnyContract();

  // Function to fetch balance for a specific token
  const fetchTokenBalance = async (tokenSymbol: TokenSymbol) => {
    if (!wallet?.address) return;

    try {
      const token = SUPPORTED_TOKENS[tokenSymbol];
      const response = await fetch(
        "https://starknet-mainnet.public.blastapi.io",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "starknet_call",
            params: [
              {
                contract_address: token.address,
                entry_point_selector:
                  "0x2e4263afad30923c891518314c3c95dbe830a16874e8abc5777a9a20b54c76e", // balanceOf selector
                calldata: [wallet.address],
              },
              "latest",
            ],
            id: 1,
          }),
        }
      );

      const data = await response.json();

      if (data.result && data.result.length > 0) {
        // Convert from smallest unit to token amount
        const balanceWei = BigInt(data.result[0]);
        const balanceToken = Number(balanceWei) / Math.pow(10, token.decimals);
        // Show 5 decimals for USDC/USDT, 4 for STRK/ETH, 8 for WBTC
        return balanceToken.toFixed(token.decimals === 18 ? 4 : token.decimals === 6 ? 5 : 8);
      }
      return "0";
    } catch (error) {
      return "0";
    }
  };

  // Function to fetch all balances
  const fetchAllBalances = async () => {
    if (!wallet?.address) return;

    setIsLoadingBalance(true);
    try {
      const newBalances: Record<string, string> = {};
      
      // Fetch balances for all supported tokens
      for (const symbol of Object.keys(SUPPORTED_TOKENS) as TokenSymbol[]) {
        const balance = await fetchTokenBalance(symbol);
        newBalances[symbol] = balance || "0";
      }
      
      setBalances(newBalances);
    } catch (error) {
      toast({
        title: "Balance Fetch Failed",
        description: "Could not fetch wallet balances. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingBalance(false);
    }
  };


  // Fetch balances when wallet is connected
  useEffect(() => {
    fetchAllBalances();
  }, [wallet?.address]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const handleSendToken = async () => {
    if (!isConnected || !wallet || !walletPin) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!sendAmount || !recipientAddress) {
      toast({
        title: "Missing Information",
        description: "Please enter amount and recipient address",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const bearerToken = await getToken({ template: "giveawayapp" });
      if (!bearerToken) {
        throw new Error("Failed to get authentication token");
      }

      // Get selected token info
      const token = SUPPORTED_TOKENS[selectedToken];
      
      // Convert amount to smallest unit based on token decimals
      const amountInSmallestUnit = BigInt(
        Math.floor(parseFloat(sendAmount) * Math.pow(10, token.decimals))
      ).toString();
      
      const result = await callAnyContractAsync({
        params: {
          encryptKey: walletPin,
          wallet: wallet,
          contractAddress: token.address,
          calls: [{
            contractAddress: token.address,
            entrypoint: "transfer",
            calldata: [
              recipientAddress,      // recipient
              amountInSmallestUnit,  // amount low
              "0"                    // amount high (0 for amounts < 2^128)
            ],
          }],
        },
        bearerToken: bearerToken,
      });

      toast({
        title: "Success!",
        description: `Sent ${sendAmount} ${selectedToken} to ${recipientAddress.slice(
          0,
          6
        )}...${recipientAddress.slice(-4)}`,
      });

      setSendAmount("");
      setRecipientAddress("");

      // Refresh balance after successful transfer
      setTimeout(() => {
        fetchAllBalances();
      }, 2000); // Wait 2 seconds for transaction to be processed
    } catch (error: any) {

      // Extract more detailed error message
      let errorMessage = error.message || "Failed to send tokens";
      
      // Check for specific error types
      if (errorMessage.includes("Decryption failed") || errorMessage.includes("decrypt")) {
        errorMessage =
          "Wallet decryption failed. Please disconnect and reconnect your wallet with the correct PIN.";
      } else if (errorMessage.includes("insufficient") || errorMessage.includes("balance")) {
        errorMessage =
          `Insufficient balance. You need ${sendAmount} ${selectedToken} plus gas fees. Current balance: ${balances[selectedToken] || "0"} ${selectedToken}.`;
      } else if (errorMessage.includes("gas")) {
        errorMessage =
          "Insufficient gas fees. You need ETH/STRK for gas. Try a smaller amount or add more funds.";
      } else if (errorMessage.includes("nonce")) {
        errorMessage =
          "Nonce error. Please disconnect and reconnect your wallet.";
      } else if (errorMessage.includes("execution")) {
        errorMessage =
          `Transaction failed. This might be due to insufficient gas fees or network issues. Balance: ${balances[selectedToken] || "0"} ${selectedToken}, Sending: ${sendAmount} ${selectedToken}.`;
      } else if (errorMessage.includes("recipient") || errorMessage.includes("address")) {
        errorMessage =
          "Invalid recipient address. Please check the address and try again.";
      }

      toast({
        title: "Transfer Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!isConnected || !wallet) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet Not Connected
              </CardTitle>
              <CardDescription>
                Please connect your wallet to access wallet management features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => (window.location.href = "/")}
              >
                Go to Home
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Wallet className="h-8 w-8" />
              Wallet Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your Starknet wallet and send tokens
            </p>
          </div>

          {/* Wallet Overview Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Wallet Overview</CardTitle>
              <CardDescription>Your wallet details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Balance Display */}
              <div className="space-y-2">
                <Label>Balances</Label>
                {isLoadingBalance ? (
                  <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-lg text-muted-foreground">
                        Loading balances...
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {Object.entries(SUPPORTED_TOKENS).map(([symbol, token]) => (
                      <div
                        key={symbol}
                        className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{token.icon}</span>
                            <div>
                              <div className="font-semibold text-foreground">
                                {token.symbol}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {token.name}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-foreground">
                              {balances[symbol] || "0"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {symbol}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Note: Balance updates may take a few moments to reflect
                  on-chain
                </p>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label>Wallet Address</Label>
                {wallet?.address ? (
                  <div className="flex gap-2">
                    <Input
                      value={wallet.address}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(wallet.address || "", "Address")
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="text-sm text-yellow-600 dark:text-yellow-400">
                      Wallet address not available. Try disconnecting and
                      reconnecting your wallet.
                    </div>
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-500 mb-1">
                      Wallet Information
                    </div>
                    <div className="text-muted-foreground">
                      This is your Chipi wallet managed by Gigi Pay. You can
                      send and receive STRK, USDC, USDT, ETH, and WBTC tokens using this wallet.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Send/Receive */}
          <Tabs defaultValue="send" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="send">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Send
              </TabsTrigger>
              <TabsTrigger value="receive">
                <ArrowDownLeft className="h-4 w-4 mr-2" />
                Receive
              </TabsTrigger>
            </TabsList>

            {/* Send Tab */}
            <TabsContent value="send">
              <Card>
                <CardHeader>
                  <CardTitle>Send Tokens</CardTitle>
                  <CardDescription>
                    Transfer tokens to another wallet address
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="token">Token</Label>
                    <Select
                      value={selectedToken}
                      onValueChange={(value) => setSelectedToken(value as TokenSymbol)}
                    >
                      <SelectTrigger id="token">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(SUPPORTED_TOKENS).map(([symbol, token]) => (
                          <SelectItem key={symbol} value={symbol}>
                            <div className="flex items-center gap-2">
                              <span>{token.icon}</span>
                              <span>{token.symbol}</span>
                              <span className="text-xs text-muted-foreground">
                                (Balance: {balances[symbol] || "0"})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input
                      id="recipient"
                      placeholder="0x..."
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ({selectedToken})</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                    <p className="text-xs text-muted-foreground">
                      Available: {balances[selectedToken] || "0"} {selectedToken}
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleSendToken}
                    disabled={isSending || !sendAmount || !recipientAddress}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Tokens
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Receive Tab */}
            <TabsContent value="receive">
              <Card>
                <CardHeader>
                  <CardTitle>Receive STRK Tokens</CardTitle>
                  <CardDescription>
                    Share your wallet address to receive tokens
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Your Wallet Address</Label>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="font-mono text-sm break-all mb-3">
                        {wallet.address}
                      </div>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(wallet?.address || "", "Address")
                        }
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Address
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <div className="text-sm">
                        <div className="font-medium text-blue-500 mb-1">
                          How to receive tokens
                        </div>
                        <div className="text-muted-foreground">
                          Share this address with the sender. They can send STRK
                          tokens to this address on Starknet.
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
