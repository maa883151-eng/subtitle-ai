// Minimal in-memory sliding-window rate limiter.
//
// This is intentionally simple: state lives in a module-level Map, so it
// resets on redeploy/restart and is per-instance rather than global across a
// multi-instance deployment. That's an acceptable tradeoff for a portfolio
// project protecting an expensive OpenAI-backed endpoint; swap in a shared
// store (e.g. Redis) if this is ever deployed behind multiple instances.

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Opportunistic cleanup so the map doesn't grow without bound.
const MAX_TRACKED_KEYS = 5000;

export interface RateLimitOptions {
  /** Size of the sliding window, in milliseconds. */
  windowMs: number;
  /** Max requests allowed for a key within the window. */
  max: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Milliseconds until the caller may retry, if not allowed. */
  retryAfterMs: number;
}

export function checkRateLimit(key: string, { windowMs, max }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key) ?? { timestamps: [] };

  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= max) {
    store.set(key, entry);
    const oldest = entry.timestamps[0];
    return { allowed: false, remaining: 0, retryAfterMs: Math.max(0, windowMs - (now - oldest)) };
  }

  entry.timestamps.push(now);
  store.set(key, entry);

  if (store.size > MAX_TRACKED_KEYS) {
    for (const [k, v] of store) {
      const alive = v.timestamps.some((t) => now - t < windowMs);
      if (!alive) store.delete(k);
    }
  }

  return { allowed: true, remaining: Math.max(0, max - entry.timestamps.length), retryAfterMs: 0 };
}
