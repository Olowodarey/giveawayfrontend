# Time Unit Conversion Feature ⏰

## Overview
Users can now select expiry time in **Hours**, **Days**, or **Weeks** with automatic conversion to hours for the contract.

## How It Works

### User Interface
Instead of just entering hours, users now have:
1. **Input Field**: Enter the numeric value
2. **Unit Selector**: Choose Hours, Days, or Weeks
3. **Auto-Conversion**: Automatically converts to hours

### Conversion Logic
```typescript
const convertToHours = (value: string, unit: "hours" | "days" | "weeks"): number => {
  const numValue = parseFloat(value) || 0;
  switch (unit) {
    case "hours":
      return numValue;
    case "days":
      return numValue * 24;
    case "weeks":
      return numValue * 24 * 7;
    default:
      return numValue;
  }
};
```

### Examples
- **24 Hours** → 24 hours
- **7 Days** → 168 hours (7 × 24)
- **2 Weeks** → 336 hours (2 × 7 × 24)

## User Experience

### Creating a Giveaway

**Step 1: Select Time Unit**
```
┌─────────────────────────────────┐
│ Expiry Time                     │
├─────────────────────────────────┤
│ ☐ Never Expire ♾️               │
│                                 │
│ ┌──────┐  ┌──────────────┐     │
│ │  7   │  │  Days    ▼   │     │
│ └──────┘  └──────────────┘     │
│                                 │
│ Expires in 7 days (168 hours)  │
└─────────────────────────────────┘
```

**Step 2: See Conversion**
Helper text shows both:
- User-friendly format: "7 days"
- Technical format: "(168 hours)"

**Step 3: Review**
Shows converted value:
- "Expires In: 7 days (168 hours)"

## UI Components

### Input + Dropdown
```tsx
<div className="flex gap-2">
  <Input
    type="number"
    value={expiryValue}
    onChange={(e) => {
      setExpiryValue(e.target.value);
      const hours = convertToHours(e.target.value, expiryUnit);
      handleInputChange("expiryHours", hours.toString());
    }}
    className="flex-1"
  />
  <Select
    value={expiryUnit}
    onValueChange={(value) => {
      setExpiryUnit(value);
      const hours = convertToHours(expiryValue, value);
      handleInputChange("expiryHours", hours.toString());
    }}
  >
    <SelectTrigger className="w-[120px]">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="hours">Hours</SelectItem>
      <SelectItem value="days">Days</SelectItem>
      <SelectItem value="weeks">Weeks</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### Helper Text
Shows dynamic description:
```typescript
const getExpiryDescription = (value: string, unit: string): string => {
  const hours = convertToHours(value, unit);
  
  if (unit === "hours") {
    if (hours < 24) {
      return `Expires in ${hours} hours`;
    } else {
      const days = Math.floor(hours / 24);
      return `Expires in ${days} days (${hours} hours)`;
    }
  } else if (unit === "days") {
    return `Expires in ${value} days (${hours} hours)`;
  } else {
    return `Expires in ${value} weeks (${hours} hours)`;
  }
};
```

## Common Use Cases

### Short-Term Giveaways
- **24 Hours**: Flash sales, daily drops
- **48 Hours**: Weekend promotions
- **72 Hours**: 3-day events

### Medium-Term Giveaways
- **7 Days**: Weekly campaigns
- **14 Days**: Bi-weekly promotions
- **30 Days**: Monthly giveaways

### Long-Term Giveaways
- **4 Weeks**: Monthly campaigns
- **8 Weeks**: Quarterly promotions
- **12 Weeks**: Seasonal events

## State Management

```typescript
// User-facing values
const [expiryValue, setExpiryValue] = useState("24");
const [expiryUnit, setExpiryUnit] = useState<"hours" | "days" | "weeks">("hours");

