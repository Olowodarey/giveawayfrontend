"use client"

import { useAuth, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugTokenPage() {
  const { getToken } = useAuth()
  const { user, isSignedIn } = useUser()
  const [tokenInfo, setTokenInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const analyzeToken = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      
      if (!token) {
        setTokenInfo({ error: "No token received" })
        return
      }

      // Decode JWT
      const parts = token.split('.')
      if (parts.length !== 3) {
        setTokenInfo({ error: "Invalid JWT format" })
        return
      }

      const header = JSON.parse(atob(parts[0]))
      const payload = JSON.parse(atob(parts[1]))

      setTokenInfo({
        token: token,
        tokenLength: token.length,
        header,
        payload,
        user: {
          id: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
          firstName: user?.firstName,
          lastName: user?.lastName,
        }
      })
    } catch (error: any) {
      setTokenInfo({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSignedIn) {
      analyzeToken()
    }
  }, [isSignedIn])

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Debug JWT Token</CardTitle>
            <CardDescription>Please sign in first</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>JWT Token Debug Information</CardTitle>
          <CardDescription>
            Analyze your Clerk JWT token to troubleshoot ChipiPay integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={analyzeToken} disabled={loading}>
            {loading ? "Analyzing..." : "Refresh Token Analysis"}
          </Button>

          {tokenInfo && (
            <div className="space-y-4">
              {tokenInfo.error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-800 font-semibold">Error:</p>
                  <p className="text-red-600">{tokenInfo.error}</p>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                    <h3 className="font-semibold text-blue-900 mb-2">User Information</h3>
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(tokenInfo.user, null, 2)}
                    </pre>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded">
                    <h3 className="font-semibold text-green-900 mb-2">JWT Header</h3>
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(tokenInfo.header, null, 2)}
                    </pre>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                    <h3 className="font-semibold text-purple-900 mb-2">JWT Payload (Claims)</h3>
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(tokenInfo.payload, null, 2)}
                    </pre>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <h3 className="font-semibold text-yellow-900 mb-2">ChipiPay Configuration Check</h3>
                    <div className="text-sm space-y-2">
                      <p><strong>Token Length:</strong> {tokenInfo.tokenLength} characters</p>
                      <p><strong>Issuer (iss):</strong> {tokenInfo.payload.iss}</p>
                      <p><strong>Subject (sub):</strong> {tokenInfo.payload.sub}</p>
                      <p><strong>Email:</strong> {tokenInfo.payload.email || "Not in token"}</p>
                      <p><strong>Expires (exp):</strong> {new Date(tokenInfo.payload.exp * 1000).toLocaleString()}</p>
                      
                      <div className="mt-4 p-3 bg-yellow-100 rounded">
                        <p className="font-semibold">⚠️ Important for ChipiPay:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>JWKS URL should be: <code className="bg-yellow-200 px-1">{tokenInfo.payload.iss}/.well-known/jwks.json</code></li>
                          <li>User Identifier in ChipiPay: Should match <code className="bg-yellow-200 px-1">{tokenInfo.user.email ? 'Email' : 'sub (User ID)'}</code></li>
                          <li>Validation field: <code className="bg-yellow-200 px-1">iss</code> should equal <code className="bg-yellow-200 px-1">{tokenInfo.payload.iss}</code></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                    <h3 className="font-semibold text-gray-900 mb-2">Full Token (for ChipiPay)</h3>
                    <textarea 
                      className="w-full p-2 text-xs font-mono bg-white border rounded"
                      rows={6}
                      value={tokenInfo.token}
                      readOnly
                      onClick={(e) => e.currentTarget.select()}
                    />
                    <p className="text-xs text-gray-600 mt-2">Click to select all, then copy</p>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
