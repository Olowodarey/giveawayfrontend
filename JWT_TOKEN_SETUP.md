# JWT Token Setup for ChipiPay

## 🎯 The Issue

ChipiPay is showing: **"No validation rules configured. Parse a JWT token or add custom validations."**

This means ChipiPay needs to know what fields to validate in the JWT token.

---

## ✅ Solution: Parse a JWT Token

### Step 1: Get Your JWT Token

1. **Start your app**: `npm run dev`
2. **Go to**: http://localhost:3000/get-token (or 3001 if 3000 is busy)
3. **Sign in** with Clerk if not already signed in
4. **Copy the JWT token** displayed on the page

### Step 2: Configure ChipiPay with the Token

1. **Go to**: [ChipiPay Dashboard - JWKS Endpoint](https://dashboard.chipipay.com/configure)
2. Make sure you're in **Production** environment
3. Click **"JWKS Endpoint"** in the sidebar
4. Fill in the form:

```
┌────────────────────────────────────────────────────┐
│ JWKS Configuration                                 │
├────────────────────────────────────────────────────┤
│                                                    │
│ ☐ Use Firebase  (Keep this OFF)                  │
│                                                    │
│ JWKS Endpoint URL                                  │
│ ┌──────────────────────────────────────────────┐  │
│ │ https://content-whale-98.clerk.accounts.dev/ │  │
│ │ .well-known/jwks.json                        │  │
│ └──────────────────────────────────────────────┘  │
│                                                    │
│ User Identifier                                    │
│ ┌──────────────────────────────────────────────┐  │
│ │ Email                                    ▼  │  │
│ └──────────────────────────────────────────────┘  │
│                                                    │
│ JWT Token (For parsing validation rules)          │
│ ┌──────────────────────────────────────────────┐  │
│ │ [PASTE YOUR JWT TOKEN HERE]                  │  │
│ │                                              │  │
│ │ eyJhbGciOiJSUzI1NiIsImtpZCI6Imluc18y...     │  │
│ └──────────────────────────────────────────────┘  │
│                                    [Parse] button  │
│                                                    │
│ Select fields to validate JWT Token (Max 3)       │
│ (This will appear after parsing)                  │
│                                                    │
│                                    [Save] button   │
└────────────────────────────────────────────────────┘
```

5. **Click "Parse"** button
   - ChipiPay will analyze the token
   - It will extract available fields (like `sub`, `email`, `azp`, etc.)
   
6. **Select validation fields** (optional)
   - You can select up to 3 fields to validate
   - Common fields: `sub` (user ID), `email`, `azp` (authorized party)
   - Or leave empty for basic validation

7. **Click "Save"**

---

## 🎯 What Happens When You Parse

When you paste a JWT token and click "Parse", ChipiPay:

1. ✅ Decodes the token
2. ✅ Extracts all available claims/fields
3. ✅ Shows you which fields you can validate
4. ✅ Learns the token structure
5. ✅ Can now validate all future tokens from Clerk

---

## 📋 Example JWT Token Structure

A Clerk JWT token looks like this (decoded):

```json
{
  "azp": "https://content-whale-98.clerk.accounts.dev",
  "exp": 1727712345,
  "iat": 1727712285,
  "iss": "https://content-whale-98.clerk.accounts.dev",
  "nbf": 1727712275,
  "sid": "sess_xxxxxxxxxxxxx",
  "sub": "user_xxxxxxxxxxxxx",
  "email": "user@example.com"
}
```

ChipiPay will extract these fields and let you choose which ones to validate.

---

## ✅ After Configuration

Once you've parsed the token and saved:

1. ✅ ChipiPay knows how to validate Clerk tokens
2. ✅ JWKS endpoint is used to verify token signatures
3. ✅ Selected fields are validated on each request
4. ✅ Your app will work!

---

## 🚀 Test the Complete Flow

1. **Restart your app**: `npm run dev`
2. **Sign in** with Clerk
3. **Click "Connect Wallet"**
4. **Enter PIN**
5. **Success!** 🎉

---

## 🐛 Troubleshooting

### "Failed to parse token"
- Make sure you copied the entire token
- Token should start with `eyJ...`
- Try getting a fresh token from `/get-token` page

### "Invalid token format"
- Check there are no extra spaces
- Make sure you copied from the code block
- Token should be one continuous string

### Still getting "Invalid JWT token"
- Make sure JWKS URL is correct
- Verify "Use Firebase" is OFF
- Check you're in the right environment (Production)
- Try clearing browser cache and signing in again

---

## 📝 Quick Steps Summary

1. Go to: http://localhost:3000/get-token
2. Copy the JWT token
3. Go to: https://dashboard.chipipay.com/configure
4. Click "JWKS Endpoint"
5. Paste token in "JWT Token" field
6. Click "Parse"
7. Click "Save"
8. Done! ✅

---

## 🎯 Why This is Needed

ChipiPay needs to know:
- ✅ What fields exist in your JWT tokens
- ✅ Which fields to validate
- ✅ How to structure validation rules

By parsing a sample token, ChipiPay learns all of this automatically!

---

**Go to `/get-token` now to get your JWT token!** 🚀
