import React, { createContext, useContext } from 'react';

interface AnimationContextType {
  animationsEnabled: boolean;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const useAnimation = (): AnimationContextType => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

export { AnimationContext };
