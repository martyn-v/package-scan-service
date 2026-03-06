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

  it('should delegate to repository.save when processing an event', () => {
    const repository = mock<PackageScanRepository>();
    const service = new PackageScanService(repository);

    service.process(event);

    expect(repository.save).toHaveBeenCalledWith(event);
  });
});
