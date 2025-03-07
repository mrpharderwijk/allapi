import { PrismaClient } from './client'

export * from './client'

export type { PrismaClient }

export function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  })
}
