const cors = require('cors');
const express = require('express');
const path = require('path');
const process = require('process');
const dotenv = require('dotenv');
const StudioSQLiteMiddleware = require('../build/index.js');

// Load environment variables
dotenv.config();

const app = express();
const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';

app.use(
	cors({
		origin: !isProduction
			? 'http://localhost:5173' // Vite's default dev server port
			: false, // Disable CORS in production since it's same-origin
	})
);

// Use the database middleware, passing the path to the SQLite database file.
app.use('/', StudioSQLiteMiddleware.default( app, path.join(__dirname, './database/.ht.sqlite') ) );

// Start the server.
app.listen(3000, () => console.log( 'Server running on http://localhost:3000' ) );
