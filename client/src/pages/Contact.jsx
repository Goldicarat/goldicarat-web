import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, PhoneCall, Video } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      alert('Thank you for your message! We will get back to you shortly.')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 1500)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-gold-600 to-gold-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-gold-100 text-lg">We'd love to hear from you</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-8 text-center shadow-sm card-hover">
            <div className="w-16 h-16 mx-auto mb-4 bg-gold-100 rounded-full flex items-center justify-center">
              <Phone className="w-8 h-8 text-gold-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">Mon-Sat: 9am - 6pm GMT</p>
            <a href="tel:+447757208197" className="text-gold-600 font-medium hover:text-gold-700">
              +44 7757208197
            </a>
          </div>

          <div className="bg-white rounded-xl p-8 text-center shadow-sm card-hover">
            <div className="w-16 h-16 mx-auto mb-4 bg-gold-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-gold-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email Us</h3>
            <p className="text-gray-600 mb-4">We reply within 24 hours</p>
            <a href="mailto:care@goldicarat.com" className="text-gold-600 font-medium hover:text-gold-700">
              care@goldicarat.com
            </a>
          </div>

          <div className="bg-white rounded-xl p-8 text-center shadow-sm card-hover">
            <div className="w-16 h-16 mx-auto mb-4 bg-gold-100 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-gold-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
            <p className="text-gray-600 mb-4">By appointment only</p>
            <p className="text-gray-900">123 Hatton Garden, London EC1N 8UK</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                    placeholder="+44 123 456 7890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Inquiry</option>
                    <option value="custom">Custom Design</option>
                    <option value="returns">Returns & Exchanges</option>
                    <option value="general">General Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                {!isSubmitting && <Send className="w-5 h-5" />}
              </button>
            </form>
          </div>

          <div>
            <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold mb-6">Book a Consultation</h2>
              <p className="text-gray-600 mb-6">
                Prefer to speak with someone? Schedule a free consultation with our jewelry experts.
              </p>
              <div className="space-y-4">
                <button className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gold-50 transition-colors">
                  <Video className="w-8 h-8 text-blue-500" />
                  <div className="text-left">
                    <p className="font-medium">Video Call</p>
                    <p className="text-sm text-gray-500">30 min free consultation</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gold-50 transition-colors">
                  <PhoneCall className="w-8 h-8 text-green-500" />
                  <div className="text-left">
                    <p className="font-medium">Phone Call</p>
                    <p className="text-sm text-gray-500">Immediate callback</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gold-50 transition-colors">
                  <MessageCircle className="w-8 h-8 text-purple-500" />
                  <div className="text-left">
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-gray-500">Chat with us live</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gold-600 to-gold-500 rounded-xl p-8 text-white">
              <h3 className="text-xl font-semibold mb-4">Opening Hours</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gold-100">Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gold-100">Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gold-100">Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gold-500">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">UK (GMT) Time</span>
                </div>
                <p className="text-gold-100 text-sm">
                  * Appointments available outside hours upon request
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-xl overflow-hidden shadow-lg h-80">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.4!2d-0.1087!3d51.52!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDMxJzEyLjAiTiAxwrAwNicwMC42IkU!5e0!3m2!1sen!2suk!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Our Location"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
