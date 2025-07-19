import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, Shield, Clock } from "lucide-react";

export default function Products() {
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "High": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Solar Investment Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our range of investment products designed to help you grow your wealth
            with the power of renewable energy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-primary mb-2">{product.name}</CardTitle>
                <CardDescription className="text-sm">{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Minimum Investment</span>
                    <span className="font-bold text-primary">{product.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Daily Earnings</span>
                    <span className="font-bold text-green-600">{product.dailyEarnings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Return</span>
                    <span className="font-bold text-green-600">{product.totalReturn}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Duration</span>
                    <span className="font-medium">{product.duration}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Key Features:</h4>
                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full">
                  Invest Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center p-6">
            <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Renewable Energy</h3>
            <p className="text-sm text-muted-foreground">Invest in the future of clean energy</p>
          </Card>
          <Card className="text-center p-6">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Growing Returns</h3>
            <p className="text-sm text-muted-foreground">Competitive returns on your investment</p>
          </Card>
          <Card className="text-center p-6">
            <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Secure Platform</h3>
            <p className="text-sm text-muted-foreground">Your investments are protected</p>
          </Card>
          <Card className="text-center p-6">
            <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Flexible Terms</h3>
            <p className="text-sm text-muted-foreground">Choose investment periods that suit you</p>
          </Card>
        </div>
      </div>
    </div>
  );
}