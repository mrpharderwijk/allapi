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
exports.signUp = exports.login = void 0;
const utils_1 = require("../../utils");
const errors_helper_1 = require("../../helpers/errors.helper");
const JWT = __importStar(require("jsonwebtoken"));
const utils_2 = require("../../utils");
const request_1 = require("../../constants/request");
const user_errors_1 = require("./user.errors");
const login = async (request, reply) => {
    try {
        const { email, password } = request.body;
        const user = await utils_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return reply
                .code(user_errors_1.USER_ERRORS.userNotExists.statusCode)
                .send(user_errors_1.USER_ERRORS.userNotExists.message);
        }
        const checkPass = await utils_2.utils.compareHash(user.password, password);
        if (!checkPass) {
            return reply
                .code(user_errors_1.USER_ERRORS.userCredError.statusCode)
                .send(user_errors_1.USER_ERRORS.userCredError.message);
        }
        const token = JWT.sign({
            id: user.id,
            email: user.email,
            apiKey: user.apiKey,
        }, process.env.APP_JWT_SECRET);
        const { password: _, ...userWithoutPassword } = user;
        return reply.code(request_1.STANDARD.OK.statusCode).send({
            token,
            user: userWithoutPassword,
        });
    }
    catch (err) {
        return (0, errors_helper_1.handleServerError)(reply, err);
    }
};
exports.login = login;
const signUp = async (request, reply) => {
    try {
        const { email, password } = request.body;
        const user = await utils_1.prisma.user.findUnique({ where: { email } });
        if (user) {
            console.log('----------------------------------------->>>>>> User already exists');
            return reply.code(user_errors_1.USER_ERRORS.userExists.statusCode).send(user_errors_1.USER_ERRORS.userExists);
        }
        const hashPass = await utils_2.utils.genSalt(10, password);
        const createUser = await utils_1.prisma.user.create({
            data: {
                email,
                password: String(hashPass),
            },
        });
        const token = JWT.sign({
            id: createUser.id,
            email: createUser.email,
            apiKey: createUser.apiKey,
        }, process.env.APP_JWT_SECRET);
        const { password: _, ...userWithoutPassword } = createUser;
        return reply.code(request_1.STANDARD.OK.statusCode).send({
            token,
            user: userWithoutPassword,
        });
    }
    catch (err) {
        console.error('Signup error:', err);
        return (0, errors_helper_1.handleServerError)(reply, err);
    }
};
exports.signUp = signUp;
//# sourceMappingURL=user.controller.js.map