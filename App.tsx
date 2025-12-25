import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
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
      text: "Hello! I'm Taim Ai, your personal assistant powered by Gemini. Feel free to ask me anything or even send an image!",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

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
    <div className="flex flex-col h-screen bg-m3-light-surface-container-low dark:bg-m3-dark-surface-container-low text-m3-light-on-surface dark:text-m3-dark-on-surface transition-colors duration-300">
      <Header />
      <main className="flex-grow overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <AnimatePresence>
            {chatHistory.map((msg, index) => (
              <ChatMessageComponent key={index} message={msg} />
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex items-start gap-3 w-full my-2">
              <div className="w-8 h-8 rounded-full bg-m3-light-surface-container dark:bg-m3-dark-surface-container flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-m3-light-primary dark:text-m3-dark-primary" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.25c-5.376 0-9.75 4.374-9.75 9.75s4.374 9.75 9.75 9.75 9.75-4.374 9.75-9.75S17.376 2.25 12 2.25ZM9.663 17.51a.75.75 0 0 1-1.06-1.061l1.59-1.59a.75.75 0 1 1 1.06 1.06l-1.59 1.591Zm.99-3.48a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0Zm3.292-5.522a.75.75 0 0 1-1.061 0L11.295 8.85a.75.75 0 0 1 1.06-1.06l1.591 1.59a.75.75 0 0 1 0 1.06Z" />
                  </svg>
              </div>
              <div className="max-w-md lg:max-w-2xl px-4 py-3 rounded-3xl rounded-bl-md shadow-md bg-m3-light-surface-container dark:bg-m3-dark-surface-container">
                <LoadingSpinner />
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-300 p-3 rounded-lg text-center">
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