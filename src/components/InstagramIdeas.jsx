import { useState, useEffect } from 'react';
import { Camera, RefreshCw } from 'lucide-react';

const WEATHER_IDEAS = {
  rain: [
    "🌧️ Rain slow-motion aesthetic reel",
    "☕ Cozy indoor coffee + rain sounds",
    "🌂 Neon reflections on wet pavement photography"
  ],
  sunny: [
    "☀️ Sunny outfit + fit check",
    "📸 Golden hour portrait session",
    "🍦 Summer aesthetic vlog clips"
  ],
  snow: [
    "❄️ Cozy snow vibes outfit check",
    "🏂 Winter sports action shots",
    "⛄ Building a snowman time-lapse"
  ],
  storm: [
    "🌩️ Storm cinematic dark clouds",
    "⚡ Lightning slow-motion capture",
    "📖 Moody reading by the window vlog"
  ],
  clouds: [
    "☁️ Cloud time-lapse photography",
    "🌆 Moody cityscape aesthetic view",
    "🧥 Trench coat layering fit check"
  ]
};

export default function InstagramIdeas({ weatherCode }) {
  const [currentIdea, setCurrentIdea] = useState("");
  const [effectType, setEffectType] = useState('sunny');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if ([61, 63, 65, 51, 53, 55].includes(weatherCode)) setEffectType('rain');
    else if ([71, 73, 75].includes(weatherCode)) setEffectType('snow');
    else if ([95].includes(weatherCode)) setEffectType('storm');
    else if ([3, 45, 48].includes(weatherCode)) setEffectType('clouds');
    else setEffectType('sunny');
  }, [weatherCode]);

  useEffect(() => {
    shuffleIdea();
    // eslint-disable-next-line
  }, [effectType]);

  const shuffleIdea = () => {
    setIsAnimating(true);
    const ideas = WEATHER_IDEAS[effectType] || WEATHER_IDEAS['sunny'];
    
    setTimeout(() => {
      // Pick random idea that isn't the current one (if possible)
      let nextIdea = currentIdea;
      while (nextIdea === currentIdea && ideas.length > 1) {
        nextIdea = ideas[Math.floor(Math.random() * ideas.length)];
      }
      setCurrentIdea(nextIdea);
      setIsAnimating(false);
    }, 300); // Wait for fade out
  };

  return (
    <div className="glass-panel" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div className="flex-between">
        <h3 style={{ margin: 0, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Camera size={18} /> Social Ideas
        </h3>
        <button 
          onClick={shuffleIdea}
          className="btn" 
          style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem' }}
        >
          <RefreshCw size={14} style={{ animation: isAnimating ? 'spin 1s linear infinite' : 'none' }} />
          More Ideas
        </button>
      </div>

      <div style={{ 
        padding: '20px', 
        background: 'linear-gradient(45deg, rgba(131, 58, 180, 0.1) 0%, rgba(253, 29, 29, 0.1) 50%, rgba(252, 176, 69, 0.1) 100%)',
        borderRadius: '15px',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '80px',
        opacity: isAnimating ? 0 : 1,
        transform: isAnimating ? 'translateY(10px)' : 'translateY(0)',
        transition: 'all 0.3s ease'
      }}>
        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500, textAlign: 'center' }}>
          {currentIdea}
        </p>
      </div>
    </div>
  );
}
