import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Loader, HelpCircle } from 'lucide-react'
import { getPages } from '../api/pageService'
import StaticFAQ from '../components/StaticFAQ'

export default function FAQ() {
  const [faqPages, setFaqPages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFaqs()
  }, [])

  const loadFaqs = async () => {
    try {
      const data = await getPages('faq')
      if (data?.success) {
        setFaqPages(data.pages || [])
      }
    } catch (err) {
      console.error('Load FAQs error:', err)
    } finally {
      setLoading(false)
    }
  }

  const allFaqs = faqPages.flatMap((page) =>
    (page.faqs || []).map((faq) => ({
      ...faq,
      category: page.title,
      pageSlug: page.slug,
      _key: `${page._id}_${faq._id || faq.order || Math.random()}`,
    }))
  )

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-gold-500 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gold-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">FAQs</span>
        </nav>

        <div className="text-center mb-10">
          <HelpCircle className="w-12 h-12 text-gold-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h1>
          <p className="text-gray-600">Find answers to common questions about our products, shipping, and more</p>
        </div>

        {faqPages.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No FAQs available</h3>
            <p className="text-gray-500">Check back later for updated frequently asked questions</p>
          </div>
        ) : (
          <StaticFAQ faqs={allFaqs} grouped showSearch />
        )}
      </div>
    </div>
  )
}
