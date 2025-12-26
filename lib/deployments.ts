import { prisma } from './db'
import { enqueueDeploymentJob } from './queue'

export async function simulateDeployment(
  projectId: string,
  projectName: string,
  framework: string | null,
  buildCommand: string | null,
  outputDirectory: string | null
) {
  // Find the latest pending deployment for this project
  const deployment = await prisma.deployment.findFirst({
    where: {
      projectId,
      status: 'pending',
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!deployment) {
    throw new Error('Deployment not found')
  }

  // Enqueue a job to be processed by the in-process queue.
  enqueueDeploymentJob({
    id: deployment.id,
    projectId,
    projectName,
    framework,
    buildCommand,
    outputDirectory,
  })

  // Return deployment id immediately — processing happens in background
  return deployment.id
}

export async function getDeploymentLogs(deploymentId: string) {
  return prisma.log.findMany({
    where: { deploymentId },
    orderBy: { timestamp: 'asc' },
  })
}

