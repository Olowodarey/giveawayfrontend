import { NextRequest, NextResponse } from 'next/server'

// Mark this as a server-only module
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { codes } = await request.json()

    if (!codes || !Array.isArray(codes)) {
      return NextResponse.json(
        { error: 'Invalid request: codes array required' },
        { status: 400 }
      )
    }

    // Dynamically import starknet only on the server
    const { hash } = await import('starknet')

    // Convert each code to felt252 and hash with Poseidon
    const hashedCodes = codes.map((code: string) => {
      // Convert string to felt252 (short string encoding)
      let felt252Value = BigInt(0)
      for (let i = 0; i < code.length && i < 31; i++) {
        felt252Value = (felt252Value * BigInt(256)) + BigInt(code.charCodeAt(i))
      }
      const codeFelt = '0x' + felt252Value.toString(16)
      // Hash using Poseidon (same as contract)
      const hashed = hash.computePoseidonHashOnElements([codeFelt])
      return hashed
    })

    return NextResponse.json({ hashedCodes })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to hash codes', details: error.message },
      { status: 500 }
    )
  }
}
