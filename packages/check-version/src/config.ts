export default {
  hostname: 'api.github.com',
  // GET https://api.github.com/users/{owner}/packages/{package_type}/{package_name}/versions
  path: `/users/mrpharderwijk/packages/npm`,
  headers: {
    Authorization: `token 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`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'mrpharderwijk',
  },
}
