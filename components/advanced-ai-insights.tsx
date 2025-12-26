'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Brain, TrendingUp, Shield, DollarSign, Zap, AlertTriangle, 
  CheckCircle, Loader2, Activity, Cpu, Lock 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AdvancedAIInsightsProps {
  deploymentId: string
  projectId: string
}

export function AdvancedAIInsights({ deploymentId, projectId }: AdvancedAIInsightsProps) {
  const [activeTab, setActiveTab] = useState<'intelligence' | 'healing' | 'scaling' | 'finops' | 'security'>('intelligence')
  const [buildIntelligence, setBuildIntelligence] = useState<any>(null)
  const [selfHealing, setSelfHealing] = useState<any>(null)
  const [scaling, setScaling] = useState<any>(null)
  const [finops, setFinops] = useState<any>(null)
  const [security, setSecurity] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllInsights()
  }, [deploymentId, projectId])

  const fetchAllInsights = async () => {
    setLoading(true)
    try {
      // Fetch build intelligence
      const biRes = await fetch('/api/ai/build-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, buildHistory: [], currentChanges: [] }),
      })
      if (biRes.ok) setBuildIntelligence(await biRes.json())

      // Fetch advanced scaling
      const scalingRes = await fetch('/api/ai/scaling-advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      })
      if (scalingRes.ok) setScaling(await scalingRes.json())

      // Fetch FinOps
      const finopsRes = await fetch('/api/ai/finops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usage: { functionInvocations: 10000, memoryGB: 2, executionTime: 1000, storageGB: 5 },
          functions: [{ name: 'api', memoryMB: 256, invocations: 5000 }],
        }),
      })
      if (finopsRes.ok) setFinops(await finopsRes.json())

      // Fetch security scan
      const securityRes = await fetch('/api/ai/security-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dependencies: [], codeSnippets: [] }),
      })
      if (securityRes.ok) setSecurity(await securityRes.json())
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'intelligence', label: 'Build Intelligence', icon: Brain },
    { id: 'healing', label: 'Self-Healing', icon: Zap },
    { id: 'scaling', label: 'Predictive Scaling', icon: TrendingUp },
    { id: 'finops', label: 'FinOps', icon: DollarSign },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Brain className="h-5 w-5 text-blue-400" />
          <span>Advanced AI Insights</span>
        </CardTitle>
        <div className="flex space-x-2 mt-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center space-x-1 transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </motion.button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'intelligence' && buildIntelligence && (
              <motion.div
                key="intelligence"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80">Predicted Build Time</span>
                    <Badge className="bg-blue-500/20 text-blue-300">
                      {buildIntelligence.predictedBuildTime}s
                    </Badge>
                  </div>
                  <div className="text-sm text-white/60">
                    {buildIntelligence.shouldRebuild ? 'Full rebuild recommended' : 'Incremental build possible'}
                  </div>
                </div>
                {buildIntelligence.optimizations && buildIntelligence.optimizations.length > 0 && (
                  <div>
                    <h4 className="text-white/80 mb-2">Optimizations</h4>
                    <ul className="space-y-2">
                      {buildIntelligence.optimizations.map((opt: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-2 text-sm text-white/70">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{opt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'scaling' && scaling && (
              <motion.div
                key="scaling"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {scaling.trafficSpikes && scaling.trafficSpikes.length > 0 && (
                  <div>
                    <h4 className="text-white/80 mb-2">Predicted Traffic Spikes</h4>
                    <div className="space-y-2">
                      {scaling.trafficSpikes.slice(0, 3).map((spike: any, idx: number) => (
                        <div key={idx} className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <div className="flex items-center justify-between">
                            <span className="text-white/80 text-sm">{spike.time}</span>
                            <Badge className="bg-blue-500/20 text-blue-300">
                              {spike.predictedRPS} RPS
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {scaling.scalingRecommendations && scaling.scalingRecommendations.length > 0 && (
                  <div>
                    <h4 className="text-white/80 mb-2">Recommendations</h4>
                    <ul className="space-y-2">
                      {scaling.scalingRecommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="text-sm text-white/70 flex items-start space-x-2">
                          <Activity className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'finops' && finops && (
              <motion.div
                key="finops"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80">Predicted Monthly Cost</span>
                    <Badge className="bg-green-500/20 text-green-300">
                      ${finops.predictedMonthlyCost?.toFixed(2) || '0.00'}
                    </Badge>
                  </div>
                </div>
                {finops.optimizations && finops.optimizations.length > 0 && (
                  <div>
                    <h4 className="text-white/80 mb-2">Cost Optimizations</h4>
                    <div className="space-y-2">
                      {finops.optimizations.slice(0, 3).map((opt: any, idx: number) => (
                        <div key={idx} className="p-3 bg-white/5 rounded-lg">
                          <div className="text-sm text-white/80 font-medium">{opt.function}</div>
                          <div className="text-xs text-white/60 mt-1">{opt.suggestion}</div>
                          <div className="text-xs text-green-400 mt-1">Savings: {opt.savings}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'security' && security && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {security.vulnerabilities && security.vulnerabilities.length > 0 ? (
                  <div>
                    <h4 className="text-white/80 mb-2 flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span>Vulnerabilities Found</span>
                    </h4>
                    <div className="space-y-2">
                      {security.vulnerabilities.slice(0, 3).map((vuln: any, idx: number) => (
                        <div key={idx} className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white/80 text-sm font-medium">{vuln.dependency}</span>
                            <Badge variant="destructive">{vuln.severity}</Badge>
                          </div>
                          <div className="text-xs text-white/60 mt-1">{vuln.description}</div>
                          <div className="text-xs text-green-400 mt-1">Fix: {vuln.fix}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 text-center">
                    <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <div className="text-white/80">No security issues detected</div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  )
}

