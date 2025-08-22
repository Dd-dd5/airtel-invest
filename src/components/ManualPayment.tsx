import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Smartphone, Copy, Clock, AlertCircle, CheckCircle, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { paymentService } from "@/services/paymentService";
import { useAuth } from "@/contexts/AuthContext";

interface ManualPaymentProps {
  onPaymentSubmitted?: (paymentId: string, amount: number) => void;
}

export const ManualPayment = ({ onPaymentSubmitted }: ManualPaymentProps) => {
  const { user, profile } = useAuth();
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'airtel'>('mpesa');
  const [transactionCode, setTransactionCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paybillNumber = paymentService.getPaybillNumber();
  const minDeposit = paymentService.getMinimumDeposit();

  const copyPaybillNumber = () => {
    navigator.clipboard.writeText(paybillNumber);
    toast({
      title: "📋 Copied!",
      description: "Paybill number copied to clipboard",
    });
  };

  const handleSubmitPayment = async () => {
    if (!amount || parseFloat(amount) < minDeposit) {
      toast({
        title: "Invalid Amount",
        description: `Minimum deposit is KSh ${minDeposit.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    if (!transactionCode.trim()) {
      toast({
        title: "Transaction Code Required",
        description: "Please enter the M-Pesa/Airtel transaction code",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = paymentService.submitDepositRequest(
        user?.phone || '',
        profile?.full_name || '',
        user?.phone || '',
        parseFloat(amount),
        paymentMethod,
        transactionCode.trim()
      );

      if (result.success) {
        toast({
          title: "✅ Payment Submitted!",
          description: "Your deposit request has been submitted for verification. You'll be notified once it's processed.",
        });

        onPaymentSubmitted?.(result.paymentId!, parseFloat(amount));
        
        // Reset form
        setAmount("");
        setTransactionCode("");
      } else {
        toast({
          title: "Submission Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit payment request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <Smartphone className="h-4 w-4 text-white" />
          </div>
          Manual Deposit
        </CardTitle>
        <CardDescription>
          Send money to our paybill and submit transaction details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            Payment Instructions
          </h3>
          
          <div className="space-y-3 text-xs md:text-sm">
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-gray-900 mb-1">📱 M-Pesa Instructions:</div>
              <ol className="text-gray-700 space-y-1">
                <li>1. Go to M-Pesa menu</li>
                <li>2. Select "Send Money"</li>
                <li>3. Enter: <strong>{paybillNumber}</strong></li>
                <li>4. Enter amount: KSh {amount || 'XXX'}</li>
                <li>5. Enter PIN and send</li>
                <li>6. Copy the transaction code below</li>
              </ol>
            </div>

            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-gray-900 mb-1">📱 Airtel Money Instructions:</div>
              <ol className="text-gray-700 space-y-1">
                <li>1. Dial *185#</li>
                <li>2. Select "Send Money"</li>
                <li>3. Enter: <strong>{paybillNumber}</strong></li>
                <li>4. Enter amount: KSh {amount || 'XXX'}</li>
                <li>5. Enter PIN and confirm</li>
                <li>6. Copy the transaction code below</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Paybill Number */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-green-700 font-medium">Send Money To:</div>
              <div className="text-2xl font-bold text-green-900">{paybillNumber}</div>
              <div className="text-sm text-green-600">Solar Invest Paybill</div>
            </div>
            <Button
              onClick={copyPaybillNumber}
              variant="outline"
              size="sm"
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <Label htmlFor="amount">Deposit Amount (KSh)</Label>
          <Input
            id="amount"
            type="number"
            placeholder={`Minimum KSh ${minDeposit.toLocaleString()}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSubmitting}
            min={minDeposit}
            step="1"
            className="text-base md:text-lg font-semibold"
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum deposit: KSh {minDeposit.toLocaleString()}
          </p>
        </div>

        {/* Payment Method */}
        <div>
          <Label>Payment Method</Label>
          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              variant={paymentMethod === 'mpesa' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('mpesa')}
              className="flex-1"
              disabled={isSubmitting}
            >
              📱 M-Pesa
            </Button>
            <Button
              type="button"
              variant={paymentMethod === 'airtel' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('airtel')}
              className="flex-1"
              disabled={isSubmitting}
            >
              📱 Airtel Money
            </Button>
          </div>
        </div>

        {/* Transaction Code */}
        <div>
          <Label htmlFor="transaction-code">
            {paymentMethod === 'mpesa' ? 'M-Pesa' : 'Airtel Money'} Transaction Code
          </Label>
          <Input
            id="transaction-code"
            type="text"
            placeholder="e.g., QGH7X8Y9Z1"
            value={transactionCode}
            onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
            disabled={isSubmitting}
            className="font-mono"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the transaction code from your {paymentMethod === 'mpesa' ? 'M-Pesa' : 'Airtel Money'} confirmation SMS
          </p>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmitPayment}
          disabled={isSubmitting || !amount || !transactionCode.trim() || parseFloat(amount || '0') < minDeposit}
          className="w-full bg-green-600 hover:bg-green-700 h-10 md:h-12 text-sm md:text-base font-semibold"
        >
          {isSubmitting ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Submit for Verification
            </>
          )}
        </Button>

        {/* Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <div className="font-medium mb-1">⏱️ Processing Time:</div>
              <ul className="space-y-1 text-xs">
                <li>• Your deposit will be verified manually</li>
                <li>• Processing time: 5-30 minutes during business hours</li>
                <li>• You'll receive a notification once verified</li>
                <li>• Funds will be added to your account immediately after verification</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};