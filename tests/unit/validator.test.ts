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

  it('should reject negative dimensions', async () => {
    const result = await validate(packageScanSchema, {
      ...validPayload,
      package: {
        ...validPayload.package,
        dimensions: { length: -10, width: -5, height: -2, unit: 'cm' },
      },
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('length'))).toBe(true);
    expect(result.errors.some((e) => e.includes('width'))).toBe(true);
    expect(result.errors.some((e) => e.includes('height'))).toBe(true);
  });

  it('should reject missing dimensions', async () => {
    const { dimensions: _dims, ...packageWithoutDimensions } = validPayload.package;
    const result = await validate(packageScanSchema, {
      ...validPayload,
      package: packageWithoutDimensions,
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('dimensions'))).toBe(true);
  });

  it('should reject a timestamp in the future', async () => {
    const result = await validate(packageScanSchema, {
      ...validPayload,
      timestamp: '2099-01-01T00:00:00Z',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('timestamp'))).toBe(true);
  });

  it('should reject zero dimensions', async () => {
    const result = await validate(packageScanSchema, {
      ...validPayload,
      package: {
        ...validPayload.package,
        dimensions: { length: 0, width: 0, height: 0, unit: 'cm' },
      },
    });

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should warn for dimensions below 5', async () => {
    const result = await validate(packageScanSchema, {
      ...validPayload,
      package: {
        ...validPayload.package,
        dimensions: { length: 2, width: 3, height: 1, unit: 'cm' },
      },
    });

    expect(result.valid).toBe(true);
    expect(result.warnings.some((w) => w.includes('length'))).toBe(true);
    expect(result.warnings.some((w) => w.includes('width'))).toBe(true);
    expect(result.warnings.some((w) => w.includes('height'))).toBe(true);
  });

  it('should warn for height greater than 500', async () => {
    const result = await validate(packageScanSchema, {
      ...validPayload,
      package: {
        ...validPayload.package,
        dimensions: { ...validPayload.package.dimensions, height: 600 },
      },
    });

    expect(result.valid).toBe(true);
    expect(result.warnings.some((w) => w.includes('height'))).toBe(true);
  });

  it('should strip unknown fields and still be valid', async () => {
    const result = await validate(packageScanSchema, {
      ...validPayload,
      unknownField: 'should be stripped',
      package: {
        ...validPayload.package,
        extraNested: true,
      },
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should reject a missing trackingId', async () => {
    const { trackingId: _tid, ...packageWithoutTrackingId } = validPayload.package;
    const result = await validate(packageScanSchema, {
      ...validPayload,
      package: { ...packageWithoutTrackingId },
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('trackingId'))).toBe(true);
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
