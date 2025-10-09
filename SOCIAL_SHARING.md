# Universal Social Sharing System

## Overview

StarkGive now features a universal social sharing system that allows users to share giveaways across **all major social platforms**, not just Twitter. This creates a more inclusive and viral distribution mechanism.

## Supported Platforms

### Social Networks
- **X (Twitter)** - Share with tweets and hashtags
- **Facebook** - Share to timeline with custom text
- **LinkedIn** - Professional network sharing
- **Reddit** - Submit to subreddits with title and URL

### Messaging Apps
- **WhatsApp** - Share via WhatsApp with text and link
- **Telegram** - Share to Telegram chats and channels
- **Email** - Share via email with subject and body

### Additional Features
- **Native Share API** - Uses device's native share menu (mobile)
- **Copy Link** - Quick clipboard copy with visual feedback

## Component Usage

### Basic Usage

```tsx
import { SocialShare } from "@/components/social-share";

<SocialShare
  title="Mystery Giveaway Alert!"
  text="I'm giving away 1000 STRK to 10 lucky winners!"
  url="https://starkgive.app/claim"
  hashtags={["StarkGive", "Starknet", "Crypto"]}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | required | Title for the shared content |
| `text` | string | required | Main text/description to share |
| `url` | string | required | URL to share |
| `hashtags` | string[] | [] | Array of hashtags (without #) |
| `variant` | "button" \| "icon" | "button" | Display style |
| `size` | "default" \| "sm" \| "lg" \| "icon" | "default" | Button size |
| `className` | string | "" | Additional CSS classes |

### Variants

#### Button Variant (Default)
```tsx
<SocialShare
  title="Check this out"
  text="Amazing giveaway platform!"
  url="https://starkgive.app"
  variant="button"
  size="lg"
  className="w-full"
/>
```

#### Icon Variant (Compact)
```tsx
<SocialShare
  title="Check this out"
  text="Amazing giveaway platform!"
  url="https://starkgive.app"
  variant="icon"
  size="icon"
/>
```

## Implementation Examples

### 1. Giveaway Created (Create Page)

```tsx
<SocialShare
  title="Mystery Giveaway Alert!"
  text={getTweetTemplate()} // Your custom message
  url="https://starkgive.app/claim"
  hashtags={["StarkGive", "Starknet", "Crypto", "Giveaway"]}
  variant="button"
  size="lg"
  className="w-full"
/>
```

### 2. Prize Claimed (Claim Page)

```tsx
<SocialShare
  title="I Won a Mystery Prize!"
  text={`I just won ${prizeAmount} STRK from a mystery giveaway on StarkGive! 🎉 Try your luck too!`}
  url="https://starkgive.app"
  hashtags={["StarkGive", "Starknet", "Crypto", "Winner"]}
  variant="button"
  size="lg"
  className="w-full"
/>
```

### 3. Dashboard Sharing

```tsx
<SocialShare
  title="My Giveaway Stats"
  text={`I've distributed ${totalAmount} STRK across ${giveawayCount} giveaways on StarkGive!`}
  url="https://starkgive.app"
  hashtags={["StarkGive", "Starknet"]}
  variant="icon"
/>
```

## Platform-Specific Features

### Twitter/X
- Supports hashtags in URL
- Opens Twitter intent dialog
- Pre-fills tweet text

### Facebook
- Uses Facebook Sharer
- Includes quote parameter
- Opens in popup window

### LinkedIn
- Professional sharing format
- Opens LinkedIn share dialog
- URL-based sharing

### WhatsApp
- Mobile-optimized
- Combines text and URL
- Opens WhatsApp app/web

### Telegram
- Channel and chat support
- Separate text and URL parameters
- Opens Telegram app/web

### Reddit
- Includes title and URL
- Opens Reddit submit page
- Allows subreddit selection

### Email
- Uses mailto: protocol
- Pre-fills subject and body
- Opens default email client

## Native Share API

On supported devices (primarily mobile), the component automatically detects and offers the native share menu:

```tsx
// Automatically detected
if (navigator.share) {
  await navigator.share({
    title: "Your Title",
    text: "Your Text",
    url: "Your URL"
  });
}
```

## Copy to Clipboard

The component includes a "Copy Link" option with visual feedback:

- Copies URL to clipboard
- Shows checkmark on success
- Displays toast notification
- Resets after 2 seconds

## Styling & Customization

### Custom Styling

```tsx
<SocialShare
  title="Custom Styled"
  text="Custom message"
  url="https://starkgive.app"
  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
