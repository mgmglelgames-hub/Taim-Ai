import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import ChatInput from './components/ChatInput';
import ChatMessageComponent from './components/ChatMessage';
import LoadingSpinner from './components/LoadingSpinner';
import { runQuery } from './services/geminiService';
import { MessageAuthor, type ChatMessage } from './types';

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      author: MessageAuthor.BOT,
      text: "Hello! I'm Taim Ai, an AI assistant powered by Gemini. You can now send images along with your text. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async (prompt: string, imageUrl?: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    
    const userMessage: ChatMessage = { author: MessageAuthor.USER, text: prompt, imageUrl };
    setChatHistory(prev => [...prev, userMessage]);

    try {
      const botResponseText = await runQuery(prompt, imageUrl);
      const botMessage: ChatMessage = { author: MessageAuthor.BOT, text: botResponseText };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      const botErrorMessage: ChatMessage = { author: MessageAuthor.BOT, text: `Sorry, something went wrong: ${errorMessage}` };
      setChatHistory(prev => [...prev, botErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">
      <Header />
      <main className="flex-grow overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {chatHistory.map((msg, index) => (
            <ChatMessageComponent key={index} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.25c-5.376 0-9.75 4.374-9.75 9.75s4.374 9.75 9.75 9.75 9.75-4.374 9.75-9.75S17.376 2.25 12 2.25ZM9.663 17.51a.75.75 0 0 1-1.06-1.061l1.59-1.59a.75.75 0 1 1 1.06 1.06l-1.59 1.591Zm.99-3.48a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0Zm3.292-5.522a.75.75 0 0 1-1.061 0L11.295 8.85a.75.75 0 0 1 1.06-1.06l1.591 1.59a.75.75 0 0 1 0 1.06Z" />
                  </svg>
                </div>
              <LoadingSpinner />
            </div>
          )}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>
      <div className="sticky bottom-0">
         <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;