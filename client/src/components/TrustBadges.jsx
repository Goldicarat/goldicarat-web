import { trustBadges } from '../data/products'

export default function TrustBadges() {
  return (
    <section className="bg-gold-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {trustBadges.map((badge, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-white transition-colors duration-300"
            >
              <span className="text-3xl mb-2">{badge.icon}</span>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{badge.title}</h4>
              <p className="text-xs text-gray-500">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
