import { z } from 'zod';

/**
 * Zod schema for validating client configuration
 */
export const ClientConfigurationSchema = z.object({
  apiKey: z.string().min(1, 'API key must not be empty'),
  baseUrl: z.string().url('Base URL must be a valid URL'),
  timeout: z.number().positive('Timeout must be a positive number'),
  maxRetries: z.number().nonnegative('Max retries must be non-negative'),
  debug: z.boolean(),
});

export type ValidatedClientConfiguration = z.infer<typeof ClientConfigurationSchema>;
