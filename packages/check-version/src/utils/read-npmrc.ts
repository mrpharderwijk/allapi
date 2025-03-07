import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'

interface NpmConfig {
  registry?: string
  authToken?: string
  username?: string
}

export async function readNpmConfig(): Promise<NpmConfig> {
  try {
    // Try to read from project .npmrc first, then fallback to user's home directory
    const locations = [
      path.resolve(process.cwd(), '.npmrc'),
      path.resolve(os.homedir(), '.npmrc'),
    ]

    let npmrcContent = ''
    for (const location of locations) {
      try {
        npmrcContent = await fs.readFile(location, 'utf-8')
        break
      } catch (error) {
        continue
      }
    }

    if (!npmrcContent) {
      throw new Error('No .npmrc file found')
    }

    const config: NpmConfig = {}
    const lines = npmrcContent.split('\n')

    for (const line of lines) {
      if (line.startsWith('#') || !line.trim()) continue

      const [key, value] = line.split('=').map((s) => s.trim())

      if (key.includes('registry')) {
        config.registry = value
      } else if (key.includes('_authToken')) {
        config.authToken = value
      } else if (key.includes('username')) {
        config.username = value
      }
    }

    return config
  } catch (error) {
    throw new Error(`Failed to read .npmrc: ${(error as Error).message}`)
  }
}
