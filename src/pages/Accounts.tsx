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
import { ManualPayment } from "@/components/ManualPayment";
import { WithdrawalRequest } from "@/components/WithdrawalRequest";

const Accounts = () => {
  const { user, profile, updateBalance } = useAuth();
  const [showManualPayment, setShowManualPayment] = useState(false);
  const [showWithdrawalRequest, setShowWithdrawalRequest] = useState(false);

  const referralLink = `https://solarinvest.com/signup?ref=${profile?.referral_code}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Referral Link Copied! 📋",
      description: "Share this link with friends to earn KSh 200 per referral!",
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
                <div className="text-2xl font-bold">KSh {profile?.balance?.toLocaleString() || '0'}</div>
                <div className="text-green-100">Current Balance</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-blue-400 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <Gift className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">KSh {profile?.referral_earnings?.toLocaleString() || '0'}</div>
                <div className="text-blue-100">Referral Earnings</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-400 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{0}</div>
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
          <Card className="bg-white shadow-lg h-fit">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUpCircle className="h-6 w-6 mr-2 text-green-600" />
                Deposit Funds
              </CardTitle>
              <CardDescription>Add funds to your solar investment account</CardDescription>
            </CardHeader>
            <CardContent>
              {!showManualPayment ? (
                <div className="space-y-4">
                  <Button 
                    onClick={() => setShowManualPayment(true)}
                    className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-semibold"
                  >
                    💰 Make a Deposit
                  </Button>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium mb-2">📱 How to Deposit:</p>
                    <div className="text-xs md:text-sm text-blue-700 space-y-1">
                      <p>1. Click "Make a Deposit" above</p>
                      <p>2. Send money to: <strong>0786281379</strong></p>
                      <p>3. Submit transaction details for verification</p>
                      <p>4. Funds credited after admin verification</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Manual Deposit</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowManualPayment(false)}
                    >
                      ← Back
                    </Button>
                  </div>
                  <ManualPayment 
                    onPaymentSubmitted={(paymentId, amount) => {
                      setShowManualPayment(false);
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Withdrawal Section */}
          <Card className="bg-white shadow-lg h-fit">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowDownCircle className="h-6 w-6 mr-2 text-blue-600" />
                Withdraw Funds
              </CardTitle>
              <CardDescription>Withdraw your solar investment earnings</CardDescription>
            </CardHeader>
            <CardContent>
              {!showWithdrawalRequest ? (
                <div className="space-y-4">
                  <Button 
                    onClick={() => setShowWithdrawalRequest(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold"
                  >
                    💸 Request Withdrawal
                  </Button>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800 font-medium mb-2">⏰ Withdrawal Hours:</p>
                    <div className="text-xs md:text-sm text-yellow-700 space-y-1">
                      <p>• Monday to Friday: 9 AM - 6 PM</p>
                      <p>• Transfer fee: 10% of withdrawal amount</p>
                      <p>• Minimum withdrawal: KSh 800</p>
                      <p>• Processing time: 1-4 hours</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Withdrawal Request</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowWithdrawalRequest(false)}
                    >
                      ← Back
                    </Button>
                  </div>
                  <WithdrawalRequest 
                    onWithdrawalSubmitted={(requestId, amount, netAmount) => {
                      setShowWithdrawalRequest(false);
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Referral Program */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Share2 className="h-8 w-8 mr-3" />
              🎁 Referral Program - Earn KSh 200 per Friend!
            </CardTitle>
            <CardDescription className="text-purple-100">
              Share Solar Invest with friends and earn KSh 200 for every friend who purchases a package
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-3xl font-bold">KSh 200</div>
                  <div className="text-purple-100">Per Referral</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-3xl font-bold">{0}</div>
                  <div className="text-purple-100">Your Referrals</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-3xl font-bold">KSh {profile?.referral_earnings?.toLocaleString() || '0'}</div>
                  <div className="text-purple-100">Total Earned</div>
                </div>
              </div>

              <div>
                <Label className="text-white mb-2 block">Your Referral Code:</Label>
                <div className="flex gap-2">
                  <Input
                    value={profile?.referral_code || ''}
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
                  <li>3. When they purchase any solar package, you earn KSh 200!</li>
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
                  value={profile?.full_name || ''} 
                  disabled 
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="referral-code-display">Your Referral Code</Label>
                <Input 
                  id="referral-code-display" 
                  type="text" 
                  value={profile?.referral_code || ''} 
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