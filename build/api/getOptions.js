export const getOptions = (req, res, db) => {
    const query = "SELECT * FROM wp_options WHERE option_name = ?";
    try {
        const stmt = db.prepare(query);
        const options = stmt.all(req.params.optionName);
        res.json(options);
    }
    catch (error) {
        res.status(500).send('Internal Server Error');
    }
};
//# sourceMappingURL=getOptions.js.map