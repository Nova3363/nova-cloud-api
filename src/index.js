import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config.js';
import { authRouter } from './routes/auth.js';
import { jobsRouter } from './routes/jobs.js';

const app = express();

app.use(cors({
  origin: config.appOrigin === '*' ? true : [config.appOrigin],
  credentials: false
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'nova-cloud-api',
    message: 'Nova Cloud API is running.'
  });
});

app.use('/auth', authRouter);
app.use('/jobs', jobsRouter);

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('[NovaCloud-API] Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`[NovaCloud-API] Listening on port ${config.port}`);
});
