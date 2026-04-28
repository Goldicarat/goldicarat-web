import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Search, ShoppingBag, User, Heart, LogOut, ChevronDown } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { logo } from '../assets/images'

const jewelryCategories = [
  {
    name: 'Rings',
    collections: ['Engagement', 'Wedding', 'Cocktail', 'Stackable', 'Eternity'],
    shapes: ['Round', 'Princess', 'Cushion', 'Oval', 'Emerald', 'Marquise', 'Heart', 'Pear'],
    genders: ['Women', 'Men', 'Unisex'],
    metals: ['Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum'],
    diamondType: ['Lab Grown', 'Natural Diamond']
  },
  {
    name: 'Necklaces',
    collections: ['Statement', 'Delicate', 'Layered', 'Pendant', 'Tennis'],
    shapes: ['Round', 'Pear', 'Heart', 'Emerald', 'Marquise'],
    genders: ['Women', 'Men', 'Unisex'],
    metals: ['Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum', 'Silver'],
    diamondType: ['Lab Grown', 'Natural Diamond']
  },
  {
    name: 'Bracelets',
    collections: ['Tennis', 'Chain', 'Bangle', 'Cuff', 'Charm'],
    shapes: ['Round', 'Oval', 'Princess'],
    genders: ['Women', 'Men', 'Unisex'],
    metals: ['Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum', 'Silver'],
    diamondType: ['Lab Grown', 'Natural Diamond']
  },
  {
    name: 'Pendants',
    collections: ['Solitaire', 'Halo', 'Three Stone', 'Vintage', 'Modern'],
    shapes: ['Round', 'Pear', 'Heart', 'Emerald', 'Cushion'],
    genders: ['Women', 'Unisex'],
    metals: ['Yellow Gold', 'White Gold', 'Rose Gold', 'Silver'],
    diamondType: ['Lab Grown', 'Natural Diamond']
  },
  {
    name: 'Earrings',
    collections: ['Stud', 'Hoop', 'Drop', 'Dangle', 'Cluster'],
    shapes: ['Round', 'Pear', 'Heart', 'Princess', 'Oval'],
    genders: ['Women', 'Men', 'Unisex'],
    metals: ['Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum', 'Silver'],
    diamondType: ['Lab Grown', 'Natural Diamond']
  },
  {
    name: 'Wedding Rings',
    collections: ['Classic', 'Modern', 'Vintage', 'Infinity', 'Diamond'],
    shapes: ['Round', 'Baguette', 'Tapered'],
    genders: ['Women', 'Men', 'Unisex'],
    metals: ['Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum'],
    diamondType: ['Lab Grown', 'Natural Diamond']
  }
]

const NavLink = ({ to, children, onClick }) => {
  const location = useLocation()
  const isActive = location.pathname === to
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`transition-colors duration-300 font-medium ${
        isActive 
          ? 'text-gold-600' 
          : 'text-gray-700 hover:text-gold-600'
      }`}
    >
      {children}
    </Link>
  )
}

