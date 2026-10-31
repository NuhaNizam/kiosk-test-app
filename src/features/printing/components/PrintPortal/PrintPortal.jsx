import { createPortal } from 'react-dom'
import '../../styles/print.css'

// Renders children outside #root. Hidden on screen; during printing it is
// the only thing on the page (see print.css).
export function PrintPortal({ children }) {
  return createPortal(<div className="print-root">{children}</div>, document.body)
}
