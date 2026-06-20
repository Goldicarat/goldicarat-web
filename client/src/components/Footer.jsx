import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Diamond, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { logo } from '../assets/images'
import { fetchSiteSettings } from '../api/pageService'

const iconMap = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
}

export default function Footer() {
  const [footerLinks, setFooterLinks] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFooterLinks()
  }, [])

  const loadFooterLinks = async () => {
    try {
      const data = await fetchSiteSettings()
      if (data?.success && data.setting?.footerLinks) {
        setFooterLinks(data.setting.footerLinks)
      }
    } catch (err) {
      console.error('Load footer links error:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderSocialIcon = (platform) => {
    const Icon = iconMap[platform]
    if (!Icon) return null
    return <Icon className="w-5 h-5" />
  }

  const defaultCustomerService = [
    { label: 'Track Order', url: '/page/track-order', isActive: true },
    { label: 'Shipping Info', url: '/page/shipping-info', isActive: true },
    { label: "Returns & Exchanges", url: '/page/returns-exchanges', isActive: true },
    { label: 'Ring Size Guide', url: '/page/ring-size-guide', isActive: true },
    { label: 'FAQs', url: '/faq', isActive: true },
  ]

  const defaultBottomLinks = [
    { label: 'Privacy Policy', url: '/page/privacy-policy', isActive: true },
    { label: 'Terms & Conditions', url: '/page/terms-conditions', isActive: true },
    { label: 'Cookie Policy', url: '/page/cookie-policy', isActive: true },
  ]

  const customerService = footerLinks?.customerService?.length
    ? footerLinks.customerService.filter((l) => l.isActive)
    : defaultCustomerService

  const socialLinks = footerLinks?.social?.length
    ? footerLinks.social.filter((l) => l.isActive)
    : []

  const bottomLinks = footerLinks?.bottomLinks?.length
    ? footerLinks.bottomLinks.filter((l) => l.isActive)
    : defaultBottomLinks

  const renderLink = (url, label) => {
    const isExternal = url.startsWith('http://') || url.startsWith('https://')
    if (isExternal) {
      return <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold-400 transition-colors">{label}</a>
    }
    if (url === '/faq') {
      return <Link to="/faq" className="text-gray-400 hover:text-gold-400 transition-colors">{label}</Link>
    }
    return <Link to={url.startsWith('/') ? url : `/page/${url}`} className="text-gray-400 hover:text-gold-400 transition-colors">{label}</Link>
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src={logo}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full overflow-hidden border border-yellow-400/40 shadow-[0_0_25px_rgba(255,215,0,0.3)] bg-gradient-to-br from-gray-900 to-gray-800"
                  alt="Goldicarat"
                />
                <div>
                  <h3 className="font-serif text-xl font-bold">Goldicarat</h3>
                  <p className="text-xs text-gold-400 tracking-wider">CUSTOM DIAMOND JEWELRY</p>
                </div>
              </Link>
            </div>
            <p className="text-gray-400 mb-6">
              Experience the brilliance of ethically created lab-grown diamonds.
              Each piece is crafted with precision and care to last a lifetime.
            </p>
            <div className="flex gap-4">
              {socialLinks.length > 0 ? (
                socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-full hover:bg-gold-500 transition-colors"
                  >
                    {renderSocialIcon(link.platform)}
                  </a>
                ))
              ) : (
                <>
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
                </>
              )}
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
              {customerService.map((link, idx) => (
                <li key={idx}>{renderLink(link.url, link.label)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-500 flex-shrink-0 mt-1" />
                <span className="text-gray-400">Mavani Shopping Center<br />Mangadh Chowk, Varachha Road <br />Mini Bazar, Surat, Gujarat.</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-500" />
                <a href="tel:+917434080899" className="text-gray-400 hover:text-gold-400 transition-colors">+91 7434080899</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-500" />
                <a href="mailto:goldicarat@gmail.com" className="text-gray-400 hover:text-gold-400 transition-colors">goldicarat@gmail.com</a>
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
              {bottomLinks.map((link, idx) => (
                <span key={idx}>{renderLink(link.url, link.label)}</span>
              ))}
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
