import dotenv from 'dotenv';

// Load environment variables before any other imports
dotenv.config({ path: './config/config.env' });

import app from './app.js';
import { connectDatabase } from './config/db.js';

const PORT = process.env.PORT || 4000;

// Connect to the database before starting the server
connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is working on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed. Server not started.", err);
    process.exit(1);
  });
