import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star, Heart, Share2, Truck, Shield, RotateCcw, Check, CheckCircle, ShoppingBag } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'

export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find(p => p.id === parseInt(id)) || products[0]
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedMetal, setSelectedMetal] = useState(product.metal)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { requireAuth, isLoggedIn } = useAuth()
  const inWishlist = isInWishlist(product.id)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleAddToCart = () => {
    requireAuth(() => {
      addToCart(product, quantity, selectedMetal, selectedSize)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    })
  }

  const handleWishlist = () => {
    requireAuth(() => {
      toggleWishlist(product)
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL']
  const metals = ['Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum']
  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4)

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            <div>
              <div className="relative mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded-xl"
                />
                {product.badge && (
                  <span className={`absolute top-4 left-4 px-4 py-2 text-sm font-semibold rounded-full ${
                    product.badge === 'BEST SELLER' ? 'bg-red-500 text-white' :
                    product.badge === 'NEW' ? 'bg-green-500 text-white' :
                    'bg-gold-500 text-white'
                  }`}>
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i - 1)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === i - 1 ? 'border-gold-500' : 'border-gray-200 hover:border-gold-300'
                    }`}
                  >
                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
              </div>

              <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 mb-4">{product.description}</p>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Metal Type</label>
                <div className="flex flex-wrap gap-2">
                  {metals.map((metal) => (
                    <button
                      key={metal}
                      onClick={() => setSelectedMetal(metal)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        selectedMetal === metal 
                          ? 'border-gold-500 bg-gold-50 text-gold-700' 
                          : 'border-gray-200 hover:border-gold-300'
                      }`}
                    >
                      {metal}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Ring Size</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg border-2 font-medium transition-colors ${
                        selectedSize === size 
                          ? 'border-gold-500 bg-gold-500 text-white' 
                          : 'border-gray-200 hover:border-gold-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <a href="#" className="text-sm text-gold-600 hover:text-gold-700 mt-2 inline-block">
                  Ring Size Guide
                </a>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                <button 
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    addedToCart 
                      ? 'bg-green-500 text-white' 
                      : 'btn-primary'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button 
                  onClick={handleWishlist}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    inWishlist 
                      ? 'border-red-500 bg-red-50 text-red-500' 
                      : 'border-gray-200 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-gold-500 hover:text-gold-500 transition-colors"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3 border-t pt-6">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="w-5 h-5 text-green-500" />
                  <span>Free UK Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="w-5 h-5 text-blue-500" />
                  <span>15 Days Exchange Policy</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-5 h-5 text-gold-500" />
                  <span>Certified & Insured Shipping</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-purple-500" />
                  <span>Free Ring Engraving</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gold-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Buy Now, Pay Later:</span> 0% APR available. 
                  Spread the cost over 3-12 months.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="section-title mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
