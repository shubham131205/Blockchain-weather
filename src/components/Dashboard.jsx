import { useState } from 'react';
import { Search, MapPin, Droplets, Wind, CloudFog } from 'lucide-react';
import { geocodeCity, fetchWeather, getWeatherDescription } from '../services/WeatherService';

export default function Dashboard() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [locationName, setLocationName] = useState('Search a city...');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    
    setLoading(true);
    try {
      const location = await geocodeCity(city);
      setLocationName(location.fullName);
      
      const weather = await fetchWeather(location.latitude, location.longitude);
      setWeatherData(weather);
    } catch (err) {
      setLocationName(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="glass-panel float" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px', flex: 1 }}>
      
      <form onSubmit={handleSearch} className="flex-between" style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 20px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
        <input 
          type="text" 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city to explore..." 
          style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '1.2rem' }} 
        />
        <button type="submit" style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>
          <Search size={24} />
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: '700', letterSpacing: '-1px' }}>
          {weatherData ? `${Math.round(weatherData.current.temperature_2m)}°C` : '--°C'}
        </h2>
        <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '8px', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          <MapPin size={20} />
          <span>{locationName}</span>
        </div>
        <p style={{ fontSize: '1.5rem', color: '#fff', marginTop: '10px' }}>
          {weatherData ? getWeatherDescription(weatherData.current.weather_code) : 'Awaiting location data...'}
        </p>
      </div>

      {weatherData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: 'auto' }}>
          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex-between" style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>
              <span>Humidity</span>
              <Droplets size={20} color="var(--accent)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '600' }}>{weatherData.current.relative_humidity_2m}%</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex-between" style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>
              <span>Wind Speed</span>
              <Wind size={20} color="var(--accent)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '600' }}>{weatherData.current.wind_speed_10m} km/h</div>
          </div>
        </div>
      )}
    </section>
  );
}
