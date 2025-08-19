// Configuration for different environments
const config = {
  development: {
    apiUrl: 'http://localhost:5000/api/',
    environment: 'development'
  },
  production: {
    apiUrl: 'https://heartboard-backend.onrender.com/api/',
    environment: 'production'
  }
};

// Get current environment
const env = import.meta.env.MODE || 'development';

// Export current config
export const currentConfig = config[env] || config.development;

// Export API URL
export const API_BASE_URL = currentConfig.apiUrl; 