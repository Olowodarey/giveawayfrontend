# Automatic Wallet Creation Implementation

## Overview

This application now implements **automatic wallet creation** using ChipiPay's SDK. When users sign in with Gmail (via Clerk), a Starknet wallet is automatically created in the background without any user interaction.

## How It Works

### 1. User Signs In
- User clicks "Sign In" and authenticates with Gmail via Clerk
- No wallet-related prompts are shown

### 2. Automatic Wallet Creation
- Once authenticated, the `WalletProvider` automatically detects the signed-in user
- A secure PIN is generated deterministically based on the user's ID
- The system checks if a wallet already exists for this user
- If no wallet exists, one is created automatically using ChipiPay's `useCreateWallet` hook
- If a wallet exists, it's retrieved using `useGetWallet` hook

### 3. Seamless Experience
- Users can immediately claim prizes without knowing they have a wallet
- All transactions are gasless (sponsored by Avnus)
- The wallet is stored in localStorage for quick access

## Technical Implementation

### Key Components

#### 1. **WalletProvider** (`contexts/wallet-context.tsx`)
```typescript
// Automatic wallet connection on sign-in
useEffect(() => {
  if (isAuthLoaded && isUserLoaded && user && !wallet && !autoConnectAttempted) {
    setAutoConnectAttempted(true)
    autoConnectWallet().catch(err => {
      console.error("Auto-connect failed:", err)
    })
  }
}, [isAuthLoaded, isUserLoaded, user, wallet, autoConnectAttempted])
```

#### 2. **PIN Generation**
```typescript
function generateSecurePin(userId: string): string {
  // Creates a deterministic PIN based on user ID
  // This ensures the same user always gets the same PIN
  const hash = userId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  return Math.abs(hash).toString().padStart(6, '0').slice(0, 6);
}
```

#### 3. **Auto-Connect Function**
```typescript
const autoConnectWallet = async () => {
  // Get authentication token from Clerk
  const token = await getToken({ template: "giveawayapp" })
  
  // Try to get existing wallet
  const existingWallet = await getWalletAsync({
    externalUserId: userId,
    bearerToken: token,
  })
  
  // If no wallet exists, create one automatically
  if (!existingWallet) {
    const autoPin = generateSecurePin(userId)
    await createWalletAsync({
      params: {
        encryptKey: autoPin,
        externalUserId: userId,
      },
      bearerToken: token,
    })
  }
}
```

## Benefits

### For Users
- ✅ **No wallet setup required** - Just sign in with Gmail
- ✅ **No seed phrases to manage** - Everything is handled automatically
- ✅ **No gas fees** - All transactions are gasless
- ✅ **Instant access** - Can claim prizes immediately after sign-in
- ✅ **Secure** - Wallets are encrypted with auto-generated PINs

### For Developers
- ✅ **ChipiPay SDK integration** - Built on official ChipiPay Next.js SDK
- ✅ **Clerk authentication** - Seamless social login integration
- ✅ **Starknet compatible** - Argent-compatible wallets on Starknet
- ✅ **Gasless transactions** - Powered by Avnus gasless sponsorship

## User Flow

```
1. User visits site
   ↓
2. User clicks "Sign In"
   ↓
3. User authenticates with Gmail (Clerk)
   ↓
4. Wallet automatically created in background
   ↓
5. User can immediately claim prizes
   ↓
6. Transactions are gasless and automatic
```

## Configuration Requirements

### 1. ChipiPay Setup
- Create account at [dashboard.chipipay.com](https://dashboard.chipipay.com/)
- Get API keys (Public Key: `pk_prod_xxxx`)
- Configure JWKS endpoint for Clerk integration

### 2. Environment Variables
```env
NEXT_PUBLIC_CHIPI_API_KEY=pk_prod_xxxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx
```

### 3. Clerk JWT Template
Create a custom JWT template named "giveawayapp" in Clerk dashboard with:
```json
{
  "sub": "{{user.id}}",
  "email": "{{user.primary_email_address}}"
}
```

## Manual Wallet Connection (Optional)

Users can still manually connect with a custom PIN if they prefer:
1. Click "Manual Connect" button in header
2. Enter a custom PIN (4+ characters)
3. Wallet is created/accessed with that PIN

**Note:** The manual PIN overrides the auto-generated PIN.

## Security Considerations

### PIN Generation
- PINs are generated deterministically based on user ID
- Same user always gets the same PIN
- PINs are stored in localStorage (encrypted in production)

### Best Practices for Production
1. **Use environment-specific encryption** for PIN storage
2. **Implement server-side PIN management** for enhanced security
3. **Add rate limiting** to prevent brute force attacks
4. **Enable 2FA** for sensitive operations
5. **Regular security audits** of wallet creation flow

## Troubleshooting

### Wallet Not Auto-Creating
- Check browser console for errors
- Verify Clerk authentication is working
- Ensure ChipiPay API key is valid
- Check JWKS endpoint configuration

### "Wrong Password" Errors
- This shouldn't happen with auto-generated PINs
- If user manually connected, they must use the same PIN
- Clear localStorage and sign in again to reset

### Transaction Failures
- Verify contract address is correct
- Check Starknet network status
- Ensure gasless sponsorship is active

## References

- [ChipiPay Documentation](https://docs.chipipay.com/sdk/nextjs/introduction)
- [ChipiPay with Clerk Guide](https://docs.chipipay.com/sdk/nextjs/gasless-clerk-setup)
- [useCreateWallet Hook](https://docs.chipipay.com/sdk/nextjs/hooks/use-create-wallet)
- [useGetWallet Hook](https://docs.chipipay.com/sdk/nextjs/hooks/use-get-wallet)

## Future Enhancements

1. **Biometric Authentication** - Use device biometrics instead of PINs
2. **MPC Support** - Multi-party computation for enhanced security
3. **Session Management** - Allow users to sign once for multiple transactions
4. **Wallet Recovery** - Email-based wallet recovery system
5. **Multi-chain Support** - Extend to other blockchain networks
