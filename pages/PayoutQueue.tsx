import { TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TableHeader } from '@/components/ui/table'
import {  Table } from 'lucide-react'
import React from 'react'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const payoutQueue = [
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
  ]
const PayoutQueue = () => {
  return (
    <Card>
              <CardHeader>
                <CardTitle>Payout Queue</CardTitle>
                <CardDescription>Manage pending payouts and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payout ID</TableHead>
                      <TableHead>Referrer</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payoutQueue.map((payout: any) => (
                      <TableRow key={payout.id}>
                        <TableCell className="font-medium">{payout.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payout.referrerName}</p>
                            <p className="text-sm text-muted-foreground">{payout.referrerId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payout.customerName}</p>
                            <p className="text-sm text-muted-foreground">{payout.customerId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">₹{payout.amount.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{payout.type}</Badge>
                        </TableCell>
                        <TableCell>{payout.dueDate}</TableCell>
                        <TableCell><StatusBadge status={payout.status} /></TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
  )
}

export default PayoutQueue