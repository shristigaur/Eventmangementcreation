export const getApiErrorMessage = (error, fallbackMessage) => {
  if (!error) {
    return fallbackMessage;
  }

  const responseMessage = error.response?.data?.message;
  if (responseMessage) {
    return responseMessage;
  }

  if (error.code === 'ERR_NETWORK') {
    return 'API is temporarily unavailable. Please try again in a moment.';
  }

  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. The server may be waking up or busy.';
  }

  if (error.response?.status === 502 || error.response?.status === 503 || error.response?.status === 504) {
    return 'Server is temporarily unavailable. Please retry shortly.';
  }

  return error.message || fallbackMessage;
};