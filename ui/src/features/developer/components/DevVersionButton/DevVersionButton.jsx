import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { openDevVersion } from '../../services/devVersion'

export function DevVersionButton() {
  const [opening, setOpening] = useState(false)

  const handleClick = () => {
    setOpening(true)
    openDevVersion()
      .catch((error) => window.alert(`Couldn't open the developer version.\n\n${error.message}`))
      .finally(() => setOpening(false))
  }

  return (
    <Button variant="ghost" disabled={opening} onClick={handleClick}>
      {opening ? 'Opening…' : 'Developer version'}
    </Button>
  )
}
