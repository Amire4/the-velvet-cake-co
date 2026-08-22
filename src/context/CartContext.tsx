import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types.ts';
import { getProductImageUrl } from '../utils/productImages.ts';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, customization?: CartItem['customization']) => void;
  removeFromCart: (idOrIndex: string | number) => void;
  updateQuantity: (idOrIndex: string | number, quantity: number) => void;
  incrementQuantity: (idOrIndex: string | number) => void;
  decrementQuantity: (idOrIndex: string | number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('velvet_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map((item, idx) => ({
          ...item,
          id: item.id || `cart-item-${idx}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          product: {
            ...item.product,
            imageUrl: getProductImageUrl(item.product)
          }
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('velvet_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity = 1, customization: CartItem['customization'] = {}) => {
    const validProduct: Product = {
      ...product,
      imageUrl: getProductImageUrl(product)
    };

    setCartItems(prev => {
      // Find if exact same product with exact same customization exists
      const custKey = JSON.stringify(customization);
      const existingIndex = prev.findIndex(
        item => item.product.id === validProduct.id && JSON.stringify(item.customization) === custKey
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: newQty * validProduct.price,
          product: validProduct
        };
        return updated;
      }

      const newItemId = `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      return [
        ...prev,
        {
          id: newItemId,
          product: validProduct,
          quantity,
          customization,
          totalPrice: quantity * validProduct.price
        }
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (idOrIndex: string | number) => {
    setCartItems(prev => {
      if (typeof idOrIndex === 'number') {
        return prev.filter((_, i) => i !== idOrIndex);
      }
      return prev.filter(item => item.id !== idOrIndex);
    });
  };

  const updateQuantity = (idOrIndex: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(idOrIndex);
      return;
    }
    setCartItems(prev => {
      const updated = [...prev];
      let targetIndex = -1;

      if (typeof idOrIndex === 'number') {
        targetIndex = idOrIndex;
      } else {
        targetIndex = updated.findIndex(item => item.id === idOrIndex);
        if (targetIndex === -1) {
          targetIndex = updated.findIndex(item => item.product.id === idOrIndex);
        }
      }

      if (targetIndex > -1 && updated[targetIndex]) {
        const currentItem = updated[targetIndex];
        updated[targetIndex] = {
          ...currentItem,
          quantity,
          totalPrice: quantity * currentItem.product.price
        };
      }
      return updated;
    });
  };

  const incrementQuantity = (idOrIndex: string | number) => {
    setCartItems(prev => {
      const updated = [...prev];
      let targetIndex = -1;

      if (typeof idOrIndex === 'number') {
        targetIndex = idOrIndex;
      } else {
        targetIndex = updated.findIndex(item => item.id === idOrIndex);
        if (targetIndex === -1) {
          targetIndex = updated.findIndex(item => item.product.id === idOrIndex);
        }
      }

      if (targetIndex > -1 && updated[targetIndex]) {
        const currentItem = updated[targetIndex];
        const newQty = currentItem.quantity + 1;
        updated[targetIndex] = {
          ...currentItem,
          quantity: newQty,
          totalPrice: newQty * currentItem.product.price
        };
      }
      return updated;
    });
  };

  const decrementQuantity = (idOrIndex: string | number) => {
    setCartItems(prev => {
      let targetIndex = -1;

      if (typeof idOrIndex === 'number') {
        targetIndex = idOrIndex;
      } else {
        targetIndex = prev.findIndex(item => item.id === idOrIndex);
        if (targetIndex === -1) {
          targetIndex = prev.findIndex(item => item.product.id === idOrIndex);
        }
      }

      if (targetIndex > -1 && prev[targetIndex]) {
        const currentItem = prev[targetIndex];
        if (currentItem.quantity <= 1) {
          return prev.filter((_, i) => i !== targetIndex);
        }
        const updated = [...prev];
        const newQty = currentItem.quantity - 1;
        updated[targetIndex] = {
          ...currentItem,
          quantity: newQty,
          totalPrice: newQty * currentItem.product.price
        };
        return updated;
      }
      return prev;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.totalPrice || item.quantity * item.product.price), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        itemCount,
        subtotal,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
