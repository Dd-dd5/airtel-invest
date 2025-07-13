import { toast } from "@/hooks/use-toast";

export interface MpesaPaymentRequest {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
}

export interface MpesaPaymentResponse {
  success: boolean;
  message: string;
  checkoutRequestId?: string;
  merchantRequestId?: string;
  responseCode?: string;
}

export interface MpesaCallbackData {
  merchantRequestId: string;
  checkoutRequestId: string;
  resultCode: number;
  resultDesc: string;
  amount?: number;
  mpesaReceiptNumber?: string;
  transactionDate?: string;
  phoneNumber?: string;
}

class MpesaService {
  private baseUrl: string;
  private shortcode: string;
  private passkey: string;
  private consumerKey: string;
  private consumerSecret: string;

  constructor() {
    // Use environment variables or fallback to sandbox values
    this.baseUrl = import.meta.env.VITE_MPESA_API_URL || 'https://sandbox.safaricom.co.ke';
    this.shortcode = import.meta.env.VITE_MPESA_SHORTCODE || '174379';
    this.passkey = import.meta.env.VITE_MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
    this.consumerKey = import.meta.env.VITE_MPESA_CONSUMER_KEY || '';
    this.consumerSecret = import.meta.env.VITE_MPESA_CONSUMER_SECRET || '';
  }

  private generateTimestamp(): string {
    const now = new Date();
    return now.getFullYear().toString() +
           (now.getMonth() + 1).toString().padStart(2, '0') +
           now.getDate().toString().padStart(2, '0') +
           now.getHours().toString().padStart(2, '0') +
           now.getMinutes().toString().padStart(2, '0') +
           now.getSeconds().toString().padStart(2, '0');
  }

  private generatePassword(): string {
    const timestamp = this.generateTimestamp();
    const dataToEncode = `${this.shortcode}${this.passkey}${timestamp}`;
    return btoa(dataToEncode);
  }

  private async getAccessToken(): Promise<string> {
    try {
      const credentials = btoa(`${this.consumerKey}:${this.consumerSecret}`);
      
      const response = await fetch(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Failed to get M-Pesa access token:', error);
      throw new Error('Failed to authenticate with M-Pesa');
    }
  }

  private formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('+254')) {
      cleaned = cleaned.substring(1);
    } else if (cleaned.startsWith('254')) {
      // Already in correct format
    } else if (cleaned.length === 9) {
      cleaned = '254' + cleaned;
    }
    
    return cleaned;
  }

  async initiateSTKPush(request: MpesaPaymentRequest): Promise<MpesaPaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword();
      const formattedPhone = this.formatPhoneNumber(request.phoneNumber);

      const payload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(request.amount), // Ensure amount is integer
        PartyA: formattedPhone,
        PartyB: this.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: `${window.location.origin}/api/mpesa/callback`,
        AccountReference: request.accountReference,
        TransactionDesc: request.transactionDesc
      };

      console.log('M-Pesa STK Push payload:', payload);

      const response = await fetch(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('M-Pesa STK Push response:', data);

      if (data.ResponseCode === '0') {
        return {
          success: true,
          message: 'STK push sent successfully. Please check your phone.',
          checkoutRequestId: data.CheckoutRequestID,
          merchantRequestId: data.MerchantRequestID,
          responseCode: data.ResponseCode
        };
      } else {
        return {
          success: false,
          message: data.errorMessage || data.ResponseDescription || 'Payment request failed',
          responseCode: data.ResponseCode
        };
      }
    } catch (error) {
      console.error('M-Pesa STK Push error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  }

  async queryTransactionStatus(checkoutRequestId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword();

      const payload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await fetch(`${this.baseUrl}/mpesa/stkpushquery/v1/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('M-Pesa query response:', data);
      return data;
    } catch (error) {
      console.error('M-Pesa query error:', error);
      return null;
    }
  }

  // Simulate STK push for demo purposes (when API credentials are not available)
  async simulateSTKPush(request: MpesaPaymentRequest): Promise<MpesaPaymentResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful response
        resolve({
          success: true,
          message: 'STK push sent successfully. Please check your phone.',
          checkoutRequestId: `ws_CO_${Date.now()}`,
          merchantRequestId: `29115-34620561-1`,
          responseCode: '0'
        });
      }, 1000);
    });
  }

  // Process callback data (this would typically be handled by your backend)
  processCallback(callbackData: MpesaCallbackData): boolean {
    if (callbackData.resultCode === 0) {
      // Payment successful
      console.log('Payment successful:', callbackData);
      return true;
    } else {
      // Payment failed
      console.log('Payment failed:', callbackData.resultDesc);
      return false;
    }
  }
}

export const mpesaService = new MpesaService();