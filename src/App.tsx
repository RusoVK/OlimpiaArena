import { useState, useEffect } from 'react'
import { Navbar, type NavSection } from './components/Navbar'
import { LogPanel } from './components/shared'
import { ArenaView } from './views/ArenaView'
import { ArcadeView } from './views/ArcadeView'
import { ProfileView } from './views/ProfileView'
import { MarketViewNew } from './views/MarketViewNew'
import { COLORS } from './theme'
import './App.css'
import { performAutoAuth } from './services/alipayAuth'

function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('arena')

  // ✅ Auto-autenticación al iniciar la app desde super app
  useEffect(() => {
    const autoAuth = async () => {
      try {
        console.log('[App] Intentando auto-autenticación...');
        const session = await performAutoAuth();
        if (session) {
          console.log('[App] ✓ Auto-autenticación exitosa, sesión guardada');
        } else {
          console.log('[App] Auto-autenticación no disponible (esperando interacción del usuario)');
        }
      } catch (error) {
        console.warn('[App] Error en auto-autenticación:', error);
        // No es error crítico, el usuario puede autenticarse manualmente
      }
    };

    autoAuth();
  }, []);

  const renderView = () => {
    switch (activeSection) {
      case 'arena':
        return <ArenaView />
      case 'arcade':
        return <ArcadeView />
      case 'profile':
        return <ProfileView />
      case 'market':
        return <MarketViewNew />
      default:
        return <ArenaView />
    }
  }

  const appContainerStyles: React.CSSProperties = {
    backgroundColor: COLORS.background.abyss,
    minHeight: '100vh',
    width: '100%',
  }

  return (
    <div style={appContainerStyles}>
      {renderView()}
      <Navbar activeSection={activeSection} onNavigate={setActiveSection} />
      <LogPanel />
    </div>
  )
}

export default App
