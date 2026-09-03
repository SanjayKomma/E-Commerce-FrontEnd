import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import authService from "../../../services/authService";

const SellerStoreTab = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    storeName: "",
    tagline: "",
    bio: "",
    shippingPolicy: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        storeName: user.storeName || `${user.name}'s Shop`,
        tagline: user.tagline || "Verified Independent Merchant",
        bio: user.bio || "",
        shippingPolicy: user.shippingPolicy || "Orders ship within 1-2 business days.",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await authService.updateProfile(formData);
      
      // Check where your API returns the updated user document:
      const updatedUser = res.user || res.data?.user || res;
      console.log("Extracted updatedUser:", updatedUser);
      if (updatedUser) {
        // 1. Update React Auth Context state
        if (typeof setUser === "function") {
          setUser((prev)=>({...prev,...updatedUser}));
        }
        const existingUser = JSON.parse(localStorage.getItem("user")||"{}");
        // 2. Persist to localStorage so page refreshes retain it
        localStorage.setItem("user", JSON.stringify({...existingUser,...updatedUser}));
      }

      setMessage({ text: "Store settings updated successfully!", type: "success" });
    } catch (err) {
      console.error("Profile update error:", err);
      setMessage({
        text: err.response?.data?.message || "Failed to update profile.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="border-b border-gray-100 pb-5 mb-6">
          <h3 className="text-base font-black text-gray-900">Storefront & Merchant Settings</h3>
          <p className="text-xs text-gray-400 mt-1">
            Customize your store identity, public branding, and customer fulfillment policies.
          </p>
        </div>

        {message.text && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-semibold mb-6 ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Public Store Name
              </label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                placeholder="e.g. Acme Tech Gear"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Tagline / Slogan
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="e.g. Handcrafted wooden desks and accessories"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Merchant Contact Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Support Email
              </label>
              <input
                type="email"
                name="email"
                disabled
                value={formData.email}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Store Bio / About Us
            </label>
            <textarea
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell your customers about your products, quality assurance, or craftsmanship..."
              className="w-full text-xs p-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Standard Shipping Policy
            </label>
            <textarea
              name="shippingPolicy"
              rows="2"
              value={formData.shippingPolicy}
              onChange={handleChange}
              placeholder="e.g. Standard dispatch takes 24 hours. Free domestic returns within 14 days."
              className="w-full text-xs p-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving Changes..." : "Save Store Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerStoreTab;