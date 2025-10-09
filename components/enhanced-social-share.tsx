"use client";

import { useState } from "react";
import {
  Facebook,
  Linkedin,
  MessageCircle,
  Send,
  Share2,
  Copy,
  Check,
  Mail,
  X,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  generateShareUrls,
  isNativeShareSupported,
  shareNative,
  copyToClipboard,
  validateShareContent,
  type ShareContent,
} from "@/lib/share-utils";

interface EnhancedSocialShareProps extends ShareContent {
  variant?: "button" | "icon";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  enableTracking?: boolean;
  onShare?: (platform: string) => void;
  showStats?: boolean;
}

export function EnhancedSocialShare({
  title,
  text,
  url,
  hashtags = [],
  variant = "button",
  size = "default",
  className = "",
  enableTracking = false,
  onShare,
  showStats = false,
}: EnhancedSocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const { toast } = useToast();

  // Validate content
  const validation = validateShareContent({ title, text, url, hashtags });
  if (!validation.valid) {
    console.warn("Invalid share content:", validation.errors);
  }

  // Generate share URLs
  const shareUrls = generateShareUrls(
    { title, text, url, hashtags },
    enableTracking
  );

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(
      shareUrls[platform],
      "_blank",
      "noopener,noreferrer,width=600,height=600"
    );

    // Track share
    setShareCount((prev) => prev + 1);
    onShare?.(platform);

    toast({
      title: "Opening share dialog",
      description: `Sharing to ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
    });
  };

  const handleNativeShare = async () => {
    const success = await shareNative({ title, text, url, hashtags });

    if (success) {
      setShareCount((prev) => prev + 1);
      onShare?.("native");
      toast({
        title: "Shared successfully",
        description: "Content shared via native share",
      });
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(url);

    if (success) {
      setCopied(true);
      setShareCount((prev) => prev + 1);
      onShare?.("copy");
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast({
        title: "Copy failed",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const platforms = [
    {
      name: "X (Twitter)",
      icon: X,
      action: () => handleShare("twitter"),
      color: "hover:bg-black hover:text-white",
    },
    {
      name: "Facebook",
      icon: Facebook,
      action: () => handleShare("facebook"),
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      action: () => handleShare("linkedin"),
      color: "hover:bg-blue-700 hover:text-white",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      action: () => handleShare("whatsapp"),
      color: "hover:bg-green-600 hover:text-white",
    },
    {
      name: "Telegram",
      icon: Send,
      action: () => handleShare("telegram"),
      color: "hover:bg-blue-500 hover:text-white",
    },
    {
      name: "Reddit",
      icon: Share2,
      action: () => handleShare("reddit"),
      color: "hover:bg-orange-600 hover:text-white",
    },
    {
      name: "Email",
      icon: Mail,
      action: () => handleShare("email"),
      color: "hover:bg-gray-600 hover:text-white",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "button" ? (
          <Button size={size} className={className}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
            {showStats && shareCount > 0 && (
              <span className="ml-2 text-xs opacity-70">({shareCount})</span>
            )}
          </Button>
        ) : (
          <Button size="icon" variant="outline" className={className}>
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Header */}
        <DropdownMenuLabel className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share on social media
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Native Share (if available) */}
        {isNativeShareSupported() && (
          <>
            <DropdownMenuItem onClick={handleNativeShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share via...
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Social Platforms */}
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <DropdownMenuItem
              key={platform.name}
              onClick={platform.action}
              className={`cursor-pointer transition-colors ${platform.color}`}
            >
              <Icon className="mr-2 h-4 w-4" />
              {platform.name}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        {/* Copy Link */}
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </>
          )}
        </DropdownMenuItem>

        {/* Stats */}
        {showStats && shareCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Shared {shareCount} time{shareCount !== 1 ? "s" : ""}
            </DropdownMenuLabel>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
