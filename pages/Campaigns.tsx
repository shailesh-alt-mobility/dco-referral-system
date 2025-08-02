"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe, MessageCircle, Smartphone } from "lucide-react";
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";

const campaigns = [
  {
    id: "CAMP-001",
    name: "Monsoon Special Offer",
    description: "Referral campaign for monsoon season",
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    status: "Active",
    referrals: 45,
    conversions: 23,
    show: true

  },
  {
    id: "CAMP-002",
    name: "New Year Vehicle Campaign",
    description: "Special referral campaign for commercial vehicles",
    startDate: "2025-11-01",
    endDate: "2026-01-31",
    status: "Scheduled",
    referrals: 0,
    conversions: 0,
    show: false
  },
];
const Campaigns = () => {
  const [platform, setPlatform] = useState('whatsapp');

  const handleShareReferral = async (platform: string, campaign: any) => {
    setPlatform(platform);
    const referralMessage = await getReferralMessage(campaign);
    console.log(referralMessage, platform);

    switch (platform) {
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${referralMessage}&source=${platform}`,
          "_blank"
        );
        break;
      case "meta":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${referralMessage}&source=${platform}`,
          "_blank"
        );
        break;
      case "driver-app":
        // Simulate driver app sharing
        toast({
          title: "Shared to Driver App",
          description: "Campaign shared successfully to Driver App",
        });
        break;
    }
  };
  const getReferralMessage = async (campaign: any) => {
    const link = `https://dco-referral-system.vercel.app/referral/${campaign.id}`;
    const rawMessage = `
Looking to buy or lease a car?

Join our special campaign: ${campaign.name}!
${campaign.description}

Benefits:
- Easy monthly payments
- Low down payment options
- Fast approval, even with low or no credit
- Simple plans to lease or buy

Let me know if you're interested. I'll send you the details. We both get benefits through this campaign.

${link}?source=${platform}
`;
    return encodeURIComponent(rawMessage);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Campaigns</CardTitle>
        <CardDescription>Manage and track referral campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((campaign: any) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <Badge
                    variant={
                      campaign.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {campaign.status}
                  </Badge>
                </div>
                <CardDescription>{campaign.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span>
                      {campaign.startDate} to {campaign.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Referrals:</span>
                    <span className="font-medium">{campaign.referrals}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Conversions:</span>
                    <span className="font-medium text-green-600">
                      {campaign.conversions}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleShareReferral("whatsapp", campaign)}
                    disabled={!campaign.show}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    WhatsApp
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleShareReferral("driver-app", campaign)}
                    disabled={!campaign.show}
                  >
                    <Smartphone className="w-4 h-4 mr-1" />
                    Driver App
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleShareReferral("meta", campaign)}
                    disabled={!campaign.show}
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    Meta
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Campaigns;
