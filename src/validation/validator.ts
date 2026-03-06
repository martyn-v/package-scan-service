import Joi from 'joi';
import { PackageScanEvent } from '../models/package-scan';
import { ProcessResult } from '../models/process-result';
import { checkDimensionWarnings } from './package-scan-warnings';

/** Validation outcome containing errors and warnings. */
export interface ValidationOutcome {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a package scan payload against the Joi schema and checks for warnings.
 * @param schema - The Joi schema to validate against.
 * @param payload - The data to validate.
 * @returns The validation outcome with errors and warnings.
 */
export async function validate(schema: Joi.ObjectSchema, payload: unknown): Promise<ValidationOutcome> {
  try {
    await schema.validateAsync(payload, { abortEarly: false });

    const warnings = checkDimensionWarnings(payload as PackageScanEvent);

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
