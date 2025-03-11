import { out, BaseTransitionParams, createTransition, createParams } from './boilerplate';
import type { TransitionFactory } from '../types';

function getOffset(node: Element): number {
  const totalHeight = node.clientHeight;
  const visibleHeight = window.innerHeight - node.clientTop;
  const offset = (50 * visibleHeight) / totalHeight;

  return offset;
}

const DEFAULT_PARAMS = {
  duration: 500,
};

const ripple: TransitionFactory<BaseTransitionParams> = (params = {}) => {
  const mergedParams = createParams(DEFAULT_PARAMS, params);

  return {
    in(node: HTMLElement) {
      const offset = getOffset(node);
      return createTransition(
        mergedParams,
        progress => `clip-path: circle(${progress * 100}% at 50% ${offset}%);`
      );
    },

    out(node: HTMLElement) {
      const offset = getOffset(node);
      return createTransition(
        mergedParams,
        progress => `${out} z-index: 100; clip-path: circle(${progress * 100}% at 50% ${offset}%);`
      );
    },
  };
};

export default ripple;
