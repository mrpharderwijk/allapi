import 'fastify';
import { SubscriptionPlan } from '../helpers/rate-limit.helper';

declare module 'fastify' {
  interface FastifyRequest {
    authUser?: {
      id: string;
      email: string;
      apiKey: string;
      subscriptionPlan: SubscriptionPlan;
      monthlyRequests: number;
      lastRequestReset: Date;
    };
  }

  interface FastifySchema {
    tags?: readonly string[];
    description?: string;
  }
}

export {};