/>
```

### Size Options

```tsx
// Small
<SocialShare size="sm" {...props} />

// Default
<SocialShare size="default" {...props} />

// Large
<SocialShare size="lg" {...props} />

// Icon only
<SocialShare size="icon" variant="icon" {...props} />
```

## Best Practices

### 1. **Keep Text Concise**
- Twitter has a 280 character limit
- Keep messages under 200 characters for best results

### 2. **Use Relevant Hashtags**
- 2-4 hashtags is optimal
- Use platform-specific hashtags
- Include brand hashtag (#StarkGive)

### 3. **Include Call-to-Action**
- "Try your luck too!"
- "Join the giveaway!"
- "Claim your prize now!"

### 4. **Test on Mobile**
- Native share works best on mobile
- Test WhatsApp and Telegram flows
- Verify app opening behavior

### 5. **Track Shares (Optional)**
- Add UTM parameters to URLs
- Track which platforms drive traffic
- Optimize based on data

## Advanced Usage

### Dynamic Content

```tsx
const generateShareContent = (giveaway: Giveaway) => ({
  title: `${giveaway.name} Giveaway`,
  text: `Join my ${giveaway.totalAmount} STRK giveaway with ${giveaway.numWinners} winners! 🎉`,
  url: `https://starkgive.app/claim?id=${giveaway.id}`,
  hashtags: ["StarkGive", "Starknet", giveaway.name]
});

<SocialShare {...generateShareContent(myGiveaway)} />
```

### Conditional Rendering

```tsx
{isWinner && (
  <SocialShare
    title="I Won!"
    text={`I won ${prizeAmount} STRK!`}
    url="https://starkgive.app"
    hashtags={["Winner", "StarkGive"]}
  />
)}
```

### Multiple Share Buttons

```tsx
<div className="flex gap-2">
  <SocialShare variant="icon" {...props} />
  <Button onClick={otherAction}>Other Action</Button>
</div>
```

## Accessibility

The component includes proper accessibility features:

- `aria-label` for icon buttons
- Keyboard navigation support
- Screen reader friendly
- Focus management

## Browser Support

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Native Share API**: iOS Safari, Android Chrome, modern mobile browsers
- **Fallback**: Copy to clipboard for unsupported features

## Migration from Twitter-Only

### Before (Twitter Only)

```tsx
const shareOnTwitter = () => {
  const text = `My message`;
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
    "_blank"
  );
};

<Button onClick={shareOnTwitter}>
  <Twitter className="mr-2 h-4 w-4" />
  Share on Twitter
</Button>
```

### After (Universal Sharing)

```tsx
<SocialShare
  title="My Title"
  text="My message"
  url="https://starkgive.app"
  hashtags={["StarkGive"]}
  variant="button"
  size="default"
/>
```

## Benefits

### For Users
- ✅ Share on their preferred platform
- ✅ Reach wider audience
- ✅ Better engagement rates
- ✅ Mobile-friendly native sharing

### For Platform
- ✅ Increased viral potential
- ✅ Platform-agnostic distribution
- ✅ Better user experience
- ✅ Higher conversion rates

### For Hackathon
- ✅ More inclusive approach
- ✅ Better UX design
- ✅ Modern web standards
- ✅ Production-ready feature

## Demo

Visit `/demo-share` to see all sharing options in action with live examples.

## Troubleshooting

### Share not working on mobile
- Ensure HTTPS is enabled
- Check browser compatibility
- Verify native share API support

### Hashtags not appearing
- Check platform-specific formatting
- Verify hashtag array is passed correctly
- Some platforms don't support hashtags in URL

### Copy to clipboard fails
- Requires secure context (HTTPS)
- Check browser permissions
- Fallback to manual copy

## Future Enhancements

- [ ] Share analytics tracking
- [ ] Custom platform selection
- [ ] Share count display
- [ ] QR code generation
- [ ] Deep linking support
- [ ] Platform-specific optimizations

---

Built with ❤️ for the Starknet community
