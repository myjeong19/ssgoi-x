import React, { useLayoutEffect, useRef } from 'react';
import { usePageTransition, useScrollHistory } from '../context/';
import type { TransitionFactory } from '../types';
import { applyTransition } from '../utils';

interface PageTransitionProps {
  children: React.ReactNode;
  transition: TransitionFactory;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  transition,
  className = '',
}) => {
  const { from, to } = usePageTransition();
  const { scrollHistory } = useScrollHistory();
  const nodeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!nodeRef.current || !from || !to) return;

    const node = nodeRef.current;
    const fromScrollTop = scrollHistory[from] || 0;
    const toScrollTop = scrollHistory[to] || 0;

    const { in: transitionIn, out: transitionOut } = transition();

    const inEffect = transitionIn(node, {
      getFromScrollTop: () => fromScrollTop,
      getToScrollTop: () => toScrollTop,
    });
    applyTransition(node, inEffect, {
      getFromScrollTop: () => fromScrollTop,
      getToScrollTop: () => toScrollTop,
    });

    return () => {
      const outEffect = transitionOut(node, {
        getFromScrollTop: () => fromScrollTop,
        getToScrollTop: () => toScrollTop,
      });
      applyTransition(node, outEffect, {
        getFromScrollTop: () => fromScrollTop,
        getToScrollTop: () => toScrollTop,
      });
    };
  }, [from, to, scrollHistory, transition]);

  return (
    <div ref={nodeRef} className={className}>
      {children}
    </div>
  );
};

export default PageTransition;
