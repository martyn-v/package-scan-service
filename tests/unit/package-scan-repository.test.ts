import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryPackageScanRepository } from '../../src/store/package-scan-repository';
import { PackageScanEvent } from '../../src/models/package-scan';

describe('InMemoryPackageScanRepository', () => {
  let repository: InMemoryPackageScanRepository;

  const event: PackageScanEvent = {
    eventId: 'evt_001',
    source: 'edge-camera',
    timestamp: '2026-01-20T10:15:00Z',
    package: {
      trackingId: 'PKG-001',
      dimensions: { length: 120, width: 80, height: 60, unit: 'cm' },
      weight: { value: 25, unit: 'kg' },
    },
  };

  beforeEach(() => {
    repository = new InMemoryPackageScanRepository();
  });

  it('should save and retrieve an event by ID', () => {
    repository.save(event);

    expect(repository.findById('evt_001')).toEqual(event);
  });

  it('should return undefined for unknown event ID', () => {
    expect(repository.findById('nonexistent')).toBeUndefined();
  });

  it('should return all saved events', () => {
    const event2: PackageScanEvent = { ...event, eventId: 'evt_002' };
    repository.save(event);
    repository.save(event2);

    expect(repository.findAll()).toEqual([event, event2]);
  });
});
