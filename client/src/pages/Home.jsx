import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw, CreditCard } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import TrustBadges from '../components/TrustBadges'
import { blogPosts, testimonials } from '../data/products'
import { fetchProductsByType } from '../api/productService'
import { fetchSiteSettings } from '../api/settingService'
import { fetchCategories } from '../api/categoryService'
import { fetchVideos } from '../api/videoService'

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [specialOffers, setSpecialOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [siteSettings, setSiteSettings] = useState(null)
  const [videos, setVideos] = useState([])
  const [playingVideo, setPlayingVideo] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [newArrivalsData, bestSellersData, specialOffersData] = await Promise.all([
          fetchProductsByType('new_arrivals', { _perPage: 8 }),
          fetchProductsByType('best_sellers', { _perPage: 8 }),
          fetchProductsByType('special_offers', { _perPage: 8 }),
        ])
        setNewArrivals(newArrivalsData?.success ? (newArrivalsData.products || []) : [])
        setBestSellers(bestSellersData?.success ? (bestSellersData.products || []) : [])
        setSpecialOffers(specialOffersData?.success ? (specialOffersData.products || []) : [])
      } catch (err) {
        console.error('Error loading products:', err)
        setNewArrivals([])
        setBestSellers([])
        setSpecialOffers([])
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  useEffect(() => {
    const loadSiteSettings = async () => {
      try {
        const data = await fetchSiteSettings()
        if (data?.success) setSiteSettings(data.setting)
      } catch (err) {
        console.error('Error loading site settings:', err)
      }
    }
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        if (data?.success) setCategories(data.categories || [])
      } catch (err) {
        console.error('Error loading categories:', err)
      }
    }
    const loadVideos = async () => {
      try {
        const data = await fetchVideos()
        if (data?.success) setVideos(data.videos || [])
      } catch (err) {
        console.error('Error loading videos:', err)
      }
    }
    loadSiteSettings()
    loadCategories()
    loadVideos()
  }, [])

  return (
    <div>
      <section className="relative bg-gradient-to-br from-gold-50 via-white to-gold-100 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gold-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-block px-4 py-2 bg-gold-100 text-gold-700 rounded-full text-sm font-medium mb-6">
                ✨ Lab Grown Diamonds
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Experience The <span className="text-gold-500">Brilliance</span> Of Lab-Grown Diamonds
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                Discover ethically created, stunning diamond jewelry that doesn't compromise on quality or your values.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/shop" className="btn-primary inline-flex items-center justify-center gap-2">
                  Shop Collection <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/custom-design" className="btn-secondary inline-flex items-center justify-center gap-2">
                  Custom Design
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <img
                  src={siteSettings?.heroBanner?.isActive && siteSettings.heroBanner.image ? siteSettings.heroBanner.image : "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop"}
                  alt="Diamond Ring"
                  className="rounded-2xl shadow-2xl mx-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg z-20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-gold-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Certified Quality</p>
                    <p className="text-xs text-gray-500">IGI & GIA Certified</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg z-20">
                <div className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Ethically Sourced</p>
                    <p className="text-xs text-gray-500">100% Conflict Free</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustBadges />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Shop By Category</h2>
            <p className="text-gray-600 mt-2">Explore our exquisite collections</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.length > 0 ? categories.map((category, index) => (
              <Link 
                key={category._id || index} 
                to={category.slug ? `/shop?category=${category.slug}` : `/shop?category=${category.name?.toLowerCase()}`}
                className="group p-6 bg-gray-50 rounded-xl text-center hover:bg-gold-50 hover:shadow-lg transition-all duration-300"
              >
                {category.image ? (
                  <img src={category.image} alt={category.name} className="w-16 h-16 mx-auto mb-3 object-cover rounded-full" />
                ) : (
                  <span className="text-4xl mb-3 block">💎</span>
                )}
                <h3 className="font-semibold text-gray-900 group-hover:text-gold-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            )) : (
              <>
                {['Rings', 'Bracelets', 'Necklaces', 'Pendants', 'Earrings', 'Wedding Rings'].map((name, index) => (
                  <Link 
                    key={index} 
                    to={`/shop?category=${name.toLowerCase()}`}
                    className="group p-6 bg-gray-50 rounded-xl text-center hover:bg-gold-50 hover:shadow-lg transition-all duration-300"
                  >
                    <span className="text-4xl mb-3 block">💎</span>
                    <h3 className="font-semibold text-gray-900 group-hover:text-gold-600 transition-colors">{name}</h3>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Shop By Diamond Shape</h2>
            <p className="text-gray-600 mt-2">Find your perfect diamond shape</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {(siteSettings?.diamondShapes?.length > 0 ? siteSettings.diamondShapes : ['Round', 'Emerald', 'Princess', 'Oval', 'Pear', 'Heart']).map((shape, index) => {
              const name = typeof shape === 'string' ? shape : shape.name
              return (
                <Link 
                  key={index} 
                  to={`/shop?shape=${name.toLowerCase()}`}
                  className="group w-24 h-24 md:w-28 md:h-28 rounded-full bg-white border-2 border-gray-200 flex flex-col items-center justify-center hover:border-gold-500 hover:bg-gold-50 transition-all duration-300"
                >
                  <span className="text-2xl md:text-3xl text-gold-500 group-hover:scale-110 transition-transform">
                    💎
                  </span>
                  <span className="text-xs font-medium text-gray-700 mt-2 group-hover:text-gold-600 transition-colors">
                    {name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {videos.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="section-title">Featured Videos</h2>
              <p className="text-gray-600 mt-2">Watch our latest collections and stories</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div
                    className="relative group cursor-pointer aspect-video bg-gray-900"
                    onClick={() => setPlayingVideo(video)}
                  >
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <span className="text-gray-400">{video.title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-gold-600 border-b-[10px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 text-lg truncate">{video.title}</h3>
                    {video.description && (
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">{video.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {playingVideo && (
            <div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setPlayingVideo(null)}
            >
              <div
                className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
                >
                  <span className="text-xl leading-none">&times;</span>
                </button>
                <video
                  src={playingVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full aspect-video"
                  poster={playingVideo.thumbnail}
                >
                  Your browser does not support the video tag.
                </video>
                <div className="p-5 bg-gray-900">
                  <h3 className="text-white font-semibold text-lg">{playingVideo.title}</h3>
                  {playingVideo.description && (
                    <p className="text-gray-400 mt-2 leading-relaxed max-h-24 overflow-y-auto">{playingVideo.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="section-title">New Arrivals</h2>
              <p className="text-gray-600 mt-2">Check out our latest additions</p>
            </div>
            <Link 
              to="/shop" 
              className="mt-4 md:mt-0 text-gold-600 hover:text-gold-700 font-medium flex items-center gap-2"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))
              : newArrivals.length > 0
                ? newArrivals.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                : <p className="col-span-full text-center text-gray-500 py-8">No products available</p>
            }
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="section-title">Best Sellers</h2>
              <p className="text-gray-600 mt-2">Our most loved pieces</p>
            </div>
            <Link 
              to="/shop" 
              className="mt-4 md:mt-0 text-gold-600 hover:text-gold-700 font-medium flex items-center gap-2"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))
              : bestSellers.length > 0
                ? bestSellers.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                : <p className="col-span-full text-center text-gray-500 py-8">No products available</p>
            }
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="section-title">Special Offers</h2>
              <p className="text-gray-600 mt-2">Exclusive deals just for you</p>
            </div>
            <Link 
              to="/shop" 
              className="mt-4 md:mt-0 text-gold-600 hover:text-gold-700 font-medium flex items-center gap-2"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))
              : specialOffers.length > 0
                ? specialOffers.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                : <p className="col-span-full text-center text-gray-500 py-8">No products available</p>
            }
          </div>
        </div>
      </section>

      {siteSettings?.collectionBanner?.isActive && (
        <section className="py-16 bg-gradient-to-r from-gold-600 to-gold-500 text-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                {siteSettings.collectionBanner.subtitle && (
                  <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
                    {siteSettings.collectionBanner.subtitle}
                  </span>
                )}
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  {siteSettings.collectionBanner.title || 'Collection'}
                </h2>
                {siteSettings.collectionBanner.description && (
                  <p className="text-lg text-gold-100 mb-8">{siteSettings.collectionBanner.description}</p>
                )}
                <Link
                  to={siteSettings.collectionBanner.link || '/shop'}
                  className="bg-white text-gold-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                >
                  {siteSettings.collectionBanner.sale || 'Shop The Collection'} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="relative">
                <img
                  src={siteSettings.collectionBanner.image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop"}
                  alt={siteSettings.collectionBanner.title || 'Collection'}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Jewelry Spotlight</h2>
            <p className="text-gray-600 mt-2">Curated collections for every style</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(siteSettings?.spotlight?.length > 0 ? siteSettings.spotlight : [
              { title: "Ombre Jewelry", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=400&fit=crop", link: "/shop" },
              { title: "Bezel Jewelry", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=400&fit=crop", link: "/shop" },
              { title: "Cocktail Rings", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&h=400&fit=crop", link: "/shop" },
              { title: "Sol Collection", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=300&h=400&fit=crop", link: "/shop" },
            ]).map((item, index) => (
              <Link key={index} to={item.link || "/shop"} className="group relative overflow-hidden rounded-xl aspect-[3/4] block">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-semibold mb-2">{item.title}</h3>
                  <span className="text-gold-300 text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {siteSettings?.priceRanges?.length > 0 && (
        <section className="py-16 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Price Range</h2>
              <p className="text-gray-400">Shop unique jewellery within your budget</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {siteSettings.priceRanges.map((range, index) => (
                <Link
                  key={index}
                  to={range.max ? `/shop?minPrice=${range.min}&maxPrice=${range.max}` : `/shop?minPrice=${range.min}`}
                  className="px-8 py-4 bg-gray-800 rounded-lg hover:bg-gold-500 transition-colors font-medium inline-block"
                >
                  {range.label || `₹${range.min}${range.max ? `-₹${range.max}` : '+'}`}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-gold-100 text-gold-700 rounded-full text-sm font-medium mb-6">
                Custom Design Service
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Make Your Own Custom Jewelry
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                From custom engagement rings to custom pendants, necklaces and bracelets, 
                creating a one-of-a-kind design is easy. Your creativity, paired with our 
                exceptional craftsmanship, will create diamond jewelry pieces that reflect your personality.
              </p>
              <Link to="/custom-design" className="btn-primary inline-flex items-center gap-2">
                Customize Your Design <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop" alt="Custom Ring" className="rounded-xl" />
              <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop" alt="Custom Necklace" className="rounded-xl mt-8" />
              <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop" alt="Custom Earrings" className="rounded-xl" />
              <img src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&h=300&fit=crop" alt="Custom Ring" className="rounded-xl mt-8" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-diamond-50 to-gold-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Experience The Dazzling World Of Lab-Grown Diamonds Today!
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore the finest ethically created jewelry in our collection. From engagement rings 
            to pendants, find your perfect piece crafted with precision and care.
          </p>
          <button className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
            Book a Virtual Appointment
          </button>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">From Our Blog</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="group">
                <div className="overflow-hidden rounded-xl mb-4">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <span className="text-sm text-gray-500">{post.date}</span>
                <h3 className="text-xl font-semibold text-gray-900 mt-2 mb-3 group-hover:text-gold-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link to="/blog" className="text-gold-600 font-medium flex items-center gap-2 hover:gap-3 transition-all">
                  Read More <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-2xl font-bold text-gray-900">4.0</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                ))}
              </div>
              <span className="text-gray-500">TrustScore</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-gold-600 to-gold-500">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gold-100 mb-8">
              Deals are delivered to your Inbox. Be the first one to get the details of the Goldicarat Jewels Brand New Collection.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button 
                type="submit"
                className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
