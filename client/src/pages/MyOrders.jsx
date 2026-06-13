import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, ChevronRight, X, Eye, RotateCcw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserOrders, cancelOrder } from '../api/orderService'
import toast from 'react-hot-toast'

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
}

export default function MyOrders() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/')
      return
    }
    loadOrders()
  }, [isLoggedIn])

  const loadOrders = async () => {
    try {
      const data = await getUserOrders()
      if (data?.success) {
        setOrders(data.orders || data.data || [])
      }
    } catch (err) {
      console.error('Load orders error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    setCancelling(orderId)
    try {
      const data = await cancelOrder(orderId)
      if (data?.success) {
        toast.success('Order cancelled successfully')
        loadOrders()
        if (selectedOrder?._id === orderId) {
          setSelectedOrder((prev) => prev ? { ...prev, status: 'cancelled' } : null)
        }
      } else {
        toast.error(data?.message || 'Failed to cancel order')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel order')
    } finally {
      setCancelling(null)
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  }

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0)
  }

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'card': return 'Card'
      case 'netbanking': return 'Net Banking'
      case 'upi': return 'UPI'
      case 'wallet': return 'Wallet'
      case 'emandate': return 'EMI'
      default: return method || 'N/A'
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">View and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <button onClick={() => navigate('/shop')} className="btn-primary">
              Browse Collections
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.date || order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600">
                          {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                          {order.items && (
                            <span className="text-gray-400 ml-2">
                              ({order.items.map((item) => item.product?.name || item.name || 'Item').join(', ')})
                            </span>
                          )}
                        </p>
                        <p className="text-lg font-bold text-gray-900 mt-2">
                          {formatINR(order.amount)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-700 border border-gold-300 px-4 py-2 rounded-lg hover:bg-gold-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={cancelling === order._id}
                            className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <RotateCcw className="w-4 h-4" />
                            {cancelling === order._id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {order.shipping?.awb && (
                    <div className="mt-3 pt-3 border-t text-sm text-gray-500">
                      Tracking: <span className="font-medium text-gray-700">{order.shipping.awb}</span>
                      {order.shipping.courier && <span className="ml-2 text-gray-400">({order.shipping.courier})</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedOrder(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="font-semibold text-gray-900">Order #{selectedOrder._id.slice(-8).toUpperCase()}</h3>
                <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Status</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[selectedOrder.status] || 'bg-gray-100 text-gray-700'}`}>
                      {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500">Order Date</p>
                    <p className="font-medium mt-1">{formatDate(selectedOrder.date || selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Items</p>
                    <p className="font-medium mt-1">{selectedOrder.items?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total</p>
                    <p className="font-bold text-gold-600 mt-1">{formatINR(selectedOrder.amount)}</p>
                  </div>
                </div>

                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                          <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                            {item.product?.images?.[0] || item.image ? (
                              <img src={item.product?.images?.[0] || item.image} alt={item.name || item.product?.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm">{item.name || item.product?.name}</p>
                            {item.variant && <p className="text-xs text-gray-500">{item.variant}</p>}
                            <p className="text-sm text-gray-700 mt-1">
                              Qty: {item.quantity || 1} × {formatINR(item.price || 0)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOrder.address && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                    <div className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
                      <p className="font-medium text-gray-900">{selectedOrder.address.firstName} {selectedOrder.address.lastName}</p>
                      <p>{selectedOrder.address.street}</p>
                      <p>{selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zipcode}</p>
                      {selectedOrder.address.phone && <p className="mt-1">Phone: {selectedOrder.address.phone}</p>}
                      {selectedOrder.address.email && <p>Email: {selectedOrder.address.email}</p>}
                    </div>
                  </div>
                )}

                {(selectedOrder.paymentInfo?.method || selectedOrder.paymentMethod) && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Payment Details</h4>
                    <div className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 space-y-1">
                      <p><span className="text-gray-500">Method:</span> {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : selectedOrder.paymentMethod === 'online' ? 'Online Payment' : selectedOrder.paymentMethod || 'N/A'}</p>
                      {selectedOrder.paymentInfo?.method && (
                        <p><span className="text-gray-500">Payment Type:</span> {getPaymentMethodLabel(selectedOrder.paymentInfo.method)}</p>
                      )}
                      {selectedOrder.paymentInfo?.bank && (
                        <p><span className="text-gray-500">Bank:</span> {selectedOrder.paymentInfo.bank}</p>
                      )}
                      {selectedOrder.paymentInfo?.cardNetwork && selectedOrder.paymentInfo?.cardLast4 && (
                        <p><span className="text-gray-500">Card:</span> {selectedOrder.paymentInfo.cardNetwork} ••••{selectedOrder.paymentInfo.cardLast4}</p>
                      )}
                      {selectedOrder.paymentInfo?.vpa && (
                        <p><span className="text-gray-500">UPI ID:</span> {selectedOrder.paymentInfo.vpa}</p>
                      )}
                      {selectedOrder.paymentInfo?.wallet && (
                        <p><span className="text-gray-500">Wallet:</span> {selectedOrder.paymentInfo.wallet}</p>
                      )}
                      <p><span className="text-gray-500">Status:</span>
                        <span className={`ml-1 font-medium ${selectedOrder.paymentStatus === 'paid' ? 'text-green-600' : selectedOrder.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}>
                          {selectedOrder.paymentStatus?.charAt(0).toUpperCase() + selectedOrder.paymentStatus?.slice(1)}
                        </span>
                      </p>
                      {selectedOrder.razorpayPaymentId && (
                        <p className="text-xs text-gray-400 mt-1">Payment ID: {selectedOrder.razorpayPaymentId}</p>
                      )}
                      {selectedOrder.shippingCost > 0 && (
                        <p><span className="text-gray-500">Shipping:</span> {formatINR(selectedOrder.shippingCost)}</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedOrder.shipping?.awb && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Tracking</h4>
                    <div className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 space-y-1">
                      {selectedOrder.shipping.courier && <p><span className="text-gray-500">Courier:</span> {selectedOrder.shipping.courier}</p>}
                      <p><span className="text-gray-500">AWB Number:</span> <span className="font-mono font-medium">{selectedOrder.shipping.awb}</span></p>
                      {selectedOrder.shipping.status && <p><span className="text-gray-500">Status:</span> {selectedOrder.shipping.status}</p>}
                      <a
                        href={`https://www.shiprocket.in/tracking/?awb=${selectedOrder.shipping.awb}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-gold-600 hover:text-gold-700 font-medium"
                      >
                        Track Package <ChevronRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}

                {selectedOrder.status === 'pending' && (
                  <button
                    onClick={() => { handleCancelOrder(selectedOrder._id); setSelectedOrder(null) }}
                    disabled={cancelling === selectedOrder._id}
                    className="w-full py-3 border-2 border-red-300 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {cancelling === selectedOrder._id ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
