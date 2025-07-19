import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, Shield, Clock } from "lucide-react";

export default function Products() {
  const products = [
    {
      id: 1,
      name: "Solar Basic",
      price: "KSh 5,000",
      returns: "8-12%",
      duration: "6 months",
      risk: "Low",
      description: "Perfect for beginners looking to start their investment journey.",
      features: ["Guaranteed returns", "Low risk", "Quick liquidity"]
    },
    {
      id: 2,
      name: "Solar Growth", 
      price: "KSh 15,000",
      returns: "12-18%",
      duration: "12 months",
      risk: "Medium",
      description: "Balanced investment option with steady growth potential.",
      features: ["Higher returns", "Moderate risk", "Annual dividends"]
    },
    {
      id: 3,
      name: "Solar Premium",
      price: "KSh 50,000", 
      returns: "18-25%",
      duration: "24 months",
      risk: "High",
      description: "Maximum growth potential for experienced investors.",
      features: ["Highest returns", "Premium support", "Compound growth"]
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl text-primary">{product.name}</CardTitle>
                  <Badge className={getRiskColor(product.risk)}>{product.risk} Risk</Badge>
                </div>
                <CardDescription className="text-sm">{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Minimum Investment</span>
                    <span className="font-bold text-primary">{product.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Expected Returns</span>
                    <span className="font-bold text-green-600">{product.returns}</span>
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