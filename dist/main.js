"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const user_router_1 = __importDefault(require("./endpoints/users/user.router"));
const env_config_1 = __importDefault(require("./config/env.config"));
const utils_1 = require("./utils");
const formbody_1 = __importDefault(require("@fastify/formbody"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const lookup_router_1 = __importDefault(require("./endpoints/lookup/lookup.router"));
(0, env_config_1.default)();
const port = Number(process.env.API_PORT) || 5001;
const host = String(process.env.API_HOST);
exports.app = (0, fastify_1.default)({
    logger: true,
});
// Register middlewares
exports.app.register(formbody_1.default);
exports.app.register(cors_1.default);
exports.app.register(helmet_1.default);
// Register Swagger
exports.app.register(swagger_1.default, {
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
exports.app.register(swagger_ui_1.default, {
    routePrefix: '/documentation',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false
    },
    staticCSP: true
});
// Register routes
exports.app.register(user_router_1.default, { prefix: '/api/v1/user' });
exports.app.register(lookup_router_1.default, { prefix: '/api/v1/lookup' });
// Set error handler
exports.app.setErrorHandler((error, _request, reply) => {
    exports.app.log.error(error);
    reply.status(500).send({ error: 'Something went wrong' });
});
// Health check route
exports.app.get('/health', {
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
        await utils_1.utils.healthCheck();
        reply.status(200).send({
            message: 'Health check endpoint success.',
        });
    }
    catch (e) {
        reply.status(500).send({
            message: 'Health check endpoint failed.',
        });
    }
});
// Root route
exports.app.get('/', (request, reply) => {
    reply.status(200).send({ message: 'Hello from fastify boilerplate!' });
});
// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
    process.on(signal, async () => {
        try {
            await exports.app.close();
            exports.app.log.error(`Closed application on ${signal}`);
            process.exit(0);
        }
        catch (err) {
            exports.app.log.error(`Error closing application on ${signal}`, err);
            process.exit(1);
        }
    });
});
// Only start the server if we're not in Lambda
if (process.env.ENVIRONMENT !== 'lambda') {
    const start = async () => {
        try {
            await exports.app.listen({ port, host });
        }
        catch (err) {
            exports.app.log.error(err);
            process.exit(1);
        }
    };
    start();
}
// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map