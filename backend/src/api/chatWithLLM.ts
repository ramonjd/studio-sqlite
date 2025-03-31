import { Request, Response } from 'express';
import SQLiteDatabase from 'better-sqlite3';
import { DatabaseContext } from '../context/DatabaseContext.js';
import { LLMService } from '../services/LLMService.js';

interface Message {
	role: 'user' | 'assistant';
	content: string;
}

export const chatWithLLM = async (req: Request, res: Response, db: SQLiteDatabase.Database) => {
	const { message, history } = req.body;

	if (!message) {
		return res.status(400).json({ error: 'Message is required' });
	}

	try {
		// Create database context
		const dbContext = new DatabaseContext(db);

		// Create LLM service with database context
		const llmService = new LLMService(dbContext);

		// Get database schema and context
		const schemaInfo = dbContext.getDatabaseSchema();

		// Process the message with context and history
		const response = await llmService.processMessage(message, schemaInfo, history || []);

		// Return the response
		res.json({ response });
	} catch (error) {
		console.error('Error in chatWithLLM:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
