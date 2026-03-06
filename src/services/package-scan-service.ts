import { PackageScanEvent } from '../models/package-scan';
import { PackageScanRepository } from '../store/package-scan-repository';

/** Service for processing package scan events. */
export class PackageScanService {
  /**
   * Creates a new PackageScanService.
   * @param repository - The repository used to persist events.
   */
  constructor(private readonly repository: PackageScanRepository) {}

  /**
   * Processes and persists a package scan event.
   * @param event - The package scan event to process.
   */
  process(event: PackageScanEvent): void {
    this.repository.save(event);
  }
}
