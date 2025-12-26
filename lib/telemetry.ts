import * as Sentry from '@sentry/node'

export function initTelemetry() {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) {
    console.warn('Sentry DSN not configured; telemetry disabled')
    return
  }
  Sentry.init({ dsn, environment: process.env.NODE_ENV || 'development' })
}

// simple in-memory metrics for prototype
const METRICS: Record<string, number> = {}
export function incr(metric: string, by = 1) {
  METRICS[metric] = (METRICS[metric] || 0) + by
}
export function getMetric(metric: string) {
  return METRICS[metric] || 0
}
