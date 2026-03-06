import express, { Application } from 'express';
import packageScanRouter from './routes/package-scan';

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

  app.use('/events/package-scan', packageScanRouter);

  return app;
}
