import React, { useEffect, useState } from "react";
import orderService from "../../../services/orderService";
import productService from "../../../services/productService";
import { useAuth } from "../../../context/AuthContext";

const SellerAnalyticsTab = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalUnitsSold: 0,
    totalOrdersCount: 0,
    activeListingsCount: 0,
    productBreakdown: [],
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const currentUserId = user?._id || user?.id;

        // 1. Fetch products & orders in parallel
        const [prodRes, ordRes] = await Promise.all([
          productService.getAllProducts(),
          orderService.getSellerOrders(),
        ]);

        const allProducts = prodRes.products || prodRes.data || (Array.isArray(prodRes) ? prodRes : []);
        const allOrders = ordRes.orders || ordRes.data || (Array.isArray(ordRes) ? ordRes : []);

        // 2. Identify all products belonging to this seller
        const myProducts = allProducts.filter((p) => {
          const creatorId = p.createdBy?._id || p.createdBy?.id || p.createdBy;
          return creatorId && currentUserId && creatorId.toString() === currentUserId.toString();
        });

        const myProductIds = new Set(myProducts.map((p) => (p._id || p.id).toString()));

        // 3. Compute sales metrics from relevant orders
        let totalRevenue = 0;
        let totalUnitsSold = 0;
        const matchingOrders = new Set();
        const salesMap = {};

        // Initialize map for all seller products
        myProducts.forEach((p) => {
          const id = (p._id || p.id).toString();
          salesMap[id] = {
            id,
            name: p.name,
            price: Number(p.price) || 0,
            stock: Number(p.stock) || 0,
            unitsSold: 0,
            revenue: 0,
          };
        });

        allOrders.forEach((order) => {
          (order.items || []).forEach((item) => {
            const prod = item.product || {};
            const pId = (prod._id || prod.id || prod).toString();

            if (myProductIds.has(pId)) {
              matchingOrders.add(order._id);
              const qty = Number(item.quantity) || 1;
              const price = Number(item.price) || Number(prod.price) || 0;
              const itemTotal = price * qty;

              totalRevenue += itemTotal;
              totalUnitsSold += qty;

              if (salesMap[pId]) {
                salesMap[pId].unitsSold += qty;
                salesMap[pId].revenue += itemTotal;
              }
            }
          });
        });

        setAnalytics({
          totalRevenue,
          totalUnitsSold,
          totalOrdersCount: matchingOrders.size,
          activeListingsCount: myProducts.length,
          productBreakdown: Object.values(salesMap).sort((a, b) => b.revenue - a.revenue),
        });
      } catch (err) {
        console.error("Failed to compute analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadAnalytics();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-24 bg-white border border-gray-100 rounded-3xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-white border border-gray-100 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
            Total Revenue
          </span>
          <p className="text-2xl font-black text-gray-900 mt-1">
            ${analytics.totalRevenue.toFixed(2)}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">
            ● Lifetime sales
          </span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
            Orders Received
          </span>
          <p className="text-2xl font-black text-indigo-600 mt-1">
            {analytics.totalOrdersCount}
          </p>
          <span className="text-[10px] text-gray-400 font-medium mt-1 inline-block">
            Customer checkouts
          </span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
            Units Sold
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {analytics.totalUnitsSold}
          </p>
          <span className="text-[10px] text-gray-400 font-medium mt-1 inline-block">
            Items fulfilled
          </span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
            Active Listings
          </span>
          <p className="text-2xl font-black text-gray-900 mt-1">
            {analytics.activeListingsCount}
          </p>
          <span className="text-[10px] text-indigo-600 font-medium mt-1 inline-block">
            Catalog inventory
          </span>
        </div>
      </div>

      {/* Itemized Sales Breakdown */}
      <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-gray-900">Performance By Product</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Breakdown of units sold, remaining stock, and gross revenue generated.
            </p>
          </div>
        </div>

        {analytics.productBreakdown.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">
            No products listed yet to display performance metrics.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">List Price</th>
                  <th className="px-6 py-4">Units Sold</th>
                  <th className="px-6 py-4">In Stock</th>
                  <th className="px-6 py-4 text-right">Gross Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {analytics.productBreakdown.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition">
                    <td className="px-6 py-4 font-bold text-gray-900 max-w-xs truncate">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-600">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-bold text-indigo-600">
                      {item.unitsSold}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.stock > 0
                            ? "bg-gray-100 text-gray-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {item.stock} left
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900 text-right">
                      ${item.revenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerAnalyticsTab;