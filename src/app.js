import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import UserModel from './models/userModel.js';
import TransactionModel from './models/transactionModel.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use(logger);

// ============================================================================
// DATA INITIALIZATION
// ============================================================================

// Initialize data files on startup
const initializeApp = async () => {
  try {
    await UserModel.init();
    await TransactionModel.init();
    console.log('[INFO] Data files initialized successfully');
  } catch (error) {
    console.error('[ERROR] Failed to initialize data files:', error.message);
    process.exit(1);
  }
};

// ============================================================================
// HEALTH CHECK ENDPOINT
// ============================================================================

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// ============================================================================
// ROUTES
// ============================================================================

app.use('/users', userRoutes);
app.use('/transactions', transactionRoutes);

// ============================================================================
// 404 NOT FOUND HANDLER
// ============================================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.originalUrl} not found`,
      statusCode: 404
    }
  });
});

// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================

app.use(errorHandler);

// Export initializer and app for external server control (useful for tests)
export { initializeApp };
export default app;
