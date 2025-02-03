"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookupSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.lookupSchema = joi_1.default.object({
    postalCode: joi_1.default.string().pattern(/^\d{4}\s?[A-Za-z]{2}$/).required(),
    houseNumber: joi_1.default.string().min(1).required(),
    additionalInfo: joi_1.default.string().optional(),
});
//# sourceMappingURL=lookup.schema.js.map