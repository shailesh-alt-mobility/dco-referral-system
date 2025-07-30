# DCO Referral System

A comprehensive referral management system for DCOs (Dealer Channel Operators) and B2C customers with authentication and role-based access control.

## Features

- 🔐 **Authentication System**: Login with email-based role detection
- 👥 **Role-Based Access**: Admin and Customer dashboards
- 📊 **RTK Query Integration**: Efficient data fetching and caching
- 🎨 **Modern UI**: Built with shadcn/ui components
- 📱 **Responsive Design**: Works on all devices
- 🔄 **Real-time Updates**: Automatic cache invalidation

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **State Management**: Redux Toolkit, RTK Query
- **UI Components**: shadcn/ui, Tailwind CSS
- **HTTP Client**: Axios
- **Authentication**: Custom JWT-based system

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dco-referral-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication

### Demo Credentials

- **Admin**: `admin@alt-mobility.com` / `admin`
- **Customer**: Any email (e.g., `customer@example.com`) / Any password

### How it Works

The system automatically detects user roles based on email:
- `admin@alt-mobility.com` → Admin role → Redirects to `/admin`
- Any other email → Customer role → Redirects to `/`

## RTK Query Setup

### API Structure

The application uses RTK Query for efficient data fetching with the following structure:

```
lib/
├── api.ts              # Main API slice with all endpoints
├── axios.ts            # Axios instance with interceptors
├── base-query.ts       # Custom base query (real/mock switching)
├── mock-api.ts         # Mock API for development
├── store.ts            # Redux store configuration
└── hooks.ts            # Typed Redux hooks
```

### Available Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

#### Referrals
- `GET /referrals` - Get all referrals
- `GET /referrals/:id` - Get specific referral
- `POST /referrals` - Create new referral
- `PATCH /referrals/:id` - Update referral
- `DELETE /referrals/:id` - Delete referral

#### Campaigns
- `GET /campaigns` - Get all campaigns
- `POST /campaigns` - Create new campaign

#### Admin Endpoints
- `GET /admin/payouts` - Get payout queue
- `POST /admin/payouts/:id/approve` - Approve payout
- `POST /admin/payouts/:id/reject` - Reject payout
- `GET /admin/fraud-alerts` - Get fraud alerts
- `PATCH /admin/fraud-alerts/:id` - Update fraud alert

#### Analytics
- `GET /analytics/dashboard` - Get dashboard stats
- `GET /admin/analytics` - Get admin stats

### Using RTK Query Hooks

```tsx
import { useGetReferralsQuery, useCreateReferralMutation } from '@/lib/api';

function MyComponent() {
  // Query hook for fetching data
  const { data: referrals, isLoading, error, refetch } = useGetReferralsQuery();
  
  // Mutation hook for creating data
  const [createReferral, { isLoading: isCreating }] = useCreateReferralMutation();

  const handleCreate = async () => {
    try {
      await createReferral(newReferralData).unwrap();
      // Success handling
    } catch (error) {
      // Error handling
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      {referrals?.map(referral => (
        <div key={referral.id}>{referral.customerName}</div>
      ))}
    </div>
  );
}
```

### Mock API vs Real API

The system automatically switches between mock and real APIs:

- **Development** (no `NEXT_PUBLIC_API_URL`): Uses mock API
- **Production** (with `NEXT_PUBLIC_API_URL`): Uses real API

To use a real API, set the environment variable:
```bash
NEXT_PUBLIC_API_URL=http://your-api-url.com/api
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Customer dashboard
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── login-form.tsx    # Login form
│   ├── protected-route.tsx # Route protection
│   └── referral-list.tsx # Example RTK Query usage
├── hooks/                # Custom hooks
│   └── use-auth.tsx      # Authentication hook
├── lib/                  # Utilities and configurations
│   ├── api.ts           # RTK Query API slice
│   ├── auth.ts          # Authentication utilities
│   ├── axios.ts         # Axios configuration
│   ├── base-query.ts    # Custom base query
│   ├── mock-api.ts      # Mock API implementation
│   ├── store.ts         # Redux store
│   └── hooks.ts         # Typed Redux hooks
└── middleware.ts         # Next.js middleware for auth
```

## Environment Variables

Create a `.env.local` file:

```env
# Optional: Set to use real API instead of mock
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. # dco-referral-system
