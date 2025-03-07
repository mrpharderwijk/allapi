import https from 'https'
import semver from 'semver'

import { name, version } from '../package.json'

interface PackageVersion {
  version: string
}

interface PackageInfo {
  versions: PackageVersion[]
}

// Function to get the latest version from npm registry
function getLatestVersion(): Promise<string> {
  return new Promise((resolve, reject) => {
    const options: https.RequestOptions = {
      hostname: 'gitlab.com',
      path: `/api/v4/projects/67059991/packages/npm/${encodeURIComponent(name)}`,
      headers: {
        'PRIVATE-TOKEN': process.env.GITLAB_TOKEN || '',
      },
    }

    https
      .get(options, (res) => {
        let data = ''

        res.on('data', (chunk: Buffer) => {
          data += chunk
        })

        res.on('end', () => {
          try {
            if (res.statusCode === 404) {
              // Package doesn't exist yet
              resolve('0.0.0')
              return
            }

            const packageInfo = JSON.parse(data) as PackageInfo

            const versionsObject = packageInfo.versions || []
            const versionsArray = Object.values(versionsObject)
            if (versionsArray.length === 0) {
              resolve('0.0.0')
              return
            }

            // Get the latest version
            const latestVersion =
              versionsArray[versionsArray.length - 1].version
            resolve(latestVersion)
          } catch (error) {
            reject(
              new Error(
                `Failed to parse registry response: ${(error as Error).message}`,
              ),
            )
          }
        })
      })
      .on('error', (error: Error) => {
        reject(new Error(`Failed to fetch from registry: ${error.message}`))
      })
  })
}

// Main function to compare versions
async function checkVersion(): Promise<void> {
  try {
    const latestVersion = await getLatestVersion()
    const currentVersion = version

    console.log(`Current version: ${currentVersion}`)
    console.log(`Latest published version: ${latestVersion}`)

    if (!semver.valid(currentVersion)) {
      console.error('❌ Current version is not a valid semver version')
      process.exit(1)
    }

    if (!semver.valid(latestVersion)) {
      console.error('❌ Latest version is not a valid semver version')
      process.exit(1)
    }

    if (semver.gt(currentVersion, latestVersion)) {
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

checkVersion()
