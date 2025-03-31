"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseContext = void 0;
class DatabaseContext {
    db;
    constructor(db) {
        this.db = db;
    }
    /**
     * Get database schema information
     */
    getDatabaseSchema() {
        try {
            // Get all tables
            const tablesQuery = "SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'wp_%' ORDER BY name";
            const tables = this.db.prepare(tablesQuery).all();
            let schemaInfo = 'Database Schema:\n';
            // For each table, get its columns
            for (const table of tables) {
                const tableName = table.name;
                const columnsQuery = `PRAGMA table_info(${tableName})`;
                const columns = this.db.prepare(columnsQuery).all();
                schemaInfo += `\nTable: ${tableName}\n`;
                schemaInfo += 'Columns:\n';
                for (const column of columns) {
                    schemaInfo += `  - ${column.name} (${column.type})\n`;
                }
            }
            return schemaInfo;
        }
        catch (error) {
            console.error('Error getting database schema:', error);
            throw new Error(`Failed to get database schema: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Get a sample of data from a table
     */
    getTableSample(tableName, limit = 5) {
        try {
            // Validate table name
            if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
                throw new Error('Invalid table name');
            }
            const query = `SELECT * FROM ${tableName} LIMIT ${limit}`;
            const results = this.db.prepare(query).all();
            if (!results || results.length === 0) {
                return { message: `No data found in table ${tableName}` };
            }
            return results;
        }
        catch (error) {
            console.error(`Error getting sample from table ${tableName}:`, error);
            throw new Error(`Failed to get sample from table ${tableName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Execute a SQL query and return the results
     */
    executeQuery(query) {
        try {
            // Basic SQL injection prevention
            if (query.toLowerCase().includes('drop') ||
                query.toLowerCase().includes('delete') ||
                query.toLowerCase().includes('update') ||
                query.toLowerCase().includes('insert')) {
                throw new Error('Query contains forbidden operations');
            }
            const results = this.db.prepare(query).all();
            if (!results || results.length === 0) {
                return { message: 'No results found' };
            }
            return results;
        }
        catch (error) {
            console.error('Error executing query:', error);
            throw new Error(`Failed to execute query: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.DatabaseContext = DatabaseContext;
//# sourceMappingURL=DatabaseContext.js.map