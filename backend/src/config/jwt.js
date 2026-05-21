const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is not defined');
  }

  console.warn('⚠️  JWT_SECRET is not defined. Using development-only fallback.');
  return 'event-management-development-secret';
};

export default getJwtSecret;
