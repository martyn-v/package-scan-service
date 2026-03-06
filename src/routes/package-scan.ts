import { Router, Request, Response } from 'express';
import { PackageScanService } from '../services/package-scan-service';
import { ProcessResult } from '../models/process-result';

const STATUS_CODES: Record<ProcessResult['status'], number> = {
  accepted: 200,
  accepted_with_warnings: 200,
  rejected: 409,
};

/**
 * Creates the package-scan route with injected service.
 * @param service - The service used to process package scan events.
 * @returns The configured router.
 */
export function createPackageScanRouter(service: PackageScanService): Router {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {
    const result = await service.process(req.body);
    res.status(STATUS_CODES[result.status]).json(result);
  });

  return router;
}
