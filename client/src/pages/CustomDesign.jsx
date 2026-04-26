import { useState } from 'react'
import { Diamond, Palette, Hammer, Check, ArrowRight } from 'lucide-react'

export default function CustomDesign() {
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState('')
  const [selectedMetal, setSelectedMetal] = useState('')
  const [selectedShape, setSelectedShape] = useState('')
  const [caratSize, setCaratSize] = useState('')

  const jewelryTypes = [
    { name: 'Engagement Ring', icon: '💍', description: 'Make it unforgettable' },
    { name: 'Wedding Band', icon: '💒', description: 'Eternity & commitment' },
    { name: 'Necklace', icon: '📿', description: 'Statement pieces' },
    { name: 'Pendant', icon: '💎', description: 'Personal touch' },
    { name: 'Earrings', icon: '✨', description: 'Daily elegance' },
    { name: 'Bracelet', icon: '⌚', description: 'Timeless beauty' },
  ]

  const metalTypes = ['Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum']
  
  const diamondShapes = ['Round', 'Princess', 'Cushion', 'Oval', 'Emerald', 'Marquise', 'Pear', 'Heart', 'Asscher', 'Radiant']
  
  const caratSizes = ['0.5 CT', '0.75 CT', '1.0 CT', '1.5 CT', '2.0 CT', '2.5 CT', '3.0 CT+']

  const steps = [
    { num: 1, title: 'Choose Type' },
    { num: 2, title: 'Select Metal' },
    { num: 3, title: 'Diamond Shape' },
    { num: 4, title: 'Carat Size' },
    { num: 5, title: 'Review' },
  ]

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
            <div className="flex justify-between mb-8 overflow-x-auto pb-4">
              {steps.map((s) => (
                <div key={s.num} className="flex flex-col items-center min-w-[80px]">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
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

            {step === 1 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Palette className="w-6 h-6 text-gold-500" />
                  What type of jewelry would you like to create?
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {jewelryTypes.map((type) => (
                    <button
                      key={type.name}
                      onClick={() => setSelectedType(type.name)}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        selectedType === type.name
                          ? 'border-gold-500 bg-gold-50'
                          : 'border-gray-200 hover:border-gold-300'
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

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Hammer className="w-6 h-6 text-gold-500" />
                  Choose your preferred metal
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {metalTypes.map((metal) => (
                    <button
                      key={metal}
                      onClick={() => setSelectedMetal(metal)}
                      className={`p-6 rounded-xl border-2 text-center transition-all ${
                        selectedMetal === metal
                          ? 'border-gold-500 bg-gold-50'
                          : 'border-gray-200 hover:border-gold-300'
                      }`}
                    >
                      <div className={`w-12 h-12 mx-auto rounded-full mb-3 ${
                        metal === 'Yellow Gold' ? 'bg-yellow-400' :
                        metal === 'White Gold' ? 'bg-gray-200' :
                        metal === 'Rose Gold' ? 'bg-pink-300' :
                        'bg-gray-400'
                      }`}></div>
                      <h3 className="font-semibold text-gray-900">{metal}</h3>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Select diamond shape</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {diamondShapes.map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setSelectedShape(shape)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        selectedShape === shape
                          ? 'border-gold-500 bg-gold-50'
                          : 'border-gray-200 hover:border-gold-300'
                      }`}
                    >
                      <span className="text-3xl text-gold-500 block mb-2">
                        {shape === 'Round' ? '○' :
                         shape === 'Princess' || shape === 'Cushion' || shape === 'Radiant' ? '◇' :
                         shape === 'Heart' ? '♥' :
                         shape === 'Pear' ? '◐' :
                         shape === 'Oval' ? '⬭' :
                         '⬡'}
                      </span>
                      <span className="font-medium text-gray-700">{shape}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Choose carat size</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {caratSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setCaratSize(size)}
                      className={`p-6 rounded-xl border-2 text-center transition-all ${
                        caratSize === size
                          ? 'border-gold-500 bg-gold-50'
                          : 'border-gray-200 hover:border-gold-300'
                      }`}
                    >
                      <span className="text-2xl font-bold text-gray-900">{size}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Review Your Design</h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop" 
                        alt="Your Design"
                        className="w-full rounded-lg"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Your Selections:</h3>
                      <ul className="space-y-3">
                        <li className="flex justify-between">
                          <span className="text-gray-600">Jewelry Type:</span>
                          <span className="font-medium">{selectedType}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Metal:</span>
                          <span className="font-medium">{selectedMetal}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Diamond Shape:</span>
                          <span className="font-medium">{selectedShape}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Carat Size:</span>
                          <span className="font-medium">{caratSize}</span>
                        </li>
                      </ul>
                      <div className="mt-6 pt-6 border-t">
                        <p className="text-gray-600 mb-4">
                          Our team will review your design and provide a quote within 24 hours.
                        </p>
                        <button className="w-full btn-primary">
                          Submit Design Request
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:border-gold-500 transition-colors"
                >
                  Previous
                </button>
              )}
              {step < 5 && (
                <button 
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && !selectedType) ||
                    (step === 2 && !selectedMetal) ||
                    (step === 3 && !selectedShape) ||
                    (step === 4 && !caratSize)
                  }
                  className="ml-auto btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

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
