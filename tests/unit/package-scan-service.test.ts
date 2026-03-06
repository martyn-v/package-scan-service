import { describe, it, expect } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { PackageScanService } from '../../src/services/package-scan-service';
import { PackageScanRepository } from '../../src/store/package-scan-repository';
import { PackageScanEvent } from '../../src/models/package-scan';

describe('PackageScanService', () => {
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

  it('should save and return accepted for a new event', async () => {
    const repository = mock<PackageScanRepository>();
    repository.findById.mockReturnValue(undefined);
    const service = new PackageScanService(repository);

    const result = await service.process(event);

    expect(repository.save).toHaveBeenCalled();
    expect(result.status).toBe('accepted');
    expect(result.normalizedEvent).toBeDefined();
    expect(result.normalizedEvent!.eventId).toBe(event.eventId);
  });

  it('should reject a duplicate event without saving', async () => {
    const repository = mock<PackageScanRepository>();
    repository.findById.mockReturnValue(event);
    const service = new PackageScanService(repository);

    const result = await service.process(event);

    expect(repository.save).not.toHaveBeenCalled();
    expect(result).toEqual({ status: 'rejected', reasons: ['duplicate_event'] });
  });

  it('should reject an invalid event without saving', async () => {
    const repository = mock<PackageScanRepository>();
    const service = new PackageScanService(repository);

    const invalidEvent = { eventId: 'evt_bad' } as PackageScanEvent;
    const result = await service.process(invalidEvent);

    expect(repository.save).not.toHaveBeenCalled();
    expect(result.status).toBe('rejected');
    expect(result.reasons).toBeDefined();
    expect(result.reasons!.length).toBeGreaterThan(0);
  });
});
