import { Diamond, Sparkles, Heart, Mail } from 'lucide-react';
import ComingSoonFooter from '../components/ComingSoonFooter';

export default function ComingSoon() {
  return (
    <>
      <title>Goldicarat - Coming Soon</title>
      <meta name="description" content="Goldicarat - Premium Lab Grown Diamond Jewelry. Experience the brilliance of ethically created, stunning diamond jewelry." />
      <meta property="og:title" content="Goldicarat - Coming Soon" />
      <meta property="og:description" content="Premium Lab Grown Diamond Jewelry. Experience the brilliance of ethically created, stunning diamond jewelry." />
      <meta property="og:type" content="website" />
      <meta name="robots" content="index, follow" />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
        <div className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-6 shadow-2xl shadow-yellow-500/30">
                <Diamond className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Goldicarat
            </h1>
            
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <p className="text-xl md:text-2xl text-yellow-400 font-medium">
                Coming Soon
              </p>
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Premium Lab Grown Diamond Jewelry. Experience the brilliance of ethically created, stunning diamond jewelry crafted with precision and care.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Diamond className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Lab Grown Diamonds</h3>
                <p className="text-gray-400 text-sm">Ethically created, certified quality diamonds</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Custom Designs</h3>
                <p className="text-gray-400 text-sm">Create your dream jewelry piece</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Lifetime Warranty</h3>
                <p className="text-gray-400 text-sm">Quality guaranteed forever</p>
              </div>
            </div>
          </div>
        </div>
        <ComingSoonFooter />
      </div>
    </>
  );
}
