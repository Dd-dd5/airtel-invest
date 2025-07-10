import { MainNavigation } from "@/components/MainNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Accounts = () => {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");

  const handleDeposit = () => {
    if (!depositAmount) {
      toast({
        title: "Error",
        description: "Please enter the deposit amount.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Deposit Initiated",
      description: `You have initiated a deposit of KSh ${depositAmount}. Please follow the instructions below.`,
    });
  };

  const handleWithdrawal = () => {
    if (!withdrawalAmount) {
      toast({
        title: "Error",
        description: "Please enter the withdrawal amount.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Withdrawal Requested",
      description: `You have requested a withdrawal of KSh ${withdrawalAmount}. Please allow 1-2 business hours for processing.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Your Account</h1>
          <p className="text-gray-600">Deposit funds, request withdrawals, and manage your account settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Deposit Section */}
          <Card>
            <CardHeader>
              <CardTitle>Deposit Funds</CardTitle>
              <CardDescription>Add funds to your account to start or continue investing</CardDescription>
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
                  />
                </div>
                <Button onClick={handleDeposit} className="w-full">
                  Initiate Deposit
                </Button>
              </div>

              <div className="space-y-4 text-sm text-gray-600">
                <p>Send money to the following number using M-Pesa or Airtel Money:</p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-bold text-green-800">+254786281379</p>
                  <p className="text-green-700">Use your phone number as the account number</p>
                </div>
                <p>After sending, your account will be credited within 5 minutes. Contact support if you experience any delays.</p>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal Section */}
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <CardDescription>Withdraw earnings from your account</CardDescription>
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
                  />
                </div>
                <Button onClick={handleWithdrawal} className="w-full">
                  Request Withdrawal
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">Withdrawal Information</p>
                <p className="text-sm text-blue-700 mt-1">
                  Withdrawals are processed within 1-2 business hours. The minimum withdrawal amount is KSh 800.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Settings */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your personal and security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input id="phone-number" type="tel" placeholder="+254700000000" disabled />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="youremail@example.com" disabled />
              </div>
              <Button variant="secondary">Update Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Accounts;
