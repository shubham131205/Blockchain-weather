import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, CloudRain, Sun, Zap, Wind } from 'lucide-react';

export default function LandingPage() {
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) navigate(`/weather/${encodeURIComponent(city.trim())}`);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '20px' }}>
      
      {/* Background Animated Elements (AAA Aesthetic) */}
      <div style={{ position: 'absolute', top: '5%', left: '10%', animation: 'float 8s ease-in-out infinite' }}>
        <Sun size={180} color="#ffb142" opacity={0.15} style={{ filter: 'blur(4px)' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '15%', right: '5%', animation: 'float-delayed 10s ease-in-out infinite' }}>
        <CloudRain size={220} color="#477eff" opacity={0.1} style={{ filter: 'blur(5px)' }} />
      </div>
      <div style={{ position: 'absolute', top: '35%', right: '20%', animation: 'float 6s ease-in-out infinite' }}>
        <Zap size={100} color="#a247ff" opacity={0.15} style={{ filter: 'blur(3px)' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '10%', left: '15%', animation: 'float-delayed 9s ease-in-out infinite' }}>
        <Wind size={140} color="#4cd137" opacity={0.1} style={{ filter: 'blur(6px)' }} />
      </div>

      <div style={{ textAlign: 'center', zIndex: 10, maxWidth: '850px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
        <div className="glass-panel" style={{ padding: '8px 25px', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(162, 71, 255, 0.15)', border: '1px solid rgba(162, 71, 255, 0.3)', color: '#d9a5ff', animation: 'fadeIn 1s ease-out' }}>
          <Sparkles size={18} />
          <span style={{ fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>AAA Web3 Weather Engine V6</span>
        </div>

        <h1 className="gradient-text" style={{ fontSize: 'clamp(2.5rem, 4.5vw, 4.5rem)', fontWeight: '800', lineHeight: '1.05', letterSpacing: '-2px', textShadow: '0 10px 30px rgba(0,0,0,0.5)', animation: 'float-delayed 8s ease-in-out infinite, fadeIn 1s ease-out 0.2s backwards' }}>
          Experience Weather<br/>Like Never Before.
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: '1.6', animation: 'fadeIn 1s ease-out 0.4s backwards' }}>
          Step into a deeply immersive, hyper-realistic atmosphere. Type your city below to initiate the blockchain-powered simulation.
        </p>

        <form onSubmit={handleSearch} className="glass-panel border-glow" style={{ display: 'flex', alignItems: 'center', padding: '10px 10px 10px 30px', borderRadius: '50px', width: '100%', maxWidth: '650px', gap: '15px', marginTop: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', animation: 'fadeIn 1s ease-out 0.6s backwards', background: 'rgba(10, 15, 30, 0.5)' }}>
          <input 
            type="text" 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search any city globally..." 
            style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '1.4rem' }} 
          />
          <button type="submit" className="hover-float" style={{ background: 'linear-gradient(135deg, #a247ff, #477eff)', border: 'none', color: 'white', cursor: 'pointer', padding: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 25px rgba(162, 71, 255, 0.5)' }}>
            <Search size={28} />
          </button>
        </form>
      </div>
    </div>
  );
}
