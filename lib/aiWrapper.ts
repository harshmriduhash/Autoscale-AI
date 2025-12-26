import { z } from 'zod'
import { AnalyzeSchema, DocsSchema, PipelineSchema, RefactorSchema } from './aiValidators'

export async function parseAndValidateAIResponse<T extends z.ZodTypeAny>(raw: any, schema: T) {
  // raw may be string or object
  let obj: unknown = raw
  if (typeof raw === 'string') {
    try {
      obj = JSON.parse(raw)
    } catch (err) {
      // some models return JS-like objects; attempt to recover with fallback
      obj = {}
    }
  }

  const parsed = schema.safeParse(obj)
  if (!parsed.success) {
    throw parsed.error
  }
  return parsed.data
}

// exports for common schemas
export const Schemas = {
  pipeline: PipelineSchema,
  docs: DocsSchema,
  refactor: RefactorSchema,
  analyze: AnalyzeSchema,
}
