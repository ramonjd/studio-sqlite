"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StudioSQLite;
const express_1 = __importDefault(require("express"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const index_js_1 = require("./api/index.js");
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
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
function StudioSQLite(app, databasePath) {
    const router = express_1.default.Router();
    const db = new better_sqlite3_1.default(databasePath, {
        verbose: console.log,
        timeout: 5000,
        fileMustExist: true,
    });
    db.pragma('journal_mode = WAL');
    // @TODO
    // this check isn't appropriate for npm package
    // Also the path should be relative.
    if (app && process_1.default.env.NODE_ENV === 'production') {
        app.use(express_1.default.static(path_1.default.join(path_1.default.dirname(require.resolve('./package.json')), 'frontend')));
    }
    router.get('/api/tables', (req, res) => (0, index_js_1.getTables)(req, res, db));
    router.get('/api/tables/:tableName/columns', (req, res) => (0, index_js_1.getTableColumns)(req, res, db));
    router.get('/api/tables/:tableName/rows', (req, res) => (0, index_js_1.getTableRows)(req, res, db));
    router.get('/api/options/:optionName', (req, res) => (0, index_js_1.getOptions)(req, res, db));
    // Add body parser middleware for the chat endpoint
    router.use(express_1.default.json());
    // Add the chat endpoint
    router.post('/api/chat', (req, res) => (0, index_js_1.chatWithLLM)(req, res, db));
    return router;
}
//# sourceMappingURL=index.js.map