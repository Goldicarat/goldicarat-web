import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, Loader } from 'lucide-react'
import { getPageBySlug } from '../api/pageService'
import StaticFAQ from '../components/StaticFAQ'

export default function DynamicPage() {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setError(null)
    getPageBySlug(slug)
      .then((data) => {
        if (data?.success && data.page) {
          setPage(data.page)
        } else {
          setError('Page not found')
        }
      })
      .catch((err) => {
        setError(err?.response?.status === 404 ? 'Page not found' : 'Failed to load page')
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-gold-500 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="bg-gray-50 min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The page you are looking for does not exist.'}</p>
          <Link to="/" className="btn-primary inline-flex">Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gold-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{page.title}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{page.title}</h1>
          {page.metaDescription && (
            <p className="text-gray-600 mb-8 text-lg">{page.metaDescription}</p>
          )}

          {page.content && (
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-gold-600 prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          )}

          {page.type === 'faq' && page.faqs && page.faqs.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <StaticFAQ
                faqs={page.faqs.map((faq) => ({ ...faq, _key: faq._id || faq.order || Math.random() }))}
                showSearch={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
