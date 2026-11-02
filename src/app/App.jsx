import { useState } from 'react'
import { KioskLayout } from '@/components/layout/KioskLayout'
import { setFullScreen } from '@/features/display'
import { MenuScreen } from '@/screens/Menu'
import { WelcomeScreen } from '@/screens/Welcome'

const SCREENS = {
  welcome: 'welcome',
  menu: 'menu',
}

function App() {
  const [screen, setScreen] = useState(SCREENS.welcome)

  // The Welcome screen shows in a normal window; every other screen is
  // full screen. Called from the tap itself, which browsers require.
  const goTo = (next) => {
    setScreen(next)
    setFullScreen(next !== SCREENS.welcome)
  }

  return (
    <KioskLayout>
      {screen === SCREENS.welcome && <WelcomeScreen onStart={() => goTo(SCREENS.menu)} />}
      {screen === SCREENS.menu && <MenuScreen onBack={() => goTo(SCREENS.welcome)} />}
    </KioskLayout>
  )
}

export default App
