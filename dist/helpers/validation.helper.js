"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = void 0;
const validateSchema = (schema) => {
    return (request, reply, done) => {
        try {
            const { error } = schema.validate(request.body);
            if (error) {
                throw error;
            }
            done();
        }
        catch (error) {
            done(error);
        }
    };
};
exports.validateSchema = validateSchema;
//# sourceMappingURL=validation.helper.js.map