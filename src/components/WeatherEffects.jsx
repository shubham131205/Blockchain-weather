import { useEffect, useRef, useState } from 'react';
import '../index.css';

// --- Inline SVG Character Assets for AAA Realism (Shaded, Glowing) ---
const FrogSVG = () => (
  <svg width="80" height="70" viewBox="0 0 100 80" className="idle-breathe frog-character">
    <defs><radialGradient id="frogGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#86efac"/><stop offset="100%" stopColor="#22c55e"/></radialGradient></defs>
    <ellipse cx="50" cy="50" rx="35" ry="25" fill="url(#frogGlow)" />
    <circle cx="35" cy="30" r="12" fill="url(#frogGlow)" />
    <circle cx="65" cy="30" r="12" fill="url(#frogGlow)" />
    <ellipse cx="35" cy="30" rx="4" ry="6" fill="#fff" />
    <ellipse cx="65" cy="30" rx="4" ry="6" fill="#fff" />
    <circle cx="35" cy="30" r="2" fill="#000" className="frog-blink" />
    <circle cx="65" cy="30" r="2" fill="#000" className="frog-blink" />
    <path d="M 40 60 Q 50 65 60 60" stroke="#14532d" strokeWidth="4" strokeLinecap="round" fill="none" />
    <ellipse cx="20" cy="70" rx="15" ry="8" fill="#16a34a" />
    <ellipse cx="80" cy="70" rx="15" ry="8" fill="#16a34a" />
  </svg>
);

const SnowBearSVG = () => (
  <svg width="90" height="150" viewBox="0 0 100 150" className="idle-breathe bear-character">
    <defs><radialGradient id="bearGlow" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#ffffff"/><stop offset="100%" stopColor="#cbd5e1"/></radialGradient></defs>
    <ellipse cx="50" cy="80" rx="40" ry="50" fill="url(#bearGlow)" />
    <circle cx="50" cy="30" r="25" fill="url(#bearGlow)" />
    <circle cx="30" cy="15" r="10" fill="url(#bearGlow)" />
    <circle cx="70" cy="15" r="10" fill="url(#bearGlow)" />
    <ellipse cx="40" cy="25" rx="3" ry="4" fill="#0f172a" />
    <ellipse cx="60" cy="25" rx="3" ry="4" fill="#0f172a" />
    <ellipse cx="50" cy="35" rx="5" ry="3" fill="#020617" />
    <ellipse cx="20" cy="80" rx="12" ry="25" fill="#e2e8f0" transform="rotate(15 20 80)" />
    <ellipse cx="80" cy="80" rx="12" ry="25" fill="#e2e8f0" transform="rotate(-15 80 80)" />
    <ellipse cx="35" cy="140" rx="15" ry="10" fill="#94a3b8" />
    <ellipse cx="65" cy="140" rx="15" ry="10" fill="#94a3b8" />
  </svg>
);

const UmbrellaPersonSVG = () => (
  <svg width="100" height="150" viewBox="0 0 100 150" className="idle-breathe person-character">
    <defs><linearGradient id="umbrellaGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444"/><stop offset="100%" stopColor="#991b1b"/></linearGradient></defs>
    <path d="M 10 50 Q 50 0 90 50 Z" fill="url(#umbrellaGlow)" />
    <rect x="48" y="50" width="4" height="60" fill="#451a03" />
    <path d="M 48 110 Q 48 115 44 115 Q 40 115 40 110" stroke="#451a03" strokeWidth="4" fill="none" />
    <circle cx="65" cy="65" r="12" fill="#fbbf24" />
    <rect x="55" y="75" width="20" height="35" fill="#2563eb" rx="5" />
    <rect x="58" y="110" width="6" height="35" fill="#1e3a8a" />
    <rect x="66" y="110" width="6" height="35" fill="#1e3a8a" />
    <path d="M 55 85 Q 45 95 50 105" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" fill="none" />
  </svg>
);

// Realistic Flapping Bird
const BirdSVG = ({ delay }) => (
  <svg width="40" height="30" viewBox="0 0 50 30" className="bird-fly" style={{ animationDelay: delay }}>
    <g className="bird-wing" style={{ animationDelay: delay }}>
      <path d="M 0 15 Q 12 0 25 8 Q 38 0 50 15 Q 38 10 25 15 Q 12 10 0 15 Z" fill="#0f172a" />
    </g>
  </svg>
);

