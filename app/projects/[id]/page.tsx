'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DeploymentStatus } from '@/components/deployment-status'
import { formatDate } from '@/lib/utils'
import { Rocket, GitBranch, Calendar, ExternalLink, Loader2, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Deployment {
  id: string
  status: string
  url?: string | null
  version: number
  createdAt: string
  _count?: {
    logs: number
  }
}

interface Project {
  id: string
  name: string
  description?: string | null
  framework?: string | null
  repoUrl?: string | null
  buildCommand?: string | null
  outputDirectory?: string | null
  createdAt: string
  deployments: Deployment[]
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchProject()
    }
  }, [params.id, status, router])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      } else if (response.status === 404) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeploy = async () => {
    try {
      const response = await fetch('/api/deployments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: params.id }),
      })

      if (response.ok) {
        const deployment = await response.json()
        router.push(`/deployments/${deployment.id}`)
      } else {
        alert('Failed to start deployment')
      }
    } catch (error) {
      console.error('Error deploying:', error)
      alert('Failed to start deployment')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone and will delete all deployments.')) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    } finally {
      setDeleting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-blue-400" />
        </motion.div>
      </div>
    )
  }

  if (!session || !project) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black pt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4 text-white/80 hover:text-white hover:bg-white/10">
              ← Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                {project.name}
              </h1>
              {project.description && (
                <p className="text-white/60 mt-2">{project.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href={`/projects/${params.id}/edit`}>
                  <Button variant="outline" className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600/20 border-red-500/50 text-red-400 hover:bg-red-600/30"
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleDeploy}
                  className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white glow"
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass border-white/10 hover:border-blue-500/50 transition-all">
              <CardHeader>
                <CardTitle className="text-white">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.framework && (
                  <div>
                    <span className="text-sm text-white/60">Framework:</span>
                    <Badge className="ml-2 bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {project.framework}
                    </Badge>
                  </div>
                )}
                {project.repoUrl && (
                  <div className="flex items-center space-x-2">
                    <GitBranch className="h-4 w-4 text-blue-400" />
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      {project.repoUrl}
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-white/60">
                    Created {formatDate(project.createdAt)}
                  </span>
                </div>
                {project.buildCommand && (
                  <div>
                    <span className="text-sm text-white/60">Build Command:</span>
                    <code className="ml-2 text-sm bg-white/5 px-2 py-1 rounded text-blue-300 border border-white/10">
                      {project.buildCommand}
                    </code>
                  </div>
                )}
                {project.outputDirectory && (
                  <div>
                    <span className="text-sm text-white/60">Output Directory:</span>
                    <code className="ml-2 text-sm bg-white/5 px-2 py-1 rounded text-blue-300 border border-white/10">
                      {project.outputDirectory}
                    </code>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass border-white/10 hover:border-blue-500/50 transition-all">
              <CardHeader>
                <CardTitle className="text-white">Recent Deployments</CardTitle>
              </CardHeader>
              <CardContent>
                {project.deployments.length === 0 ? (
                  <p className="text-white/60 text-sm">No deployments yet</p>
                ) : (
                  <div className="space-y-3">
                    {project.deployments.slice(0, 5).map((deployment, idx) => (
                      <motion.div
                        key={deployment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-3 border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer transition-all"
                        onClick={() => router.push(`/deployments/${deployment.id}`)}
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-white">v{deployment.version}</span>
                            <DeploymentStatus status={deployment.status} />
                          </div>
                          <p className="text-xs text-white/60 mt-1">
                            {formatDate(deployment.createdAt)}
                          </p>
                        </div>
                        {deployment.url && (
                          <a
                            href={deployment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-4 w-4 text-white/60 hover:text-blue-400 transition-colors" />
                          </a>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
