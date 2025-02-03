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
exports.utils = exports.prisma = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const client_1 = require("@prisma/client");
const JWT = __importStar(require("jsonwebtoken"));
exports.prisma = new client_1.PrismaClient();
exports.utils = {
    isJSON: (data) => {
        try {
            JSON.parse(data);
        }
        catch (e) {
            return false;
        }
        return true;
    },
    getTime: () => {
        return new Date().getTime();
    },
    genSalt: (saltRounds, value) => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err)
                    return reject(err);
                bcrypt.hash(value, salt, (err, hash) => {
                    if (err)
                        return reject(err);
                    resolve(hash);
                });
            });
        });
    },
    compareHash: (hash, value) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(value, hash, (err, result) => {
                if (err)
                    return reject(err);
                resolve(result);
            });
        });
    },
    healthCheck: async () => {
        try {
            await exports.prisma.$queryRaw `SELECT 1`;
        }
        catch (e) {
            throw new Error(`Health check failed: ${e.message}`);
        }
    },
    getTokenFromHeader: (authorizationHeader) => {
        if (!authorizationHeader)
            return null;
        const token = authorizationHeader.replace('Bearer ', '');
        return token || null;
    },
    verifyToken: (token) => {
        try {
            return JWT.verify(token, process.env.APP_JWT_SECRET);
        }
        catch (err) {
            return null;
        }
    },
    validateSchema: (schema) => {
        return (data) => {
            const { error } = schema.validate(data);
            if (error) {
                throw new Error(error.details[0].message);
            }
        };
    },
    preValidation: (schema) => {
        return (request, reply, done) => {
            const { error } = schema.validate(request.body);
            if (error) {
                return done(error);
            }
            done();
        };
    },
};
//# sourceMappingURL=utils.js.map