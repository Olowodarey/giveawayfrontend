import Link from "next/link"
import { Github, X, Send, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Gigi Pay makes crypto payments simple. Pay anyone with just Gmail, no wallet setup required. Zero gas fees, instant claims.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Connect</h3>
            <div className="flex gap-4">
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="X (Twitter)"
              >
                <X className="h-5 w-5" />
              </Link>
              <Link
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="Telegram"
              >
                <Send className="h-5 w-5" />
              </Link>
              <Link
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="Discord"
              >
                <MessageCircle className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 Gigi Pay. All rights reserved.</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built on</span>
            <span className="font-semibold text-accent">Starknet</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
