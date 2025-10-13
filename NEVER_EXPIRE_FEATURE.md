# Never Expire Feature ♾️

## Overview
Giveaways can now be set to **never expire**! This is perfect for long-running campaigns or permanent giveaways.

## How It Works

### Contract Logic
```cairo
// Calculate expiry: 0 means no expiry (set to max u64), otherwise calculate from hours
let expiry = if expiry_hours == 0 {
    0xffffffffffffffff_u64 // Max u64 value = no expiry
} else {
    get_block_timestamp() + (expiry_hours * 3600)
};
```

When `expiry_hours` is `0`, the contract sets expiry to the maximum u64 value (`0xffffffffffffffff`), which effectively means it never expires.

### Frontend Implementation

#### Checkbox Control
Users can check "Never Expire ♾️" checkbox:
- **Checked**: Sets `expiryHours` to `"0"`
- **Unchecked**: Defaults to `"24"` hours

#### UI Behavior
```typescript
<Checkbox
  id="neverExpire"
  checked={neverExpire}
  onCheckedChange={(checked) => {
    setNeverExpire(checked as boolean);
    if (checked) {
      handleInputChange("expiryHours", "0");
    } else {
      handleInputChange("expiryHours", "24");
    }
  }}
/>
```

When checked:
- Input field is hidden
- Shows warning message
- Expiry hours set to 0

When unchecked:
- Input field appears
- User can enter custom hours
- Shows normal expiry message

## User Experience

### Creating a Giveaway

**Option 1: With Expiry (Default)**
1. Leave "Never Expire" unchecked
2. Enter hours (e.g., 24, 48, 168)
3. After expiry, creator can reclaim unclaimed funds

**Option 2: Never Expire**
1. Check "Never Expire ♾️"
2. Input field disappears
3. Warning shown: "This giveaway will never expire. You won't be able to reclaim funds."

### Review Step
Shows expiry status clearly:
- **With Expiry**: "Expires In: 24 hours"
- **Never Expire**: "Expires In: Never ♾️"

## Important Notes

### ⚠️ No Reclaim for Never Expire
If a giveaway is set to never expire:
- Creator **CANNOT** reclaim unclaimed funds
- Funds are locked forever until claimed
- This is by design - permanent giveaways

### Contract Validation
```cairo
fn reclaim_funds(ref self: ContractState, name: felt252) {
    // ...
    
    // Must be expired (if expiry is set)
    // If expiry_time is max u64, it means no expiry, so reclaim is not allowed
    assert(giveaway.expiry_time != 0xffffffffffffffff_u64, Errors::NO_EXPIRY_SET);
    assert(get_block_timestamp() > giveaway.expiry_time, Errors::GIVEAWAY_NOT_EXPIRED);
    
    // ...
}
```

The contract explicitly prevents reclaiming funds from never-expire giveaways.

## Use Cases

### Perfect For:
1. **Permanent Campaigns**
   - Brand awareness campaigns
   - Community rewards
   - Loyalty programs

2. **First-Come-First-Serve**
   - Limited quantity drops
   - Flash sales
   - Exclusive access codes

3. **Long-Term Engagement**
   - Ongoing community rewards
   - Referral programs
   - Achievement unlocks

### Not Recommended For:
1. **Time-Sensitive Promotions**
   - Holiday campaigns
   - Event-specific giveaways
   - Limited-time offers

2. **Budget-Conscious Campaigns**
   - When you need to reclaim unused funds
   - Testing/experimental giveaways
   - Small budgets

## UI Messages

### Helper Text
**When Never Expire is checked:**
```
"This giveaway will never expire. You won't be able to reclaim funds."
```

**When Never Expire is unchecked:**
```
"Hours from now until giveaway expires. After expiry, you can reclaim unclaimed funds."
```

### Review Step
Shows clear indication:
- ✅ "Expires In: Never ♾️"
- ✅ "Expires In: 48 hours"

## Technical Details

### State Management
```typescript
const [neverExpire, setNeverExpire] = useState(false);
const [formData, setFormData] = useState<GiveawayData>({
  name: "",
  totalPrize: "",
  expiryHours: "24",  // Default 24 hours
  selectedToken: "STRK",
});
```

