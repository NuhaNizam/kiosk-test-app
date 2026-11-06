// Lists changed files and says which update they need: a UI update, an app
// update, both or neither.
//
//   npm run what-changed                      uncommitted changes (incl. new files)
//   npm run what-changed -- --last-commit     the last commit
//   npm run what-changed -- --since <ref>     everything since a commit or tag
//                                             (e.g. the commit you last deployed)

import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const args = process.argv.slice(2)

// core.safecrlf=false: no "LF will be replaced by CRLF" warnings in the output.
const git = (...gitArgs) =>
  execFileSync('git', ['-c', 'core.safecrlf=false', ...gitArgs], { cwd: root, encoding: 'utf8' })
    .split('\n')
    .filter(Boolean)

function changedFiles() {
  if (args.includes('--last-commit')) return git('diff', '--name-only', '--relative', 'HEAD~1', 'HEAD')
  let base = 'HEAD'
  if (args.includes('--since')) {
    base = args[args.indexOf('--since') + 1]
    if (!base) {
      console.error('Usage: npm run what-changed -- --since <commit or tag>')
      process.exit(1)
    }
  }
  // Changes since `base` (committed or not), plus new files git doesn't track yet.
  return [...new Set([...git('diff', '--name-only', '--relative', base), ...git('ls-files', '--others', '--exclude-standard')])]
}

// What each kind of update ships: everything in ui/ or in app/. Anything
// else (scripts/, the root package.json and package-lock.json, README.md,
// lint config, ...) only runs on the developer's PC; a dependency change
// shows up in ui/package.json or app/package.json.
const UI_PATHS = ['ui/']
const APP_PATHS = ['app/']
const under = (paths) => (file) => paths.some((p) => file === p || file.startsWith(p))

const files = changedFiles().sort()
const ui = files.filter(under(UI_PATHS))
const app = files.filter(under(APP_PATHS))
const other = files.filter((f) => !ui.includes(f) && !app.includes(f))

function section(title, list) {
  if (list.length) console.log(`\n${title}:\n${list.map((f) => `  ${f}`).join('\n')}`)
}

console.log(files.length ? 'Changes detected:' : 'No changes detected.')
section('React frontend (UI update)', ui)
section('Electron application (app update)', app)
section('Not deployed (developer only)', other)

// App first: a new UI may rely on something only the new app has.
const steps = []
if (app.length) steps.push('App update: raise "version" in app/package.json, then npm run dist')
if (ui.length) steps.push('UI update:  npm run build')

console.log('\nRecommended deployment:')
console.log(steps.length ? steps.map((s, i) => `  ${i + 1}. ${s}`).join('\n') : '  Nothing to deploy.')
