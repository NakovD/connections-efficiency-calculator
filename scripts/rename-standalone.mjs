// Vite always writes index.html; give the standalone build a name that makes
// sense once the file sits on a desktop next to unrelated files.
import { renameSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'standalone'
renameSync(join(dir, 'index.html'), join(dir, 'connections-efficiency-calculator.html'))
console.log(`Standalone build ready: ${join(dir, 'connections-efficiency-calculator.html')}`)
