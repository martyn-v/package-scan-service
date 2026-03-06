import { describe, it, expect } from 'vitest';
import { validate, toProcessResult } from '../../src/validation/validator';
import { packageScanSchema } from '../../src/validation/package-scan-schema';

const validPayload = {
  eventId: 'evt_001',
  source: 'edge-camera',
  timestamp: '2026-01-20T10:15:00Z',
  package: {
    trackingId: 'PKG-001',
    dimensions: { length: 120, width: 80, height: 60, unit: 'cm' },
    weight: { value: 25, unit: 'kg' },
  },
};

describe('validate', () => {
  it('should return valid with no errors for a correct payload', async () => {
    const result = await validate(packageScanSchema, validPayload);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it('should return errors for missing required fields', async () => {
    const result = await validate(packageScanSchema, {});

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should return errors for invalid field types', async () => {
    const result = await validate(packageScanSchema, {
      ...validPayload,
      package: {
        ...validPayload.package,
        dimensions: { ...validPayload.package.dimensions, length: -5 },
      },
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('length'))).toBe(true);
  });
});

describe('toProcessResult', () => {
  it('should return null for a clean validation', () => {
    const result = toProcessResult({ valid: true, errors: [], warnings: [] });

    expect(result).toBeNull();
  });

  it('should return rejected with reasons for errors', () => {
    const result = toProcessResult({ valid: false, errors: ['bad_field'], warnings: [] });

    expect(result).toEqual({ status: 'rejected', reasons: ['bad_field'] });
  });

  it('should return accepted_with_warnings for warnings only', () => {
    const result = toProcessResult({ valid: true, errors: [], warnings: ['some_warning'] });

    expect(result).toEqual({ status: 'accepted_with_warnings', warnings: ['some_warning'] });
  });
});
