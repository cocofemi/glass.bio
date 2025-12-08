import { kv } from "@vercel/kv";

const memory = new Map<string, { count: number; expires: number }>();

export async function rateLimit({
  key,
  limit = 5,
  window = 60,
}: {
  key: string;
  limit?: number;
  window?: number; // seconds
}) {
    const isProd = !!process.env.KV_REST_API_URL;
    const now = Date.now();


  if (!isProd) {
    // -------------------------
    // Local in-memory fallback
    // -------------------------
    const now = Date.now();
    const entry = memory.get(key) || { count: 0, expires: now + window * 1000 };

    if (now > entry.expires) {
      entry.count = 0;
      entry.expires = now + window * 1000;
    }

    entry.count++;
    memory.set(key, entry);

    return { success: entry.count <= limit };
  }
    const windowStart = Math.floor(now / 1000 / window);

    const redisKey = `rate-limit:${key}:${windowStart}`;

    const current = await kv.incr(redisKey);
    if (current === 1) {
        await kv.expire(redisKey, window);
    }

  return {
    success: current <= limit,
    remaining: Math.max(0, limit - current),
    reset: windowStart * window + window,
  };
}
