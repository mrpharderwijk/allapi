import * as fs from 'fs/promises'
import * as path from 'path'
import semver from 'semver'

import { getLatestVersion } from '../../utils/get-latest-version'

interface CheckVersionOptions {
  remoteUrl?: string
  packagePath: string
  registry?: string
}

export async function checkVersion(
  options: CheckVersionOptions,
): Promise<void> {
  try {
    // Read local package.json
    const packagePath = path.resolve(process.cwd(), options.packagePath)
    const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf-8'))

    const localVersion = packageJson.version
    const latestVersion = await getLatestVersion({
      url: options.remoteUrl,
      name: packageJson.name,
      registry: options.registry,
    })

    console.log(`Local version: ${localVersion}`)
    console.log(`Latest published version: ${latestVersion}`)

    if (!semver.valid(localVersion)) {
      console.error('❌ Current version is not a valid semver version')
      process.exit(1)
    }

    if (!semver.valid(latestVersion)) {
      console.error('❌ Latest version is not a valid semver version')
      process.exit(1)
    }

    if (semver.gt(localVersion, latestVersion)) {
      console.log('✅ Current version is newer than published version')
      process.exit(0)
    } else {
      console.error(
        '❌ Current version must be greater than the published version',
      )
      process.exit(1)
    }
  } catch (error) {
    console.error('Error:', (error as Error).message)
    process.exit(1)
  }
}
