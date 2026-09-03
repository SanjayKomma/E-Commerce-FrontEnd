import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const WishListPage = () => {
  const { wishlist, loading, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product) => {
    await addToCart(product._id, 1);
    await toggleWishlist(product._id);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        <div className="h-8 w-48 bg-gray-100 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 bg-gray-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-xs text-gray-500 mt-1">
            {wishlist.length} item{wishlist.length === 1 ? "" : "s"} saved for later
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-xl font-bold">
            ♥
          </div>
          <p className="text-xs font-semibold text-gray-600">Your wishlist is empty</p>
          <Link
            to="/"
            className="inline-block px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-3xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition relative group"
            >
              {/* Remove Heart Button */}
              <button
                onClick={() => toggleWishlist(product._id)}
                className="absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-rose-500 shadow hover:bg-rose-50 transition"
                title="Remove from wishlist"
              >
                ♥
              </button>

              <div>
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.image || "https://placehold.co/200x200"}
                    alt={product.name}
                    className="w-full h-44 object-contain rounded-2xl bg-gray-50 p-2 group-hover:scale-105 transition duration-200"
                  />
                </Link>
                <div className="mt-3">
                  <span className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider">
                    {product.category}
                  </span>
                  <Link to={`/products/${product._id}`}>
                    <h3 className="text-xs font-bold text-gray-900 mt-1 truncate hover:text-indigo-600 transition">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm font-black text-gray-900 mt-2">
                    ₹{Number(product.price).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <button
                  disabled={product.stock <= 0}
                  onClick={() => handleMoveToCart(product)}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  {product.stock > 0 ? "Move to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishListPage;