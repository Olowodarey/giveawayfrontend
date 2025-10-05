# Quick Setup Guide - Clerk + ChipiPay

## 🚀 5-Minute Setup

### Step 1: Clerk Setup (2 minutes)

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Create application → Enable **Email** authentication
3. Copy API keys:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   CLERK_SECRET_KEY=sk_test_xxxxx
   ```
4. Copy JWKS URL (in API Keys → Advanced):
   ```
   https://your-app.clerk.accounts.dev/.well-known/jwks.json
   ```

### Step 2: ChipiPay Setup (2 minutes)

1. Go to [dashboard.chipipay.com/configure](https://dashboard.chipipay.com)
2. Navigate to **JWKS Endpoint**
3. Configure:
   - **Use Firebase**: OFF
   - **JWKS Endpoint URL**: [Paste Clerk JWKS URL]
   - **User Identifier**: Email
   - Click **Add**

### Step 3: Update `.env.local` (1 minute)

```env
# Add Clerk keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Your ChipiPay key (already there)
NEXT_PUBLIC_CHIPI_API_KEY=pk_prod_5e5488f15194f4b7df58d3ef616461f3
```

### Step 4: Test (30 seconds)

```bash
npm run dev
```

1. Click "Sign In"
2. Create account with email
3. Click "Connect Wallet"
4. Enter PIN
5. Done! 🎉

---

## 📸 ChipiPay Dashboard Screenshot Reference

Based on your screenshot, here's what to fill:

```
┌─────────────────────────────────────────┐
│ JWKS Configuration                      │
├─────────────────────────────────────────┤
│ ☐ Use Firebase                          │
│                                         │
│ JWKS Endpoint URL                       │
│ [Paste Clerk JWKS URL here]           │
│                                         │
│ User Identifier (Email) ▼               │
│                                         │
│ JWT Token (leave empty)                │
│                                         │
│                    [Add] button         │
└─────────────────────────────────────────┘
```

---

## ✅ Verification

After setup, you should see:
- ✅ No "No JWKS configuration found" error
- ✅ "Sign In" button in header
- ✅ Clerk sign-in page works
- ✅ "Connect Wallet" appears after sign-in
- ✅ Wallet creation works with PIN

---

## 🐛 Quick Fixes

**Error: "No JWKS configuration found"**
→ Add JWKS URL in ChipiPay dashboard

**Error: "Please sign in first"**
→ Click "Sign In" button before connecting wallet

**Error: "Failed to get authentication token"**
→ Check Clerk keys in `.env.local`

---

## 📚 Full Guide

See `CLERK_CHIPI_SETUP.md` for detailed instructions.

---

**Ready to test!** 🚀
