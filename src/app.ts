import express, { Application } from 'express';
import { createPackageScanRouter } from './routes/package-scan';
import { PackageScanService } from './services/package-scan-service';
import { InMemoryPackageScanRepository } from './store/package-scan-repository';

/**
 * Creates and configures the Express application with routes and middleware.
 * @returns The configured Express application.
 */
export function createApp(): Application {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  const repository = new InMemoryPackageScanRepository();
  const service = new PackageScanService(repository);
  app.use('/events/package-scan', createPackageScanRouter(service));

  return app;
}
