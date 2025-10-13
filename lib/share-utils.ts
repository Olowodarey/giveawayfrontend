/**
 * Utility functions for social sharing
 */

export interface ShareContent {
  title: string;
  text: string;
  url: string;
  hashtags?: string[];
}

export interface PlatformShareUrl {
  platform: string;
  url: string;
  icon: string;
}

/**
 * Generate optimized share content for different platforms
 */
export function optimizeForPlatform(
  content: ShareContent,
  platform: "twitter" | "facebook" | "linkedin" | "whatsapp" | "telegram" | "reddit" | "email"
): string {
  const { title, text, url, hashtags = [] } = content;
  const hashtagText = hashtags.map(tag => `#${tag}`).join(" ");

  switch (platform) {
    case "twitter":
      // Twitter has 280 char limit, optimize accordingly
      const twitterText = `${text} ${hashtagText}`.trim();
      return twitterText.length > 250 ? `${twitterText.substring(0, 247)}...` : twitterText;

    case "facebook":
      // Facebook prefers longer, engaging content
      return `${text}\n\n${hashtagText}`;

    case "linkedin":
      // LinkedIn prefers professional tone
      return `${title}\n\n${text}`;

    case "whatsapp":
      // WhatsApp combines everything
      return `*${title}*\n\n${text}\n\n${url}`;

    case "telegram":
      // Telegram supports markdown
      return `*${title}*\n\n${text}\n\n${hashtagText}`;

    case "reddit":
      // Reddit uses title separately
      return title;

    case "email":
      // Email uses subject and body
      return `${text}\n\nLearn more: ${url}`;

    default:
      return text;
  }
}

/**
 * Add UTM parameters to URL for tracking
 */
export function addUTMParameters(
  url: string,
  source: string,
  medium: string = "social",
  campaign: string = "share"
): string {
  const urlObj = new URL(url);
  urlObj.searchParams.set("utm_source", source);
  urlObj.searchParams.set("utm_medium", medium);
  urlObj.searchParams.set("utm_campaign", campaign);
  return urlObj.toString();
}

/**
 * Generate share URLs for all platforms with optional tracking
 */
export function generateShareUrls(
  content: ShareContent,
  enableTracking: boolean = false
): Record<string, string> {
  const { title, text, url, hashtags = [] } = content;
  const hashtagString = hashtags.join(",");
  const hashtagText = hashtags.map(tag => `#${tag}`).join(" ");

  // Add tracking if enabled
  const getTrackedUrl = (platform: string) =>
    enableTracking ? addUTMParameters(url, platform) : url;

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `${text} ${hashtagText}`
    )}&url=${encodeURIComponent(getTrackedUrl("twitter"))}`,

    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      getTrackedUrl("facebook")
    )}&quote=${encodeURIComponent(text)}`,

    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      getTrackedUrl("linkedin")
    )}`,

    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      `${text} ${getTrackedUrl("whatsapp")}`
    )}`,

    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      getTrackedUrl("telegram")
    )}&text=${encodeURIComponent(text)}`,

    reddit: `https://reddit.com/submit?url=${encodeURIComponent(
      getTrackedUrl("reddit")
    )}&title=${encodeURIComponent(title)}`,

    email: `mailto:?subject=${encodeURIComponent(
      title
    )}&body=${encodeURIComponent(`${text}\n\n${getTrackedUrl("email")}`)}`,
  };
}

/**
 * Check if native share is supported
 */
export function isNativeShareSupported(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}

/**
 * Share using native API
 */
export async function shareNative(content: ShareContent): Promise<boolean> {
  if (!isNativeShareSupported()) {
    return false;
  }

  try {
    await navigator.share({
      title: content.title,
      text: content.text,
      url: content.url,
    });
    return true;
  } catch (error) {
    // User cancelled or error occurred
    if ((error as Error).name === "AbortError") {
      return false;
    }
    return false;
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Generate shareable message for giveaway creation
 */
export function generateGiveawayShareMessage(params: {
  totalAmount: string;
  numWinners: number;
  giveawayName: string;
  claimUrl: string;
}): ShareContent {
  const { totalAmount, numWinners, giveawayName, claimUrl } = params;

  return {
    title: `${giveawayName} Mystery Giveaway!`,
    text: `🎉 Mystery Giveaway Alert! 🎁\n\nI'm giving away ${totalAmount} STRK to ${numWinners} lucky winners!\n\nPrize amounts are hidden until you claim 🤫\n\nTry your luck!`,
    url: claimUrl,
    hashtags: ["StarkGive", "Starknet", "Crypto", "Giveaway"],
  };
}

/**
 * Generate shareable message for prize claim
 */
export function generatePrizeClaimShareMessage(params: {
  prizeAmount: string;
  giveawayName?: string;
}): ShareContent {
  const { prizeAmount, giveawayName } = params;

  return {
    title: "I Won a Mystery Prize!",
    text: `🎊 I just won ${prizeAmount} STRK from ${
      giveawayName ? `the ${giveawayName}` : "a mystery"
    } giveaway on StarkGive! 🎉\n\nThe suspense was real! Try your luck too!`,
    url: "https://starkgive.app",
    hashtags: ["StarkGive", "Starknet", "Winner", "Crypto"],
  };
}

/**
 * Format number for display (e.g., 1000 -> 1K)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Validate share content
 */
export function validateShareContent(content: ShareContent): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!content.title || content.title.trim().length === 0) {
    errors.push("Title is required");
  }

  if (!content.text || content.text.trim().length === 0) {
    errors.push("Text is required");
  }

  if (!content.url || content.url.trim().length === 0) {
    errors.push("URL is required");
  }

  try {
    new URL(content.url);
  } catch {
    errors.push("Invalid URL format");
  }

  if (content.text.length > 280) {
    errors.push("Text exceeds Twitter character limit (280)");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get platform name from URL
 */
export function getPlatformFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
      return "twitter";
    }
    if (hostname.includes("facebook.com")) {
      return "facebook";
    }
    if (hostname.includes("linkedin.com")) {
      return "linkedin";
    }
    if (hostname.includes("wa.me") || hostname.includes("whatsapp.com")) {
      return "whatsapp";
    }
    if (hostname.includes("t.me") || hostname.includes("telegram.org")) {
      return "telegram";
    }
    if (hostname.includes("reddit.com")) {
      return "reddit";
    }

    return null;
  } catch {
    return null;
  }
}
