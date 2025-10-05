import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { Suspense } from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { ChipiProvider } from "@chipi-stack/nextjs"
import { WalletProvider } from "@/contexts/wallet-context"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "StarkGive - Mystery Giveaway Platform",
  description:
    "Run mystery giveaways your followers will love. Create excitement with surprise prize amounts on Starknet.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`font-sans ${inter.variable} antialiased`}>
          <ChipiProvider>
            <WalletProvider>
              <Suspense fallback={null}>
                <Header />
                {children}
              </Suspense>
              <Toaster />
              <Analytics />
            </WalletProvider>
          </ChipiProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
