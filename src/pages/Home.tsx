
import { useState, useEffect } from "react";
import { MainNavigation } from "@/components/MainNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Wallet, Award, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const [liveTransactions, setLiveTransactions] = useState<Array<{
    id: string;
    type: 'deposit' | 'earning' | 'withdrawal';
    amount: number;
    user: string;
    time: Date;
  }>>([]);

  // Mock live transactions
  useEffect(() => {
    const generateTransaction = () => {
      const types = ['deposit', 'earning', 'withdrawal'] as const;
      const names = ['John D.', 'Mary K.', 'Peter M.', 'Sarah L.', 'David W.', 'Grace N.'];
      const amounts = {
        deposit: [1000, 2000, 5000, 10000, 25000],
        earning: [100, 200, 500, 1000, 2500],
        withdrawal: [800, 1500, 3000, 5000, 8000]
      };

      const type = types[Math.floor(Math.random() * types.length)];
      const amount = amounts[type][Math.floor(Math.random() * amounts[type].length)];
      const name = names[Math.floor(Math.random() * names.length)];

      return {
        id: Math.random().toString(36).substr(2, 9),
        type,
        amount,
        user: name,
        time: new Date()
      };
    };

    // Add initial transactions
    const initialTransactions = Array.from({ length: 5 }, generateTransaction);
    setLiveTransactions(initialTransactions);

    // Add new transaction every 5-15 seconds
    const interval = setInterval(() => {
      const newTransaction = generateTransaction();
      setLiveTransactions(prev => [newTransaction, ...prev.slice(0, 9)]);
    }, Math.random() * 10000 + 5000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: "Account Balance",
      value: `KSh ${user?.balance?.toLocaleString() || '0'}`,
      description: "Your available balance",
      icon: Wallet,
      color: "text-green-600"
    },
    {
      title: "Daily Earnings",
      value: "KSh 15,750",
      description: "Today's returns",
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      title: "Active Packages",
      value: "5",
      description: "Currently running",
      icon: Award,
      color: "text-purple-600"
    },
    {
      title: "Referrals",
      value: "12",
      description: "Total referrals made",
      icon: Users,
      color: "text-orange-600"
    }
  ];

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'text-blue-600';
      case 'earning': return 'text-green-600';
      case 'withdrawal': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownCircle className="h-4 w-4" />;
      case 'earning': return <TrendingUp className="h-4 w-4" />;
      case 'withdrawal': return <ArrowUpCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Hero Section with Encouraging Message */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-red-600 to-red-800 text-white border-0">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Start Your Investment Journey Today!</h2>
                  <p className="text-xl mb-6 text-red-100">
                    Join thousands of successful investors who are building their financial future with Airtel Invest. 
                    Your dreams are just one investment away!
                  </p>
                  <div className="flex items-center space-x-4 text-red-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold">10,000+</div>
                      <div className="text-sm">Happy Investors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">KSh 50M+</div>
                      <div className="text-sm">Paid Out</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">24/7</div>
                      <div className="text-sm">Support</div>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop" 
                    alt="Woman using laptop for investing" 
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Stories Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face" 
                    alt="Success story" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">"I started with KSh 5,000 and now earn KSh 50,000 monthly!"</p>
                    <p className="text-sm text-gray-500">- Sarah M., Nairobi</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop&crop=face" 
                    alt="Success story" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">"The referral program helped me earn extra KSh 20,000!"</p>
                    <p className="text-sm text-gray-500">- John K., Mombasa</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="transition-transform hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Transactions and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  Live Transactions
                  <Badge variant="secondary" className="ml-2 animate-pulse">LIVE</Badge>
                </CardTitle>
              </div>
              <CardDescription>Real-time platform activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {liveTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg animate-fade-in">
                    <div className="flex items-center space-x-3">
                      <div className={getTransactionColor(transaction.type)}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.user}</p>
                        <p className="text-xs text-gray-500 capitalize">{transaction.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}KSh {transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.time.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Premium Package</p>
                    <p className="text-sm text-gray-500">Today, 2:30 PM</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+KSh 5,000</p>
                    <p className="text-sm text-gray-500">Earnings</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Deposit</p>
                    <p className="text-sm text-gray-500">Yesterday, 3:15 PM</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-blue-600">+KSh 10,000</p>
                    <p className="text-sm text-gray-500">M-Pesa</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium">Withdrawal</p>
                    <p className="text-sm text-gray-500">2 days ago</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-orange-600">-KSh 3,000</p>
                    <p className="text-sm text-gray-500">Airtel Money</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Tips */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Investment Tips</CardTitle>
              <CardDescription>Maximize your returns with these strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Diversify Your Portfolio</h4>
                  <p className="text-sm text-blue-700">Consider investing in multiple packages to spread risk and maximize returns.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Referral Bonus</h4>
                  <p className="text-sm text-green-700">Earn KSh 400 for each successful referral. Share your link with friends!</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">Daily Reinvestment</h4>
                  <p className="text-sm text-orange-700">Reinvest your daily earnings to compound your returns.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
