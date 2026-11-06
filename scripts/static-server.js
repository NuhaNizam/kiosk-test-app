// Minimal static file server for local testing (serve-ui, serve-updates).

import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, sep } from 'node:path'

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.yml': 'text/yaml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.exe': 'application/octet-stream',
}

// Hashed asset names never change content; everything else (index.html,
// version.json, latest.yml) must always be fetched fresh.
const cacheControl = (path) =>
  path.includes(`${sep}assets${sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache'

export function serveFolder(root, port) {
  createServer((req, res) => {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    if (path.endsWith('/')) path += 'index.html'
    const file = normalize(join(root, path))
    // Nothing outside the folder (no "..").
    if (!file.startsWith(root + sep) || !existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404).end()
      return
    }
    console.log(`${req.method} ${path}`)
    res.writeHead(200, {
      'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream',
      'Content-Length': statSync(file).size,
      'Cache-Control': cacheControl(file),
    })
    createReadStream(file).pipe(res)
  }).listen(port, () => console.log(`Serving ${root} at http://localhost:${port}/`))
}
