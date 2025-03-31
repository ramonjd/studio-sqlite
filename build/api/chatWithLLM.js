"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithLLM = void 0;
const DatabaseContext_js_1 = require("../context/DatabaseContext.js");
const LLMService_js_1 = require("../services/LLMService.js");
const chatWithLLM = async (req, res, db) => {
    const { message, history } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    try {
        // Create database context
        const dbContext = new DatabaseContext_js_1.DatabaseContext(db);
        // Create LLM service with database context
        const llmService = new LLMService_js_1.LLMService(dbContext);
        // Get database schema and context
        const schemaInfo = dbContext.getDatabaseSchema();
        // Process the message with context and history
        const response = await llmService.processMessage(message, schemaInfo, history || []);
        // Return the response
        res.json({ response });
    }
    catch (error) {
        console.error('Error in chatWithLLM:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.chatWithLLM = chatWithLLM;
//# sourceMappingURL=chatWithLLM.js.map