import { existsSync } from 'fs'
import { rename, rm } from 'fs/promises'
import { mkdir } from 'fs/promises'

try {
  // Ensure the cjs directory exists
  if (!existsSync('./dist/cjs')) {
    await mkdir('./dist/cjs', { recursive: true })
  }

  // Move and rename all related files
  if (existsSync('./dist/cjs/eslint.config.js')) {
    // Rename and move the main JS file
    await rename('./dist/cjs/eslint.config.js', './dist/eslint.config.cjs')

    // Rename and move the declaration file if it exists
    if (existsSync('./dist/cjs/eslint.config.d.ts')) {
      await rename(
        './dist/cjs/eslint.config.d.ts',
        './dist/eslint.config.d.cts',
      )
    }

    // Rename and move the source map if it exists
    if (existsSync('./dist/cjs/eslint.config.js.map')) {
      await rename(
        './dist/cjs/eslint.config.js.map',
        './dist/eslint.config.cjs.map',
      )
    }

    // Remove the cjs directory after moving all files
    await rm('./dist/cjs', { recursive: true })
  }
} catch (error) {
  console.error('Error during post-build:', error)
  process.exit(1)
}
