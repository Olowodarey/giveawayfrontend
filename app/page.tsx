import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Gift,
  Zap,
  Shield,
  ArrowRight,
  Users,
  Wallet,
  Clock,
  UserCheck,
  Mail,
  CreditCard,
  Sparkles,
} from "lucide-react";
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
                Workers receive crypto payments with just their Gmail. No wallet
                setup. Convert to gift cards instantly. Zero crypto knowledge
                required.
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
              The simplest way to pay teams and reward communities with
              transparent, gasless on-chain payments
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
                  Workers sign up with Gmail only. Wallet auto-created. No
                  crypto knowledge or setup required.
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
                  Workers claim their salary with zero fees. 100% of payment
                  goes directly to them.
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
                  Don't want crypto? Convert your payment to Amazon, iTunes, or
                  other gift cards instantly.
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
                  Trustless and transparent. All payments secured by Starknet
                  smart contracts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works: Bulk Payments Article */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
              Bulk Payments Without Wallet Addresses
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
              Send crypto to multiple people using just a{" "}
              <strong className="text-foreground">
                Payment Name + Claim Code
              </strong>
              . No wallet addresses needed. Recipients claim with Gmail only.
            </p>
          </div>

          {/* How It Works Flow */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-primary/30 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    1
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Create Payment
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Choose token (STRK, USDC, ETH, etc.), set total amount and
                    expiry. Add recipients with custom codes and amounts.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/30 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">
                    2
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Share Name + Code
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Give recipients the Payment Name and their unique Claim Code
                    via email, social media, or messaging apps.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-success/30 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center text-success font-bold text-xl">
                    3
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Claim with Gmail
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Recipients sign in with Gmail, get auto-wallet via ChipiPay,
                    and claim instantly with zero gas fees.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Who Is It For */}
          <article className="mb-16 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
              Who Is It For?
            </h3>
            
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground">
                    Creators & Communities
                  </h4>
                </div>
                <p className="text-base text-center">
                  If you're building a community on social media, StarkGive is perfect for you. Run exciting giveaways on Twitter/X, Discord, Telegram, or Instagram without the hassle of collecting wallet addresses. Your followers simply need their Gmail to claim prizes. Create mystery giveaways where prize amounts are hidden until claimed, building anticipation and engagement. Perfect for milestone celebrations, follower appreciation events, or regular community rewards.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-3">
                    <Wallet className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground">
                    Employers & DAOs
                  </h4>
                </div>
                <p className="text-base text-center">
                  Managing payroll for remote teams or DAO contributors has never been easier. Pay monthly salaries, contractor fees, or bounties in crypto without the tedious process of collecting and verifying wallet addresses. Your team members sign up with their Gmail, get an auto-created wallet, and claim their payments with zero gas fees. Ideal for distributed teams, freelance projects, DAO grants, and recurring payments.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center mb-3">
                    <Gift className="h-6 w-6 text-success" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground">
                    Event Organizers
                  </h4>
                </div>
                <p className="text-base text-center">
                  Hosting a hackathon, conference, or community event? Distribute prizes and rewards instantly without complex wallet setups. Winners can claim their prizes with just their Gmail—no crypto knowledge required. Perfect for hackathon prizes, conference attendee rewards, referral bonuses, or event swag distribution. Make your event memorable with seamless, gasless prize distribution.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3">
                    <UserCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground">
                    Workers & Recipients
                  </h4>
                </div>
                <p className="text-base text-center">
                  Never used crypto before? No problem. Claim your salary, prize, or payment with just your Gmail account. We automatically create a secure wallet for you—you never need to see it or manage it. Claim your payments with zero fees, and if you don't want to deal with crypto, convert it instantly to Amazon, iTunes, or other gift cards. It's as simple as using any other app.
                </p>
              </div>
            </div>
          </article>

          {/* Use Cases */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              Ways You Can Use It
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    Social Media Giveaways
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Twitter/X contests with mystery prize amounts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        Discord community rewards and engagement incentives
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        Telegram group airdrops and milestone celebrations
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Instagram follower appreciation giveaways</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-accent" />
                    Team & Contractor Payments
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>
                        Monthly salaries for remote teams (no wallet setup)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Freelancer and contractor payouts in crypto</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>DAO contributor rewards and grants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>
                        Project-based payments with automatic distribution
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-success/20 bg-gradient-to-br from-success/5 to-transparent">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-success" />
                    Bounties & Rewards
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-success mt-1">•</span>
                      <span>Hackathon prizes distributed instantly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success mt-1">•</span>
                      <span>Bug bounty programs with code-based claims</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success mt-1">•</span>
                      <span>Content creator rewards and referral bonuses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success mt-1">•</span>
                      <span>Community contribution incentives</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Events & Airdrops
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Conference attendee rewards and swag</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Early supporter airdrops (no snapshot needed)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Micro-grants for community projects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Educational course completion rewards</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-base min-w-[200px]">
              <Link href="/create">
                <Gift className="mr-2 h-5 w-5" />
                Create Payment
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base min-w-[200px]"
            >
              <Link href="/claim">
                <Wallet className="mr-2 h-5 w-5" />
                Claim Payment
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-base min-w-[200px]"
            >
              <Link href="/dashboard">
                <Users className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-accent/10 via-primary/5 to-transparent border border-accent/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">
                  Real Example: Sarah's First Crypto Payment
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sarah is a graphic designer who's never used crypto. Her
                  client sends her a StarkGive claim code. She clicks the link,
                  signs in with her Gmail, enters the code, and claims 500 STRK.
                  She immediately converts it to a $100 Amazon gift card and
                  buys art supplies.
                  <strong className="text-foreground">
                    {" "}
                    Total time: 3 minutes. Crypto knowledge required: Zero.
                  </strong>
                </p>
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success"></div>
                    <span className="text-muted-foreground">
                      No wallet setup
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success"></div>
                    <span className="text-muted-foreground">No gas fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success"></div>
                    <span className="text-muted-foreground">
                      No crypto learning
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance text-foreground">
            Ready to Simplify Your Payments?
          </h2>
          <p className="text-lg mb-8 opacity-90 text-pretty text-muted-foreground">
            Join project owners paying teams gasless and creators building
            engaged communities with StarkGive
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base bg-accent hover:bg-accent/90">
              <Link href="/create">
                Pay Your Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base border-border hover:bg-muted"
            >
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
