import { createContext } from "react";
import { useAuth } from "./AuthContext";
import { useState } from "react";
import cartService from "../services/cartService";
import { useEffect } from "react";
import { useContext } from "react";
const CartContext = createContext(null);
export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchCart = async () => {
        if(!user){
            setCart([]);
        }
        try{
            setLoading(true);
            const data = await cartService.getCart();
            const items = data.items || data.cart?.items || (Array.isArray(data) ? data : []);
            setCart(items);
        }
        catch(error){
            console.log("Failed to load cart", error);
        }
        finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchCart();
    },[user]);
    const addToCart = async (productId, quantity=1) =>{
        const product = product._id || product.id;
        try{
            const response = await cartService.addToCart(productId, quantity);
            const updatedItems = response.items || response.cart?.items || [];
            setCart(updatedItems);
        }
        catch(error){
            console.log("Failed to add to cart", error);
        }
    };
    const updateQuantity = async (productId, quantity) => {
        if(quantity <= 0){
            removeFromCart(productId);
        }
        try{
            const response = await cartService.updateCartItem(productId, quantity);
            const updatedItems = response.items || response.cart?.items || [];
            if(updatedItems){
                setCart(updatedItems);
            }
            else{
                setCart((prev)=>prev.map(item=>(item.product._id || item.product.id || item._id) === productId ? {...item, quantity} : item));
            }
        }
        catch(error){
            console.log("Failed to update cart quantity", error);
        }
    };
    const removeFromCart = async (productId) => {
        try{
            await cartService.removeFromCart(productId);
            setCart((prev)=>prev.filter(item=>(item.product._id || item.product.id || item._id) !== productId));
        }
        catch(error){
            console.log("Failed to remove from cart", error);
        }
    };
    const totalItems = cart.reduce((sum, item)=>sum + (item.quantity || 1), 0);
    const subTotal = cart.reduce((sum, item) => {
        const price = Number(item.product?.price || item.price) || 0;
        return sum + price * (item.quantity || 1);
    }, 0);
    const tax = subTotal * 0.05;
    const total = subTotal + tax;
    return(
        <CartContext.Provider value={{
            cart,
            loading,
            addToCart,
            updateQuantity,
            removeFromCart,
            totalItems,
            tax,
            subTotal,
            total
        }}>
            {children}
        </CartContext.Provider>
    );
};
export const useCart = () =>{
    const context = useContext(CartContext);
    if(!context){
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};  