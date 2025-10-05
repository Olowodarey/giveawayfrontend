/**
 * Convert STRK amount to u256 format (18 decimals)
 */
export function strkToU256(amount: string): { low: string; high: string } {
  const amountInWei = BigInt(Number.parseFloat(amount) * 10 ** 18);
  const low = (
    amountInWei & BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
  ).toString();
  const high = (amountInWei >> BigInt(128)).toString();
  return { low, high };
}

/**
 * Convert u256 format back to STRK amount
 */
export function u256ToStrk(low: string, high: string): string {
  const amountInWei = (BigInt(high) << BigInt(128)) | BigInt(low);
  const amount = Number(amountInWei) / 10 ** 18;
  return amount.toFixed(6);
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
