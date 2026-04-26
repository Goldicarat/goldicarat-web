import { Link, useNavigate } from 'react-router-dom'
import { Star, Heart, Eye, Check } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { requireAuth } = useAuth()
  const inWishlist = isInWishlist(product.id)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    navigate(`/product/${product.id}`)
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    requireAuth(() => {
      addToCart(product)
    })
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    requireAuth(() => {
      toggleWishlist(product)
    })
  }

  return (
    <div className="group bg-white rounded-xl overflow-hidden card-hover border border-gray-100">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
        
        {product.badge && (
          <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full ${
            product.badge === 'BEST SELLER' ? 'bg-red-500 text-white' :
            product.badge === 'NEW' ? 'bg-green-500 text-white' :
            product.badge === 'TRENDING' ? 'bg-orange-500 text-white' :
            'bg-gold-500 text-white'
          }`}>
            {product.badge}
          </span>
        )}

        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-10 ${
            inWishlist 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <Link 
            to={`/product/${product.id}`}
            className="p-3 bg-white rounded-full hover:bg-gold-500 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100"
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>

        <button 
          onClick={handleQuickView}
          className="absolute bottom-3 left-3 right-3 py-2 bg-gold-500 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold-600"
        >
          View Details
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-2">({product.reviews})</span>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 min-h-[48px] hover:text-gold-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 mb-3">{product.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">{product.shape}</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">{product.metal}</span>
        </div>

        <button 
          onClick={handleAddToCart}
          className="w-full mt-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gold-500 transition-colors flex items-center justify-center gap-2"
        >
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  )
}
