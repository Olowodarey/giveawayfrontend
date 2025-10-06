"use client";

import { useState } from "react";
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
import {
  Gift,
  Sparkles,
  ExternalLink,
  Twitter,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/footer";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";
import { useCallAnyContract } from "@chipi-stack/nextjs";
import { codeToFelt252, codeToFelt } from "@/lib/contract-utils";
import { GIVEAWAY_CONTRACT_ADDRESS } from "@/lib/contract-config";
import { useWallet, useWalletPin } from "@/contexts/wallet-context";
import { useAuth } from "@clerk/nextjs";

type ClaimState = "initial" | "valid" | "invalid" | "claimed";

export default function ClaimPage() {
  const [claimCode, setClaimCode] = useState("");
  const [claimState, setClaimState] = useState<ClaimState>("initial");
  const [prizeAmount, setPrizeAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [giveawayName, setGiveawayName] = useState(""); // Giveaway name instead of ID

  const { toast } = useToast();
  const { width, height } = useWindowSize();
  const { wallet, isConnected } = useWallet();
  const walletPin = useWalletPin();
  const { getToken } = useAuth();
  const { callAnyContractAsync } = useCallAnyContract();

  const validateCode = () => {
    if (!giveawayName.trim()) {
      toast({
        title: "Missing Giveaway Name",
        description: "Please enter the giveaway name",
        variant: "destructive",
      });
      return;
    }

    if (!claimCode.trim()) {
      toast({
        title: "Missing Code",
        description: "Please enter a claim code",
        variant: "destructive",
      });
      return;
    }

    // For now, just mark as valid - actual validation happens on-chain
    setClaimState("valid");
  };

  const handleClaim = async () => {
    // Check if wallet is connected
    if (!isConnected || !wallet) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!walletPin) {
      toast({
        title: "PIN Not Found",
        description: "Please reconnect your wallet",
        variant: "destructive",
      });
    }

    setIsClaiming(true);

    try {
      // Get JWT token from Clerk using custom template
      const bearerToken = await getToken({ template: "giveawayapp" });
      if (!bearerToken) {
        throw new Error("Failed to get authentication token");
      }

      // Step 2: Convert giveaway name and claim code to felt252
      const nameFelt = codeToFelt(giveawayName);
      const codeFelt = codeToFelt252(claimCode);

      // Step 3: Call claim_prize on contract
      const result = await callAnyContractAsync({
        params: {
          encryptKey: walletPin,
          wallet: wallet,
          contractAddress: GIVEAWAY_CONTRACT_ADDRESS,
          calls: [
            {
              contractAddress: GIVEAWAY_CONTRACT_ADDRESS,
              entrypoint: "claim_prize",
              calldata: [
                nameFelt, // giveaway name (felt252)
                codeFelt, // code (felt252)
              ],
            },
          ],
        },
        bearerToken: bearerToken,
      });

      // Success! Extract transaction hash
      const hash =
        (result as any)?.transaction_hash || (result as any)?.txHash || "0x...";
      setTxHash(hash);

      // For demo, show a random amount (in production, query from contract)
      const amount = (Math.random() * 50 + 10).toFixed(2);
      setPrizeAmount(amount);

      setClaimState("claimed");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      toast({
        title: "Prize Claimed!",
        description: `You won ${amount} STRK!`,
      });
    } catch (error: any) {
      console.error("Error claiming prize:", error);

      // Check if it's an invalid code error
      if (
        error.message?.includes("INVALID_CODE") ||
        error.message?.includes("PRIZE_ALREADY_CLAIMED")
      ) {
        setClaimState("invalid");
      }

      toast({
        title: "Claim Failed",
        description:
          error.message ||
          "Failed to claim prize. The code may be invalid or already claimed.",
        variant: "destructive",
      });
    } finally {
      setIsClaiming(false);
    }
  };

  const shareOnTwitter = () => {
    const text = `I just won ${prizeAmount} STRK from a mystery giveaway on @StarkGive! 🎉\n\nCheck it out at starkgive.app`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="flex-1 py-8 md:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-lg">
          {/* Initial State */}
          {claimState === "initial" && (
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Gift className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl">Claim Your Prize</CardTitle>
                <CardDescription>
                  Enter your claim code to reveal your mystery prize
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="giveawayName">Giveaway Name</Label>
                  <Input
                    id="giveawayName"
                    type="text"
                    placeholder="e.g., MyGiveaway"
                    value={giveawayName}
                    onChange={(e) => setGiveawayName(e.target.value)}
                    className="text-center"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the giveaway name you want to claim from
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claimCode">Claim Code</Label>
                  <Input
                    id="claimCode"
                    placeholder="STRK-XXXXXXXX"
                    value={claimCode}
                    onChange={(e) => setClaimCode(e.target.value)}
                    className="font-mono text-center text-lg"
                  />
                </div>
                <Button onClick={validateCode} className="w-full" size="lg">
                  Validate Code
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Invalid Code State */}
          {claimState === "invalid" && (
            <Card className="border-destructive">
              <CardHeader className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-2xl">Invalid Code</CardTitle>
                <CardDescription>
                  This code is invalid or has already been claimed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-center text-foreground">
                    The code{" "}
                    <span className="font-mono font-semibold">{claimCode}</span>{" "}
                    could not be found or has already been used.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setClaimState("initial");
                    setGiveawayName("");
                    setClaimCode("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Try Another Code
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Valid Code State */}
          {claimState === "valid" && (
            <Card className="border-accent">
              <CardHeader className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 animate-pulse">
                  <Sparkles className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl">
                  Mystery Prize Available!
                </CardTitle>
                <CardDescription>
                  Connect your wallet to claim your surprise amount
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-lg bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20 text-center">
                  <div className="text-sm text-muted-foreground mb-2">
                    Prize Amount
                  </div>
                  <div className="text-5xl font-bold text-accent mb-2">???</div>
                  <div className="text-sm text-muted-foreground">STRK</div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleClaim}
                    className="w-full"
                    size="lg"
                    disabled={isClaiming}
                  >
                    {isClaiming
                      ? "Claiming..."
                      : isConnected
                      ? "Claim Prize"
                      : "Connect Wallet & Claim"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    No gas fees required - completely free to claim
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Claimed State */}
          {claimState === "claimed" && (
            <Card className="border-success">
              <CardHeader className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <Gift className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-2xl">Congratulations!</CardTitle>
                <CardDescription>
                  Your prize has been claimed successfully
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-lg bg-gradient-to-br from-success/10 to-accent/10 border border-success/20 text-center">
                  <div className="text-sm text-muted-foreground mb-2">
                    You Won
                  </div>
                  <div className="text-5xl font-bold text-success mb-2">
                    {prizeAmount}
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    STRK
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-sm text-muted-foreground">
                      Transaction
                    </span>
                    <a
                      href={`https://starkscan.co/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-accent hover:underline flex items-center gap-1 break-all text-right"
                    >
                      {txHash.substring(0, 10)}...
                      {txHash.substring(txHash.length - 8)}
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={shareOnTwitter} className="w-full" size="lg">
                    <Twitter className="mr-2 h-4 w-4" />
                    Share on Twitter
                  </Button>
                  <Button
                    onClick={() => {
                      setClaimState("initial");
                      setGiveawayName("");
                      setClaimCode("");
                      setPrizeAmount("");
                      setTxHash("");
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Claim Another Prize
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Section */}
          <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
            <h3 className="font-semibold text-foreground mb-2 text-sm">
              How to find claim codes
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1 leading-relaxed">
              <li>• Follow creators on Twitter who run giveaways</li>
              <li>• Look for posts containing claim codes</li>
              <li>• Enter the code here to claim your prize</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
