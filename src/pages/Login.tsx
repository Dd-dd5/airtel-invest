
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login, resetPassword, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(phone, password);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back to Airtel Invest!",
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid phone number or password.",
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
          title: "Reset Link Sent",
          description: "Check your SMS for password reset instructions.",
        });
        setShowForgotPassword(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset link.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">Airtel Invest</CardTitle>
          <CardDescription>
            {showForgotPassword ? "Reset your password" : "Sign in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={showForgotPassword ? handleForgotPassword : handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+254700000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            
            {!showForgotPassword && (
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? "Please wait..." : showForgotPassword ? "Send Reset Link" : "Sign In"}
            </Button>

            {!showForgotPassword ? (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Forgot your password?
                </button>
              </div>
            ) : (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Back to login
                </button>
              </div>
            )}
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">Demo Login:</p>
            <p className="text-xs text-blue-600">Phone: +254700000000</p>
            <p className="text-xs text-blue-600">Password: password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
