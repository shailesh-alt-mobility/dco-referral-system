import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './base-query';

// Define types for API responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: number;
    name: string;
    phone: string;
    email: string;
    lastLogin: string;
    role: 'ADMIN' | 'CUSTOMER';
  };
  token: string;
}

export interface Referral {
  id: string;
  referrerType: 'DCO' | 'B2C';
  referrerName: string;
  referrerId: string;
  referralCode: string;
  customerName: string;
  customerPhone: string;
  vehicleModel: string;
  status: 'Processing' | 'Delivered' | 'EMI Complete';
  deliveryDate: string | null;
  emiStatus: string;
  payout1: number;
  payout2: number;
  totalEarned: number;
  createdDate: string;
}

export interface CreateReferralRequest {
  referrerType: 'DCO' | 'B2C';
  referrerName: string;
  referrerId: string;
  customerName: string;
  customerPhone: string;
  vehicleModel: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Scheduled' | 'Completed';
  referrals: number;
  conversions: number;
}

export interface Payout {
  id: string;
  referrerId: string;
  referrerName: string;
  amount: number;
  type: 'Delivery Payout' | 'EMI Completion';
  customerId: string;
  customerName: string;
  dueDate: string;
  status: 'Pending Approval' | 'Ready for Payment' | 'Paid';
}

export interface FraudAlert {
  id: string;
  type: string;
  referrerId: string;
  referrerName: string;
  details: string;
  timestamp: string;
  status: 'Blocked' | 'Under Review' | 'Resolved';
}

export interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  created_by: number;
  created_at: string;
  updated_by: number | null;
  updated_at: string | null;
  source: string;
  referred_by: number | null;
  campaign_id: number | null;
  isActive: boolean;
  referralStatus: string;
}
export interface Leads {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateLeadRequest {
  name: string;
  phone: string;
  email: string;
  address: string;
  source: string;
  referralCode: string;
  campaign_id?: string;
}

// Create the API slice
export const api = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  tagTypes: ['Referral', 'Campaign', 'Payout', 'FraudAlert', 'User', 'Lead'],
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: {
          email: credentials.email,
          otp: credentials.password,
        },
      }),
      invalidatesTags: ['User'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    // Referral endpoints
    getReferrals: builder.query<Referral[], void>({
      query: () => '/referrals',
      providesTags: ['Referral'],
    }),

    getReferralById: builder.query<Referral, string>({
      query: (id) => `/referrals/${id}`,
      providesTags: (result, error, id) => [{ type: 'Referral', id }],
    }),

    createReferral: builder.mutation<Referral, CreateReferralRequest>({
      query: (referral) => ({
        url: '/referrals',
        method: 'POST',
        body: referral,
      }),
      invalidatesTags: ['Referral'],
    }),

    updateReferral: builder.mutation<Referral, { id: string; updates: Partial<Referral> }>({
      query: ({ id, updates }) => ({
        url: `/referrals/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Referral', id }],
    }),

    deleteReferral: builder.mutation<void, string>({
      query: (id) => ({
        url: `/referrals/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Referral'],
    }),

    // Campaign endpoints
    getCampaigns: builder.query<Campaign[], void>({
      query: () => '/campaigns',
      providesTags: ['Campaign'],
    }),

    createCampaign: builder.mutation<Campaign, Omit<Campaign, 'id'>>({
      query: (campaign) => ({
        url: '/campaigns',
        method: 'POST',
        body: campaign,
      }),
      invalidatesTags: ['Campaign'],
    }),

    // Admin endpoints
    getPayouts: builder.query<Payout[], void>({
      query: () => '/admin/payouts',
      providesTags: ['Payout'],
    }),

    approvePayout: builder.mutation<Payout, string>({
      query: (id) => ({
        url: `/admin/payouts/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['Payout'],
    }),

    rejectPayout: builder.mutation<Payout, string>({
      query: (id) => ({
        url: `/admin/payouts/${id}/reject`,
        method: 'POST',
      }),
      invalidatesTags: ['Payout'],
    }),

    getFraudAlerts: builder.query<FraudAlert[], void>({
      query: () => '/admin/fraud-alerts',
      providesTags: ['FraudAlert'],
    }),

    updateFraudAlert: builder.mutation<FraudAlert, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/fraud-alerts/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'FraudAlert', id }],
    }),

    // Analytics endpoints
    getDashboardStats: builder.query<{
      totalReferrals: number;
      activeReferrals: number;
      totalEarnings: number;
      pendingPayouts: number;
      conversionRate: number;
      avgEarningsPerReferral: number;
    }, void>({
      query: () => '/analytics/dashboard',
      providesTags: ['Referral', 'Payout'],
    }),

    getAdminStats: builder.query<{
      totalReferrers: number;
      activeReferrals: number;
      totalPayouts: number;
      pendingPayouts: number;
      conversionRate: number;
      fraudPrevented: number;
    }, void>({
      query: () => '/admin/analytics',
      providesTags: ['Referral', 'Payout', 'FraudAlert'],
    }),

    // Leads endpoints
    createLead: builder.mutation<Lead, CreateLeadRequest>({
      query: (lead) => ({
        url: '/leads/add',
        method: 'POST',
        body: lead,
      }),
      invalidatesTags: ['Lead'],
    }),
    getLeads: builder.query<Leads, void>({
      query: () => '/leads/all',
      providesTags: ['Lead'],
    }),

    moveLeadToCustomer: builder.mutation<void, {leadId: number, customerType: string}>({
      query: (data) => ({
        url: `/leads/move-to-customer`,
        method: 'POST',
        body: {
          "leadId": data.leadId,
          "customerType": data.customerType
        }
      }),
      invalidatesTags: ['Lead'],
    }),
  }),
});

// Export hooks for use in components
export const {
  useLoginMutation,
  useLogoutMutation,
  useGetReferralsQuery,
  useGetReferralByIdQuery,
  useCreateReferralMutation,
  useUpdateReferralMutation,
  useDeleteReferralMutation,
  useGetCampaignsQuery,
  useCreateCampaignMutation,
  useGetPayoutsQuery,
  useApprovePayoutMutation,
  useRejectPayoutMutation,
  useGetFraudAlertsQuery,
  useUpdateFraudAlertMutation,
  useGetDashboardStatsQuery,
  useGetAdminStatsQuery,
  useCreateLeadMutation,
  useGetLeadsQuery,
  useMoveLeadToCustomerMutation,
} = api; 