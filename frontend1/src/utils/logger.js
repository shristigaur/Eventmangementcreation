/**
 * Logging Utility for API calls and data handling
 * Provides consistent logging format across the application
 */

const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

const logger = {
  /**
   * Log API request
   */
  apiRequest: (method, url, data = null) => {
    console.log(
      `%c[API REQUEST] ${method.toUpperCase()} ${url}`,
      'color: #0066cc; font-weight: bold'
    );
    if (data) {
      console.log('%cPayload:', 'color: #0066cc', data);
    }
  },

  /**
   * Log successful API response
   */
  apiSuccess: (method, url, data) => {
    console.log(
      `%c[API SUCCESS] ${method.toUpperCase()} ${url}`,
      'color: #00aa00; font-weight: bold'
    );
    console.log('%cResponse:', 'color: #00aa00', data);
  },

  /**
   * Log API error
   */
  apiError: (method, url, error) => {
    console.error(
      `%c[API ERROR] ${method.toUpperCase()} ${url}`,
      'color: #cc0000; font-weight: bold'
    );
    console.error('%cError Details:', 'color: #cc0000', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
  },

  /**
   * Log state update
   */
  stateUpdate: (componentName, stateName, value) => {
    console.log(
      `%c[STATE UPDATE] ${componentName}`,
      'color: #9933cc; font-weight: bold'
    );
    console.log(`${stateName}:`, value);
  },

  /**
   * Log user action
   */
  userAction: (action, details = null) => {
    console.log(`%c[USER ACTION] ${action}`, 'color: #ff9900; font-weight: bold');
    if (details) {
      console.log('%cDetails:', 'color: #ff9900', details);
    }
  },

  /**
   * Log auth event
   */
  auth: (action, details = null) => {
    console.log(`%c[AUTH] ${action}`, 'color: #00cccc; font-weight: bold');
    if (details) {
      console.log('%cDetails:', 'color: #00cccc', details);
    }
  },

  /**
   * Log data operation
   */
  data: (operation, entity, details = null) => {
    console.log(
      `%c[DATA] ${operation.toUpperCase()} ${entity}`,
      'color: #cc6600; font-weight: bold'
    );
    if (details) {
      console.log('%cDetails:', 'color: #cc6600', details);
    }
  },

  /**
   * Log validation
   */
  validation: (componentName, isValid, errors = null) => {
    const status = isValid ? '✅ VALID' : '❌ INVALID';
    console.log(
      `%c[VALIDATION] ${componentName} - ${status}`,
      `color: ${isValid ? '#00aa00' : '#cc0000'}; font-weight: bold`
    );
    if (errors && Object.keys(errors).length > 0) {
      console.log('%cErrors:', `color: ${isValid ? '#00aa00' : '#cc0000'}`, errors);
    }
  },

  /**
   * Log lifecycle event
   */
  lifecycle: (componentName, event) => {
    console.log(
      `%c[LIFECYCLE] ${componentName} - ${event}`,
      'color: #663399; font-weight: bold'
    );
  },
};

export default logger;
