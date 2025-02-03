"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERRORS = exports.AppError = void 0;
exports.handleServerError = handleServerError;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
exports.ERRORS = {
    invalidRequest: new AppError('Invalid Token', 400),
    internalServerError: new AppError('Internal Server Error', 500),
    unauthorizedAccess: new AppError('Unauthorized access', 401),
};
function handleServerError(reply, error) {
    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
    }
    return reply
        .status(exports.ERRORS.internalServerError.statusCode)
        .send(exports.ERRORS.internalServerError.message);
}
//# sourceMappingURL=errors.helper.js.map