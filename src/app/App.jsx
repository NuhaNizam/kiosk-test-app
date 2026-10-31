import { useState } from 'react'
import { KioskLayout } from '@/components/layout/KioskLayout'
import { MenuScreen } from '@/screens/Menu'
import { WelcomeScreen } from '@/screens/Welcome'

const SCREENS = {
  welcome: 'welcome',
  menu: 'menu',
}

function App() {
  const [screen, setScreen] = useState(SCREENS.welcome)

  return (
    <KioskLayout>
      {screen === SCREENS.welcome && <WelcomeScreen onStart={() => setScreen(SCREENS.menu)} />}
      {screen === SCREENS.menu && <MenuScreen onBack={() => setScreen(SCREENS.welcome)} />}
    </KioskLayout>
  )
}

export default App
