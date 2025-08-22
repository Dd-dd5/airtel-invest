import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Zap, TrendingUp, Shield, Clock, ShoppingCart } from "lucide-react";
import { MainNavigation } from "@/components/MainNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { purchaseService } from "@/services/purchaseService";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import solarMiniImg from "@/assets/solar-mini.jpg";
import solarMicroImg from "@/assets/solar-micro.jpg";
import solarStandardImg from "@/assets/solar-standard.jpg";

export default function Products() {
  const { user, profile, updateBalance } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isInvestmentDialogOpen, setIsInvestmentDialogOpen] = useState(false);

  const productImages = [
    solarMiniImg, solarMicroImg, solarStandardImg, 
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop"
  ];
  
  const products = [
    {
      id: 1,
      name: "Solar Mini",
      price: "KSh 200",
      dailyEarnings: "KSh 50",
      duration: "5 days",
      totalReturn: "KSh 250",
      description: "Quick starter package with guaranteed daily earnings.",
      features: ["KSh 50 daily for 5 days", "Limited to 1 purchase", "Quick returns"]
    },
    {
      id: 2,
      name: "Solar Micro",
      price: "KSh 500",
      dailyEarnings: "KSh 50",
      duration: "30 days",
      totalReturn: "KSh 1,500",
      description: "Perfect entry-level investment with steady daily income.",
      features: ["KSh 50 daily for 30 days", "Limited to 1 purchase", "Steady income"]
    },
    {
      id: 3,
      name: "Solar Starter",
      price: "KSh 1,000",
      dailyEarnings: "KSh 100",
      duration: "30 days",
      totalReturn: "KSh 3,000",
      description: "Great starting point for regular investors.",
      features: ["KSh 100 daily for 30 days", "Unlimited purchases", "Consistent growth"]
    },
    {
      id: 4,
      name: "Solar Basic",
      price: "KSh 5,000",
      dailyEarnings: "KSh 500",
      duration: "30 days",
      totalReturn: "KSh 15,000",
      description: "Solid foundation for building your investment portfolio.",
      features: ["KSh 500 daily for 30 days", "Unlimited purchases", "Reliable returns"]
    },
    {
      id: 5,
      name: "Solar Standard",
      price: "KSh 10,000",
      dailyEarnings: "KSh 1,000",
      duration: "30 days",
      totalReturn: "KSh 30,000",
      description: "Standard investment option for consistent growth.",
      features: ["KSh 1,000 daily for 30 days", "Unlimited purchases", "Stable income"]
    },
    {
      id: 6,
      name: "Solar Premium",
      price: "KSh 25,000",
      dailyEarnings: "KSh 2,500",
      duration: "30 days",
      totalReturn: "KSh 75,000",
      description: "Premium investment with enhanced daily returns.",
      features: ["KSh 2,500 daily for 30 days", "Unlimited purchases", "Premium support"]
    },
    {
      id: 7,
      name: "Solar Gold",
      price: "KSh 50,000",
      dailyEarnings: "KSh 5,000",
      duration: "30 days",
      totalReturn: "KSh 150,000",
      description: "Gold-tier investment for serious wealth builders.",
      features: ["KSh 5,000 daily for 30 days", "Unlimited purchases", "Priority support"]
    },
    {
      id: 8,
      name: "Solar Platinum",
      price: "KSh 100,000",
      dailyEarnings: "KSh 10,000",
      duration: "30 days",
      totalReturn: "KSh 300,000",
      description: "Platinum-level investment for high net worth individuals.",
      features: ["KSh 10,000 daily for 30 days", "Unlimited purchases", "VIP support"]
    },
    {
      id: 9,
      name: "Solar Diamond",
      price: "KSh 250,000",
      dailyEarnings: "KSh 25,000",
      duration: "30 days",
      totalReturn: "KSh 750,000",
      description: "Diamond-tier investment for maximum growth potential.",
      features: ["KSh 25,000 daily for 30 days", "Unlimited purchases", "Dedicated advisor"]
    },
    {
      id: 10,
      name: "Solar Elite",
      price: "KSh 500,000",
      dailyEarnings: "KSh 50,000",
      duration: "30 days",
      totalReturn: "KSh 1,500,000",
      description: "Elite investment package for wealth maximization.",
      features: ["KSh 50,000 daily for 30 days", "Unlimited purchases", "Elite benefits"]
    }
  ];

  const handleInvestNow = (product: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to invest in our products.",
        variant: "destructive",
      });
      return;
    }

    setSelectedProduct(product);
    setIsInvestmentDialogOpen(true);
  };

  const confirmInvestment = () => {
    if (!user || !selectedProduct) return;

    // Check if user can purchase this product
    const canPurchase = purchaseService.canPurchaseProduct(user.phone, selectedProduct.id);
    
    if (!canPurchase.canPurchase) {
      toast({
        title: "Purchase Limit Reached",
        description: canPurchase.reason,
        variant: "destructive",
      });
      setIsInvestmentDialogOpen(false);
      return;
    }

    // Check if user has sufficient balance
    const price = parseInt(selectedProduct.price.replace('KSh ', '').replace(',', ''));
    if (profile && profile.balance < price) {
      toast({
        title: "Insufficient Balance",
        description: `You need KSh ${price.toLocaleString()} to invest in ${selectedProduct.name}. Please top up your account.`,
        variant: "destructive",
      });
      setIsInvestmentDialogOpen(false);
      return;
    }

    // Record the purchase
    const result = purchaseService.recordPurchase(
      user.phone,
      selectedProduct.id,
      selectedProduct.name,
      price
    );

    if (result.success) {
      // Deduct amount from user balance
      updateBalance(-price);
      
      toast({
        title: "Investment Successful! 🎉",
        description: `You've successfully invested in ${selectedProduct.name}. You'll start earning ${selectedProduct.dailyEarnings} daily!`,
      });
    } else {
      toast({
        title: "Investment Failed",
        description: result.message,
        variant: "destructive",
      });
    }

    setIsInvestmentDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 pb-20 md:pb-0">
      <MainNavigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Solar Investment Products
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our range of investment products designed to help you grow your wealth
            with the power of renewable energy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          {products.map((product, index) => (
            <Card key={product.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 bg-white overflow-hidden">
              <div className="relative">
                <img 
                  src={productImages[index] || productImages[index % productImages.length]} 
                  alt={product.name}
                  className="w-full h-40 md:h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-primary text-primary-foreground px-2 py-1 text-xs">
                    {product.id <= 2 ? "Limited" : "Unlimited"}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg md:text-xl text-primary mb-2">{product.name}</CardTitle>
                <CardDescription className="text-xs md:text-sm">{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm font-medium">Investment</span>
                    <span className="font-bold text-primary text-sm md:text-base">{product.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm font-medium">Daily Earnings</span>
                    <span className="font-bold text-green-600 text-sm md:text-base">{product.dailyEarnings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm font-medium">Total Return</span>
                    <span className="font-bold text-green-600 text-sm md:text-base">{product.totalReturn}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm font-medium">Duration</span>
                    <span className="font-medium text-sm md:text-base">{product.duration}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-xs md:text-sm">Key Features:</h4>
                  <ul className="space-y-1">
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-xs md:text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  className="w-full h-9 md:h-10 text-sm md:text-base"
                  onClick={() => handleInvestNow(product)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Invest Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          <Card className="text-center p-4 md:p-6 bg-white shadow-lg">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-2 md:mb-3" />
            <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">Renewable Energy</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Invest in the future of clean energy</p>
          </Card>
          <Card className="text-center p-4 md:p-6 bg-white shadow-lg">
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-2 md:mb-3" />
            <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">Growing Returns</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Competitive returns on your investment</p>
          </Card>
          <Card className="text-center p-4 md:p-6 bg-white shadow-lg">
            <Shield className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-2 md:mb-3" />
            <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">Secure Platform</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Your investments are protected</p>
          </Card>
          <Card className="text-center p-4 md:p-6 bg-white shadow-lg">
            <Clock className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-2 md:mb-3" />
            <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">Flexible Terms</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Choose investment periods that suit you</p>
          </Card>
        </div>

        {/* Investment Confirmation Dialog */}
        <Dialog open={isInvestmentDialogOpen} onOpenChange={setIsInvestmentDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Investment</DialogTitle>
              <DialogDescription>
                Are you sure you want to invest in {selectedProduct?.name}?
              </DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Product:</span>
                    <span>{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Investment:</span>
                    <span className="text-primary font-bold">{selectedProduct.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Daily Earnings:</span>
                    <span className="text-green-600 font-bold">{selectedProduct.dailyEarnings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Duration:</span>
                    <span>{selectedProduct.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Return:</span>
                    <span className="text-green-600 font-bold">{selectedProduct.totalReturn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Your Balance:</span>
                    <span className="font-bold">KSh {profile?.balance?.toLocaleString() || '0'}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsInvestmentDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={confirmInvestment}
                  >
                    Confirm Investment
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}