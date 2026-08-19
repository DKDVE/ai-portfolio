import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitResult = Readonly<{ allowed: true }> | Readonly<{ allowed: false; message: string }>;

function isEnforced(): boolean {
  return process.env.NODE_ENV === "production" || process.env.ENFORCE_RATE_LIMITS === "true";
}

function getRedis(): Redis | undefined {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return undefined;
  return Redis.fromEnv();
}

export async function enforceRateLimits(ip: string): Promise<RateLimitResult> {
  const redis = getRedis();
  if (!redis) return isEnforced() ? { allowed: false, message: "The assistant is temporarily unavailable." } : { allowed: true };

  const [burst, daily] = await Promise.all([
    new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 m"), prefix: "assistant:burst" }).limit(ip),
    new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(10, "24 h"), prefix: "assistant:daily" }).limit(ip),
  ]);
  if (!burst.success) return { allowed: false, message: "Too many requests. Please wait a minute and try again." };
  if (!daily.success) return { allowed: false, message: "The daily assistant limit for this connection has been reached." };

  const budget = Number.parseInt(process.env.DAILY_BUDGET_MESSAGE_CAP ?? "", 10);
  if (!Number.isFinite(budget) || budget < 1) return isEnforced() ? { allowed: false, message: "The assistant is temporarily unavailable." } : { allowed: true };
  const global = await new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(budget, "24 h"), prefix: "assistant:budget" }).limit("global");
  return global.success ? { allowed: true } : { allowed: false, message: "The assistant is resting for today — please reach out via email or LinkedIn." };
}
