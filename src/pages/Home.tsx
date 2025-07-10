
import { MainNavigation } from "@/components/MainNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Wallet, Award } from "lucide-react";

const Home = () => {
  const stats = [
    {
      title: "Total Investment",
      value: "KSh 1,250,000",
      description: "Your current portfolio value",
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

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to your Airtel Investment Dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
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

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest investment activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Premium Package</p>
                    <p className="text-sm text-gray-500">Today, 2:30 PM</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+KSh 5,000</p>
                    <p className="text-sm text-gray-500">Earnings</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Basic Package</p>
                    <p className="text-sm text-gray-500">Yesterday, 3:15 PM</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+KSh 100</p>
                    <p className="text-sm text-gray-500">Earnings</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Deposit</p>
                    <p className="text-sm text-gray-500">2 days ago</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-blue-600">+KSh 10,000</p>
                    <p className="text-sm text-gray-500">M-Pesa</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Investment Tips</CardTitle>
              <CardDescription>Maximize your returns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
