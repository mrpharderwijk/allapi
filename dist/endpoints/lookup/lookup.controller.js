"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookup = void 0;
const utils_1 = require("../../utils");
const errors_helper_1 = require("../../helpers/errors.helper");
const request_1 = require("../../constants/request");
const lookup_errors_1 = require("./lookup.errors");
const lookup = async (request, reply) => {
    try {
        const { postalCode, houseNumber } = request.body;
        const address = await utils_1.prisma.address.findFirst({
            where: {
                AND: {
                    postalCode,
                    houseNumber
                }
            }
        });
        if (!address) {
            return reply
                .code(lookup_errors_1.LOOKUP_ERRORS.addressNotFound.statusCode)
                .send({ message: lookup_errors_1.LOOKUP_ERRORS.addressNotFound.message });
        }
        return reply.code(request_1.STANDARD.OK.statusCode).send({
            address,
        });
    }
    catch (err) {
        return (0, errors_helper_1.handleServerError)(reply, err);
    }
};
exports.lookup = lookup;
//# sourceMappingURL=lookup.controller.js.map