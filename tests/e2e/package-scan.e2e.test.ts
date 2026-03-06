import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';
import { PackageScanEvent } from '../../src/models/package-scan';

describe('POST /events/package-scan', () => {
  const app = createApp();

  const validPayload: PackageScanEvent = {
    eventId: 'evt_test_001',
    source: 'edge-camera',
    timestamp: '2026-01-20T10:15:00Z',
    package: {
      trackingId: 'PKG-001',
      dimensions: { length: 120, width: 80, height: 60, unit: 'cm' },
      weight: { value: 25, unit: 'kg' },
    },
  };

  it('should echo the payload back with 200', async () => {
    const response = await request(app)
      .post('/events/package-scan')
      .send(validPayload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(validPayload);
  });
});
