import { BaseTransitionParams } from './create-transition';

// Merges default parameters with provided ones
export function createParams(
  defaults: Partial<BaseTransitionParams>,
  params: BaseTransitionParams = {}
): BaseTransitionParams {
  return {
    ...defaults,
    ...params,
  };
}
