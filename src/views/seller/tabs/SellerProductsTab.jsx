import React, { useEffect, useState } from "react";
import productService from "../../../services/productService";
import ProductModal from "../../admin/dashboard/ProductModal";

const SellerProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await productService.getSellerProducts();
      setProducts(res.products || []);
    } catch (err) {
      console.error("Failed to load seller listings:", err);
      setError("Could not load your listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
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
    if (!window.confirm("Are you sure you want to remove this product listing?")) return;
    try {
      await productService.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your listings by name or category..."
          className="w-full sm:max-w-xs px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <span>＋</span> Add New Listing
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* Product List Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-16 bg-white border border-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">
            {products.length === 0
              ? "You haven't listed any products yet."
              : "No listings match your search filter."}
          </p>
          {products.length === 0 && (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
            >
              List Your First Item
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Unit Price</th>
                  <th className="px-6 py-4">Inventory</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
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
                    <td className="px-6 py-4 font-medium text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">${Number(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          product.stock > 5
                            ? "bg-emerald-50 text-emerald-700"
                            : product.stock > 0
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={selectedProduct}
        onSuccess={fetchMyProducts}
      />
    </div>
  );
};

export default SellerProductsTab;