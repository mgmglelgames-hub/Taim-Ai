import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
     <div className="w-5 h-5 border-2 border-m3-light-on-surface-variant dark:border-m3-dark-on-surface-variant border-t-transparent rounded-full animate-spin"></div>
  );
};

export default LoadingSpinner;