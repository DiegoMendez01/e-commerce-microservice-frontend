import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import AccessibilityMenu from './components/AccessibilityMenu/AccessibilityMenu';
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import { CartProvider } from './providers/CartProvider';
import { LanguageProvider } from './providers/LanguageProvider';

import Home from './pages/Home/Home';
import Sitemap from './pages/Sitemap/Sitemap';
import Category from './pages/Category/Category';
import CategoryFormPage from './pages/CategoryFormPage/CategoryFormPage';
import Product from './pages/Product/Product';
import ProductFormPage from './pages/ProductFormPage/ProductFormPage';
import Customer from './pages/Customer/Customer';
import CustomerFormPage from './pages/CustomerFormPage/CustomerFormPage';
import Cart from './pages/Cart/Cart';
import Order from './pages/Order/Order';

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Router>
          <div className="layout">
            <Header />
            <Navbar />
            <main className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sitemap" element={<Sitemap />} />
                <Route path="/categories" element={<Category />} />
                <Route path="/categories/edit/:id" element={<CategoryFormPage />} />
                <Route path="/categories/create" element={<CategoryFormPage />} />
                <Route path="/products" element={<Product />} />
                <Route path="/products/edit/:id" element={<ProductFormPage />} />
                <Route path="/products/create" element={<ProductFormPage />} />
                <Route path="/customers" element={<Customer />} />
                <Route path="/customers/edit/:id" element={<CustomerFormPage />} />
                <Route path="/customers/create" element={<CustomerFormPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Order />} />
              </Routes>
            </main>
            <AccessibilityMenu />
            <ScrollToTopButton />
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App