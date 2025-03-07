interface HeadersConfig {
  registry: string
  authToken?: string
  username?: string
}

export function getRequestHeaders(
  config: HeadersConfig,
): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'User-Agent': 'check-semver-cli',
  }

  // Add auth headers based on registry type
  if (config.registry.includes('github')) {
    if (config.authToken) {
      headers['Authorization'] = `token ${config.authToken}`
    }
  } else if (config.registry.includes('npmjs')) {
    if (config.authToken) {
      headers['Authorization'] = `Bearer ${config.authToken}`
    }
  }

  return headers
}
