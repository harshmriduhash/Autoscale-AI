import { z } from 'zod'

export const PipelineSchema = z.object({
  config: z.object({
    build: z.string().optional(),
    install: z.string().optional(),
    cache: z.array(z.string()).optional(),
    test: z.string().optional(),
  }).optional(),
  githubActions: z.string().optional(),
  vercelConfig: z.string().optional(),
  optimizations: z.array(z.string()).optional(),
})

export const DocsSchema = z.object({
  apiDocs: z.string().optional(),
  architecture: z.string().optional(),
  readme: z.string().optional(),
  erd: z.string().optional(),
  deploymentGuide: z.string().optional(),
})

export const RefactorSchema = z.object({
  refactoredCode: z.string().optional(),
  changes: z.array(z.string()).optional(),
  improvements: z.array(z.string()).optional(),
  explanation: z.string().optional(),
})

export const AnalyzeSchema = z.object({
  errors: z.array(z.object({ message: z.string(), suggestion: z.string() })),
  summary: z.string(),
})
