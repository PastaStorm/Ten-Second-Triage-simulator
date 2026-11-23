import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import * as child from 'child_process'

const commitTimestamp = child
  .execSync('git log -1 --format=%cd --date=format:%Y%m%d%H%M', {
    env: { ...process.env, TZ: 'Europe/London' }
  })
  .toString()
  .trim()

// https://vitejs.dev
export default defineConfig({
  plugins: [preact()],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    COMMIT_HASH: JSON.stringify(commitTimestamp)
  }
})