const TreeSVG = () => (
  <svg width="120" height="180" viewBox="0 0 100 200" className="tree-sway">
    <defs><radialGradient id="treeLeafGlow" cx="20%" cy="20%" r="80%"><stop offset="0%" stopColor="#1e293b"/><stop offset="100%" stopColor="#020617"/></radialGradient></defs>
    <rect x="42" y="120" width="16" height="80" fill="#0f172a" opacity="0.9" />
    <circle cx="50" cy="80" r="45" fill="url(#treeLeafGlow)" opacity="0.85" />
    <circle cx="25" cy="110" r="30" fill="url(#treeLeafGlow)" opacity="0.85" />
    <circle cx="75" cy="110" r="30" fill="url(#treeLeafGlow)" opacity="0.85" />
    <circle cx="50" cy="40" r="35" fill="url(#treeLeafGlow)" opacity="0.85" />
  </svg>
);

// Glowing Moon Character
const MoonSVG = () => (
  <svg width="150" height="150" viewBox="0 0 100 100" className="idle-breathe moon-character">
    <path d="M 60 10 A 40 40 0 1 0 90 60 A 30 30 0 1 1 60 10 Z" fill="#fef08a" />
    <circle cx="45" cy="40" r="6" fill="#ca8a04" opacity="0.15" />
    <circle cx="30" cy="65" r="4" fill="#ca8a04" opacity="0.15" />
    <circle cx="55" cy="75" r="7" fill="#ca8a04" opacity="0.15" />
  </svg>
);

