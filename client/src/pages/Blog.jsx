import { Search, Calendar, User, ArrowRight } from 'lucide-react'
import { blogPosts } from '../data/products'

export default function Blog() {
  const categories = ['All', 'Diamond Guide', 'Wedding', 'Styling Tips', 'Care Guide', 'News']

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-gold-600 to-gold-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-gold-100 text-lg">Discover insights, guides, and inspiration</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="lg:w-64">
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <h3 className="font-semibold mb-4">Search</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-3">
                {categories.map((cat, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-gray-600 hover:text-gold-600 transition-colors flex items-center justify-between"
                    >
                      {cat}
                      {index === 0 && <span className="text-sm text-gold-600">({blogPosts.length + 2})</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gold-600 to-gold-500 rounded-xl p-6 mt-8 text-white">
              <h3 className="font-semibold mb-4">Newsletter</h3>
              <p className="text-gold-100 text-sm mb-4">
                Subscribe to get the latest updates and exclusive offers.
              </p>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-3 rounded-lg text-gray-900 mb-3 focus:outline-none"
              />
              <button className="w-full bg-white text-gold-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </aside>

          <main className="flex-1">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm card-hover">
                  <div className="overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" /> Goldicarat Jewels
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-gold-600 transition-colors cursor-pointer">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <a href="#" className="text-gold-600 font-medium flex items-center gap-2 hover:gap-3 transition-all">
                      Read More <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 bg-white rounded-xl p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <img 
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop" 
                  alt="Blog Feature"
                  className="w-full md:w-48 h-48 rounded-xl object-cover"
                />
                <div className="flex-1 text-center md:text-left">
                  <span className="text-gold-600 font-medium text-sm">FEATURED</span>
                  <h2 className="text-2xl font-semibold text-gray-900 mt-2 mb-3">
                    Complete Guide to Choosing the Perfect Engagement Ring
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Everything you need to know about diamond shapes, settings, metals, and how to 
                    choose the perfect ring for your partner.
                  </p>
                  <button className="btn-primary">Read Full Guide</button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-2">
              <button className="w-10 h-10 rounded-lg border border-gray-300 bg-gold-500 text-white font-medium">1</button>
              <button className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gold-50 transition-colors">2</button>
              <button className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gold-50 transition-colors">3</button>
              <button className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gold-50 transition-colors">
                <span className="sr-only">Next</span>&raquo;
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
