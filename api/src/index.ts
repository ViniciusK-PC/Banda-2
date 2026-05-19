import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import showsRoutes from './routes/shows';
import mediaRoutes from './routes/media';
import settingsRoutes from './routes/settings';
import albumsRoutes from './routes/albums';
import uploadRoutes from './routes/upload';
import messagesRoutes from './routes/messages';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shows', showsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/albums', albumsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messagesRoutes);


// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
