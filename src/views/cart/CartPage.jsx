import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const CartPage = () => {
  const {
    cart = [],
    updateQuantity,
    removeFromCart,
    subtotal = 0,
    tax = 0,
    shipping = 0,
    finalTotal = 0,
  } = useCart();

  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-12 shadow-sm space-y-4">
          <svg
            className="w-16 h-16 mx-auto text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Looks like you haven't added any products to your shopping cart yet.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-block px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-xs text-gray-500 mt-1">Review your selected items before checkout</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Product Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item, idx) => {
            // Normalize populated product object vs flat object
            const prod = typeof item.product === "object" && item.product !== null ? item.product : item;
            const itemId = prod._id || prod.id || item._id;
            const itemPrice = Number(prod.price ?? item.price) || 0;
            const quantity = Number(item.quantity) || 1;

            return (
              <div
                key={itemId || idx}
                className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center gap-4"
              >
                <img
                  src={prod.image || "https://placehold.co/100x100?text=Product"}
                  alt={prod.name || "Product"}
                  className="w-20 h-20 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                />

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                    {prod.name || "Product Item"}
                  </h3>
                  <p className="text-xs text-gray-500 capitalize mt-0.5">
                    {prod.category || "General"}
                  </p>
                  <p className="text-sm font-bold text-indigo-600 mt-2">
                    ${itemPrice.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl p-1 bg-gray-50">
                  <button
                    onClick={() => updateQuantity(itemId, quantity - 1)}
                    className="h-7 w-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-semibold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(itemId, quantity + 1)}
                    className="h-7 w-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal & Delete */}
                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-24">
                  <span className="text-sm font-bold text-gray-900">
                    ${(itemPrice * quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(itemId)}
                    className="text-xs font-medium text-red-500 hover:text-red-700 mt-1 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">${Number(subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated Tax (5%)</span>
              <span className="font-semibold text-gray-900">${Number(tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-semibold text-gray-900">
                {shipping === 0 ? (
                  <span className="text-green-600 font-bold">FREE</span>
                ) : (
                  `$${Number(shipping).toFixed(2)}`
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between text-sm font-bold text-gray-900">
              <span>Total</span>
              <span>${Number(finalTotal).toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => alert("Proceeding to checkout...")}
            className="w-full py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow transition cursor-pointer"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;