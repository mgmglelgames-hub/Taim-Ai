import React from 'react';
import { motion } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';
import { useAnimation } from '../contexts/AnimationContext';

interface HeaderProps {
  onMenuClick: () => void;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onOpenSettings }) => {
  const { animationsEnabled } = useAnimation();

  const headerVariants = {
      initial: { y: -60, opacity: 0 },
      animate: { y: 0, opacity: 1 },
  };

  return (
    <motion.header 
      initial={animationsEnabled ? "initial" : false}
      animate={animationsEnabled ? "animate" : false}
      variants={headerVariants}
      transition={{ duration: animationsEnabled ? 0.3 : 0, ease: 'easeOut' }}
      className="bg-m3-light-surface-container-low/80 dark:bg-m3-dark-surface-container-low/80 backdrop-blur-xl p-2 md:p-4 border-b border-slate-500/10 dark:border-slate-500/20 shadow-sm sticky top-0 z-10 flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <button 
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-full text-m3-light-on-surface-variant dark:text-m3-dark-on-surface-variant hover:bg-slate-500/10 dark:hover:bg-slate-500/20"
            aria-label="Open chat history"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </button>
        <div className="hidden md:block w-10"></div>
      </div>

      <h1 className="text-xl font-medium text-center text-m3-light-on-surface dark:text-m3-dark-on-surface flex items-center justify-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-m3-light-primary dark:text-m3-dark-primary" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.25c-5.376 0-9.75 4.374-9.75 9.75s4.374 9.75 9.75 9.75 9.75-4.374 9.75-9.75S17.376 2.25 12 2.25ZM9.663 17.51a.75.75 0 0 1-1.06-1.061l1.59-1.59a.75.75 0 1 1 1.06 1.06l-1.59 1.591Zm.99-3.48a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0Zm3.292-5.522a.75.75 0 0 1-1.061 0L11.295 8.85a.75.75 0 0 1 1.06-1.06l1.591 1.59a.75.75 0 0 1 0 1.06Z" />
        </svg>
        Taim Ai
      </h1>

      <div className="flex items-center gap-1">
        <ThemeSwitcher />
        <button
          onClick={onOpenSettings}
          className="w-10 h-10 flex items-center justify-center rounded-full text-m3-light-on-surface-variant dark:text-m3-dark-on-surface-variant hover:bg-slate-500/10 dark:hover:bg-slate-500/20 transition-colors"
          aria-label="Open settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="md:hidden w-10"></div>
      </div>
    </motion.header>
  );
};

export default Header;