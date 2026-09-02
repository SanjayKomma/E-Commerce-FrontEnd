import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SellerProductsTab from "./tabs/SellerProductsTab";
import SellerOrdersTab from "./tabs/SellerOrdersTab";
import SellerAnalyticsTab from "./tabs/SellerAnalyticsTab";
import SellerStoreTab from "./tabs/SellerStoreTab";

const SellerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("products");

  const tabs = [
    { id: "products", label: "My Products", icon: "📦" },
    { id: "orders", label: "Orders & Shipping", icon: "🚚" },
    { id: "analytics", label: "Sales Reports", icon: "📊" },
    { id: "store", label: "Store Profile", icon: "🏪" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header Banner */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                Seller Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              Welcome back, {user?.name || "Merchant"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage your store inventory, track customer orders, and analyze your sales.
            </p>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/70"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="mt-4">
          {activeTab === "products" && <SellerProductsTab />}
          {activeTab === "orders" && <SellerOrdersTab />}
          {activeTab === "analytics" && <SellerAnalyticsTab />}
          {activeTab === "store" && <SellerStoreTab />}
        </div>

      </div>
    </div>
  );
};

export default SellerDashboard;