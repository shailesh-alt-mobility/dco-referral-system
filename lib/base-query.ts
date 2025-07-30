import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { mockApi } from './mock-api';

// Custom base query that can use mock API for development
export const customBaseQuery: BaseQueryFn = async (args, api, extraOptions) => {
  // Use real API for auth endpoints, mock for others
  const { url } = args as any;
  
  // Use real API for auth and leads endpoints
  if (url === '/auth/login' || url === '/leads/add') {
    return fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_API_BASE || 'http://34.47.217.149:3000',
      prepareHeaders: (headers, { getState }) => {
        // Get token from localStorage
        if (typeof window !== 'undefined') {
          const user = localStorage.getItem('user');
          if (user) {
            const userData = JSON.parse(user);
            headers.set('authorization', `Bearer ${userData.token || ''}`);
          }
        }
        return headers;
      },
    })(args, api, extraOptions);
  }
  
  // Use mock API for other endpoints in development (except leads)
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_BASE) {
    return mockBaseQuery(args, api, extraOptions);
  }
  
  // Use real API for other endpoints
  return fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE || 'http://34.47.217.149:3000',
    prepareHeaders: (headers, { getState }) => {
      // Get token from localStorage
      if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          headers.set('authorization', `Bearer ${userData.token || ''}`);
        }
      }
      return headers;
    },
  })(args, api, extraOptions);
};

// Mock base query for development
const mockBaseQuery: BaseQueryFn = async (args, api, extraOptions) => {
  const { url, method = 'GET', body } = args as any;
  
  try {
    let result;
    
    switch (url) {
      case '/auth/login':
        if (method === 'POST') {
          result = await mockApi.login(body.email, body.password);
        }
        break;
        
      case '/referrals':
        if (method === 'GET') {
          result = await mockApi.getReferrals();
        } else if (method === 'POST') {
          result = await mockApi.createReferral(body);
        }
        break;
        
      case '/campaigns':
        if (method === 'GET') {
          result = await mockApi.getCampaigns();
        }
        break;
        
      case '/admin/payouts':
        if (method === 'GET') {
          result = await mockApi.getPayouts();
        }
        break;
        
      case (url as string).match(/\/admin\/payouts\/.*\/approve/)?.input:
        if (method === 'POST') {
          const id = (url as string).split('/')[3];
          result = await mockApi.approvePayout(id);
        }
        break;
        
      case '/admin/fraud-alerts':
        if (method === 'GET') {
          result = await mockApi.getFraudAlerts();
        }
        break;
        
      case '/analytics/dashboard':
        if (method === 'GET') {
          result = await mockApi.getDashboardStats();
        }
        break;
        
      case '/admin/analytics':
        if (method === 'GET') {
          result = await mockApi.getAdminStats();
        }
        break;
        
      case '/leads/add':
        if (method === 'POST') {
          result = await mockApi.createLead(body);
        }
        break;
        
      default:
        throw new Error(`Mock API endpoint not found: ${url}`);
    }
    
    return { data: result };
  } catch (error) {
    return {
      error: {
        status: 400,
        data: { message: error instanceof Error ? error.message : 'Unknown error' },
      },
    };
  }
}; 