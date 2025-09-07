import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/connect.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import posterRoutes from './routes/poster.routes.js';
import commentRoutes from './routes/comment.routes.js';
import errorHandler from './middleware/errorHandler.js';
import createAdmin from './db/createAdmin.js';

dotenv.config();

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Health check
app.get('/', (_req, res) =>
  res.json({ ok: true, message: 'API up' })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes); // /users/me, /admin/*, etc.
app.use('/api/posters', posterRoutes);
app.use('/api/comments', commentRoutes);

// Debug: Log all registered routes
console.log('🔍 Registered Routes:');
console.log('✅ Auth routes: /api/auth/*');
console.log('✅ User routes: /api/*');
console.log('✅ Poster routes: /api/posters/*');
console.log('✅ Comment routes: /api/comments/*');
console.log('✅ Health check: /');

// Central error handler (last)
app.use(errorHandler);

// Start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    // Create default admin if not exists
    await createAdmin();

    app.listen(PORT, () =>
      console.log(`✅ Server running on :${PORT}`)
    );
  } catch (err) {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  }
};

startServer();
