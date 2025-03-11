import { out, BaseTransitionParams, createTransition } from './boilerplate';
import type { TransitionFactory } from '../types';

const fade: TransitionFactory<BaseTransitionParams> = (params = {}) => ({
  in() {
    return createTransition(params, progress => `opacity: ${progress};`);
  },

  out() {
    return createTransition(params, progress => `${out}; opacity: ${progress}`);
  },
});

export default fade;
