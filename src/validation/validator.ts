import Joi from 'joi';
import { ProcessResult } from '../models/process-result';

/** Validation outcome containing errors and warnings. */
export interface ValidationOutcome {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a payload against a Joi schema, separating errors from warnings.
 * @param schema - The Joi schema to validate against.
 * @param payload - The data to validate.
 * @returns The validation outcome with errors and warnings.
 */
export async function validate(schema: Joi.ObjectSchema, payload: unknown): Promise<ValidationOutcome> {
  try {
    const { warning } = await schema.validateAsync(payload, {
      abortEarly: false,
      warnings: true,
    } as Joi.AsyncValidationOptions & { warnings: boolean });

    const warnings = warning?.details.map((d: Joi.ValidationErrorItem) => d.message) ?? [];

    return { valid: true, errors: [], warnings };
  } catch (err) {
    if (Joi.isError(err)) {
      return {
        valid: false,
        errors: err.details.map((d) => d.message),
        warnings: [],
      };
    }
    throw err;
  }
}

/**
 * Converts a validation outcome into a ProcessResult.
 * @param outcome - The validation outcome to convert.
 * @returns A rejected result if errors exist, accepted_with_warnings if only warnings, or null if clean.
 */
export function toProcessResult(outcome: ValidationOutcome): ProcessResult | null {
  if (!outcome.valid) {
    return { status: 'rejected', reasons: outcome.errors };
  }

  if (outcome.warnings.length > 0) {
    return { status: 'accepted_with_warnings', warnings: outcome.warnings };
  }

  return null;
}