const JewelryDropdown = ({ category, onClose }) => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full w-[95vw] bg-white shadow-2xl border-t-2 border-gold-500 z-50 rounded-b-lg">
      <div className="px-6 py-5">
        <div className="grid grid-cols-5 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
              <Diamond className="w-4 h-4 text-gold-500" />
              {category.name}
            </h3>
            <ul className="space-y-1.5">
              {category.collections.map((collection) => (
                <li key={collection}>
                  <Link 
                    to={`/shop?category=${category.name.toLowerCase()}&collection=${collection.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={onClose}
                    className="text-gray-600 hover:text-gold-600 transition-colors text-sm block py-0.5"
                  >
                    {collection}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Shapes</h3>
            <ul className="space-y-1.5">
              {category.shapes.map((shape) => (
                <li key={shape}>
                  <Link 
                    to={`/shop?category=${category.name.toLowerCase()}&shape=${shape.toLowerCase()}`}
                    onClick={onClose}
                    className="text-gray-600 hover:text-gold-600 transition-colors text-sm block py-0.5"
                  >
                    {shape}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Gender</h3>
            <ul className="space-y-1.5">
              {category.genders.map((gender) => (
                <li key={gender}>
                  <Link 
                    to={`/shop?category=${category.name.toLowerCase()}&gender=${gender.toLowerCase()}`}
                    onClick={onClose}
                    className="text-gray-600 hover:text-gold-600 transition-colors text-sm block py-0.5"
                  >
                    {gender}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Diamond Type</h3>
            <ul className="space-y-1.5">
              {category.diamondType.map((type) => (
                <li key={type}>
                  <Link 
                    to={`/shop?category=${category.name.toLowerCase()}&diamond=${type.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={onClose}
                    className="text-gray-600 hover:text-gold-600 transition-colors text-sm block py-0.5"
                  >
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Metal</h3>
            <ul className="space-y-1.5">
              {category.metals.map((metal) => (
                <li key={metal}>
                  <Link 
                    to={`/shop?category=${category.name.toLowerCase()}&metal=${metal.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={onClose}
                    className="text-gray-600 hover:text-gold-600 transition-colors text-sm block py-0.5"
                  >
                    {metal}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link 
            to={`/shop?category=${category.name.toLowerCase()}`}
            onClick={onClose}
            className="text-gold-600 hover:text-gold-700 font-medium text-sm inline-flex items-center gap-1"
          >
            View All {category.name}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const { cartCount, setIsCartOpen } = useCart()
  const { wishlistCount, setIsWishlistOpen } = useWishlist()
  const { user, isLoggedIn, logout, setIsAuthModalOpen } = useAuth()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  const handleDropdownClose = () => {
    setActiveDropdown(null)
  }

  const handleNavClick = () => {
    setIsMenuOpen(false)
    setActiveDropdown(null)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="bg-gradient-to-r from-gold-600 to-gold-500 text-white text-center py-2 text-xs sm:text-sm">
        <div className="container mx-auto px-4 flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
          <span className="flex items-center gap-1">
            <Diamond className="w-3 h-3 sm:w-4 sm:h-4" /> 15 DAYS EXCHANGE
          </span>
          <span className="hidden xs:inline">|</span>
          <span>IN-STORE PICKUP</span>
          <span className="hidden sm:inline">|</span>
          <span>BUY NOW & PAY LATER</span>
          <span className="hidden lg:inline">|</span>
          <span className="hidden lg:inline">FREE RING ENGRAVING</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 sm:py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Goldicarat" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
            <div>
              <h1 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                Goldicarat
              </h1>
              <p className="text-[10px] sm:text-xs text-gold-600 tracking-wider">CUSTOM DIAMOND JEWELRY</p>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {jewelryCategories.map((category) => (
              <div 
                key={category.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(category.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button 
                  className={`px-2.5 py-2 flex items-center gap-1 transition-colors duration-300 font-medium text-sm whitespace-nowrap ${
                    location.pathname === '/shop' && activeDropdown === category.name
                      ? 'text-gold-600'
                      : 'text-gray-700 hover:text-gold-600'
                  }`}
                >
                  {category.name}
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === category.name ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === category.name && (
                  <JewelryDropdown category={category} onClose={handleDropdownClose} />
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => isLoggedIn() ? setIsUserMenuOpen(!isUserMenuOpen) : setIsAuthModalOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </button>
              
              {isUserMenuOpen && isLoggedIn() && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-2">
                  <div className="px-4 py-2 border-b">
                    <p className="font-medium text-gray-900">Hello, {user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <Link 
                    to="/account"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link 
                    to="/orders"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative hidden sm:block"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for diamonds, rings, necklaces..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                autoFocus
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        )}
      </div>

      {isMenuOpen && (
        <nav className="xl:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {jewelryCategories.map((category) => (
              <div key={category.name} className="border-b border-gray-100 pb-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-2">{category.name}</h3>
                <div className="pl-4 space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Collections</p>
                    <div className="flex flex-wrap gap-2">
                      {category.collections.map((col) => (
                        <Link 
                          key={col}
                          to={`/shop?category=${category.name.toLowerCase()}&collection=${col.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={handleNavClick}
                          className="text-xs text-gray-600 hover:text-gold-600"
                        >
                          {col}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Metals</p>
                    <div className="flex flex-wrap gap-2">
                      {category.metals.map((metal) => (
                        <Link 
                          key={metal}
                          to={`/shop?category=${category.name.toLowerCase()}&metal=${metal.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={handleNavClick}
                          className="text-xs text-gray-600 hover:text-gold-600"
                        >
                          {metal}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <NavLink to="/about" onClick={handleNavClick}>About</NavLink>
            <NavLink to="/blog" onClick={handleNavClick}>Blog</NavLink>
            <NavLink to="/contact" onClick={handleNavClick}>Contact</NavLink>
            
            {isLoggedIn() && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">Logged in as {user?.name}</p>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
