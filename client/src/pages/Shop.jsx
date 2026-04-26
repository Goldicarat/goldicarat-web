import { useState } from 'react'
import { Filter, Grid, List, ChevronDown } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { products, categories, diamondShapes } from '../data/products'

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedShape, setSelectedShape] = useState('all')
  const [selectedMetal, setSelectedMetal] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const metals = ['All', 'Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum']
  
  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false
    if (selectedShape !== 'all' && product.shape.toLowerCase() !== selectedShape) return false
    if (selectedMetal !== 'all' && product.metal !== selectedMetal) return false
    return true
  })

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' },
    { value: 'rating', label: 'Best Rated' }
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-gold-600 to-gold-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Shop Our Collection</h1>
          <p className="text-gold-100 text-lg">Discover stunning lab-grown diamond jewelry</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:w-64 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button 
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedShape('all')
                    setSelectedMetal('all')
                  }}
                  className="text-sm text-gold-600 hover:text-gold-700"
                >
                  Clear All
                </button>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="category"
                      checked={selectedCategory === 'all'}
                      onChange={() => setSelectedCategory('all')}
                      className="accent-gold-500"
                    />
                    <span className="text-gray-600">All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.name} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="category"
                        checked={selectedCategory === cat.name.toLowerCase()}
                        onChange={() => setSelectedCategory(cat.name.toLowerCase())}
                        className="accent-gold-500"
                      />
                      <span className="text-gray-600">{cat.name}</span>
                      <span className="text-gray-400 text-sm">({cat.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-3">Diamond Shape</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="shape"
                      checked={selectedShape === 'all'}
                      onChange={() => setSelectedShape('all')}
                      className="accent-gold-500"
                    />
                    <span className="text-gray-600">All Shapes</span>
                  </label>
                  {diamondShapes.map((shape) => (
                    <label key={shape.name} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="shape"
                        checked={selectedShape === shape.name.toLowerCase()}
                        onChange={() => setSelectedShape(shape.name.toLowerCase())}
                        className="accent-gold-500"
                      />
                      <span className="text-gray-600">{shape.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-3">Metal</h4>
                <div className="space-y-2">
                  {metals.map((metal) => (
                    <label key={metal} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="metal"
                        checked={selectedMetal === (metal === 'All' ? 'all' : metal)}
                        onChange={() => setSelectedMetal(metal === 'All' ? 'all' : metal)}
                        className="accent-gold-500"
                      />
                      <span className="text-gray-600">{metal}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold-500"
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" /> Filters
                  </button>
                  <p className="text-gray-600">
                    Showing <span className="font-medium">{filteredProducts.length}</span> products
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm">Sort by:</span>
                    <div className="relative">
                      <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-gold-500 cursor-pointer"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-2 border-l pl-4">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gold-100 text-gold-600' : 'hover:bg-gray-100'}`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gold-100 text-gold-600' : 'hover:bg-gray-100'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl p-16 text-center">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedShape('all')
                    setSelectedMetal('all')
                  }}
                  className="mt-4 text-gold-600 hover:text-gold-700 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gold-50 hover:border-gold-500 transition-colors">1</button>
                <button className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gold-50 hover:border-gold-500 transition-colors">2</button>
                <button className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gold-50 hover:border-gold-500 transition-colors">3</button>
                <button className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gold-50 hover:border-gold-500 transition-colors">
                  <span className="sr-only">Next</span>&raquo;
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
