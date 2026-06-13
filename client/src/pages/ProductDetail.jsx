import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Star, Heart, Share2, Truck, Shield, RotateCcw, Check, CheckCircle, ShoppingBag } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { fetchProductById, fetchProducts, toggleProductLike } from '../api/productService'
import { getPages } from '../api/pageService'
import StaticFAQ from '../components/StaticFAQ'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedMetal, setSelectedMetal] = useState('')
  const [selectedKarat, setSelectedKarat] = useState('14')
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [likeLoading, setLikeLoading] = useState(false)
  const [relatedFaqs, setRelatedFaqs] = useState([])

  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { requireAuth, isLoggedIn } = useAuth()

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const data = await fetchProductById(id)
        if (data?.success) {
          setProduct(data.product)
          setSelectedMetal(data.product.metal || '')
          setSelectedKarat(data.product.goldKarat || '14')
          setIsLiked(data.product.isLiked || false)
          setLikeCount(data.product.likeCount || 0)
        }
      } catch (err) {
        console.error('Error loading product:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id])

  useEffect(() => {
    if (!product?.category) return
    getPages().then((data) => {
      if (data?.success) {
        const allPages = data.pages || []
        const faqPages = allPages.filter((p) => p.type === 'faq' && p.isActive)
        const faqs = faqPages.flatMap((page) =>
          (page.faqs || []).map((faq) => ({
            ...faq,
            category: page.title,
            _key: `${page._id}_${faq._id || faq.order || Math.random()}`,
          }))
        )
        setRelatedFaqs(faqs.slice(0, 5))
      }
    }).catch(() => {})
  }, [product?.category])

  useEffect(() => {
    if (!product) return
    fetchProducts({ category: product.category, _perPage: 5 }).then((data) => {
      if (data?.success) {
        setRelatedProducts(
          (data.products || []).filter((p) => p._id !== product._id).slice(0, 4)
        )
      }
    }).catch(() => {/* ignore */})
  }, [product])

  const inWishlist = product ? isInWishlist(product._id) : false

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleAddToCart = () => {
    if (!product) return
    requireAuth(() => {
      addToCart({...product, price: productPrice}, quantity, selectedMetal, selectedSize, selectedKarat)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    })
  }

  const handleLike = useCallback(() => {
    if (!product) return
    requireAuth(async () => {
      if (likeLoading) return
      setLikeLoading(true)
      try {
        const res = await toggleProductLike(product._id)
        if (res?.success) {
          setIsLiked(res.data.isLiked)
          setLikeCount(res.data.likeCount)
        }
      } catch (err) {
        console.error('Like error:', err)
      } finally {
        setLikeLoading(false)
      }
      toggleWishlist(product)
    })
  }, [product, likeLoading, requireAuth, toggleWishlist])

  const handleShare = async () => {
    if (!product) return
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

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 p-8 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image || '']
  const productRating = product.averageRating || product.rating || 0
  const productReviews = product.totalRatings || product.reviews || 0
  const karatPrices = {
    '14': product.price14k || product.price || product.price14k,
    '18': product.price18k || product.price,
    '22': product.price22k || product.price,
    '24': product.price24k || product.price,
  }
  const productPrice = karatPrices[selectedKarat] || product.price14k || product.price
  const productMrp = product.mrp || product.originalPrice || 0

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            <div>
              <div className="relative mb-4">
                <img
                  src={images[selectedImage] || images[0]}
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
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-gold-500' : 'border-gray-200 hover:border-gold-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < productRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({productReviews} reviews)</span>
              </div>

              <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 mb-4">{product.description}</p>

              <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-500">
                {product.metal && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full">{product.metal}</span>
                )}
                {product.shape && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full">{product.shape}</span>
                )}
                {product.goldKarat && (
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">{product.goldKarat}k Gold</span>
                )}
                {product.weight > 0 && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full">{product.weight}g</span>
                )}
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(productPrice)}</span>
                {productMrp > productPrice && (
                  <span className="text-xl text-gray-400 line-through">{formatPrice(productMrp)}</span>
                )}
                {product.discountedPercentage > 0 && (
                  <span className="text-sm text-green-600 font-medium">{product.discountedPercentage}% off</span>
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

              {(product.price14k > 0 || product.price18k > 0 || product.price22k > 0 || product.price24k > 0) && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Gold Purity</label>
                  <div className="flex flex-wrap gap-2">
                    {product.price14k > 0 && (
                      <button
                        onClick={() => setSelectedKarat('14')}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          selectedKarat === '14' 
                            ? 'border-gold-500 bg-yellow-50 text-yellow-800' 
                            : 'border-gray-200 hover:border-gold-300'
                        }`}
                      >
                        14k - {formatPrice(product.price14k)}
                      </button>
                    )}
                    {product.price18k > 0 && (
                      <button
                        onClick={() => setSelectedKarat('18')}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          selectedKarat === '18' 
                            ? 'border-gold-500 bg-yellow-50 text-yellow-800' 
                            : 'border-gray-200 hover:border-gold-300'
                        }`}
                      >
                        18k - {formatPrice(product.price18k)}
                      </button>
                    )}
                    {product.price22k > 0 && (
                      <button
                        onClick={() => setSelectedKarat('22')}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          selectedKarat === '22' 
                            ? 'border-gold-500 bg-yellow-50 text-yellow-800' 
                            : 'border-gray-200 hover:border-gold-300'
                        }`}
                      >
                        22k - {formatPrice(product.price22k)}
                      </button>
                    )}
                    {product.price24k > 0 && (
                      <button
                        onClick={() => setSelectedKarat('24')}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          selectedKarat === '24' 
                            ? 'border-gold-500 bg-yellow-50 text-yellow-800' 
                            : 'border-gray-200 hover:border-gold-300'
                        }`}
                      >
                        24k - {formatPrice(product.price24k)}
                      </button>
                    )}
                  </div>
                </div>
              )}

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
                  onClick={handleLike}
                  disabled={likeLoading}
                  className={`relative p-4 border-2 rounded-lg transition-colors ${
                    isLiked 
                      ? 'border-red-500 bg-red-50 text-red-500' 
                      : 'border-gray-200 hover:border-red-500 hover:text-red-500'
                  }`}
                  title={isLiked ? 'Unlike' : 'Like'}
                >
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                  {likeCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {likeCount}
                    </span>
                  )}
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
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>

        {relatedFaqs.length > 0 && (
          <div className="mt-16 bg-gray-50 rounded-2xl p-8 md:p-12">
            <StaticFAQ
              faqs={relatedFaqs}
              title="Related FAQs"
              description="Find answers to common questions about this product"
              showSearch={false}
            />
          </div>
        )}
      </div>
    </div>
  )
}
