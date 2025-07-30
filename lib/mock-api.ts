import { LoginResponse, Referral, Campaign, Payout, FraudAlert, Lead, CreateLeadRequest } from './api';

// Mock data
const mockReferrals: Referral[] = [
  {
    id: "REF-DCO-001",
    referrerType: "DCO",
    referrerName: "Rajesh Kumar",
    referrerId: "DCO-MH-001",
    referralCode: "RAJESH-MH-001",
    customerName: "Amit Sharma",
    customerPhone: "+91-9876543210",
    vehicleModel: "Tata Ace Gold",
    status: "Delivered",
    deliveryDate: "2024-01-15",
    emiStatus: "2/3 Paid",
    payout1: 5000,
    payout2: 0,
    totalEarned: 5000,
    createdDate: "2024-01-10",
  },
  {
    id: "REF-B2C-002",
    referrerType: "B2C",
    referrerName: "Priya Patel",
    referrerId: "B2C-GJ-002",
    referralCode: "PRIYA-GJ-002",
    customerName: "Suresh Modi",
    customerPhone: "+91-9876543211",
    vehicleModel: "Mahindra Bolero Pickup",
    status: "EMI Complete",
    deliveryDate: "2023-12-20",
    emiStatus: "3/3 Paid",
    payout1: 5000,
    payout2: 2500,
    totalEarned: 7500,
    createdDate: "2023-12-15",
  },
];

const mockCampaigns: Campaign[] = [
  {
    id: "CAMP-001",
    name: "New Year Vehicle Campaign",
    description: "Special referral campaign for commercial vehicles",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    status: "Active",
    referrals: 45,
    conversions: 23,
  },
  {
    id: "CAMP-002",
    name: "Monsoon Special Offer",
    description: "Referral campaign for monsoon season",
    startDate: "2024-06-01",
    endDate: "2024-09-30",
    status: "Scheduled",
    referrals: 0,
    conversions: 0,
  },
];

const mockPayouts: Payout[] = [
  {
    id: "PAY-001",
    referrerId: "DCO-MH-001",
    referrerName: "Rajesh Kumar",
    amount: 5000,
    type: "Delivery Payout",
    customerId: "CUST-001",
    customerName: "Amit Sharma",
    dueDate: "2024-01-25",
    status: "Pending Approval",
  },
  {
    id: "PAY-002",
    referrerId: "B2C-GJ-002",
    referrerName: "Priya Patel",
    amount: 2500,
    type: "EMI Completion",
    customerId: "CUST-002",
    customerName: "Suresh Modi",
    dueDate: "2024-01-26",
    status: "Ready for Payment",
  },
];

const mockFraudAlerts: FraudAlert[] = [
  {
    id: "FRAUD-001",
    type: "Self Referral Attempt",
    referrerId: "DCO-UP-005",
    referrerName: "Suspicious User",
    details: "Attempted to refer using own phone number",
    timestamp: "2024-01-24 14:30",
    status: "Blocked",
  },
  {
    id: "FRAUD-002",
    type: "Duplicate Number",
    referrerId: "B2C-MH-010",
    referrerName: "Another User",
    details: "Phone number already referred by another user",
    timestamp: "2024-01-24 16:45",
    status: "Blocked",
  },
];

// Mock API functions
export const mockApi = {
  // Authentication
  login: async (email: string, password: string): Promise<LoginResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    
    if (email === 'admin@alt-mobility.com' && password === 'admin') {
      return {
        user: {
          id: 'admin-1',
          email: 'admin@alt-mobility.com',
          name: 'Admin User',
          role: 'admin',
          token: 'mock-admin-token-123',
        },
        message: 'Login successful',
      };
    }
    
    if (email !== 'admin@alt-mobility.com' && password) {
      return {
        user: {
          id: 'customer-1',
          email: email,
          name: email.split('@')[0],
          role: 'customer',
          token: 'mock-customer-token-456',
        },
        message: 'Login successful',
      };
    }
    
    throw new Error('Invalid credentials');
  },

  // Referrals
  getReferrals: async (): Promise<Referral[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockReferrals;
  },

  createReferral: async (referral: any): Promise<Referral> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newReferral: Referral = {
      id: `REF-${Date.now()}`,
      referralCode: `${referral.referrerName.toUpperCase()}-${Date.now()}`,
      ...referral,
      status: 'Processing',
      deliveryDate: null,
      emiStatus: 'Pending',
      payout1: 0,
      payout2: 0,
      totalEarned: 0,
      createdDate: new Date().toISOString().split('T')[0],
    };
    mockReferrals.push(newReferral);
    return newReferral;
  },

  // Campaigns
  getCampaigns: async (): Promise<Campaign[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCampaigns;
  },

  // Admin endpoints
  getPayouts: async (): Promise<Payout[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPayouts;
  },

  approvePayout: async (id: string): Promise<Payout> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const payout = mockPayouts.find(p => p.id === id);
    if (payout) {
      payout.status = 'Paid';
    }
    return payout!;
  },

  getFraudAlerts: async (): Promise<FraudAlert[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockFraudAlerts;
  },

  // Analytics
  getDashboardStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      totalReferrals: mockReferrals.length,
      activeReferrals: mockReferrals.filter(r => r.status !== 'EMI Complete').length,
      totalEarnings: mockReferrals.reduce((sum, r) => sum + r.totalEarned, 0),
      pendingPayouts: mockReferrals.filter(r => r.payout2 === 0 && r.status === 'Delivered').length,
      conversionRate: 76.5,
      avgEarningsPerReferral: 4167,
    };
  },

  getAdminStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      totalReferrers: 1247,
      activeReferrals: 3456,
      totalPayouts: 2847500,
      pendingPayouts: 125000,
      conversionRate: 68.5,
      fraudPrevented: 23,
    };
  },

  // Leads
  createLead: async (lead: CreateLeadRequest): Promise<Lead> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newLead: Lead = {
      id: `LEAD-${Date.now()}`,
      ...lead,
      createdDate: new Date().toISOString().split('T')[0],
    };
    return newLead;
  },
}; 