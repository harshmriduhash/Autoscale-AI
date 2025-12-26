'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react'

interface AIInsightsProps {
  deploymentId: string
  projectId: string
}

export function AIInsights({ deploymentId, projectId }: AIInsightsProps) {
  const [logAnalysis, setLogAnalysis] = useState<any>(null)
  const [summary, setSummary] = useState<string | null>(null)
  const [scaling, setScaling] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        // Fetch log analysis
        const analysisRes = await fetch('/api/ai/analyze-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deploymentId }),
        })
        if (analysisRes.ok) {
          setLogAnalysis(await analysisRes.json())
        }

        // Fetch summary
        const summaryRes = await fetch('/api/ai/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deploymentId }),
        })
        if (summaryRes.ok) {
          const data = await summaryRes.json()
          setSummary(data.summary)
        }

        // Fetch scaling prediction
        const scalingRes = await fetch('/api/ai/scaling', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId }),
        })
        if (scalingRes.ok) {
          setScaling(await scalingRes.json())
        }
      } catch (error) {
        console.error('Error fetching AI insights:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [deploymentId, projectId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>AI Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Loading AI insights...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>AI Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {summary && (
            <div>
              <h4 className="font-semibold mb-2">Deployment Summary</h4>
              <p className="text-sm text-muted-foreground">{summary}</p>
            </div>
          )}

          {logAnalysis?.errors && logAnalysis.errors.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span>Detected Issues</span>
              </h4>
              <div className="space-y-2">
                {logAnalysis.errors.map((error: any, idx: number) => (
                  <div key={idx} className="p-3 bg-destructive/10 rounded-lg">
                    <p className="text-sm font-medium">{error.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      💡 {error.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {scaling && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Scaling Prediction</span>
              </h4>
              <p className="text-sm text-muted-foreground mb-2">{scaling.prediction}</p>
              {scaling.recommendations && scaling.recommendations.length > 0 && (
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {scaling.recommendations.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

