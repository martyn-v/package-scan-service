import { describe, it, expect } from 'vitest';
import { checkDimensionWarnings } from '../../src/validation/package-scan-warnings';
import { PackageScanEvent } from '../../src/models/package-scan';

const baseEvent: PackageScanEvent = {
  eventId: 'evt_001',
  source: 'edge-camera',
  timestamp: '2026-01-20T10:15:00Z',
  package: {
    trackingId: 'PKG-001',
    dimensions: { length: 120, width: 80, height: 60, unit: 'cm' },
    weight: { value: 25, unit: 'kg' },
  },
};

describe('checkDimensionWarnings', () => {
  it('should return no warnings for normal dimensions', () => {
    expect(checkDimensionWarnings(baseEvent)).toEqual([]);
  });

  it('should warn for all dimensions below 5', () => {
    const event = {
      ...baseEvent,
      package: {
        ...baseEvent.package,
        dimensions: { length: 1, width: 2, height: 3, unit: 'cm' },
      },
    };

    const warnings = checkDimensionWarnings(event);

    expect(warnings).toHaveLength(3);
    expect(warnings.some((w) => w.includes('length'))).toBe(true);
    expect(warnings.some((w) => w.includes('width'))).toBe(true);
    expect(warnings.some((w) => w.includes('height'))).toBe(true);
  });

  it('should warn for height exceeding 500', () => {
    const event = {
      ...baseEvent,
      package: {
        ...baseEvent.package,
        dimensions: { ...baseEvent.package.dimensions, height: 600 },
      },
    };

    const warnings = checkDimensionWarnings(event);

    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('height');
    expect(warnings[0]).toContain('600');
  });

  it('should not warn for dimensions at exactly 5', () => {
    const event = {
      ...baseEvent,
      package: {
        ...baseEvent.package,
        dimensions: { length: 5, width: 5, height: 5, unit: 'cm' },
      },
    };

    expect(checkDimensionWarnings(event)).toEqual([]);
  });
});
