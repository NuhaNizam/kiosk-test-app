// Local UI server for testing UI updates on this PC.
//
//   npm run serve-ui
//
// Serves ui/dist/ (the output of `npm run build`) at http://localhost:8081/,
// the UI_URL in app/ui.js. Run `npm run build` again while it's running
// and an idle kiosk switches to the new UI within about a minute.
// For real kiosks, upload ui/dist/ to a web server and change UI_URL.

import { fileURLToPath } from 'node:url'
import { serveFolder } from './static-server.js'

serveFolder(fileURLToPath(new URL('../ui/dist', import.meta.url)), 8081)
