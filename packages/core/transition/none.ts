import { out, BaseTransitionParams, createTransition, createParams } from './boilerplate';
import type { TransitionFactory } from '../types';

const DEFAULT_PARAMS = {
  duration: 0,
  delay: 0,
};

const none: TransitionFactory<BaseTransitionParams> = (params = {}) => {
  const mergedParams = createParams(DEFAULT_PARAMS, params);

  return {
    in() {
      return createTransition(mergedParams, () => ``);
    },
    out() {
      return createTransition(mergedParams, () => `${out} opacity: 0;`);
    },
  };
};

export default none;
