import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import productService from "../../services/productService";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const wishlisted = isWishlisted(product?._id);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data.product || data.data || data);
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!user) {
    // Redirect to login and remember where they came from
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    addToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="h-96 bg-gray-100 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded-lg w-3/4" />
            <div className="h-6 bg-gray-100 rounded-lg w-1/4" />
            <div className="h-24 bg-gray-100 rounded-lg w-full" />
            <div className="h-12 bg-gray-100 rounded-xl w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-xs text-gray-500">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const stock = product.stock ?? product.countInStock ?? 0;
  const isOutOfStock = stock <= 0;

  // Accurately extract reviews list & length
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const reviewCount =
    product.numReviews ?? product.numOfReviews ?? reviews.length ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <span className="capitalize">{product.category || "General"}</span>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm">
        {/* Product Image */}
        <div className="flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden p-6">
          <img
            src={product.image || "https://placehold.co/600x600?text=Product+Image"}
            alt={product.name}
            className="w-full max-h-[420px] object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Details & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 rounded-full border border-indigo-100 uppercase tracking-wide">
                {product.category || "General"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < Math.floor(product.rating || 0) ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-700">
                {product.rating ? Number(product.rating).toFixed(1) : "0.0"}
              </span>
              <span className="text-xs text-gray-400">
                ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* Price */}
            <div className="pt-2">
              <span className="text-3xl font-extrabold text-indigo-600">
                ₹{Number(product.price || 0).toFixed(2)}
              </span>
            </div>

            {/* Description */}
            <div className="pt-2 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description || "No description provided for this item."}
              </p>
            </div>
          </div>

          {/* Quantity & Add to Cart Controls */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isOutOfStock ? "bg-red-500" : "bg-emerald-500"
                }`}
              />
              <span className="font-semibold text-gray-700">
                {isOutOfStock ? "Out of Stock" : `In Stock (${stock} available)`}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-gray-50">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                  className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold text-gray-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= stock || isOutOfStock}
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 rounded-xl shadow transition cursor-pointer"
              >
                Add {quantity > 1 ? `(${quantity})` : ""} to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product._id)}
                className={`p-3 rounded-2xl border transition flex items-center gap-2 text-xs font-bold ${
                  wishlisted
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${
                    wishlisted ? "fill-rose-500 text-rose-500" : "fill-none text-gray-500"
                  }`}
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>{wishlisted ? "Saved" : "Save to Wishlist"}</span>
              </button>
            </div>

            {addedMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-200 text-center">
                ✓ Added to your cart!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Customer Reviews ({reviewCount})
          </h2>
        </div>

        {reviews.length > 0 ? (
          <div className="divide-y divide-gray-100 space-y-4">
            {reviews.map((rev, index) => (
              <div key={rev._id || index} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">
                    {rev.name || rev.user?.name || "Verified Customer"}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {rev.createdAt
                      ? new Date(rev.createdAt).toLocaleDateString()
                      : "Recently"}
                  </span>
                </div>

                {/* Rating stars for this specific review */}
                <div className="flex text-amber-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(rev.rating || 0) ? "★" : "☆"}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {rev.comment || rev.review || "No comment provided."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">
            No written reviews submitted for this product yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;