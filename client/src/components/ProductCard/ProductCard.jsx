import { useNavigate } from 'react-router'
import { getUserCart, updateUserCart } from '../../services/services';

const ProductCard = ({ product }) => {

    const navigate = useNavigate();

    const handleClick = async (selectedProduct) => {
        try {
            const userCart = (await getUserCart())?.userCart;
            const products = userCart.products || [];
            let exsists = false;

            for (let i = 0; i < products.length; i++) {
                if (products[i] && products[i]._id === selectedProduct._id) {
                    products[i].quantity = products.quantity + 1;
                    exsists = true;
                    break;
                }
            }

            console.log(exsists);

            if (!exsists) {
                selectedProduct.quantity = 1;
                products.push(selectedProduct)
            }

            await updateUserCart(products);

            navigate('/cart');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                />
                {product.onSale && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        SALE
                    </span>
                )}
                {!product.inStock && (
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-75 text-white font-bold px-3 py-2 rounded text-xs">
                        OUT OF STOCK
                    </span>
                )}
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {product.brand}
                    </span>
                </div>
                <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                    <span className="text-xs text-gray-600 ml-1">({product.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center">
                        <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                    </div>
                    <button
                        className={`px-3 py-1 rounded text-sm font-medium ${product.inStock
                            ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        disabled={!product.inStock}
                        onClick={() => handleClick(product)}
                    >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    )
};

export default ProductCard;