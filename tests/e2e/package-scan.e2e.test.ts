import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { Application } from 'express';
import { createApp } from '../../src/app';
import { PackageScanEvent } from '../../src/models/package-scan';

describe('POST /events/package-scan', () => {
  let app: Application;

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

  beforeEach(() => {
    app = createApp();
  });

  it('should accept the event and return accepted status', async () => {
    const response = await request(app)
      .post('/events/package-scan')
      .send(validPayload);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('accepted');
    expect(response.body.normalizedEvent).toBeDefined();
    expect(response.body.normalizedEvent.eventId).toBe(validPayload.eventId);
  });

  it('should return normalized payload without extra fields', async () => {
    const response = await request(app)
      .post('/events/package-scan')
      .send({
        ...validPayload,
        eventId: 'evt_strip_test',
        extraField: 'should not appear',
      });

    expect(response.status).toBe(200);
    expect(response.body.normalizedEvent).toBeDefined();
    expect(response.body.normalizedEvent.extraField).toBeUndefined();
    expect(response.body.normalizedEvent.eventId).toBe('evt_strip_test');
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

  it('should accept with warnings for absurd dimensions', async () => {
    const response = await request(app)
      .post('/events/package-scan')
      .send({
        ...validPayload,
        eventId: 'evt_absurd_dims',
        package: {
          ...validPayload.package,
          dimensions: { length: 2, width: 80, height: 600, unit: 'cm' },
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('accepted_with_warnings');
    expect(response.body.reasons.length).toBeGreaterThan(0);
    expect(response.body.normalizedEvent).toBeDefined();
    expect(response.body.normalizedEvent.eventId).toBe('evt_absurd_dims');
  });

  it('should reject an invalid payload with validation errors', async () => {
    const response = await request(app)
      .post('/events/package-scan')
      .send({ eventId: 'evt_invalid' });

    expect(response.status).toBe(409);
    expect(response.body.status).toBe('rejected');
    expect(response.body.reasons.length).toBeGreaterThan(0);
  });
});
