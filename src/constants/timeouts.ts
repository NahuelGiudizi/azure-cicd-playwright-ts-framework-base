export const TIMEOUTS = {
  PAGE_LOAD: 60000,          // 60 seconds for demo site
  NAVIGATION: 30000,         // 30 seconds for navigation
  ELEMENT_VISIBLE: 3000,     // 3 seconds for element visibility
  SHORT_WAIT: 1000,          // 1 second for UI updates
  MODAL_APPEAR: 2000,        // 2 seconds for modal animations
  NETWORK_IDLE: 5000,        // 5 seconds for network idle
  API_RESPONSE: 5000         // 5 seconds for API response time
} as const;

export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
} as const;
