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
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SocialShare } from "@/components/social-share";
import { Footer } from "@/components/footer";
import { useCallAnyContract, useApprove } from "@chipi-stack/nextjs";
import { hashClaimCodes, strkToU256, codeToFelt } from "@/lib/contract-utils";
import {
  GIVEAWAY_CONTRACT_ADDRESS,
  STRK_TOKEN_ADDRESS,
  GIVEAWAY_ABI,
} from "@/lib/contract-config";
import { SUPPORTED_TOKENS, type TokenSymbol, parseTokenAmount, tokenAmountToU256 } from "@/lib/token-config";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useWallet, useWalletPin } from "@/contexts/wallet-context";
import { useAuth } from "@clerk/nextjs";
import { Contract, RpcProvider } from "starknet";

interface Winner {
  id: string;
  code: string;
  amount: string;
}

interface GiveawayData {
  name: string;
  totalPrize: string;
  expiryHours: string;
  selectedToken: TokenSymbol;
}

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<GiveawayData>({
    name: "",
    totalPrize: "",
    expiryHours: "24",
    selectedToken: "STRK",
  });
  const [neverExpire, setNeverExpire] = useState(false);
  const [expiryValue, setExpiryValue] = useState("24");
  const [expiryUnit, setExpiryUnit] = useState<"hours" | "days" | "weeks">("hours");
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

  // Convert time value to hours based on unit
  const convertToHours = (value: string, unit: "hours" | "days" | "weeks"): number => {
    const numValue = parseFloat(value) || 0;
    switch (unit) {
      case "hours":
        return numValue;
      case "days":
        return numValue * 24;
      case "weeks":
        return numValue * 24 * 7;
      default:
        return numValue;
    }
  };

  // Get human-readable expiry description
  const getExpiryDescription = (value: string, unit: "hours" | "days" | "weeks"): string => {
    const numValue = parseFloat(value) || 0;
    if (numValue === 0) return "No expiry set";
    
    const hours = convertToHours(value, unit);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (unit === "hours") {
      if (hours < 24) {
        return `Expires in ${hours} hour${hours !== 1 ? 's' : ''}`;
      } else {
        return `Expires in ${days} day${days !== 1 ? 's' : ''} (${hours} hours)`;
      }
    } else if (unit === "days") {
      return `Expires in ${numValue} day${numValue !== 1 ? 's' : ''} (${hours} hours)`;
    } else {
      return `Expires in ${numValue} week${numValue !== 1 ? 's' : ''} (${hours} hours)`;
    }
  };

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
    if (!formData.name || !formData.totalPrize || !formData.expiryHours) {
      toast({
        title: "Missing Information",
        description:
          "Please fill in giveaway name, total prize and expiry time",
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
        description: `Total prizes (${totalPrizes} ${formData.selectedToken}) must equal total prize pool (${totalPrize} ${formData.selectedToken})`,
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

    // Verify contract addresses are loaded
    if (!GIVEAWAY_CONTRACT_ADDRESS || !STRK_TOKEN_ADDRESS) {
      toast({
        title: "Configuration Error",
        description: "Contract addresses not configured. Please check environment variables.",
        variant: "destructive",
      });
      return;
    }

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
      // Check if giveaway name already exists
      try {
        const provider = new RpcProvider({ nodeUrl: 'https://starknet-mainnet.public.blastapi.io' });
        const contract = new Contract(GIVEAWAY_ABI, GIVEAWAY_CONTRACT_ADDRESS, provider);
        const nameFelt = codeToFelt(formData.name);
        
        const existingId = await contract.get_giveaway_id_by_name(nameFelt);
        if (existingId && Number(existingId) > 0) {
          toast({
            title: "Name Already Exists",
            description: `A giveaway with the name "${formData.name}" already exists. Please choose a different name.`,
            variant: "destructive",
          });
          setIsCreating(false);
          return;
        }
      } catch (nameCheckError) {
        // If error is "Giveaway not found", that's good - name is available
      }

      const bearerToken = await getToken({ template: "giveawayapp" });
      if (!bearerToken) {
        throw new Error("Failed to get authentication token");
      }

      // Hash codes using Poseidon via server-side API (same as contract does when claiming)
      const codes = winners.map((w) => w.code);
      const codeHashes = await hashClaimCodes(codes);

      // Get selected token info
      const selectedToken = SUPPORTED_TOKENS[formData.selectedToken];
      const tokenAddress = selectedToken.address;
      const tokenDecimals = selectedToken.decimals;
      
      // Convert total amount to token's smallest unit (with decimals)
      const totalAmountWithDecimals = parseTokenAmount(formData.totalPrize, tokenDecimals);
      const totalU256 = tokenAmountToU256(totalAmountWithDecimals);
      const totalAmount = formData.totalPrize;

      // Approve tokens
      toast({
        title: "Approving Tokens",
        description: `Approving ${formData.selectedToken} for giveaway contract...`,
      });

      try {
        await approveAsync({
          params: {
            encryptKey: walletPin,
            wallet: wallet,
            contractAddress: tokenAddress,
            spender: GIVEAWAY_CONTRACT_ADDRESS,
            amount: totalAmount,
            decimals: tokenDecimals,
          },
          bearerToken: bearerToken,
        });
      } catch (approvalError: any) {
        throw new Error(
          `Token approval failed: ${approvalError.message}. Please disconnect and reconnect your wallet.`
        );
      }

      // Create giveaway on contract
      toast({
        title: "Creating Giveaway",
        description: `Depositing ${formData.selectedToken} and creating giveaway...`,
      });

      // Convert giveaway name to felt252
      const giveawayNameFelt = codeToFelt(formData.name);

      // Format prize amounts - flatten each u256 to [low, high]
      const prizeAmountsFlattened: string[] = [];
      winners.forEach((w) => {
        const amountWithDecimals = parseTokenAmount(w.amount, tokenDecimals);
        const u256Amount = tokenAmountToU256(amountWithDecimals);
        prizeAmountsFlattened.push(u256Amount.low);
        prizeAmountsFlattened.push(u256Amount.high);
      });

      // Build calldata manually with proper array formatting
      const calldata = [
        giveawayNameFelt,                    // name: felt252
        tokenAddress,                        // token_address: ContractAddress
        totalU256.low,                       // total_amount.low: u128
        totalU256.high,                      // total_amount.high: u128
        codeHashes.length.toString(),        // code_hashes array length
        ...codeHashes,                       // code_hashes array elements
        winners.length.toString(),           // prize_amounts array length (number of u256s)
        ...prizeAmountsFlattened,           // prize_amounts flattened (low, high, low, high, ...)
        formData.expiryHours,               // expiry_hours: u64
      ];

      // Retry logic for transaction execution
      let result;
      let lastError;
      const maxRetries = 3;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          if (attempt > 1) {
            toast({
              title: "Retrying...",
              description: `Attempt ${attempt}/${maxRetries}`,
            });
            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
          
          result = await callAnyContractAsync({
            params: {
              encryptKey: walletPin,
              wallet: wallet,
              contractAddress: GIVEAWAY_CONTRACT_ADDRESS,
              calls: [
                {
                  contractAddress: GIVEAWAY_CONTRACT_ADDRESS,
                  entrypoint: "create_giveaway",
                  calldata: calldata,
                },
              ],
            },
            bearerToken: bearerToken,
          });
          
          // Success! Break out of retry loop
          break;
        } catch (txError: any) {
          lastError = txError;
          
          // Check if it's a retryable error
          const errorMsg = txError.message?.toLowerCase() || '';
          const isRetryable = 
            errorMsg.includes('execution') ||
            errorMsg.includes('nonce') ||
            errorMsg.includes('timeout') ||
            errorMsg.includes('network');
          
          if (!isRetryable || attempt === maxRetries) {
            // Not retryable or last attempt - throw error
            throw txError;
          }
        }
      }

      toast({
        title: "Success!",
        description: "Giveaway created successfully",
      });

      setStep(3);
    } catch (error: any) {
      // Better error messages
      let errorMessage = "Failed to create giveaway";
      if (error.message?.includes("execution")) {
        errorMessage = "Transaction execution failed. This might be due to network issues. Please try again.";
      } else if (error.message?.includes("nonce")) {
        errorMessage = "Wallet nonce issue. Please disconnect and reconnect your wallet.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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
    return `🎉 ${formData.name} - Mystery Giveaway! 🎁

I'm giving away ${formData.totalPrize} STRK to ${winners.length} lucky winner${winners.length > 1 ? 's' : ''}!

💎 Prize amounts are HIDDEN until you claim!
⏰ Expires in ${formData.expiryHours} hours
🔗 Claim at: starkgive.app/claim

Use code [CODE] to claim your surprise prize! 🤫

#StarkGive #Starknet #Crypto #Giveaway`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex flex-col items-center flex-1">
                  <div className="flex items-center w-full">
                    {s > 1 && (
                      <div
                        className={`h-1 flex-1 rounded transition-colors ${
                          s <= step ? "bg-success" : "bg-muted"
                        }`}
                      />
                    )}
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        s < step
                          ? "bg-success text-success-foreground"
                          : s === step
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      } ${s === 1 ? "ml-0" : "mx-2"} ${s === 3 ? "mr-0" : ""}`}
                    >
                      {s < step ? <Check className="h-4 w-4" /> : s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`h-1 flex-1 rounded transition-colors ${
                          s < step ? "bg-success" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground mt-2">
                    {s === 1 ? "Setup" : s === 2 ? "Review" : "Complete"}
                  </span>
                </div>
              ))}
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
                  <Label htmlFor="name">Giveaway Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., Summer2024"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    maxLength={31}
                  />
                  <p className="text-xs text-muted-foreground">
                    A unique identifier for your giveaway (max 31 characters). Each giveaway must have a different name.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token">Token</Label>
                  <Select
                    value={formData.selectedToken}
                    onValueChange={(value) => handleInputChange("selectedToken", value as TokenSymbol)}
                  >
                    <SelectTrigger id="token">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SUPPORTED_TOKENS).map(([symbol, token]) => (
                        <SelectItem key={symbol} value={symbol}>
                          <div className="flex items-center gap-2">
                            <span>{token.icon}</span>
                            <span>{token.symbol}</span>
                            <span className="text-xs text-muted-foreground">- {token.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose which token to use for this giveaway
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalPrize">Total Prize Pool ({formData.selectedToken})</Label>
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

                <div className="space-y-3">
                  <Label htmlFor="expiryHours">
                    Expiry Time
                  </Label>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="neverExpire"
                      checked={neverExpire}
                      onCheckedChange={(checked) => {
                        setNeverExpire(checked as boolean);
                        if (checked) {
                          handleInputChange("expiryHours", "0");
                        } else {
                          // Convert current value back to hours
                          const hours = convertToHours(expiryValue, expiryUnit);
                          handleInputChange("expiryHours", hours.toString());
                        }
                      }}
                    />
                    <label
                      htmlFor="neverExpire"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Never Expire ♾️
                    </label>
                  </div>

                  {!neverExpire && (
                    <div className="flex gap-2">
                      <Input
                        id="expiryValue"
                        type="number"
                        placeholder="24"
                        value={expiryValue}
                        onChange={(e) => {
                          setExpiryValue(e.target.value);
                          const hours = convertToHours(e.target.value, expiryUnit);
                          handleInputChange("expiryHours", hours.toString());
                        }}
                        min="1"
                        className="flex-1"
                      />
                      <Select
                        value={expiryUnit}
                        onValueChange={(value: "hours" | "days" | "weeks") => {
                          setExpiryUnit(value);
                          const hours = convertToHours(expiryValue, value);
                          handleInputChange("expiryHours", hours.toString());
                        }}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="weeks">Weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    {neverExpire 
                      ? "This giveaway will never expire. You won't be able to reclaim funds."
                      : `${getExpiryDescription(expiryValue, expiryUnit)}. After expiry, you can reclaim unclaimed funds.`}
                  </p>
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
                            placeholder={`Amount (${formData.selectedToken})`}
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
                        {calculateTotalPrizes().toFixed(2)} {formData.selectedToken}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Prize Pool:</span>
                      <span className="font-medium">
                        {formData.totalPrize || "0"} {formData.selectedToken}
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
                    <span className="text-muted-foreground">Giveaway Name</span>
                    <span className="font-semibold text-foreground">
                      {formData.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Token</span>
                    <span className="font-semibold text-foreground">
                      {SUPPORTED_TOKENS[formData.selectedToken].icon} {formData.selectedToken}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Total Prize Pool
                    </span>
                    <span className="font-semibold text-foreground">
                      {formData.totalPrize} {formData.selectedToken}
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
                      {formData.expiryHours === "0" 
                        ? "Never ♾️" 
                        : (() => {
                            const hours = parseInt(formData.expiryHours);
                            if (hours < 24) {
                              return `${hours} hour${hours !== 1 ? 's' : ''}`;
                            } else if (hours % (24 * 7) === 0) {
                              const weeks = hours / (24 * 7);
                              return `${weeks} week${weeks !== 1 ? 's' : ''} (${hours} hours)`;
                            } else if (hours % 24 === 0) {
                              const days = hours / 24;
                              return `${days} day${days !== 1 ? 's' : ''} (${hours} hours)`;
                            } else {
                              const days = Math.floor(hours / 24);
                              const remainingHours = hours % 24;
                              return `${days}d ${remainingHours}h (${hours} hours)`;
                            }
                          })()
                      }
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
                          {winner.amount} {formData.selectedToken}
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
                      `Deposit ${formData.selectedToken} & Create Giveaway`
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
                    Share Template
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

                <SocialShare
                  title={`${formData.name} - Mystery Giveaway on StarkGive!`}
                  text={getTweetTemplate()}
                  url="https://starkgive.app/claim"
                  hashtags={["StarkGive", "Starknet", "Crypto", "Giveaway"]}
                  variant="button"
                  size="lg"
                  className="w-full"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
