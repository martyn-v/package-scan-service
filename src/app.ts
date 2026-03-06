import express, { Application } from 'express';
import packageScanRouter from './routes/package-scan';

export function createApp(): Application {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/events/package-scan', packageScanRouter);

  return app;
}
