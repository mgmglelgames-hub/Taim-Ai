import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '../contexts/AnimationContext';

interface ChatInputProps {
  onSend: (prompt: string, imageUrl?: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { animationsEnabled } = useAnimation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
      setImagePreview(null);
      if(fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((prompt.trim() || imagePreview) && !isLoading) {
      onSend(prompt, imagePreview ?? undefined);
      setPrompt('');
      removeImage();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  }

  return (
    <div className="bg-m3-light-surface-container-low/80 dark:bg-m3-dark-surface-container-low/80 backdrop-blur-xl p-2 sm:p-4 border-t border-slate-500/10 dark:border-slate-500/20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
            <AnimatePresence>
                {imagePreview && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: animationsEnabled ? 0.2 : 0 }}
                        className="relative inline-block mb-2 ml-12"
                    >
                        <img src={imagePreview} alt="Image preview" className="rounded-lg h-24 w-auto" />
                        <button
                            onClick={removeImage}
                            className="absolute top-0 right-0 -m-2 bg-slate-600 dark:bg-slate-700 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold hover:bg-red-500 transition-colors"
                            aria-label="Remove image"
                        >
                            &times;
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="p-2 text-m3-light-on-surface-variant dark:text-m3-dark-on-surface-variant hover:bg-slate-500/10 dark:hover:bg-slate-500/20 rounded-full disabled:opacity-50 transition-colors"
                    aria-label="Attach image"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                </button>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message Taim Ai..."
                    className="flex-grow bg-m3-light-surface-container dark:bg-m3-dark-surface-container text-m3-light-on-surface dark:text-m3-dark-on-surface rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-m3-light-primary dark:focus:ring-m3-dark-primary transition-shadow duration-200 disabled:opacity-50"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || (!prompt.trim() && !imagePreview)}
                    className="bg-m3-light-primary dark:bg-m3-dark-primary text-m3-light-on-primary dark:text-m3-dark-on-primary rounded-full w-[48px] h-[48px] hover:opacity-90 disabled:bg-slate-500/20 dark:disabled:bg-slate-500/20 disabled:text-slate-500/50 dark:disabled:text-slate-500/50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 flex items-center justify-center"
                    aria-label="Send message"
                >
                    <AnimatePresence initial={false} mode="wait">
                        <motion.div
                            key={isLoading ? 'spinner' : 'icon'}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: animationsEnabled ? 0.2 : 0 }}
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 animate-spin rounded-full border-t-2 border-b-2 border-current"></div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                                </svg>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </button>
            </form>
        </div>
    </div>
  );
};

export default ChatInput;