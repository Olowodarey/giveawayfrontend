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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  title: string;
  text: string;
  url: string;
  hashtags?: string[];
  variant?: "button" | "icon";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function SocialShare({
  title,
  text,
  url,
  hashtags = [],
  variant = "button",
  size = "default",
  className = "",
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Format hashtags for different platforms
  const hashtagString = hashtags.length > 0 ? hashtags.join(",") : "";
  const hashtagText = hashtags.length > 0 ? hashtags.map(tag => `#${tag}`).join(" ") : "";

  // Share URLs for different platforms
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `${text} ${hashtagText}`
    )}&url=${encodeURIComponent(url)}`,
    
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}&quote=${encodeURIComponent(text)}`,
    
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`,
    
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}`,
    
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}`,
    
    email: `mailto:?subject=${encodeURIComponent(
      title
    )}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], "_blank", "noopener,noreferrer,width=600,height=600");
    
    toast({
      title: "Opening share dialog",
      description: `Sharing to ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
    });
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        toast({
          title: "Shared successfully",
          description: "Content shared via native share",
        });
      } catch (error) {
        // Silently handle share errors
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
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
          </Button>
        ) : (
          <Button size="icon" variant="outline" className={className}>
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Native Share (if available) */}
        {typeof navigator !== "undefined" && navigator.share && (
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
