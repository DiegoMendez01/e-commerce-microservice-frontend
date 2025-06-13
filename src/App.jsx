import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import AccessibilityMenu from './components/AccessibilityMenu/AccessibilityMenu';
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton';
import Header from './components/Header/Header';
import { LanguageProvider } from './providers/LanguageProvider';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="layout"> {/* layout principal */}
          <Header />
          <Navbar />
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Otras rutas aquí */}
            </Routes>
          </main>
          <AccessibilityMenu />
          <ScrollToTopButton />
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App