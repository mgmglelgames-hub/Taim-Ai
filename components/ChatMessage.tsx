import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageAuthor, type ChatMessage } from '../types';

interface ChatMessageProps {
  message: ChatMessage;
}

const UserIcon: React.FC = () => (
  <div className="w-8 h-8 rounded-full bg-m3-light-primary-container dark:bg-m3-dark-primary-container flex items-center justify-center text-m3-light-on-primary-container dark:text-m3-dark-on-primary-container flex-shrink-0">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.5a.75.75 0 01.75.75v.255a5.98 5.98 0 013.484 2.138 6.002 6.002 0 012.012 6.919c-.832 2.36-2.548 3.993-4.631 4.69a.75.75 0 01-.631-1.362 3.488 3.488 0 002.724-2.617 4.502 4.502 0 00-1.503-5.183A4.48 4.48 0 0012 6.5a4.48 4.48 0 00-2.75 1.033 4.502 4.502 0 00-1.503 5.183 3.488 3.488 0 002.724 2.617.75.75 0 11-.63 1.363c-2.083-.696-3.799-2.33-4.632-4.69a6.002 6.002 0 012.012-6.92A5.98 5.98 0 0111.25 3.505V3.25a.75.75 0 01.75-.75z" />
      <path d="M12 12.25a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5z" />
    </svg>
  </div>
);

const BotIcon: React.FC = () => (
  <div className="w-8 h-8 rounded-full bg-m3-light-surface-container dark:bg-m3-dark-surface-container flex items-center justify-center flex-shrink-0">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-m3-light-primary dark:text-m3-dark-primary" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.25c-5.376 0-9.75 4.374-9.75 9.75s4.374 9.75 9.75 9.75 9.75-4.374 9.75-9.75S17.376 2.25 12 2.25ZM9.663 17.51a.75.75 0 0 1-1.06-1.061l1.59-1.59a.75.75 0 1 1 1.06 1.06l-1.59 1.591Zm.99-3.48a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0Zm3.292-5.522a.75.75 0 0 1-1.061 0L11.295 8.85a.75.75 0 0 1 1.06-1.06l1.591 1.59a.75.75 0 0 1 0 1.06Z" />
    </svg>
  </div>
);

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.author === MessageAuthor.USER;
  
  const bubbleClasses = isUser
    ? 'bg-m3-light-primary-container dark:bg-m3-dark-primary-container text-m3-light-on-primary-container dark:text-m3-dark-on-primary-container rounded-3xl rounded-br-md'
    : 'bg-m3-light-surface-container dark:bg-m3-dark-surface-container text-m3-light-on-surface dark:text-m3-dark-on-surface rounded-3xl rounded-bl-md';
    
  const containerClasses = isUser
    ? 'justify-end'
    : 'justify-start';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex items-start gap-3 w-full`}
    >
        <div className={`flex items-start gap-3 w-full ${containerClasses}`}>
            {!isUser && <BotIcon />}
            <div className={`max-w-md lg:max-w-2xl px-4 py-3 shadow-sm ${bubbleClasses}`}>
                 {message.imageUrl && (
                    <img
                        src={message.imageUrl}
                        alt="User upload"
                        className="rounded-lg mb-2 max-w-full h-auto"
                    />
                 )}
                {message.text && (isUser ? 
                  <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  :
                  <div className="markdown-content">
                    <ReactMarkdown
                      children={message.text}
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 my-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1 my-2" {...props} />,
                        li: ({node, ...props}) => <li className="pl-2" {...props} />,
                        pre: ({node, ...props}) => <pre className="bg-m3-light-on-surface/10 dark:bg-m3-dark-on-surface/10 p-3 rounded-lg my-2 text-sm overflow-x-auto" {...props} />,
                        code({node, inline, className, children, ...props}) {
                            return !inline ? (
                                <code className={className} {...props}>{children}</code>
                            ) : (
                                <code className="bg-m3-light-on-surface/10 dark:bg-m3-dark-on-surface/10 px-1.5 py-1 rounded text-[0.9em]" {...props}>
                                    {children}
                                </code>
                            )
                        }
                      }}
                    />
                  </div>
                )}
            </div>
            {isUser && <UserIcon />}
        </div>
    </motion.div>
  );
};

export default ChatMessageComponent;