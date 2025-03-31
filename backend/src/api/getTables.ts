import { Request, Response } from 'express';
import SQLiteDatabase from 'better-sqlite3';

export const getTables = (req: Request, res: Response, db: SQLiteDatabase.Database) => {
	const query =
		"SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'wp_%' ORDER BY name";
	try {
		const transaction = db.transaction(() => db.prepare(query).all());
		res.json(transaction());
	} catch (error) {
		res.status(500).send('Internal Server Error');
		console.error(error);
	}
};
