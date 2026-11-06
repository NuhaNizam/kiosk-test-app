// Local update server for testing auto-update on this PC.
//
//   npm run serve-updates
//
// Serves release/ (the output of `npm run dist`) at http://localhost:8080/,
// the update URL in package.json "build.publish.url". An installed kiosk
// checks it at startup. For real kiosks, upload the same files (latest.yml
// and the Setup .exe + .blockmap) to a web server and change that URL.

import { fileURLToPath } from 'node:url'
import { serveFolder } from './static-server.js'

serveFolder(fileURLToPath(new URL('../release', import.meta.url)), 8080)
