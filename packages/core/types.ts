export type EasingFunction = (progress: number) => number;

export interface ScrollInfo {
  getFromScrollTop: () => number;
  getToScrollTop: () => number;
}

export interface Transition {
  delay?: number;
  duration?: number;
  easing?: EasingFunction;
  css?: (progress: number, invertedProgress: number) => string;
  tick?: (progress: number, invertedProgress: number) => void;
}

export type TransitionConfig = Transition | (() => Transition);
export type GetTransitionConfig = (node: HTMLElement, scrollInfo: ScrollInfo) => TransitionConfig;

export type TransitionFactory<T = object> = (params?: T) => {
  in: GetTransitionConfig;
  out: GetTransitionConfig;
};
