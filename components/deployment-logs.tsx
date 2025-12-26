'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Terminal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Log {
  id: string
  level: string
  message: string
  timestamp: string
}

interface DeploymentLogsProps {
  deploymentId: string
}

export function DeploymentLogs({ deploymentId }: DeploymentLogsProps) {
  const [logs, setLogs] = useState<Log[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`/api/deployments/${deploymentId}/logs`)
        if (response.ok) {
          const data = await response.json()
          setLogs(data)
        }
      } catch (error) {
        console.error('Error fetching logs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()

    // Poll for new logs every 2 seconds if deployment might still be building
    const interval = setInterval(fetchLogs, 2000)

    return () => clearInterval(interval)
  }, [deploymentId])

  const getLogColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'text-red-400'
      case 'warning':
        return 'text-yellow-400'
      case 'success':
        return 'text-green-400'
      default:
        return 'text-blue-300'
    }
  }

  const getLogBg = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'bg-red-500/10 border-red-500/20'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20'
      case 'success':
        return 'bg-green-500/10 border-green-500/20'
      default:
        return 'bg-white/5 border-white/10'
    }
  }

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
            <Terminal className="h-5 w-5 text-blue-400" />
          <span>Deployment Logs</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-black/50 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto border border-white/10">
          {isLoading ? (
            <div className="text-blue-400 animate-pulse">Loading logs...</div>
          ) : logs.length === 0 ? (
            <div className="text-white/60">No logs available yet</div>
          ) : (
            <AnimatePresence>
              {logs.map((log, idx) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`mb-2 p-2 rounded ${getLogBg(log.level)} border`}
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-white/40 text-xs mt-1">
                      [{new Date(log.timestamp).toLocaleTimeString()}]
                    </span>
                    <Badge
                      variant={
                        log.level === 'error'
                          ? 'destructive'
                          : log.level === 'warning'
                          ? 'warning'
                          : log.level === 'success'
                          ? 'success'
                          : 'default'
                      }
                      className="text-xs mr-2"
                    >
                      {log.level.toUpperCase()}
                    </Badge>
                    <span className={getLogColor(log.level)}>{log.message}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
