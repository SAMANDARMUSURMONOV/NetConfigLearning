import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import lessonsRouter from './routes/lessons.route';
import usersRouter from './routes/users.route';
import certificatesRouter from './routes/certificates.route';
import aiRouter from './routes/ai.route';
import profileRouter from './routes/profile.route';
import settingsRouter from './routes/settings.route';
import clipsRouter from './routes/clips.route';
import progressRouter from './routes/progress.route';

dotenv.config();

const app = express();
const PORT = 5001;

// CORS konfiguratsiyasi
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5172', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

app.use('/api/lessons', lessonsRouter);
app.use('/api/users', usersRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/ai', aiRouter);
app.use('/api/profile', profileRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/clips', clipsRouter);
app.use('/api/progress', progressRouter);


// Static files (uploads)
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`!!! SERVER IS UPDATED AND RUNNING !!!`);
  console.log(`PORT: ${PORT}`);
  console.log(`=========================================`);
});
 