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
  title: "Gigi Pay - Simple Crypto Payments",
  description:
    "Pay anyone with just Gmail. No wallet setup, zero gas fees. Convert crypto to gift cards instantly. The simplest way to send and receive crypto payments.",
  generator: "v0.app",
  themeColor: "#0f172a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
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
