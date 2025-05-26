
import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

export interface WishlistItem {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (meal: any) => void;
  removeFromWishlist: (mealId: string) => void;
  isInWishlist: (mealId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({} as WishlistContextType);

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setWishlistItems([]);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'wishlists', currentUser.uid),
      (doc) => {
        if (doc.exists()) {
          setWishlistItems(doc.data().items || []);
        }
      },
      (error) => {
        console.error('Error listening to wishlist:', error);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  const saveWishlistToFirestore = async (items: WishlistItem[]) => {
    if (!currentUser) return;
    
    try {
      await setDoc(doc(db, 'wishlists', currentUser.uid), {
        items,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  };

  const addToWishlist = (meal: any) => {
    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to wishlist.",
        variant: "destructive",
      });
      return;
    }

    if (isInWishlist(meal.idMeal)) {
      toast({
        title: "Already in wishlist",
        description: "This item is already in your wishlist.",
      });
      return;
    }

    const wishlistItem: WishlistItem = {
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
      strCategory: meal.strCategory,
      strArea: meal.strArea,
    };

    const updatedItems = [...wishlistItems, wishlistItem];
    setWishlistItems(updatedItems);
    saveWishlistToFirestore(updatedItems);
    
    toast({
      title: "Added to wishlist!",
      description: `${meal.strMeal} has been added to your wishlist.`,
    });
  };

  const removeFromWishlist = (mealId: string) => {
    const updatedItems = wishlistItems.filter(item => item.idMeal !== mealId);
    setWishlistItems(updatedItems);
    saveWishlistToFirestore(updatedItems);
    
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  const isInWishlist = (mealId: string) => {
    return wishlistItems.some(item => item.idMeal === mealId);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
