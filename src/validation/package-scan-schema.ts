import Joi from 'joi';

/** Joi schema for validating package scan event payloads. */
export const packageScanSchema = Joi.object({
  eventId: Joi.string().required(),
  source: Joi.string().required(),
  timestamp: Joi.string().isoDate().required(),
  package: Joi.object({
    trackingId: Joi.string().required(),
    dimensions: Joi.object({
      length: Joi.number().positive().required(),
      width: Joi.number().positive().required(),
      height: Joi.number().positive().required(),
      unit: Joi.string().required(),
    }).required(),
    weight: Joi.object({
      value: Joi.number().positive().required(),
      unit: Joi.string().required(),
    }).required(),
  }).required(),
});
