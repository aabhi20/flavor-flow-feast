
import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to view your cart.</p>
            <Link to="/login">
              <Button className="bg-orange-500 hover:bg-orange-600">Log In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious meals to get started!</p>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart ({getTotalItems()} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.idMeal}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.strMealThumb}
                      alt={item.strMeal}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.strMeal}</h3>
                      <p className="text-gray-600">{item.strCategory} • {item.strArea}</p>
                      <p className="text-orange-500 font-semibold">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.idMeal, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.idMeal, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.idMeal)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>$2.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${(getTotalPrice() + 2.99 + getTotalPrice() * 0.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <Link to="/browse">
                  <Button variant="outline" className="w-full mt-2">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
