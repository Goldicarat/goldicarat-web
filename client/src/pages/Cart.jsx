import { useState, useEffect } from 'react'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Shield, Lock, Truck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { calculateShipping } from '../api/shippingService'

export default function Cart() {
  const navigate = useNavigate()
  const {
    cartItems,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart
  } = useCart()
  const [shippingData, setShippingData] = useState({ shipping: 0, freeShipping: true, method: "Free Shipping" })
  const [shippingLoading, setShippingLoading] = useState(false)

  useEffect(() => {
    if (cartItems.length === 0) {
      setShippingData({ shipping: 0, freeShipping: true, method: "Free Shipping" })
      return
    }
    setShippingLoading(true)
    calculateShipping(cartItems)
      .then(data => {
        if (data?.success) {
          setShippingData({ shipping: data.shipping || 0, freeShipping: data.freeShipping, method: data.method || "Standard Shipping" })
        }
      })
      .finally(() => setShippingLoading(false))
  }, [cartItems])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getProductImage = (item) => item.image || (item.images && item.images[0]) || ''
  const totalWithShipping = cartTotal + shippingData.shipping

  const handleCheckout = () => {
    navigate('/checkout')
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/shop" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500">{cartCount > 0 ? `${cartCount} item${cartCount > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Browse our collection to find the perfect piece.
            </p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.selectedMetal}-${item.selectedSize}`}
                  className="bg-white rounded-xl p-4 shadow-sm flex gap-4"
                >
                  <img
                    src={getProductImage(item)}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.selectedMetal}{item.selectedSize ? ` | Size: ${item.selectedSize}` : ''}
                        </p>
                      </div>
                      <p className="font-semibold text-gold-600 text-lg whitespace-nowrap">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedMetal, item.selectedSize)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedMetal, item.selectedSize)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-gray-500">
                          Subtotal: <span className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedMetal, item.selectedSize)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Items ({cartCount})</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4" />
                      Shipping
                    </span>
                    {shippingLoading ? (
                      <span className="text-gray-400">Calculating...</span>
                    ) : shippingData.freeShipping ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      <span className="text-gray-900">{formatPrice(shippingData.shipping)}</span>
                    )}
                  </div>
                  {!shippingLoading && !shippingData.freeShipping && shippingData.shipping > 0 && (
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{shippingData.method || "Standard Shipping"}</span>
                      <span></span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
                    <span>Total</span>
                    <span>{formatPrice(totalWithShipping)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 btn-primary py-3 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Lock className="w-5 h-5" />
                  Proceed to Checkout
                </button>
                <Link
                  to="/shop"
                  className="w-full mt-3 btn-secondary text-center block py-3"
                >
                  Continue Shopping
                </Link>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Secure Checkout</p>
                      <p className="text-xs text-gray-500">Your payment information is encrypted and secure.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
