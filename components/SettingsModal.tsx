import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '../contexts/AnimationContext';
import ToggleSwitch from './ToggleSwitch';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    animationsEnabled: boolean;
    onToggleAnimations: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, animationsEnabled, onToggleAnimations }) => {
    const { animationsEnabled: contextAnimationsEnabled } = useAnimation();

    const backdropVariants = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    };

    const modalVariants = {
        visible: { opacity: 1, scale: 1, y: 0 },
        hidden: { opacity: 0, scale: 0.9, y: 20 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-40 flex items-center justify-center p-4"
                    onClick={onClose}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={backdropVariants}
                    transition={{ duration: contextAnimationsEnabled ? 0.2 : 0 }}
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <motion.div
                        className="bg-m3-light-surface-container-low dark:bg-m3-dark-surface-container-low rounded-2xl shadow-xl w-full max-w-sm p-6"
                        onClick={(e) => e.stopPropagation()}
                        variants={modalVariants}
                        transition={{ duration: contextAnimationsEnabled ? 0.2 : 0, ease: 'easeOut' }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-medium text-m3-light-on-surface dark:text-m3-dark-on-surface">Settings</h2>
                            <button onClick={onClose} className="p-1 rounded-full text-m3-light-on-surface-variant dark:text-m3-dark-on-surface-variant hover:bg-slate-500/10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div>
                            <div className="flex items-center justify-between py-3">
                                <div className="text-m3-light-on-surface dark:text-m3-dark-on-surface">
                                    <h3 className="font-medium">Animations</h3>
                                    <p className="text-sm text-m3-light-on-surface-variant dark:text-m3-dark-on-surface-variant">Enable/disable UI animations.</p>
                                </div>
                                <ToggleSwitch
                                    isOn={animationsEnabled}
                                    handleToggle={onToggleAnimations}
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
