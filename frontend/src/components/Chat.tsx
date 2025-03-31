import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardFooter } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';

export function Chat() {
    const { messages, isLoading, error, sendMessage, clearChat } = useChat();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            sendMessage(input);
            setInput('');
        }
    };

    return (
        <Card className="w-full h-full flex flex-col border-0 shadow-none">
            <CardContent className="flex-grow overflow-hidden">
                <ScrollArea className="h-[400px] pr-4">
                    {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground p-4"></div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex items-start gap-2 ${
                                        message.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    {message.role === 'assistant' && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>AI</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div
                                        className={`rounded-lg p-3 max-w-[80%] ${
                                            message.role === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted'
                                        }`}
                                    >
                                        {message.content}
                                    </div>
                                    {message.role === 'user' && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>AI</AvatarFallback>
                                    </Avatar>
                                    <div className="rounded-lg p-3 bg-muted max-w-[80%]">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce"></div>
                                            <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </ScrollArea>
                {error && (
                    <div className="text-destructive text-sm mt-2">{error}</div>
                )}
            </CardContent>
            <CardFooter>
                <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about the database..."
                        disabled={isLoading}
                        className="flex-grow"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        Send
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={clearChat}
                        disabled={isLoading || messages.length === 0}
                    >
                        Clear
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
} 