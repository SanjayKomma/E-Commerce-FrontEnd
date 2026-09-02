import React, { createContext, useContext, useState, useEffect } from "react";
import wishlistService from "../services/wishlistService";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const res = await wishlistService.getWishlist();
      setWishlist(res.wishlist?.products || []);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      alert("Please log in to manage your wishlist.");
      return;
    }

    // 1. Keep a snapshot of current state for rollback
    const previousWishlist = [...wishlist];

    // 2. Optimistic update: flip the state immediately in memory
    const alreadySaved = wishlist.some(
      (item) => (item._id || item).toString() === productId.toString()
    );

    if (alreadySaved) {
      // Remove immediately
      setWishlist((prev) =>
        prev.filter((item) => (item._id || item).toString() !== productId.toString())
      );
    } else {
      // Add immediately (pass minimal object so it matches UI checks)
      setWishlist((prev) => [...prev, { _id: productId }]);
    }

    // 3. Send the network request in the background
    try {
      const res = await wishlistService.toggleWishlist(productId);
      // Sync with fresh populated data from server
      if (res.wishlist?.products) {
        setWishlist(res.wishlist.products);
      }
    } catch (err) {
      console.error("Wishlist toggle error, rolling back:", err);
      // Rollback to original state if network fails
      setWishlist(previousWishlist);
      alert(err.response?.data?.message || "Failed to update wishlist. Please try again.");
    }
  };
  const isWishlisted = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, toggleWishlist, isWishlisted, fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);