/**
 * WeatherStore Smart Contract ABI and Address.
 * In a production environment, WEATHER_CONTRACT_ADDRESS would point to Polygon or Sepolia.
 */

export const WEATHER_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x4A7b9b1A8C8F7E4D3E6C5B4A3F2E1D0C9B8A7F6E';

export const WEATHER_CONTRACT_ABI = [
  "function addWeather(string memory city, string memory weather) public",
  "function getLatestWeather(string memory city) public view returns (tuple(string city, string weather, uint timestamp))",
  "event WeatherSaved(string city, string weather, uint timestamp, address user)"
];

/**
 * SOLIDITY CONCEPTUAL CONTRACT (For Reference):
 * 
 * pragma solidity ^0.8.0;
 * 
 * contract WeatherStore {
 *     struct Weather {
 *         string city;
 *         string weather;
 *         uint timestamp;
 *     }
 * 
 *     mapping(string => Weather) public cityWeather;
 *     event WeatherSaved(string city, string weather, uint timestamp, address user);
 * 
 *     function addWeather(string memory city, string memory weatherData) public {
 *         cityWeather[city] = Weather(city, weatherData, block.timestamp);
 *         emit WeatherSaved(city, weatherData, block.timestamp, msg.sender);
 *     }
 * 
 *     function getLatestWeather(string memory city) public view returns (Weather memory) {
 *         return cityWeather[city];
 *     }
 * }
 */
