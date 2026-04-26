import { Link } from 'react-router-dom'
import { Diamond, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Diamond className="w-8 h-8 text-gold-500" />
              <div>
                <h3 className="font-serif text-xl font-bold">Goldicarat</h3>
                <p className="text-xs text-gold-400 tracking-wider">CUSTOM DIAMOND JEWELRY</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Experience the brilliance of ethically created lab-grown diamonds. 
              Each piece is crafted with precision and care to last a lifetime.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gold-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gold-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gold-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gold-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-gray-400 hover:text-gold-400 transition-colors">Shop All</Link></li>
              <li><Link to="/custom-design" className="text-gray-400 hover:text-gold-400 transition-colors">Custom Design</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-gold-400 transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-gold-400 transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-gold-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Customer Service</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Track Order</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Ring Size Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-500 flex-shrink-0 mt-1" />
                <span className="text-gray-400">123 Hatton Garden<br />London, EC1N 8UK</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-500" />
                <a href="tel:+447757208197" className="text-gray-400 hover:text-gold-400 transition-colors">+44 7757208197</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-500" />
                <a href="mailto:care@goldicarat.com" className="text-gray-400 hover:text-gold-400 transition-colors">care@goldicarat.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; 2026 Goldicarat. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Terms & Conditions</a>
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-950 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
            <span>9kt Gold</span>
            <span>14kt Gold</span>
            <span>18kt Gold</span>
            <span>Platinum</span>
            <span>Lab Grown Diamonds</span>
            <span>Certified Diamonds</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
