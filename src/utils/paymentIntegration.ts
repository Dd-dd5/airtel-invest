// Mobile Money Payment Integration Utilities
// This file contains utilities for integrating with M-Pesa and Airtel Money APIs

export interface PaymentRequest {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  checkoutRequestId?: string;
}

// M-Pesa STK Push Integration
export const initiateMpesaPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  try {
    // In production, replace with your actual M-Pesa API endpoint
    const mpesaEndpoint = process.env.VITE_MPESA_API_URL || 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    
    const payload = {
      BusinessShortCode: process.env.VITE_MPESA_SHORTCODE || '174379',
      Password: generateMpesaPassword(),
      Timestamp: generateTimestamp(),
      TransactionType: 'CustomerPayBillOnline',
      Amount: request.amount,
      PartyA: request.phoneNumber,
      PartyB: process.env.VITE_MPESA_SHORTCODE || '174379',
      PhoneNumber: request.phoneNumber,
      CallBackURL: `${window.location.origin}/api/mpesa/callback`,
      AccountReference: request.accountReference,
      TransactionDesc: request.transactionDesc
    };

    const response = await fetch(mpesaEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getMpesaAccessToken()}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (data.ResponseCode === '0') {
      return {
        success: true,
        checkoutRequestId: data.CheckoutRequestID,
        message: 'STK push sent successfully'
      };
    } else {
      return {
        success: false,
        message: data.errorMessage || 'Payment failed'
      };
    }
  } catch (error) {
    console.error('M-Pesa payment error:', error);
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
};

// Airtel Money Integration
export const initiateAirtelPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  try {
    // In production, replace with your actual Airtel Money API endpoint
    const airtelEndpoint = process.env.VITE_AIRTEL_API_URL || 'https://openapiuat.airtel.africa/merchant/v1/payments/';
    
    const payload = {
      reference: `SOLAR_${Date.now()}`,
      subscriber: {
        country: 'KE',
        currency: 'KES',
        msisdn: request.phoneNumber
      },
      transaction: {
        amount: request.amount,
        country: 'KE',
        currency: 'KES',
        id: `TXN_${Date.now()}`
      }
    };

    const response = await fetch(airtelEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAirtelAccessToken()}`,
        'X-Country': 'KE',
        'X-Currency': 'KES'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (data.status?.success) {
      return {
        success: true,
        transactionId: data.data?.transaction?.id,
        message: 'Payment request sent successfully'
      };
    } else {
      return {
        success: false,
        message: data.status?.message || 'Payment failed'
      };
    }
  } catch (error) {
    console.error('Airtel payment error:', error);
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
};

// Utility functions
const generateMpesaPassword = (): string => {
  const shortcode = process.env.VITE_MPESA_SHORTCODE || '174379';
  const passkey = process.env.VITE_MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
  const timestamp = generateTimestamp();
  
  // In production, use proper base64 encoding
  return btoa(`${shortcode}${passkey}${timestamp}`);
};

const generateTimestamp = (): string => {
  const now = new Date();
  return now.getFullYear().toString() +
         (now.getMonth() + 1).toString().padStart(2, '0') +
         now.getDate().toString().padStart(2, '0') +
         now.getHours().toString().padStart(2, '0') +
         now.getMinutes().toString().padStart(2, '0') +
         now.getSeconds().toString().padStart(2, '0');
};

const getMpesaAccessToken = async (): Promise<string> => {
  // In production, implement proper OAuth token management
  const consumerKey = process.env.VITE_MPESA_CONSUMER_KEY || '';
  const consumerSecret = process.env.VITE_MPESA_CONSUMER_SECRET || '';
  
  const credentials = btoa(`${consumerKey}:${consumerSecret}`);
  
  try {
    const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${credentials}`
      }
    });
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to get M-Pesa access token:', error);
    return '';
  }
};

const getAirtelAccessToken = async (): Promise<string> => {
  // In production, implement proper OAuth token management for Airtel
  const clientId = process.env.VITE_AIRTEL_CLIENT_ID || '';
  const clientSecret = process.env.VITE_AIRTEL_CLIENT_SECRET || '';
  
  try {
    const response = await fetch('https://openapiuat.airtel.africa/auth/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      })
    });
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to get Airtel access token:', error);
    return '';
  }
};

// Payment status checking
export const checkPaymentStatus = async (checkoutRequestId: string, provider: 'mpesa' | 'airtel'): Promise<any> => {
  if (provider === 'mpesa') {
    // M-Pesa transaction status query
    const endpoint = 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query';
    
    const payload = {
      BusinessShortCode: process.env.VITE_MPESA_SHORTCODE || '174379',
      Password: generateMpesaPassword(),
      Timestamp: generateTimestamp(),
      CheckoutRequestID: checkoutRequestId
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getMpesaAccessToken()}`
        },
        body: JSON.stringify(payload)
      });

      return await response.json();
    } catch (error) {
      console.error('M-Pesa status check error:', error);
      return null;
    }
  }
  
  // Add Airtel status checking logic here
  return null;
};