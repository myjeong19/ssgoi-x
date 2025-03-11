import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PageTransitionContextType {
  from: string | null;
  to: string | null;
  setFrom: (from: string | null) => void;
  setTo: (to: string | null) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export const PageTransitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);

  return (
    <PageTransitionContext.Provider value={{ from, to, setFrom, setTo }}>
      {children}
    </PageTransitionContext.Provider>
  );
};

export const usePageTransition = () => {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within a PageTransitionProvider');
  }
  return context;
};
