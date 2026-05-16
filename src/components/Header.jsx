import { Wallet } from 'lucide-react';
import { connectWallet } from '../services/Web3Service';

export default function Header({ wallet, setWallet, setConnecting, disabled }) {
  const handleConnect = async () => {
    setConnecting(true);
    try {
      const data = await connectWallet();
      setWallet(data);
    } catch (err) {
      alert("Failed to connect wallet: " + err.message);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <header className="flex-between glass-panel" style={{ position: 'relative', zIndex: 9999, padding: '20px 32px', marginBottom: '40px', background: 'rgba(5, 8, 20, 0.85)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
      <div className="logo flex-center" style={{ gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #a247ff)', boxShadow: '0 0 15px rgba(71, 126, 255, 0.5)' }}></div>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.5px', color: '#fff', textShadow: '0 0 20px rgba(255, 255, 255, 0.9), 0 0 40px rgba(71, 126, 255, 1), 0 5px 15px rgba(0,0,0,1)' }}>WeatherSphere</h1>
      </div>
      <button 
        className="btn btn-primary float-delayed" 
        onClick={handleConnect} 
        disabled={disabled || wallet !== null}
        style={{ 
          opacity: (disabled || wallet) ? 0.7 : 1,
          padding: '14px 32px', 
          fontSize: '1.15rem', 
          fontWeight: '900', 
          letterSpacing: '0.8px',
          color: '#ffffff',
          boxShadow: '0 0 35px rgba(71, 126, 255, 1), 0 0 65px rgba(162, 71, 255, 1), inset 0 0 20px rgba(255,255,255,0.6)', 
          border: '2px solid rgba(255,255,255,0.9)',
          background: 'linear-gradient(135deg, #477eff, #a247ff)',
          textShadow: '0 0 15px rgba(255,255,255,1), 0 2px 4px rgba(0,0,0,0.8)'
        }}
      >
        <Wallet size={18} />
        {wallet ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 'Connect Wallet'}
      </button>
    </header>
  );
}
