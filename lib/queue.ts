import { processDeploymentJob } from './deployWorker'

type Job = {
  id: string
  projectId: string
  projectName: string
  framework: string | null
  buildCommand: string | null
  outputDirectory: string | null
}

const queue: Job[] = []
let running = false

function dequeue() {
  return queue.shift()
}

async function workerLoop() {
  if (running) return
  running = true
  while (queue.length > 0) {
    const job = dequeue()!
    try {
      // Convert Job to the expected shape for processDeploymentJob
      await processDeploymentJob({
        deploymentId: job.id,
        projectId: job.projectId,
        projectName: job.projectName,
        framework: job.framework,
        buildCommand: job.buildCommand,
        outputDirectory: job.outputDirectory,
      })
    } catch (err) {
      console.error('Error processing job:', err)
    }
  }
  running = false
}

export function enqueueDeploymentJob(job: Job) {
  queue.push(job)
  // Schedule worker loop
  setImmediate(workerLoop)
}

export function queueSize() {
  return queue.length
}
