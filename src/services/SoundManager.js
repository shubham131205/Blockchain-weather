// Highly reliable Google Action Sound Library links
const SOUND_MAP = {
  rain: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
  snow: 'https://actions.google.com/sounds/v1/weather/winter_wind.ogg',
  clouds: 'https://actions.google.com/sounds/v1/weather/wind_howling_and_blowing.ogg',
  thunder: 'https://actions.google.com/sounds/v1/weather/rumbling_thunder.ogg',
  clear: 'https://actions.google.com/sounds/v1/ambiences/barn_swallows.ogg'
};

class SoundManager {
  constructor() {
    this.currentAudio = null;
    this.audioCache = {};
    // Check localStorage for mute preference
    this.isMuted = localStorage.getItem('weatherMuted') === 'true';
    this.maxAmbientVolume = 0.4; // 40%
    this.initInteractionHook();
  }

  initInteractionHook() {
    if (this.hooked) return;
    this.hooked = true;
    
    // Aggressive browser autoplay unlock. Retries until successful.
    const unlock = () => {
      // Create a global AudioContext to formally unlock browser media state
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        ctx.resume();
      }

      if (this.currentAudio && !this.isMuted) {
        this.currentAudio.volume = this.maxAmbientVolume;
        const playPromise = this.currentAudio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            // Success! Remove global listener since audio is now officially unlocked
            document.removeEventListener('click', unlock);
            document.removeEventListener('keydown', unlock);
          }).catch(e => {
            console.warn('Click unlock failed, waiting for next interaction:', e);
          });
        }
      } else {
        // If they click before it has loaded, don't remove the listener!
      }
    };
    
    document.addEventListener('click', unlock);
    document.addEventListener('keydown', unlock);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('weatherMuted', this.isMuted);
    
    if (this.currentAudio) {
      if (this.isMuted) {
        this.currentAudio.volume = 0;
        this.currentAudio.pause();
      } else {
        this.currentAudio.volume = this.maxAmbientVolume;
        this.currentAudio.play().catch(e => console.warn('Autoplay blocked'));
      }
    }
    return this.isMuted;
  }

  // Preload and cache HTMLAudioElement
  _getAudio(type) {
    if (!this.audioCache[type]) {
      const url = SOUND_MAP[type];
      if (!url) return null;
      
      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = this.maxAmbientVolume; // Start it immediately at volume (instead of 0)
      this.audioCache[type] = audio;
    }
    return this.audioCache[type];
  }

  async play(weatherCode) {
    let type = 'clear'; // default
    if (weatherCode >= 1 && weatherCode <= 3) type = 'clouds';
    else if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) type = 'rain';
    else if (weatherCode >= 71 && weatherCode <= 77 || weatherCode >= 85 && weatherCode <= 86) type = 'snow';
    else if (weatherCode >= 95 && weatherCode <= 99) type = 'thunder';
    else if (weatherCode === 0) type = 'clear';

    const targetAudio = this._getAudio(type);
    if (!targetAudio) return;

    if (this.currentAudio && this.currentAudio !== targetAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }

    this.currentAudio = targetAudio;
    
    if (!this.isMuted) {
      targetAudio.volume = this.maxAmbientVolume;
      targetAudio.play().catch(err => console.warn('Audio playback blocked by browser policies until interaction.'));
    }
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  playRandomThunder() {
    if (this.isMuted) return;
    const thunderUrls = [
      'https://actions.google.com/sounds/v1/weather/thunder_crack.ogg',
      'https://actions.google.com/sounds/v1/weather/rumbling_thunder.ogg'
    ];
    const url = thunderUrls[Math.floor(Math.random() * thunderUrls.length)];
    const strike = new Audio(url);
    strike.volume = 0.7; // Hard strike
    strike.play().catch(e => console.warn('Thunder overlap blocked by browser'));
  }
}

// Export a singleton instance
export const audioSystem = new SoundManager();
