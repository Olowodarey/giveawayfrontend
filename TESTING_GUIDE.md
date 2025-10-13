# Testing Guide - Automatic Wallet Creation

## Quick Test Scenarios

### Scenario 1: New User First Sign-In ✨
**Expected Behavior:** Wallet is created automatically

1. Open the app in incognito/private window
2. Click "Sign In" button
3. Sign in with a NEW Gmail account (never used before)
4. **Expected Results:**
   - User is signed in
   - After 2-3 seconds, you should see "Wallet Ready! 🎉" toast
   - Header shows wallet address (e.g., "0x1234...5678")
   - User can immediately go to Claim page and claim prizes
   - No "Connect Wallet" prompts

**Check Console:**
```
Auto-connecting wallet for user: [email]
Creating new wallet automatically...
Wallet created successfully
Wallet auto-connected successfully!
```

---

### Scenario 2: Existing User Returns 🔄
**Expected Behavior:** Wallet is retrieved automatically

1. Sign out if signed in
2. Sign in with the SAME Gmail account from Scenario 1
3. **Expected Results:**
   - User is signed in
   - Wallet appears almost instantly (< 1 second)
   - Same wallet address as before
   - No toast (wallet already existed)
   - Can claim prizes immediately

**Check Console:**
```
Auto-connecting wallet for user: [email]
Found existing wallet
Wallet auto-connected successfully!
```

---

### Scenario 3: Claim Prize Flow 🎁
**Expected Behavior:** Seamless claiming without wallet prompts

1. Sign in with Gmail
2. Wait for wallet to auto-connect (2-3 seconds max)
3. Go to `/claim` page
4. Enter giveaway name and claim code
5. Click "Validate Code"
6. Click "Claim Prize"
7. **Expected Results:**
   - No "Connect Wallet" prompts
   - Prize is claimed successfully
   - Transaction completes without gas fees
   - Confetti animation plays
   - Prize amount is displayed

---

### Scenario 4: Manual Connect (Optional) 🔧
**Expected Behavior:** Users can still manually connect if desired

1. Sign in with Gmail
2. Before auto-connect completes, click "Manual Connect" button
3. Enter a custom PIN (e.g., "1234")
4. Click "Connect"
5. **Expected Results:**
   - Wallet is created/accessed with custom PIN
   - This PIN overrides the auto-generated one
   - User must use THIS PIN for all future operations
   - Wallet address appears in header

**⚠️ Warning:** If user manually connects, they MUST remember their PIN!

---

### Scenario 5: Multiple Tabs 📑
**Expected Behavior:** Wallet persists across tabs

1. Sign in and wait for wallet auto-connect
2. Open app in a new tab (same browser)
3. **Expected Results:**
   - Wallet is already connected (from localStorage)
   - No re-creation needed
   - Same wallet address in both tabs

---

### Scenario 6: Page Refresh 🔄
**Expected Behavior:** Wallet persists after refresh

1. Sign in and wait for wallet auto-connect
2. Refresh the page (F5 or Cmd+R)
3. **Expected Results:**
   - User still signed in (Clerk session)
   - Wallet still connected (from localStorage)
   - No re-creation needed
   - No toast shown (not first time)

---

### Scenario 7: Sign Out & Sign In 🚪
**Expected Behavior:** Clean state management

1. Sign in and wait for wallet auto-connect
2. Click user avatar → Sign Out
3. Sign in again with same account
4. **Expected Results:**
   - Wallet is retrieved (not re-created)
   - Same wallet address
   - Can use wallet immediately

---

## Console Debugging

### Successful Auto-Connect:
```
Auto-connecting wallet for user: user@example.com
Creating new wallet automatically...
Wallet created successfully
Wallet auto-connected successfully!
```

### Existing Wallet Retrieved:
```
Auto-connecting wallet for user: user@example.com
Found existing wallet
Wallet auto-connected successfully!
```

### Auto-Connect Failed (Graceful):
```
Auto-connect failed: [error message]
```
Note: User can still manually connect

---

## Common Issues & Solutions

### Issue: "Setting Up Wallet..." never completes
**Possible Causes:**
- ChipiPay API key is invalid
- JWKS endpoint not configured in ChipiPay dashboard
- Clerk JWT template "giveawayapp" not created
- Network issues

**Solution:**
1. Check browser console for errors
2. Verify environment variables
3. Check ChipiPay dashboard configuration
4. Try manual connect to see detailed error

---

### Issue: "Wrong Password" when claiming
**Possible Causes:**
- User manually connected with a custom PIN
- User trying to use different PIN than before

