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
      description: "Perfect for beginners",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=200&fit=crop"
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
      description: "Most popular choice",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop"
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
      description: "Steady growth option",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop"
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
      description: "Higher returns",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop"
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
      description: "Premium investment",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop"
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
      description: "High-tier returns",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=200&fit=crop"
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
      description: "Exclusive package",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=200&fit=crop"
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
      description: "Elite investor choice",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=200&fit=crop"
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
      description: "VIP treatment",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=200&fit=crop"
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
      description: "Maximum daily returns",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=200&fit=crop"
    }
  ];

  const handleInvest = (product: typeof products[0]) => {
    toast({
      title: "Investment Initiated",
      description: `You have selected ${product.name} for KSh ${product.investment.toLocaleString()}. Please proceed to deposit funds.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Investment Packages</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Choose the perfect investment package to grow your wealth. All packages offer guaranteed daily returns with flexible investment options.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${product.popular ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
              {product.popular && (
                <Badge className="absolute top-4 left-4 z-10 bg-blue-500 hover:bg-blue-600">
                  Most Popular
                </Badge>
              )}
              
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <product.icon className="h-8 w-8 mb-2" />
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      KSh {product.investment.toLocaleString()}
                    </div>
                  </div>
                </div>
                <CardDescription className="text-base">{product.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Daily Return</p>
                    <p className="font-bold text-green-600 text-lg">
                      KSh {product.dailyReturn.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-bold text-blue-600 text-lg">
                      {product.duration} {product.duration === 1 ? 'day' : 'days'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Total Return:</span>
                    <span className="font-bold text-purple-600 text-xl">
                      KSh {product.totalReturn.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Net Profit:</span>
                    <span className="font-bold text-green-600 text-lg">
                      KSh {(product.totalReturn - product.investment).toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => handleInvest(product)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Invest Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Investing?</h2>
              <p className="text-xl mb-6">Join thousands of investors who trust Solar Invest for guaranteed returns</p>
              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-primary-foreground/80">Active Investors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">KSh 50M+</div>
                  <div className="text-primary-foreground/80">Total Investments</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-primary-foreground/80">Customer Support</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Products;
