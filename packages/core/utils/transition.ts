import type { TransitionConfig } from '../types';

export const applyTransition = (
  node: HTMLElement,
  transitionConfig: TransitionConfig,
  params: { getFromScrollTop: () => number; getToScrollTop: () => number }
) => {
  const config = typeof transitionConfig === 'function' ? transitionConfig() : transitionConfig;
  const { duration = 300, css, tick } = config;

  if (css) {
    node.style.cssText = css(0, 1);
  }

  const start = performance.now();
  const animate = (time: number) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const invertedProgress = 1 - progress;

    if (css) {
      node.style.cssText = css(progress, invertedProgress);
    }
    if (tick) {
      tick(progress, invertedProgress);
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};
