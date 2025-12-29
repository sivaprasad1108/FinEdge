import dotenv from 'dotenv';
import app, { initializeApp } from './app.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async () => {
  try {
    await initializeApp();

    app.listen(PORT, () => {
      console.log(`\nFinEdge - Server running at: http://localhost:${PORT} (env: ${NODE_ENV})\n`);
    });
  } catch (err) {
    console.error('[ERROR] Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
