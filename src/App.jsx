import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import AccessibilityMenu from './components/AccessibilityMenu/AccessibilityMenu';
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton';
import Header from './components/Header/Header';

function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <AccessibilityMenu />
      <ScrollToTopButton />
    </Router>
  );
}

export default App