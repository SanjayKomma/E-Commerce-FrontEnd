import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();

  // Profile Details State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: [],
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileStatus, setProfileStatus] = useState({ type: "", message: "" });

  // Change Password State
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({ type: "", message: "" });

  // Initialize form data when user state updates
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address?.length
          ? user.address
          : [{ street: "", city: "", ZipCode: "", country: "", isDefault: true }],
      });
    }
  }, [user]);

  // Input Handlers
  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChangeInput = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (index, field, value) => {
    const updated = [...formData.address];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, address: updated });
  };

  const setDefaultAddress = (index) => {
    const updated = formData.address.map((addr, i) => ({
      ...addr,
      isDefault: i === index,
    }));
    setFormData({ ...formData, address: updated });
  };

  const addAddressField = () => {
    setFormData({
      ...formData,
      address: [
        ...formData.address,
        { street: "", city: "", ZipCode: "", country: "", isDefault: false },
      ],
    });
  };

  const removeAddressField = (index) => {
    const filtered = formData.address.filter((_, i) => i !== index);
    if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
      filtered[0].isDefault = true;
    }
    setFormData({ ...formData, address: filtered });
  };

  // Submit Profile Information
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileStatus({ type: "", message: "" });

    try {
      await updateProfile(formData);
      setProfileStatus({ type: "success", message: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setProfileStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Submit Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus({ type: "", message: "" });

    if (passwordData.newPassword.length < 6) {
      setPasswordStatus({
        type: "error",
        message: "New password must be at least 6 characters long.",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({
        type: "error",
        message: "New password and confirmation do not match.",
      });
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordStatus({
        type: "success",
        message: res.message || "Password updated successfully!",
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
      setPasswordStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to update password.",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      {/* 1. Profile Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="h-20 w-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
              {getInitials(user?.name || "U")}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{user?.name || "User"}</h1>
                <span className="capitalize px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {user?.role || "buyer"}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
              <p className="text-xs text-gray-400 mt-2">
                Member since: <span className="text-gray-600 font-medium">{formatDate(user?.createdAt)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm cursor-pointer"
              >
                Edit Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user?.name || "",
                    email: user?.email || "",
                    phone: user?.phone || "",
                    address: user?.address || [],
                  });
                }}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition border border-red-200 cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Profile Status Notification */}
      {profileStatus.message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium ${
            profileStatus.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {profileStatus.message}
        </div>
      )}

      {/* 2. Personal Information & Address Form */}
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleProfileChange}
                  required
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              ) : (
                <p className="text-sm font-medium text-gray-900 bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-100">
                  {user?.name || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleProfileChange}
                  required
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              ) : (
                <p className="text-sm font-medium text-gray-900 bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-100">
                  {user?.email || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              ) : (
                <p className="text-sm font-medium text-gray-900 bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-100">
                  {user?.phone || "No phone number added"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Account Role
              </label>
              <p className="text-sm font-medium capitalize text-gray-700 bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-100">
                {user?.role || "buyer"}
              </p>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Saved Addresses</h2>
              <p className="text-xs text-gray-500">Manage your shipping and delivery addresses</p>
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={addAddressField}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition cursor-pointer"
              >
                + Add Address
              </button>
            )}
          </div>

          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.address?.length > 0 ? (
                user.address.map((addr, idx) => (
                  <div
                    key={addr._id || idx}
                    className={`p-4 rounded-xl border ${
                      addr.isDefault ? "border-indigo-300 bg-indigo-50/30" : "border-gray-200 bg-white"
                    } relative space-y-1`}
                  >
                    {addr.isDefault && (
                      <span className="inline-block text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full mb-1">
                        Default Address
                      </span>
                    )}
                    <p className="text-sm font-semibold text-gray-900">{addr.street || "No street specified"}</p>
                    <p className="text-xs text-gray-600">
                      {addr.city ? `${addr.city}, ` : ""}
                      {addr.ZipCode || ""}
                    </p>
                    <p className="text-xs text-gray-600">{addr.country || ""}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-6 border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">
                  No addresses saved yet. Click "Edit Profile" to add one.
                </div>
              )}
            </div>
          )}

          {isEditing && (
            <div className="space-y-4">
              {formData.address.map((addr, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 relative space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700">Address #{idx + 1}</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                        <input
                          type="radio"
                          name="isDefaultRadio"
                          checked={addr.isDefault}
                          onChange={() => setDefaultAddress(idx)}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        Set as Default
                      </label>
                      {formData.address.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAddressField(idx)}
                          className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={addr.street || ""}
                      onChange={(e) => handleAddressChange(idx, "street", e.target.value)}
                      className="px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={addr.city || ""}
                      onChange={(e) => handleAddressChange(idx, "city", e.target.value)}
                      className="px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Zip Code"
                      value={addr.ZipCode || ""}
                      onChange={(e) => handleAddressChange(idx, "ZipCode", e.target.value)}
                      className="px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={addr.country || ""}
                      onChange={(e) => handleAddressChange(idx, "country", e.target.value)}
                      className="px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={profileLoading}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow transition disabled:opacity-50 cursor-pointer"
            >
              {profileLoading ? "Saving Changes..." : "Save All Changes"}
            </button>
          </div>
        )}
      </form>

      {/* 3. Security & Change Password Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Security & Password</h2>
            <p className="text-xs text-gray-500">Ensure your account uses a secure password</p>
          </div>
          {!showPasswordForm ? (
            <button
              type="button"
              onClick={() => setShowPasswordForm(true)}
              className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition cursor-pointer"
            >
              Change Password
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setShowPasswordForm(false);
                setPasswordStatus({ type: "", message: "" });
              }}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            >
              Close
            </button>
          )}
        </div>

        {passwordStatus.message && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs font-medium ${
              passwordStatus.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {passwordStatus.message}
          </div>
        )}

        {showPasswordForm && (
          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={handlePasswordChangeInput}
                required
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder="••••••••"
                value={passwordData.newPassword}
                onChange={handlePasswordChangeInput}
                required
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChangeInput}
                required
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={passwordLoading}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow transition disabled:opacity-50 cursor-pointer"
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;