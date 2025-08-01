import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, CheckCircle2 } from 'lucide-react'
import React from 'react'

const PayoutStructure = () => {
  return (
    <Card>
    <CardHeader>
      <CardTitle>Payout Structure</CardTitle>
      <CardDescription>
        Current referral payout breakdown
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <Car className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <p className="font-medium">Vehicle Delivery</p>
              <p className="text-sm text-muted-foreground">
                Paid upon successful delivery
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              ₹5,000
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <CheckCircle2 className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <p className="font-medium">3 Timely EMIs</p>
              <p className="text-sm text-muted-foreground">
                Paid after 3 consecutive EMIs
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">
              ₹2,500
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
  )
}

export default PayoutStructure