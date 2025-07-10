
import { MainNavigation } from "@/components/MainNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Zap, Rocket, Diamond, Trophy, Target, Gift, Flame, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Products = () => {
  const products = [
    {
      id: 1,
      name: "Starter Package",
      investment: 1000,
      dailyReturn: 100,
      duration: 30,
      totalReturn: 3000,
      icon: Target,
      popular: false,
      description: "Perfect for beginners"
    },
    {
      id: 2,
      name: "Basic Package",
      investment: 2000,
      dailyReturn: 200,
      duration: 30,
      totalReturn: 6000,
      icon: Star,
      popular: true,
      description: "Most popular choice"
    },
    {
      id: 3,
      name: "Standard Package",
      investment: 5000,
      dailyReturn: 500,
      duration: 30,
      totalReturn: 15000,
      icon: Zap,
      popular: false,
      description: "Steady growth option"
    },
    {
      id: 4,
      name: "Premium Package",
      investment: 10000,
      dailyReturn: 1000,
      duration: 30,
      totalReturn: 30000,
      icon: Crown,
      popular: false,
      description: "Higher returns"
    },
    {
      id: 5,
      name: "Gold Package",
      investment: 25000,
      dailyReturn: 2500,
      duration: 30,
      totalReturn: 75000,
      icon: Trophy,
      popular: false,
      description: "Premium investment"
    },
    {
      id: 6,
      name: "Platinum Package",
      investment: 50000,
      dailyReturn: 5000,
      duration: 30,
      totalReturn: 150000,
      icon: Diamond,
      popular: false,
      description: "High-tier returns"
    },
    {
      id: 7,
      name: "Diamond Package",
      investment: 100000,
      dailyReturn: 10000,
      duration: 30,
      totalReturn: 300000,
      icon: Sparkles,
      popular: false,
      description: "Exclusive package"
    },
    {
      id: 8,
      name: "Elite Package",
      investment: 200000,
      dailyReturn: 20000,
      duration: 30,
      totalReturn: 600000,
      icon: Rocket,
      popular: false,
      description: "Elite investor choice"
    },
    {
      id: 9,
      name: "VIP Package",
      investment: 300000,
      dailyReturn: 30000,
      duration: 30,
      totalReturn: 900000,
      icon: Gift,
      popular: false,
      description: "VIP treatment"
    },
    {
      id: 10,
      name: "Ultimate Package",
      investment: 500000,
      dailyReturn: 50000,
      duration: 1,
      totalReturn: 50000,
      icon: Flame,
      popular: false,
      description: "Maximum daily returns"
    }
  ];

  const handleInvest = (product: typeof products[0]) => {
    toast({
      title: "Investment Initiated",
      description: `You have selected ${product.name} for KSh ${product.investment.toLocaleString()}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Products</h1>
          <p className="text-gray-600">Choose the perfect investment package for your goals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className={`relative ${product.popular ? 'ring-2 ring-red-500' : ''}`}>
              {product.popular && (
                <Badge className="absolute -top-2 left-4 bg-red-500 hover:bg-red-600">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <product.icon className="h-8 w-8 text-red-600" />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      KSh {product.investment.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Investment Amount</div>
                  </div>
                </div>
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Return:</span>
                    <span className="font-semibold text-green-600">
                      KSh {product.dailyReturn.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">
                      {product.duration} {product.duration === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Return:</span>
                    <span className="font-semibold text-green-600">
                      KSh {product.totalReturn.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profit:</span>
                    <span className="font-semibold text-blue-600">
                      KSh {(product.totalReturn - product.investment).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    onClick={() => handleInvest(product)}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Invest Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
