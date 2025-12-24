import React from 'react';
import { MessageAuthor, type ChatMessage } from '../types';

interface ChatMessageProps {
  message: ChatMessage;
}

const UserIcon: React.FC = () => (
  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white flex-shrink-0">
    U
  </div>
);

const BotIcon: React.FC = () => (
  <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.25c-5.376 0-9.75 4.374-9.75 9.75s4.374 9.75 9.75 9.75 9.75-4.374 9.75-9.75S17.376 2.25 12 2.25ZM9.663 17.51a.75.75 0 0 1-1.06-1.061l1.59-1.59a.75.75 0 1 1 1.06 1.06l-1.59 1.591Zm.99-3.48a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0Zm3.292-5.522a.75.75 0 0 1-1.061 0L11.295 8.85a.75.75 0 0 1 1.06-1.06l1.591 1.59a.75.75 0 0 1 0 1.06Z" />
    </svg>
  </div>
);

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.author === MessageAuthor.USER;
  
  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white'
    : 'bg-slate-700 text-slate-200';
    
  const containerClasses = isUser
    ? 'justify-end'
    : 'justify-start';

  return (
    <div className={`flex items-start gap-3 w-full my-2 animate-fade-in`}>
        <div className={`flex items-start gap-3 w-full ${containerClasses}`}>
            {!isUser && <BotIcon />}
            <div className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-lg shadow-md ${bubbleClasses}`}>
                <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
            {isUser && <UserIcon />}
        </div>
    </div>
  );
};

export default ChatMessageComponent;