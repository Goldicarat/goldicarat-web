import { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { isComingSoon } from './data/siteConfig';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import AuthModal from './components/AuthModal';
import ComingSoon from './pages/ComingSoon';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CustomDesign from './pages/CustomDesign';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import { serverUrl } from "../config";
import api from "./api/axiosInstance";

const showComingSoon = isComingSoon();

function App() {
    const [comingSoonView, setComingSoonView] = useState(true);

    const fetchAdminSetting = async () => {
        try {
            const response = await api.get(`${serverUrl}/api/setting/single-details`);

            if (response?.data?.success) {
                setComingSoonView(response.data.setting.comingSoonMode);
            };
        } catch (error) {
            console.error("Error fetching categories:", error);
            setComingSoonView(true);
        };
    };

    useEffect(() => {
        fetchAdminSetting();
    }, []);

    return (
        <AuthProvider>
            <CartProvider>
                <WishlistProvider>
                    <Router>
                        <div className="min-h-screen flex flex-col">
                            {comingSoonView ? (
                                <ComingSoon />
                            ) : (
                                <>
                                    <Header />
                                    <CartDrawer />
                                    <WishlistDrawer />
                                    <AuthModal />
                                    <main className="flex-grow">
                                        <Routes>
                                            <Route path="/" element={<Home />} />
                                            <Route path="/shop" element={<Shop />} />
                                            <Route path="/product/:id" element={<ProductDetail />} />
                                            <Route path="/custom-design" element={<CustomDesign />} />
                                            <Route path="/about" element={<About />} />
                                            <Route path="/blog" element={<Blog />} />
                                            <Route path="/contact" element={<Contact />} />
                                        </Routes>
                                    </main>
                                    <Footer />
                                </>
                            )}
                        </div>
                    </Router>
                </WishlistProvider>
            </CartProvider>
        </AuthProvider>
    )
}

export default App
