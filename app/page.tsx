import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Zap, Shield, ArrowRight, Users, Wallet, Clock, UserCheck, Mail, CreditCard, Sparkles } from "lucide-react";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Pay Anyone, Anywhere - Just Gmail Needed
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-pretty">
                Workers receive crypto payments with just their Gmail. No wallet setup.
                Convert to gift cards instantly. Zero crypto knowledge required.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-accent" />
                <span>Sign up with Gmail</span>
                <ArrowRight className="h-4 w-4" />
                <Wallet className="h-4 w-4 text-accent" />
                <span>Auto wallet</span>
                <ArrowRight className="h-4 w-4" />
                <CreditCard className="h-4 w-4 text-accent" />
                <span>Gift cards</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-base">
                  <Link href="/create">
                    Pay Team / Create Giveaway
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-base bg-transparent"
                >
                  <Link href="/claim">Claim Payment</Link>
                </Button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl blur-3xl" />
                <div className="relative bg-card border border-border rounded-2xl p-8 shadow-lg">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <Gift className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          Mystery Prize
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Amount hidden until claimed
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-muted rounded-full w-3/4" />
                      <div className="h-3 bg-muted rounded-full w-1/2" />
                      <div className="h-3 bg-muted rounded-full w-5/6" />
                    </div>
                    <div className="pt-4 border-t border-border">
                      <div className="text-3xl font-bold text-accent">???</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Surprise amount in STRK
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
              Why Choose StarkGive
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              The simplest way to pay teams and reward communities with transparent,
              gasless on-chain payments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 - Gmail Only */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Just Gmail Needed
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Workers sign up with Gmail only. Wallet auto-created. No crypto knowledge or setup required.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 - Gasless */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Zero Gas Fees
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Workers claim their salary with zero fees. 100% of payment goes directly to them.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 - Gift Cards */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Convert to Gift Cards
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Don't want crypto? Convert your payment to Amazon, iTunes, or other gift cards instantly.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 - Secure */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Fully On-Chain
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Trustless and transparent. All payments secured by Starknet smart contracts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* No Crypto Knowledge Needed Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold mb-4">
              <Sparkles className="h-4 w-4" />
              <span>Perfect for Non-Crypto Users</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
              Your Team Doesn't Need to Know Crypto
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Workers receive payments like any other app - just their Gmail and they're done
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Step 1: Gmail Sign Up */}
            <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      1. Sign Up with Gmail
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Workers click "Sign up with Google". That's it. No wallet downloads, 
                      no seed phrases, no crypto exchanges needed.
                    </p>
                  </div>
                  <div className="w-full p-3 rounded-lg bg-muted/50 text-sm font-mono">
                    alice@gmail.com ✓
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Auto Wallet */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wallet className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      2. Wallet Auto-Created
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Behind the scenes, ChipiPay creates a secure wallet linked to their email. 
                      They never see it, never manage it. It just works.
                    </p>
                  </div>
                  <div className="w-full p-3 rounded-lg bg-muted/50 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Wallet className="h-4 w-4 text-accent" />
                      <span className="font-mono text-xs">0x7a3f...b2c9</span>
                      <span className="text-muted-foreground">(hidden)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Use Anywhere */}
            <Card className="border-success/30 bg-gradient-to-br from-success/5 to-transparent">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                    <CreditCard className="h-8 w-8 text-success" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      3. Convert to Gift Cards
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Don't want to deal with crypto? Convert STRK to Amazon, iTunes, 
                      Google Play, or other gift cards. Use anywhere.
                    </p>
                  </div>
                  <div className="w-full p-3 rounded-lg bg-muted/50 text-sm">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold">Amazon</span>
                      <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">iTunes</span>
                      <span className="px-2 py-1 rounded bg-green-500/10 text-green-600 dark:text-green-400 font-semibold">Google</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real World Example */}
          <div className="mt-12 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-accent/10 via-primary/5 to-transparent border border-accent/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">
                  Real Example: Sarah's First Crypto Payment
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sarah is a graphic designer who's never used crypto. Her client sends her a StarkGive claim code. 
                  She clicks the link, signs in with her Gmail, enters the code, and claims 500 STRK. 
                  She immediately converts it to a $100 Amazon gift card and buys art supplies. 
                  <strong className="text-foreground"> Total time: 3 minutes. Crypto knowledge required: Zero.</strong>
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success"></div>
                    <span className="text-muted-foreground">No wallet setup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success"></div>
                    <span className="text-muted-foreground">No gas fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success"></div>
                    <span className="text-muted-foreground">No crypto learning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
              Perfect For Every Payment Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              From team salaries to community rewards, StarkGive handles it all
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Salary Payments Use Case */}
            <Card className="border-accent/50 bg-gradient-to-br from-accent/5 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">
                    Team Salary Payments
                  </h3>
                </div>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">The Problem:</strong> Collecting wallet addresses is tedious. 
                    Workers without crypto wallets can't receive payment. Team members don't want to learn crypto just to get paid.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">The Solution:</strong> Workers sign up with Gmail only - wallet auto-created. 
                    Claim salary with zero fees. Convert to gift cards if they don't want crypto. 
                    No crypto knowledge required at all.
                  </p>
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm font-semibold text-foreground mb-2">Example Workflow:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Create payment: "March Salaries"</li>
                      <li>• Add: Alice (500 STRK), Bob (750 STRK), Carol (600 STRK)</li>
                      <li>• Generate codes and send via email</li>
                      <li>• Team signs up with Gmail (auto-wallet)</li>
                      <li>• Claims instantly, zero fees</li>
                      <li>• Optional: Convert to Amazon/iTunes gift cards</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Giveaways Use Case */}
            <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">
                    Community Giveaways
                  </h3>
                </div>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">The Problem:</strong> Traditional giveaways require complex setups. 
                    Winners need to pay gas fees. Prize amounts are public, reducing excitement.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">The Solution:</strong> Create mystery giveaways with hidden prize amounts. 
                    Share codes on social media. Winners claim gasless and discover their surprise amount. 
                    Perfect for building community engagement.
                  </p>
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm font-semibold text-foreground mb-2">Example Workflow:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Create giveaway: "1000 Followers Celebration"</li>
                      <li>• Set 10 winners with random amounts (10-100 STRK)</li>
                      <li>• Post codes on Twitter/Discord</li>
                      <li>• Winners claim and share their excitement</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
              How It Works
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* For Project Owners / Employers */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">
                  For Project Owners
                </h3>
              </div>
              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Sign Up with Gmail",
                    desc: "Create your account and get a wallet automatically linked to your email",
                  },
                  {
                    step: "2",
                    title: "Deposit STRK Tokens",
                    desc: "Fund your wallet with STRK tokens for salary payments or giveaway pool",
                  },
                  {
                    step: "3",
                    title: "Create Payment Batch",
                    desc: "Add team members by name with their salary amounts, or create equal/random giveaway splits",
                  },
                  {
                    step: "4",
                    title: "Generate & Share Codes",
                    desc: "Get unique claim codes for each person. Share via email, chat, or social media",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold">
                      {item.step}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">
                        {item.title}
                      </div>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Workers / Recipients */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <Gift className="h-5 w-5 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">
                  For Workers / Recipients
                </h3>
              </div>
              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Receive Your Code",
                    desc: "Get your unique claim code from your employer or via social media",
                  },
                  {
                    step: "2",
                    title: "Sign Up & Enter Code",
                    desc: "Create account with Gmail and paste your claim code along with payment name",
                  },
                  {
                    step: "3",
                    title: "Auto Wallet Created",
                    desc: "Get a wallet automatically linked to your email - no crypto knowledge needed",
                  },
                  {
                    step: "4",
                    title: "Claim Your Payment",
                    desc: "Receive your salary or prize instantly with zero gas fees. 100% free to claim!",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold">
                      {item.step}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">
                        {item.title}
                      </div>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
            Ready to Simplify Your Payments?
          </h2>
          <p className="text-lg mb-8 opacity-90 text-pretty">
            Join project owners paying teams gasless and creators building engaged
            communities with StarkGive
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-base">
              <Link href="/create">
                Pay Your Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10 text-primary-foreground">
              <Link href="/create">
                Create Giveaway
                <Gift className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
