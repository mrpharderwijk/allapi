import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import rateLimit from '@fastify/rate-limit'

export default fp(async function (fastify: FastifyInstance) {
  // Register rate limit plugin with dynamic limits based on subscription
  await fastify.register(rateLimit, {
    global: false, // Disable global rate limiting
    max: 1, // Default max (will be overridden)
    timeWindow: 1000, // 1 second
    keyGenerator: (req) => {
      return (req.headers['x-api-key'] as string) || ''
    },
    hook: 'preHandler',
    enableDraftSpec: true, // Enable draft spec headers
    addHeadersOnExceeding: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    },
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
      'retry-after': true,
    },
  })
})
