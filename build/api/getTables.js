export const getTables = (req, res, db) => {
    const query = "SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'wp_%' ORDER BY name";
    try {
        const transaction = db.transaction(() => db.prepare(query).all());
        res.json(transaction());
    }
    catch (error) {
        res.status(500).send('Internal Server Error');
        console.error(error);
    }
};
//# sourceMappingURL=getTables.js.map