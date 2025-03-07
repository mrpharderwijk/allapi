import { PrismaClient, User } from '@mrpharderwijk/prisma/dist/client'

declare module 'fastify' {
  interface FastifyRequest {
    user: User
  }

  interface FastifyInstance {
    prisma: PrismaClient
  }
}

export interface AuthenticatedRequest {
  Headers: { 'x-api-key': string }
}
