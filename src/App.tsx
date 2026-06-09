import { useState, useEffect } from 'react';
import HomeView from './components/HomeView';
import AdminView from './components/AdminView';
import RoseAnimation from './components/RoseAnimation';
import { AppConfig } from './types';

export default function App() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [view, setView] = useState<'home' | 'admin'>('home');
  const [loading, setLoading] = useState(true);
  const [showInitAnim, setShowInitAnim] = useState(true);

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

  if (showInitAnim) {
    return <RoseAnimation onComplete={() => setShowInitAnim(false)} />;
  }

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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {view === 'home' ? (
        <HomeView config={config} onAdminClick={() => setView('admin')} />
      ) : (
        <AdminView config={config} onSave={fetchConfig} onBack={() => setView('home')} />
      )}
    </div>
  );
}
