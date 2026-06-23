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
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import CustomDesign from './pages/CustomDesign';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Account from './pages/Account';
import MyOrders from './pages/MyOrders';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DynamicPage from './pages/DynamicPage';
import FAQ from './pages/FAQ';
import { serverUrl } from "../config";
import api from "./api/axiosInstance";

const showComingSoon = isComingSoon();

function App() {
    const [comingSoonView, setComingSoonView] = useState(false);

    const fetchAdminSetting = async () => {
        try {
            const response = await api.get(`${serverUrl}/api/setting/single-details`);

            if (response?.data?.success) {
                setComingSoonView(response.data.setting.comingSoonMode || false);
            } else {
                setComingSoonView(false);
            };
        } catch (error) {
            console.error("Error fetching categories:", error);
            setComingSoonView(false);
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
                                            <Route path="/cart" element={<Cart />} />
                                            <Route path="/checkout" element={<Checkout />} />
                                            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                                            <Route path="/custom-design" element={<CustomDesign />} />
                                            <Route path="/about" element={<About />} />
                                            <Route path="/blog" element={<Blog />} />
                                            <Route path="/contact" element={<Contact />} />
                                            <Route path="/account" element={<Account />} />
                                            <Route path="/my-orders" element={<MyOrders />} />
                                            <Route path="/login" element={<Login />} />
                                            <Route path="/forgot-password" element={<ForgotPassword />} />
                                            <Route path="/reset-password/:token" element={<ResetPassword />} />
                                            <Route path="/faq" element={<FAQ />} />
                                            <Route path="/page/:slug" element={<DynamicPage />} />
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
