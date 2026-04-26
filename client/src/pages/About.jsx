import { Diamond, Leaf, Award, Users, Heart } from 'lucide-react'

export default function About() {
  const values = [
    {
      icon: <Diamond className="w-8 h-8" />,
      title: 'Exceptional Quality',
      description: 'Every piece is crafted with precision using the finest materials and ethically sourced lab-grown diamonds.'
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Sustainable Luxury',
      description: 'Our lab-grown diamonds are ethically created with minimal environmental impact, providing conscious luxury.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Expert Craftsmanship',
      description: 'Our master jewelers combine traditional techniques with modern innovation to create timeless pieces.'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Customer First',
      description: 'We are committed to your satisfaction with 15-day exchanges, free engraving, and lifetime warranties.'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '15,000+', label: 'Diamonds Certified' },
    { number: '50+', label: 'Unique Designs' },
    { number: '100%', label: 'Ethically Sourced' }
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="relative bg-gradient-to-br from-gold-600 to-gold-500 text-white py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gold-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-400 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <Diamond className="w-16 h-16 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">About Goldicarat Jewels</h1>
          <p className="text-xl text-gold-100 max-w-3xl mx-auto">
            Where timeless elegance meets modern innovation. We craft extraordinary jewelry that tells your unique story.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-gold-100 text-gold-700 rounded-full text-sm font-medium mb-6">
                Our Story
              </span>
              <h2 className="section-title mb-6">Crafting Dreams Since 2010</h2>
              <p className="text-gray-600 mb-6">
                Goldicarat Jewels was born from a passion for creating extraordinary jewelry that combines 
                traditional craftsmanship with modern innovation. Founded in Hatton Garden, London's 
                historic jewelry district, we have been serving discerning customers who seek the perfect 
                blend of quality, ethics, and beauty.
              </p>
              <p className="text-gray-600 mb-6">
                Our journey began with a simple vision: to make stunning diamond jewelry accessible 
                without compromising on quality or ethics. Today, we specialize in lab-grown diamonds 
                that offer the same brilliance as mined diamonds while being kinder to our planet.
              </p>
              <p className="text-gray-600">
                Every piece that leaves our workshop carries the hallmark of our commitment to excellence, 
                from the initial design to the final polish. We believe that jewelry is more than an 
                accessory—it's a symbol of love, celebration, and milestones that deserve to be treasured forever.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&h=700&fit=crop"
                alt="Our Workshop"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <p className="text-4xl font-bold text-gold-500">15+</p>
                <p className="text-gray-600">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-gold-500 mb-2">{stat.number}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Values</h2>
            <p className="text-gray-600 mt-2">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 mx-auto mb-4 bg-gold-100 rounded-full flex items-center justify-center text-gold-500">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-gold-600 to-gold-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Our Bespoke Service</h2>
              <p className="text-lg text-gold-100 mb-6">
                Turn your imagination into reality with our custom design service. Whether it's an 
                engagement ring, anniversary piece, or a completely unique creation, our expert 
                jewelers will work closely with you to bring your vision to life.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Diamond className="w-4 h-4" />
                  </div>
                  <span>Personal consultation with our design experts</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Diamond className="w-4 h-4" />
                  </div>
                  <span>3D renderings of your design before production</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Diamond className="w-4 h-4" />
                  </div>
                  <span>Handcrafted to perfection in our London workshop</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Diamond className="w-4 h-4" />
                  </div>
                  <span>Lifetime warranty on all bespoke pieces</span>
                </li>
              </ul>
              <button className="bg-white text-gold-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Your Custom Design
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop" alt="Custom Ring" className="rounded-xl" />
              <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop" alt="Custom Necklace" className="rounded-xl mt-8" />
              <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop" alt="Custom Earrings" className="rounded-xl" />
              <img src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&h=300&fit=crop" alt="Custom Ring" className="rounded-xl mt-8" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Team</h2>
            <p className="text-gray-600 mt-2">Meet the passionate people behind our beautiful jewelry</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Rajesh Patel', role: 'Founder & Master Jeweler', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop' },
              { name: 'Priya Sharma', role: 'Head of Design', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop' },
              { name: 'Amit Kumar', role: 'Diamond Expert', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop' },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <img src={member.image} alt={member.name} className="w-48 h-48 mx-auto rounded-full object-cover mb-4" />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gold-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
