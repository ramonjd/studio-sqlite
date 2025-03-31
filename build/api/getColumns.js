export const getTableColumns = (req, res, db) => {
    const query = "PRAGMA table_info(?)";
    try {
        const transaction = db.transaction(() => db.prepare(query).all(req.params.tableName));
        res.json(transaction());
    }
    catch (error) {
        res.status(500).send('Internal Server Error');
        console.error(error);
    }
};
//# sourceMappingURL=getColumns.js.map