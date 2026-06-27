import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <svg className="w-32 h-32 mx-auto text-gold-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10L65 40L50 35L35 40L50 10Z" fill="currentColor" opacity="0.4"/>
            <path d="M50 20L70 60L50 52L30 60L50 20Z" fill="currentColor" opacity="0.6"/>
            <path d="M50 35L75 85L50 72L25 85L50 35Z" fill="currentColor"/>
          </svg>
        </div>
        <h1 className="text-8xl font-serif font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved. 
          Let us help you find the perfect piece instead.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gold-500 text-white rounded-lg font-semibold hover:bg-gold-600 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gold-500 hover:text-gold-600 transition-colors"
          >
            Browse Collection
          </Link>
        </div>
      </div>
    </div>
  )
}
