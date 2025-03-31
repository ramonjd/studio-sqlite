import express from 'express';
import SQLiteDatabase from 'better-sqlite3';
import { getTables, getTableColumns, getTableRows, getOptions, chatWithLLM } from './api/index.js';
import path from 'path';
import process from 'process';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Middleware for Express to handle SQLite database requests.
 *
 * This middleware provides a route handler for the root path ('/') that returns
 * a list of all tables in the SQLite database. It uses the 'better-sqlite3'
 * library to connect to the database and return the data in JSON format.
 *
 * @param databasePath - The path to the SQLite database file.
 * @returns An Express router with a route handler for the root path.
 */

export default function StudioSQLite(
	app: express.Application,
	databasePath: string
): express.Router {
	const router = express.Router();
	const db = new SQLiteDatabase(databasePath, {
		verbose: console.log,
		timeout: 5000,
		fileMustExist: true,
	});
	db.pragma('journal_mode = WAL');
    // @TODO
    // this check isn't appropriate for npm package
    // Also the path should be relative.
	if (app && process.env.NODE_ENV === 'production') {
		app.use(express.static(path.join(path.dirname(require.resolve('./package.json')), 'frontend')));
	}
	router.get('/api/tables', (req, res) => getTables(req, res, db));
	router.get('/api/tables/:tableName/columns', (req, res) => getTableColumns(req, res, db));
	router.get('/api/tables/:tableName/rows', (req, res) => getTableRows(req, res, db));
	router.get('/api/options/:optionName', (req, res) => getOptions(req, res, db));
	
	// Add body parser middleware for the chat endpoint
	router.use(express.json());
	
	// Add the chat endpoint
	router.post('/api/chat', (req, res) => chatWithLLM(req, res, db));
	
	return router;
}
