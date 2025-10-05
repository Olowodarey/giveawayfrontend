# Clerk + ChipiPay Integration Guide

## 🎯 Overview

This guide shows you how to configure **Clerk authentication** (email-based) with **ChipiPay** for gasless wallet management.

---

## 📋 Prerequisites

1. **Clerk Account** - Sign up at [clerk.com](https://clerk.com)
2. **ChipiPay Account** - Sign up at [chipipay.com](https://chipipay.com)
3. Both services have free tiers!

---

## 🔧 Step 1: Set Up Clerk

### 1.1 Create Clerk Application

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Click "Add application"
3. Name it (e.g., "StarkGive")
4. Choose authentication methods:
   - ✅ **Email** (required)
   - ✅ **Google** (optional)
   - ✅ **Twitter** (optional for social login)

### 1.2 Get Clerk API Keys

1. In Clerk dashboard, go to **API Keys**
2. Copy your keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### 1.3 Update `.env.local`

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

### 1.4 Get JWKS Endpoint

1. In Clerk dashboard, go to **API Keys**
2. Scroll down to **Advanced**
3. Find **JWKS Endpoint URL**
4. It will look like:
   ```
   https://your-app.clerk.accounts.dev/.well-known/jwks.json
   ```
5. **Copy this URL** - you'll need it for ChipiPay!

---

## 🔧 Step 2: Configure ChipiPay

### 2.1 Access ChipiPay Dashboard

1. Go to [dashboard.chipipay.com](https://dashboard.chipipay.com)
2. Navigate to **Configure** → **JWKS Endpoint**

### 2.2 Configure JWKS

Based on your screenshot, fill in:

1. **Use Firebase**: Toggle OFF
2. **JWKS Endpoint URL**: Paste your Clerk JWKS URL
   ```
   https://your-app.clerk.accounts.dev/.well-known/jwks.json
   ```
3. **User Identifier**: Select **Email**
4. **JWT Token**: Leave empty (Clerk handles this automatically)
5. Click **Add** button

### 2.3 Verify Configuration

After adding:

- You should see your JWKS configuration saved
- The "No JWKS configuration found" error will disappear
- Your API key will now work with Clerk authentication

---

## 🎯 Step 3: How It Works

### Authentication Flow

```
1. User clicks "Sign In"
   ↓
2. Clerk shows email sign-in form
   ↓
3. User enters email + password
   ↓
4. Clerk authenticates and issues JWT token
   ↓
5. User clicks "Connect Wallet"
   ↓
6. App gets JWT token from Clerk
   ↓
7. App sends token to ChipiPay
   ↓
8. ChipiPay validates token using JWKS
   ↓
9. ChipiPay creates/retrieves wallet
   ↓
10. User can now create giveaways!
```

### User Identification

- **Clerk**: Identifies users by email address
- **ChipiPay**: Uses email as `externalUserId`
- **Wallet**: Tied to user's email address
- **Benefits**:
  - Same wallet across devices
  - Email-based recovery
  - No need to remember wallet addresses

---

## 📝 Step 4: Update Environment Variables

Your complete `.env.local` should look like:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# ChipiPay Configuration
NEXT_PUBLIC_CHIPI_API_KEY=pk_prod_5e5488f15194f4b7df58d3ef616461f3
CHIPI_SECRET_KEY=sk_prod_your_secret_key_here

# Starknet Contract Configuration
NEXT_PUBLIC_GIVEAWAY_CONTRACT_ADDRESS=0x077af435e43da39a5c75ea90ea143abfdbb03e812a71803a21b1ad0d065f3847
NEXT_PUBLIC_STRK_TOKEN_ADDRESS=0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
```

---

## 🧪 Step 5: Test the Integration

### 5.1 Start the App

```bash
npm run dev
```

### 5.2 Test Sign-In

1. Go to `http://localhost:3000`
2. Click "Sign In" button
3. Enter your email and create password
4. Verify email if required
5. You should be signed in!

### 5.3 Test Wallet Connection

1. After signing in, click "Connect Wallet"
2. Enter a PIN (e.g., "1234")
3. Wait for wallet creation
4. You should see your wallet address!

### 5.4 Test Giveaway Creation

1. Go to `/create`
2. Fill in giveaway details
3. Click through to create
4. All transactions should be gasless!

---

## 🔍 Troubleshooting

### Error: "No JWKS configuration found"

**Solution:**

1. Check JWKS URL is correct in ChipiPay dashboard
2. Make sure it ends with `/.well-known/jwks.json`
3. Verify "Use Firebase" is toggled OFF
4. Click "Add" to save configuration

### Error: "Failed to create wallet"

**Solution:**

1. Check Clerk keys are correct in `.env.local`
2. Verify user is signed in (check Clerk dashboard)
3. Check browser console for detailed errors
4. Ensure JWKS is configured in ChipiPay

### Error: "Please sign in first"

**Solution:**

1. User must sign in with Clerk before connecting wallet
2. Click "Sign In" button first
3. Complete email verification if required
4. Then try connecting wallet

### Wallet not persisting

**Solution:**

1. Check localStorage in browser dev tools
2. Ensure cookies are enabled
3. Verify user email is consistent
4. Try clearing cache and reconnecting

---

## 🎨 What's Different Now

### Before (Demo Mode)

```typescript
// Used fake bearer token
bearerToken: "demo_token";

// Used timestamp as user ID
userId: `user_${Date.now()}`;
```

### After (Production Mode)

```typescript
// Real JWT token from Clerk
const bearerToken = await getToken();

// Email as user ID
const userId = user.primaryEmailAddress?.emailAddress;
```

---

## 📊 Benefits of This Setup

### For Users

- ✅ **Email login** - Familiar authentication
- ✅ **No seed phrases** - Just email + password
- ✅ **Cross-device** - Same wallet everywhere
- ✅ **Gasless** - No transaction fees
- ✅ **Secure** - Industry-standard auth

### For Developers

- ✅ **Production-ready** - Real authentication
- ✅ **Scalable** - Handles many users
- ✅ **Secure** - JWT validation
- ✅ **Easy** - Clerk handles complexity
- ✅ **Free tier** - Start without cost

---

## 🚀 Next Steps

### 1. Customize Clerk UI

- Go to Clerk dashboard → **Customization**
- Match your brand colors
- Add your logo
- Customize email templates

### 2. Add Social Login

- Enable Google, Twitter, GitHub
- Users can sign in with social accounts
- Wallet still tied to email

### 3. Production Deployment

- Update Clerk URLs for production domain
- Add production JWKS endpoint
- Use production ChipiPay keys
- Test thoroughly!

### 4. Advanced Features

- Add 2FA (two-factor authentication)
- Implement session management
- Add user profiles
- Track analytics

---

## 📚 Resources

### Clerk

- **Dashboard**: https://dashboard.clerk.com
- **Docs**: https://clerk.com/docs
- **JWKS Info**: https://clerk.com/docs/backend-requests/handling/manual-jwt

### ChipiPay

- **Dashboard**: https://dashboard.chipipay.com
- **Docs**: https://docs.chipipay.com
- **JWKS Config**: https://docs.chipipay.com/sdk/nextjs/gasless-clerk-setup

### Your App

- **Local**: http://localhost:3000
- **Sign In**: http://localhost:3000/sign-in
- **Sign Up**: http://localhost:3000/sign-up

---

## ✅ Checklist

Before going live, ensure:

- [ ] Clerk application created
- [ ] Clerk API keys added to `.env.local`
- [ ] JWKS endpoint copied from Clerk
- [ ] JWKS configured in ChipiPay dashboard
- [ ] User identifier set to "Email"
- [ ] Test sign-in works
- [ ] Test wallet connection works
- [ ] Test giveaway creation works
- [ ] Test prize claiming works
- [ ] Email verification enabled (optional)
- [ ] Social login configured (optional)

---

## 🎉 You're All Set!

Your app now has:

- ✅ **Email authentication** via Clerk
- ✅ **JWKS validation** for security
- ✅ **Gasless wallets** via ChipiPay
- ✅ **Production-ready** authentication
- ✅ **User-friendly** email login

Users can now sign in with email and get gasless wallets automatically! 🚀

---

**Need Help?**

- Clerk Support: https://clerk.com/support
- ChipiPay Telegram: https://t.me/+e2qjHEOwImkyZDVh
- Check browser console for errors
- Review this guide step-by-step
