import { FastifyInstance } from 'fastify'

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async () => {
    return {
      status: 'ok',
      message: 'Fastify API is running',
      version: '1.0.0',
      endpoints: {
        auth: {
          register: '/api/v1/auth/register',
          login: '/api/v1/auth/login',
          domains: '/api/v1/auth/domains',
        },
        lookup: {
          address: '/api/v1/lookup/address',
          postalCode: '/api/v1/lookup/postal-code',
        },
      },
    }
  })
}
