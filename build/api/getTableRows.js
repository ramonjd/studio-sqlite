"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTableRows = void 0;
const getTableRows = (req, res, db) => {
    const tableName = req.params.tableName;
    if (typeof tableName !== 'string' || !/^[a-zA-Z0-9_]+$/.test(tableName)) {
        res.status(400).send('Invalid table name');
        return;
    }
    const query = `SELECT * FROM ${tableName}`;
    try {
        const transaction = db.transaction(() => {
            const stmt = db.prepare(query);
            return stmt.all();
        });
        res.json(transaction());
    }
    catch (error) {
        res.status(500).send('Internal Server Error');
        console.error(error);
    }
};
exports.getTableRows = getTableRows;
//# sourceMappingURL=getTableRows.js.map