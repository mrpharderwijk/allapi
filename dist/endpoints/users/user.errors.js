"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_ERRORS = void 0;
const errors_helper_1 = require("../../helpers/errors.helper");
exports.USER_ERRORS = {
    invalidToken: new errors_helper_1.AppError('Token is invalid.', 401),
    userExists: new errors_helper_1.AppError('User already exists', 409),
    userNotExists: new errors_helper_1.AppError('User not exists', 404),
    userCredError: new errors_helper_1.AppError('Invalid credential', 401),
    tokenError: new errors_helper_1.AppError('Invalid Token', 401),
};
//# sourceMappingURL=user.errors.js.map