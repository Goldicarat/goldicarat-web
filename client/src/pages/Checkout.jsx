import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft, CreditCard, Lock, MapPin, Phone, Mail, User, Home, Truck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createRazorpayOrder, verifyRazorpayPayment } from '../api/orderService'
import { calculateShipping } from '../api/shippingService'

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

export default function Checkout() {
  const navigate = useNavigate()
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart()
  const { requireAuth, user, token } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
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
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'India'
  })
  const [errors, setErrors] = useState({})

  if (user?.email && !address.email) {
    setAddress(prev => ({ ...prev, email: user.email || '' }))
  }

  const getProductImage = (item) => item.image || (item.images && item.images[0]) || ''

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setAddress(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateAddress = () => {
    const newErrors = {}
    const required = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'zipcode']
    required.forEach(field => {
      if (!address[field]?.trim()) {
        newErrors[field] = `${field === 'zipcode' ? 'Pincode' : field.charAt(0).toUpperCase() + field.slice(1)} is required`
      }
    })
    if (address.email && !/\S+@\S+\.\S+/.test(address.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (address.phone && address.phone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return

    requireAuth(async () => {
      setIsProcessing(true)
      try {
        const scriptLoaded = await loadRazorpayScript()
        if (!scriptLoaded) {
          alert('Failed to load payment gateway. Please try again.')
          setIsProcessing(false)
          return
        }

        const items = cartItems.map(item => ({
          _id: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: getProductImage(item),
          images: item.images || [getProductImage(item)],
          selectedKarat: item.selectedKarat || ''
        }))

        const orderData = await createRazorpayOrder(items, address, shippingData.shipping)
        if (!orderData?.success) {
          alert(orderData?.message || 'Failed to create order')
          setIsProcessing(false)
          return
        }

        const options = {
          key: RAZORPAY_KEY_ID,
          amount: orderData.amount * 100,
          currency: orderData.currency || 'INR',
          name: 'Goldicarat Jewels',
          description: `Order #${orderData.orderId?.slice(-8).toUpperCase() || ''}`,
          order_id: orderData.razorpayOrderId,
          prefill: {
            name: `${address.firstName} ${address.lastName}`,
            email: address.email,
            contact: address.phone
          },
          theme: { color: '#B8860B' },
          handler: async function (response) {
            try {
              const verifyData = await verifyRazorpayPayment({
                orderId: orderData.orderId,
                orderAmount: orderData.amount,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })

              if (verifyData?.success) {
                clearCart()
                navigate(`/order-confirmation/${orderData.orderId}`)
              } else {
                alert(verifyData?.message || 'Payment verification failed')
              }
            } catch (err) {
              alert('Payment verification failed. Please contact support.')
            } finally {
              setIsProcessing(false)
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false)
            }
          }
        }

        const razorpay = new window.Razorpay(options)
        razorpay.on('payment.failed', function (response) {
          alert('Payment failed: ' + (response.error.description || 'Please try again'))
          setIsProcessing(false)
        })
        razorpay.open()
      } catch (err) {
        alert(err?.response?.data?.message || err.message || 'Failed to process order')
        setIsProcessing(false)
      }
    })
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-md text-center">
          <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">
            Add items to your cart before proceeding to checkout.
          </p>
          <Link
            to="/cart"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3"
          >
            <ShoppingBag className="w-5 h-5" />
            View Cart
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/shop" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-500">Complete your order</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold-500" />
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input type="text" name="firstName" value={address.firstName} onChange={handleAddressChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="John" />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input type="text" name="lastName" value={address.lastName} onChange={handleAddressChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Doe" />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" name="email" value={address.email} onChange={handleAddressChange}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="john@example.com" />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" name="phone" value={address.phone} onChange={handleAddressChange}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="+91 9876543210" />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" name="street" value={address.street} onChange={handleAddressChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="123 Main Street, Apt 4B" />
                </div>
                {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input type="text" name="city" value={address.city} onChange={handleAddressChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Mumbai" />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input type="text" name="state" value={address.state} onChange={handleAddressChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Maharashtra" />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input type="text" name="zipcode" value={address.zipcode} onChange={handleAddressChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 ${errors.zipcode ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="400001" />
                  {errors.zipcode && <p className="text-red-500 text-xs mt-1">{errors.zipcode}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input type="text" name="country" value={address.country} onChange={handleAddressChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  placeholder="India" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gold-500" />
                Payment Method
              </h2>
              <div className="p-4 bg-gold-50 rounded-lg border border-gold-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                    <CreditCard className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Razorpay</p>
                    <p className="text-sm text-gray-500">Pay via UPI, Cards, Net Banking, or Wallet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gold-500" />
                Order Summary ({cartCount})
              </h2>

              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={`${item._id || item.id}-${item.selectedMetal}-${item.selectedSize}`}
                    className="flex gap-3 p-2 bg-gray-50 rounded-lg">
                    <img src={getProductImage(item)} alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.selectedMetal} | {item.selectedSize}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-semibold text-gold-600">{formatPrice(item.price)}</span>
                        <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
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
                    <span>{shippingData.method}</span>
                    <span></span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>Calculated at next step</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal + shippingData.shipping)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full mt-6 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Place Order - {formatPrice(cartTotal)}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                Secure payment via Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
