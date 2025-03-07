import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import cors from '@fastify/cors'

export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: (origin, cb) => {
      if (!origin) {
        // Allow requests with no origin (like mobile apps or curl requests)
        cb(null, true)
        return
      }

      try {
        const domain = new URL(origin).hostname
        // Since we can't access request headers in the CORS callback,
        // we'll do the domain validation in the route handlers
        cb(null, true)
      } catch (err) {
        cb(new Error('Invalid origin'), false)
      }
    },
    credentials: true,
  })
})
