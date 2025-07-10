
import { useState } from "react";
import { MainNavigation } from "@/components/MainNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, ArrowUpCircle, ArrowDownCircle, Users, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Accounts = () => {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const referralLink = "https://airtel-invest.com/ref/AI12345";
  const referralCode = "AI12345";

  const handleDeposit = () => {
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

    toast({
      title: "Deposit Initiated",
      description: `Deposit of KSh ${amount.toLocaleString()} via ${selectedProvider} initiated. Please complete the transaction on your phone.`,
    });
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount < 800) {
      toast({
        title: "Minimum Withdrawal Required",
        description: "Minimum withdrawal amount is KSh 800",
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

    toast({
      title: "Withdrawal Initiated",
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="h-5 w-5 mr-2" />
              Account Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">KSh 45,750</div>
            <p className="text-gray-600">Available for withdrawal</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="deposit" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="deposit">Deposit</TabsTrigger>
                <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
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
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="deposit-provider">Payment Provider</Label>
                      <Select value={selectedProvider} onValueChange={setSelectedProvider}>
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
                      />
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Deposit Instructions:</strong>
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Send money to: <strong>+254786281379</strong>
                      </p>
                      <p className="text-sm text-blue-700">
                        Use your phone number as reference
                      </p>
                    </div>

                    <Button
                      onClick={handleDeposit}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Initiate Deposit
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
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="withdraw-provider">Payment Provider</Label>
                      <Select value={selectedProvider} onValueChange={setSelectedProvider}>
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
                      />
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Processing Time:</strong> 1-2 business hours
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Withdrawals are processed during business hours (8 AM - 6 PM)
                      </p>
                    </div>

                    <Button
                      onClick={handleWithdraw}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      Request Withdrawal
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
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
                  <div className="text-sm text-gray-600">Total Referrals</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">KSh 4,800</div>
                  <div className="text-sm text-gray-600">Total Earned</div>
                </div>

                <div className="space-y-2">
                  <Label>Your Referral Code</Label>
                  <div className="flex">
                    <Input value={referralCode} readOnly className="rounded-r-none" />
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

                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">How it works:</p>
                  <ul className="text-xs text-green-700 mt-1 space-y-1">
                    <li>• Share your referral link</li>
                    <li>• Friend signs up and buys a package</li>
                    <li>• You earn KSh 400 instantly</li>
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
