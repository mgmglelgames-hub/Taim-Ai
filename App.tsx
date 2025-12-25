import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import ChatInput from './components/ChatInput';
import ChatMessageComponent from './components/ChatMessage';
import LoadingSpinner from './components/LoadingSpinner';
import ChatSidebar from './components/ChatSidebar';
import { runQuery, generateChatTitle } from './services/geminiService';
import { MessageAuthor, type ChatMessage, type Chat, type AppData, Theme } from './types';
import { ThemeContext } from './contexts/ThemeContext';

const STORAGE_KEY = 'taim-ai-data';

const App: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const isInitialized = useRef(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const activeChat = chats.find(c => c.id === activeChatId);

  // Effect for Loading all data from localStorage on initial boot
  useEffect(() => {
    const defaultTheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
    
    const initialChat: Chat = {
        id: Date.now().toString(),
        title: "New Chat",
        messages: [{
            author: MessageAuthor.BOT,
            text: "Hello! I'm Taim Ai, your personal assistant powered by Gemini. Feel free to ask me anything or even send an image!",
        }]
    };
    
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (rawData) {
        const data: AppData = JSON.parse(rawData);
        
        if (data.chats && data.chats.length > 0) {
          setChats(data.chats);
          setActiveChatId(data.chats[0].id);
        } else {
          setChats([initialChat]);
          setActiveChatId(initialChat.id);
        }
        
        setTheme(data.theme || defaultTheme);

      } else {
        setChats([initialChat]);
        setActiveChatId(initialChat.id);
        setTheme(defaultTheme);
      }
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
      setChats([initialChat]);
      setActiveChatId(initialChat.id);
      setTheme(defaultTheme);
    }
    
    isInitialized.current = true;
  }, []);

  // Effect for Saving all data to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized.current) return;
    try {
        const data: AppData = { chats, theme };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save data to localStorage", e);
    }
  }, [chats, theme]);

  // Effect for applying the theme class to the DOM
  useEffect(() => {
    document.documentElement.classList.remove(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
    document.documentElement.classList.add(theme);
  }, [theme]);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isLoading]);

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [{
        author: MessageAuthor.BOT,
        text: "Hello! I'm Taim Ai, your personal assistant powered by Gemini. Feel free to ask me anything or even send an image!",
      }]
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setSidebarOpen(false);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setSidebarOpen(false);
  }

  const handleDeleteChat = (id: string) => {
    setChats(prev => {
        const remainingChats = prev.filter(c => c.id !== id);
        if (activeChatId === id) {
            setActiveChatId(remainingChats[0]?.id || null);
        }
        return remainingChats;
    });
  }

  const handleSend = async (prompt: string, imageUrl?: string) => {
    if (isLoading || !activeChatId) return;

    setIsLoading(true);
    setError(null);
    
    const userMessage: ChatMessage = { author: MessageAuthor.USER, text: prompt, imageUrl };
    
    const chatBeforeSend = chats.find(c => c.id === activeChatId);
    const needsTitle = chatBeforeSend?.messages.length === 1;

    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, userMessage] } : c));

    try {
      const botResponseText = await runQuery(prompt, imageUrl);
      const botMessage: ChatMessage = { author: MessageAuthor.BOT, text: botResponseText };
      
      let newTitle = needsTitle ? await generateChatTitle(prompt, botResponseText) : null;

      setChats(prev => prev.map(c => {
        if (c.id === activeChatId) {
          const updatedChat = { ...c, messages: [...c.messages, botMessage] };
          if(newTitle) updatedChat.title = newTitle;
          return updatedChat;
        }
        return c;
      }));

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      const botErrorMessage: ChatMessage = { author: MessageAuthor.BOT, text: `Sorry, something went wrong: ${errorMessage}` };
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, botErrorMessage] } : c));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="flex h-screen bg-m3-light-surface-container-low dark:bg-m3-dark-surface-container-low text-m3-light-on-surface dark:text-m3-dark-on-surface transition-colors duration-300">
        <ChatSidebar 
          chats={chats}
          activeChatId={activeChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex flex-col flex-grow">
          <Header onMenuClick={() => setSidebarOpen(o => !o)} />
          <main className="flex-grow overflow-y-auto p-4 md:p-6">
            <div className="max-w-4xl mx-auto flex flex-col gap-4">
              <AnimatePresence>
                {activeChat?.messages.map((msg, index) => (
                  <ChatMessageComponent key={`${activeChat.id}-${index}`} message={msg} />
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
      </div>
    </ThemeContext.Provider>
  );
};

export default App;