# 🔍 Debug: Claim Amount Showing 0

## 🎯 Issue

Prize amount shows "0" instead of the actual amount (e.g., 0.01 STRK)

---

## 🧪 How to Debug

### **Step 1: Run the App**

```bash
npm run dev
```

### **Step 2: Open Browser Console**

1. Open your browser
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Keep it open while claiming

### **Step 3: Claim a Prize**

1. Go to `http://localhost:3000/claim`
2. Enter giveaway name and claim code
3. Click "Claim Prize"
4. **Watch the console logs**

---

## 📊 What to Look For

### **Console Output Structure**

The console will show detailed logs in this order:

```
=== FULL TRANSACTION RESULT ===
Result keys: [...]
Full result: {...}

=== EVENTS ===
Number of events: X
Transaction events: [...]

=== PRIZE CLAIMED EVENT ===
PrizeClaimed event found: true/false
PrizeClaimed event: {...}

Full event data: [...]
Event data length: X
Amount low (raw): ...
Amount high (raw): ...

u256ToStrk - Low: ...
u256ToStrk - High: ...
u256ToStrk - Total Wei: ...
u256ToStrk - Result: X STRK

Final extracted amount: X STRK
```

---

## 🔍 Key Things to Check

### **1. Check if Events Exist**

Look for:
```
Number of events: X
```

- **If 0**: No events in transaction (problem!)
- **If > 0**: Events exist (good!)

### **2. Check if PrizeClaimed Event Found**

Look for:
```
PrizeClaimed event found: true
```

- **If false**: Event not found (need to check event structure)
- **If true**: Event found (good!)

### **3. Check Event Data**

Look for:
```
Full event data: ["123", "456", "0x...", "10000000000000000", "0"]
```

The last 2 elements should be the amount:
- **Second to last**: Amount low (in wei)
- **Last**: Amount high (usually 0 for small amounts)

### **4. Check Amount Conversion**

Look for:
```
u256ToStrk - Low: 10000000000000000
u256ToStrk - High: 0
u256ToStrk - Total Wei: 10000000000000000
u256ToStrk - Result: 0.01 STRK
```

This shows the conversion process.

---

## 🐛 Common Issues & Solutions

### **Issue 1: No Events**

**Symptom:**
```
Number of events: 0
```

**Cause:** Transaction result doesn't include events

**Solution:** Events might be in a different location. Check:
```
Full result: {...}
```

Look for events in different properties.

### **Issue 2: Event Not Found**

**Symptom:**
```
PrizeClaimed event found: false
```

**Cause:** Event filtering not matching

**Solution:** Check the available events:
```
Available events: [
  { from: "0x...", keys: [...], dataLength: X }
]
```

The system will try all events as fallback.

### **Issue 3: Amount Shows 0**

**Symptom:**
```
u256ToStrk - Result: 0 STRK
```

**Cause:** Amount values are 0 or in wrong format

**Check:**
```
Amount low (raw): ... Type: ...
Amount high (raw): ... Type: ...
```

**If both are "0" or undefined:**
- Amount is at wrong indices
- System will try alternative indices

**Look for:**
```
Trying alternative indices...
Testing indices [0, 1]: X
Testing indices [1, 2]: X
...
Found non-zero amount at indices: X, Y
```

### **Issue 4: Wrong Decimal Format**

**Symptom:**
```
u256ToStrk - Total Wei: 10000000000000000
u256ToStrk - Result: 0 STRK
```

**Cause:** Conversion issue

**Check the u256ToStrk logs** for errors

---

## 📋 Debugging Checklist

Copy this and check off as you debug:

```
[ ] Console is open (F12)
[ ] Claimed a prize
[ ] Saw "=== FULL TRANSACTION RESULT ===" in console
[ ] Saw "Number of events: X" (X > 0)
[ ] Saw "PrizeClaimed event found: true"
[ ] Saw "Full event data: [...]" with values
[ ] Saw "Amount low (raw): ..." with a number
[ ] Saw "u256ToStrk - Total Wei: ..." with a number
[ ] Saw "u256ToStrk - Result: X STRK" with X > 0
[ ] Saw "Final extracted amount: X STRK" with X > 0
```

---

## 🎯 Expected Values for 0.01 STRK

If you won 0.01 STRK, you should see:

```
Amount low (raw): 10000000000000000  (or 0xa0000000000000 in hex)
Amount high (raw): 0

u256ToStrk - Low: 10000000000000000
u256ToStrk - High: 0
u256ToStrk - Total Wei: 10000000000000000
u256ToStrk - Result: 0.01 STRK

Final extracted amount: 0.01 STRK
```

**Calculation:**
- 0.01 STRK = 0.01 × 10^18 wei
- = 10,000,000,000,000,000 wei
- = 10^16 wei

---

## 🔧 Fallback Mechanisms

The code has multiple fallback strategies:

### **Strategy 1: Standard Parsing**
- Look for PrizeClaimed event
- Extract last 2 elements as amount

### **Strategy 2: Alternative Indices**
- If amount is 0, try all index pairs
- Test each pair until non-zero found

### **Strategy 3: All Events**
- If no PrizeClaimed event, check all events
- Try all index pairs in each event
- Use first non-zero amount found

---

## 📸 What to Share for Help

If still showing 0, copy these from console:

1. **Full result structure:**
   ```
   Result keys: [...]
   ```

2. **Number of events:**
   ```
   Number of events: X
   ```

3. **Event data:**
   ```
   Full event data: [...]
   ```

4. **Conversion logs:**
   ```
   u256ToStrk - Low: ...
   u256ToStrk - High: ...
   u256ToStrk - Result: ...
   ```

---

## 🚀 Quick Test

To quickly test if the conversion works:

1. **Open browser console**
2. **Paste this:**
   ```javascript
   // Test conversion
   const low = "10000000000000000";  // 0.01 STRK in wei
   const high = "0";
   
   const totalWei = BigInt(low) + (BigInt(high) << BigInt(128));
   const strk = Number(totalWei) / 1e18;
   console.log("Result:", strk, "STRK");
   ```

3. **Should output:**
   ```
   Result: 0.01 STRK
   ```

---

## ✅ Success Indicators

You'll know it's working when you see:

```
✅ Number of events: > 0
✅ PrizeClaimed event found: true
✅ Event data length: >= 2
✅ Amount low: > 0
✅ u256ToStrk - Result: > 0
✅ Final extracted amount: > 0
✅ Display shows: "You Won: X STRK" (X > 0)
```

---

## 🎉 Next Steps

1. **Run the app**: `npm run dev`
2. **Open console**: Press F12
3. **Claim a prize**: Enter code and claim
4. **Check logs**: Follow the checklist above
5. **Share results**: If still 0, share the console logs

The extensive logging will help us identify exactly where the issue is!

---

Built with ❤️ for StarkGive
