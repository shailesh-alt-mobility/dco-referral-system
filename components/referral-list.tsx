"use client"

import { useState } from 'react';
import { useGetReferralsQuery, useCreateReferralMutation } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, Car, CheckCircle2, Clock } from 'lucide-react';

export default function ReferralList() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({
    referrerType: 'DCO' as 'DCO' | 'B2C',
    referrerName: '',
    referrerId: '',
    customerName: '',
    customerPhone: '',
    vehicleModel: '',
  });

  // RTK Query hooks
  const { data: referrals, isLoading, error, refetch } = useGetReferralsQuery();
  const [createReferral, { isLoading: isCreating }] = useCreateReferralMutation();

  const handleCreateReferral = async () => {
    try {
      await createReferral(createForm).unwrap();
      toast({
        title: "Success!",
        description: "Referral created successfully",
      });
      setShowCreateDialog(false);
      setCreateForm({
        referrerType: 'DCO',
        referrerName: '',
        referrerId: '',
        customerName: '',
        customerPhone: '',
        vehicleModel: '',
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to create referral",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "EMI Complete":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            EMI Complete
          </Badge>
        );
      case "Delivered":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Car className="w-3 h-3 mr-1" />
            Delivered
          </Badge>
        );
      case "Processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading referrals...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error loading referrals</p>
            <Button onClick={() => refetch()} variant="outline" className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Referrals</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Referral
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Referral List</CardTitle>
          <CardDescription>
            {referrals?.length || 0} referrals found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referral Code</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>EMI Status</TableHead>
                <TableHead>Total Earned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals?.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {referral.referralCode}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{referral.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {referral.customerPhone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{referral.vehicleModel}</TableCell>
                  <TableCell>{getStatusBadge(referral.status)}</TableCell>
                  <TableCell>
                    <Badge variant={referral.emiStatus === "3/3 Paid" ? "default" : "secondary"}>
                      {referral.emiStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-green-600">
                      ₹{referral.totalEarned.toLocaleString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Referral Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Referral</DialogTitle>
            <DialogDescription>
              Add a new customer referral to track
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="referrer-type" className="text-right">
                Type
              </Label>
              <Select
                value={createForm.referrerType}
                onValueChange={(value: 'DCO' | 'B2C') =>
                  setCreateForm(prev => ({ ...prev, referrerType: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DCO">DCO</SelectItem>
                  <SelectItem value="B2C">B2C Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="referrer-name" className="text-right">
                Referrer Name
              </Label>
              <Input
                id="referrer-name"
                value={createForm.referrerName}
                onChange={(e) =>
                  setCreateForm(prev => ({ ...prev, referrerName: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="referrer-id" className="text-right">
                Referrer ID
              </Label>
              <Input
                id="referrer-id"
                value={createForm.referrerId}
                onChange={(e) =>
                  setCreateForm(prev => ({ ...prev, referrerId: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer-name" className="text-right">
                Customer Name
              </Label>
              <Input
                id="customer-name"
                value={createForm.customerName}
                onChange={(e) =>
                  setCreateForm(prev => ({ ...prev, customerName: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer-phone" className="text-right">
                Customer Phone
              </Label>
              <Input
                id="customer-phone"
                value={createForm.customerPhone}
                onChange={(e) =>
                  setCreateForm(prev => ({ ...prev, customerPhone: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicle-model" className="text-right">
                Vehicle Model
              </Label>
              <Input
                id="vehicle-model"
                value={createForm.vehicleModel}
                onChange={(e) =>
                  setCreateForm(prev => ({ ...prev, vehicleModel: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateReferral} disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Referral'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 