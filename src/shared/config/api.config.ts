/**
 * API Configuration
 * Centralized config for all Admin API endpoints
 */

// Environment configuration
const envApiUrl = import.meta.env.VITE_API_URL;

// Helper to determine Base URL
const getBaseUrl = () => {
  // If running on production domain (not localhost), use relative path
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }

  if (envApiUrl) {
    return envApiUrl.endsWith('/api') ? envApiUrl : `${envApiUrl}/api`;
  }
  
  // Default to relative path for Nginx proxy
  return '/api';
};

export const apiConfig = {
  // Base URLs
  baseUrl: getBaseUrl(),

  // Helper to build full API URL
  getHttpUrl: (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${getBaseUrl()}${cleanPath}`;
  },

  // All Admin API Endpoints
  endpoints: {
    // Admin Auth
    auth: {
      login: '/admin/auth/login',
      me: '/admin/auth/me',
      logout: '/admin/auth/logout',
    },

    // Admin Dashboard
    dashboard: {
      overview: '/admin/dashboard/overview',
      userStats: '/admin/dashboard/users/stats',
      subscriptionStats: '/admin/dashboard/subscriptions/stats',
      transactionStats: '/admin/dashboard/transactions/stats',
    },

    // User Management
    users: {
      list: '/admin/users',
      get: (id: string) => `/admin/users/${id}`,
      create: '/admin/users',
      update: (id: string) => `/admin/users/${id}`,
      delete: (id: string) => `/admin/users/${id}`,
      toggleStatus: (id: string) => `/admin/users/${id}/status`,
    },

    // Subscription Plan Management
    subscriptions: {
      plans: {
        list: '/subscription/admin/plans',
        get: (id: string) => `/subscription/admin/plans/${id}`,
        create: '/subscription/admin/plans',
        update: (id: string) => `/subscription/admin/plans/${id}`,
        delete: (id: string) => `/subscription/admin/plans/${id}`,
      },
      userSubscriptions: {
        list: '/admin/subscriptions',
        get: (id: string) => `/admin/subscriptions/${id}`,
      },
    },

    // Coin Package Management
    coinPackages: {
      list: '/coin-packages',
      get: (id: string) => `/coin-packages/${id}`,
      create: '/coin-packages',
      delete: (id: string) => `/coin-packages/${id}`,
    },

    // Transaction Management
    transactions: {
      list: '/admin/transactions',
      get: (id: string) => `/admin/transactions/${id}`,
      stats: '/admin/transactions/stats',
      byType: (type: string) => `/admin/transactions/by-type/${type}`,
    },

    // Statistics & Analytics
    statistics: {
      overview: '/admin/statistics/overview',
      userGrowth: '/admin/statistics/user-growth',
      subscriptionDistribution: '/admin/statistics/subscription-distribution',
      transactionsByType: '/admin/statistics/transactions-by-type',
    },
  },

  // Shortcut properties for direct access
  transactions: {
    list: '/admin/transactions',
    get: (id: string) => `/admin/transactions/${id}`,
  },
};
