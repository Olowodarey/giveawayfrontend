import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { getToken, userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get the JWT token using custom template
    const token = await getToken({ template: 'giveawayapp' })
    
    if (!token) {
      return NextResponse.json(
        { error: 'Failed to get token' },
        { status: 500 }
      )
    }

    // Also try to decode to see what's in it
    const parts = token.split('.')
    let decoded = null
    if (parts.length === 3) {
      try {
        decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString())
      } catch (e) {
        // Ignore decode errors
      }
    }

    return NextResponse.json({
      token,
      userId,
      decoded,
      message: 'Copy this token and paste it in ChipiPay dashboard JWKS configuration'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get token' },
      { status: 500 }
    )
  }
}
