const TOKEN_STORAGE_KEYS = ['user', 'authUser'];

export const getStoredUserPayload = () => {
  for (const key of TOKEN_STORAGE_KEYS) {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) continue;

    try {
      return JSON.parse(rawValue);
    } catch {
      continue;
    }
  }

  return null;
};

export const getStoredToken = () => {
  const payload = getStoredUserPayload();
  if (!payload) return null;

  return payload.token || payload?.user?.token || null;
};
