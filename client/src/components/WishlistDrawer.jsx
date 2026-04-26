import { X, Heart, Trash2, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function WishlistDrawer() {
  const { 
    wishlistItems, 
    wishlistCount, 
    isWishlistOpen, 
    setIsWishlistOpen, 
    removeFromWishlist 
  } = useWishlist()
  const { addToCart } = useCart()
  const { requireAuth } = useAuth()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleAddToCart = (item) => {
    requireAuth(() => {
      addToCart(item)
      removeFromWishlist(item.id)
    })
  }

  return (
    <>
      {isWishlistOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsWishlistOpen(false)}
        />
      )}
      
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
        isWishlistOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              Wishlist ({wishlistCount})
            </h2>
            <button 
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                <Link 
                  to="/shop"
                  onClick={() => setIsWishlistOpen(false)}
                  className="btn-primary inline-block"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{item.metal}</p>
                      <p className="font-semibold text-gold-600">
                        {formatPrice(item.price)}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button 
                          onClick={() => handleAddToCart(item)}
                          className="flex-1 flex items-center justify-center gap-1 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors text-sm"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Add to Cart
                        </button>
                        <button 
                          onClick={() => removeFromWishlist(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {wishlistItems.length > 0 && (
            <div className="border-t p-6 bg-gray-50">
              <Link 
                to="/shop"
                onClick={() => setIsWishlistOpen(false)}
                className="w-full btn-primary text-center block"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
