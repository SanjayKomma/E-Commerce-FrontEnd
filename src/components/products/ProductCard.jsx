import { Link } from "react-router-dom";

const ProductCard = ({product, onAddToCart}) => {
    const price = Number(products.price) || 0;
    return (
        <div className="flex flex-col items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-center">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-lg"
                />
                {product.category && (
                    <span className="ml-2 text-sm font-medium text-gray-600">
                        {product.category}
                    </span>
                )}
            </div>
            <div className="flex flex-col justify-between">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                        <Link to={`/products/${product._id} || product.id}`} className="hover:underline">
                            {product.name}
                        </Link>
                    </h3>
                    <p className="text-sm text-gray-600">
                        {product.description}
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">Price</span>
                        <span className="text-sm font-medium text-gray-900">{price}</span>
                    </div>
                    <button
                        onCLick={() => onAddToCart && onAddToCart(product)}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ProductCard;