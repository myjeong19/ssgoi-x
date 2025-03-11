import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ScrollHistoryContextType {
  scrollHistory: Record<string, number>;
  updateScrollHistory: (path: string, position: number) => void;
}

const ScrollHistoryContext = createContext<ScrollHistoryContextType | undefined>(undefined);

export const ScrollHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scrollHistory, setScrollHistory] = useState<Record<string, number>>({});

  const updateScrollHistory = (path: string, position: number) => {
    setScrollHistory(prev => ({ ...prev, [path]: position }));
  };

  return (
    <ScrollHistoryContext.Provider value={{ scrollHistory, updateScrollHistory }}>
      {children}
    </ScrollHistoryContext.Provider>
  );
};

export const useScrollHistory = () => {
  const context = useContext(ScrollHistoryContext);
  if (!context) {
    throw new Error('useScrollHistory must be used within a ScrollHistoryProvider');
  }
  return context;
};
