import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { mockApi } from './mock-api';

// Custom base query that proxies all API calls through /api/proxy to avoid CORS
export const customBaseQuery: BaseQueryFn = async (args, api, extraOptions) => {
  let proxyUrl: string;
  if (typeof args === 'string') {
    proxyUrl = args.startsWith('/api/proxy') ? args : `/api/proxy${args}`;
  } else if (args && typeof args.url === 'string') {
    proxyUrl = args.url.startsWith('/api/proxy') ? args.url : `/api/proxy${args.url}`;
  } else {
    throw new Error('No URL provided to base query');
  }

  // Use mock API for development if needed
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_BASE) {
    return mockBaseQuery(args, api, extraOptions);
  }

  return fetchBaseQuery({
    baseUrl: '',
    prepareHeaders: (headers, { getState }) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
      }
      return headers;
    },
  })({ ...args, url: proxyUrl }, api, extraOptions);
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