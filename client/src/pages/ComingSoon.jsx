import { Wrench, Clock, Diamond, Mail, Phone, MapPin } from "lucide-react";
import { logo } from "../assets/images";

export default function ComingSoon() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
            <div className="flex-grow flex items-center justify-center px-4 py-16">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-28 h-28 rounded-full overflow-hidden border border-yellow-400/30 shadow-[0_0_30px_rgba(255,215,0,0.2)] bg-gradient-to-br from-gray-900 to-gray-800">
                            <img
                                src={logo}
                                alt="Goldicarat Logo"
                                className="object-contain"
                            />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-6">
                        <Wrench className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-medium">Under Maintenance</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                        We'll Be Back Soon
                    </h1>

                    <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg mx-auto">
                        Our site is currently undergoing scheduled maintenance to serve you better. 
                        We appreciate your patience and will be back with an enhanced experience.
                    </p>

                    <div className="flex items-center justify-center gap-2 mb-12">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-500 text-sm">Estimated downtime: A few hours</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                            <Mail className="w-5 h-5 text-yellow-400 mx-auto mb-3" />
                            <h3 className="text-white text-sm font-semibold mb-1">Email Us</h3>
                            <p className="text-gray-500 text-xs">support@goldicarat.com</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                            <Phone className="w-5 h-5 text-yellow-400 mx-auto mb-3" />
                            <h3 className="text-white text-sm font-semibold mb-1">Call Us</h3>
                            <p className="text-gray-500 text-xs">+91 74340 80899</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                            <Diamond className="w-5 h-5 text-yellow-400 mx-auto mb-3" />
                            <h3 className="text-white text-sm font-semibold mb-1">Follow Us</h3>
                            <p className="text-gray-500 text-xs">@goldicarat</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-6 border-t border-white/5">
                <p className="text-center text-gray-600 text-xs">
                    &copy; {new Date().getFullYear()} Goldicarat. All rights reserved.
                </p>
            </div>
        </div>
    );
}
