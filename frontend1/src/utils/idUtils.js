// Utility helpers for ID validation
export const isValidObjectId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return /^[a-fA-F0-9]{24}$/.test(id);
};

export default isValidObjectId;
