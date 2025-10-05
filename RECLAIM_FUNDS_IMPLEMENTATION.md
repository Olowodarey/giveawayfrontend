# Reclaim Funds Implementation

## Overview
The `reclaim_funds` function has been successfully implemented in the dashboard page. This allows giveaway creators to reclaim unclaimed STRK tokens after a giveaway has expired.

## ✅ Real Data Integration
The dashboard now fetches **real giveaway data from the blockchain**. All mock data has been removed. The reclaim function works with actual giveaways created through the platform.

## Implementation Details

### Contract Function
The smart contract already has the `reclaim_funds` function defined in the ABI:
- **Function name**: `reclaim_funds`
- **Input**: `giveaway_id` (u32)
- **State mutability**: external
- **Location**: `/constants/abi.ts` (lines 238-248)

### Frontend Implementation
Updated file: `/app/dashboard/page.tsx`

#### Key Changes:

1. **Added Required Imports**:
   - `useCallAnyContract` from `@chipi-stack/nextjs`
   - `GIVEAWAY_CONTRACT_ADDRESS` from contract config
   - `useWallet`, `useWalletPin` from wallet context
   - `useAuth` from Clerk
   - `Loader2` icon for loading state

2. **Added State Management**:
   - `isReclaiming` state to track reclaim operation status
   - Wallet and authentication hooks for contract interaction

3. **Implemented `handleReclaimFunds` Function**:
   ```typescript
   const handleReclaimFunds = async (giveaway: Giveaway) => {
     // Validates wallet connection and PIN
     // Gets authentication token
     // Calls reclaim_funds on smart contract
     // Shows success/error toast notifications
   }
   ```

4. **Updated UI Components**:
   - Added loading spinner when reclaiming
   - Disabled button during reclaim operation
   - Works on both mobile and desktop views

## How It Works

1. **User clicks "Reclaim" button** on an expired giveaway with unclaimed prizes
2. **Validation checks**:
   - Wallet must be connected
   - PIN must be available
   - Authentication token must be obtained
3. **Contract call**:
   - Extracts giveaway ID from the display ID (e.g., "GV-001" → "1")
   - Calls `reclaim_funds` with the giveaway ID
4. **Success handling**:
   - Calculates unclaimed amount
   - Shows success notification
   - Funds are returned to creator's wallet

## Requirements

The reclaim button only appears when:
- Giveaway status is "expired"
- There are unclaimed prizes (`claimed < numWinners`)

## Error Handling

The implementation includes comprehensive error handling:
- Wallet not connected
- Missing PIN
- Failed authentication
- Contract execution errors
- User-friendly error messages

## Smart Contract Requirements

For the reclaim to succeed, the smart contract must verify:
- Giveaway has expired
- Caller is the giveaway creator
- There are unclaimed funds available

## Next Steps (Optional)

To make this fully functional with real data:
1. Replace mock giveaway data with actual contract queries
2. Fetch giveaway info using `get_giveaway_info` contract function
3. Add real-time updates after successful reclaim
4. Implement pagination for large numbers of giveaways

## Testing

To test the reclaim functionality:
1. Create a giveaway with a short expiry time
2. Wait for it to expire (or use a test giveaway)
3. Navigate to the dashboard
4. Click the "Reclaim" button on an expired giveaway
5. Confirm the transaction in your wallet
6. Verify funds are returned to your wallet
