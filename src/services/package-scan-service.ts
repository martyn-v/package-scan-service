import { PackageScanEvent } from '../models/package-scan';
import { PackageScanRepository } from '../store/package-scan-repository';

/** Result of processing a package scan event. */
export interface ProcessResult {
  status: 'accepted' | 'rejected';
  reasons?: string[];
}

/** Service for processing package scan events. */
export class PackageScanService {
  /**
   * Creates a new PackageScanService.
   * @param repository - The repository used to persist events.
   */
  constructor(private readonly repository: PackageScanRepository) {}

  /**
   * Processes a package scan event with idempotency check.
   * @param event - The package scan event to process.
   * @returns The processing result indicating accepted or rejected.
   */
  process(event: PackageScanEvent): ProcessResult {
    if (this.repository.findById(event.eventId)) {
      return { status: 'rejected', reasons: ['duplicate_event'] };
    }

    this.repository.save(event);
    return { status: 'accepted' };
  }
}
