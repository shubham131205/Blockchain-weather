import { useEffect, useRef } from "react";

export function getWeatherCategory(weatherCode) {
  if ([61, 63, 65, 51, 53, 55, 80, 81, 82].includes(weatherCode)) return 'rainy';
  if ([71, 73, 75, 85, 86].includes(weatherCode)) return 'snowy';
  if ([95, 96, 99].includes(weatherCode)) return 'thunderstorm';
  if ([3, 45, 48].includes(weatherCode)) return 'cloudy';
  if ([0, 1, 2].includes(weatherCode)) return 'sunny';
  return 'default';
}

class SynthEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.noiseBuffer = null;
    this.activeNodes = new Map();
    this.currentType = "none";
    this.wasNight = false;
    this.volume = 0.5;
    this.muted = true;
    this.activeThunderInterval = 0;

    // Hyper-aggressive omnipresent unlocking daemon. Bypasses all React event blockages.
    const unlockDaemon = () => {
      try {
        if (this.ctx && this.ctx.state === "suspended") {
          this.ctx.resume();
        }
      } catch (e) {}
    };
    if (typeof window !== "undefined") {
      window.addEventListener('click', unlockDaemon, { capture: true, passive: true });
      window.addEventListener('keydown', unlockDaemon, { capture: true, passive: true });
      window.addEventListener('touchstart', unlockDaemon, { capture: true, passive: true });
    }
  }

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0 : this.volume;
      this.masterGain.connect(this.ctx.destination);

      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Compensate gain
      }
      this.noiseBuffer = buffer;
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  fadeNode(gainNode, target, time = 1.5) {
    if (!this.ctx) return;
    gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
    gainNode.gain.setTargetAtTime(target, this.ctx.currentTime, time / 3);
  }

  playNoise(id, filterFreq, q, type, targetVol) {
    if (!this.ctx || !this.noiseBuffer || !this.masterGain) return;
    if (this.activeNodes.has(id)) {
      const node = this.activeNodes.get(id);
      this.fadeNode(node.gain, targetVol);
      return;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = filterFreq;
    filter.Q.value = q;

    const gain = this.ctx.createGain();
    gain.gain.value = 0;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start();
    this.fadeNode(gain, targetVol);
    this.activeNodes.set(id, { source, gain });
  }

  addBirds(id) {
    if (!this.ctx || !this.masterGain) return;
    if (this.activeNodes.has(id)) {
      const node = this.activeNodes.get(id);
      this.fadeNode(node.gain, 0.4);
      return;
    }

    const birdMixGain = this.ctx.createGain();
    birdMixGain.gain.value = 0;
    birdMixGain.connect(this.masterGain);

    const startBird = () => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(2000 + Math.random() * 1000, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(3000 + Math.random() * 2000, this.ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.7, this.ctx.currentTime + 0.05); // Boosted from 0.3
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(birdMixGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    };
    
    const interval = window.setInterval(() => {
      if (Math.random() > 0.35) startBird();
    }, 2000);

    this.fadeNode(birdMixGain, 0.85); // Boosted from 0.4
    this.activeNodes.set(id, { source: null, gain: birdMixGain, interval });
  }

  addFrogs(id) {
    if (!this.ctx || !this.masterGain) return;
    if (this.activeNodes.has(id)) {
      const node = this.activeNodes.get(id);
      this.fadeNode(node.gain, 0.3);
      return;
    }

    const frogMixGain = this.ctx.createGain();
    frogMixGain.gain.value = 0;
    frogMixGain.connect(this.masterGain);

    const startFrog = () => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(70 + Math.random() * 20, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40 + Math.random() * 10, this.ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.8, this.ctx.currentTime + 0.05); // Boosted
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(frogMixGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    };
    
    const interval = window.setInterval(() => {
      if (Math.random() > 0.35) startFrog();
    }, 2800);

    this.fadeNode(frogMixGain, 0.7); // Boosted
    this.activeNodes.set(id, { source: null, gain: frogMixGain, interval });
  }

  addPad(id, isNight, type) {
    if (!this.ctx || !this.masterGain) return;
    if (this.activeNodes.has(id)) {
      this.fadeNode(this.activeNodes.get(id).gain, 0.3);
      return;
    }
    const mixGain = this.ctx.createGain();
    mixGain.gain.value = 0;
    mixGain.connect(this.masterGain);

    let freqs;
    if (isNight) {
      freqs = [220, 329.63, 440, 587.33]; // A minor/mystical
    } else if (type === "snowy") {
      freqs = [523.25, 659.25, 783.99, 1046.50]; // High crystal C Major
    } else if (type === "cloudy") {
      freqs = [196.00, 233.08, 293.66, 392.00]; // G minor/Somber
    } else {
      freqs = [261.63, 329.63, 392.00, 523.25]; // C Major/Uplifting
    }
    
    const playChime = () => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freqs[Math.floor(Math.random() * freqs.length)];
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 2); // Boosted from 0.08
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 6);
      osc.connect(gain);
      gain.connect(mixGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 6);
    };

    const interval = window.setInterval(() => {
        if (Math.random() > 0.3) playChime(); 
    }, 3500);
    playChime(); // Initial chime

    this.fadeNode(mixGain, 0.75); // Boosted from 0.4
    this.activeNodes.set(id, { source: null, gain: mixGain, interval });
  }

  triggerThunder() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
    }
    
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(100, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 3);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(4.5, this.ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 3.8);
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start();
  }

  stopNode(id) {
    const node = this.activeNodes.get(id);
    if (!node || !this.ctx) return;
    this.fadeNode(node.gain, 0, 1.0);
    setTimeout(() => {
      if (node.source) {
        try { node.source.stop(); } catch(e){}
        node.source.disconnect();
      }
      if (node.interval) window.clearInterval(node.interval);
      node.gain.disconnect();
    }, 1500);
    this.activeNodes.delete(id);
  }

  applyWeather(type, isNight = false) {
    this.init();
    if (this.currentType === type && this.wasNight === isNight && this.ctx) return;
    
    window.clearInterval(this.activeThunderInterval);

    const needed = new Set();

    if (type === "rainy" || type === "thunderstorm") {
      needed.add("heavyWind"); needed.add("heavyRain");
      if (type === "thunderstorm") {
        this.activeThunderInterval = window.setInterval(() => this.triggerThunder(), 6000 + Math.random() * 4000);
      }
      if (type === "rainy") needed.add("frogs");
    } else if (type === "snowy") {
      needed.add("softWind");
      needed.add("pad_snowy"); // ambient sound
    } else if (type === "cloudy") {
      needed.add("softWind");
      needed.add("pad_cloudy"); // ambient sound
    } else if (type === "sunny") {
      needed.add("softWind");
      needed.add("pad_sunny"); // ambient sound
      if (!isNight) needed.add("birds");
      else needed.add("frogs"); // cranky night frogs instead of birds
    } else {
      needed.add("pad_sunny"); // default pleasant sound
    }

    if (type === "none") {
      needed.clear();
    }

    // Stop unneeded
    for (const [id] of this.activeNodes.entries()) {
      if (!needed.has(id)) this.stopNode(id);
    }

    // Play needed -- Boosting softWind and pads so normal weather is highly audible
    if (needed.has("heavyWind")) this.playNoise("heavyWind", 600, 1, "bandpass", 0.9);
    if (needed.has("softWind")) this.playNoise("softWind", 400, 0.5, "bandpass", 0.7); // Boosted from 0.25
    if (needed.has("heavyRain")) this.playNoise("heavyRain", 1500, 0.5, "lowpass", 0.9);
    if (needed.has("birds")) this.addBirds("birds");
    if (needed.has("frogs")) this.addFrogs("frogs");
    if (needed.has("pad_snowy")) this.addPad("pad_snowy", isNight, "snowy");
    if (needed.has("pad_cloudy")) this.addPad("pad_cloudy", isNight, "cloudy");
    if (needed.has("pad_sunny")) this.addPad("pad_sunny", isNight, "sunny");

    this.currentType = type;
    this.wasNight = isNight;
  }

  toggleMute(mute) {
    this.muted = mute;
    if (this.ctx && this.masterGain) {
      if (!mute && this.ctx.state === "suspended") this.ctx.resume();
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(mute ? 0 : this.volume, this.ctx.currentTime, 0.1);
    }
    if (!mute && this.currentType !== "none") {
      this.init();
      this.applyWeather(this.currentType, this.wasNight); // Re-apply to ensure nodes are built
    }
  }

  stopAll() {
    for (const [id] of this.activeNodes.entries()) this.stopNode(id);
    window.clearInterval(this.activeThunderInterval);
  }
}

export default function SoundManager({ weatherCode, isNight, muted }) {
  const currentWeather = getWeatherCategory(weatherCode);
  const engineRef = useRef(null);

  useEffect(() => {
    if (!engineRef.current) engineRef.current = new SynthEngine();
    const engine = engineRef.current;
    
    // Auto-resume context on click if unmuted
    const handleInteraction = () => {
      if (!muted) engine.toggleMute(false);
      window.removeEventListener("click", handleInteraction);
    };
    window.addEventListener("click", handleInteraction);

    engine.toggleMute(muted);
    engine.applyWeather(currentWeather, isNight);
    
    return () => {
      window.removeEventListener("click", handleInteraction);
    };
  }, [currentWeather, isNight, muted]);

  useEffect(() => {
    return () => engineRef.current?.stopAll();
  }, []);

  return null;
}
