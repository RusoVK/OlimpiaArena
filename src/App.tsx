import { useState } from 'react'
import { Navbar, type NavSection } from './components/Navbar'
import { ArenaView } from './views/ArenaView'
import { ProfileView } from './views/ProfileView'
import { MarketView } from './views/MarketView'
import { RankingView } from './views/RankingView'
import { COLORS } from './theme'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('arena')

  const renderView = () => {
    switch (activeSection) {
      case 'arena':
        return <ArenaView />
      case 'profile':
        return <ProfileView />
      case 'market':
        return <MarketView />
      case 'ranking':
        return <RankingView />
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
    </div>
  )
}

export default App
