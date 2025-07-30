import { ReferralForm } from './referral-form';

interface ReferralPageProps {
  params: Promise<{
    referralCode: string;
  }>;
}

export default async function ReferralPage({ params }: ReferralPageProps) {
  const { referralCode } = await params;
  
  return <ReferralForm referralCode={referralCode} />;
} 