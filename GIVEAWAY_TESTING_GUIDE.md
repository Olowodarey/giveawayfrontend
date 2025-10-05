# Giveaway Testing Guide

## ✅ Setup Complete!

Your giveaway platform is now configured with:

- ✅ Updated Giveaway ABI from your contract
- ✅ Clerk authentication with JWT template "giveawayapp"
- ✅ ChipiPay gasless wallet integration
- ✅ Starknet contract integration

---

## 🎯 Contract Functions Available

Based on your ABI, here are the main functions:

### 1. **create_giveaway**

Creates a new giveaway with mystery prizes.

**Parameters:**

- `total_amount` (u256): Total STRK to distribute
- `code_hashes` (Array<felt252>): Hashed claim codes
- `prize_amounts` (Array<u256>): Prize amounts for each code
- `expiry_hours` (u64): Hours until expiry

**Returns:** Giveaway ID (u32)

### 2. **claim_prize**

Allows users to claim their prize with a code.

**Parameters:**

- `giveaway_id` (u32): The giveaway ID
- `code` (felt252): The claim code

### 3. **get_giveaway_info**

Get information about a giveaway.

**Parameters:**

- `giveaway_id` (u32): The giveaway ID

**Returns:** Giveaway struct with:

- creator
- total_amount
- num_winners
- claimed_count
- claimed_amount
- expiry_time
- is_active

### 4. **reclaim_funds**

Creator can reclaim unclaimed funds after expiry.

**Parameters:**

- `giveaway_id` (u32): The giveaway ID

---

## 🚀 How to Test

### Step 1: Ensure JWT Template is Configured

1. Go to Clerk Dashboard → JWT Templates
2. Click on "giveawayapp" template
3. Make sure it has these claims:
   ```json
   {
     "email": "{{user.primary_email_address}}",
     "user_id": "{{user.id}}"
   }
   ```
4. Save if you made changes

### Step 2: Configure ChipiPay JWKS

1. Go to: http://localhost:3000/get-token
2. Copy your JWT token
3. Go to: https://dashboard.chipipay.com/configure
4. Navigate to JWKS Endpoint
5. Fill in:
   - JWKS URL: `https://content-whale-98.clerk.accounts.dev/.well-known/jwks.json`
   - User Identifier: `Email`
   - JWT Token: [Paste your token]
6. Click "Parse" → Click "Save"

### Step 3: Test Wallet Connection

1. Go to: http://localhost:3000
2. Click "Sign In" (top right)
3. Sign in with your email
4. Click "Connect Wallet"
5. Enter a PIN (e.g., "1234")
6. Wallet should be created! ✅

### Step 4: Create a Giveaway

1. Click "Create Giveaway" button
2. Fill in the form:
   - **Total Prize**: 100 (STRK)
   - **Number of Winners**: 5
   - **Distribution**: Equal or Random
   - **Expiry**: 24 hours
3. Click "Next"
4. Review the breakdown
5. Click "Create Giveaway"
6. Wait for transactions:
   - Approve STRK tokens (gasless!)
   - Create giveaway (gasless!)
7. Success! You'll see claim codes

### Step 5: Test Claiming

1. Copy one of the claim codes
2. Go to "Claim Prize" page
3. Paste the code
4. Click "Validate Code"
5. If valid, click "Claim Prize"
6. Prize should be claimed! ✅

---

## 📋 Contract Addresses

From your `.env.local`:

```
Giveaway Contract: 0x077af435e43da39a5c75ea90ea143abfdbb03e812a71803a21b1ad0d065f3847
STRK Token: 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
Network: Starknet Sepolia Testnet
```

---

## 🔍 Debugging

### Check Browser Console

When creating a giveaway, you should see:

```
Token received: eyJhbGci...
User email: your@email.com
User ID: user_xxxxx
Using userId: your@email.com
Creating new wallet with:
- externalUserId: your@email.com
- bearerToken length: 500+
```

### Common Issues

**Issue 1: "Invalid JWT token"**

- Solution: Make sure JWKS is configured in ChipiPay
- Verify JWT template "giveawayapp" exists in Clerk
- Get a fresh token from `/get-token`

**Issue 2: "Failed to create wallet"**

- Solution: Check ChipiPay dashboard for errors
- Verify User Identifier is set to "Email"
- Make sure JWT template includes email claim

**Issue 3: Contract call fails**

- Solution: Check you have STRK tokens in your wallet
- Verify contract addresses are correct
- Check Starknet network status

---

## 🎨 Frontend Flow

### Create Giveaway Flow:

1. User fills form → Step 1
2. Review breakdown → Step 2
3. Approve STRK (gasless via ChipiPay)
4. Create giveaway (gasless via ChipiPay)
5. Show claim codes → Step 3

### Claim Prize Flow:

1. User enters code
2. Validate code
3. Show prize amount
4. Claim prize (gasless via ChipiPay)
5. Show success + confetti!

---

## 📊 What's Gasless?

Thanks to ChipiPay, these are **FREE** for users:

- ✅ Wallet creation
- ✅ Token approvals
- ✅ Creating giveaways
- ✅ Claiming prizes
- ✅ All Starknet transactions

Users only need:

- Email to sign in
- PIN to secure wallet
- Claim code to get prize

No gas fees, no wallet setup, no seed phrases! 🎉

---

## 🔐 Security Features

From your ABI, the contract has:

- ✅ **Access Control**: Role-based permissions
- ✅ **Pausable**: Can pause in emergencies
- ✅ **Upgradeable**: Can upgrade contract logic
- ✅ **Hash Verification**: Codes are hashed
- ✅ **Expiry System**: Time-limited giveaways
- ✅ **One claim per address**: Prevents double claiming

---

## 🎯 Next Steps

### 1. Get Test STRK Tokens

- Go to Starknet Sepolia faucet
- Get test STRK tokens
- Send to your wallet address

### 2. Test Complete Flow

- Create a giveaway
- Share claim codes
- Test claiming
- Verify prizes received

### 3. Monitor Events

Your contract emits:

- `GiveawayCreated`: When giveaway is created
- `PrizeClaimed`: When prize is claimed
- `FundsReclaimed`: When creator reclaims funds

### 4. Production Checklist

- [ ] Test on testnet thoroughly
- [ ] Verify all gasless transactions work
- [ ] Test with multiple users
- [ ] Check claim code security
- [ ] Test expiry and reclaim
- [ ] Deploy to mainnet when ready

---

## 📚 Resources

- **Starknet Explorer**: https://sepolia.starkscan.co
- **ChipiPay Docs**: https://docs.chipipay.com
- **Clerk Docs**: https://clerk.com/docs
- **Your Contract**: https://sepolia.starkscan.co/contract/0x077af435e43da39a5c75ea90ea143abfdbb03e812a71803a21b1ad0d065f3847

---

## ✅ Success Checklist

Before going live:

- [ ] JWT template "giveawayapp" created in Clerk
- [ ] JWKS configured in ChipiPay
- [ ] Wallet connection works
- [ ] Can create giveaway
- [ ] Can claim prize
- [ ] All transactions are gasless
- [ ] Claim codes work correctly
- [ ] Expiry system works
- [ ] Reclaim funds works

---

**Everything is set up! Start testing your giveaway platform!** 🚀

Run `npm run dev` and visit http://localhost:3000 to begin!
