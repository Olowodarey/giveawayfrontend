import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Zap, Shield, ArrowRight, Users } from "lucide-react";
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
                Run Mystery Giveaways Your Followers Will Love
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-pretty">
                Create excitement with surprise prize amounts. Share codes on
                any platform, let winners claim directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-base">
                  <Link href="/create">
                    Create Giveaway
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-base bg-transparent"
                >
                  <Link href="/claim">Claim Prize</Link>
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
              The most exciting way to reward your community with transparent,
              on-chain giveaways
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Gift className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Mystery Mechanic
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Prize amounts stay hidden until claimed, creating anticipation
                  and excitement for your community.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Gasless Claims
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Winners pay zero fees to claim their prizes. You cover the
                  costs, they get the rewards.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Fully On-Chain
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Trustless and transparent. All giveaways are secured by
                  Starknet smart contracts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
              How It Works
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* For Creators */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">
                  For Creators
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
                    title: "Deposit STRK",
                    desc: "Fund your wallet with STRK tokens for your giveaway prize pool",
                  },
                  {
                    step: "3",
                    title: "Generate Codes",
                    desc: "Create unique claim codes with custom prize amounts for your winners",
                  },
                  {
                    step: "4",
                    title: "Share Anywhere",
                    desc: "Post codes on any social platform and watch the excitement unfold",
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

            {/* For Winners */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <Gift className="h-5 w-5 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">
                  For Winners
                </h3>
              </div>
              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Find Code",
                    desc: "Discover claim codes shared by creators on social media",
                  },
                  {
                    step: "2",
                    title: "Sign Up & Enter Code",
                    desc: "Create account with Gmail and paste your claim code",
                  },
                  {
                    step: "3",
                    title: "Auto Wallet Created",
                    desc: "Get a wallet automatically linked to your email - no setup needed",
                  },
                  {
                    step: "4",
                    title: "Receive STRK",
                    desc: "Get your surprise prize amount instantly in your wallet",
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
            Ready to Create Your First Giveaway?
          </h2>
          <p className="text-lg mb-8 opacity-90 text-pretty">
            Join creators who are building engaged communities with mystery
            giveaways
          </p>
          <Button asChild size="lg" variant="secondary" className="text-base">
            <Link href="/create">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
