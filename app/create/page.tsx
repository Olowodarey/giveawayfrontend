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
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Download,
  Twitter,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/footer";
import { useCallAnyContract, useApprove } from "@chipi-stack/nextjs";
import { hashClaimCodes, strkToU256, codeToFelt } from "@/lib/contract-utils";
import {
  GIVEAWAY_CONTRACT_ADDRESS,
  STRK_TOKEN_ADDRESS,
} from "@/lib/contract-config";
import { useWallet, useWalletPin } from "@/contexts/wallet-context";
import { useAuth } from "@clerk/nextjs";

interface Winner {
  id: string;
  code: string;
  amount: string;
}

interface GiveawayData {
  totalPrize: string;
  expiryHours: string;
}

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<GiveawayData>({
    totalPrize: "",
    expiryHours: "24",
  });
  const [winners, setWinners] = useState<Winner[]>([
    { id: "1", code: "", amount: "" },
  ]);
  const [isCreating, setIsCreating] = useState(false);

  const { toast } = useToast();
  const { wallet, isConnected } = useWallet();
  const walletPin = useWalletPin();
  const { getToken } = useAuth();
  const { callAnyContractAsync, isLoading: isCallingContract } =
    useCallAnyContract();
  const { approveAsync, isLoading: isApproving } = useApprove();

  const handleInputChange = (field: keyof GiveawayData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addWinner = () => {
    const newId = (
      Math.max(...winners.map((w) => parseInt(w.id)), 0) + 1
    ).toString();
    setWinners([...winners, { id: newId, code: "", amount: "" }]);
  };

  const removeWinner = (id: string) => {
    if (winners.length > 1) {
      setWinners(winners.filter((w) => w.id !== id));
    }
  };

  const updateWinner = (id: string, field: keyof Winner, value: string) => {
    setWinners(
      winners.map((w) => (w.id === id ? { ...w, [field]: value } : w))
    );
  };

  const calculateTotalPrizes = () => {
    return winners.reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0);
  };

  const validateForm = () => {
    if (!formData.totalPrize || !formData.expiryHours) {
      toast({
        title: "Missing Information",
        description: "Please fill in total prize and expiry time",
        variant: "destructive",
      });
      return false;
    }

    if (winners.some((w) => !w.code || !w.amount)) {
      toast({
        title: "Incomplete Winners",
        description: "Please fill in all winner codes and amounts",
        variant: "destructive",
      });
      return false;
    }

    const totalPrize = parseFloat(formData.totalPrize);
    const totalPrizes = calculateTotalPrizes();

    if (Math.abs(totalPrize - totalPrizes) > 0.01) {
      toast({
        title: "Amount Mismatch",
        description: `Total prizes (${totalPrizes} STRK) must equal total prize pool (${totalPrize} STRK)`,
        variant: "destructive",
      });
      return false;
    }

    // Check for duplicate codes
    const codes = winners.map((w) => w.code);
    const uniqueCodes = new Set(codes);
    if (codes.length !== uniqueCodes.size) {
      toast({
        title: "Duplicate Codes",
        description: "Each winner must have a unique claim code",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!validateForm()) {
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Proceed to create giveaway
      handleCreateGiveaway();
    }
  };

  const handleCreateGiveaway = async () => {
    // Check if wallet is connected
    if (!isConnected || !wallet) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    console.log('Wallet PIN:', walletPin ? 'Present' : 'Missing')
    console.log('Wallet:', wallet)
    
    if (!walletPin) {
      toast({
        title: "PIN Not Found",
        description: "Please reconnect your wallet to set up your PIN",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const bearerToken = await getToken({ template: "giveawayapp" });
      if (!bearerToken) {
        throw new Error("Failed to get authentication token");
      }
      
      console.log('Bearer token obtained')

      // Hash codes using Poseidon via server-side API (same as contract does when claiming)
      const codes = winners.map((w) => w.code);
      const codeHashes = await hashClaimCodes(codes);

      console.log("Codes:", codes);
      console.log("Hashed codes:", codeHashes);

      // Convert prize amounts to u256 format
      const prizeAmounts = winners.map((w) => {
        const u256Amount = strkToU256(w.amount);
        console.log(`Converting ${w.amount} STRK to u256:`, u256Amount);
        return [u256Amount.low, u256Amount.high];
      });

      console.log("Prize amounts (u256) array:", prizeAmounts);
      console.log("Prize amounts flattened:", prizeAmounts.flat());

      // Convert total amount to u256
      const totalU256 = strkToU256(formData.totalPrize);
      const totalAmount = formData.totalPrize;

      console.log("Total amount (u256):", totalU256);
      console.log("Expiry hours:", formData.expiryHours);

      // Approve STRK tokens
      toast({
        title: "Approving Tokens",
        description: "Approving STRK for giveaway contract...",
      });

      try {
        console.log('Attempting to approve tokens with PIN...')
        await approveAsync({
          params: {
            encryptKey: walletPin,
            wallet: wallet,
            contractAddress: STRK_TOKEN_ADDRESS,
            spender: GIVEAWAY_CONTRACT_ADDRESS,
            amount: totalAmount,
            decimals: 18,
          },
          bearerToken: bearerToken,
        });
        console.log('Token approval successful')
      } catch (approvalError: any) {
        console.error('Approval error:', approvalError)
        throw new Error(`Token approval failed: ${approvalError.message}. Please disconnect and reconnect your wallet.`)
      }

      // Create giveaway on contract
      toast({
        title: "Creating Giveaway",
        description: "Depositing STRK and creating giveaway...",
      });

      const calldata = [
        totalU256.low,
        totalU256.high,
        codeHashes.length.toString(),
        ...codeHashes,
        prizeAmounts.length.toString(),
        ...prizeAmounts.flat(),
        formData.expiryHours,
      ]
      
      console.log('=== CALLDATA DEBUG ===')
      console.log('Calldata being sent:', calldata)
      console.log('Calldata length:', calldata.length)
      console.log('Calldata breakdown:', {
        totalLow: totalU256.low,
        totalHigh: totalU256.high,
        numCodes: codeHashes.length,
        codes: codeHashes,
        numPrizes: prizeAmounts.length,
        prizes: prizeAmounts.flat(),
        expiry: formData.expiryHours
      })
      console.log('Expected format: [total_low, total_high, num_codes, ...codes, num_prizes, ...prizes_flat, expiry]')
      console.log('Contract address:', GIVEAWAY_CONTRACT_ADDRESS)
      console.log('=== END DEBUG ===')

      const result = await callAnyContractAsync({
        params: {
          encryptKey: walletPin,
          wallet: wallet,
          contractAddress: GIVEAWAY_CONTRACT_ADDRESS,
          calls: [
            {
              contractAddress: GIVEAWAY_CONTRACT_ADDRESS,
              entrypoint: "create_giveaway",
              calldata,
            },
          ],
        },
        bearerToken: bearerToken,
      });

      toast({
        title: "Success!",
        description: "Giveaway created successfully",
      });

      setStep(3);
    } catch (error: any) {
      console.error("Error creating giveaway:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create giveaway",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  const downloadCSV = () => {
    const csv = [
      "Code,Amount\n",
      ...winners.map((w) => `${w.code},${w.amount}\n`),
    ].join("");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "giveaway-codes.csv";
    a.click();
    toast({
      title: "Downloaded!",
      description: "Codes exported to CSV",
    });
  };

  const getTweetTemplate = () => {
    return `🎁 Mystery Giveaway Alert!\n\nUse code [CODE] at starkgive.app/claim to win STRK!\n\nAmount is a surprise 👀\n\n#Starknet #Giveaway`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      s < step
                        ? "bg-success text-success-foreground"
                        : s === step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s < step ? <Check className="h-4 w-4" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`h-1 flex-1 mx-2 rounded transition-colors ${
                        s < step ? "bg-success" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground px-1">
              <span>Details</span>
              <span>Preview</span>
              <span>Codes</span>
            </div>
          </div>

          {/* Step 1: Giveaway Details */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Giveaway Details</CardTitle>
                <CardDescription>
                  Set up your giveaway with custom codes and amounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="totalPrize">Total Prize Pool (STRK)</Label>
                  <Input
                    id="totalPrize"
                    type="number"
                    placeholder="100"
                    value={formData.totalPrize}
                    onChange={(e) =>
                      handleInputChange("totalPrize", e.target.value)
                    }
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryHours">
                    Expiry Time (hours from now)
                  </Label>
                  <Input
                    id="expiryHours"
                    type="number"
                    placeholder="24"
                    value={formData.expiryHours}
                    onChange={(e) =>
                      handleInputChange("expiryHours", e.target.value)
                    }
                    min="1"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Winners & Codes</Label>
                    <Button onClick={addWinner} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Winner
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {winners.map((winner, index) => (
                      <div
                        key={winner.id}
                        className="flex gap-2 items-start p-3 rounded-lg border border-border"
                      >
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder={`Code (e.g., WINNER${index + 1})`}
                            value={winner.code}
                            onChange={(e) =>
                              updateWinner(winner.id, "code", e.target.value)
                            }
                          />
                          <Input
                            type="number"
                            placeholder="Amount (STRK)"
                            value={winner.amount}
                            onChange={(e) =>
                              updateWinner(winner.id, "amount", e.target.value)
                            }
                            min="0"
                            step="0.01"
                          />
                        </div>
                        {winners.length > 1 && (
                          <Button
                            onClick={() => removeWinner(winner.id)}
                            size="icon"
                            variant="ghost"
                            className="mt-1"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Winners:
                      </span>
                      <span className="font-medium">{winners.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Prizes:
                      </span>
                      <span className="font-medium">
                        {calculateTotalPrizes().toFixed(2)} STRK
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Prize Pool:</span>
                      <span className="font-medium">
                        {formData.totalPrize || "0"} STRK
                      </span>
                    </div>
                    {formData.totalPrize &&
                      Math.abs(
                        parseFloat(formData.totalPrize) - calculateTotalPrizes()
                      ) > 0.01 && (
                        <div className="text-xs text-destructive mt-2">
                          ⚠️ Total prizes must equal prize pool
                        </div>
                      )}
                  </div>
                </div>

                <Button onClick={handleNextStep} className="w-full" size="lg">
                  Next: Preview
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Preview & Confirm */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Preview & Confirm</CardTitle>
                <CardDescription>
                  Review your giveaway details before depositing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Total Prize Pool
                    </span>
                    <span className="font-semibold text-foreground">
                      {formData.totalPrize} STRK
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Number of Winners
                    </span>
                    <span className="font-semibold text-foreground">
                      {winners.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Expires In</span>
                    <span className="font-semibold text-foreground">
                      {formData.expiryHours} hours
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    Winners & Prizes
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto p-3 rounded-lg border border-border">
                    {winners.map((winner, i) => (
                      <div
                        key={winner.id}
                        className="flex justify-between items-center text-sm p-2 rounded bg-muted/30"
                      >
                        <span className="text-muted-foreground font-mono">
                          {winner.code}
                        </span>
                        <span className="font-medium text-foreground">
                          {winner.amount} STRK
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    className="flex-1"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Deposit STRK & Create Giveaway"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-success" />
                  Giveaway Created Successfully!
                </CardTitle>
                <CardDescription>
                  Share these codes with your community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3 max-h-64 overflow-y-auto p-3 rounded-lg border border-border">
                  {winners.map((winner) => (
                    <div
                      key={winner.id}
                      className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-mono text-sm text-foreground">
                          {winner.code}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {winner.amount} STRK
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(winner.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={downloadCSV}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">
                    Tweet Template
                  </h4>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                      {getTweetTemplate()}
                    </p>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(getTweetTemplate())}
                    variant="outline"
                    className="w-full"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Template
                  </Button>
                </div>

                <Button asChild className="w-full" size="lg">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      getTweetTemplate()
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="mr-2 h-4 w-4" />
                    Share on Twitter
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
