import { ReferralForm } from '@/app/referral/[referralCode]/referral-form';

interface ReferralPageProps {
  params: Promise<{
    referralCode: string;
  }>;
}

export default async function ReferralPage({ params }: ReferralPageProps) {
  const { referralCode } = await params;
  
  return <ReferralForm referralCode={referralCode} />;
} 