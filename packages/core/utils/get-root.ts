const DATA_SSGOI = 'data-ssgoi';

export const getRootRect = () => {
  const root = document.querySelector(`[${DATA_SSGOI}]`);
  if (root == null) throw new Error('No root element found on ssgoi');
  return root.getBoundingClientRect();
};
