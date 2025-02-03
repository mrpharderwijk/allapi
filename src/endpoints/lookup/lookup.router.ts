import { FastifyInstance } from 'fastify';
import * as controllers from '.';
import { utils } from '../../utils';
import { lookupSchema } from './lookup.schema';
import { checkRateLimit } from '../../helpers/rate-limit.helper';

async function lookupRouter(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      schema: {
        tags: ['lookup'],
        description: 'Lookup endpoint',
        headers: {
          type: 'object',
          properties: {
            'x-api-key': { type: 'string' }
          },
          required: ['x-api-key']
        },
        body: {
          type: 'object',
          required: ['postalCode', 'houseNumber'],
          properties: {
            postalCode: { type: 'string', pattern: '^\\d{4}\\s?[A-Za-z]{2}$' },
            houseNumber: { type: 'string', minLength: 1 },
            additionalInfo: { type: 'string' }
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              address: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  streetName: { type: 'string' },
                  houseNumber: { type: 'string' },
                  postalcode: { type: 'string' },
                  city: { type: 'string' },
                  province: { type: 'string' },
                  municipality: { type: 'string' },
                  district: { type: 'string' },
                  neighborhood: { type: 'string' },
                  latitude: { type: 'number' },
                  longitude: { type: 'number' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' }
                }
              }
            }
          },
          400: {
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      },
      preValidation: [checkRateLimit, utils.preValidation(lookupSchema)],
    },
    controllers.lookup,
  );
}

export default lookupRouter;