// Contract value (always in hours)
const [formData, setFormData] = useState({
  expiryHours: "24", // This goes to contract
  // ... other fields
});
```

## Conversion Examples

### Hours
| Input | Unit | Hours | Display |
|-------|------|-------|---------|
| 1 | hours | 1 | "1 hour" |
| 12 | hours | 12 | "12 hours" |
| 24 | hours | 24 | "1 day (24 hours)" |
| 48 | hours | 48 | "2 days (48 hours)" |

### Days
| Input | Unit | Hours | Display |
|-------|------|-------|---------|
| 1 | days | 24 | "1 day (24 hours)" |
| 3 | days | 72 | "3 days (72 hours)" |
| 7 | days | 168 | "7 days (168 hours)" |
| 30 | days | 720 | "30 days (720 hours)" |

### Weeks
| Input | Unit | Hours | Display |
|-------|------|-------|---------|
| 1 | weeks | 168 | "1 week (168 hours)" |
| 2 | weeks | 336 | "2 weeks (336 hours)" |
| 4 | weeks | 672 | "4 weeks (672 hours)" |
| 12 | weeks | 2016 | "12 weeks (2016 hours)" |

## Review Step Display

Smart formatting based on hours:
```typescript
// If exactly divisible by weeks
if (hours % (24 * 7) === 0) {
  const weeks = hours / (24 * 7);
  return `${weeks} week${weeks !== 1 ? 's' : ''} (${hours} hours)`;
}

// If exactly divisible by days
else if (hours % 24 === 0) {
  const days = hours / 24;
  return `${days} day${days !== 1 ? 's' : ''} (${hours} hours)`;
}

// Mixed days and hours
else {
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days}d ${remainingHours}h (${hours} hours)`;
}
```

### Examples:
- **168 hours** → "1 week (168 hours)"
- **336 hours** → "2 weeks (336 hours)"
- **72 hours** → "3 days (72 hours)"
- **25 hours** → "1d 1h (25 hours)"

## Benefits

### For Users
- 🎯 **Intuitive**: Think in days/weeks, not hours
- 📅 **Flexible**: Choose the most natural unit
- ✅ **Clear**: See both formats (days + hours)
- 🚀 **Fast**: Quick selection with dropdown

### For Platform
- 💡 **Better UX**: More user-friendly than hours-only
- 📊 **Common Patterns**: Pre-defined units match common use cases
- 🔄 **Automatic**: Conversion happens seamlessly
- ✨ **Professional**: Shows attention to detail

## Edge Cases Handled

### Zero Value
- Input: 0
- Result: Treated as "Never Expire" if checkbox is checked
- Otherwise: Invalid (min="1")

### Decimal Values
- Input: 1.5 days
- Conversion: 36 hours (1.5 × 24)
- Display: "1.5 days (36 hours)"

### Large Values
- Input: 52 weeks
- Conversion: 8736 hours (52 × 7 × 24)
- Display: "52 weeks (8736 hours)"

### Unit Switching
- User enters "7 days"
- Switches to "hours"
- Value changes to "168"
- Hours remain same (168)

## Testing Guide

### Test Case 1: Hours Input
1. Select "Hours"
2. Enter 24
3. **Expected**: Shows "Expires in 1 day (24 hours)"
4. Review step: "24 hours" or "1 day (24 hours)"

### Test Case 2: Days Input
1. Select "Days"
2. Enter 7
3. **Expected**: Shows "Expires in 7 days (168 hours)"
4. Review step: "7 days (168 hours)"

### Test Case 3: Weeks Input
1. Select "Weeks"
2. Enter 2
3. **Expected**: Shows "Expires in 2 weeks (336 hours)"
4. Review step: "2 weeks (336 hours)"

### Test Case 4: Unit Switching
1. Enter "7" with "Days" selected (168 hours)
2. Switch to "Hours"
3. **Expected**: Value stays 168, unit changes to hours
4. Contract receives: 168 hours

### Test Case 5: Decimal Values
1. Select "Days"
2. Enter 1.5
3. **Expected**: Shows "Expires in 1.5 days (36 hours)"
4. Contract receives: 36 hours

### Test Case 6: Never Expire
1. Check "Never Expire"
2. **Expected**: Input and dropdown disappear
3. Contract receives: 0 hours

## Contract Integration

The contract still receives hours:
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
  formData.expiryHours,  // Always in hours (converted from days/weeks)
];
```

No contract changes needed! The conversion is purely frontend.

## Future Enhancements

1. **Months**: Add months as a unit (30 days)
2. **Custom Presets**: Quick buttons (1 day, 1 week, 1 month)
3. **Calendar Picker**: Visual date/time picker
4. **Timezone Display**: Show expiry in user's timezone
5. **Countdown**: Live countdown timer

## Status

✅ **IMPLEMENTED** - Time unit conversion is live!

Users can now select Hours, Days, or Weeks with automatic conversion to hours. ⏰
