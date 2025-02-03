"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers = __importStar(require("."));
const utils_1 = require("../../utils");
const lookup_schema_1 = require("./lookup.schema");
const rate_limit_helper_1 = require("../../helpers/rate-limit.helper");
async function lookupRouter(fastify) {
    fastify.post('/', {
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
        preValidation: [rate_limit_helper_1.checkRateLimit, utils_1.utils.preValidation(lookup_schema_1.lookupSchema)],
    }, controllers.lookup);
}
exports.default = lookupRouter;
//# sourceMappingURL=lookup.router.js.map