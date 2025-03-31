"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMService = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
class LLMService {
    openai;
    model;
    dbContext;
    constructor(dbContext) {
        // Initialize OpenAI client
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
        // Default model
        this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
        this.dbContext = dbContext;
    }
    /**
     * Process a user message with database context
     */
    async processMessage(userMessage, databaseContext, history = []) {
        try {
            // Create system message with database context and available functions
            const systemMessage = `You are a helpful assistant that can answer questions about a WordPress database.
            
Here is the database schema:
${databaseContext}

You have access to the following functions to help answer questions:
1. executeQuery(query: string) - Execute a SQL query and return the results
2. getTableSample(tableName: string, limit: number) - Get a sample of data from a table

When answering questions:
1. ALWAYS use executeQuery to get data - never just show the SQL query
2. Format the results in natural language - never show the raw SQL or query results
3. If you need to explore a table's content, use getTableSample
4. Always consider SQL injection and use proper escaping
5. For date-based queries:
   - WordPress stores dates in UTC in the format 'YYYY-MM-DD HH:MM:SS'
   - Use SQLite's datetime() function for date arithmetic
   - Example: datetime('now', '-4 days') for 4 days ago
   - Always compare with post_date or post_date_gmt columns

Example queries:
- For posts in last 4 days: SELECT COUNT(*) FROM wp_posts WHERE post_date >= datetime('now', '-4 days')
- For posts by date range: SELECT COUNT(*) FROM wp_posts WHERE post_date BETWEEN datetime('now', '-7 days') AND datetime('now')

Answer the user's question based on this database schema and available functions.
If you don't have enough information to answer the question, say so.`;
            // Define the available functions
            const functions = [
                {
                    name: 'executeQuery',
                    description: 'Execute a SQL query on the WordPress database',
                    parameters: {
                        type: 'object',
                        properties: {
                            query: {
                                type: 'string',
                                description: 'The SQL query to execute',
                            },
                        },
                        required: ['query'],
                    },
                },
                {
                    name: 'getTableSample',
                    description: 'Get a sample of data from a specific table',
                    parameters: {
                        type: 'object',
                        properties: {
                            tableName: {
                                type: 'string',
                                description: 'The name of the table to sample',
                            },
                            limit: {
                                type: 'number',
                                description: 'Number of rows to return',
                            },
                        },
                        required: ['tableName'],
                    },
                },
            ];
            // Prepare messages array with history
            const messages = [
                { role: 'system', content: systemMessage },
                ...history,
                { role: 'user', content: userMessage }
            ];
            // Call the OpenAI API with function calling
            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages,
                functions,
                function_call: 'auto',
                temperature: 0.7,
                max_tokens: 1000,
            });
            const responseMessage = response.choices[0]?.message;
            if (!responseMessage) {
                throw new Error('Invalid response from LLM');
            }
            // Handle function calls if the model wants to use them
            if (responseMessage.function_call) {
                const functionName = responseMessage.function_call.name;
                const functionArgs = JSON.parse(responseMessage.function_call.arguments);
                // Execute the requested function
                let functionResult;
                try {
                    if (functionName === 'executeQuery') {
                        functionResult = await this.dbContext.executeQuery(functionArgs.query);
                    }
                    else if (functionName === 'getTableSample') {
                        functionResult = await this.dbContext.getTableSample(functionArgs.tableName, functionArgs.limit || 5);
                    }
                    // Get final response from the model with the function results
                    const finalResponse = await this.openai.chat.completions.create({
                        model: this.model,
                        messages: [
                            ...messages,
                            { role: 'assistant', content: null, function_call: responseMessage.function_call },
                            { role: 'function', name: functionName, content: JSON.stringify(functionResult) },
                        ],
                        temperature: 0.7,
                        max_tokens: 1000,
                    });
                    const finalMessage = finalResponse.choices[0]?.message;
                    if (!finalMessage?.content) {
                        throw new Error('Invalid response from LLM');
                    }
                    return finalMessage.content;
                }
                catch (error) {
                    console.error('Error executing function:', error);
                    return `I encountered an error while processing your request: ${error instanceof Error ? error.message : 'Unknown error'}`;
                }
            }
            // Return the direct response if no function was called
            return responseMessage.content || 'Sorry, I could not generate a response.';
        }
        catch (error) {
            console.error('Error processing message with LLM:', error);
            return `I encountered an error while processing your request: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
}
exports.LLMService = LLMService;
//# sourceMappingURL=LLMService.js.map