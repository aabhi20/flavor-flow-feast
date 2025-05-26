
import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

export interface CartItem {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  quantity: number;
  price: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (meal: any) => void;
  removeFromCart: (mealId: string) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setCartItems([]);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'carts', currentUser.uid),
      (doc) => {
        if (doc.exists()) {
          setCartItems(doc.data().items || []);
        }
      },
      (error) => {
        console.error('Error listening to cart:', error);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  const saveCartToFirestore = async (items: CartItem[]) => {
    if (!currentUser) return;
    
    try {
      await setDoc(doc(db, 'carts', currentUser.uid), {
        items,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (meal: any) => {
    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart.",
        variant: "destructive",
      });
      return;
    }

    const price = Math.floor(Math.random() * 20) + 10; // Random price between $10-30
    const existingItem = cartItems.find(item => item.idMeal === meal.idMeal);

    let updatedItems;
    if (existingItem) {
      updatedItems = cartItems.map(item =>
        item.idMeal === meal.idMeal
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      const cartItem: CartItem = {
        idMeal: meal.idMeal,
        strMeal: meal.strMeal,
        strMealThumb: meal.strMealThumb,
        strCategory: meal.strCategory,
        strArea: meal.strArea,
        quantity: 1,
        price
      };
      updatedItems = [...cartItems, cartItem];
    }

    setCartItems(updatedItems);
    saveCartToFirestore(updatedItems);
    
    toast({
      title: "Added to cart!",
      description: `${meal.strMeal} has been added to your cart.`,
    });
  };

  const removeFromCart = (mealId: string) => {
    const updatedItems = cartItems.filter(item => item.idMeal !== mealId);
    setCartItems(updatedItems);
    saveCartToFirestore(updatedItems);
    
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = (mealId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(mealId);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.idMeal === mealId ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);
    saveCartToFirestore(updatedItems);
  };

  const clearCart = () => {
    setCartItems([]);
    saveCartToFirestore([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
