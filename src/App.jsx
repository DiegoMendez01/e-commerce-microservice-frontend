import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import AccessibilityMenu from './components/AccesibilityMenu/AccessibilityMenu';
import SearchBar from './components/SearchBar/SearchBar';

function App() {
  const handleSearch = (query) => {
    console.log('Buscar:', query);
  };

  return (
    <Router>
      <Navbar />
      <SearchBar onSearch={handleSearch} />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <AccessibilityMenu />
    </Router>
  );
}

export default App