// Supported tokens on Starknet Mainnet
export const SUPPORTED_TOKENS = {
  STRK: {
    address: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    symbol: "STRK",
    name: "Starknet Token",
    decimals: 18,
    icon: "💎",
  },
  USDC: {
    address: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    icon: "💵",
  },
  USDT: {
    address: "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    icon: "💲",
  },
  ETH: {
    address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    icon: "Ξ",
  },
  WBTC: {
    address: "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    decimals: 8,
    icon: "₿",
  },
} as const;

export type TokenSymbol = keyof typeof SUPPORTED_TOKENS;

// Helper to get token by address
export function getTokenByAddress(address: string | any) {
  // Handle different address formats from Starknet
  let addressStr: string;
  
  if (typeof address === 'string') {
    addressStr = address;
  } else if (address && typeof address === 'object') {
    // If it's an object, try to get the string representation
    addressStr = address.toString ? address.toString() : String(address);
  } else {
    return undefined;
  }
  
  // Normalize address format (remove leading zeros, ensure 0x prefix)
  const normalizeAddress = (addr: string): string => {
    addr = addr.toLowerCase().trim();
    if (!addr.startsWith('0x')) {
      addr = '0x' + addr;
    }
    // Remove leading zeros after 0x but keep at least one digit
    addr = '0x' + addr.slice(2).replace(/^0+/, '') || '0';
    return addr;
  };
  
  const normalizedInput = normalizeAddress(addressStr);
  
  return Object.values(SUPPORTED_TOKENS).find((token) => {
    const normalizedToken = normalizeAddress(token.address);
    return normalizedToken === normalizedInput;
  });
}

// Helper to format token amount based on decimals
export function formatTokenAmount(amount: string, decimals: number): string {
  const num = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const wholePart = num / divisor;
  const fractionalPart = num % divisor;
  
  if (fractionalPart === BigInt(0)) {
    return wholePart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr.replace(/0+$/, '');
  
  return `${wholePart}.${trimmedFractional}`;
}

// Helper to convert user input to token amount (with decimals)
export function parseTokenAmount(amount: string, decimals: number): string {
  const parts = amount.split('.');
  const wholePart = parts[0] || '0';
  const fractionalPart = (parts[1] || '').padEnd(decimals, '0').slice(0, decimals);
  
  const fullAmount = wholePart + fractionalPart;
  return BigInt(fullAmount).toString();
}

// Helper to convert token amount to u256 (low, high)
export function tokenAmountToU256(amount: string): { low: string; high: string } {
  const amountBigInt = BigInt(amount);
  const low = amountBigInt & BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
  const high = amountBigInt >> BigInt(128);
  
  return {
    low: low.toString(),
    high: high.toString(),
  };
}
