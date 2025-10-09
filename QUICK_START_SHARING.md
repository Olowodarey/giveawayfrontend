# Quick Start: Universal Social Sharing

## 🚀 Get Started in 3 Steps

### Step 1: Import the Component

```tsx
import { SocialShare } from "@/components/social-share";
```

### Step 2: Add to Your Page

```tsx
<SocialShare
  title="My Awesome Giveaway"
  text="Join my 1000 STRK giveaway! 🎉"
  url="https://starkgive.app/claim"
  hashtags={["StarkGive", "Starknet", "Crypto"]}
/>
```

### Step 3: Done! 🎉

Your users can now share to:
- ✅ X (Twitter)
- ✅ Facebook
- ✅ LinkedIn
- ✅ WhatsApp
- ✅ Telegram
- ✅ Reddit
- ✅ Email
- ✅ Copy Link

---

## 📱 Common Use Cases

### 1. After Creating a Giveaway

```tsx
import { SocialShare } from "@/components/social-share";

<SocialShare
  title="New Mystery Giveaway!"
  text={`I'm giving away ${totalAmount} STRK to ${numWinners} winners! Prize amounts are hidden until you claim 🤫`}
  url="https://starkgive.app/claim"
  hashtags={["StarkGive", "Starknet", "Giveaway"]}
  variant="button"
  size="lg"
  className="w-full"
/>
```

### 2. After Winning a Prize

```tsx
import { SocialShare } from "@/components/social-share";

<SocialShare
  title="I Won!"
  text={`🎊 I just won ${prizeAmount} STRK from a mystery giveaway on StarkGive! Try your luck too!`}
  url="https://starkgive.app"
  hashtags={["Winner", "StarkGive", "Starknet"]}
  variant="button"
  size="lg"
/>
```

### 3. Compact Icon Button

```tsx
<SocialShare
  title="Check this out"
  text="Amazing giveaway platform!"
  url="https://starkgive.app"
  variant="icon"
  size="icon"
/>
```

---

## 🎨 Customization Options

### Variants
- `variant="button"` - Full button with text (default)
- `variant="icon"` - Icon-only button

### Sizes
- `size="sm"` - Small
- `size="default"` - Medium (default)
- `size="lg"` - Large
- `size="icon"` - Icon size (use with variant="icon")

### Styling
```tsx
<SocialShare
  {...props}
  className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
/>
```

---

## 🔥 Pro Tips

### 1. Keep Text Under 200 Characters
Twitter has a 280 limit, but shorter is better for all platforms.

### 2. Use 2-4 Hashtags
```tsx
hashtags={["StarkGive", "Starknet", "Crypto", "Giveaway"]}
```

### 3. Include Emojis
```tsx
text="🎉 Amazing giveaway! 🎁 Don't miss out!"
```

### 4. Add Call-to-Action
```tsx
text="Join now! Limited spots available! 🚀"
```

---

## 📦 Using Helper Functions

### Auto-Generate Giveaway Messages

```tsx
import { generateGiveawayShareMessage } from "@/lib/share-utils";
import { SocialShare } from "@/components/social-share";

const shareContent = generateGiveawayShareMessage({
  totalAmount: "1000",
  numWinners: 10,
  giveawayName: "Summer Bonanza",
  claimUrl: "https://starkgive.app/claim"
});

<SocialShare {...shareContent} />
```

### Auto-Generate Win Messages

```tsx
import { generatePrizeClaimShareMessage } from "@/lib/share-utils";

const shareContent = generatePrizeClaimShareMessage({
  prizeAmount: "150",
  giveawayName: "Summer Bonanza"
});

<SocialShare {...shareContent} />
```

---

## 🎯 Advanced: Tracking Shares

```tsx
import { EnhancedSocialShare } from "@/components/enhanced-social-share";

<EnhancedSocialShare
  title="My Giveaway"
  text="Check this out!"
  url="https://starkgive.app"
  hashtags={["StarkGive"]}
  enableTracking={true}
  showStats={true}
  onShare={(platform) => {
    console.log(`Shared on ${platform}`);
    // Track in your analytics
  }}
/>
```

---

## 🐛 Troubleshooting

### Share Button Not Working?
1. Check that you're using HTTPS (required for clipboard)
2. Verify your URL is valid
3. Check browser console for errors

### Native Share Not Appearing on Mobile?
- Native share only works on HTTPS
- Some browsers don't support it
- Fallback to copy link will work

### Hashtags Not Showing?
- Some platforms don't support hashtags in URLs
- They'll still appear in the text

---

## 📚 More Resources

- **Full Documentation**: See `SOCIAL_SHARING.md`
- **Live Examples**: Visit `/share-examples` in your app
- **Interactive Demo**: Visit `/demo-share` in your app
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`

---

## 🎉 That's It!

You now have universal social sharing in your app. Users can share on any platform they prefer!

**Questions?** Check the full documentation or open an issue.

---

Built with ❤️ for StarkGive
