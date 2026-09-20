// App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const ReturnPolicy = lazy(() => import('./pages/ReturnPolicy'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Product = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Order = lazy(() => import('./pages/Order'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSucess = lazy(() => import('./pages/OrderSucess'));
const Help = lazy(() => import('./pages/Help'));

// Optional: a nicer loading page
function PageLoader() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center">
      <div className="text-center">
        <div
          className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#402b06]"
        />
        <p className="text-[#402b06] font-semibold tracking-wider text-xl">Loading page…</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/return" element={<ReturnPolicy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Product />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Order />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/ordersuccess" element={<OrderSucess />} />
              <Route path="/help" element={<Help />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}