import { Diamond, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function ComingSoonFooter() {
  return (
    <footer className="bg-gray-950 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Diamond className="w-6 h-6 text-gold-500" />
              <div>
                <h3 className="font-serif text-lg font-bold">Goldicarat</h3>
                <p className="text-xs text-gold-400 tracking-wider">CUSTOM DIAMOND JEWELRY</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Experience the brilliance of ethically created lab-grown diamonds. 
              Each piece is crafted with precision and care to last a lifetime.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-400">Shop All</span></li>
              <li><span className="text-gray-400">Custom Design</span></li>
              <li><span className="text-gray-400">About Us</span></li>
              <li><span className="text-gray-400">Blog</span></li>
              <li><span className="text-gray-400">Contact</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-400">Shipping Info</span></li>
              <li><span className="text-gray-400">Returns & Exchanges</span></li>
              <li><span className="text-gray-400">Ring Size Guide</span></li>
              <li><span className="text-gray-400">FAQs</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">123 Hatton Garden<br />London, EC1N 8UK</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-500" />
                <span className="text-gray-400">+44 7757208197</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-500" />
                <span className="text-gray-400">care@goldicarat.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gold-500 transition-colors">
            <Facebook className="w-4 h-4" />
          </a>
          <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gold-500 transition-colors">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gold-500 transition-colors">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gold-500 transition-colors">
            <Youtube className="w-4 h-4" />
          </a>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mb-4">
            <span>9kt Gold</span>
            <span>14kt Gold</span>
            <span>18kt Gold</span>
            <span>Platinum</span>
            <span>Lab Grown Diamonds</span>
            <span>Certified Diamonds</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <span>Privacy Policy</span>
            <span>Terms & Conditions</span>
            <span>Cookie Policy</span>
          </div>
          <p className="text-center text-gray-500 text-xs mt-4">
            &copy; 2026 Goldicarat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
