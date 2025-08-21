# Withdrawal Process Button - Technical Explanation

## What Happens When You Click "Mark as Sent"

### 1. Status Update
```javascript
// In src/services/paymentService.ts
processWithdrawal(requestId: string, adminNotes?: string): boolean {
  const requests = this.getWithdrawalRequests();
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) return false;
  
  // Changes status from 'pending' to 'processed'
  requests[requestIndex].status = 'processed';
  requests[requestIndex].adminNotes = adminNotes;
  this.saveWithdrawalRequests(requests);
  
  return true;
}
```

### 2. Transaction Logging
```javascript
// In src/pages/Admin.tsx
const handleProcessWithdrawal = async (withdrawal: WithdrawalRequest) => {
  const success = paymentService.processWithdrawal(withdrawal.id, adminNotes);
  
  if (success) {
    // Log transaction for record keeping
    logTransaction({
      userId: withdrawal.userId,
      userName: withdrawal.userName,
      userPhone: withdrawal.userPhone,
      type: 'withdrawal',
      amount: withdrawal.amount,
      status: 'completed',
      details: { 
        netAmount: withdrawal.netAmount,
        transferFee: withdrawal.transferFee,
        adminNotes: adminNotes
      }
    });
    
    // Show success message
    toast({
      title: "✅ Withdrawal Processed",
      description: `KSh ${withdrawal.netAmount.toLocaleString()} sent to ${withdrawal.userName}`,
    });
  }
}
```

## What You Need to Do Manually

### Before Clicking "Mark as Sent":
1. **Send the actual money** via M-Pesa or Airtel Money to the user's phone number
2. **Verify the transaction** was successful
3. **Note the transaction ID** (optional, for your records)

### Example Manual Process:
```
User: John Doe (0712345678)
Withdrawal: KSh 10,000
Transfer Fee: KSh 1,000 (10%)
Net Amount: KSh 9,000

Manual Steps:
1. Open M-Pesa app/USSD
2. Send KSh 9,000 to 0712345678
3. Get confirmation (e.g., "MP123XYZ456 Confirmed")
4. Return to admin panel
5. Click "Mark as Sent"
6. Add note: "Sent via M-Pesa - Ref: MP123XYZ456"
```

## Security & Record Keeping

The process button serves as:
- **Audit Trail**: Records when you processed each withdrawal
- **Status Tracking**: Prevents double-processing
- **User Notification**: User can see their withdrawal was processed
- **Admin Notes**: Your notes for future reference

## Important Notes

⚠️ **The system trusts you to actually send the money before clicking "Mark as Sent"**

✅ **Best Practice**: Always send the money first, then immediately mark as sent

📝 **Record Keeping**: Use admin notes to record transaction references for your records