 /**
 * FRONTEND DATA HANDLING GUIDE
 * DO NOT USE AS EXECUTABLE CODE
 * ONLY FOR DEVELOPMENT STANDARDS
 */

// ======================================================
// 1. API SERVICE LAYER USAGE
// ======================================================

// Always import APIs from service layer
// Example usage only (NOT actual runtime logic)

export const API_RULE = {
  NOTE: "Always use authAPI, eventAPI, rsvpAPI from /api layer",
  FORBIDDEN: "Direct axios or fetch calls in components"
};


// ======================================================
// 2. ASYNC/AWAIT PATTERN
// ======================================================

export const ASYNC_RULE = {
  NOTE: "All API calls must use async/await",
  TEMPLATE: `
  const handleAction = async () => {
    try {
      const res = await apiCall();
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  }
  `
};


// ======================================================
// 3. ERROR HANDLING STANDARD
// ======================================================

export const ERROR_RULE = {
  MUST_USE: "try/catch in all async functions",
  PATTERN: {
    401: "Unauthorized - redirect to login",
    404: "Not Found - show friendly message",
    400: "Bad Request - show backend message",
    DEFAULT: "Something went wrong"
  }
};


// ======================================================
// 4. LOGGING SYSTEM RULES
// ======================================================

export const LOGGING_RULE = {
  TYPES: [
    "apiRequest",
    "apiSuccess",
    "apiError",
    "stateUpdate",
    "userAction",
    "auth",
    "validation",
    "lifecycle"
  ],
  NOTE: "Use logger utility only for debugging, remove in production"
};


// ======================================================
// 5. AUTH FLOW RULE
// ======================================================

export const AUTH_RULE = {
  STORAGE: "token stored in localStorage",
  FLOW: [
    "login → store token",
    "register → auto login optional",
    "logout → clear storage",
    "refresh → call /me API"
  ]
};


// ======================================================
// 6. API ENDPOINTS MAP
// ======================================================

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "POST /auth/login",
    REGISTER: "POST /auth/register",
    ME: "GET /auth/me"
  },
  EVENTS: {
    GET_ALL: "GET /events",
    GET_ONE: "GET /events/:id",
    CREATE: "POST /events",
    UPDATE: "PUT /events/:id",
    DELETE: "DELETE /events/:id"
  },
  RSVP: {
    ADD: "POST /events/:id/rsvp",
    GET: "GET /events/:id/rsvps"
  }
};


// ======================================================
// 7. DEBUGGING CHECKLIST
// ======================================================

export const DEBUGGING = {
  STEPS: [
    "Check console errors",
    "Check network tab",
    "Check API response status",
    "Check localStorage token",
    "Verify backend running",
    "Check routes match backend"
  ]
};