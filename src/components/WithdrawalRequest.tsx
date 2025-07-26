import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownCircle, Clock, AlertCircle, Calculator, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { paymentService } from "@/services/paymentService";
import { useAuth } from "@/contexts/AuthContext";

interface WithdrawalRequestProps {
  onWithdrawalSubmitted?: (requestId: string, amount: number, netAmount: number) => void;
}

export const WithdrawalRequest = ({ onWithdrawalSubmitted }: WithdrawalRequestProps) => {
  const { user, updateBalance } = useAuth();
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const withdrawalHours = paymentService.isWithdrawalHours();
  const feePercent = paymentService.getWithdrawalFeePercent();
  
  const calculateFees = (withdrawalAmount: number) => {
    const transferFee = Math.round(withdrawalAmount * (feePercent / 100));
    const netAmount = withdrawalAmount - transferFee;
    return { transferFee, netAmount };
  };

  const currentAmount = parseFloat(amount || '0');
  const { transferFee, netAmount } = calculateFees(currentAmount);

  const handleSubmitWithdrawal = async () => {
    if (!amount || currentAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    if (currentAmount < 800) {
      toast({
        title: "Minimum Withdrawal",
        description: "Minimum withdrawal amount is KSh 800",
        variant: "destructive",
      });
      return;
    }

    if (user && currentAmount > user.balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    if (!withdrawalHours.allowed) {
      toast({
        title: "Outside Business Hours",
        description: withdrawalHours.message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = paymentService.submitWithdrawalRequest(
        user?.phone || '',
        user?.name || '',
        user?.phone || '',
        currentAmount
      );

      if (result.success) {
        // Deduct the full amount from user balance immediately
        updateBalance(-currentAmount);
        
        toast({
          title: "✅ Withdrawal Requested!",
          description: `Your withdrawal of KSh ${currentAmount.toLocaleString()} has been submitted. You'll receive KSh ${result.netAmount?.toLocaleString()} after transfer fees.`,
        });

        onWithdrawalSubmitted?.(result.requestId!, currentAmount, result.netAmount!);
        
        // Reset form
        setAmount("");
      } else {
        toast({
          title: "Withdrawal Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit withdrawal request",
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
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <ArrowDownCircle className="h-4 w-4 text-white" />
          </div>
          Request Withdrawal
        </CardTitle>
        <CardDescription>
          Withdraw your solar investment earnings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Business Hours Status */}
        <div className={`border rounded-lg p-4 ${
          withdrawalHours.allowed 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className={`h-4 w-4 ${
              withdrawalHours.allowed ? 'text-green-600' : 'text-red-600'
            }`} />
            <span className={`font-medium ${
              withdrawalHours.allowed ? 'text-green-900' : 'text-red-900'
            }`}>
              {withdrawalHours.allowed ? '✅ Withdrawals Active' : '⏰ Outside Business Hours'}
            </span>
          </div>
          <p className={`text-sm ${
            withdrawalHours.allowed ? 'text-green-700' : 'text-red-700'
          }`}>
            {withdrawalHours.message}
          </p>
        </div>

        {/* Current Balance */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-700 font-medium">Available Balance:</div>
              <div className="text-2xl font-bold text-blue-900">
                KSh {user?.balance.toLocaleString() || '0'}
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <Label htmlFor="withdrawal-amount">Withdrawal Amount (KSh)</Label>
          <Input
            id="withdrawal-amount"
            type="number"
            placeholder="Minimum KSh 800"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSubmitting || !withdrawalHours.allowed}
            min="800"
            max={user?.balance || 0}
            step="1"
            className="text-base md:text-lg font-semibold"
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum: KSh 800 • Maximum: KSh {user?.balance.toLocaleString() || '0'}
          </p>
        </div>

        {/* Fee Calculation */}
        {currentAmount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-900">Fee Calculation</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Withdrawal Amount:</span>
                <span className="font-semibold">KSh {currentAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Transfer Fee ({feePercent}%):</span>
                <span className="font-semibold text-red-600">- KSh {transferFee.toLocaleString()}</span>
              </div>
              <div className="border-t border-yellow-300 pt-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">You'll Receive:</span>
                  <span className="font-bold text-green-600 text-lg">KSh {netAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmitWithdrawal}
          disabled={
            isSubmitting || 
            !withdrawalHours.allowed || 
            !amount || 
            currentAmount < 800 || 
            (user && currentAmount > user.balance)
          }
          className="w-full bg-blue-600 hover:bg-blue-700 h-10 md:h-12 text-sm md:text-base font-semibold"
        >
          {isSubmitting ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Submitting Request...
            </>
          ) : (
            <>
              <ArrowDownCircle className="mr-2 h-4 w-4" />
              Request Withdrawal
            </>
          )}
        </Button>

        {/* Information */}
        <div className="space-y-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <div className="font-medium mb-1">📋 Withdrawal Information:</div>
                <ul className="space-y-1 text-xs">
                  <li>• Processing hours: Monday to Friday, 9 AM to 6 PM</li>
                  <li>• Transfer fee: {feePercent}% of withdrawal amount</li>
                  <li>• Funds sent directly to your registered phone number</li>
                  <li>• Processing time: 10 mins to 1 hour during business hours</li>
                  <li>• Minimum withdrawal: KSh 800</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};