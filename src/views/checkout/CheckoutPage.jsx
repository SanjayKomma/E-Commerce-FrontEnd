import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import orderService from "../../services/orderService";

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, subtotal, tax, shipping, finalTotal } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    ZipCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-populate default address from user profile
  useEffect(() => {
    if (!user) return;

    let defaultAddr = null;
    if (Array.isArray(user.address) && user.address.length > 0) {
      defaultAddr = user.address.find((addr) => addr.isDefault) || user.address[0];
    } else if (user.address && typeof user.address === "object") {
      defaultAddr = user.address;
    }

    if (defaultAddr) {
      setShippingAddress({
        street: defaultAddr.street || "",
        city: defaultAddr.city || "",
        ZipCode: defaultAddr.ZipCode || defaultAddr.zipCode || "",
        country: defaultAddr.country?.trim() || "India",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.ZipCode) {
      setError("Please fill out all shipping address fields.");
      return;
    }

    try {
      setLoading(true);

      const items = cart.map((item) => {
        const productObj = item.product || item;
        return {
          product: productObj._id || productObj.id || item.productId,
          name: productObj.name || item.name,
          image: productObj.image || item.image,
          price: Number(productObj.price ?? item.price ?? 0),
          quantity: Number(item.quantity) || 1,
        };
      });

      const orderData = {
        items,
        orderItems: items,
        shippingAddress: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          ZipCode: shippingAddress.ZipCode,
          country: shippingAddress.country,
        },
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: finalTotal,
        totalAmount: finalTotal,
      };

      const res = await orderService.createOrder(orderData);
      const createdOrder = res.order || res.data || res;

      navigate(`/orders/${createdOrder._id || createdOrder.id}`);
    } catch (err) {
      console.error("Order creation failed:", err);
      setError(
        err.response?.data?.message || "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Shipping & Payment */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              1. Shipping Address
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  placeholder="e.g. 123 Beach Road, Apt 4B"
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Visakhapatnam"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    PIN / Zip Code
                  </label>
                  <input
                    type="text"
                    name="ZipCode"
                    required
                    placeholder="e.g. 530001"
                    value={shippingAddress.ZipCode}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  required
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              2. Payment Method
            </h2>

            <div className="space-y-2">
              {["Cash on Delivery", "UPI / Net Banking", "Credit or Debit Card"].map((method) => (
                <label
                  key={method}
                  className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition ${
                    paymentMethod === method
                      ? "border-indigo-600 bg-indigo-50/40"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span className="text-xs font-semibold text-gray-800">{method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6 sticky top-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100">
              Order Summary ({cart.length} items)
            </h2>

            <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-gray-50 pr-1">
              {cart.map((item) => {
                const productObj = item.product || item;
                const itemId = productObj._id || productObj.id || item._id;
                const itemPrice = Number(productObj.price ?? item.price ?? 0);
                const itemQty = Number(item.quantity) || 1;

                return (
                  <div key={itemId} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={productObj.image || item.image || "https://placehold.co/100x100"}
                      alt={productObj.name || item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">
                        {productObj.name || item.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Qty: {itemQty} × ${itemPrice.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      ${(itemPrice * itemQty).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-gray-900">
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Amount</span>
                <span className="text-indigo-600">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 rounded-xl shadow transition cursor-pointer"
            >
              {loading ? "Placing Order..." : `Place Order • $${finalTotal.toFixed(2)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;