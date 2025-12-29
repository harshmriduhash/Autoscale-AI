'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DeploymentStatus } from '@/components/deployment-status'
import { DeploymentLogs } from '@/components/deployment-logs'
import { AdvancedAIInsights } from '@/components/advanced-ai-insights'
import { formatDate } from '@/lib/utils'
import { ExternalLink, RotateCcw, Loader2, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Deployment {
  id: string
  status: string
  url?: string | null
  version: number
  createdAt: string
  updatedAt: string
  aiOptimizations?: string[] | null
  project: {
    id: string
    name: string
    framework?: string | null
  }
}

export default function DeploymentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [deployment, setDeployment] = useState<Deployment | null>(null)
  const [loading, setLoading] = useState(true)
  const [rollingBack, setRollingBack] = useState(false)
  const [selfHealing, setSelfHealing] = useState<any>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchDeployment()
      // Poll for updates if deployment is still building
      const interval = setInterval(() => {
        fetchDeployment()
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [params.id, status, router])

  useEffect(() => {
    // Check for errors and trigger self-healing
    if (deployment?.status === 'failed') {
      checkForSelfHealing()
    }
  }, [deployment])

  const fetchDeployment = async () => {
    try {
      const response = await fetch(`/api/deployments/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setDeployment(data)
        // Stop polling if deployment is complete
        if (data.status === 'success' || data.status === 'failed') {
          setLoading(false)
        }
      } else if (response.status === 404) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching deployment:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkForSelfHealing = async () => {
    try {
      const logsRes = await fetch(`/api/deployments/${params.id}/logs`)
      if (logsRes.ok) {
        const logs = await logsRes.json()
        const errorLogs = logs.filter((log: any) => log.level === 'error')
        if (errorLogs.length > 0) {
          const errorText = errorLogs.map((log: any) => log.message).join('\n')
          const healingRes = await fetch('/api/ai/self-healing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ errorLog: errorText, codeContext: '' }),
          })
          if (healingRes.ok) {
            setSelfHealing(await healingRes.json())
          }
        }
      }
    } catch (error) {
      console.error('Error checking self-healing:', error)
    }
  }

  const handleRollback = async () => {
    if (!confirm('Are you sure you want to rollback to the previous deployment?')) {
      return
    }

    setRollingBack(true)
    try {
      const response = await fetch(`/api/deployments/${params.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rollback' }),
      })

      if (response.ok) {
        const newDeployment = await response.json()
        router.push(`/deployments/${newDeployment.id}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to rollback')
      }
    } catch (error) {
      console.error('Error rolling back:', error)
      alert('Failed to rollback')
    } finally {
      setRollingBack(false)
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

  if (!session || !deployment) {
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
          <Link href={`/projects/${deployment.project.id}`}>
            <Button variant="ghost" className="mb-4 text-white/80 hover:text-white hover:bg-white/10">
              ← Back to Project
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2"
              >
                Deployment v{deployment.version}
              </motion.h1>
              <p className="text-white/60">{deployment.project.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              {deployment.status === 'success' && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={handleRollback}
                    disabled={rollingBack}
                    className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    {rollingBack ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RotateCcw className="h-4 w-4 mr-2" />
                    )}
                    Rollback
                  </Button>
                </motion.div>
              )}
              {deployment.url && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white glow"
                  >
                    <a href={deployment.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Site
                    </a>
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Self-Healing Alert */}
        {selfHealing && selfHealing.confidence > 0.7 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="glass border-green-500/50 bg-green-500/10">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-white font-medium mb-1">AI Self-Healing Detected Issue</div>
                    <div className="text-white/70 text-sm mb-2">{selfHealing.diagnosis}</div>
                    {selfHealing.fix && (
                      <div className="text-white/60 text-sm">
                        <strong>Fix:</strong> {selfHealing.fix}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-blue-400" />
                <span>Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DeploymentStatus status={deployment.status} />
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Created:</span>
                  <span className="text-white/80">{formatDate(deployment.createdAt)}</span>
                </div>
                {deployment.updatedAt !== deployment.createdAt && (
                  <div className="flex justify-between text-white/60">
                    <span>Updated:</span>
                    <span className="text-white/80">{formatDate(deployment.updatedAt)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {deployment.aiOptimizations && deployment.aiOptimizations.length > 0 && (
            <Card className="glass border-white/10 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  <span>AI Optimization Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {deployment.aiOptimizations.map((suggestion, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="text-sm text-white/80 flex items-start space-x-2"
                    >
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>{suggestion}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <DeploymentLogs deploymentId={deployment.id} />
          <AdvancedAIInsights
            deploymentId={deployment.id}
            projectId={deployment.project.id}
          />
        </div>
      </div>
    </div>
  )
}