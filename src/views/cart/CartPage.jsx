import { useCart } from "../../context/CartContext";
const CartPage = () => {
    const {
        cart,
        updateQuantity,
        removeFromCart,
        subTotal,
        tax,
        shipping,
        total
    } = useCart();
    
};