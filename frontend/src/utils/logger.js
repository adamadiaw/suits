// frontend/src/utils/logger.js

const isDevelopment = import.meta.env.MODE === 'development';

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  info: (...args) => {
    if (isDevelopment) {
      console.info('ℹ️', ...args);
    }
  },
  warn: (...args) => {
    if (isDevelopment) {
      console.warn('⚠️', ...args);
    }
  },
  error: (...args) => {
    // Les erreurs sont toujours affichées en développement
    if (isDevelopment) {
      console.error('❌', ...args);
    }
    // En production, on pourrait envoyer à un service comme Sentry
  },
};