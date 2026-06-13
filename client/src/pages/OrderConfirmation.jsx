import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, ShoppingBag, ArrowRight, Package, Mail, Phone, MapPin } from 'lucide-react'
import { getUserOrderById } from '../api/orderService'

export default function OrderConfirmation() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getUserOrderById(orderId)
        if (data?.success) {
          setOrder(data.order || data)
        }
      } catch (err) {
        console.error('Error loading order:', err)
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [orderId])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        {order ? (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-green-100">Thank you for your purchase</p>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Order Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Order ID</span>
                    <span className="font-medium text-gray-900">#{order.orderId?.slice(-8).toUpperCase() || order._id?.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium capitalize">{order.status || 'Confirmed'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Payment</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium capitalize">{order.paymentStatus || 'Paid'}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-3">
                    <span className="text-gray-500">Total Paid</span>
                    <span className="text-lg font-bold text-gray-900">{formatPrice(order.amount || 0)}</span>
                  </div>
                </div>
              </div>

              {order.address && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    Delivery Address
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-gray-900">{order.address.firstName} {order.address.lastName}</p>
                    <p>{order.address.street}</p>
                    <p>{order.address.city}, {order.address.state} - {order.address.zipcode}</p>
                    <p>{order.address.country}</p>
                    <div className="flex items-center gap-4 mt-2 pt-2 border-t">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {order.address.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {order.address.phone}</span>
                    </div>
                  </div>
                </div>
              )}

              {order.items && order.items.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    Items Ordered ({order.items.length})
                  </h2>
                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <img src={item.image || ''} alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{formatPrice(item.price)} x {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/shop" className="flex-1 btn-primary text-center flex items-center justify-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-500 mb-6">We couldn't find this order. It may have been placed while logged out.</p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              Continue Shopping <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
