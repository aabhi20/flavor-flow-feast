
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to view your wishlist.</p>
            <Link to="/login">
              <Button className="bg-orange-500 hover:bg-orange-600">Log In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-6">Save your favorite meals to your wishlist!</p>
            <Link to="/browse">
              <Button className="bg-orange-500 hover:bg-orange-600">Browse Meals</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Your Wishlist ({wishlistItems.length} items)</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.idMeal} className="group hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={item.strMealThumb}
                  alt={item.strMeal}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500"
                  onClick={() => removeFromWishlist(item.idMeal)}
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.strMeal}</h3>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                  <span className="bg-gray-100 px-2 py-1 rounded">{item.strCategory}</span>
                  <span>{item.strArea}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => addToCart(item)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => removeFromWishlist(item.idMeal)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Heart className="h-4 w-4 fill-current" />
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

export default Wishlist;
