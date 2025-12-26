import OpenAI from 'openai'
import { z } from 'zod'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function getAIOptimizationSuggestions(
  framework: string,
  buildCommand: string | null,
  outputDirectory: string | null
): Promise<string[]> {
  if (!process.env.OPENAI_API_KEY) {
    return [
      'Consider using incremental builds for faster deployment',
      'Enable caching for node_modules to reduce build time',
      'Optimize bundle size with tree-shaking',
    ]
  }

  try {
    const prompt = `As an expert DevOps engineer, analyze this deployment configuration and provide 3-5 specific optimization suggestions:

Framework: ${framework}
Build Command: ${buildCommand || 'Not specified'}
Output Directory: ${outputDirectory || 'Not specified'}

Provide concise, actionable suggestions (one per line) for improving build performance, bundle size, or deployment speed.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert DevOps engineer specializing in deployment optimization. Provide concise, actionable suggestions.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    const suggestions = completion.choices[0]?.message?.content
      ?.split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 5) || []

    return suggestions.length > 0
      ? suggestions
      : ['Enable build caching', 'Optimize dependencies', 'Use incremental builds']
  } catch (error) {
    console.error('OpenAI API error:', error)
    return [
      'Enable build caching for faster deployments',
      'Optimize dependencies to reduce bundle size',
      'Use incremental builds when possible',
    ]
  }
}

const AnalyzeResponseSchema = z.object({
  errors: z.array(z.object({ message: z.string(), suggestion: z.string() })),
  summary: z.string(),
})

export async function analyzeLogsForErrors(logs: Array<{ level: string; message: string }>): Promise<{
  errors: Array<{ message: string; suggestion: string }>
  summary: string
}> {
  if (!process.env.OPENAI_API_KEY) {
    const errorLogs = logs.filter((log) => log.level === 'error')
    return {
      errors: errorLogs.map((log) => ({
        message: log.message,
        suggestion: 'Review the error message and check your code for syntax or runtime issues.',
      })),
      summary: `Found ${errorLogs.length} error(s) in the deployment logs.`,
    }
  }

  try {
    const logText = logs
      .slice(-50) // Last 50 logs
      .map((log) => `[${log.level.toUpperCase()}] ${log.message}`)
      .join('\n')

    const prompt = `Analyze these deployment logs and identify errors. For each error, provide:
1. A clear description of the error
2. A specific suggestion to fix it

Logs:
${logText}

Format your response as JSON:
{
  "errors": [
    {"message": "error description", "suggestion": "fix suggestion"}
  ],
  "summary": "brief summary of issues found"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert developer debugging deployment issues. Analyze logs and provide actionable fixes.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const raw = completion.choices[0]?.message?.content || '{}'
    let parsed: any = {}
    try {
      parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    } catch (err) {
      console.error('Failed to parse AI response as JSON:', err, 'raw:', raw)
      // Fallback to returning basic error list
      const errorLogs = logs.filter((log) => log.level === 'error')
      return {
        errors: errorLogs.map((log) => ({
          message: log.message,
          suggestion: 'Review the error message and check your code.',
        })),
        summary: `Found ${errorLogs.length} error(s) in the deployment logs.`,
      }
    }

    // Validate structure using Zod
    const validated = AnalyzeResponseSchema.safeParse(parsed)
    if (!validated.success) {
      console.error('AI output did not match expected schema:', validated.error)
      const errorLogs = logs.filter((log) => log.level === 'error')
      return {
        errors: errorLogs.map((log) => ({
          message: log.message,
          suggestion: 'Review the error message and check your code.',
        })),
        summary: `Found ${errorLogs.length} error(s) in the deployment logs.`,
      }
    }

    return {
      errors: validated.data.errors,
      summary: validated.data.summary,
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    const errorLogs = logs.filter((log) => log.level === 'error')
    return {
      errors: errorLogs.map((log) => ({
        message: log.message,
        suggestion: 'Review the error message and check your code.',
      })),
      summary: `Found ${errorLogs.length} error(s) in the deployment logs.`,
    }
  }
}

export async function summarizeLogs(logs: Array<{ level: string; message: string; timestamp: Date }>): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    const errorCount = logs.filter((log) => log.level === 'error').length
    const warningCount = logs.filter((log) => log.level === 'warning').length
    return `Deployment completed with ${errorCount} error(s) and ${warningCount} warning(s).`
  }

  try {
    const logText = logs
      .slice(-100) // Last 100 logs
      .map((log) => `[${log.level.toUpperCase()}] ${log.message}`)
      .join('\n')

    const prompt = `Summarize these deployment logs in 2-3 sentences. Highlight:
- Overall status (success/failure)
- Key milestones or stages
- Critical issues if any

Logs:
${logText}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a deployment monitoring system. Provide concise, informative summaries.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.5,
    })

    return completion.choices[0]?.message?.content || 'Deployment logs processed.'
  } catch (error) {
    console.error('OpenAI API error:', error)
    const errorCount = logs.filter((log) => log.level === 'error').length
    return `Deployment completed with ${errorCount} error(s).`
  }
}

export async function predictScalingNeeds(
  projectId: string,
  recentDeployments: number
): Promise<{ prediction: string; recommendations: string[] }> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      prediction: 'Moderate traffic expected',
      recommendations: [
        'Monitor response times closely',
        'Consider enabling auto-scaling',
        'Set up alerts for high traffic',
      ],
    }
  }

  try {
    const prompt = `Based on deployment activity (${recentDeployments} recent deployments), predict scaling needs and provide recommendations.

Provide a JSON response:
{
  "prediction": "brief prediction (1 sentence)",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a cloud infrastructure expert. Provide scaling predictions and recommendations.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.6,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}')
    return {
      prediction: result.prediction || 'Moderate traffic expected',
      recommendations: result.recommendations || [
        'Monitor response times',
        'Enable auto-scaling',
        'Set up alerts',
      ],
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    return {
      prediction: 'Moderate traffic expected',
      recommendations: [
        'Monitor response times closely',
        'Consider enabling auto-scaling',
        'Set up alerts for high traffic',
      ],
    }
  }
}

