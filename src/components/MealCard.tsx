
import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { cn } from '@/lib/utils';

interface MealCardProps {
  meal: {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory: string;
    strArea: string;
  };
}

const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(meal.idMeal);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(meal.idMeal);
    } else {
      addToWishlist(meal);
    }
  };

  const price = Math.floor(Math.random() * 20) + 10; // Random price between $10-30

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-2 right-2 bg-white/80 hover:bg-white",
            inWishlist && "text-red-500"
          )}
          onClick={handleWishlistToggle}
        >
          <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
        </Button>
        <div className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
          ${price}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{meal.strMeal}</h3>
        <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
          <span className="bg-gray-100 px-2 py-1 rounded">{meal.strCategory}</span>
          <span>{meal.strArea}</span>
        </div>
        
        <Button
          onClick={() => addToCart(meal)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default MealCard;
