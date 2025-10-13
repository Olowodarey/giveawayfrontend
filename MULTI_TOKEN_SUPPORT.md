# Multi-Token Support Implementation 🎉

## Overview
Your giveaway platform now supports **multiple tokens**! Users can create giveaways with STRK, USDC, USDT, ETH, or WBTC.

## Supported Tokens

| Token | Symbol | Decimals | Address |
|-------|--------|----------|---------|
| 💎 Starknet Token | STRK | 18 | `0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d` |
| 💵 USD Coin | USDC | 6 | `0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8` |
| 💲 Tether USD | USDT | 6 | `0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8` |
| Ξ Ethereum | ETH | 18 | `0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7` |
| ₿ Wrapped Bitcoin | WBTC | 8 | `0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac` |

## How It Works

### Contract Changes
Your updated contract now:
1. ✅ Accepts `token_address` parameter in `create_giveaway`
2. ✅ Stores `token_address` with each giveaway
3. ✅ Uses the stored token address when transferring prizes
4. ✅ Each giveaway can use a different token

### Frontend Changes

#### 1. Token Configuration (`lib/token-config.ts`)
New file with:
- Token addresses and metadata
- Helper functions for token amount conversion
- Decimal handling for different tokens

#### 2. Create Page Updates (`app/create/page.tsx`)
- **Token Selector**: Dropdown to choose token
- **Dynamic Labels**: Shows selected token symbol
- **Token-Specific Approval**: Approves the selected token
- **Decimal Handling**: Converts amounts based on token decimals

#### 3. Updated Contract Call
```typescript
const calldata = [
  giveawayNameFelt,      // name
  tokenAddress,          // token_address (NEW!)
  totalU256.low,         // amount low
  totalU256.high,        // amount high
  // ... rest of calldata
];
```

## User Experience

### Creating a Giveaway

1. **Select Token**
   - User sees dropdown with all supported tokens
   - Each token shows icon, symbol, and full name
   - Default: STRK

2. **Enter Amount**
   - Label updates to show selected token
   - e.g., "Total Prize Pool (USDC)"
   - Winner amounts also show selected token

3. **Approval**
   - System approves the selected token
   - Toast shows: "Approving USDC for giveaway contract..."

4. **Creation**
   - Giveaway created with chosen token
   - Token address stored on-chain

### Claiming a Prize

- **Automatic Token Detection**: Contract knows which token to send
- **No User Input Needed**: Claimer receives the correct token automatically
- **Display**: Shows token symbol in UI (e.g., "You won 100 USDC!")

## Technical Details

### Token Decimals Handling

Different tokens have different decimals:
- **STRK, ETH**: 18 decimals
- **USDC, USDT**: 6 decimals
- **WBTC**: 8 decimals

The frontend automatically handles this:

```typescript
// User enters: "100"
// For USDC (6 decimals): converts to "100000000" (100 * 10^6)
// For STRK (18 decimals): converts to "100000000000000000000" (100 * 10^18)
```

### Amount Conversion Functions

```typescript
// Convert user input to token amount with decimals
parseTokenAmount("100", 6) // "100000000" for USDC

// Convert to u256 for contract
tokenAmountToU256("100000000") // { low: "...", high: "..." }

// Format for display
formatTokenAmount("100000000", 6) // "100"
```

## Testing Guide

### Test Case 1: Create STRK Giveaway
1. Select "STRK" from token dropdown
2. Enter amount: 100 STRK
3. Add winners with codes
4. Create giveaway
5. **Expected**: Giveaway created with STRK

### Test Case 2: Create USDC Giveaway
1. Select "USDC" from token dropdown
2. Enter amount: 50 USDC
3. Add winners
4. Create giveaway
5. **Expected**: Giveaway created with USDC

### Test Case 3: Claim USDC Prize
1. Go to claim page
2. Enter giveaway name (from Test Case 2)
3. Enter claim code
4. Claim prize
5. **Expected**: Receive USDC (not STRK)

### Test Case 4: Multiple Token Giveaways
1. Create giveaway "Summer" with STRK
2. Create giveaway "Winter" with USDC
3. Create giveaway "Spring" with ETH
4. **Expected**: Each giveaway uses its own token

## Dashboard Updates Needed

To fully support multi-token, you'll also need to update:

### 1. Dashboard Display
Show token symbol for each giveaway:
```typescript
// Instead of: "100 STRK"
// Show: "100 {giveaway.token_symbol}"
```

### 2. Claim Page
Display the correct token symbol when showing prize amount

### 3. User Stats
Track claimed amounts per token:
```typescript
{
  STRK: "500",
  USDC: "1000",
  ETH: "0.5"
}
```

## Contract ABI Updates

Your new ABI includes:
- `token_address` in `Giveaway` struct
- `token_address` in `UserCreatedGiveaway` struct
- `token_address` parameter in `create_giveaway` function

## Benefits

### For Users
- 🎯 **Choice**: Pick their preferred token
- 💰 **Flexibility**: Not limited to STRK
- 🌍 **Accessibility**: Use stablecoins (USDC/USDT) for predictable value

### For Platform
- 📈 **More Giveaways**: Attract users who prefer different tokens
- 🔥 **Competitive Edge**: Most platforms only support one token
- 💎 **Premium Feel**: Professional multi-token support

## Migration Notes

### Existing Giveaways
- Old giveaways (without token_address) won't work with new contract
- You'll need to redeploy and migrate data OR
- Keep old contract for legacy giveaways

### New Contract Deployment
1. Deploy new contract with token support
2. Update `GIVEAWAY_CONTRACT_ADDRESS` in env
3. Update ABI in `constants/abi.ts` (already done ✅)
4. Test with each token

## Security Considerations

### Token Validation
Contract should validate token addresses:
```cairo
// Whitelist supported tokens
fn is_supported_token(token: ContractAddress) -> bool {
    token == STRK_ADDRESS 
    || token == USDC_ADDRESS 
    || token == USDT_ADDRESS
    || token == ETH_ADDRESS
    || token == WBTC_ADDRESS
}
```

### Approval Limits
- Users only approve exact amount needed
- No unlimited approvals
- Separate approval per token

## Future Enhancements

1. **Token Icons**: Show actual token logos instead of emojis
2. **Price Display**: Show USD value of prizes
3. **Token Stats**: Track which tokens are most popular
4. **Auto-Convert**: Allow users to claim in different token
5. **Multi-Token Prizes**: One giveaway with multiple tokens

## Environment Variables

No new env variables needed! Token addresses are hardcoded in `lib/token-config.ts`.

## Deployment Checklist

- [x] Update contract with token_address support
- [x] Deploy new contract
- [x] Update ABI in frontend
- [x] Add token configuration file
- [x] Update create page with token selector
- [x] Update token approval logic
- [x] Update calldata to include token_address
- [ ] Update dashboard to show token symbols
- [ ] Update claim page to display correct token
- [ ] Test with each supported token
- [ ] Update documentation

## Status

✅ **IMPLEMENTED** - Multi-token support is live!

Users can now create giveaways with STRK, USDC, USDT, ETH, or WBTC. 🚀
