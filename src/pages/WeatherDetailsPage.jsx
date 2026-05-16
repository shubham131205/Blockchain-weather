import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { geocodeCity, fetchWeather, getWeatherDescription } from '../services/WeatherService';
import { ArrowLeft, MapPin, Droplets, Wind, Volume2, VolumeX, Sunrise, Sunset, Sun, Hexagon, Database, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import WeatherEffects from '../components/WeatherEffects';
import SoundManager from '../components/SoundManager';import { audioSystem } from '../services/SoundManager';

import OutfitRecommender from '../components/OutfitRecommender';
import BestTimePredictor from '../components/BestTimePredictor';
import InstagramIdeas from '../components/InstagramIdeas';

import { saveWeatherToBlockchain } from '../web3/transactions';

export default function WeatherDetailsPage() {
  const { city } = useParams();
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [locationObj, setLocationObj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  
  // V5 Web3 States
  const [isTransacting, setIsTransacting] = useState(false);
  const [blockchainHash, setBlockchainHash] = useState(null);
  const [dataSource, setDataSource] = useState('live'); // 'live' or 'blockchain'

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const location = await geocodeCity(city);
        setLocationObj(location);
        const data = await fetchWeather(location.latitude, location.longitude);
        setWeatherData(data);
      } catch (err) {
        setError(err.message || 'Failed to load weather');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [city]);

  if (loading) return <div className="flex-center" style={{ flex: 1, fontSize: '2rem' }}>Analyzing atmosphere...</div>;
  if (error) return (
    <div className="flex-center" style={{ flex: 1, flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ color: '#ff4757' }}>{error}</h2>
      <button className="btn btn-primary" onClick={() => navigate('/')}>Return Home</button>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel" style={{ padding: '10px', background: 'rgba(10,15,30,0.9)' }}>
          <p className="label">{`${label}`}</p>
          <p className="intro" style={{ color: payload[0].color }}>{`${payload[0].value}°C`}</p>
        </div>
      );
    }
    return null;
  };

  const toggleSound = () => setIsMuted(prev => !prev);

  const handleSaveToBlockchain = async () => {
    setIsTransacting(true);
    try {
      const desc = getWeatherDescription(weatherData.current.weather_code);
      const receipt = await saveWeatherToBlockchain(locationObj.name, desc);
      setBlockchainHash(receipt.hash);
    } catch (err) {
      console.error(err);
      alert("Failed to save to blockchain.");
    } finally {
      setIsTransacting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', flex: 1, position: 'relative', zIndex: 10 }}>
      {/* V9 Mathematical Synthesizer Background Audio Layer */}
      <SoundManager weatherCode={weatherData.current.weather_code} isNight={weatherData.current.is_day === 0} muted={isMuted} />
      {/* V4 Ultra-Realistic Engine */}
      <WeatherEffects weatherCode={weatherData.current.weather_code} isDay={weatherData.current.is_day !== 0} />

      {/* V5 Transparent Loading Overlay during Tx */}
      {isTransacting && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
           <Loader2 size={80} color="#a247ff" style={{ animation: 'spin 1.5s linear infinite' }} />
           <h2 className="gradient-text" style={{ marginTop: '20px' }}>Mining Transaction...</h2>
           <p style={{ color: 'var(--text-secondary)' }}>Minting weather bytes immutably onto the ledger.</p>
        </div>
      )}
      
      {/* Action Bar */}
      <div className="flex-between">
        <div className="flex-center" style={{ gap: '15px' }}>
          <button className="btn" onClick={() => navigate('/')}>
            <ArrowLeft size={18} /> Back to Search
          </button>
          
          {/* V5 Data Source Toggle */}
          <div className="glass-panel" style={{ padding: '5px', display: 'flex', gap: '5px', borderRadius: '30px', background: 'rgba(0,0,0,0.5)' }}>
            <button 
              onClick={() => setDataSource('live')}
              style={{ padding: '8px 15px', borderRadius: '25px', background: dataSource === 'live' ? 'var(--accent)' : 'transparent', color: '#fff', border: 'none', cursor: 'pointer', transition: 'all 0.3s', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Wind size={14} /> Live API
            </button>
            <button 
              onClick={() => setDataSource('blockchain')}
              style={{ padding: '8px 15px', borderRadius: '25px', background: dataSource === 'blockchain' ? '#a247ff' : 'transparent', color: '#fff', border: 'none', cursor: 'pointer', transition: 'all 0.3s', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Database size={14} /> On-Chain
            </button>
          </div>
        </div>

        <button className="btn" onClick={toggleSound} title="Toggle Audio Effects">
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />} 
          {isMuted ? 'Sound Off' : 'Sound On'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="glass-panel" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
            {/* V5 Smart Contract Glow if On-Chain Mode active */}
            {dataSource === 'blockchain' && <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(162, 71, 255, 0.4) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents:'none' }}></div>}
            
            <div className="flex-between" style={{ alignItems: 'flex-start' }}>
              <div>
                <h2 className="gradient-text" style={{ fontSize: '4.5rem', fontWeight: '700', letterSpacing: '-2px', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  {Math.round(weatherData.current.temperature_2m)}°C
                </h2>
                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '8px', color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '5px' }}>
                  <MapPin size={20} />
                  <span style={{ color: '#fff', textShadow: '0 4px 15px rgba(0,0,0,0.8)' }}>{locationObj.name}, {locationObj.country}</span>
                  {/* Local Time Display */}
                  <span style={{ fontSize: '0.9rem', marginLeft: '10px', padding: '4px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    Local Time: {new Date().toLocaleTimeString('en-US', { timeZone: weatherData.timezone, hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {/* V5 Verified Badge */}
                  {blockchainHash && <ShieldCheck size={18} color="#4cd137" title={`Verified Tx: ${blockchainHash}`} style={{ marginLeft: '5px' }} />}
                </div>
              </div>
              
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
                <p style={{ fontSize: '2.5rem', color: '#fff', fontWeight: '600', margin: 0, textShadow: '0 5px 25px rgba(0,0,0,0.8)' }}>
                  {getWeatherDescription(weatherData.current.weather_code)}
                </p>
                {/* V5 Save to Blockchain Button OR Success Toast */}
                {blockchainHash ? (
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4cd137', background: 'rgba(76, 209, 55, 0.1)', border: '1px solid rgba(76, 209, 55, 0.3)', padding: '8px 15px', borderRadius: '12px', fontSize: '0.9rem', animation: 'fadeIn 0.5s ease' }}>
                     <CheckCircle2 size={16} /> Saved on Blockchain 🌐
                     <span style={{ marginLeft: '10px', padding: '3px 8px', background: 'rgba(255,177,66,0.2)', color: '#ffb142', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>+10 WSC</span>
                   </div>
                ) : (
                   <button 
                     onClick={handleSaveToBlockchain}
                     className="btn hover-float" 
                     style={{ background: 'linear-gradient(135deg, #a247ff, #477eff)', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', boxShadow: '0 5px 20px rgba(162, 71, 255, 0.3)', border: '1px solid rgba(255,255,255,0.2)' }}
                   >
                     <Hexagon size={16} /> Store Immutable Weather
                   </button>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginTop: '40px' }}>
              <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex-between" style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}><span>Humidity</span><Droplets size={20} color="var(--accent)" /></div>
                <div style={{ fontSize: '1.8rem', fontWeight: '600' }}>{weatherData.current.relative_humidity_2m}%</div>
              </div>
              <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex-between" style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}><span>Wind</span><Wind size={20} color="var(--accent)" /></div>
                <div style={{ fontSize: '1.8rem', fontWeight: '600' }}>{weatherData.current.wind_speed_10m} <span style={{fontSize:'1rem'}}>km/h</span></div>
              </div>
              <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex-between" style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}><span>Sunrise</span><Sunrise size={20} color="#ffb142" /></div>
                <div style={{ fontSize: '1.8rem', fontWeight: '600' }}>{weatherData.extendedMetrics.sunrise}</div>
              </div>
              <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex-between" style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}><span>Sunset</span><Sunset size={20} color="#ff793f" /></div>
                <div style={{ fontSize: '1.8rem', fontWeight: '600' }}>{weatherData.extendedMetrics.sunset}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <OutfitRecommender temperature={weatherData.current.temperature_2m} weatherCode={weatherData.current.weather_code} />
            <BestTimePredictor hourlyData={weatherData.formattedHourly} />
          </div>

          <div className="glass-panel" style={{ padding: '30px' }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>24-Hour Premium Graph</h3>
            <div style={{ height: '300px', background: 'rgba(0,0,0,0.1)', padding: '20px 0', borderRadius: '15px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weatherData.formattedHourly} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHourly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4cd137" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#4cd137" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                  <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="temp" stroke="#4cd137" strokeWidth={3} fillOpacity={1} fill="url(#colorHourly)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <InstagramIdeas weatherCode={weatherData.current.weather_code} />

          <div className="glass-panel" style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>7-Day Forecast</h3>
            <div style={{ flex: 1, minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weatherData.formattedDaily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a247ff" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#a247ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="maxTemp" stroke="#a247ff" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex-between" style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
               <div className="flex-center" style={{ gap: '10px' }}><Sun color="#ffb142" size={20}/> <span>Max UV Index:</span></div>
               <strong style={{ fontSize: '1.2rem' }}>{weatherData.extendedMetrics.uvIndex}</strong>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {weatherData.formattedDaily.map((day, i) => (
                <div key={i} className="flex-between" style={{ fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)', width: '40px' }}>{day.date}</span>
                  <span style={{ flex: 1, textAlign: 'center' }}>{getWeatherDescription(day.weatherCode)}</span>
                  <span style={{ fontWeight: '500' }}>{Math.round(day.minTemp)}° / {Math.round(day.maxTemp)}°</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
