import { z } from 'zod';
import { Tank01ValidationError } from '../errors/validation.js';

/**
 * Validate API response against a Zod schema
 *
 * @param data - Data to validate
 * @param schema - Zod schema to validate against
 * @returns Validated and typed data
 * @throws {Tank01ValidationError} If validation fails
 */
export function validateResponse<T>(data: unknown, schema: z.ZodSchema<T>): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);

    throw new Tank01ValidationError(`API response validation failed: ${errors.join(', ')}`, {
      validationErrors: errors,
      context: { data },
    });
  }

  return result.data;
}
