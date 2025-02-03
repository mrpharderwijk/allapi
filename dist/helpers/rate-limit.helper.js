"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRateLimit = exports.getRateLimiter = exports.SubscriptionPlan = void 0;
const utils_1 = require("../utils");
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["HOBBY"] = "HOBBY";
    SubscriptionPlan["PRO"] = "PRO";
    SubscriptionPlan["ENTERPRISE"] = "ENTERPRISE";
})(SubscriptionPlan || (exports.SubscriptionPlan = SubscriptionPlan = {}));
const RATE_LIMITS = {
    [SubscriptionPlan.HOBBY]: { points: 1, duration: 1 }, // 1 request per second
    [SubscriptionPlan.PRO]: { points: 5, duration: 1 }, // 5 requests per second
    [SubscriptionPlan.ENTERPRISE]: { points: 20, duration: 1 }, // 20 requests per second
};
const MONTHLY_LIMITS = {
    [SubscriptionPlan.HOBBY]: 1000,
    [SubscriptionPlan.PRO]: 10000,
    [SubscriptionPlan.ENTERPRISE]: Infinity,
};
const rateLimiters = {};
const getRateLimiter = (userId, plan) => {
    if (!rateLimiters[userId]) {
        const { points, duration } = RATE_LIMITS[plan];
        rateLimiters[userId] = new rate_limiter_flexible_1.RateLimiterMemory({
            points,
            duration,
        });
    }
    return rateLimiters[userId];
};
exports.getRateLimiter = getRateLimiter;
const checkRateLimit = async (request, reply) => {
    const apiKey = request.headers['x-api-key'];
    if (!apiKey) {
        return reply.code(401).send({ message: 'API key is required' });
    }
    const user = await utils_1.prisma.user.findUnique({
        where: { apiKey },
    });
    if (!user) {
        return reply.code(401).send({ message: 'Invalid API key' });
    }
    // Check if monthly requests need to be reset
    const now = new Date();
    if (now.getMonth() !== user.lastRequestReset.getMonth()) {
        await utils_1.prisma.user.update({
            where: { id: user.id },
            data: {
                monthlyRequests: 0,
                lastRequestReset: now,
            },
        });
    }
    // Check monthly limit
    if (user.monthlyRequests >= MONTHLY_LIMITS[user.subscriptionPlan]) {
        return reply.code(429).send({ message: 'Monthly request limit exceeded' });
    }
    // Check rate limit
    try {
        const rateLimiter = (0, exports.getRateLimiter)(user.id, user.subscriptionPlan);
        await rateLimiter.consume(user.id);
        // Increment monthly requests
        await utils_1.prisma.user.update({
            where: { id: user.id },
            data: {
                monthlyRequests: {
                    increment: 1
                }
            }
        });
        // Add request to ApiUsage
        await utils_1.prisma.apiUsage.create({
            data: {
                userId: user.id,
                endpoint: request.url,
            }
        });
        request.authUser = user;
    }
    catch (error) {
        return reply.code(429).send({ message: 'Too many requests' });
    }
};
exports.checkRateLimit = checkRateLimit;
//# sourceMappingURL=rate-limit.helper.js.map