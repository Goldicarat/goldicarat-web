import { useState } from 'react'
import { Diamond, Palette, Hammer, Check, ArrowRight, Send, ChevronLeft, Image as ImageIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { submitCustomDesign } from '../api/customDesignService'
import toast from 'react-hot-toast'

const STEP_CONFIG = [
  {
    num: 1,
    title: 'Choose Type',
    subtitle: 'What type of jewelry would you like to create?',
  },
  {
    num: 2,
    title: 'Select Metal',
    subtitle: 'Choose your preferred metal',
  },
  {
    num: 3,
    title: 'Diamond Shape',
    subtitle: 'Select diamond shape',
  },
  {
    num: 4,
    title: 'Carat Size',
    subtitle: 'Choose carat size',
  },
  {
    num: 5,
    title: 'Details',
    subtitle: 'Add extra details',
  },
  {
    num: 6,
    title: 'Review',
    subtitle: 'Review Your Design',
  },
]

const JEWELRY_TYPES = [
  { name: 'Engagement Ring', icon: '💍', description: 'Make it unforgettable', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop' },
  { name: 'Wedding Band', icon: '💒', description: 'Eternity & commitment', image: 'https://images.unsplash.com/photo-1590611936760-eeb6bc40aa21?w=600&h=600&fit=crop' },
  { name: 'Necklace', icon: '📿', description: 'Statement pieces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop' },
  { name: 'Pendant', icon: '💎', description: 'Personal touch', image: 'https://images.unsplash.com/photo-1611652022419-a9410f7433c2?w=600&h=600&fit=crop' },
  { name: 'Earrings', icon: '✨', description: 'Daily elegance', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600&h=600&fit=crop' },
  { name: 'Bracelet', icon: '⌚', description: 'Timeless beauty', image: 'https://images.unsplash.com/photo-1573408301185-914d0f2a0f50?w=600&h=600&fit=crop' },
]

const METAL_TYPES = [
  { name: 'Yellow Gold', color: 'bg-yellow-400', ring: 'bg-yellow-500' },
  { name: 'White Gold', color: 'bg-gray-200', ring: 'bg-gray-300' },
  { name: 'Rose Gold', color: 'bg-pink-300', ring: 'bg-pink-400' },
  { name: 'Platinum', color: 'bg-gray-400', ring: 'bg-gray-500' },
]

const DIAMOND_SHAPES = ['Round', 'Princess', 'Cushion', 'Oval', 'Emerald', 'Marquise', 'Pear', 'Heart', 'Asscher', 'Radiant']

const SHAPE_SYMBOLS = {
  'Round': '○',
  'Princess': '◇',
  'Cushion': '▢',
  'Oval': '⬭',
  'Emerald': '▭',
  'Marquise': '◐',
  'Pear': '◑',
  'Heart': '♥',
  'Asscher': '⬡',
  'Radiant': '◇',
}

const CARAT_SIZES = ['0.5 CT', '0.75 CT', '1.0 CT', '1.5 CT', '2.0 CT', '2.5 CT', '3.0 CT+']

export default function CustomDesign() {
  const { isLoggedIn, requireAuth } = useAuth()

  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState('')
  const [selectedMetal, setSelectedMetal] = useState('')
  const [selectedShape, setSelectedShape] = useState('')
  const [caratSize, setCaratSize] = useState('')
  const [description, setDescription] = useState('')
  const [referenceImage, setReferenceImage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const selectedTypeData = JEWELRY_TYPES.find(t => t.name === selectedType)
  const selectedMetalData = METAL_TYPES.find(m => m.name === selectedMetal)
  const previewImage = selectedTypeData?.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop'

  const canProceed = () => {
    switch (step) {
      case 1: return !!selectedType
      case 2: return !!selectedMetal
      case 3: return !!selectedShape
      case 4: return !!caratSize
      case 5: return true
      case 6: return true
      default: return false
    }
  }

  const handleNext = () => {
    if (canProceed() && step < 6) {
      setStep(step + 1)
    }
  }

  const handleSubmit = () => {
    requireAuth(async () => {
      setSubmitting(true)
      try {
        const result = await submitCustomDesign({
          jewelryType: selectedType,
          metal: selectedMetal,
          diamondShape: selectedShape,
          caratSize,
          description,
          referenceImage: referenceImage || undefined,
        })
        if (result.success) {
          setSubmitted(true)
          setShowSuccess(true)
          toast.success(result.message || 'Design request submitted!')
        } else {
          toast.error(result.message || 'Failed to submit')
        }
      } catch (err) {
        toast.error(err?.message || 'Something went wrong')
      } finally {
        setSubmitting(false)
      }
    })
  }

  const handleReset = () => {
    setStep(1)
    setSelectedType('')
    setSelectedMetal('')
    setSelectedShape('')
    setCaratSize('')
    setDescription('')
    setReferenceImage('')
    setSubmitted(false)
    setShowSuccess(false)
  }

  if (showSuccess) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-gold-600 to-gold-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Design Request Submitted!</h1>
            <p className="text-gold-100 text-lg max-w-2xl mx-auto">
              Thank you! Our expert team will review your custom design and get back to you within 24 hours with a quote.
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">What happens next?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-gold-50 rounded-xl p-4">
                  <div className="w-10 h-10 bg-gold-500 text-white rounded-full flex items-center justify-center font-bold mb-3">1</div>
                  <h3 className="font-semibold mb-2">Review</h3>
                  <p className="text-sm text-gray-600">Our jewelers review your design preferences and requirements.</p>
                </div>
                <div className="bg-gold-50 rounded-xl p-4">
                  <div className="w-10 h-10 bg-gold-500 text-white rounded-full flex items-center justify-center font-bold mb-3">2</div>
                  <h3 className="font-semibold mb-2">Quote</h3>
                  <p className="text-sm text-gray-600">You will receive a detailed quote and estimated timeline.</p>
                </div>
                <div className="bg-gold-50 rounded-xl p-4">
                  <div className="w-10 h-10 bg-gold-500 text-white rounded-full flex items-center justify-center font-bold mb-3">3</div>
                  <h3 className="font-semibold mb-2">Creation</h3>
                  <p className="text-sm text-gray-600">Once approved, our artisans begin crafting your piece.</p>
                </div>
              </div>
            </div>
            <button onClick={handleReset} className="btn-primary">
              Create Another Design
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-gold-600 to-gold-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Diamond className="w-16 h-16 mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Custom Design Your Dream Jewelry</h1>
          <p className="text-gold-100 text-lg max-w-2xl mx-auto">
            Turn your imagination into reality. Create a one-of-a-kind piece that reflects your unique style and personality.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            {/* Progress Steps */}
            <div className="flex justify-between mb-8 overflow-x-auto pb-4">
              {STEP_CONFIG.map((s) => (
                <div key={s.num} className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    step >= s.num
                      ? 'bg-gold-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                  </div>
                  <span className="text-xs mt-2 text-center hidden sm:block">{s.title}</span>
                </div>
              ))}
            </div>

            {/* Step 1: Choose Type */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Palette className="w-6 h-6 text-gold-500" />
                  {STEP_CONFIG[0].subtitle}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {JEWELRY_TYPES.map((type) => (
                    <button
                      key={type.name}
                      onClick={() => setSelectedType(type.name)}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        selectedType === type.name
                          ? 'border-gold-500 bg-gold-50 shadow-md'
                          : 'border-gray-200 hover:border-gold-300 hover:shadow-sm'
                      }`}
                    >
                      <span className="text-4xl mb-3 block">{type.icon}</span>
                      <h3 className="font-semibold text-gray-900">{type.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Metal */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Hammer className="w-6 h-6 text-gold-500" />
                  {STEP_CONFIG[1].subtitle}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {METAL_TYPES.map((metal) => (
                    <button
                      key={metal.name}
                      onClick={() => setSelectedMetal(metal.name)}
                      className={`p-6 rounded-xl border-2 text-center transition-all ${
                        selectedMetal === metal.name
                          ? 'border-gold-500 bg-gold-50 shadow-md'
                          : 'border-gray-200 hover:border-gold-300 hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-14 h-14 mx-auto rounded-full mb-3 ${metal.color} ring-4 ${selectedMetal === metal.name ? metal.ring : 'ring-gray-100'}`} />
                      <h3 className="font-semibold text-gray-900">{metal.name}</h3>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Diamond Shape */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Diamond className="w-6 h-6 text-gold-500" />
                  {STEP_CONFIG[2].subtitle}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {DIAMOND_SHAPES.map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setSelectedShape(shape)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        selectedShape === shape
                          ? 'border-gold-500 bg-gold-50 shadow-md'
                          : 'border-gray-200 hover:border-gold-300 hover:shadow-sm'
                      }`}
                    >
                      <span className="text-3xl text-gold-500 block mb-2">{SHAPE_SYMBOLS[shape] || '⬡'}</span>
                      <span className="font-medium text-gray-700">{shape}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Carat Size */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Diamond className="w-6 h-6 text-gold-500" />
                  {STEP_CONFIG[3].subtitle}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {CARAT_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setCaratSize(size)}
                      className={`p-6 rounded-xl border-2 text-center transition-all ${
                        caratSize === size
                          ? 'border-gold-500 bg-gold-50 shadow-md'
                          : 'border-gray-200 hover:border-gold-300 hover:shadow-sm'
                      }`}
                    >
                      <span className="text-2xl font-bold text-gray-900">{size}</span>
                      <p className="text-xs text-gray-500 mt-1">
                        {size === '0.5 CT' ? 'Subtle elegance' :
                         size === '0.75 CT' ? 'Classic choice' :
                         size === '1.0 CT' ? 'Popular size' :
                         size === '1.5 CT' ? 'Bold statement' :
                         size === '2.0 CT' ? 'Luxurious' :
                         size === '2.5 CT' ? 'Impressive' :
                         'Ultimate luxury'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Additional Details */}
            {step === 5 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-gold-500" />
                  {STEP_CONFIG[4].subtitle}
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe your vision <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell us more about what you're looking for... style preferences, special occasions, inspirations, etc."
                      rows={4}
                      className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reference image URL <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="url"
                      value={referenceImage}
                      onChange={(e) => setReferenceImage(e.target.value)}
                      placeholder="Paste a link to an image that inspires you..."
                      className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                    />
                    {referenceImage && (
                      <div className="mt-3">
                        <img
                          src={referenceImage}
                          alt="Reference"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Review Your Design */}
            {step === 6 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Diamond className="w-6 h-6 text-gold-500" />
                  {STEP_CONFIG[5].subtitle}
                </h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="relative">
                      <div className={`rounded-xl overflow-hidden border-4 ${
                        selectedMetal === 'Yellow Gold' ? 'border-yellow-400' :
                        selectedMetal === 'White Gold' ? 'border-gray-300' :
                        selectedMetal === 'Rose Gold' ? 'border-pink-300' :
                        selectedMetal === 'Platinum' ? 'border-gray-500' :
                        'border-gray-200'
                      }`}>
                        <img
                          src={previewImage}
                          alt={`${selectedType} in ${selectedMetal}`}
                          className="w-full h-80 object-cover"
                        />
                      </div>
                      {/* Badge overlay */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                          {selectedType}
                        </span>
                        <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                          {selectedMetal}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Your Selections:</h3>
                      <ul className="space-y-4">
                        <li className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-gray-600 flex items-center gap-2">
                            <span className="text-lg">💍</span> Jewelry Type
                          </span>
                          <span className="font-semibold text-gray-900">{selectedType}</span>
                        </li>
                        <li className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-gray-600 flex items-center gap-2">
                            <span className={`w-4 h-4 rounded-full inline-block ${
                              selectedMetal === 'Yellow Gold' ? 'bg-yellow-400' :
                              selectedMetal === 'White Gold' ? 'bg-gray-200' :
                              selectedMetal === 'Rose Gold' ? 'bg-pink-300' :
                              'bg-gray-400'
                            }`} />
                            Metal
                          </span>
                          <span className="font-semibold text-gray-900">{selectedMetal}</span>
                        </li>
                        <li className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-gray-600 flex items-center gap-2">
                            <Diamond className="w-4 h-4 text-gold-500" /> Diamond Shape
                          </span>
                          <span className="font-semibold text-gray-900">{selectedShape}</span>
                        </li>
                        <li className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-gray-600 flex items-center gap-2">
                            <span className="text-lg">⚖️</span> Carat Size
                          </span>
                          <span className="font-semibold text-gray-900">{caratSize}</span>
                        </li>
                        {description && (
                          <li className="p-3 bg-white rounded-lg">
                            <span className="text-gray-600 block mb-1 text-sm">Additional Notes</span>
                            <span className="font-medium text-gray-900 text-sm">{description}</span>
                          </li>
                        )}
                      </ul>
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-gray-600 mb-4 text-sm">
                          Our team of expert jewelers will review your design and provide a detailed quote within 24 hours. 
                          A member of our design team may reach out to discuss your vision further.
                        </p>
                        <button
                          onClick={handleSubmit}
                          disabled={submitting || !isLoggedIn()}
                          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? (
                            <>Submitting...</>
                          ) : !isLoggedIn() ? (
                            <>Sign In to Submit Design Request</>
                          ) : (
                            <><Send className="w-4 h-4" /> Submit Design Request</>
                          )}
                        </button>
                        {!isLoggedIn() && (
                          <p className="text-xs text-gray-400 text-center mt-2">
                            You will be prompted to sign in before submitting
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:border-gold-500 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" /> Previous
                </button>
              ) : (
                <div />
              )}
              {step < 6 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="ml-auto btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gradient-to-r from-gold-50 to-gold-100 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Need Help with Your Design?</h3>
            <p className="text-gray-600 mb-6">
              Our expert jewelers are here to help bring your vision to life. Book a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">Book Virtual Appointment</button>
              <button className="btn-secondary">Call +44 7757208197</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
