import api from './api.js';

// Analytics API
export const analyticsAPI = {
  track: (eventData) => api.post('/analytics/track', eventData),
  getStats: () => api.get('/analytics/stats'),
  getDashboard: (period = '30d') => api.get(`/analytics/dashboard?period=${period}`)
};

// Analytics tracking functions
export const trackEvent = async (eventType, userData = null, page = null, metadata = {}) => {
  try {
    const eventData = {
      eventType,
      userId: userData?._id || null,
      userEmail: userData?.email || null,
      userType: userData?._id ? 'registered' : 'demo',
      page: page || window.location.pathname,
      metadata
    };

    await analyticsAPI.track(eventData);
  } catch (error) {
    // Silently fail analytics tracking to not affect user experience
    console.warn('Analytics tracking failed:', error);
  }
};

// Convenience functions for common events
export const trackLogin = async (userData, isDemo = false) => {
  await trackEvent(isDemo ? 'demo_login' : 'login', userData);
};

export const trackLogout = async (userData) => {
  await trackEvent('logout', userData);
};

export const trackPageView = async (userData, page) => {
  await trackEvent('page_view', userData, page);
};

export const trackRegister = async (userData) => {
  await trackEvent('register', userData);
};
