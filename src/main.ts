import fastify from 'fastify';
import pino from 'pino';
import userRouter from './endpoints/users/user.router';
import loadConfig from './config/env.config';
import { utils } from './utils';
import formbody from '@fastify/formbody';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import lookupRouter from './endpoints/lookup/lookup.router';

loadConfig();

const port = Number(process.env.API_PORT) || 5001;
const host = String(process.env.API_HOST);

const startServer = async () => {
  const server = fastify({
    loggerInstance: pino({ level: process.env.LOG_LEVEL }),
  });

  // Register middlewares
  server.register(formbody);
  server.register(cors);
  server.register(helmet);

  // Register Swagger
  await server.register(swagger, {
    swagger: {
      info: {
        title: 'Allapi Documentation',
        description: 'API documentation for Allapi',
        version: '1.0.0'
      },
      host: `${host}:${port}`,
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'user', description: 'User related end-points' },
        { name: 'health', description: 'Health check end-points' }
      ],
    }
  });

  // Register Swagger UI
  await server.register(swaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    staticCSP: true
  });

  // Register routes
  server.register(userRouter, { prefix: '/api/v1/user' });
  server.register(lookupRouter, { prefix: '/api/v1/lookup' });

  // Set error handler
  server.setErrorHandler((error, _request, reply) => {
    server.log.error(error);
    reply.status(500).send({ error: 'Something went wrong' });
  });

  // Health check route
  server.get('/health', {
    schema: {
      tags: ['health'],
      description: 'Health check endpoint',
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (_request, reply) => {
    try {
      await utils.healthCheck();
      reply.status(200).send({
        message: 'Health check endpoint success.',
      });
    } catch (e) {
      reply.status(500).send({
        message: 'Health check endpoint failed.',
      });
    }
  });

  // Root route
  server.get('/', (request, reply) => {
    reply.status(200).send({ message: 'Hello from fastify boilerplate!' });
  });

  // Graceful shutdown
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      try {
        await server.close();
        server.log.error(`Closed application on ${signal}`);
        process.exit(0);
      } catch (err) {
        server.log.error(`Error closing application on ${signal}`, err);
        process.exit(1);
      }
    });
  });

  // Start server
  try {
    await server.listen({
      port,
      host,
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer();
