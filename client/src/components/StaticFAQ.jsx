import { useState } from 'react'
import { ChevronRight, Search, HelpCircle } from 'lucide-react'

export default function StaticFAQ({ faqs = [], grouped = false, showSearch = true, title, description }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [openFaq, setOpenFaq] = useState(null)

  const filteredFaqs = searchTerm
    ? faqs.filter(
        (faq) =>
          faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : faqs

  const groupedFaqs = grouped
    ? filteredFaqs.reduce((acc, faq) => {
        const group = faq.category || faq.pageTitle || 'General'
        if (!acc[group]) acc[group] = []
        acc[group].push(faq)
        return acc
      }, {})
    : null

  const renderFaqItem = (faq, idx) => (
    <div key={faq._key || idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpenFaq(openFaq === (faq._key || idx) ? null : (faq._key || idx))}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
        <ChevronRight className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === (faq._key || idx) ? 'rotate-90' : ''}`} />
      </button>
      {openFaq === (faq._key || idx) && (
        <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
          {faq.answer}
        </div>
      )}
    </div>
  )

  return (
    <div>
      {(title || description) && (
        <div className="text-center mb-10">
          {title && <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h2>}
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      )}

      {showSearch && faqs.length > 0 && (
        <div className="relative max-w-lg mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none bg-white"
          />
        </div>
      )}

      {filteredFaqs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No FAQs found</h3>
          <p className="text-gray-500">Try a different search term or check back later</p>
        </div>
      ) : grouped && groupedFaqs ? (
        <div className="space-y-8">
          {Object.entries(groupedFaqs).map(([group, groupFaqs]) => (
            <div key={group}>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-gold-500 rounded-full inline-block"></span>
                {group}
              </h3>
              <div className="space-y-3">
                {groupFaqs.map(renderFaqItem)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map(renderFaqItem)}
        </div>
      )}
    </div>
  )
}
