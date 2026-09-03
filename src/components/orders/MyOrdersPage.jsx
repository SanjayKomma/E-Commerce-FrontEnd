import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import orderService from "../../services/orderService";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await orderService.getMyOrders();

        const rawData = res?.data ?? res;
        const potentialOrders = rawData?.orders ?? rawData?.myOrders ?? rawData;

        // Normalize single object or array into a uniform array
        if (Array.isArray(potentialOrders)) {
          setOrders(potentialOrders);
        } else if (potentialOrders && typeof potentialOrders === "object" && potentialOrders._id) {
          setOrders([potentialOrders]);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Failed to fetch order history:", err);
        setError(err.response?.data?.message || "Could not load your orders.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
        <div className="h-8 bg-gray-100 rounded-xl w-48 animate-pulse" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <span className="text-xs text-gray-500 font-medium">
          {orders.length} {orders.length === 1 ? "order" : "orders"} placed
        </span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4 shadow-sm">
          <div className="text-4xl">📦</div>
          <h2 className="text-base font-bold text-gray-900">No Orders Found</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You haven't placed any orders yet. Explore our products and start shopping!
          </p>
          <Link
            to="/"
            className="inline-block px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition cursor-pointer"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const items = order.items || order.orderItems || [];
            
            const itemsSubtotal = items.reduce((sum, item) => {
              const price = Number(item.price ?? item.product?.price ?? 0);
              const qty = Number(item.quantity) || 1;
              return sum + price * qty;
            }, 0);

            const tax = itemsSubtotal * 0.05;
            const shipping = itemsSubtotal > 100 || itemsSubtotal === 0 ? 0 : 10;
            const total = itemsSubtotal + tax + shipping;

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4 hover:border-gray-300 transition"
              >
                {/* Header Information */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-50 text-xs">
                  <div>
                    <span className="text-gray-400">Order ID: </span>
                    <span className="font-mono font-bold text-gray-800">{order._id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">
                      {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 uppercase tracking-wide">
                      {order.status || "Pending"}
                    </span>
                  </div>
                </div>

                {/* Items Preview & Price */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-x-auto py-1">
                    {items.map((item, idx) => {
                      const prod = item.product || {};
                      return (
                        <div key={item._id || idx} className="flex items-center gap-2 flex-shrink-0">
                          <img
                            src={prod.image || item.image || "https://placehold.co/80x80"}
                            alt={prod.name || item.name}
                            className="w-12 h-12 rounded-xl object-contain bg-gray-50 border border-gray-100 p-1"
                            title={prod.name || item.name}
                          />
                          <div className="text-xs max-w-[140px] truncate hidden sm:block">
                            <p className="font-semibold text-gray-800 truncate">{prod.name || item.name}</p>
                            <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-[11px] text-gray-400">Total Amount</p>
                    <p className="text-base font-extrabold text-indigo-600">
                      ₹{total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex justify-end">
                  <Link
                    to={`/orders/${order._id}`}
                    className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
                  >
                    View Order Details →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;