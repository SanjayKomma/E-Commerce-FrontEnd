import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  const price = Number(product.price) || 0;
  const rating = Number(product.rating) || 0;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        <Link to={`/products/${product._id || product.id}`}>
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

        {/* Out of Stock Pill */}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 bg-red-500/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
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
            <Link to={`/products/${product._id || product.id}`}>
              {product.name}
            </Link>
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
              ${price.toFixed(2)}
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