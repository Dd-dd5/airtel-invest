
import { useState } from "react";
import { MainNavigation } from "@/components/MainNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, ArrowUpCircle, ArrowDownCircle, Users, Copy, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";

const Accounts = () => {
  const { user, updateBalance } = useAuth();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const referralLink = "https://airtel-invest.com/ref/AI12345";
  const referralCode = "AI12345";

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (amount < 500) {
      toast({
        title: "Minimum Deposit Required",
        description: "Minimum deposit amount is KSh 500",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedProvider || !phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please select provider and enter phone number",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate processing time
    setTimeout(() => {
      updateBalance(amount);
      setIsProcessing(false);
      setDepositAmount("");
      setSelectedProvider("");
      setPhoneNumber("");
      
      toast({
        title: "Deposit Successful!",
        description: `KSh ${amount.toLocaleString()} has been added to your account via ${selectedProvider}`,
      });
    }, 3000);

    toast({
      title: "Processing Deposit",
      description: `Deposit of KSh ${amount.toLocaleString()} via ${selectedProvider} is being processed. Please complete the transaction on your phone.`,
    });
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (amount < 800) {
      toast({
        title: "Minimum Withdrawal Required",
        description: "Minimum withdrawal amount is KSh 800",
        variant: "destructive",
      });
      return;
    }

    if (amount > (user?.balance || 0)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    if (!selectedProvider || !phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please select provider and enter phone number",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate processing time
    setTimeout(() => {
      updateBalance(-amount);
      setIsProcessing(false);
      setWithdrawAmount("");
      setSelectedProvider("");
      setPhoneNumber("");
      
      toast({
        title: "Withdrawal Successful!",
        description: `KSh ${amount.toLocaleString()} has been sent to your ${selectedProvider} account`,
      });
    }, 3000);

    toast({
      title: "Processing Withdrawal",
      description: `Withdrawal of KSh ${amount.toLocaleString()} via ${selectedProvider} is being processed.`,
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Management</h1>
          <p className="text-gray-600">Manage your deposits, withdrawals, and referrals</p>
        </div>

        {/* Account Balance */}
        <Card className="mb-8 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Wallet className="h-6 w-6 mr-2" />
              Account Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">KSh {user?.balance?.toLocaleString() || '0'}</div>
            <p className="text-green-100">Available for withdrawal</p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">Verified Account</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="deposit" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="deposit">Deposit Funds</TabsTrigger>
                <TabsTrigger value="withdraw">Withdraw Funds</TabsTrigger>
              </TabsList>

              <TabsContent value="deposit">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ArrowDownCircle className="h-5 w-5 mr-2 text-green-600" />
                      Deposit Funds
                    </CardTitle>
                    <CardDescription>
                      Add money to your account. Minimum deposit: KSh 500
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="deposit-amount">Amount (KSh)</Label>
                      <Input
                        id="deposit-amount"
                        type="number"
                        placeholder="Enter amount (min. 500)"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        min="500"
                        disabled={isProcessing}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="deposit-provider">Payment Provider</Label>
                      <Select value={selectedProvider} onValueChange={setSelectedProvider} disabled={isProcessing}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="safaricom">Safaricom M-Pesa</SelectItem>
                          <SelectItem value="airtel">Airtel Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="deposit-phone">Your Phone Number</Label>
                      <Input
                        id="deposit-phone"
                        type="tel"
                        placeholder="+254700000000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={isProcessing}
                      />
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center mb-2">
                        <AlertCircle className="h-4 w-4 text-blue-600 mr-2" />
                        <p className="text-sm font-medium text-blue-800">Deposit Instructions:</p>
                      </div>
                      <p className="text-sm text-blue-700 mb-1">
                        Send money to: <strong className="font-mono bg-blue-100 px-2 py-1 rounded">+254786281379</strong>
                      </p>
                      <p className="text-sm text-blue-700">
                        Use your phone number as the account number/reference
                      </p>
                    </div>

                    <Button
                      onClick={handleDeposit}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isProcessing || !depositAmount || !selectedProvider || !phoneNumber}
                    >
                      {isProcessing ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Processing Deposit...
                        </>
                      ) : (
                        'Initiate Deposit'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="withdraw">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ArrowUpCircle className="h-5 w-5 mr-2 text-red-600" />
                      Withdraw Funds
                    </CardTitle>
                    <CardDescription>
                      Withdraw money from your account. Minimum withdrawal: KSh 800
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="withdraw-amount">Amount (KSh)</Label>
                      <Input
                        id="withdraw-amount"
                        type="number"
                        placeholder="Enter amount (min. 800)"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        min="800"
                        max={user?.balance || 0}
                        disabled={isProcessing}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Available balance: KSh {user?.balance?.toLocaleString() || '0'}
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="withdraw-provider">Payment Provider</Label>
                      <Select value={selectedProvider} onValueChange={setSelectedProvider} disabled={isProcessing}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="safaricom">Safaricom M-Pesa</SelectItem>
                          <SelectItem value="airtel">Airtel Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="withdraw-phone">Your Phone Number</Label>
                      <Input
                        id="withdraw-phone"
                        type="tel"
                        placeholder="+254700000000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={isProcessing}
                      />
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                        <p className="text-sm font-medium text-yellow-800">Processing Information:</p>
                      </div>
                      <p className="text-sm text-yellow-700 mb-1">
                        <strong>Processing Time:</strong> 1-5 minutes
                      </p>
                      <p className="text-sm text-yellow-700">
                        Withdrawals are processed instantly during business hours
                      </p>
                    </div>

                    <Button
                      onClick={handleWithdraw}
                      className="w-full bg-red-600 hover:bg-red-700"
                      disabled={isProcessing || !withdrawAmount || !selectedProvider || !phoneNumber}
                    >
                      {isProcessing ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Processing Withdrawal...
                        </>
                      ) : (
                        'Request Withdrawal'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Referral Program
                </CardTitle>
                <CardDescription>
                  Earn KSh 400 for each successful referral
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
                    <div className="text-sm text-gray-600">Total Referrals</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">KSh 4,800</div>
                    <div className="text-sm text-gray-600">Total Earned</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Your Referral Code</Label>
                  <div className="flex">
                    <Input value={referralCode} readOnly className="rounded-r-none font-mono" />
                    <Button
                      onClick={() => copyToClipboard(referralCode, "Referral code")}
                      variant="outline"
                      size="icon"
                      className="rounded-l-none"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Referral Link</Label>
                  <div className="flex">
                    <Input value={referralLink} readOnly className="rounded-r-none text-xs" />
                    <Button
                      onClick={() => copyToClipboard(referralLink, "Referral link")}
                      variant="outline"
                      size="icon"
                      className="rounded-l-none"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 font-medium mb-2">How it works:</p>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2" />
                      Share your referral link
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2" />
                      Friend signs up and buys a package
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2" />
                      You earn KSh 400 instantly
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
