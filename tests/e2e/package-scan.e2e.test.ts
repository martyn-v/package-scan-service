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

  it('should accept the event and return accepted status', async () => {
    const response = await request(app)
      .post('/events/package-scan')
      .send(validPayload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'accepted' });
  });

  it('should reject a duplicate event', async () => {
    const duplicatePayload: PackageScanEvent = {
      ...validPayload,
      eventId: 'evt_duplicate_test',
    };

    await request(app).post('/events/package-scan').send(duplicatePayload);

    const response = await request(app)
      .post('/events/package-scan')
      .send(duplicatePayload);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ status: 'rejected', reasons: ['duplicate_event'] });
  });
});
