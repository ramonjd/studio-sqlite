import { Request, Response } from 'express';
import SQLiteDatabase from 'better-sqlite3';

export const getTableColumns = (req: Request, res: Response, db: SQLiteDatabase.Database) => {
    const tableName = req.params.tableName;
    if ( typeof tableName !== 'string' || ! /^[a-zA-Z0-9_]+$/.test( tableName ) ) {
        res.status(400).send('Invalid table name');
        return;
    }

    const query = `PRAGMA table_info(${tableName})`;
    try {
		const transaction = db.transaction( () => {
			const stmt = db.prepare( query );
			return stmt.all();
		} );
        res.json( transaction() );
    } catch (error) {
        res.status( 500 ).send( 'Internal Server Error' );
        console.error( error );
    }
}