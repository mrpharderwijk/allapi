import { FastifyInstance } from 'fastify'

import { validateApiKey } from '../../../middleware/auth'
import { AuthenticatedRequest } from '../../../types/fastify'

interface AddDomainBody {
  domain: string
}

interface DeleteDomainParams {
  domainId: string
}

export async function domainRoutes(fastify: FastifyInstance) {
  // Get all allowed domains for the user
  fastify.get<AuthenticatedRequest>(
    '/api/v1/auth/domains',
    {
      preHandler: validateApiKey,
    },
    async (request) => {
      const domains = await fastify.prisma.allowedDomain.findMany({
        where: {
          userId: request.user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return domains
    },
  )

  // Add a new allowed domain
  fastify.post<AuthenticatedRequest & { Body: AddDomainBody }>(
    '/api/v1/auth/domains',
    {
      preHandler: validateApiKey,
    },
    async (request, reply) => {
      const { domain } = request.body

      if (!domain) {
        return reply.status(400).send({ error: 'Domain is required' })
      }

      // Validate domain format
      try {
        new URL(`https://${domain}`)
      } catch (error) {
        return reply.status(400).send({ error: 'Invalid domain format' })
      }

      try {
        const newDomain = await fastify.prisma.allowedDomain.create({
          data: {
            domain: domain.toLowerCase(),
            userId: request.user.id,
          },
        })

        return newDomain
      } catch (error: any) {
        // Handle unique constraint violation
        if (error.code === 'P2002') {
          return reply
            .status(400)
            .send({ error: 'Domain already exists for this user' })
        }
        throw error
      }
    },
  )

  // Delete an allowed domain
  fastify.delete<AuthenticatedRequest & { Params: DeleteDomainParams }>(
    '/api/v1/auth/domains/:domainId',
    {
      preHandler: validateApiKey,
    },
    async (request, reply) => {
      const { domainId } = request.params

      const domain = await fastify.prisma.allowedDomain.findFirst({
        where: {
          id: domainId,
          userId: request.user.id,
        },
      })

      if (!domain) {
        return reply.status(404).send({ error: 'Domain not found' })
      }

      await fastify.prisma.allowedDomain.delete({
        where: {
          id: domainId,
        },
      })

      return { success: true }
    },
  )
}
