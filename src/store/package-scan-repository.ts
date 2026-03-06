import { PackageScanEvent } from '../models/package-scan';

/** Repository interface for persisting package scan events. */
export interface PackageScanRepository {
  /**
   * Saves a package scan event.
   * @param event - The event to persist.
   */
  save(event: PackageScanEvent): void;

  /**
   * Retrieves a package scan event by its event ID.
   * @param eventId - The ID of the event to find.
   * @returns The event if found, or undefined.
   */
  findById(eventId: string): PackageScanEvent | undefined;

  /**
   * Returns all stored package scan events.
   * @returns An array of all events.
   */
  findAll(): PackageScanEvent[];
}

/** In-memory implementation of PackageScanRepository. */
export class InMemoryPackageScanRepository implements PackageScanRepository {
  private readonly events: Map<string, PackageScanEvent> = new Map();

  /** @inheritdoc */
  save(event: PackageScanEvent): void {
    this.events.set(event.eventId, event);
  }

  /** @inheritdoc */
  findById(eventId: string): PackageScanEvent | undefined {
    return this.events.get(eventId);
  }

  /** @inheritdoc */
  findAll(): PackageScanEvent[] {
    return Array.from(this.events.values());
  }
}
