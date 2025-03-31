import { Request, Response } from 'express';
import SQLiteDatabase from 'better-sqlite3';

export const getOptions = (req: Request, res: Response, db: SQLiteDatabase.Database) => {
	const query = 'SELECT * FROM wp_options WHERE option_name = ?';
	try {
		const stmt = db.prepare(query);
		const options = stmt.all(req.params.optionName);
		res.json(options);
	} catch (error) {
		res.status(500).send('Internal Server Error');
	}
};
