import { Queue, Worker, QueueScheduler, Job } from 'bullmq'
import IORedis from 'ioredis'
import path from 'path'

const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379')

export const deploymentsQueue = new Queue('deployments', { connection })
new QueueScheduler('deployments', { connection })

export async function enqueueDeploymentJobRedis(payload: any) {
  return deploymentsQueue.add('deployment', payload, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } })
}

// minimal worker scaffold — users should run scripts/worker.ts in a separate process
export function createDeploymentWorker() {
  const worker = new Worker('deployments', async (job: Job) => {
    // defer to existing in-process worker logic when available
    try {
      const modulePath = path.resolve(process.cwd(), 'lib', 'deployWorker.js')
      // dynamic import so we can reuse existing logic if compiled
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const workerModule = require(modulePath)
      if (workerModule && typeof workerModule.processDeploymentJob === 'function') {
        await workerModule.processDeploymentJob(job.data)
      }
    } catch (err) {
      console.error('Deployment worker error:', err)
      throw err
    }
  }, { connection })

  return worker
}
