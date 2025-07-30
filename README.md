# DCO Referral System

Digital Referral Management for DCOs & B2C Customers

## Features

- **Authentication System**: Secure login for DCOs and customers
- **Admin Dashboard**: Comprehensive admin panel for managing referrals
- **Customer Dashboard**: User-friendly interface for customers
- **Referral System**: Dynamic referral pages accessible without login

## Referral System

The referral system allows users to create and share referral links that can be accessed by anyone without requiring authentication.

### How to Use the Referral System

1. **Access Referral Page**: Navigate to `/referral/[referralCode]` where `[referralCode]` is the unique referral code
2. **Add Optional Parameters**: You can also add `referredBy` as a query parameter
3. **Form Submission**: Users fill out the form and submit their information

### Example URLs

- Basic referral: `/referral/ABC123`
- With referredBy parameter: `/referral/ABC123?referredBy=john.doe`

### Form Fields

The referral form includes:
- **Name** (required): Full name of the person being referred
- **Email** (required): Email address
- **Phone Number** (required): Contact phone number
- **Address** (required): Full address
- **Referral Code** (disabled): Automatically extracted from URL
- **Referred By** (optional, disabled): Shows if provided in URL

### API Endpoint

Leads are submitted to `/api/leads/add` with the following data structure:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, State 12345",
  "source": "referral_form",
  "referralCode": "ABC123",
  "campaign_id": "optional_campaign_id"
}
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Authentication

- **Admin Login**: `admin@alt-mobility.com` (redirects to `/admin`)
- **Customer Login**: Any other email (redirects to `/`)

## Project Structure

```
├── app/
│   ├── admin/           # Admin dashboard
│   ├── login/           # Login page
│   ├── referral/        # Referral system
│   └── api/             # API routes
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
└── middleware.ts       # Authentication middleware
```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern UI components
- **Lucide React**: Icon library
