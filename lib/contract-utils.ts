/**
 * Convert STRK amount to u256 format (18 decimals)
 */
export function strkToU256(amount: string): { low: string; high: string } {
  // Convert STRK to wei (multiply by 10^18)
  const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e18));

  // Split into low and high parts (each 128 bits)
  const low = amountInWei & ((BigInt(1) << BigInt(128)) - BigInt(1));
  const high = amountInWei >> BigInt(128);

  return {
    low: low.toString(),
    high: high.toString(),
  };
}

/**
 * Convert u256 (low, high) back to STRK amount
 */
export function u256ToStrk(low: string | bigint, high: string | bigint): string {
  try {
    // Handle hex strings (0x...) and decimal strings
    let lowBigInt: bigint;
    let highBigInt: bigint;
    
    if (typeof low === 'string') {
      lowBigInt = low.startsWith('0x') ? BigInt(low) : BigInt(low);
    } else {
      lowBigInt = low;
    }
    
    if (typeof high === 'string') {
      highBigInt = high.startsWith('0x') ? BigInt(high) : BigInt(high);
    } else {
      highBigInt = high;
    }
    
    console.log("u256ToStrk - Low:", lowBigInt.toString());
    console.log("u256ToStrk - High:", highBigInt.toString());
    
    // Combine low and high parts
    const totalWei = lowBigInt + (highBigInt << BigInt(128));
    console.log("u256ToStrk - Total Wei:", totalWei.toString());
    
    // Convert from wei (10^18) to STRK using BigInt for precision
    // Divide by 10^18 while maintaining precision
    const divisor = BigInt(1000000000000000000); // 10^18
    const wholePart = totalWei / divisor;
    const remainder = totalWei % divisor;
    
    // Convert to decimal string
    const wholeStr = wholePart.toString();
    const remainderStr = remainder.toString().padStart(18, '0');
    
    // Combine and format
    let result = wholeStr + '.' + remainderStr;
    
    // Remove trailing zeros but keep at least 2 decimal places for small amounts
    result = result.replace(/(\.\d*?)0+$/, '$1');
    if (result.endsWith('.')) {
      result = result.slice(0, -1);
    }
    
    // If the amount is very small, show more decimals
    if (parseFloat(result) < 0.01 && parseFloat(result) > 0) {
      // Keep up to 6 significant decimals for small amounts
      const match = result.match(/^0\.0*[1-9]\d{0,5}/);
      result = match ? match[0] : result;
    }
    
    console.log("u256ToStrk - Result:", result, "STRK");
    
    return result || "0";
  } catch (error) {
    console.error("Error converting u256 to STRK:", error, "Low:", low, "High:", high);
    return "0";
  }
}

/**
 * Convert claim code to felt252 format (Cairo short string encoding)
 */
export function codeToFelt(code: string): string {
  // Convert string to felt252 (short string encoding)
  // Cairo short strings are ASCII encoded directly as felt252
  let felt252Value = BigInt(0);
  for (let i = 0; i < code.length && i < 31; i++) {
    felt252Value = felt252Value * BigInt(256) + BigInt(code.charCodeAt(i));
  }
  return '0x' + felt252Value.toString(16);
}

/**
 * Hash claim codes using Poseidon hash via server-side API
 * The contract uses: poseidon_hash_span(array![code].span())
 * We need to compute this hash to store in the contract
 */
export async function hashClaimCodes(codes: string[]): Promise<string[]> {
  try {
    const response = await fetch('/api/hash-codes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ codes }),
    })

    if (!response.ok) {
      throw new Error('Failed to hash codes')
    }

    const { hashedCodes } = await response.json()
    return hashedCodes
  } catch (error) {
    console.error('Failed to hash codes:', error)
    throw error
  }
}

/**
 * Generate random claim codes
 */
export function generateClaimCodes(count: number): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomPart = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
    codes.push(`STRK-${randomPart}`);
  }
  return codes;
}

/**
 * Format contract address to ensure it's valid
 */
export function formatContractAddress(address: string): string {
  if (!address.startsWith("0x")) {
    return `0x${address}`;
  }
  return address;
}

/**
 * Convert claim code to felt252 format for contract
 */
export function codeToFelt252(code: string): string {
  // Convert string to hex representation
  const hex = Buffer.from(code, "utf-8").toString("hex");
  return `0x${hex}`;
}

/**
 * Convert felt252 back to string (Cairo short string encoding)
 */
export function feltToString(felt: any): string {
  try {
    if (!felt) return '';
    
    // Convert felt to BigInt
    let feltBigInt: bigint;
    if (typeof felt === 'bigint') {
      feltBigInt = felt;
    } else if (typeof felt === 'string') {
      feltBigInt = BigInt(felt);
    } else if (typeof felt === 'object' && felt.toString) {
      feltBigInt = BigInt(felt.toString());
    } else {
      feltBigInt = BigInt(felt);
    }
    
    // If it's 0, return empty string
    if (feltBigInt === BigInt(0)) return '';
    
    // Convert BigInt to hex string
    let hexStr = feltBigInt.toString(16);
    
    // Pad to even length
    if (hexStr.length % 2 !== 0) {
      hexStr = '0' + hexStr;
    }
    
    // Decode hex to ASCII string
    let result = '';
    for (let i = 0; i < hexStr.length; i += 2) {
      const byte = parseInt(hexStr.substring(i, i + 2), 16);
      if (byte !== 0) {
        result += String.fromCharCode(byte);
      }
    }
    
    return result.trim() || feltBigInt.toString();
  } catch (error) {
    console.error('Error converting felt to string:', error, felt);
    return String(felt);
  }
}
