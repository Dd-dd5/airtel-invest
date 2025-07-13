import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Smartphone, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { mpesaService, MpesaPaymentRequest } from "@/services/mpesaService";
import { useAuth } from "@/contexts/AuthContext";

interface MpesaPaymentProps {
  onPaymentSuccess?: (amount: number, transactionId: string) => void;
  onPaymentError?: (error: string) => void;
}

export const MpesaPayment = ({ onPaymentSuccess, onPaymentError }: MpesaPaymentProps) => {
  const { user, updateBalance } = useAuth();
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string>("");

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to deposit.",
        variant: "destructive",
      });
      return;
    }

    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your M-Pesa phone number.",
        variant: "destructive",
      });
      return;
    }

    const paymentAmount = parseFloat(amount);
    if (paymentAmount < 10) {
      toast({
        title: "Minimum Amount",
        description: "Minimum deposit amount is KSh 10.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('pending');

    try {
      const paymentRequest: MpesaPaymentRequest = {
        amount: paymentAmount,
        phoneNumber: phoneNumber,
        accountReference: `SOLAR_${user?.phone || 'USER'}`,
        transactionDesc: `Solar Invest Deposit - KSh ${paymentAmount}`
      };

      // Try real API first, fallback to simulation if credentials not available
      let response;
      if (import.meta.env.VITE_MPESA_CONSUMER_KEY && import.meta.env.VITE_MPESA_CONSUMER_SECRET) {
        response = await mpesaService.initiateSTKPush(paymentRequest);
      } else {
        // Use simulation for demo
        response = await mpesaService.simulateSTKPush(paymentRequest);
      }

      if (response.success) {
        setCheckoutRequestId(response.checkoutRequestId || "");
        
        toast({
          title: "📱 Payment Request Sent!",
          description: `Check your phone (${phoneNumber}) and enter your M-Pesa PIN to complete the payment of KSh ${paymentAmount.toLocaleString()}`,
        });

        // Start polling for payment status
        pollPaymentStatus(response.checkoutRequestId || "", paymentAmount);
      } else {
        setPaymentStatus('failed');
        setIsProcessing(false);
        
        toast({
          title: "Payment Failed",
          description: response.message,
          variant: "destructive",
        });

        onPaymentError?.(response.message);
      }
    } catch (error) {
      setPaymentStatus('failed');
      setIsProcessing(false);
      
      const errorMessage = "Network error. Please check your connection and try again.";
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });

      onPaymentError?.(errorMessage);
    }
  };

  const pollPaymentStatus = async (requestId: string, paymentAmount: number) => {
    let attempts = 0;
    const maxAttempts = 30; // Poll for 5 minutes (30 attempts * 10 seconds)

    const poll = async () => {
      attempts++;
      
      try {
        // In a real implementation, you'd query the actual status
        // For demo purposes, we'll simulate success after a delay
        if (attempts >= 3) { // Simulate success after 30 seconds
          setPaymentStatus('success');
          setIsProcessing(false);
          
          // Update user balance
          updateBalance(paymentAmount);
          
          toast({
            title: "✅ Payment Successful!",
            description: `KSh ${paymentAmount.toLocaleString()} has been added to your Solar Invest account.`,
          });

          onPaymentSuccess?.(paymentAmount, `MP${Date.now()}`);
          
          // Reset form
          setAmount("");
          setCheckoutRequestId("");
          return;
        }

        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          // Timeout
          setPaymentStatus('failed');
          setIsProcessing(false);
          
          toast({
            title: "Payment Timeout",
            description: "Payment verification timed out. Please check your M-Pesa messages or try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000);
        }
      }
    };

    setTimeout(poll, 10000); // Start polling after 10 seconds
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'pending':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Smartphone className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'pending':
        return "Waiting for payment confirmation...";
      case 'success':
        return "Payment completed successfully!";
      case 'failed':
        return "Payment failed. Please try again.";
      default:
        return "Ready to process payment";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <Smartphone className="h-4 w-4 text-white" />
          </div>
          M-Pesa Deposit
        </CardTitle>
        <CardDescription>
          Deposit funds instantly using M-Pesa STK Push
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="amount">Amount (KSh)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isProcessing}
            min="10"
            step="1"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum: KSh 10</p>
        </div>

        <div>
          <Label htmlFor="phone">M-Pesa Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="254700000000"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isProcessing}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the phone number registered with M-Pesa
          </p>
        </div>

        {/* Payment Status */}
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusMessage()}</span>
        </div>

        {/* Processing Steps */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Payment Steps:</div>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Payment request sent to M-Pesa
              </div>
              <div className="flex items-center gap-2">
                {paymentStatus === 'pending' ? (
                  <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                ) : paymentStatus === 'success' ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-gray-400" />
                )}
                Waiting for PIN entry on your phone
              </div>
              <div className="flex items-center gap-2">
                {paymentStatus === 'success' ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-gray-400" />
                )}
                Payment confirmation
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handlePayment}
          disabled={isProcessing || !amount || !phoneNumber}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <Smartphone className="mr-2 h-4 w-4" />
              Pay with M-Pesa
            </>
          )}
        </Button>

        {/* Information */}
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">ℹ️ Info</Badge>
          </div>
          <ul className="space-y-1 ml-4">
            <li>• You'll receive an STK push on your phone</li>
            <li>• Enter your M-Pesa PIN to complete payment</li>
            <li>• Funds are credited instantly upon confirmation</li>
            <li>• Transaction fee may apply as per M-Pesa rates</li>
          </ul>
        </div>

        {/* Demo Notice */}
        {!import.meta.env.VITE_MPESA_CONSUMER_KEY && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Demo Mode</span>
            </div>
            <p className="text-xs text-yellow-700">
              This is a demo. In production, configure your M-Pesa API credentials in environment variables.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};