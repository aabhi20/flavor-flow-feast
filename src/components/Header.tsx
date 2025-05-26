
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Menu, Search, ShoppingCart, Heart, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">FoodieExpress</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-orange-500 transition-colors">
              Home
            </Link>
            <Link to="/browse" className="text-gray-700 hover:text-orange-500 transition-colors">
              Browse
            </Link>
            {currentUser && (
              <Link to="/orders" className="text-gray-700 hover:text-orange-500 transition-colors">
                Orders
              </Link>
            )}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                {/* Wishlist */}
                <Link to="/wishlist">
                  <Button variant="ghost" size="sm" className="relative">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>

                {/* Cart */}
                <Link to="/cart">
                  <Button variant="ghost" size="sm" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="h-5 w-5" />
                      <span className="hidden sm:ml-2 sm:block">
                        {currentUser.displayName || 'User'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/browse"
                className="text-gray-700 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse
              </Link>
              {currentUser && (
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-orange-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
