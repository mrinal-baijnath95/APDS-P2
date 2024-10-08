/*
  Code Attribution:
  The implementation of the Express server setup, CSRF protection, and HTTPS server configuration in this file was adapted from general Express and Node.js guidelines found in the official documentation and various learning resources.
  The CSRF protection implementation references techniques from the csurf library documentation.
  HTTPS configuration references examples provided by Node.js documentation.
  Libraries and dependencies used:
    - Express: https://expressjs.com/
    - Csurf: https://www.npmjs.com/package/csurf
    - Helmet: https://www.npmjs.com/package/helmet
    - Node.js HTTPS: https://nodejs.org/api/https.html
*/



// server.mjs
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import helmet from 'helmet';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './db/conn.mjs';
import postRoutes from './routes/post.mjs';
import userRoutes from './routes/user.mjs';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware configuration
app.use(cors({ credentials: true, origin: 'https://localhost:3000' }));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

// CSRF protection using cookies
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

// Serve frontend files if needed (optional if frontend is in the same server)
app.use(express.static('public'));

// CSRF token route to retrieve the CSRF token
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Use SSL certificates
const privateKey = fs.readFileSync('C:/Users/lab_services_student/Desktop/APDS Test 1/BACKEND/keys/privatekey.pem', 'utf8');
const certificate = fs.readFileSync('C:/Users/lab_services_student/Desktop/APDS Test 1/BACKEND/keys/certificate.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Register the routes
app.use('/posts', postRoutes);
app.use('/users', userRoutes);

// Connect to the database and start the HTTPS server
connectToDatabase().then(() => {
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(PORT, () => {
    console.log(`HTTPS Server is running on https://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
});
