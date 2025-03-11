import React, { useEffect, useRef } from 'react';
import { usePageTransition, useScrollHistory } from '../context';
import type { TransitionEffect, TransitionRouteConfig } from '../types';

interface SsgoiProps {
  className?: string;
  onNavigate: (callback: (info: { from: { url: URL }; to: { url: URL } }) => void) => void;
  config: TransitionRouteConfig;
  children?: React.ReactNode;
}

const Ssgoi: React.FC<SsgoiProps> = ({ className = '', onNavigate, config, children }) => {
  const { setFrom, setTo } = usePageTransition();
  const { updateScrollHistory } = useScrollHistory();
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleNavigation = ({ from, to }: { from: { url: URL }; to: { url: URL } }) => {
      const fromPath = from.url.pathname;
      const toPath = to.url.pathname;

      setFrom(fromPath);
      setTo(toPath);

      if (nodeRef.current) {
        const transitionEffect: TransitionEffect = config(
          { path: fromPath, url: from.url },
          { path: toPath, url: to.url }
        );

        const inEffect = transitionEffect.in(nodeRef.current, {
          getFromScrollTop: () => 0,
          getToScrollTop: () => 0,
        });

        if (typeof inEffect === 'function') {
          inEffect();
        }
      }
    };

    onNavigate(handleNavigation);

    onNavigate(({ from }) => {
      const path = from?.url.pathname;
      if (path == null) return;

      const { scrollingElement } = document;
      if (scrollingElement == null) return;

      updateScrollHistory(path, scrollingElement.scrollTop);
    });
  }, [onNavigate, config, setFrom, setTo, updateScrollHistory]);

  return (
    <div ref={nodeRef} data-ssgoi className={`page-transition-root ${className}`}>
      {children}
    </div>
  );
};

export default Ssgoi;
