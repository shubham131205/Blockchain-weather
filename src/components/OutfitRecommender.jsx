import { Shirt, Layers, Umbrella, Sun } from 'lucide-react';

export default function OutfitRecommender({ temperature, weatherCode }) {
  // WMO Codes: 61, 63, 65, 51, 53, 55, 95 = Rain/Thunder
  const isRaining = [61, 63, 65, 51, 53, 55, 95].includes(weatherCode);

  let recommendation = {
    icon: <Sun size={32} color="#ffb142" />,
    text: "Comfortable Wear",
    desc: "A great day for standard casual clothes."
  };

  if (isRaining) {
    recommendation = { 
      icon: <Umbrella size={32} color="#477eff" />, 
      text: "Take an Umbrella", 
      desc: "Rain is expected. Don't forget your gear!" 
    };
  } else if (temperature > 30) {
    recommendation = { 
      icon: <Shirt size={32} color="#ff793f" />, 
      text: "Light Clothes", 
      desc: "It's extremely hot. Stay cool and hydrated." 
    };
  } else if (temperature < 20) {
    recommendation = { 
      icon: <Layers size={32} color="#a3bded" />, 
      text: "Wear Layers", 
      desc: "It's quite chilly outside. Bundle up!" 
    };
  }

  return (
    <div className="glass-panel hover-float" style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '20px', transition: 'all 0.3s ease', cursor: 'pointer' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '50%' }}>
        {recommendation.icon}
      </div>
      <div>
        <h4 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: '#fff' }}>{recommendation.text}</h4>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{recommendation.desc}</p>
      </div>
    </div>
  );
}
