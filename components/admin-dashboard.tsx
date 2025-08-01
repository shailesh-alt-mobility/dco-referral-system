"use client"

import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import {
  Users,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Activity,
  BarChart3,
} from "lucide-react"
import { useCustomerPayoutsMutation, useGetAnalyticsQuery, useGetLeadsQuery, useMoveLeadToCustomerMutation } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import Header from "./Header"
import PayoutQueue from "@/pages/PayoutQueue"
import FraudDetectionAlerts from "@/pages/FraudDetectionAlerts"
import Campaigns from "@/pages/Campaigns"

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  const { data: customers, isLoading: isLeadsLoading } = useGetLeadsQuery();
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useGetAnalyticsQuery();

  const [moveLeadToCustomer, { isLoading: isMoving }] = useMoveLeadToCustomerMutation();
  const [customerPayouts] = useCustomerPayoutsMutation();

  const handleMoveToCustomer = async (id: number) => {
    try {
      const response = await moveLeadToCustomer({ leadId: id, customerType: "DCO" }).unwrap();
      const customerId = response?.customer?.id
      console.log("customerId", customerId);

      const payoutsData = await getApprovedPayouts(customerId);
      console.log("payoutsData", payoutsData);
      
      toast({
        title: "Success!",
        description: "Lead successfully moved to customer status.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to move lead to customer:", error);
      
      toast({
        title: "Error",
        description: "Failed to move lead to customer. Please try again.",
        variant: "destructive",
      });
    }
  }

  const getApprovedPayouts = async (customerId: number) => {
    await customerPayouts({ cust_id: customerId, is3rdEmi: false });
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header user={user} logout={logout}/>  

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referrers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData?.analytics?.totalReferrals.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                +25% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful Referrals</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{analyticsData?.analytics?.activeReferrals.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
              <IndianRupee className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{(analyticsData?.analytics?.totalEarnings / 100000).toFixed(1)}L</div>
              <p className="text-xs text-muted-foreground">Lifetime payouts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Earnings Per Lead</CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{analyticsData?.analytics?.avgEarningsPerLead}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                ₹{(analyticsData?.analytics?.pendingPayouts / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{analyticsData?.analytics?.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">System average</p>
            </CardContent>
          </Card>

        
        </div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customers">Leads</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Activity</CardTitle>
                  <CardDescription>Live referral system activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mr-3" />
                        <div>
                          <p className="font-medium">New Referral Created</p>
                          <p className="text-sm text-muted-foreground">DCO-MH-001 • 2 hr ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <IndianRupee className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium">Payout Processed</p>
                          <p className="text-sm text-muted-foreground">₹5,000 • B2C-GJ-002 • 1 hr ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 text-red-600 mr-3" />
                        <div>
                          <p className="font-medium">Fraud Attempt Blocked</p>
                          <p className="text-sm text-muted-foreground">Self-referral •  1.5 hr ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Current system status and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>CRM Integration</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-green-600">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Payment Gateway</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-green-600">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Fraud Detection</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-green-600">Active</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>WhatsApp API</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-sm text-yellow-600">Limited</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Leads</CardTitle>  
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers?.leads?.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>{lead.id}</TableCell>
                        <TableCell>{lead.name}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.referralStatus === "CONVERTED_TO_CUSTOMER" ? "Customer Onboarded" : "Lead"}</TableCell>
                        {
                          lead.referralStatus !== "CONVERTED_TO_CUSTOMER" && (
                            <TableCell>
                              <Button size="sm" variant="outline" onClick={() => handleMoveToCustomer(lead.id)}>Onboard Customer</Button>
                            </TableCell>
                          )
                        }
                        
                      </TableRow>
                    ))}

                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="payouts" className="space-y-6">
          <PayoutQueue/>
          </TabsContent>

          <TabsContent value="fraud" className="space-y-6">
          <FraudDetectionAlerts/>
          </TabsContent>


          <TabsContent value="campaigns" className="space-y-6">
           <Campaigns/>
            </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payout Configuration</CardTitle>
                  <CardDescription>Configure referral payout amounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="delivery-payout">Delivery Payout</Label>
                    <Input id="delivery-payout" type="number" defaultValue="5000" className="w-24" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emi-payout">EMI Completion Payout</Label>
                    <Input id="emi-payout" type="number" defaultValue="2500" className="w-24" />
                  </div>
                  <Button className="w-full">Update Payout Settings</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fraud Prevention</CardTitle>
                  <CardDescription>Configure fraud detection settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="self-referral">Block Self-Referrals</Label>
                    <Switch id="self-referral" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="duplicate-check">Duplicate Number Check</Label>
                    <Switch id="duplicate-check" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="crm-validation">CRM Validation</Label>
                    <Switch id="crm-validation" defaultChecked />
                  </div>
                  <Button className="w-full">Update Security Settings</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
