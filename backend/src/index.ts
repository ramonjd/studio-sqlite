import express from 'express';
import SQLiteDatabase from 'better-sqlite3';
import { getTables, getTableColumns, getTableRows, getOptions } from './api/index.js';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

	if (app && process.env.NODE_ENV === 'production') {
		app.use(express.static(path.join(__dirname, './frontend')));
	}
	router.get('/api/tables', (req, res) => getTables(req, res, db));
	router.get('/api/tables/:tableName/columns', (req, res) => getTableColumns(req, res, db));
	router.get('/api/tables/:tableName/rows', (req, res) => getTableRows(req, res, db));
	router.get('/api/options/:optionName', (req, res) => getOptions(req, res, db));
	return router;
}
