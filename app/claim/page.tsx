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
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/footer";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";
import { useCallAnyContract } from "@chipi-stack/nextjs";
import { codeToFelt252, codeToFelt, u256ToStrk } from "@/lib/contract-utils";
import { GIVEAWAY_CONTRACT_ADDRESS } from "@/lib/contract-config";
import { useWallet, useWalletPin } from "@/contexts/wallet-context";
import { SocialShare } from "@/components/social-share";
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

      // Extract prize amount from transaction events
      let amount = "0";
      try {
        // Log the entire result to see structure
        console.log("=== FULL TRANSACTION RESULT ===");
        console.log("Result keys:", Object.keys(result || {}));
        console.log("Full result:", JSON.stringify(result, null, 2));
        
        // Look for PrizeClaimed event in the transaction
        const events = (result as any)?.events || [];
        console.log("=== EVENTS ===");
        console.log("Number of events:", events.length);
        console.log("Transaction events:", JSON.stringify(events, null, 2));
        
        // Find the PrizeClaimed event from the giveaway contract
        const prizeClaimedEvent = events.find((event: any) => 
          event.from_address === GIVEAWAY_CONTRACT_ADDRESS ||
          (event.keys && event.keys.some((key: string) => 
            key.toLowerCase().includes('prizeclaimed')
          ))
        );
        
        console.log("=== PRIZE CLAIMED EVENT ===");
        console.log("PrizeClaimed event found:", !!prizeClaimedEvent);
        console.log("PrizeClaimed event:", JSON.stringify(prizeClaimedEvent, null, 2));
        
        if (prizeClaimedEvent && prizeClaimedEvent.data && prizeClaimedEvent.data.length >= 2) {
          // Event structure: [giveaway_id, code_hash, winner_address, amount_low, amount_high]
          // Amount is the last 2 elements (u256 = low + high)
          const data = prizeClaimedEvent.data;
          
          console.log("Full event data:", data);
          console.log("Event data length:", data.length);
          
          // The amount should be the last 2 elements
          const amountLow = data[data.length - 2];
          const amountHigh = data[data.length - 1];
          
          console.log("Amount low (raw):", amountLow, "Type:", typeof amountLow);
          console.log("Amount high (raw):", amountHigh, "Type:", typeof amountHigh);
          
          // Use utility function to convert u256 to STRK
          amount = u256ToStrk(amountLow, amountHigh);
          
          console.log("Final extracted amount:", amount, "STRK");
          
          // Fallback if amount is still "0" but we have data
          if (amount === "0" && (amountLow || amountHigh)) {
            console.warn("Amount parsed as 0 but data exists, trying alternative parsing");
            // Try parsing the entire data array
            console.log("Trying alternative indices...");
            for (let i = 0; i < data.length - 1; i++) {
              const testAmount = u256ToStrk(data[i], data[i + 1]);
              console.log(`Testing indices [${i}, ${i+1}]:`, testAmount);
              if (testAmount !== "0" && parseFloat(testAmount) > 0) {
                amount = testAmount;
                console.log("Found non-zero amount at indices:", i, i+1);
                break;
              }
            }
          }
        } else {
          console.warn("PrizeClaimed event not found or invalid format");
          console.log("Available events:", events.map((e: any) => ({
            from: e.from_address,
            keys: e.keys,
            dataLength: e.data?.length
          })));
          
          // Last resort: try all events
          console.log("=== TRYING ALL EVENTS ===");
          for (const event of events) {
            if (event.data && event.data.length >= 2) {
              console.log("Checking event from:", event.from_address);
              for (let i = 0; i < event.data.length - 1; i++) {
                const testAmount = u256ToStrk(event.data[i], event.data[i + 1]);
                if (testAmount !== "0" && parseFloat(testAmount) > 0) {
                  console.log(`Found amount in event: ${testAmount} at indices [${i}, ${i+1}]`);
                  amount = testAmount;
                  break;
                }
              }
              if (amount !== "0") break;
            }
          }
        }
      } catch (parseError) {
        console.error("Error parsing prize amount:", parseError);
        amount = "0"; // Show 0 on error
      }

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
      console.log("Full error object:", JSON.stringify(error, null, 2));

      // Convert error to string for checking
      const errorString = JSON.stringify(error).toLowerCase();
      const errorMessage = (error.message || "").toLowerCase();

      // Check if it's an invalid giveaway/code error from the contract FIRST
      // This should be checked before password errors because contract errors
      // can sometimes contain the word "failed" which might be confused with decryption
      const isInvalidCode =
        errorMessage.includes("invalid_code") ||
        errorMessage.includes("prize_already_claimed") ||
        errorMessage.includes("giveaway not found") ||
        errorMessage.includes("giveaway does not exist") ||
        errorMessage.includes("code not found") ||
        errorMessage.includes("execution reverted") ||
        errorMessage.includes("contract error") ||
        errorMessage.includes("entrypoint") ||
        errorMessage.includes("entry point") ||
        errorMessage.includes("assert") ||
        errorString.includes("invalid_code") ||
        errorString.includes("prize_already_claimed") ||
        errorString.includes("execution_error") ||
        errorString.includes("transaction_execution_error") ||
        errorString.includes("contract_error");

      if (isInvalidCode) {
        setClaimState("invalid");
        
        // Check if it's specifically an "already claimed" error
        const isAlreadyClaimed = 
          errorMessage.includes("prize_already_claimed") ||
          errorMessage.includes("already claimed") ||
          errorString.includes("prize_already_claimed");
        
        toast({
          title: "Invalid Code or Giveaway",
          description: isAlreadyClaimed
            ? "This prize has already been claimed. Each code can only be used once per giveaway. Please try a different code."
            : "This giveaway name or claim code doesn't exist, or has already been claimed. Please verify the details and try again.",
          variant: "destructive",
        });
        return;
      }

      // Check if it's a decryption/password error (only if not a contract error)
      if (
        (errorMessage.includes("decryption failed") ||
          errorMessage.includes("decrypt") ||
          errorMessage.includes("unexpected value failed")) &&
        !errorMessage.includes("contract") &&
        !errorMessage.includes("execution")
      ) {
        toast({
          title: "Wrong Password",
          description:
            "The password you entered is incorrect. Please try again with the correct wallet password.",
          variant: "destructive",
        });
        return;
      }

      // Generic error
      toast({
        title: "Claim Failed",
        description:
          error.message ||
          "Failed to claim prize. Please check your giveaway name and code.",
        variant: "destructive",
      });
    } finally {
      setIsClaiming(false);
    }
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
                <CardTitle className="text-2xl">Invalid Code or Giveaway</CardTitle>
                <CardDescription>
                  This giveaway or code doesn't exist, or the prize has already been claimed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 space-y-2">
                  <p className="text-sm text-center text-foreground">
                    <strong>Giveaway:</strong>{" "}
                    <span className="font-mono font-semibold">{giveawayName}</span>
                  </p>
                  <p className="text-sm text-center text-foreground">
                    <strong>Code:</strong>{" "}
                    <span className="font-mono font-semibold">{claimCode}</span>
                  </p>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    Please verify:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• The giveaway name is spelled correctly</li>
                    <li>• The claim code hasn't been used already</li>
                    <li>• <strong>Each code can only be claimed once</strong></li>
                    <li>• The giveaway exists on-chain</li>
                  </ul>
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
                  <SocialShare
                    title={`I Won ${prizeAmount} STRK from ${giveawayName}!`}
                    text={`🎊 I just won ${prizeAmount} STRK from the "${giveawayName}" mystery giveaway on StarkGive! 🎉

The suspense was real! I had no idea how much I'd win until I claimed! 😱

Try your luck at StarkGive - where every prize is a surprise! 🎁

#StarkGive #Starknet #Winner #Crypto`}
                    url="https://starkgive.app/claim"
                    hashtags={["StarkGive", "Starknet", "Winner", "Crypto"]}
                    variant="button"
                    size="lg"
                    className="w-full"
                  />
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
              <li>• Follow creators on social media who run giveaways</li>
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
