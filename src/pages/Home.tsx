
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
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
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