export default function WeatherEffects({ weatherCode, isDay = true }) {
  const canvasRef = useRef(null);
  const [effectType, setEffectType] = useState('none');
  const [isShaking, setIsShaking] = useState(false);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });



  useEffect(() => {
    if ([61, 63, 65, 51, 53, 55, 80, 81, 82].includes(weatherCode)) setEffectType('rain');
    else if ([71, 73, 75, 85, 86].includes(weatherCode)) setEffectType('snow');
    else if ([95, 96, 99].includes(weatherCode)) setEffectType('thunder');
    else if ([3, 45, 48].includes(weatherCode)) setEffectType('clouds');
    else setEffectType('sunny'); // Clear 0, 1, 2
  }, [weatherCode]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Weather Canvas Engine Entities
    let rainDrops = [];
    let ripples = [];
    let snowflakes = [];
    let dust = [];
    let lightnings = [];
    let stars = [];
    let sunRotation = 0;
    
    const initParticles = () => {
      rainDrops = []; ripples = []; snowflakes = []; dust = []; lightnings = []; stars = [];
      
      if (!isDay) {
        // Generate Starry Night
        for (let i = 0; i < 100; i++) {
          stars.push({
            x: Math.random() * canvas.width, 
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5 + 0.5,
            blinkSpeed: Math.random() * 0.05 + 0.01,
            timer: Math.random() * Math.PI * 2
          });
        }
      }

      if (effectType === 'rain' || effectType === 'thunder') {
        for (let i = 0; i < 100; i++) {
          rainDrops.push({
            x: Math.random() * canvas.width, 
            y: Math.random() * canvas.height,
            z: Math.random() * 0.8 + 0.2,
            len: Math.random() * 35 + 20,
            vel: Math.random() * 15 + 10
          });
        }
      } else if (effectType === 'snow') {
        for (let i = 0; i < 150; i++) {
          snowflakes.push({
            x: Math.random() * canvas.width, 
            y: Math.random() * canvas.height,
            size: Math.random() * 4.5 + 1.0,
            z: Math.random() * 0.8 + 0.2, // Spatial Depth
            velX: (Math.random() - 0.5) * 1.5,
            velY: Math.random() * 2 + 1,
            sway: Math.random() * Math.PI * 2
          });
        }
      } else if (effectType === 'sunny' && isDay) {
        for (let i = 0; i < 50; i++) {
          dust.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.1, 
            velX: (Math.random() - 0.5) * 0.8, velY: (Math.random() - 0.5) * 0.8,
            alpha: Math.random() * 0.5 + 0.1
          });
        }
      }
    };
    initParticles();

    // Procedural Lightning Generator
    const createLightning = () => {
      if (Math.random() > 0.02) return; 
      const x = Math.random() * canvas.width;
      const segments = [];
      let currentX = x;
      let currentY = 0;
      
      while (currentY < canvas.height * 0.8) {
        const nextX = currentX + (Math.random() - 0.5) * 80;
        const nextY = currentY + Math.random() * 50 + 20;
        segments.push({ x1: currentX, y1: currentY, x2: nextX, y2: nextY });
        currentX = nextX; currentY = nextY;
      }
      lightnings.push({ segments, life: 1.0 });
      
      // Trigger CSS Shake and Sound
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
    };

    // Main Engine Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const shiftX = 0; // Disabled shaking per user request
      const shiftY = 0;

      ctx.save();
      ctx.translate(-shiftX, -shiftY);

      // Render Stars for Night
      if (!isDay) {
        stars.forEach(s => {
          ctx.beginPath();
          s.timer += s.blinkSpeed;
          const alpha = (Math.sin(s.timer) + 1) / 2 * 0.8 + 0.2; // Blink 0.2 -> 1.0
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      if (effectType === 'thunder') createLightning();

      if (effectType === 'rain' || effectType === 'thunder') {
        // Render Ripples 
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          ctx.beginPath();
          ctx.ellipse(r.x, r.y, r.radius * 2, r.radius, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          r.radius += 1;
          r.alpha -= 0.02;
          if (r.alpha <= 0) ripples.splice(i, 1);
        }

        // Render Rain Drops
        ctx.strokeStyle = effectType === 'thunder' ? 'rgba(200, 220, 255, 0.7)' : 'rgba(255, 255, 255, 0.4)';
        ctx.lineCap = 'round';
        ctx.beginPath();
        rainDrops.forEach(p => {
          ctx.moveTo(p.x, p.y);
          // Angle rain intensely based on wind-shear constant + parallax
          const targetX = p.x - (shiftX * p.z) - 3;
          const targetY = p.y + p.len * p.z;
          ctx.lineTo(targetX, targetY);
          
          p.y += p.vel * p.z;
          p.x -= (shiftX * p.z * 0.1) + 3; // Constant wind shear 
          
          if (p.y > canvas.height - 20) {
            if (Math.random() > 0.5) ripples.push({ x: p.x, y: canvas.height - 10, radius: 1, alpha: 0.5 });
            p.y = -p.len; p.x = Math.random() * canvas.width + 100; // Offset x so it doesn't leave gaps
          }
        });
        ctx.stroke();

        for (let i = lightnings.length - 1; i >= 0; i--) {
          const l = lightnings[i];
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${l.life})`;
          ctx.lineWidth = 3;
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#fff';
          l.segments.forEach(seg => {
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
          });
          ctx.stroke();
          ctx.shadowBlur = 0; 
          l.life -= 0.1;
          if (l.life <= 0) lightnings.splice(i, 1);
        }
        
      } else if (effectType === 'snow') {
        snowflakes.forEach(p => {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${p.z})`; // Realistic Depth Opacity
          ctx.moveTo(p.x, p.y);
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          
          p.y += p.velY * p.z; // Depth-based gravity
          p.sway += 0.02;
          p.x += Math.sin(p.sway) * 0.8 + p.velX - (shiftX * p.z * 0.1); // Sway + Wind + Parallax
          
          if (p.y > canvas.height) {
            p.y = -10; p.x = Math.random() * canvas.width;
          }
          ctx.fill();
        });
        
      } else if (effectType === 'sunny' && isDay) {
        ctx.beginPath();
        dust.forEach(p => {
          ctx.fillStyle = `rgba(255, 230, 150, ${p.alpha})`;
          ctx.moveTo(p.x, p.y);
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          p.x += p.velX; p.y += p.velY;
          if (p.x < 0 || p.x > canvas.width) p.velX *= -1;
          if (p.y < 0 || p.y > canvas.height) p.velY *= -1;
        });

        // Rotating Sun Rays (God Rays)
        ctx.restore(); 
        ctx.save();
        sunRotation += 0.002; 
        const sunX = canvas.width * 0.8;
        const sunY = canvas.height * 0.1;
        
        ctx.beginPath();
        ctx.arc(sunX, sunY, 60, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 210, 80, 0.4)';
        ctx.shadowBlur = 100;
        ctx.shadowColor = '#ffb347';
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.translate(sunX, sunY);
        ctx.rotate(sunRotation);
        for(let i=0; i<16; i++) {
          ctx.rotate((Math.PI * 2) / 16);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(80, Math.max(canvas.width, canvas.height) * 1.5);
          ctx.lineTo(-80, Math.max(canvas.width, canvas.height) * 1.5);
          
          const grad = ctx.createLinearGradient(0, 0, 0, Math.max(canvas.width, canvas.height));
          grad.addColorStop(0, 'rgba(255, 220, 100, 0.08)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      ctx.restore();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [effectType, weatherCode, isDay]);

  const getBackgroundGradient = () => {
    if (!isDay) {
      if (effectType === 'thunder') return 'linear-gradient(to bottom, #050505, #111122, #000)';
      if (effectType === 'snow') return 'linear-gradient(to bottom, #0d1321, #1d273b)';
      return 'linear-gradient(to bottom, #020111, #20124d, #000022)'; // Night Sky Master
    }
    
    switch (effectType) {
      case 'rain': return 'linear-gradient(to bottom, #2c3e50, #000000)';
      case 'snow': return 'linear-gradient(to bottom, #8ba8d6, #d7e1ec)';
      case 'thunder': return 'linear-gradient(to bottom, #111, #222, #000)';
      case 'sunny': return 'linear-gradient(to bottom, #2980b9, #6dd5ed, #ffffff)';
      case 'clouds': return 'linear-gradient(to bottom, #757f9a, #d7dde8)';
      default: return 'transparent';
    }
  };

  return (
    <div className={`weather-effects-container ${isShaking ? 'shake-viewport' : ''}`} style={{ 
      background: getBackgroundGradient(), transition: 'background 2s ease-in-out',
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden'
    }}>
      {/* Dynamic Time-based Overlay to make Morning Bright and Night Dark */}
      <div style={{ position: 'absolute', inset: 0, background: isDay ? (effectType === 'sunny' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)') : 'rgba(0,0,0,0.65)', zIndex: 0, transition: 'background 2s ease' }} />

      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1 }} />
      
      {/* Pixar Overlay Characters */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2 }}>
        
        {/* Night Moon */}
        {!isDay && (
          <div style={{ position: 'absolute', top: '10%', right: '15%', filter: 'drop-shadow(0 0 20px rgba(253, 224, 71, 0.4))' }}>
            <MoonSVG />
          </div>
        )}

        {/* Rain Frog - Standing left most */}
        {(effectType === 'rain' || effectType === 'thunder') && (
          <div style={{ position: 'absolute', bottom: '20px', left: '5%', transform: 'scale(1.5)' }}>
            <FrogSVG />
          </div>
        )}

        {/* Snow Bear - Standing left most */}
        {effectType === 'snow' && (
          <div style={{ position: 'absolute', bottom: '30px', left: '8%', transform: 'scale(1.5)' }}>
            <SnowBearSVG />
          </div>
        )}

        {/* Cloudy Umbrella Person - Standing left most */}
        {effectType === 'clouds' && (
          <div style={{ position: 'absolute', bottom: '20px', left: '8%', transform: 'scale(1.2)' }}>
            <UmbrellaPersonSVG />
          </div>
        )}

        {/* Sunny Morning specifics */}
        {effectType === 'sunny' && (
          <>
            <div style={{ position: 'absolute', bottom: '-20px', left: '5%', transform: 'scale(2.5)', transformOrigin: 'bottom center' }}>
              <TreeSVG />
            </div>
            <div style={{ position: 'absolute', bottom: '-40px', left: '25%', transform: 'scale(1.8)', transformOrigin: 'bottom center', opacity: 0.8 }}>
              <TreeSVG />
            </div>
            
            {/* Flocks of Realistic Flapping Birds ONLY IF DAY */}
            {isDay && (
              <div style={{ position: 'absolute', top: '25%', left: '-5%', animation: 'flyAcross 20s linear infinite' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0 }}><BirdSVG delay="0s" /></div>
                  <div style={{ position: 'absolute', top: '-15px', left: '-30px' }}><BirdSVG delay="0.1s" /></div>
                  <div style={{ position: 'absolute', top: '20px', left: '-40px' }}><BirdSVG delay="0.2s" /></div>
                  <div style={{ position: 'absolute', top: '5px', left: '-60px' }}><BirdSVG delay="0.05s" /></div>
                </div>
              </div>
            )}
          </>
        )}

      </div>
      
      {/* V6 Supernatural Flowing Clouds Overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}>
         <div className="flow-clouds" style={{ animationDelay: '0s', top: '10%' }}></div>
         <div className="flow-clouds" style={{ animationDelay: '-15s', top: '30%', opacity: 0.5, transform: 'scale(1.5)' }}></div>
         <div className="flow-clouds" style={{ animationDelay: '-7s', top: '50%', opacity: 0.3, transform: 'scale(2)' }}></div>
      </div>

      {/* Hyper-Realistic Photorealistic CSS Environmental Particle Arrays */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}>
        {(effectType === 'rain' || effectType === 'thunder') && (
          <div className="rain-container">
            {Array.from({ length: 80 }).map((_, i) => (
              <div key={`rain-${i}`} className={`drop ${Math.random() > 0.8 ? 'heavy' : ''}`} style={{ 
                left: `${Math.random() * 100}vw`, 
                animationDuration: `${Math.random() * 0.8 + 0.6}s`, 
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.5 + 0.3
              }}></div>
            ))}
          </div>
        )}
        
        {effectType === 'snow' && (
          <div className="snow-container">
            {Array.from({ length: 120 }).map((_, i) => (
              <div key={`snow-${i}`} className="flake" style={{ 
                left: `${Math.random() * 100}vw`, 
                animationDuration: `${Math.random() * 5 + 3}s`, 
                animationDelay: `${Math.random() * 5}s`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                opacity: Math.random() * 0.6 + 0.4
              }}></div>
            ))}
          </div>
        )}
      </div>

      {effectType === 'thunder' && <div className="thunder-flash" style={{ zIndex: 3, position: 'absolute', inset: 0, pointerEvents: 'none' }}></div>}
    </div>
  );
}
