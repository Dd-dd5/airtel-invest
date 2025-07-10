import { MainNavigation } from "@/components/MainNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Solar Invest</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Your trusted partner in growing wealth through smart investment packages. Join thousands of successful investors today!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example Card - Customize as needed */}
          <Card className="bg-white shadow-md rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Investing Today</h2>
              <p className="text-gray-700 mb-4">Discover the power of smart investments and grow your wealth with Solar Invest.</p>
              <Button>Explore Packages</Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Secure and Reliable</h2>
              <p className="text-gray-700 mb-4">Your investments are safe with us. We use industry-leading security measures to protect your assets.</p>
              <Button>Learn More</Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Expert Support</h2>
              <p className="text-gray-700 mb-4">Our team of experts is here to guide you every step of the way. Get personalized advice and support.</p>
              <Button>Contact Us</Button>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Financial Future?</h2>
              <p className="text-xl mb-6">Join Solar Invest and start building a secure and prosperous future today.</p>
              <Button variant="secondary">
                Get Started <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
