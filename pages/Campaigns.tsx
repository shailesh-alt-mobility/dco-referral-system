"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, MessageCircle, Smartphone } from 'lucide-react'
import React from 'react'

const campaigns = [
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
const Campaigns = () => {
  return (
    <Card>
    <CardHeader>
      <CardTitle>Active Campaigns</CardTitle>
      <CardDescription>
        Manage and track referral campaigns
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((campaign: any) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {campaign.name}
                </CardTitle>
                <Badge
                  variant={
                    campaign.status === "Active"
                      ? "default"
                      : "secondary"
                  }
                >
                  {campaign.status}
                </Badge>
              </div>
              <CardDescription>
                {campaign.description}
              </CardDescription>
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
                  <span className="font-medium">
                    {campaign.referrals}
                  </span>
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
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  WhatsApp
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  <Smartphone className="w-4 h-4 mr-1" />
                  Driver App
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
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
  )
}

export default Campaigns