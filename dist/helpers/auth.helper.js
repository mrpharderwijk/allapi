"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidUser = exports.checkValidRequest = void 0;
const utils_1 = require("../utils");
const utils_2 = require("../utils");
const errors_helper_1 = require("./errors.helper");
const checkValidRequest = (request, reply) => {
    const token = utils_1.utils.getTokenFromHeader(request.headers.authorization);
    if (!token) {
        return reply
            .code(errors_helper_1.ERRORS.unauthorizedAccess.statusCode)
            .send(errors_helper_1.ERRORS.unauthorizedAccess.message);
    }
    const decoded = utils_1.utils.verifyToken(token);
    if (!decoded) {
        return reply
            .code(errors_helper_1.ERRORS.unauthorizedAccess.statusCode)
            .send(errors_helper_1.ERRORS.unauthorizedAccess.message);
    }
};
exports.checkValidRequest = checkValidRequest;
const checkValidUser = async (request, reply) => {
    const token = utils_1.utils.getTokenFromHeader(request.headers.authorization);
    if (!token) {
        return reply
            .code(errors_helper_1.ERRORS.unauthorizedAccess.statusCode)
            .send(errors_helper_1.ERRORS.unauthorizedAccess.message);
    }
    const decoded = utils_1.utils.verifyToken(token);
    if (!decoded || !decoded.id) {
        return reply
            .code(errors_helper_1.ERRORS.unauthorizedAccess.statusCode)
            .send(errors_helper_1.ERRORS.unauthorizedAccess.message);
    }
    try {
        const userData = await utils_2.prisma.user.findUnique({
            where: { id: decoded.id },
        });
        if (!userData) {
            return reply
                .code(errors_helper_1.ERRORS.unauthorizedAccess.statusCode)
                .send(errors_helper_1.ERRORS.unauthorizedAccess.message);
        }
        request.authUser = userData;
    }
    catch (e) {
        return reply
            .code(errors_helper_1.ERRORS.unauthorizedAccess.statusCode)
            .send(errors_helper_1.ERRORS.unauthorizedAccess.message);
    }
};
exports.checkValidUser = checkValidUser;
//# sourceMappingURL=auth.helper.js.map