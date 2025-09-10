import { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getAllProducts } from '../../services/services';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    priceRange: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function initProductList() {
      const res = await getAllProducts();
      const products = res.products;
      setProducts(products);
      setFilteredProducts(products);
      setLoading(false);
    }

    initProductList();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }

    if (filters.brand) {
      result = result.filter(product => product.brand === filters.brand);
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (max === 0) {
        result = result.filter(product => product.price >= min);
      } else {
        result = result.filter(product => product.price >= min && product.price <= max);
      }
    }

    setFilteredProducts(result);
  }, [filters, products]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: '',
      brand: '',
      priceRange: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="container mx-auto px-3">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">WatchHub Collection</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className={`bg-white rounded-lg shadow p-4 ${showFilters ? 'block' : 'hidden'} md:block md:w-56`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Filters</h2>
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear All
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Category</h3>
              <div className="space-y-1">
                {['Chronograph', 'Diver', 'Dress', 'Pilot', 'Sports', 'Luxury', 'Vintage', 'Smartwatch'].map(category => (
                  <label key={category} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === category}
                      onChange={() => handleFilterChange('category', category)}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Brand</h3>
              <div className="space-y-1">
                {['Rolex', 'Seiko', 'Daniel Wellington', 'Tissot', 'Casio', 'Omega', 'Hamilton', 'Apple'].map(brand => (
                  <label key={brand} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="brand"
                      checked={filters.brand === brand}
                      onChange={() => handleFilterChange('brand', brand)}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Price Range</h3>
              <div className="space-y-1">
                {[
                  { label: 'Under ₹5,000', value: '0-5000' },
                  { label: '₹5,000 - ₹10,000', value: '5000-10000' },
                  { label: '₹10,000 - ₹20,000', value: '10000-20000' },
                  { label: '₹20,000 - ₹30,000', value: '20000-30000' },
                  { label: 'Over ₹30,000', value: '30000-0' }
                ].map(range => (
                  <label key={range.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={filters.priceRange === range.value}
                      onChange={() => handleFilterChange('priceRange', range.value)}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-3 mb-4">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <p className="text-gray-600 mb-2 sm:mb-0">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-2 text-sm text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;