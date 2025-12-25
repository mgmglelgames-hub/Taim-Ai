import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Chat } from '../types';
import { useAnimation } from '../contexts/AnimationContext';

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onOpenSettings: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ chats, activeChatId, onNewChat, onSelectChat, onDeleteChat, onOpenSettings, isOpen, onClose }) => {
    const { animationsEnabled } = useAnimation();
    
    const sidebarVariants = {
        open: { x: 0 },
        closed: { x: '-100%' }
    };
    
    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: animationsEnabled ? 0.2 : 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.div
                animate={isOpen ? 'open' : 'closed'}
                variants={sidebarVariants}
                transition={animationsEnabled ? { type: 'spring', stiffness: 300, damping: 30 } : { type: 'tween', duration: 0 }}
                className="fixed md:static top-0 left-0 h-full bg-m3-light-surface-container dark:bg-m3-dark-surface-container w-72 flex-shrink-0 flex flex-col z-30 shadow-lg md:shadow-none"
            >
                <div className="p-4 flex-shrink-0 border-b border-slate-500/10 dark:border-slate-500/20">
                    <button 
                        onClick={onNewChat}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-m3-light-primary-container dark:bg-m3-dark-primary-container text-m3-light-on-primary-container dark:text-m3-dark-on-primary-container font-medium hover:opacity-90 transition-opacity"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        New Chat
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto p-2">
                    <AnimatePresence>
                    {chats.map(chat => (
                        <motion.div 
                            key={chat.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20, transition: {duration: animationsEnabled ? 0.15 : 0} }}
                            transition={{ duration: animationsEnabled ? 0.2 : 0 }}
                            className={`group flex items-center justify-between w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                                activeChatId === chat.id 
                                ? 'bg-m3-light-primary/10 dark:bg-m3-dark-primary/10 text-m3-light-primary dark:text-m3-dark-primary' 
                                : 'hover:bg-slate-500/5 dark:hover:bg-slate-500/10'
                            }`}
                        >
                            <button onClick={() => onSelectChat(chat.id)} className="flex-grow truncate pr-2">
                                <span className="font-medium text-sm text-m3-light-on-surface dark:text-m3-dark-on-surface">
                                    {chat.title}
                                </span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteChat(chat.id);
                                }}
                                className="p-1 rounded-full text-m3-light-on-surface-variant/70 dark:text-m3-dark-on-surface-variant/70 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 transition-opacity"
                                aria-label="Delete chat"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                </div>
                <div className="p-2 border-t border-slate-500/10 dark:border-slate-500/20">
                    <button 
                        onClick={onOpenSettings}
                        className="w-full flex items-center gap-3 text-left p-3 rounded-lg hover:bg-slate-500/5 dark:hover:bg-slate-500/10 text-m3-light-on-surface-variant dark:text-m3-dark-on-surface-variant transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">Settings</span>
                    </button>
                </div>
            </motion.div>
        </>
    );
};

export default ChatSidebar;