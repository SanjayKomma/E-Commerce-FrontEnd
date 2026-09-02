import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import productService from "../../../services/productService";
import ProductModal from "./ProductModal";
import ManageUsersTab from "./ManageUsersTab";

const ManageProductsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await productService.getAllProducts();
      const list = res.products || res.data || (Array.isArray(res) ? res : []);
      setProducts(list);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  const canModify = (product) => {
    if (user?.role === "admin") return true;
    if (user?.role === "seller") {
      const creatorId = product.createdBy?._id || product.createdBy;
      return creatorId?.toString() === user?._id?.toString();
    }
    return false;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === "admin" ? "Admin Management Dashboard" : "Seller Product Hub"}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Logged in as <span className="font-semibold text-indigo-600 capitalize">{user?.role}</span>
          </p>
        </div>

        {/* Action Button (Only on Products Tab) */}
        {activeTab === "products" && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow flex items-center gap-2 cursor-pointer"
          >
            <span>＋</span> Add New Product
          </button>
        )}
      </div>

      {/* Tabs Navigation (Admin only can view Users tab) */}
      {user?.role === "admin" && (
        <div className="flex items-center gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition ${
              activeTab === "products"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Products Catalog
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition ${
              activeTab === "users"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Registered Users
          </button>
        </div>
      )}

      {/* Conditional Tab Rendering */}
      {activeTab === "users" && user?.role === "admin" ? (
        <ManageUsersTab />
      ) : (
        <>
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs text-gray-500">
              No products found. Click "Add New Product" to start.
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((product) => {
                      const allowed = canModify(product);

                      return (
                        <tr key={product._id} className="hover:bg-gray-50/60 transition">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <img
                              src={product.image || "https://placehold.co/60x60"}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-contain bg-gray-50 border border-gray-100 p-1 flex-shrink-0"
                            />
                            <div className="max-w-xs truncate">
                              <p className="font-bold text-gray-900 truncate">{product.name}</p>
                              <p className="text-[11px] text-gray-400 truncate">{product.description}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 font-medium">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">
                            ${Number(product.price).toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                product.stock > 5
                                  ? "bg-emerald-50 text-emerald-700"
                                  : product.stock > 0
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {product.stock} in stock
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            {allowed ? (
                              <>
                                <button
                                  onClick={() => handleOpenEdit(product)}
                                  className="px-3 py-1.5 font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(product._id)}
                                  className="px-3 py-1.5 font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition cursor-pointer"
                                >
                                  Delete
                                </button>
                              </>
                            ) : (
                              <span className="text-[11px] text-gray-400 italic">Read Only</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal for Add / Edit */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={selectedProduct}
        onSuccess={fetchProducts}
      />
    </div>
  );
};

export default ManageProductsPage;