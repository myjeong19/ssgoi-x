import type { EasingFunction, Transition } from '../../types';

// Function type for CSS string generation
type CssGenerator = (progress: number) => string;

export interface BaseTransitionParams {
  duration?: number;
  delay?: number;
  easing?: EasingFunction;
}

// Creates a transition with the given parameters and CSS generator
export function createTransition(
  params: BaseTransitionParams,
  generateCss: CssGenerator
): Transition {
  const { duration, delay, easing } = params;
  return {
    duration,
    delay,
    easing,
    css(progress) {
      return generateCss(progress);
    },
  };
}
