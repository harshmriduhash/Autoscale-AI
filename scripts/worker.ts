#!/usr/bin/env node
import './env'
import { createDeploymentWorker } from '@/lib/queueRedis'

async function main() {
  console.log('Starting deployment worker...')
  const worker = createDeploymentWorker()

  worker.on('completed', (job) => {
    console.log('Job completed', job.id)
  })
  worker.on('failed', (job, err) => {
    console.error('Job failed', job?.id, err)
  })

  // keep process alive
  process.on('SIGINT', async () => {
    await worker.close()
    process.exit(0)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
