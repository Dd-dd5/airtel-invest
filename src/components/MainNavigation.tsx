import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Home, Package, CreditCard, MessageCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const MainNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Products", href: "/products", icon: Package },
    { name: "Accounts", href: "/accounts", icon: CreditCard },
    { name: "Contacts", href: "/contacts", icon: MessageCircle },
  ];

  // Add admin link for development/testing (in production, this would be role-based)
  const adminNavItems = [
    ...navItems,
    { name: "Admin", href: "/admin", icon: MessageCircle }
  ];

  const currentNavItems = window.location.hostname === 'localhost' ? adminNavItems : navItems;

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold">☀️ Solar Invest</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, {user?.name}</span>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <nav className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg md:hidden">
        <div className="px-4">
          <div className="flex justify-between items-center h-14">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">☀️ Solar Invest</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm truncate max-w-24">{user?.name}</span>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 p-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 safe-area-pb">
        <div className="grid grid-cols-4 h-16">
          {currentNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                isActive(item.href)
                  ? "text-yellow-600 bg-yellow-50"
                  : "text-gray-500 hover:text-yellow-600"
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};