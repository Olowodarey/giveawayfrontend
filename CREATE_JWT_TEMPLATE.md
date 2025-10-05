# Create JWT Template in Clerk

## 🎯 Why You Need This

Clerk's default JWT tokens might not include all the claims ChipiPay needs. You need to create a **custom JWT template** with the right claims.

---

## ✅ Step-by-Step Guide

### Step 1: Go to Clerk Dashboard

1. Visit: https://dashboard.clerk.com
2. Select your application: **content-whale-98**

### Step 2: Navigate to JWT Templates

1. In the left sidebar, find **"Sessions"** section
2. Click on **"JWT Templates"**
3. You'll see a page to manage JWT templates

### Step 3: Create New Template

1. Click **"New template"** button
2. Fill in the form:

```
┌─────────────────────────────────────────────────┐
│ Create JWT Template                             │
├─────────────────────────────────────────────────┤
│                                                 │
│ Name *                                          │
│ ┌─────────────────────────────────────────────┐ │
│ │ chipi                                       │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Token lifetime (seconds) *                      │
│ ┌─────────────────────────────────────────────┐ │
│ │ 3600                                        │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Claims *                                        │
│ ┌─────────────────────────────────────────────┐ │
│ │ {                                           │ │
│ │   "email": "{{user.primary_email_address}}",│ │
│ │   "user_id": "{{user.id}}"                  │ │
│ │ }                                           │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│                            [Create] button      │
└─────────────────────────────────────────────────┘
```

### Step 4: Exact Values to Enter

**Name:**
```
chipi
```

**Token lifetime:**
```
3600
```

**Claims (copy this exactly):**
```json
{
  "email": "{{user.primary_email_address}}",
  "user_id": "{{user.id}}"
}
```

### Step 5: Save

Click the **"Create"** or **"Save"** button

---

## 📋 What These Claims Do

- **`email`**: Includes the user's email address in the JWT token
  - ChipiPay uses this to identify users (matches your "Email" configuration)
  
- **`user_id`**: Includes Clerk's user ID
  - Backup identifier in case email isn't available

---

## 🔍 Verify Template Created

After creating, you should see:
- ✅ Template named "chipi" in the list
- ✅ Status: Active
- ✅ Claims showing email and user_id

---

## 🎯 What Happens Next

Once the template is created:

1. **Your app will use it**: Code is already updated to use `getToken({ template: "chipi" })`
2. **Tokens will include email**: ChipiPay can now validate users by email
3. **Everything should work**: Wallet creation will succeed!

---

## 🚀 Test After Creating Template

1. **Create the JWT template** in Clerk (as described above)
2. **Restart your app**: `npm run dev`
3. **Clear browser cache**: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
4. **Sign in again** to get a fresh token
5. **Try connecting wallet** - should work now! ✅

---

## 🐛 Troubleshooting

### "Template not found" error

**Solution**: Make sure the template name is exactly `chipi` (lowercase, no spaces)

### Still getting "Invalid JWT token"

**Solution**: 
1. Make sure you created the template
2. Sign out and sign in again to get a new token
3. Check `/debug-token` page to verify the token has the email claim

### Claims not showing in token

**Solution**:
1. Double-check the claims JSON syntax
2. Make sure you used the exact format:
   ```json
   {
     "email": "{{user.primary_email_address}}",
     "user_id": "{{user.id}}"
   }
   ```
3. Save the template again

---

## 📸 Visual Guide

Your JWT template page should look like this:

1. **Before**: Empty list or default templates
2. **After**: "chipi" template listed with:
   - Name: chipi
   - Lifetime: 3600s
   - Claims: 2 custom claims

---

## ✅ Checklist

Before testing, make sure:

- [ ] Created JWT template named "chipi" in Clerk dashboard
- [ ] Added email and user_id claims
- [ ] Template is active/saved
- [ ] Restarted your dev server
- [ ] Cleared browser cache
- [ ] Signed in again

---

## 🎉 After This Works

Once wallet creation works:

1. ✅ Users can connect wallets with PIN
2. ✅ Create giveaways (gasless!)
3. ✅ Claim prizes (gasless!)
4. ✅ All transactions free via ChipiPay

---

**Create the JWT template now and you're done!** 🚀

The code is already updated to use it - just need to create it in Clerk dashboard!
