// Starts the dev server (if needed) and opens the app in Chrome with silent
// printing, so "Print test page" goes straight to the Windows default printer.
//
//   npm run kiosk           full-screen kiosk mode (exit with Alt+F4)
//   npm run kiosk:window    normal window, still prints silently
//
// A separate Chrome profile is used so the flags apply even when Chrome is
// already open (otherwise Chrome hands the URL to the running instance and
// ignores --kiosk-printing).

import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const URL = 'http://localhost:5173'
const windowed = process.argv.includes('--windowed')

const CHROME_PATHS = [
  join(process.env.ProgramFiles ?? '', 'Google/Chrome/Application/chrome.exe'),
  join(process.env['ProgramFiles(x86)'] ?? '', 'Google/Chrome/Application/chrome.exe'),
  join(process.env.LOCALAPPDATA ?? '', 'Google/Chrome/Application/chrome.exe'),
]

async function isServerUp() {
  try {
    await fetch(URL)
    return true
  } catch {
    return false
  }
}

async function waitForServer(timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs
  while (!(await isServerUp())) {
    if (Date.now() > deadline) throw new Error(`Dev server did not respond at ${URL}`)
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}

function openChrome() {
  const chrome = CHROME_PATHS.find((path) => existsSync(path))
  if (!chrome) throw new Error('Google Chrome was not found.')

  const args = [
    '--kiosk-printing',
    `--user-data-dir=${join(process.env.LOCALAPPDATA ?? '.', 'kiosk-test-app', 'chrome-profile')}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-session-crashed-bubble',
    ...(windowed ? [] : ['--kiosk']),
    URL,
  ]

  spawn(chrome, args, { detached: true, stdio: 'ignore' }).unref()
  console.log(`Opened ${URL} in Chrome (silent printing to the default printer)`)
}

if (!(await isServerUp())) {
  // Runs in this terminal; Ctrl+C stops it.
  spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true })
  await waitForServer()
}

openChrome()
