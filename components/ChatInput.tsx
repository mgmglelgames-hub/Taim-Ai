import React, { useState, useRef } from 'react';

interface ChatInputProps {
  onSend: (prompt: string, imageUrl?: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="bg-slate-800 p-4 border-t border-slate-700 shadow-inner">
        {imagePreview && (
            <div className="relative inline-block mb-2 max-w-xs">
                <img src={imagePreview} alt="Image preview" className="rounded-lg h-24 w-auto" />
                <button
                    onClick={removeImage}
                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-slate-700 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold hover:bg-red-500 transition-colors"
                    aria-label="Remove image"
                >
                    &times;
                </button>
            </div>
        )}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-4xl mx-auto">
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
            className="p-3 text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
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
          placeholder="Ask me anything, or describe the image..."
          className="flex-grow bg-slate-900 text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 disabled:opacity-50"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || (!prompt.trim() && !imagePreview)}
          className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
          aria-label="Send message"
        >
          {isLoading ? (
            <div className="w-6 h-6 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;