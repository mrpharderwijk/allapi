import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'

export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key',
  })
})
