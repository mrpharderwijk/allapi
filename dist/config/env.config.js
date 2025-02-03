"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = loadConfig;
const path_1 = __importDefault(require("path"));
const joi_1 = __importDefault(require("joi"));
const dotenv_1 = __importDefault(require("dotenv"));
function loadConfig() {
    const envPath = path_1.default.join(__dirname, '..', '..', '.env');
    const result = dotenv_1.default.config({ path: envPath });
    if (result.error) {
        throw new Error(`Failed to load .env file from path ${envPath}: ${result.error.message}`);
    }
    const schema = joi_1.default.object({
        NODE_ENV: joi_1.default.string()
            .valid('development', 'testing', 'production')
            .required(),
        LOG_LEVEL: joi_1.default.string()
            .valid('debug', 'info', 'warn', 'error', 'fatal')
            .required(),
        API_HOST: joi_1.default.string().required(),
        API_PORT: joi_1.default.string().required(),
        DATABASE_URL: joi_1.default.string().required(),
        APP_JWT_SECRET: joi_1.default.string().required(),
    }).unknown(true);
    const { error } = schema.validate(process.env, { abortEarly: false });
    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }
}
//# sourceMappingURL=env.config.js.map