import cors from 'cors';
import express from 'express';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { default as StudioSQLiteMiddleware } from '../build/index.js';

const app = express();
const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';
const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname(__filename);

app.use(
	cors({
		origin: !isProduction
			? 'http://localhost:5173' // Vite's default dev server port
			: false, // Disable CORS in production since it's same-origin
	})
);

// Use the database middleware, passing the path to the SQLite database file.
app.use('/', StudioSQLiteMiddleware( app, path.join(__dirname, './database/.ht.sqlite') ) );

// Start the server.
app.listen(3000, () => console.log( 'Server running on http://localhost:3000' ) );