**Solution:**
- User must use the SAME PIN they used when creating wallet
- Clear localStorage and sign in again to reset to auto-PIN
- Or use manual connect with correct PIN

---

### Issue: Wallet address changes on refresh
**Possible Causes:**
- localStorage is being cleared
- Browser in private/incognito mode
- Different PIN being used

**Solution:**
- Don't use incognito for persistent testing
- Check if localStorage is enabled
- Ensure deterministic PIN generation is working

---

### Issue: No toast shown on first sign-in
**Possible Causes:**
- Wallet was already created (not first time)
- localStorage flag already set
- Toast component not rendering

**Solution:**
- Clear localStorage: `localStorage.clear()`
- Check if toast component is in layout
- Look for toast in UI (might be subtle)

---

## Testing Checklist

### Basic Functionality
- [ ] New user can sign in with Gmail
- [ ] Wallet is created automatically (2-3 seconds)
- [ ] Toast notification appears on first wallet creation
- [ ] Wallet address shows in header
- [ ] Existing user's wallet is retrieved instantly
- [ ] Wallet persists across page refreshes
- [ ] Wallet persists across tabs

### Claim Flow
- [ ] User can claim prize without manual wallet connect
- [ ] No "Connect Wallet" prompts during claim
- [ ] Transaction completes successfully
- [ ] No gas fees charged
- [ ] Prize amount is displayed correctly

### Manual Connect (Optional)
- [ ] Manual connect button is visible
- [ ] Manual connect dialog works
- [ ] Custom PIN can be set
- [ ] Custom PIN persists

### Error Handling
- [ ] Auto-connect failures are silent (no user-facing errors)
- [ ] Manual connect shows errors properly
- [ ] Invalid PIN shows error message
- [ ] Network errors are handled gracefully

### UI/UX
- [ ] Loading states are clear
- [ ] Button text is appropriate
- [ ] No confusing wallet prompts
- [ ] Smooth user experience

---

## Performance Benchmarks

### First-Time Wallet Creation
- **Expected:** 2-3 seconds
- **Acceptable:** < 5 seconds
- **Slow:** > 5 seconds (check network/API)

### Existing Wallet Retrieval
- **Expected:** < 1 second
- **Acceptable:** < 2 seconds
- **Slow:** > 2 seconds (check network/API)

### Claim Transaction
- **Expected:** 3-5 seconds
- **Acceptable:** < 10 seconds
- **Slow:** > 10 seconds (check Starknet network)

---

## Browser Compatibility

Test on:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (iOS/Android)
- [ ] Mobile Safari (iOS)

---

## Security Testing

- [ ] PINs are not exposed in console (production)
- [ ] Wallet data is encrypted in localStorage
- [ ] JWT tokens are not logged (production)
- [ ] No sensitive data in network tab
- [ ] HTTPS is enforced (production)

---

## Monitoring

### What to Monitor:
1. **Wallet Creation Success Rate**
   - Target: > 95%
   - Alert if: < 90%

2. **Auto-Connect Time**
   - Target: < 3 seconds
   - Alert if: > 5 seconds

3. **Claim Success Rate**
   - Target: > 90%
   - Alert if: < 80%

4. **Error Rates**
   - Target: < 5%
   - Alert if: > 10%

### Key Metrics:
- Time to first wallet creation
- Wallet retrieval success rate
- Auto-connect failure rate
- Manual connect usage rate
- Claim transaction success rate

---

## Support Scenarios

### User: "I can't claim my prize"
**Troubleshooting:**
1. Are you signed in? → Check Clerk auth
2. Do you see a wallet address in header? → Check auto-connect
3. What error message do you see? → Check specific error
4. Try manual connect with custom PIN
5. Clear cache and try again

### User: "Where is my wallet?"
**Response:**
- Your wallet is created automatically when you sign in
- You can see your wallet address in the header (top right)
- Click on the wallet address to copy it or view on Starkscan
- No seed phrase needed - we manage it securely for you

### User: "How do I export my wallet?"
**Response:**
- Currently, wallets are managed by ChipiPay for security
- You can view your wallet on Starkscan
- For advanced users, we can add export functionality
- Contact support for wallet migration assistance

---

## Next Steps After Testing

If all tests pass:
1. ✅ Deploy to staging
2. ✅ Run smoke tests on staging
3. ✅ Get user feedback
4. ✅ Monitor metrics
5. ✅ Deploy to production

If tests fail:
1. ❌ Document the failure
2. ❌ Check console errors
3. ❌ Verify configuration
4. ❌ Fix the issue
5. ❌ Re-test
