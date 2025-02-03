"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOOKUP_ERRORS = void 0;
const errors_helper_1 = require("../../helpers/errors.helper");
exports.LOOKUP_ERRORS = {
    addressNotFound: new errors_helper_1.AppError('Address not found', 404),
};
//# sourceMappingURL=lookup.errors.js.map