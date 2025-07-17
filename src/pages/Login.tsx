import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Sun, Leaf, Zap } from "lucide-react";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login, signup, resetPassword, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(phone, password);
      if (success) {
        toast({
          title: "Welcome Back! ☀️",
          description: "Successfully logged into your Solar Invest account!",
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid phone number or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await signup(phone, password, name, referralCode);
      if (success) {
        toast({
          title: "Account Created! 🎉",
          description: "Welcome to Solar Invest! Start your solar investment journey today.",
        });
      } else {
        toast({
          title: "Signup Failed",
          description: "User with this phone number already exists.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during signup.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast({
        title: "Phone Required",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await resetPassword(phone);
      if (success) {
        toast({
          title: "Reset Instructions Sent! 📱",
          description: "Check your SMS for password reset instructions.",
        });
        setShowForgotPassword(false);
      } else {
        toast({
          title: "User Not Found",
          description: "No account found with this phone number.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset instructions.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Sun className="h-8 w-8 md:h-10 md:w-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Solar Invest</h1>
          <p className="text-sm md:text-base text-gray-600">Powering your financial future with solar energy</p>
          <div className="flex justify-center space-x-4 mt-3">
            <div className="flex items-center text-xs md:text-sm text-gray-600">
              <Leaf className="h-3 w-3 md:h-4 md:w-4 mr-1 text-green-500" />
              Eco-Friendly
            </div>
            <div className="flex items-center text-xs md:text-sm text-gray-600">
              <Zap className="h-3 w-3 md:h-4 md:w-4 mr-1 text-yellow-500" />
              Daily Returns
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl md:text-2xl font-bold text-gray-900">
              {showForgotPassword ? "Reset Password" : "Access Your Account"}
            </CardTitle>
            <CardDescription className="text-sm">
              {showForgotPassword 
                ? "Enter your phone number to reset your password" 
                : "Login or create your solar investment account"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showForgotPassword ? (
              <Tabs defaultValue="login" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" className="text-sm">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="text-sm">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+254700000000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="mt-1 h-12 text-base"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password" className="text-sm">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 h-12 text-base"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-base font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "☀️ Sign In"}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-yellow-600 hover:underline"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-name" className="text-sm">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 h-12 text-base"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="signup-phone" className="text-sm">Phone Number</Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="+254700000000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="mt-1 h-12 text-base"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="signup-password" className="text-sm">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 h-12 text-base"
                      />
                    </div>

                    <div>
                      <Label htmlFor="referral-code" className="text-sm">Referral Code (Optional)</Label>
                      <Input
                        id="referral-code"
                        type="text"
                        placeholder="Enter referral code"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        className="mt-1 h-12 text-base"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        🎁 Enter a referral code to help your friend earn KSh 200!
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-base font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "🚀 Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <Label htmlFor="forgot-phone" className="text-sm">Phone Number</Label>
                  <Input
                    id="forgot-phone"
                    type="tel"
                    placeholder="+254700000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="mt-1 h-12 text-base"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-base font-semibold"
                  disabled={isLoading}
                >
                  📱 Send Reset Instructions
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    ← Back to login
                  </button>
                </div>
              </form>
            )}

            {/* Features */}
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="p-2 md:p-3 bg-green-50 rounded-lg">
                <div className="text-xl md:text-2xl mb-1">🌱</div>
                <div className="text-xs text-green-700 font-medium">Eco-Friendly</div>
              </div>
              <div className="p-2 md:p-3 bg-yellow-50 rounded-lg">
                <div className="text-xl md:text-2xl mb-1">💰</div>
                <div className="text-xs text-yellow-700 font-medium">Daily Returns</div>
              </div>
              <div className="p-2 md:p-3 bg-blue-50 rounded-lg">
                <div className="text-xl md:text-2xl mb-1">🔒</div>
                <div className="text-xs text-blue-700 font-medium">100% Secure</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;