### Calldata
```typescript
const calldata = [
  giveawayNameFelt,
  tokenAddress,
  totalU256.low,
  totalU256.high,
  codeHashes.length.toString(),
  ...codeHashes,
  winners.length.toString(),
  ...prizeAmountsFlattened,
  formData.expiryHours,  // "0" for never expire, or number of hours
];
```

### Contract Storage
```cairo
struct Giveaway {
    name: felt252,
    creator: ContractAddress,
    token_address: ContractAddress,
    total_amount: u256,
    num_winners: u32,
    claimed_count: u32,
    claimed_amount: u256,
    created_at: u64,
    expiry_time: u64,  // 0xffffffffffffffff for never expire
    is_active: bool,
}
```

## Testing Guide

### Test Case 1: Create Never Expire Giveaway
1. Go to Create page
2. Fill in giveaway details
3. Check "Never Expire ♾️"
4. Verify input field disappears
5. Verify warning message shows
6. Go to Review step
7. Verify shows "Never ♾️"
8. Create giveaway
9. **Expected**: Giveaway created with max u64 expiry

### Test Case 2: Create Normal Expiry Giveaway
1. Go to Create page
2. Fill in giveaway details
3. Leave "Never Expire" unchecked
4. Enter 48 hours
5. Go to Review step
6. Verify shows "48 hours"
7. Create giveaway
8. **Expected**: Giveaway expires in 48 hours

### Test Case 3: Toggle Never Expire
1. Check "Never Expire"
2. Verify expiry hours = 0
3. Uncheck "Never Expire"
4. Verify expiry hours = 24 (default)
5. Enter custom value (e.g., 72)
6. Check "Never Expire" again
7. Verify expiry hours = 0
8. **Expected**: Checkbox properly controls expiry value

### Test Case 4: Try to Reclaim Never Expire
1. Create giveaway with "Never Expire"
2. Wait for some time
3. Try to reclaim funds
4. **Expected**: Contract rejects with "NO_EXPIRY_SET" error

### Test Case 5: Reclaim Normal Expiry
1. Create giveaway with 1 hour expiry
2. Wait 1+ hours
3. Try to reclaim funds
4. **Expected**: Successfully reclaim unclaimed funds

## Dashboard Display

### Active Giveaways
Show expiry status:
```typescript
{giveaway.expiry_time === 0xffffffffffffffff_u64 
  ? "Never Expires ♾️" 
  : `Expires in ${calculateTimeLeft(giveaway.expiry_time)}`}
```

### Reclaimable Giveaways
Filter out never-expire giveaways:
```cairo
fn get_reclaimable_giveaways(
    self: @ContractState, user: ContractAddress,
) -> Array<UserCreatedGiveaway> {
    // ...
    
    // Skip giveaways with no expiry (max u64)
    let is_expired = giveaway.expiry_time != 0xffffffffffffffff_u64
        && current_time > giveaway.expiry_time;
    
    if giveaway.is_active && is_expired && unclaimed_amount > 0 {
        // Can reclaim
    }
    
    // ...
}
```

## Benefits

### For Creators
- 🎯 **Flexibility**: Choose between temporary and permanent campaigns
- 💰 **Commitment**: Show long-term commitment to community
- 🚀 **Simplicity**: No need to worry about expiry management

### For Claimers
- ⏰ **No Rush**: Can claim anytime
- 🎁 **Guaranteed**: Funds won't be reclaimed
- 💎 **Trust**: Shows creator's commitment

## Security Considerations

### Irreversible Decision
- Once created with never expire, cannot be changed
- Funds are permanently locked until claimed
- Creator should be absolutely sure

### Recommendation
Add confirmation dialog:
```typescript
if (neverExpire) {
  const confirmed = confirm(
    "Are you sure? You won't be able to reclaim unclaimed funds from a never-expire giveaway."
  );
  if (!confirmed) return;
}
```

## Future Enhancements

1. **Edit Expiry**: Allow changing expiry before any claims
2. **Extend Expiry**: Allow extending expiry time
3. **Emergency Reclaim**: Admin function to reclaim in emergencies
4. **Partial Reclaim**: Reclaim after certain percentage claimed

## Status

✅ **IMPLEMENTED** - Never Expire feature is live!

Users can now create giveaways that never expire by checking a simple checkbox. ♾️
