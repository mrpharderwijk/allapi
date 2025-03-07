import { FastifyInstance } from 'fastify'
import * as path from 'path'
import AutoLoad from '@fastify/autoload'
import { createPrismaClient } from '@mrpharderwijk/prisma'

/* eslint-disable-next-line */
export interface AppOptions {}

// Initialize Prisma client
const prisma = createPrismaClient()

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  // Add Prisma to Fastify instance
  fastify.decorate('prisma', prisma)

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { ...opts },
  })
}
