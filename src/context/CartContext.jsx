import React, { createContext, useContext, useState, useEffect } from "react";
import cartService from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }
    try {
      setLoading(true);
      const res = await cartService.getCart();
      const items = res?.items || res?.cart?.items || (Array.isArray(res) ? res : []);
      setCart(items);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);
  const addToCart = async (productItem, quantity = 1) => {
    if (!productItem) return;
    const targetId = productItem._id || productItem.id;

    try {
      const res = await cartService.addToCart(targetId, quantity);
      const updatedItems = res?.items || res?.cart?.items;
      if (updatedItems && Array.isArray(updatedItems)) {
        setCart(updatedItems);
      } else {
        setCart((prev) => {
          const exists = prev.find(
            (i) => (i.product?._id || i.product || i._id) === targetId
          );
          if (exists) {
            return prev.map((i) =>
              (i.product?._id || i.product || i._id) === targetId
                ? { ...i, quantity: (i.quantity || 1) + quantity }
                : i
            );
          }
          return [...prev, { product: productItem, quantity }];
        });
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };
const updateQuantity = async (productId, qty) => {
  if (qty <= 0) {
    return removeFromCart(productId);
  }
  const previousCart = [...cart];
  setCart((prev) =>
    prev.map((item) => {
      const id = item.product?._id || item.product?.id || item.productId || item._id;
      return id === productId ? { ...item, quantity: qty } : item;
    })
  );
  try {
    const res = await cartService.updateCartItem(productId, qty);
    const updatedItems = res?.items || res?.cart?.items;
    if (updatedItems && Array.isArray(updatedItems)) {
      setCart(updatedItems);
    }
  } catch (err) {
    console.error("Failed to update cart quantity on server, reverting:", err);
    setCart(previousCart);
  }
};
const removeFromCart = async (productId) => {
  const previousCart = [...cart];
  setCart((prev) =>
    prev.filter((item) => {
      const id = item.product?._id || item.product?.id || item.productId || item._id;
      return id !== productId;
    })
  );
  try {
    await cartService.removeFromCart(productId);
  } catch (err) {
    console.error("Failed to remove item on server, reverting:", err);
    setCart(previousCart);
  }
};
  const totalItems = (cart || []).reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0);
  const subtotal = (cart || []).reduce((sum, item) => {
    const rawPrice = item?.product?.price ?? item?.price ?? 0;
    const price = Number(rawPrice) || 0;
    const quantity = Number(item?.quantity) || 1;
    return sum + price * quantity;
  }, 0);

  const tax = subtotal * 0.05;
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 10;
  const finalTotal = subtotal + tax + shipping;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        fetchCart,
        totalItems: totalItems || 0,
        subtotal: subtotal || 0,
        tax: tax || 0,
        shipping: shipping || 0,
        finalTotal: finalTotal || 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};