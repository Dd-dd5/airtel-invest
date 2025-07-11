import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Eye, 
  Search,
  Download,
  RefreshCw,
  UserPlus,
  ArrowUpCircle,
  ArrowDownCircle,
  Gift,
  Package
} from "lucide-react";

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  type: 'registration' | 'deposit' | 'withdrawal' | 'investment' | 'referral_earning' | 'referral_signup';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  details?: any;
}

interface User {
  phone: string;
  name: string;
  balance: number;
  referralCode: string;
  referralEarnings: number;
  totalReferrals: number;
  registrationDate: Date;
}

// Production admin access configuration
const ADMIN_DOMAINS = [
  'localhost',
  'your-domain.com', // Replace with your actual domain
  'admin.your-domain.com', // Optional admin subdomain
];

const ADMIN_ACCESS_KEY = 'solar_admin_2024'; // Change this to a secure key

const Admin = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const [isLoading, setIsLoading] = useState(false);

  // Check admin access on component mount
  useEffect(() => {
    const currentDomain = window.location.hostname;
    const savedAdminAccess = localStorage.getItem('solar_admin_access');
    
    // Check if on authorized domain or has saved access
    if (ADMIN_DOMAINS.includes(currentDomain) || savedAdminAccess === ADMIN_ACCESS_KEY) {
      setIsAuthorized(true);
    }
  }, []);

  const handleAdminLogin = () => {
    if (accessKey === ADMIN_ACCESS_KEY) {
      setIsAuthorized(true);
      localStorage.setItem('solar_admin_access', ADMIN_ACCESS_KEY);
    } else {
      alert('Invalid access key');
    }
  };

  // Load data from localStorage and set up real-time monitoring
  useEffect(() => {
    if (!isAuthorized) return;
    
    loadInitialData();
    
    // Set up polling to check for new transactions every 2 seconds
    const interval = setInterval(() => {
      checkForNewTransactions();
    }, 2000);

    return () => clearInterval(interval);
  }, [isAuthorized]);

  // Admin login screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">🔐 Admin Access</CardTitle>
            <CardDescription>Enter admin access key to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="accessKey">Access Key</Label>
              <Input
                id="accessKey"
                type="password"
                placeholder="Enter admin access key"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
            <Button onClick={handleAdminLogin} className="w-full">
              Access Admin Dashboard
            </Button>
            <div className="text-xs text-gray-500 text-center">
              Domain: {window.location.hostname}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const loadInitialData = () => {
    // Load users
    const usersData = JSON.parse(localStorage.getItem('solar_users_db') || '[]');
    const usersWithDates = usersData.map((user: any) => ({
      ...user,
      registrationDate: new Date(user.registrationDate || Date.now())
    }));
    setUsers(usersWithDates);

    // Load existing transactions
    const existingTransactions = JSON.parse(localStorage.getItem('solar_admin_transactions') || '[]');
    const transactionsWithDates = existingTransactions.map((tx: any) => ({
      ...tx,
      timestamp: new Date(tx.timestamp)
    }));
    setTransactions(transactionsWithDates);

    // Generate initial transactions from user data if none exist
    if (existingTransactions.length === 0) {
      generateInitialTransactions(usersWithDates);
    }
  };

  const generateInitialTransactions = (usersData: User[]) => {
    const initialTransactions: Transaction[] = [];
    
    usersData.forEach((user, index) => {
      // Registration transaction
      initialTransactions.push({
        id: `reg_${user.phone}_${Date.now()}`,
        userId: user.phone,
        userName: user.name,
        userPhone: user.phone,
        type: 'registration',
        amount: 0,
        status: 'completed',
        timestamp: user.registrationDate,
        details: { referralCode: user.referralCode }
      });

      // Simulate some historical transactions
      if (user.balance > 0) {
        initialTransactions.push({
          id: `dep_${user.phone}_${Date.now() + index}`,
          userId: user.phone,
          userName: user.name,
          userPhone: user.phone,
          type: 'deposit',
          amount: user.balance,
          status: 'completed',
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          details: { method: 'M-Pesa' }
        });
      }

      if (user.referralEarnings > 0) {
        initialTransactions.push({
          id: `ref_${user.phone}_${Date.now() + index * 2}`,
          userId: user.phone,
          userName: user.name,
          userPhone: user.phone,
          type: 'referral_earning',
          amount: user.referralEarnings,
          status: 'completed',
          timestamp: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
          details: { referrals: user.totalReferrals }
        });
      }
    });

    setTransactions(initialTransactions);
    localStorage.setItem('solar_admin_transactions', JSON.stringify(initialTransactions));
  };

  const checkForNewTransactions = () => {
    const currentUsers = JSON.parse(localStorage.getItem('solar_users_db') || '[]');
    const currentTransactions = JSON.parse(localStorage.getItem('solar_admin_transactions') || '[]');
    
    // Check for new users
    const existingUserPhones = users.map(u => u.phone);
    const newUsers = currentUsers.filter((user: any) => !existingUserPhones.includes(user.phone));
    
    if (newUsers.length > 0) {
      const newTransactions: Transaction[] = [];
      
      newUsers.forEach((user: any) => {
        newTransactions.push({
          id: `reg_${user.phone}_${Date.now()}`,
          userId: user.phone,
          userName: user.name,
          userPhone: user.phone,
          type: 'registration',
          amount: 0,
          status: 'completed',
          timestamp: new Date(),
          details: { referralCode: user.referralCode }
        });
      });

      const updatedTransactions = [...currentTransactions, ...newTransactions];
      setTransactions(prev => [...prev, ...newTransactions.map(tx => ({ ...tx, timestamp: new Date(tx.timestamp) }))]);
      localStorage.setItem('solar_admin_transactions', JSON.stringify(updatedTransactions));
      
      setUsers(currentUsers.map((user: any) => ({
        ...user,
        registrationDate: new Date(user.registrationDate || Date.now())
      })));
    }

    // Check for balance changes (deposits/withdrawals)
    currentUsers.forEach((currentUser: any) => {
      const previousUser = users.find(u => u.phone === currentUser.phone);
      if (previousUser && currentUser.balance !== previousUser.balance) {
        const difference = currentUser.balance - previousUser.balance;
        const transactionType = difference > 0 ? 'deposit' : 'withdrawal';
        
        const newTransaction: Transaction = {
          id: `${transactionType}_${currentUser.phone}_${Date.now()}`,
          userId: currentUser.phone,
          userName: currentUser.name,
          userPhone: currentUser.phone,
          type: transactionType,
          amount: Math.abs(difference),
          status: 'completed',
          timestamp: new Date(),
          details: { method: transactionType === 'deposit' ? 'M-Pesa' : 'M-Pesa Withdrawal' }
        };

        const updatedTransactions = [...currentTransactions, newTransaction];
        setTransactions(prev => [{ ...newTransaction, timestamp: new Date(newTransaction.timestamp) }, ...prev]);
        localStorage.setItem('solar_admin_transactions', JSON.stringify(updatedTransactions));
      }
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'registration': return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'deposit': return <ArrowUpCircle className="h-4 w-4 text-green-500" />;
      case 'withdrawal': return <ArrowDownCircle className="h-4 w-4 text-red-500" />;
      case 'investment': return <Package className="h-4 w-4 text-purple-500" />;
      case 'referral_earning': return <Gift className="h-4 w-4 text-yellow-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionBadge = (type: string, status: string) => {
    const statusColor = status === 'completed' ? 'bg-green-500' : status === 'pending' ? 'bg-yellow-500' : 'bg-red-500';
    const typeText = type.replace('_', ' ').toUpperCase();
    return <Badge className={`${statusColor} text-white`}>{typeText}</Badge>;
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.userPhone.includes(searchTerm) ||
                         tx.type.includes(searchTerm.toLowerCase());
    
    const now = new Date();
    const txDate = new Date(tx.timestamp);
    
    let matchesTimeRange = true;
    switch (selectedTimeRange) {
      case 'today':
        matchesTimeRange = txDate.toDateString() === now.toDateString();
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesTimeRange = txDate >= weekAgo;
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesTimeRange = txDate >= monthAgo;
        break;
    }
    
    return matchesSearch && matchesTimeRange;
  });

  const totalUsers = users.length;
  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);
  const totalTransactions = transactions.length;
  const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const exportTransactions = () => {
    const csvContent = [
      ['Timestamp', 'User Name', 'Phone', 'Type', 'Amount', 'Status', 'Details'].join(','),
      ...filteredTransactions.map(tx => [
        tx.timestamp.toISOString(),
        tx.userName,
        tx.userPhone,
        tx.type,
        tx.amount,
        tx.status,
        JSON.stringify(tx.details || {})
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solar_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 Solar Invest Admin Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring and management of all platform activities</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Balance</p>
                  <p className="text-2xl font-bold text-green-600">KSh {totalBalance.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-purple-600">{totalTransactions}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Volume</p>
                  <p className="text-2xl font-bold text-orange-600">KSh {totalVolume.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Real-time Transactions</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Live Transaction Monitor
                    </CardTitle>
                    <CardDescription>Real-time tracking of all platform transactions</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button onClick={exportTransactions} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Transactions</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search by name, phone, or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="timeRange">Time Range</Label>
                    <select
                      id="timeRange"
                      value={selectedTimeRange}
                      onChange={(e) => setSelectedTimeRange(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="today">Today</option>
                      <option value="week">Last 7 Days</option>
                      <option value="month">Last 30 Days</option>
                      <option value="all">All Time</option>
                    </select>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.slice(0, 50).map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-mono text-sm">
                            {transaction.timestamp.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{transaction.userName}</div>
                              <div className="text-sm text-gray-500">{transaction.userPhone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTransactionIcon(transaction.type)}
                              {getTransactionBadge(transaction.type, transaction.status)}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">
                            {transaction.amount > 0 ? `KSh ${transaction.amount.toLocaleString()}` : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {transaction.details ? JSON.stringify(transaction.details) : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No transactions found for the selected criteria.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Overview of all registered users and their activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User Details</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Referrals</TableHead>
                        <TableHead>Referral Earnings</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.phone}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.phone}</div>
                              <div className="text-xs text-blue-600">Code: {user.referralCode}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">
                            KSh {user.balance.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.totalReferrals} referrals</Badge>
                          </TableCell>
                          <TableCell className="font-mono">
                            KSh {user.referralEarnings.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm">
                            {user.registrationDate.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;