// Opens the app in Electron, which prints receipts silently. Starts the dev
// server first (if needed) unless --prod is passed. Arguments are passed on.
//
//   npm run electron           Welcome in a normal window, then full screen
//                              (exit with Alt+F4)
//   npm run electron:window    always a normal window
//   npm run electron:prod      builds, then loads dist/ (no dev server)

import { spawn, spawnSync } from 'node:child_process'
import electronPath from 'electron'

const DEV_URL = 'http://localhost:5173'
const args = process.argv.slice(2)

async function isServerUp() {
  try {
    await fetch(DEV_URL)
    return true
  } catch {
    return false
  }
}

async function waitForServer(timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs
  while (!(await isServerUp())) {
    if (Date.now() > deadline) throw new Error(`Dev server did not respond at ${DEV_URL}`)
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}

// Starts `npm run dev` unless it's already up. Returns a function that
// stops it again (a no-op if it was already running before).
async function ensureDevServer() {
  if (await isServerUp()) return () => {}

  const server = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true })
  await waitForServer()

  return () => {
    // npm runs through a shell, so stop the whole process tree.
    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' })
    } else {
      server.kill()
    }
  }
}

const stopDevServer = args.includes('--prod') ? () => {} : await ensureDevServer()

// VS Code's terminal sets ELECTRON_RUN_AS_NODE, which would start Electron
// as plain Node.js instead of opening a window.
const env = { ...process.env }
delete env.ELECTRON_RUN_AS_NODE

const electron = spawn(electronPath, ['.', ...args], { stdio: 'inherit', env })
// Closing the kiosk window also stops the dev server started above.
electron.on('exit', (code) => {
  stopDevServer()
  process.exit(code ?? 0)
})
