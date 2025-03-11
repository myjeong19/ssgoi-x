export const cubicOut = (progress: number) => {
  const offsetProgress = progress - 1.0;
  return offsetProgress * offsetProgress * offsetProgress + 1.0;
};
