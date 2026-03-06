import { Router, Request, Response } from 'express';
import { PackageScanService } from '../services/package-scan-service';

/**
 * Creates the package-scan route with injected service.
 * @param service - The service used to process package scan events.
 * @returns The configured router.
 */
export function createPackageScanRouter(service: PackageScanService): Router {
  const router = Router();

  router.post('/', (req: Request, res: Response) => {
    service.process(req.body);
    res.json({ status: 'accepted' });
  });

  return router;
}
