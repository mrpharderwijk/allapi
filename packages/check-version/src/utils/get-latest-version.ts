import https from 'https'
import { URL } from 'url'

import { getRequestHeaders } from './get-request-headers'
import { readNpmConfig } from './read-npmrc'

type GetLatestVersionParams = {
  url?: string
  name: string
  registry?: string
}

export async function getLatestVersion({
  url,
  name,
  registry,
}: GetLatestVersionParams): Promise<string> {
  try {
    const npmConfig = await readNpmConfig()

    // Determine the URL to use
    let targetUrl: URL
    if (url) {
      targetUrl = new URL(url)
    } else {
      const baseRegistry =
        registry || npmConfig.registry || 'https://registry.npmjs.org'
      targetUrl = new URL(`${baseRegistry}/${name}`)
    }

    const headers = getRequestHeaders({
      registry: targetUrl.hostname,
      authToken: npmConfig.authToken,
      username: npmConfig.username,
    })

    return new Promise((resolve, reject) => {
      const options: https.RequestOptions = {
        hostname: targetUrl.hostname,
        path: targetUrl.pathname + targetUrl.search,
        headers,
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
                resolve('0.0.0')
                return
              }

              if (res.statusCode === 401 || res.statusCode === 403) {
                throw new Error(
                  'Authentication failed. Check your .npmrc configuration',
                )
              }

              const packageInfo = JSON.parse(data)
              let latestVersion = '0.0.0'

              if (Array.isArray(packageInfo)) {
                // GitHub API format
                latestVersion = packageInfo[0]?.name || '0.0.0'
              } else if (packageInfo.versions) {
                // npm registry format
                const versions = Object.keys(packageInfo.versions)
                latestVersion = versions[versions.length - 1] || '0.0.0'
              }

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
  } catch (error) {
    throw new Error(`Configuration error: ${(error as Error).message}`)
  }
}
