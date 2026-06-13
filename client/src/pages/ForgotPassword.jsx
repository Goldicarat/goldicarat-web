import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
import { forgotPassword as apiForgotPassword } from '../api/authService'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    try {
      const data = await apiForgotPassword(email)
      if (data?.success) {
        toast.success('Reset link sent to your email')
        setIsSent(true)
        setMessage(data.message || 'Password reset link sent to your email')
      } else {
        const msg = data?.message || 'Something went wrong'
        setError(msg)
        toast.error(msg)
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Something went wrong'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-gold-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
          <p className="text-gray-500 mt-2">
            {isSent
              ? 'Check your email for the reset link'
              : 'Enter your email and we\'ll send you a reset link'}
          </p>
        </div>

        {isSent ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-700 mb-2">{message}</p>
            <p className="text-sm text-gray-500 mb-6">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => { setIsSent(false); setEmail('') }}
                className="text-gold-600 hover:text-gold-700 font-medium"
              >
                try again
              </button>
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-3 rounded-lg font-medium hover:from-gold-600 hover:to-gold-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center mt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
