import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Table } from '@/components/ui/table';
import { Share2 } from 'lucide-react';
import React from 'react'

const AllReferrals = ({filteredReferrals, setSelectedReferral, setShowShareDialog}: {filteredReferrals: any, setSelectedReferral: any, setShowShareDialog: any}) => {
  return (
    <Card>
    <CardHeader>
      <CardTitle>
        All Referrals ({filteredReferrals?.length})
      </CardTitle>
      <CardDescription>
        Track your referrals and earnings
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead>Referral Code</TableHead> */}
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReferrals?.map((referral: any) => (
            <TableRow key={referral.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{referral.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {referral.phone}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={referral.referralStatus}/>
              </TableCell>
              {referral.referralStatus ===
                "CONVERTED_TO_CUSTOMER" && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedReferral(referral);
                      setShowShareDialog(true);
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
  )
}

export default AllReferrals