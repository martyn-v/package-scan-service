import { PackageScanEvent } from '../models/package-scan';
import { ProcessResult } from '../models/process-result';
import { PackageScanRepository } from '../store/package-scan-repository';
import { validate, toProcessResult } from '../validation/validator';
import { packageScanSchema } from '../validation/package-scan-schema';

/** Service for processing package scan events. */
export class PackageScanService {
  /**
   * Creates a new PackageScanService.
   * @param repository - The repository used to persist events.
   */
  constructor(private readonly repository: PackageScanRepository) {}

  /**
   * Processes a package scan event with validation and idempotency check.
   * @param event - The package scan event to process.
   * @returns The processing result indicating accepted, accepted_with_warnings, or rejected.
   */
  async process(event: PackageScanEvent): Promise<ProcessResult> {
    const outcome = await validate(packageScanSchema, event);
    const validationResult = toProcessResult(outcome);

    if (validationResult?.status === 'rejected') {
      return validationResult;
    }

    const normalized = outcome.normalized!;

    if (this.repository.findById(normalized.eventId)) {
      return { status: 'rejected', reasons: ['duplicate_event'] };
    }

    this.repository.save(normalized);

    if (validationResult?.status === 'accepted_with_warnings') {
      return { ...validationResult, data: normalized };
    }

    return { status: 'accepted', data: normalized };
  }
}
