import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw, CreditCard } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import TrustBadges from '../components/TrustBadges'
import { products, categories, diamondShapes, blogPosts, testimonials } from '../data/products'

export default function Home() {
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
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop"
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
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={`/shop?category=${category.name.toLowerCase()}`}
                className="group p-6 bg-gray-50 rounded-xl text-center hover:bg-gold-50 hover:shadow-lg transition-all duration-300"
              >
                <span className="text-4xl mb-3 block">{category.icon}</span>
                <h3 className="font-semibold text-gray-900 group-hover:text-gold-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{category.count} items</p>
              </Link>
            ))}
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
            {diamondShapes.map((shape, index) => (
              <Link 
                key={index} 
                to={`/shop?shape=${shape.name.toLowerCase()}`}
                className="group w-24 h-24 md:w-28 md:h-28 rounded-full bg-white border-2 border-gray-200 flex flex-col items-center justify-center hover:border-gold-500 hover:bg-gold-50 transition-all duration-300"
              >
                <span className="text-2xl md:text-3xl text-gold-500 group-hover:scale-110 transition-transform">
                  {shape.icon}
                </span>
                <span className="text-xs font-medium text-gray-700 mt-2 group-hover:text-gold-600 transition-colors">
                  {shape.name}
                </span>
              </Link>
            ))}
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
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-gold-600 to-gold-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
                Limited Edition Collection
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                The Jane Goodall Collection
              </h2>
              <p className="text-lg text-gold-100 mb-8">
                Limited Edition, Limitless Impact. Shop Medallions With Meaning - 
                A portion of every sale supports wildlife conservation.
              </p>
              <button className="bg-white text-gold-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                Shop The Collection <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop"
                alt="Jane Goodall Collection"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Jewelry Spotlight</h2>
            <p className="text-gray-600 mt-2">Curated collections for every style</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Ombre Jewelry", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=400&fit=crop" },
              { name: "Bezel Jewelry", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=400&fit=crop" },
              { name: "Cocktail Rings", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&h=400&fit=crop" },
              { name: "Sol Collection", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=300&h=400&fit=crop" },
            ].map((item, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl aspect-[3/4]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-semibold mb-2">{item.name}</h3>
                  <button className="text-gold-300 text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Price Range</h2>
            <p className="text-gray-400">Shop unique jewellery within your budget</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {['$0-$500', '$500-$1000', '$1000-$2000', '$2000-$5000', '$5000+'].map((range, index) => (
              <button 
                key={index}
                className="px-8 py-4 bg-gray-800 rounded-lg hover:bg-gold-500 transition-colors font-medium"
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </section>

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
