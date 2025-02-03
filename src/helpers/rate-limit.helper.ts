import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../utils';
import { RateLimiterMemory } from 'rate-limiter-flexible';

interface RequestWithAuth extends FastifyRequest {
  authUser: any; // or define a more specific type if needed
}

export enum SubscriptionPlan {
  HOBBY = 'HOBBY',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

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

const rateLimiters: { [key: string]: RateLimiterMemory } = {};

export const getRateLimiter = (userId: string, plan: SubscriptionPlan): RateLimiterMemory => {
  if (!rateLimiters[userId]) {
    const { points, duration } = RATE_LIMITS[plan];
    rateLimiters[userId] = new RateLimiterMemory({
      points,
      duration,
    });
  }
  return rateLimiters[userId];
};

export const checkRateLimit = async (
  request: RequestWithAuth,
  reply: FastifyReply
) => {
  const apiKey = request.headers['x-api-key'] as string;
  if (!apiKey) {
    return reply.code(401).send({ message: 'API key is required' });
  }

  const user = await prisma.user.findUnique({
    where: { apiKey },
  });

  if (!user) {
    return reply.code(401).send({ message: 'Invalid API key' });
  }

  // Check if monthly requests need to be reset
  const now = new Date();
  if (now.getMonth() !== user.lastRequestReset.getMonth()) {
    await prisma.user.update({
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
    const rateLimiter = getRateLimiter(user.id, user.subscriptionPlan as SubscriptionPlan);
    await rateLimiter.consume(user.id);
    
    // Increment monthly requests
    await prisma.user.update({
      where: { id: user.id },
      data: {
        monthlyRequests: {
          increment: 1
        }
      }
    });

    // Add request to ApiUsage
    await prisma.apiUsage.create({
      data: {
        userId: user.id,
        endpoint: request.url,
      }
    });

    request.authUser = user;
  } catch (error) {
    return reply.code(429).send({ message: 'Too many requests' });
  }
}; 