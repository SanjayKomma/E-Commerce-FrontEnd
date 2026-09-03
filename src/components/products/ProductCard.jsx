import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";

const ProductCard = ({ product, onAddToCart }) => {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const productId = product._id || product.id;

  // 1. Determine if this product is in the wishlist
  const wishlisted = isWishlisted(productId);

  // 2. Click handler to prevent card link navigation and toggle state
  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
  };

  const price = Number(product.price) || 0;
  const rating = Number(product.rating) || 0;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        {/* Heart Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label="Toggle Wishlist"
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-gray-100 flex items-center justify-center shadow hover:scale-110 active:scale-95 transition cursor-pointer"
        >
          <svg
            className={`w-4 h-4 transition ${
              wishlisted
                ? "fill-rose-500 text-rose-500"
                : "fill-none text-gray-400 hover:text-rose-500"
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
        </button>

        <Link to={`/products/${productId}`}>
          <img
            src={product.image || "https://placehold.co/600x600?text=Product"}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Category Chip */}
        {product.category && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[11px] font-semibold tracking-wide text-gray-700 px-3 py-1 rounded-full shadow-sm">
            {product.category}
          </span>
        )}

        {/* Out of Stock Pill (Positioned bottom-left so it doesn't overlap the heart button) */}
        {product.stock === 0 && (
          <span className="absolute bottom-3 left-3 bg-red-500/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
            Out of Stock
          </span>
        )}
      </div>

      {/* 2. Card Content */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div className="space-y-2">
          {/* Star Rating & Review Count */}
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < rating ? "fill-current" : "text-gray-200 fill-current"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-400 font-medium ml-1">
              ({product.numberOfReviews || 0})
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition">
            <Link to={`/products/${productId}`}>{product.name}</Link>
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* 3. Price & Add to Cart Footer */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium block">
              Price
            </span>
            <span className="text-lg font-bold text-gray-900">
              ₹{price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onAddToCart && onAddToCart(product)}
            disabled={product.stock === 0}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition shadow-sm active:scale-95 cursor-pointer ${
              product.stock === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;