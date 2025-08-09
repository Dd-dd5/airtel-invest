
import { MainNavigation } from "@/components/MainNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, MapPin, Clock, Users } from "lucide-react";

const Contacts = () => {
  const handleWhatsAppContact = () => {
    window.open("https://chat.whatsapp.com/KUItJCiDm3d3U9GbLBVXis?mode=ac_t", "_blank");
  };

  const operatingHours = [
    { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "10:00 AM - 2:00 PM" }
  ];

  const faqItems = [
    {
      question: "How do I start investing?",
      answer: "Simply choose a package from our Products page and follow the investment process. Minimum investment starts at KSh 1,000."
    },
    {
      question: "When will I receive my returns?",
      answer: "Daily returns are credited to your account every 24 hours. You can withdraw your earnings anytime after the minimum threshold."
    },
    {
      question: "What is the minimum withdrawal amount?",
      answer: "The minimum withdrawal amount is KSh 800. Withdrawals are processed within 1-2 business hours."
    },
    {
      question: "How does the referral program work?",
      answer: "Share your referral link with friends. When they sign up and purchase any package, you earn KSh 200 instantly."
    },
    {
      question: "Is my investment secure?",
      answer: "Yes, all investments are secured and managed by experienced professionals. We use bank-grade security measures."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-600">We're here to help you with your investment journey</p>
        </div>

        {/* WhatsApp Contact Method */}
        <div className="mb-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-6 w-6 text-green-600" />
                <CardTitle className="text-lg">WhatsApp Support</CardTitle>
              </div>
              <CardDescription>Get instant support via WhatsApp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="font-semibold text-gray-900">WhatsApp Group</p>
              </div>
              <Button
                onClick={handleWhatsAppContact}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Join WhatsApp Group
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Operating Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Operating Hours
              </CardTitle>
              <CardDescription>Our customer support is available during these hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {operatingHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium text-gray-700">{schedule.day}</span>
                    <span className="text-gray-600">{schedule.hours}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 font-medium">24/7 WhatsApp Support</p>
                <p className="text-sm text-green-700 mt-1">
                  For urgent matters, you can reach us on WhatsApp anytime!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Support Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                24/7 Support Available
              </CardTitle>
              <CardDescription>Get help whenever you need it</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">WhatsApp Support</h4>
                  <p className="text-green-700 mb-3">
                    Join our WhatsApp group for 24/7 community support and assistance with:
                  </p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Account management</li>
                    <li>• Investment guidance</li>
                    <li>• Payment support</li>
                    <li>• Technical assistance</li>
                  </ul>
                </div>
                
                <Button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Join WhatsApp Group
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faqItems.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium">Still have questions?</p>
              <p className="text-sm text-yellow-700 mt-1">
                Join our WhatsApp group for community support and assistance!
              </p>
              <Button
                onClick={handleWhatsAppContact}
                className="mt-3 bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Join Group
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contacts;
