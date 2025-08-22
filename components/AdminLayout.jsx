'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiUsers, FiSearch, FiLogOut, FiMenu, FiX, FiBell, FiStar } from 'react-icons/fi';
import Link from 'next/link';

// Mock toast for demo
const toast = {
  error: (msg) => console.log('Error:', msg),
  success: (msg) => console.log('Success:', msg),
};



// Function to decode JWT (for expiration check)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};
const isTokenExpired = (token) => {
  if (!token) return true;
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};
export default function AdminLayout({ children }) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false); // guard state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);




  


  

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
      localStorage.clear();
      toast.error('Session expired or invalid. Please log in.');
      router.replace('/login'); // use replace to prevent back nav
    } else {
      setAuthChecked(true); // allow render only if valid
    }
  }, [router]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    router.replace('/login');
  };

  const navItems = [
    { href: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    { href: '/admin/dashboard/users', icon: FiUsers, label: 'Users' },
    { href: '/admin/dashboard/search', icon: FiSearch, label: 'Search' },
    { href: '/admin/dashboard/reviews', icon: FiStar, label: 'User Reviews' },
  ];

  // ⛔ Don’t render anything until auth check is complete
  if (!authChecked) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-blue-900 text-white relative">
      {/* Navbar + content here */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md transition-shadow ${
          isScrolled ? 'shadow-lg' : ''
        }`}
      >
        <div className="container mx-auto px-2 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <img src="/logo.jpeg" alt="ThekaOnline Logo" className="h-10 w-10 rounded-full" />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-white">ThekaOnline</h1>
              <p className="text-xs text-white">Admin Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-800/50 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 hover:bg-blue-800/50 rounded-lg transition-colors">
              <FiBell className="w-5 h-5" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-blue-800/50 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>
   {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-64 bg-gray-900/90 backdrop-blur-md z-40 lg:hidden"
          >
            <div className="p-4 pt-20 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 p-3 rounded-lg hover:bg-blue-800/50 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile menu + backdrop */}

      <main className="pt-20">{children}</main>
    </div>
  );
}
