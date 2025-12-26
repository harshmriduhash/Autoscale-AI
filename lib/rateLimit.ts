import { z } from 'zod'

type Bucket = {
  tokens: number
  lastRefill: number
}

const BUCKETS = new Map<string, Bucket>()

// Simple token bucket: 60 tokens per minute
const CAPACITY = 60
const REFILL_PERIOD_MS = 60_000

export function checkRateLimit(userId: string, tokens = 1) {
  const now = Date.now()
  let bucket = BUCKETS.get(userId)
  if (!bucket) {
    bucket = { tokens: CAPACITY, lastRefill: now }
    BUCKETS.set(userId, bucket)
  }

  // refill
  const elapsed = now - bucket.lastRefill
  if (elapsed > 0) {
    const refillAmount = Math.floor((elapsed / REFILL_PERIOD_MS) * CAPACITY)
    if (refillAmount > 0) {
      bucket.tokens = Math.min(CAPACITY, bucket.tokens + refillAmount)
      bucket.lastRefill = now
    }
  }

  if (bucket.tokens < tokens) {
    return { ok: false, remaining: bucket.tokens }
  }

  bucket.tokens -= tokens
  return { ok: true, remaining: bucket.tokens }
}

export function resetRateLimit(userId: string) {
  BUCKETS.delete(userId)
}
