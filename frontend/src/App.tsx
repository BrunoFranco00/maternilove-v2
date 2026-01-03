import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    setInstallPrompt(null);
    if (outcome === 'accepted') {
      console.log('PWA instalado!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-200 to-secondary-500">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center animate-fade-in-up">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            🎉 MaternLove V2
          </h1>
          <p className="text-xl text-white/90 mb-8 drop-shadow-md">
            Plataforma pronta para desenvolvimento!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="px-8 py-4 bg-white text-primary-500 font-bold rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 transform">
              Começar
            </button>
            <button className="px-8 py-4 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-all duration-300 backdrop-blur-sm">
              Documentação
            </button>
            {installPrompt && (
              <button
                onClick={handleInstallClick}
                className="px-8 py-4 bg-secondary-500 text-white font-bold rounded-lg hover:bg-secondary-600 transition-all duration-300 hover:-translate-y-1 transform"
              >
                📱 Instalar App
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
