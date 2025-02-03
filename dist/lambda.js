"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_lambda_1 = __importDefault(require("@fastify/aws-lambda"));
const main_1 = require("./main");
const proxy = (0, aws_lambda_1.default)(main_1.app);
const handler = async (event, context) => {
    return proxy(event, context);
};
exports.handler = handler;
//# sourceMappingURL=lambda.js.map