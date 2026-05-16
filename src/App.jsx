import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import WeatherDetailsPage from './pages/WeatherDetailsPage';
import Chatbot from './components/Chatbot';

function App() {
  const [wallet, setWallet] = useState(null);
  const [connecting, setConnecting] = useState(false);

  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header 
          wallet={wallet} 
          setWallet={setWallet} 
          setConnecting={setConnecting} 
          disabled={connecting} 
        />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/weather/:city" element={<WeatherDetailsPage />} />
          </Routes>
        </main>
        
        <Footer />
        <Chatbot />
      </div>
    </Router>
  )
}

export default App
