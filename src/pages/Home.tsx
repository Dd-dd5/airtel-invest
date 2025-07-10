import { MainNavigation } from "@/components/MainNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Shield, Users, ArrowUp, Sun, Zap, Leaf } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const [liveTransactions, setLiveTransactions] = useState<any[]>([]);

  // Mock live transactions
  const generateTransaction = () => {
    const names = ['John K.', 'Mary W.', 'Peter M.', 'Sarah L.', 'David N.', 'Grace A.', 'Michael O.', 'Lucy K.'];
    const amounts = [1000, 2000, 5000, 10000, 25000, 50000, 100000];
    const types = ['deposit', 'investment', 'withdrawal'];
    
    return {
      id: Date.now() + Math.random(),
      name: names[Math.floor(Math.random() * names.length)],
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      type: types[Math.floor(Math.random() * types.length)],
      timestamp: new Date()
    };
  };

  useEffect(() => {
    // Add initial transactions
    const initialTransactions = Array.from({ length: 5 }, generateTransaction);
    setLiveTransactions(initialTransactions);

    // Add new transaction every 3-8 seconds
    const interval = setInterval(() => {
      const newTransaction = generateTransaction();
      setLiveTransactions(prev => [newTransaction, ...prev.slice(0, 4)]);
    }, Math.random() * 5000 + 3000);

    return () => clearInterval(interval);
  }, []);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return '💰';
      case 'investment': return '📈';
      case 'withdrawal': return '💸';
      default: return '💰';
    }
  };

  const getTransactionText = (type: string) => {
    switch (type) {
      case 'deposit': return 'deposited';
      case 'investment': return 'invested';
      case 'withdrawal': return 'withdrew';
      default: return 'transacted';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 pb-20 md:pb-0">
      <MainNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative mb-8">
            <img 
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=400&fit=crop" 
              alt="Solar panels in sunlight"
              className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-2xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Welcome to <span className="text-yellow-400">Solar Invest</span>
                </h1>
                <p className="text-xl md:text-2xl mb-6 max-w-3xl">
                  🌟 Transform your future with the power of solar energy investments! 
                  Join thousands who are already earning daily returns while building a sustainable tomorrow.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Badge className="bg-green-500 text-white px-4 py-2 text-lg">
                    ✅ Guaranteed Daily Returns
                  </Badge>
                  <Badge className="bg-blue-500 text-white px-4 py-2 text-lg">
                    🔒 100% Secure Platform
                  </Badge>
                  <Badge className="bg-purple-500 text-white px-4 py-2 text-lg">
                    🌱 Eco-Friendly Investment
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {user && (
            <Card className="mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              <CardContent className="py-6">
                <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}! 🎉</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold">KSh {user.balance.toLocaleString()}</div>
                    <div className="text-yellow-100">Current Balance</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">KSh {user.referralEarnings.toLocaleString()}</div>
                    <div className="text-yellow-100">Referral Earnings</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{user.totalReferrals}</div>
                    <div className="text-yellow-100">Total Referrals</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-green-400 to-green-600 text-white hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <Sun className="h-12 w-12 mb-4" />
                  <CardTitle className="text-2xl">Solar Power Investment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-100 mb-4">
                    Invest in clean, renewable solar energy projects and earn guaranteed daily returns while helping the environment.
                  </p>
                  <Link to="/products">
                    <Button variant="secondary" className="w-full">
                      Start Investing <ArrowUp className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <Shield className="h-12 w-12 mb-4" />
                  <CardTitle className="text-2xl">Secure & Reliable</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-100 mb-4">
                    Your investments are protected with bank-grade security. We've successfully processed over KSh 50M in investments.
                  </p>
                  <Link to="/accounts">
                    <Button variant="secondary" className="w-full">
                      Manage Account <Shield className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-400 to-purple-600 text-white hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 mb-4" />
                  <CardTitle className="text-2xl">Daily Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-100 mb-4">
                    Earn consistent daily returns on your solar investments. Watch your money grow every single day!
                  </p>
                  <div className="text-2xl font-bold">Up to 10% Daily</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-400 to-red-500 text-white hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <Users className="h-12 w-12 mb-4" />
                  <CardTitle className="text-2xl">Referral Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-100 mb-4">
                    Earn KSh 400 for every friend you refer who purchases a package. Build your network and earn more!
                  </p>
                  <Link to="/accounts">
                    <Button variant="secondary" className="w-full">
                      Share & Earn <Users className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Success Stories */}
            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-center flex items-center justify-center">
                  <Sparkles className="mr-2 h-6 w-6 text-yellow-500" />
                  Why Choose Solar Invest?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="p-4">
                    <Leaf className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Eco-Friendly</h3>
                    <p className="text-gray-600">Support renewable energy while earning profits</p>
                  </div>
                  <div className="p-4">
                    <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Fast Returns</h3>
                    <p className="text-gray-600">Daily returns credited to your account automatically</p>
                  </div>
                  <div className="p-4">
                    <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Guaranteed</h3>
                    <p className="text-gray-600">All investments are backed by real solar projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Transactions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-xl sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2 pulse-glow"></div>
                  Live Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {liveTransactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-slide-up"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getTransactionIcon(transaction.type)}</span>
                        <div>
                          <div className="font-medium text-sm">{transaction.name}</div>
                          <div className="text-xs text-gray-500">
                            {getTransactionText(transaction.type)} KSh {transaction.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {transaction.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-center">
                  <p className="text-sm text-yellow-800 font-medium">
                    🔥 Join {Math.floor(Math.random() * 100 + 500)}+ active investors today!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white shadow-2xl">
          <CardContent className="py-12 text-center">
            <h2 className="text-4xl font-bold mb-4">🚀 Ready to Transform Your Financial Future?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Don't wait! Start your solar investment journey today and join thousands of successful investors 
              who are already earning daily returns while contributing to a sustainable future.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-yellow-100">Happy Investors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">KSh 50M+</div>
                <div className="text-yellow-100">Total Invested</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-yellow-100">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-yellow-100">Success Rate</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                  🌟 Start Investing Now <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contacts">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-white/10 border-white text-white hover:bg-white hover:text-orange-500">
                  💬 Get Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;