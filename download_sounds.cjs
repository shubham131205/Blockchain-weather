const https = require('https');
const fs = require('fs');
const path = require('path');

const sounds = {
  rain: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Rain_on_a_tin_roof.ogg',
  snow: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Winter_Wind.ogg',
  clouds: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Wind_in_trees.ogg',
  thunder: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Thunderstorm%2C_Texas.ogg',
  clear: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Birds_in_spring.ogg',
  thunder_strike1: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Thunderstorm%2C_Texas.ogg',
  thunder_strike2: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Thunder_crack.ogg'
};

const dir = path.join(__dirname, 'public', 'sounds');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

Object.entries(sounds).forEach(async ([name, url]) => {
  const dest = path.join(dir, `${name}.ogg`);
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) WeatherApp/1.0' } }, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      https.get(res.headers.location, (redirectRes) => {
        redirectRes.pipe(fs.createWriteStream(dest));
      });
    } else {
      res.pipe(fs.createWriteStream(dest));
    }
  }).on('error', err => console.error(err));
});

console.log('Downloading sounds to public/sounds/...');
