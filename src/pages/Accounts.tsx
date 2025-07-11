import { MainNavigation } from "@/components/MainNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Copy, Share2, Users, Gift, Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

const Accounts = () => {
  const { user, updateBalance } = useAuth();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const referralLink = `https://solarinvest.com/signup?ref=${user?.referralCode}`;

  // Mobile Money Integration
  const initiatePayment = (amount: number, method: 'mpesa' | 'airtel') => {
    const phone = user?.phone?.replace('+254', '254') || '';
    
    if (method === 'mpesa') {
      // M-Pesa STK Push simulation
      const mpesaUrl = `https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest`;
      
      // For production, you'd make an actual API call to M-Pesa
      // For now, we'll simulate the STK push
      simulateSTKPush(amount, phone, 'mpesa');
    } else if (method === 'airtel') {
      // Airtel Money integration
      simulateSTKPush(amount, phone, 'airtel');
    }
  };

  const simulateSTKPush = (amount: number, phone: string, provider: string) => {
    setIsProcessing(true);
    
    // Show STK push notification
    toast({
      title: `${provider === 'mpesa' ? '📱 M-Pesa' : '📱 Airtel Money'} Payment Request`,
      description: `Check your phone (${phone}) and enter your PIN to complete the payment of KSh ${amount.toLocaleString()}`,
    });

    // Simulate STK push delay
    setTimeout(() => {
      // Simulate successful payment
      updateBalance(amount);
      
      toast({
        title: "Payment Successful! ✅",
        description: `KSh ${amount.toLocaleString()} has been added to your account via ${provider === 'mpesa' ? 'M-Pesa' : 'Airtel Money'}`,
      });
      
      setDepositAmount("");
      setIsProcessing(false);
    }, 3000); // 3 second delay to simulate STK push
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(depositAmount);
    // Default to M-Pesa for automatic payment
    initiatePayment(amount, 'mpesa');
  };

  const handleWithdrawal = async () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(withdrawalAmount);
    
    if (amount < 800) {
      toast({
        title: "Minimum Withdrawal",
        description: "Minimum withdrawal amount is KSh 800.",
        variant: "destructive",
      });
      return;
    }

    if (user && amount > user.balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      updateBalance(-amount);
      
      toast({
        title: "Withdrawal Requested! 💸",
        description: `KSh ${amount.toLocaleString()} withdrawal has been processed. Funds will be sent to your M-Pesa within 1-2 hours.`,
      });
      
      setWithdrawalAmount("");
      setIsProcessing(false);
    }, 2000);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Referral Link Copied! 📋",
      description: "Share this link with friends to earn KSh 400 per referral!",
    });
  };

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Solar Invest',
        text: 'Start earning daily returns from solar energy investments!',
        url: referralLink,
      });
    } else {
      copyReferralLink();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 pb-20 md:pb-0">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💼 Manage Your Solar Account</h1>
          <p className="text-gray-600">Deposit funds, request withdrawals, and manage your solar investment account</p>
        </div>

        {/* Account Overview */}
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-green-400 to-green-600 text-white">
              <CardContent className="p-6 text-center">
                <Wallet className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">KSh {user.balance.toLocaleString()}</div>
                <div className="text-green-100">Current Balance</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-blue-400 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <Gift className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">KSh {user.referralEarnings.toLocaleString()}</div>
                <div className="text-blue-100">Referral Earnings</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-400 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{user.totalReferrals}</div>
                <div className="text-purple-100">Total Referrals</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              <CardContent className="p-6 text-center">
                <div className="text-lg font-bold">☀️</div>
                <div className="text-lg font-bold">Solar Investor</div>
                <div className="text-yellow-100">Status: Active</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Deposit Section */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUpCircle className="h-6 w-6 mr-2 text-green-600" />
                Deposit Funds
              </CardTitle>
              <CardDescription>Add funds to your solar investment account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deposit-amount">Amount (KSh)</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="Enter amount to deposit"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => {
                      if (!depositAmount || parseFloat(depositAmount) <= 0) {
                        toast({
                          title: "Invalid Amount",
                          description: "Please enter a valid deposit amount.",
                          variant: "destructive",
                        });
                        return;
                      }
                      initiatePayment(parseFloat(depositAmount), 'mpesa');
                    }}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "📱 M-Pesa"}
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      if (!depositAmount || parseFloat(depositAmount) <= 0) {
                        toast({
                          title: "Invalid Amount",
                          description: "Please enter a valid deposit amount.",
                          variant: "destructive",
                        });
                        return;
                      }
                      initiatePayment(parseFloat(depositAmount), 'airtel');
                    }}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "📱 Airtel Money"}
                  </Button>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm text-gray-600">
                <p className="font-medium">📱 Instant Mobile Money Deposits:</p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="font-bold text-blue-800 mb-2">🚀 How it works:</p>
                  <div className="space-y-1 text-sm">
                    <p>1. Enter your deposit amount above</p>
                    <p>2. Click M-Pesa or Airtel Money button</p>
                    <p>3. Check your phone for payment request</p>
                    <p>4. Enter your PIN to complete payment</p>
                    <p>5. Funds credited instantly to your account!</p>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-green-800 font-medium">✅ Secure & Instant</p>
                  <p className="text-sm text-green-700">Your payment is processed securely through official mobile money APIs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal Section */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowDownCircle className="h-6 w-6 mr-2 text-blue-600" />
                Withdraw Funds
              </CardTitle>
              <CardDescription>Withdraw your solar investment earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="withdrawal-amount">Amount (KSh)</Label>
                  <Input
                    id="withdrawal-amount"
                    type="number"
                    placeholder="Enter amount to withdraw"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
                <Button 
                  onClick={handleWithdrawal} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "💸 Request Withdrawal"}
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">📋 Withdrawal Information</p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• Minimum withdrawal: KSh 800</li>
                  <li>• Processing time: 1-2 hours</li>
                  <li>• Funds sent directly to your M-Pesa</li>
                  <li>• Available 24/7</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Program */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Share2 className="h-8 w-8 mr-3" />
              🎁 Referral Program - Earn KSh 400 per Friend!
            </CardTitle>
            <CardDescription className="text-purple-100">
              Share Solar Invest with friends and earn KSh 400 for every friend who purchases a package
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-3xl font-bold">KSh 400</div>
                  <div className="text-purple-100">Per Referral</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-3xl font-bold">{user?.totalReferrals || 0}</div>
                  <div className="text-purple-100">Your Referrals</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-3xl font-bold">KSh {user?.referralEarnings.toLocaleString() || 0}</div>
                  <div className="text-purple-100">Total Earned</div>
                </div>
              </div>

              <div>
                <Label className="text-white mb-2 block">Your Referral Code:</Label>
                <div className="flex gap-2">
                  <Input
                    value={user?.referralCode || ''}
                    readOnly
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                  />
                  <Button
                    onClick={copyReferralLink}
                    variant="secondary"
                    className="bg-white text-purple-600 hover:bg-gray-100"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-white mb-2 block">Your Referral Link:</Label>
                <div className="flex gap-2">
                  <Input
                    value={referralLink}
                    readOnly
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 text-sm"
                  />
                  <Button
                    onClick={shareReferralLink}
                    variant="secondary"
                    className="bg-white text-purple-600 hover:bg-gray-100"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-bold mb-2">🚀 How it works:</h4>
                <ol className="text-sm space-y-1">
                  <li>1. Share your referral link with friends</li>
                  <li>2. They sign up using your link</li>
                  <li>3. When they purchase any solar package, you earn KSh 400!</li>
                  <li>4. Earnings are added instantly to your balance</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>⚙️ Account Settings</CardTitle>
            <CardDescription>Manage your personal and security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input 
                  id="phone-number" 
                  type="tel" 
                  value={user?.phone || ''} 
                  disabled 
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="full-name">Full Name</Label>
                <Input 
                  id="full-name" 
                  type="text" 
                  value={user?.name || ''} 
                  disabled 
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="referral-code-display">Your Referral Code</Label>
                <Input 
                  id="referral-code-display" 
                  type="text" 
                  value={user?.referralCode || ''} 
                  disabled 
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="account-status">Account Status</Label>
                <div className="mt-2">
                  <Badge className="bg-green-500 text-white">✅ Active Solar Investor</Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800 font-medium">🔒 Security Notice</p>
              <p className="text-sm text-yellow-700 mt-1">
                Your account is secured with industry-standard encryption. Never share your login details with anyone.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Accounts;