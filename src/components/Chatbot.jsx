import { useState, useRef, useEffect } from 'react';
import { Bot, X, ChevronRight, Loader2 } from 'lucide-react';
import { geocodeCity, fetchWeather, getWeatherDescription } from '../services/WeatherService';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '🌤️ Welcome to WeatherSphere Engine! What do you want to check today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOptionSelect = async (option) => {
    setMessages(prev => [...prev, { sender: 'user', text: option }]);
    setIsTyping(true);
    setShowOptions(false);

    let reply = '';
    
    // Dynamic Weather Context fetching based on URL
    const getDynamicWeatherContext = async () => {
      try {
        const path = window.location.pathname;
        if (path.startsWith('/weather/')) {
          const city = decodeURIComponent(path.split('/')[2]);
          const location = await geocodeCity(city);
          const data = await fetchWeather(location.latitude, location.longitude);
          return { city, temp: Math.round(data.current.temperature_2m), desc: getWeatherDescription(data.current.weather_code) };
        }
        return null;
      } catch (err) {
        return null;
      }
    };

    const ctx = await getDynamicWeatherContext();

    if (option === '🌡️ Current Weather') {
      reply = ctx ? `Currently in ${ctx.city}, it's ${ctx.temp}°C and ${ctx.desc}.` : `Please search for a city first!`;
    } else if (option === "📅 Today's Forecast") {
      reply = ctx ? `Expect a high of ${ctx.temp + 3}°C later today with continued ${ctx.desc}.` : `Check the 24-Hour Premium Graph on the dashboard!`;
    } else if (option === '📍 Change City') {
      reply = 'Click "Back to Search" and enter a new destination in the global nav-bar.';
    } else if (option === '🌦️ Weather Info') {
      reply = 'I synthesize 7-day extended forecasts, UV Index, and atmospheric humidity streams.';
    } else if (option === '⚠️ Alerts & Safety Tips') {
      reply = 'Keep an eye on the Best Time Predictor grid! Red panels indicate dangerous heat or storms to avoid.';
    } else if (option === '👗 Outfit Suggestions' || option.includes('Outfit')) {
      if (ctx) {
        let outfit = ctx.temp > 25 ? "Light t-shirt, shorts, and sunglasses." : ctx.temp > 15 ? "A light jacket or sweater over a t-shirt." : ctx.temp > 5 ? "A warm coat, long pants, and layers." : "Heavy winter coat, gloves, scarf, and thermal wear.";
        if (ctx.desc.toLowerCase().includes('rain') || ctx.desc.toLowerCase().includes('drizzle')) outfit += " Remember to pack an umbrella or a proper raincoat!";
        reply = `Based on the ${ctx.temp}°C weather, I recommend: ${outfit}`;
      } else {
        reply = 'Search for a city first so I can analyze the thermal conditions for your outfit!';
      }
    } else if (option === '📸 Instagram Ideas') {
      if (ctx) {
        let d = ctx.desc.toLowerCase();
        let caption = d.includes('rain') ? "Dancing in the rain 🌧️✨" : d.includes('snow') ? "Winter wonderland vibes ❄️🧊" : (d.includes('clear') || d.includes('sun')) ? "Chasing the sun today ☀️🌿" : "Lost in the clouds ☁️🩶";
        reply = `Here is a trending aesthetic caption for ${ctx.city}: "${caption}"`;
      } else {
        reply = 'Navigate to a city to get localized aesthetic caption generators!';
      }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="btn hover-float"
        style={{
          position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999,
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #a247ff 0%, #477eff 100%)',
          display: isOpen ? 'none' : 'flex',
          boxShadow: '0 10px 30px rgba(162, 71, 255, 0.4)',
          border: '2px solid rgba(255,255,255,0.2)',
          padding: 0, justifyContent: 'center', alignItems: 'center'
        }}
      >
        <Bot size={32} color="#fff" />
      </button>

      {isOpen && (
        <div className="glass-panel chatbot-panel" style={{
          position: 'fixed', bottom: '30px', right: '30px', zIndex: 10000,
          width: '380px', height: '600px', display: 'flex', flexDirection: 'column',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          animation: 'scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          <div className="flex-between" style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
            <div className="flex-center" style={{ gap: '10px' }}>
              <div style={{ padding: '8px', background: 'linear-gradient(135deg, #a247ff, #477eff)', borderRadius: '12px' }}>
                <Bot size={24} color="#fff" />
              </div>
              <div>
                <strong style={{ fontSize: '1.2rem', display: 'block' }}>WeatherBot</strong>
                <span style={{ fontSize: '0.8rem', color: '#4cd137', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', background: '#4cd137', borderRadius: '50%', display: 'inline-block' }}></span> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '5px' }}><X size={24} /></button>
          </div>

          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                background: msg.sender === 'user' ? 'linear-gradient(135deg, #a247ff, #477eff)' : 'rgba(255,255,255,0.05)',
                padding: '12px 18px',
                borderRadius: '16px',
                borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '16px',
                borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
                maxWidth: '85%',
                fontSize: '0.95rem',
                border: msg.sender === 'bot' ? '1px solid var(--glass-border)' : 'none',
                lineHeight: '1.4'
              }}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '12px 18px', borderRadius: '16px', borderBottomLeftRadius: '4px', border: '1px solid var(--glass-border)' }}>
                 <Loader2 size={16} className="spin" color="#a247ff" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {!showOptions && !isTyping && (
            <div style={{ padding: '15px 20px', textAlign: 'center', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
              <button 
                onClick={() => setShowOptions(true)} 
                className="hover-float"
                style={{ background: 'transparent', color: '#a247ff', border: '1px solid #a247ff', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem', fontWeight: 600 }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(162, 71, 255, 0.1)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                + Ask Another Question
              </button>
            </div>
          )}

          {/* Strict Button-Only Options */}
          {showOptions && (
            <div style={{ padding: '20px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                '🌡️ Current Weather', 
                "📅 Today's Forecast", 
                '👗 Outfit Suggestions', 
                '📍 Change City', 
                '🌦️ Weather Info', 
                '⚠️ Alerts & Safety Tips', 
                '📸 Instagram Ideas'
              ].map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleOptionSelect(opt)}
                  disabled={isTyping}
                  style={{
                    width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', color: '#fff', textAlign: 'left', cursor: isTyping ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    opacity: isTyping ? 0.5 : 1
                  }}
                  onMouseOver={(e) => { if(!isTyping) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' } }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <span>{opt}</span>
                  <ChevronRight size={16} color="var(--text-secondary)" />
                </button>
              ))}
              {/* No Input Field - Button Only! */}
              <div style={{ padding: '15px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', borderTop: '1px solid var(--glass-border)' }}>
                Select an option above to interact.
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
