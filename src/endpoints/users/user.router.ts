import { FastifyInstance } from 'fastify';
import * as controllers from '.';
import { utils } from '../../utils';
import { loginSchema, signupSchema } from './user.schema';

async function userRouter(fastify: FastifyInstance) {
  fastify.post(
    '/login',
    {
      schema: {
        tags: ['user'],
        description: 'User login endpoint',
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  apiKey: { type: 'string' },
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
      preValidation: utils.preValidation(loginSchema),
    },
    controllers.login,
  );

  fastify.post(
    '/signup',
    {
      schema: {
        tags: ['user'],
        description: 'User signup endpoint',
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  apiKey: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' }
                }
              }
            }
          },
          409: {
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      },
      preValidation: utils.preValidation(signupSchema),
    },
    controllers.signUp,
  );
}

export default userRouter;
