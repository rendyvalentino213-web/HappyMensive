import { useState, useEffect } from 'react';
import HomeView from './components/HomeView';
import AdminView from './components/AdminView';
import GiftAnimation from './components/GiftAnimation';
import PinScreen from './components/PinScreen';
import { AppConfig } from './types';
import { getDirectImageUrl } from './utils';

export default function App() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [view, setView] = useState<'home' | 'admin'>('home');
  const [loading, setLoading] = useState(true);
  const [showInitAnim, setShowInitAnim] = useState(false);
  const [showPin, setShowPin] = useState(true);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      setConfig(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-rose-500">
        <p className="text-xl animate-pulse">Loading memories...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-red-500">
        <p className="text-xl">Failed to load configuration.</p>
      </div>
    );
  }

  const hasBg = !!config?.backgroundImage;

  return (
    <div className={hasBg ? "min-h-screen relative z-0" : "min-h-screen bg-zinc-950 text-zinc-100 font-sans"}>
      {hasBg && (
        <div 
          className="fixed inset-0 z-[-2] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${getDirectImageUrl(config.backgroundImage!)})` }}
        />
      )}
      {hasBg && (
        <div className="fixed inset-0 z-[-1] bg-zinc-950/85 backdrop-blur-[2px] pointer-events-none" />
      )}
      <div className="relative z-10 w-full h-full text-zinc-100 font-sans">
        {showPin ? (
          <PinScreen onComplete={() => { setShowPin(false); setShowInitAnim(true); }} />
        ) : showInitAnim ? (
          <GiftAnimation onComplete={() => setShowInitAnim(false)} />
        ) : view === 'home' ? (
          <HomeView config={config!} onAdminClick={() => setView('admin')} />
        ) : (
          <AdminView config={config!} onSave={fetchConfig} onBack={() => setView('home')} />
        )}
      </div>
    </div>
  );
}
