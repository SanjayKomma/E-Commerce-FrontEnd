import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import orderService from "../../../services/orderService.js";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await orderService.getOrderById(id);
        setOrder(data.order || data.data || data);
      } catch (err) {
        console.error("Failed to load order:", err);
        setError(err.response?.data?.message || "Could not find this order.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <div className="h-28 bg-gray-100 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
        <div className="h-64 bg-gray-100 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Order Not Found</h2>
        <p className="text-xs text-gray-500">
          {error || "The requested order could not be located."}
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  const items = order.items || order.orderItems || [];
  const address = order.shippingAddress || {};

  // Compute Subtotal directly from items in DB
  const itemsSubtotal = items.reduce((sum, item) => {
    const price = Number(item.price ?? item.product?.price ?? 0);
    const qty = Number(item.quantity) || 1;
    return sum + price * qty;
  }, 0);

  const tax = itemsSubtotal * 0.05;
  const shipping = itemsSubtotal > 100 || itemsSubtotal === 0 ? 0 : 10;
  const finalOrderTotal = itemsSubtotal + tax + shipping;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success / Status Banner */}
      <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-center space-y-2">
        <span className="text-3xl">🎉</span>
        <h1 className="text-xl font-bold text-emerald-950">Order Placed Successfully!</h1>
        <p className="text-xs text-emerald-800">
          Order ID: <strong className="font-mono">{order._id || id}</strong>
        </p>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-2 shadow-sm">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Shipping Address
          </h3>
          <p className="text-xs text-gray-700 leading-relaxed font-medium">
            {address.street || address.address || "123 Street"}<br />
            {address.city ? `${address.city}, ` : ""}
            {address.ZipCode || address.postalCode || ""}<br />
            {address.country || "India"}
          </p>
          <div className="pt-2">
            <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 capitalize">
              {order.status || "pending"}
            </span>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-2 shadow-sm">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Payment Info
          </h3>
          <p className="text-xs text-gray-700">
            Method: <strong className="text-gray-900">{order.paymentMethod || "Cash on Delivery"}</strong>
          </p>
          <div className="pt-2">
            <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-800">
              Pending Payment
            </span>
          </div>
        </div>

        {/* Total Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-2 shadow-sm">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Total Amount
          </h3>
          <p className="text-2xl font-extrabold text-indigo-600">
            ${finalOrderTotal.toFixed(2)}
          </p>
          <p className="text-[11px] text-gray-400">
            Placed on: {new Date(order.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Ordered Items List */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100">
          Items in this Order ({items.length})
        </h2>

        <div className="divide-y divide-gray-100">
          {items.map((item, index) => {
            const productInfo = item.product || {};
            const name = productInfo.name || item.name || "Product Item";
            const image = productInfo.image || item.image || "https://placehold.co/100x100?text=Item";
            const price = Number(item.price ?? productInfo.price ?? 0);
            const quantity = Number(item.quantity) || 1;

            return (
              <div key={item._id || index} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={image}
                    alt={name}
                    className="w-14 h-14 rounded-xl object-contain bg-gray-50 border border-gray-100 p-1"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                      {name}
                    </h4>
                    <span className="text-[11px] text-gray-500">
                      Qty: {quantity} × ${price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold text-gray-900">
                  ${(price * quantity).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center pt-2">
        <Link
          to="/"
          className="inline-block px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailPage;