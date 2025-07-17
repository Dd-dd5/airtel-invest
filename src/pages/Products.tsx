import { MainNavigation } from "@/components/MainNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Zap, Rocket, Diamond, Trophy, Target, Gift, Flame, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { purchaseService } from "@/services/purchaseService";
import { useState, useEffect } from "react";

const Products = () => {
  const { user, updateBalance } = useAuth();
  const [purchaseCounts, setPurchaseCounts] = useState<Record<number, number>>({});
  const [purchaseLimits, setPurchaseLimits] = useState<Record<number, { current: number; max: number }>>({});

  useEffect(() => {
    if (user) {
      // Load purchase counts and limits for each product
      const counts: Record<number, number> = {};
      const limits: Record<number, { current: number; max: number }> = {};
      
      products.forEach(product => {
        const count = purchaseService.getPurchaseCount(user.phone, product.id);
        const limit = purchaseService.getPurchaseLimit(product.id);
        
        counts[product.id] = count;
        limits[product.id] = {
          current: count,
          max: limit?.maxPurchases || -1
        };
      });
      
      setPurchaseCounts(counts);
      setPurchaseLimits(limits);
    }
  }, [user]);

  const products = [
    {
      id: 1,
      name: "Solar Mini",
      investment: 200,
      dailyReturn: 50,
      duration: 5,
      totalReturn: 250,
      icon: Target,
      popular: false,
      description: "Quick solar starter package",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Solar Micro",
      investment: 500,
      dailyReturn: 50,
      duration: 30,
      totalReturn: 1500,
      icon: Star,
      popular: false,
      description: "Compact solar investment",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Solar Starter",
      investment: 1000,
      dailyReturn: 100,
      duration: 30,
      totalReturn: 3000,
      icon: Target,
      popular: false,
      description: "Perfect for solar beginners",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&h=200&fit=crop"
    },
    {
      id: 4,
      name: "Solar Basic",
      investment: 2000,
      dailyReturn: 200,
      duration: 30,
      totalReturn: 6000,
      icon: Zap,
      popular: true,
      description: "Most popular solar package",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=200&fit=crop"
    },
    {
      id: 5,
      name: "Solar Standard",
      investment: 5000,
      dailyReturn: 500,
      duration: 30,
      totalReturn: 15000,
      icon: Crown,
      popular: false,
      description: "Steady solar growth",
      image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=400&h=200&fit=crop"
    },
    {
      id: 6,
      name: "Solar Premium",
      investment: 10000,
      dailyReturn: 1000,
      duration: 30,
      totalReturn: 30000,
      icon: Trophy,
      popular: false,
      description: "Premium solar returns",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=200&fit=crop"
    },
    {
      id: 7,
      name: "Solar Gold",
      investment: 25000,
      dailyReturn: 2500,
      duration: 30,
      totalReturn: 75000,
      icon: Diamond,
      popular: false,
      description: "Gold-tier solar investment",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=200&fit=crop"
    },
    {
      id: 8,
      name: "Solar Platinum",
      investment: 50000,
      dailyReturn: 5000,
      duration: 30,
      totalReturn: 150000,
      icon: Sparkles,
      popular: false,
      description: "High-tier solar farm",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop"
    },
    {
      id: 9,
      name: "Solar Diamond",
      investment: 100000,
      dailyReturn: 10000,
      duration: 30,
      totalReturn: 300000,
      icon: Rocket,
      popular: false,
      description: "Exclusive solar project",
      image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=200&fit=crop"
    },
    {
      id: 10,
      name: "Solar Elite",
      investment: 200000,
      dailyReturn: 20000,
      duration: 30,
      totalReturn: 600000,
      icon: Gift,
      popular: false,
      description: "Elite solar portfolio",
      image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=400&h=200&fit=crop"
    },
    {
      id: 11,
      name: "Solar VIP",
      investment: 300000,
      dailyReturn: 30000,
      duration: 30,
      totalReturn: 900000,
      icon: Flame,
      popular: false,
      description: "VIP solar treatment",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop"
    },
    {
      id: 12,
      name: "Solar Ultimate",
      investment: 500000,
      dailyReturn: 50000,
      duration: 30,
      totalReturn: 1500000,
      icon: Flame,
      popular: false,
      description: "Maximum solar returns",
      image: "https://images.unsplash.com/photo-1548337138-e87d889cc369?w=400&h=200&fit=crop"
    }
  ];

  const handleInvest = (product: typeof products[0]) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to purchase solar investment packages.",
        variant: "destructive",
      });
      return;
    }

    // Check if user can purchase this product
    const canPurchase = purchaseService.canPurchaseProduct(user.phone, product.id);
    
    if (!canPurchase.canPurchase) {
      toast({
        title: "Purchase Limit Reached",
        description: canPurchase.reason,
        variant: "destructive",
      });
      return;
    }

    // Check if user has sufficient balance
    if (user.balance < product.investment) {
      toast({
        title: "Insufficient Balance",
        description: `You need KSh ${product.investment.toLocaleString()} to purchase this package. Your current balance is KSh ${user.balance.toLocaleString()}.`,
        variant: "destructive",
      });
      return;
    }

    // Record the purchase
    const result = purchaseService.recordPurchase(
      user.phone,
      product.id,
      product.name,
      product.investment
    );

    if (result.success) {
      // Deduct amount from user balance
      updateBalance(-product.investment);
      
      // Update local purchase counts
      setPurchaseCounts(prev => ({
        ...prev,
        [product.id]: (prev[product.id] || 0) + 1
      }));
      
      setPurchaseLimits(prev => ({
        ...prev,
        [product.id]: {
          ...prev[product.id],
          current: (prev[product.id]?.current || 0) + 1
        }
      }));

      toast({
        title: "✅ Solar Investment Successful!",
        description: `You have successfully purchased ${product.name} for KSh ${product.investment.toLocaleString()}. Start earning KSh ${product.dailyReturn.toLocaleString()} daily!`,
      });
    } else {
      toast({
        title: "Purchase Failed",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const getPurchaseButtonText = (product: typeof products[0]) => {
    if (!user) return "☀️ Invest in Solar Now";
    
    const canPurchase = purchaseService.canPurchaseProduct(user.phone, product.id);
    if (!canPurchase.canPurchase) {
      return "❌ Purchase Limit Reached";
    }
    
    if (user.balance < product.investment) {
      return "💰 Insufficient Balance";
    }
    
    return "☀️ Invest in Solar Now";
  };

  const isPurchaseDisabled = (product: typeof products[0]) => {
    if (!user) return false;
    
    const canPurchase = purchaseService.canPurchaseProduct(user.phone, product.id);
    return !canPurchase.canPurchase || user.balance < product.investment;
  };

  const getPurchaseLimitBadge = (product: typeof products[0]) => {
    const limit = purchaseLimits[product.id];
    if (!limit || limit.max === -1) return null;
    
    const remaining = limit.max - limit.current;
    if (remaining <= 0) {
      return <Badge className="bg-red-500 text-white">❌ Limit Reached</Badge>;
    }
    
    return (
      <Badge className="bg-yellow-500 text-white">
        {remaining} purchase{remaining !== 1 ? 's' : ''} remaining
      </Badge>
    );
  };

  const getBalanceStatus = (product: typeof products[0]) => {
    if (!user) return null;
    
    if (user.balance < product.investment) {
      const needed = product.investment - user.balance;
      return (
        <div className="text-xs text-red-600 mt-1">
          Need KSh {needed.toLocaleString()} more
        </div>
      );
    }
    
    return null;
  };

  const handleInvestOld = (product: typeof products[0]) => {
    toast({
      title: "Solar Investment Initiated! ☀️",
      description: `You have selected ${product.name} for KSh ${product.investment.toLocaleString()}. Please proceed to deposit funds to start earning from solar energy!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 pb-20 md:pb-0">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">☀️ Solar Investment Packages</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Harness the power of the sun and grow your wealth! Choose from our range of solar energy investment packages 
            with guaranteed daily returns. Join the renewable energy revolution while securing your financial future.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Badge className="bg-green-500 text-white px-4 py-2">🌱 100% Renewable Energy</Badge>
            <Badge className="bg-yellow-500 text-white px-4 py-2">⚡ Guaranteed Daily Returns</Badge>
            <Badge className="bg-blue-500 text-white px-4 py-2">🔒 Secure Solar Projects</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-white ${product.popular ? 'ring-2 ring-yellow-500 shadow-lg' : ''}`}>
              {product.popular && (
                <Badge className="absolute top-4 left-4 z-10 bg-yellow-500 hover:bg-yellow-600">
                  ⭐ Most Popular
                </Badge>
              )}
              
              {/* Purchase Limit Badge */}
              {getPurchaseLimitBadge(product) && (
                <div className="absolute top-4 right-4 z-10">
                  {getPurchaseLimitBadge(product)}
                </div>
              )}
              
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <product.icon className="h-8 w-8 mb-2" />
                  <div className="text-sm font-medium">Solar Powered</div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                    ☀️ ECO
                  </div>
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl font-bold text-gray-900">{product.name}</CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-600">
                      KSh {product.investment.toLocaleString()}
                    </div>
                  </div>
                </div>
                <CardDescription className="text-base text-gray-600">{product.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                    <p className="text-sm text-gray-600">Daily Solar Return</p>
                    <p className="font-bold text-green-600 text-lg">
                      KSh {product.dailyReturn.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-200">
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-bold text-blue-600 text-lg">
                      {product.duration} {product.duration === 1 ? 'day' : 'days'}
                    </p>
                  </div>
                </div>
                
                {/* Purchase Status */}
                {user && (
                  <div className="mb-4">
                    {purchaseCounts[product.id] > 0 && (
                      <div className="bg-blue-50 p-2 rounded-lg text-center border border-blue-200">
                        <div className="text-sm text-blue-800">
                          ✅ Purchased {purchaseCounts[product.id]} time{purchaseCounts[product.id] !== 1 ? 's' : ''}
                        </div>
                      </div>
                    )}
                    {getBalanceStatus(product)}
                  </div>
                )}

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Total Solar Return:</span>
                    <span className="font-bold text-yellow-600 text-xl">
                      KSh {product.totalReturn.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Net Solar Profit:</span>
                    <span className="font-bold text-green-600 text-lg">
                      KSh {(product.totalReturn - product.investment).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-xs text-gray-500">
                      🌱 Contributing to {Math.floor(product.investment / 1000)} tons CO₂ reduction
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => handleInvest(product)}
                  disabled={isPurchaseDisabled(product)}
                  className={`w-full font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    isPurchaseDisabled(product)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                  }`}
                >
                  {getPurchaseButtonText(product)}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Solar Benefits Section */}
        <div className="mt-8 md:mt-16">
          <Card className="bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400 text-white">
            <CardContent className="py-6 md:py-12 px-4 md:px-6">
              <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-center">🌟 Why Choose Solar Investment?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-center">
                <div>
                  <div className="text-2xl md:text-4xl mb-2 md:mb-4">🌍</div>
                  <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Environmental Impact</h3>
                  <p className="text-sm md:text-base">Help reduce carbon emissions and contribute to a cleaner planet while earning profits</p>
                </div>
                <div>
                  <div className="text-2xl md:text-4xl mb-2 md:mb-4">💰</div>
                  <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Guaranteed Returns</h3>
                  <p className="text-sm md:text-base">Solar energy provides consistent, predictable returns backed by renewable energy projects</p>
                </div>
                <div>
                  <div className="text-2xl md:text-4xl mb-2 md:mb-4">🚀</div>
                  <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Future-Proof Investment</h3>
                  <p className="text-sm md:text-base">Solar energy is the future - invest in technology that will only grow in value</p>
                </div>
              </div>
              
              <div className="mt-6 md:mt-8 text-center">
                <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">Ready to Power Your Future with Solar?</h3>
                <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-4 md:gap-8 mb-4 md:mb-6">
                  <div>
                    <div className="text-xl md:text-3xl font-bold">500+</div>
                    <div className="text-xs md:text-base text-white/80">Solar Investors</div>
                  </div>
                  <div>
                    <div className="text-xl md:text-3xl font-bold">KSh 50M+</div>
                    <div className="text-xs md:text-base text-white/80">Solar Investments</div>
                  </div>
                  <div>
                    <div className="text-xl md:text-3xl font-bold">1000+</div>
                    <div className="text-xs md:text-base text-white/80">Solar Panels Funded</div>
                  </div>
                  <div>
                    <div className="text-xl md:text-3xl font-bold">24/7</div>
                    <div className="text-xs md:text-base text-white/80">Solar Support</div>
                  </div>
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