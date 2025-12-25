import React from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../contexts/AnimationContext';

interface ToggleSwitchProps {
    isOn: boolean;
    handleToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, handleToggle }) => {
    const { animationsEnabled } = useAnimation();
    
    const switchVariants = {
        on: { x: 20 },
        off: { x: 0 },
    };
    
    return (
        <div
            onClick={handleToggle}
            className={`flex items-center w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${
                isOn ? 'bg-m3-light-primary dark:bg-m3-dark-primary justify-end' : 'bg-m3-light-on-surface/20 dark:bg-m3-dark-on-surface/20 justify-start'
            }`}
        >
            <motion.div
                className="w-5 h-5 bg-white rounded-full shadow-md"
                layout
                transition={animationsEnabled ? { type: 'spring', stiffness: 700, damping: 30 } : { duration: 0 }}
            />
        </div>
    );
};

export default ToggleSwitch;
