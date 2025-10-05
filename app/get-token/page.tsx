"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Check, RefreshCw } from "lucide-react"

export default function GetTokenPage() {
  const { user, isSignedIn } = useUser()
  const [token, setToken] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchToken = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/get-token')
      const data = await response.json()
      if (data.token) {
        setToken(data.token)
      } else {
        console.error('Failed to get token:', data.error)
      }
    } catch (error) {
      console.error('Error fetching token:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSignedIn) {
      fetchToken()
    }
  }, [isSignedIn])

  const copyToken = () => {
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Get JWT Token</CardTitle>
            <CardDescription>Please sign in first to get your JWT token</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You need to be signed in to view your JWT token.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Your JWT Token</CardTitle>
          <CardDescription>
            Copy this token and paste it in ChipiPay dashboard to configure JWT validation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">User Info:</label>
            </div>
            <div className="p-3 bg-muted rounded-md text-sm">
              <p><strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}</p>
              <p><strong>User ID:</strong> {user?.id}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">JWT Token:</label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchToken}
                  disabled={loading}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToken}
                  disabled={!token}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Token
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <code className="text-xs break-all">{token || (loading ? "Loading..." : "Click Refresh to get token")}</code>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              📋 How to Use This Token
            </h3>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-decimal list-inside">
              <li>Click "Copy Token" button above</li>
              <li>Go to <a href="https://dashboard.chipipay.com/configure" target="_blank" rel="noopener" className="underline">ChipiPay Dashboard</a></li>
              <li>Navigate to <strong>JWKS Endpoint</strong> section</li>
              <li>Paste the token in the <strong>"JWT Token"</strong> field</li>
              <li>Click <strong>"Parse"</strong> button</li>
              <li>ChipiPay will automatically extract validation rules</li>
              <li>Click <strong>"Save"</strong> to complete setup</li>
            </ol>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              ⚠️ Important Notes
            </h3>
            <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
              <li>• This token expires after some time (usually 1 hour)</li>
              <li>• You only need to paste it once for ChipiPay to learn the structure</li>
              <li>• After parsing, ChipiPay will validate all future tokens automatically</li>
              <li>• Make sure JWKS URL is still configured: <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">https://content-whale-98.clerk.accounts.dev/.well-known/jwks.json</code></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
