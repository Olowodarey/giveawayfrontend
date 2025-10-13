"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import {
  Gift,
  ShoppingBag,
  Gamepad2,
  Music,
  Film,
  Coffee,
  ShoppingCart,
  Sparkles,
  Clock,
} from "lucide-react";

const giftCards = [
  {
    name: "Amazon",
    icon: ShoppingBag,
    color: "from-orange-500/20 to-orange-500/5",
    iconColor: "text-orange-500",
    description: "Shop millions of products worldwide",
    denominations: ["$10", "$25", "$50", "$100"],
  },
  {
    name: "Google Play",
    icon: Gamepad2,
    color: "from-green-500/20 to-green-500/5",
    iconColor: "text-green-500",
    description: "Apps, games, movies, and more",
    denominations: ["$10", "$25", "$50", "$100"],
  },
  {
    name: "iTunes / Apple",
    icon: Music,
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-500",
    description: "Music, apps, and entertainment",
    denominations: ["$10", "$25", "$50", "$100"],
  },
  {
    name: "Netflix",
    icon: Film,
    color: "from-red-500/20 to-red-500/5",
    iconColor: "text-red-500",
    description: "Stream movies and TV shows",
    denominations: ["$25", "$50", "$100"],
  },
  {
    name: "Spotify",
    icon: Music,
    color: "from-green-500/20 to-green-500/5",
    iconColor: "text-green-500",
    description: "Premium music streaming",
    denominations: ["$10", "$30", "$60"],
  },
  {
    name: "Starbucks",
    icon: Coffee,
    color: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-500",
    description: "Coffee and beverages",
    denominations: ["$10", "$25", "$50"],
  },
  {
    name: "Steam",
    icon: Gamepad2,
    color: "from-slate-500/20 to-slate-500/5",
    iconColor: "text-slate-400",
    description: "PC gaming platform",
    denominations: ["$20", "$50", "$100"],
  },
  {
    name: "Walmart",
    icon: ShoppingCart,
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-500",
    description: "Groceries and everyday essentials",
    denominations: ["$25", "$50", "$100"],
  },
];

export default function GiftCardsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Coming Soon</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Convert Crypto to Gift Cards
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Don't want to deal with crypto? Convert your STRK tokens to popular
              gift cards from Amazon, iTunes, Google Play, and more. Use your
              crypto earnings anywhere.
            </p>
          </div>

          {/* Coming Soon Notice */}
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="border-accent/30 bg-card/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Feature Under Development
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We're working hard to bring you the ability to convert your
                      crypto payments directly into gift cards. This feature will
                      be available soon! In the meantime, you can claim your
                      payments and hold them in your wallet.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gift Cards Grid */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Available Gift Cards
            </h2>
            <p className="text-muted-foreground">
              Choose from a wide variety of popular brands
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {giftCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.name}
                  className="border-border/50 hover:border-accent/30 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="secondary" className="text-xs">
                      Coming Soon
                    </Badge>
                  </div>
                  <CardHeader>
                    <div
                      className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`h-8 w-8 ${card.iconColor}`} />
                    </div>
                    <CardTitle className="text-xl">{card.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {card.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        Available denominations:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {card.denominations.map((amount) => (
                          <Badge
                            key={amount}
                            variant="outline"
                            className="text-xs"
                          >
                            {amount}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        className="w-full mt-4"
                        disabled
                        variant="secondary"
                      >
                        <Gift className="mr-2 h-4 w-4" />
                        Coming Soon
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Will Work Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How It Will Work
            </h2>
            <p className="text-muted-foreground">
              Simple 3-step process to convert crypto to gift cards
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-2xl border-2 border-primary/30 mx-auto">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Select Gift Card
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose your preferred brand and denomination from our wide
                selection
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-accent font-bold text-2xl border-2 border-accent/30 mx-auto">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Convert STRK
              </h3>
              <p className="text-sm text-muted-foreground">
                Your STRK tokens will be automatically converted at current
                market rates
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center text-success font-bold text-2xl border-2 border-success/30 mx-auto">
                3
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Receive Code
              </h3>
              <p className="text-sm text-muted-foreground">
                Get your gift card code instantly and use it anywhere the brand
                is accepted
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance text-foreground">
            Want to Be Notified?
          </h2>
          <p className="text-lg mb-8 opacity-90 text-pretty text-muted-foreground">
            We'll let you know as soon as gift card conversion is available
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base bg-accent hover:bg-accent/90">
              <a href="/claim">
                Claim Your Payment
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base border-border hover:bg-muted"
            >
              <a href="/dashboard">
                View Dashboard
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
