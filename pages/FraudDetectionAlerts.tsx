import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card'
import { Table } from '@/components/ui/table'
import React from 'react'
import { Badge } from '@/components/ui/badge'

const fraudAlerts = [
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
  ]
const FraudDetectionAlerts = () => {
  return (
    <Card>
    <CardHeader>
      <CardTitle>Fraud Detection Alerts</CardTitle>
      <CardDescription>Monitor and manage fraud prevention system</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Alert ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Referrer</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fraudAlerts.map((alert) => (
            <TableRow key={alert.id}>
              <TableCell className="font-medium">{alert.id}</TableCell>
              <TableCell>
                <Badge variant="destructive">{alert.type}</Badge>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{alert.referrerName}</p>
                  <p className="text-sm text-muted-foreground">{alert.referrerId}</p>
                </div>
              </TableCell>
              <TableCell className="max-w-[200px]">
                <p className="text-sm truncate">{alert.details}</p>
              </TableCell>
              <TableCell>{alert.timestamp}</TableCell>
              <TableCell><StatusBadge status={alert.status} /></TableCell>
              <TableCell>
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
  )
}

export default FraudDetectionAlerts