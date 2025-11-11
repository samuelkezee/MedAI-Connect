import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import ehrRoutes from './routes/ehrRoutes.js';

const app = express();

app.use(express.json()); // Middleware for parsing JSON bodies
app.use(cookieParser()); // Middleware for parsing cookies

// A simple test route
app.get('/api/v1/test', (req, res) => {
    res.status(200).json({ success: true, message: 'Test route is working' });
});

// Mount the user routes
app.use('/api/v1/users', userRoutes);

// Mount the EHR routes
app.use('/api/v1/ehr', ehrRoutes);

export default app;
