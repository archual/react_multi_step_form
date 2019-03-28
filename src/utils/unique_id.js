let lastId = 0;

export const uniqId = (prefix = 'id') => {
  lastId++;
  return `${prefix}-${lastId}`;
};