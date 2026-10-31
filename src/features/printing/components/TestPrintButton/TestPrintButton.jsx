import { useEffect, useState } from 'react'
import { Button } from '@/components/common/Button'
import { printPage } from '../../services/printService'
import { PrintPortal } from '../PrintPortal'
import { TestReceipt } from '../TestReceipt'

export function TestPrintButton() {
  const [printedAt, setPrintedAt] = useState(null)

  // Print only after the receipt has rendered into the portal.
  useEffect(() => {
    if (!printedAt) return
    printPage().then(() => setPrintedAt(null))
  }, [printedAt])

  return (
    <>
      <Button variant="ghost" disabled={!!printedAt} onClick={() => setPrintedAt(new Date())}>
        {printedAt ? 'Printing…' : 'Print test page'}
      </Button>

      {printedAt && (
        <PrintPortal>
          <TestReceipt printedAt={printedAt} />
        </PrintPortal>
      )}
    </>
  )
}
