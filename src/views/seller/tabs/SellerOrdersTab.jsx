import React, { useEffect, useState } from "react";
import orderService from "../../../services/orderService";

const SellerOrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await orderService.getSellerOrders();
      setOrders(res.orders || []);
    } catch (err) {
      console.error("Failed to load seller orders:", err);
      setError("Unable to load orders at this time.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, productId, newStatus) => {
    try {
      setUpdatingId(`${orderId}-${productId}`);
      await orderService.updateShipmentStatus(orderId, productId, { itemStatus: newStatus });
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update shipment status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTrackingSave = async (orderId, productId, currentTracking) => {
    const trackingNumber = window.prompt("Enter tracking number / courier details:", currentTracking || "");
    if (trackingNumber === null) return;

    try {
      setUpdatingId(`${orderId}-${productId}`);
      await orderService.updateShipmentStatus(orderId, productId, { trackingNumber });
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save tracking number");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-28 bg-white border border-gray-100 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 text-xs font-semibold rounded-2xl border border-red-200">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-2 shadow-sm">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
          🚚
        </div>
        <h3 className="text-sm font-bold text-gray-900">No Orders Yet</h3>
        <p className="text-xs text-gray-400">
          When customers purchase your listed items, their orders and shipping details will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-sm space-y-4"
        >
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-gray-900">
                  #{order._id.slice(-8).toUpperCase()}
                </span>
                <span className="text-[11px] text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Buyer: <span className="font-semibold text-gray-800">{order.user?.name || "Customer"}</span> ({order.user?.email})
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Your Subtotal</span>
              <span className="text-sm font-black text-gray-900">
                ₹{(order.sellerTotal || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Shipping Address Preview */}
          <div className="bg-gray-50/70 rounded-2xl p-3 text-xs text-gray-600">
            <span className="font-bold text-gray-700">Delivery Address: </span>
            {order.shippingAddress?.address ? (
              <span>
                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </span>
            ) : (
              <span className="text-gray-400 italic">No address provided</span>
            )}
          </div>

          {/* Items Purchased List */}
          <div className="divide-y divide-gray-50">
            {order.items.map((item) => {
              const rowKey = `${order._id}-${item.product?._id}`;
              const isUpdating = updatingId === rowKey;

              return (
                <div key={rowKey} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product?.image || "https://placehold.co/60x60"}
                      alt={item.product?.name}
                      className="w-12 h-12 rounded-xl object-contain bg-gray-50 p-1 border border-gray-100 flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{item.product?.name}</h4>
                      <p className="text-[11px] text-gray-400">
                        Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                      </p>
                      {item.trackingNumber && (
                        <p className="text-[10px] font-mono text-indigo-600 font-semibold mt-0.5">
                          Tracking: {item.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Status Controls */}
                  <div className="flex items-center gap-2">
                    {item.itemStatus === "Delivered" ? (
                      <span className="px-2.5 py-1.5 text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-xl">
                        {item.trackingNumber ? `Tracking: ${item.trackingNumber}` : "No tracking"}
                      </span>
                      ) : (
                        <button
                          onClick={() => handleTrackingSave(order._id, item.product?._id, item.trackingNumber)}
                          className="px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer"
                        >
                          {item.trackingNumber ? "Edit Tracking" : "+ Add Tracking"}
                        </button>
                      )}
                    <select
                      value={item.itemStatus || "Processing"}
                      disabled={item.itemStatus === "Delivered" || isUpdating}
                      onChange={(e) => handleStatusChange(order._id, item.product?._id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${
                        item.itemStatus === "Delivered"
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "bg-white text-gray-800 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      }`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SellerOrdersTab;