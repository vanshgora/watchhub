import { useState } from 'react';
import EmptyCart from './EmptyCart';
import { getUserCart, updateUserCart } from '../../services/services';
import { useEffect } from 'react';
import { useNavigate } from 'react-router'

const CartPage = () => {
  const [userCart, setUserCart] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    async function initCartPage() {
      const res = await getUserCart();
      setUserCart(res.userCart);
      console.log(res.userCart);
      res.userCart.products && setCartItems(res.userCart.products);
    }

    initCartPage();
  }, []);

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 200 : 0;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax - discount;

  const updateQuantity = async (selectedProduct, newQuantity) => {
    if (newQuantity < 1) return;
    const userCart = (await getUserCart())?.userCart;
    const products = userCart.products;

    for (let i = 0; i < products.length; i++) {
      if (products[i] && products[i]._id === selectedProduct._id) {
        products[i].quantity = newQuantity;
        break;
      }
    }

    const updatedCart = await updateUserCart(products);

    setCartItems(products);
  };

  const removeItem = async (id) => {
    console.log(id, cartItems)
    const products = cartItems.filter(item => item._id !== id);
    await updateUserCart(products);
    setCartItems(products);
  };

  const handleClearCart = async () => {
    await updateUserCart([]);
    setCartItems([]);
  }

  const continueShopping = () => {
    navigate('/');
  };

  const proceedToCheckout = () => {
    console.log('Proceed to checkout');
  };

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="hidden md:grid grid-cols-12 bg-gray-100 px-6 py-3 text-sm font-medium text-gray-700">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map(item => (
                  <div key={item._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4">
                    <div className="md:col-span-5 flex items-center">
                      <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
                        {!item.inStock && (
                          <p className="mt-1 text-sm text-red-600">Out of Stock</p>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2 flex md:block items-center justify-between md:justify-center">
                      <span className="md:hidden text-sm font-medium text-gray-900">Price:</span>
                      <p className="text-sm font-medium text-gray-900 text-center">₹{item.price.toLocaleString()}</p>
                    </div>

                    <div className="md:col-span-3 flex md:block items-center justify-between md:justify-center">
                      <span className="md:hidden text-sm font-medium text-gray-900">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() => updateQuantity(item, item.quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:text-gray-800"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:text-gray-800"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex md:block items-center justify-between md:justify-end">
                      <div className="flex md:justify-end">
                        <span className="md:hidden text-sm font-medium text-gray-900">Total:</span>
                        <p className="text-sm font-medium text-gray-900 ml-2 md:ml-0">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="ml-4 text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-center">
                <button
                  onClick={continueShopping}
                  className="flex items-center text-blue-600 hover:text-blue-800 mb-4 sm:mb-0"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Continue Shopping
                </button>

                {/* <button
                  onClick={() => handleClearCart}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear Cart
                </button> */}
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">₹{shipping.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-medium">₹{tax.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <button
                  onClick={proceedToCheckout}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-6"
                >
                  Proceed to Checkout
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;