// Manual Payment Service - No API required
export interface PendingPayment {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  amount: number;
  paymentMethod: 'mpesa' | 'airtel';
  timestamp: Date;
  status: 'pending' | 'verified' | 'rejected';
  transactionCode?: string;
  adminNotes?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  amount: number;
  netAmount: number; // After 10% deduction
  transferFee: number;
  timestamp: Date;
  status: 'pending' | 'processed' | 'rejected';
  adminNotes?: string;
}

class PaymentService {
  private readonly PAYBILL_NUMBER = '0786281379';
  private readonly MIN_DEPOSIT = 200;
  private readonly WITHDRAWAL_FEE_PERCENT = 10;

  // Get pending payments for admin
  getPendingPayments(): PendingPayment[] {
    const payments = localStorage.getItem('solar_pending_payments');
    return payments ? JSON.parse(payments) : [];
  }

  // Save pending payments
  private savePendingPayments(payments: PendingPayment[]): void {
    localStorage.setItem('solar_pending_payments', JSON.stringify(payments));
  }

  // Get withdrawal requests for admin
  getWithdrawalRequests(): WithdrawalRequest[] {
    const requests = localStorage.getItem('solar_withdrawal_requests');
    return requests ? JSON.parse(requests) : [];
  }

  // Save withdrawal requests
  private saveWithdrawalRequests(requests: WithdrawalRequest[]): void {
    localStorage.setItem('solar_withdrawal_requests', JSON.stringify(requests));
  }

  // Submit deposit request
  submitDepositRequest(
    userId: string,
    userName: string,
    userPhone: string,
    amount: number,
    paymentMethod: 'mpesa' | 'airtel',
    transactionCode?: string
  ): { success: boolean; message: string; paymentId?: string } {
    if (amount < this.MIN_DEPOSIT) {
      return {
        success: false,
        message: `Minimum deposit is KSh ${this.MIN_DEPOSIT.toLocaleString()}`
      };
    }

    const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const payment: PendingPayment = {
      id: paymentId,
      userId,
      userName,
      userPhone,
      amount,
      paymentMethod,
      timestamp: new Date(),
      status: 'pending',
      transactionCode
    };

    const payments = this.getPendingPayments();
    payments.unshift(payment); // Add to beginning
    this.savePendingPayments(payments);

    return {
      success: true,
      message: 'Deposit request submitted successfully',
      paymentId
    };
  }

  // Submit withdrawal request
  submitWithdrawalRequest(
    userId: string,
    userName: string,
    userPhone: string,
    amount: number
  ): { success: boolean; message: string; requestId?: string; netAmount?: number; transferFee?: number } {
    // Check business hours
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    
    const isBusinessHours = day >= 1 && day <= 5 && hour >= 9 && hour < 18;
    
    if (!isBusinessHours) {
      return {
        success: false,
        message: 'Withdrawals are only processed Monday to Friday, 9 AM to 6 PM'
      };
    }

    const transferFee = Math.round(amount * (this.WITHDRAWAL_FEE_PERCENT / 100));
    const netAmount = amount - transferFee;

    const requestId = `WTH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const request: WithdrawalRequest = {
      id: requestId,
      userId,
      userName,
      userPhone,
      amount,
      netAmount,
      transferFee,
      timestamp: new Date(),
      status: 'pending'
    };

    const requests = this.getWithdrawalRequests();
    requests.unshift(request);
    this.saveWithdrawalRequests(requests);

    return {
      success: true,
      message: 'Withdrawal request submitted successfully',
      requestId,
      netAmount,
      transferFee
    };
  }

  // Admin: Mark payment as verified
  markPaymentAsVerified(paymentId: string, adminNotes?: string): boolean {
    const payments = this.getPendingPayments();
    const paymentIndex = payments.findIndex(p => p.id === paymentId);
    
    if (paymentIndex === -1) return false;
    
    payments[paymentIndex].status = 'verified';
    payments[paymentIndex].adminNotes = adminNotes;
    this.savePendingPayments(payments);
    
    return true;
  }

  // Admin: Reject payment
  rejectPayment(paymentId: string, adminNotes?: string): boolean {
    const payments = this.getPendingPayments();
    const paymentIndex = payments.findIndex(p => p.id === paymentId);
    
    if (paymentIndex === -1) return false;
    
    payments[paymentIndex].status = 'rejected';
    payments[paymentIndex].adminNotes = adminNotes;
    this.savePendingPayments(payments);
    
    return true;
  }

  // Admin: Process withdrawal
  processWithdrawal(requestId: string, adminNotes?: string): boolean {
    const requests = this.getWithdrawalRequests();
    const requestIndex = requests.findIndex(r => r.id === requestId);
    
    if (requestIndex === -1) return false;
    
    requests[requestIndex].status = 'processed';
    requests[requestIndex].adminNotes = adminNotes;
    this.saveWithdrawalRequests(requests);
    
    return true;
  }

  // Admin: Reject withdrawal
  rejectWithdrawal(requestId: string, adminNotes?: string): boolean {
    const requests = this.getWithdrawalRequests();
    const requestIndex = requests.findIndex(r => r.id === requestId);
    
    if (requestIndex === -1) return false;
    
    requests[requestIndex].status = 'rejected';
    requests[requestIndex].adminNotes = adminNotes;
    this.saveWithdrawalRequests(requests);
    
    return true;
  }

  // Get payment info
  getPaybillNumber(): string {
    return this.PAYBILL_NUMBER;
  }

  getMinimumDeposit(): number {
    return this.MIN_DEPOSIT;
  }

  getWithdrawalFeePercent(): number {
    return this.WITHDRAWAL_FEE_PERCENT;
  }

  // Check if withdrawal hours
  isWithdrawalHours(): { allowed: boolean; message: string } {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    
    const isBusinessHours = day >= 1 && day <= 5 && hour >= 9 && hour < 18;
    
    if (isBusinessHours) {
      return {
        allowed: true,
        message: 'Withdrawals are being processed'
      };
    } else {
      return {
        allowed: false,
        message: 'Withdrawals are processed Monday to Friday, 9 AM to 6 PM'
      };
    }
  }
}

export const paymentService = new PaymentService();