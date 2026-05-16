const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODE_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export const geocodeCity = async (cityName) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data || data.length === 0) {
    throw new Error('City not found. Please try a different location.');
  }
  
  const bestResult = data[0];
  
  return { 
    latitude: parseFloat(bestResult.lat), 
    longitude: parseFloat(bestResult.lon), 
    name: bestResult.name,
    fullName: bestResult.display_name 
  };
};

export const fetchWeather = async (lat, lon) => {
  // Fetch current, daily, and hourly weather with newly expanded V3 metrics
  const url = `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day&hourly=temperature_2m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  // Format hourly data for the next 24 hours
  const currentHourIndex = data.hourly.time.findIndex(t => new Date(t) >= new Date());
  const startIndex = currentHourIndex !== -1 ? currentHourIndex : 0;
  
  const hourlyData = data.hourly.time.slice(startIndex, startIndex + 24).map((time, index) => ({
    time: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: data.hourly.temperature_2m[startIndex + index],
    humidity: data.hourly.relative_humidity_2m[startIndex + index]
  }));

  const dailyData = data.daily.time.slice(0, 7).map((time, index) => ({
    date: new Date(time).toLocaleDateString([], { weekday: 'short' }),
    maxTemp: data.daily.temperature_2m_max[index],
    minTemp: data.daily.temperature_2m_min[index],
    weatherCode: data.daily.weather_code[index]
  }));

  // Create an extended object for easy UI mapping
  const extendedMetrics = {
    sunrise: new Date(data.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sunset: new Date(data.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    uvIndex: Math.round(data.daily.uv_index_max[0]),
    isDay: data.current.is_day
  };

  return { ...data, formattedHourly: hourlyData, formattedDaily: dailyData, extendedMetrics };
};

// Weather code mappings per WMO standard
export const getWeatherDescription = (code) => {
  const map = {
    0: 'Clear sky',
    1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Light rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Light snow', 73: 'Moderate snow', 75: 'Heavy snow',
    95: 'Thunderstorm'
  };
  return map[code] || 'Unknown';
};
