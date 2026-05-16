import { Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function BestTimePredictor({ hourlyData }) {
  // Analyze next 12 hours specifically
  const upcomingHours = hourlyData.slice(0, 12);
  
  // Logic: Comfortable is between 18 and 26 C with lower humidity
  // Heat is > 26, Chill is < 18 or high humidity
  let bestTime = null;
  let avoidTime = null;

  for (let hour of upcomingHours) {
    if (!bestTime && hour.temp >= 18 && hour.temp <= 26 && hour.humidity < 70) {
      bestTime = hour;
    }
    if (!avoidTime && (hour.temp > 28 || hour.temp < 10 || hour.humidity > 90)) {
      avoidTime = hour;
    }
  }

  // Fallbacks if no extremes found
  if (!bestTime) bestTime = upcomingHours.find(h => h.temp > 15) || upcomingHours[0];
  if (!avoidTime) avoidTime = upcomingHours.find(h => h.humidity > 80) || upcomingHours.length > 5 ? upcomingHours[5] : upcomingHours[1];

  return (
    <div className="glass-panel" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <h3 style={{ margin: 0, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Clock size={18} /> Best Time Predictor
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div style={{ background: 'rgba(46, 213, 115, 0.1)', border: '1px solid rgba(46, 213, 115, 0.3)', padding: '15px', borderRadius: '15px' }}>
          <div className="flex-center" style={{ gap: '8px', color: '#2ed573', marginBottom: '10px' }}>
            <CheckCircle2 size={16} /> <strong>Best Time</strong>
          </div>
          <p style={{ fontSize: '1.4rem', margin: 0, fontWeight: 600 }}>{bestTime.time}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '5px 0 0 0' }}>Comfortable: {bestTime.temp}°C</p>
        </div>

        <div style={{ background: 'rgba(255, 71, 87, 0.1)', border: '1px solid rgba(255, 71, 87, 0.3)', padding: '15px', borderRadius: '15px' }}>
          <div className="flex-center" style={{ gap: '8px', color: '#ff4757', marginBottom: '10px' }}>
            <XCircle size={16} /> <strong>Avoid Time</strong>
          </div>
          <p style={{ fontSize: '1.4rem', margin: 0, fontWeight: 600 }}>{avoidTime.time}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '5px 0 0 0' }}>Poor Conditions</p>
        </div>
      </div>
    </div>
  );
}
