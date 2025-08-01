"use client"

import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
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
  XCircle,
  Shield,
  Activity,
  BarChart3,
  Settings,
  Download,
  MessageCircle,
  Smartphone,
  Globe,
} from "lucide-react"
import { useCustomerPayoutsMutation, useCustomerPayoutsQuery, useGetAnalyticsQuery, useGetLeadsQuery, useMoveLeadToCustomerMutation } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import Header from "./Header"



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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Ready for Payment":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Ready for Payment
          </Badge>
        )
      case "Pending Approval":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Pending Approval
          </Badge>
        )
      case "Blocked":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Blocked
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
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
                    {payoutQueue.map((payout) => (
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
                        <TableCell>{getStatusBadge(payout.status)}</TableCell>
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
          </TabsContent>

          <TabsContent value="fraud" className="space-y-6">
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
                        <TableCell>{getStatusBadge(alert.status)}</TableCell>
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
          </TabsContent>
          <TabsContent value="campaigns" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Campaigns</CardTitle>
                  <CardDescription>
                    Manage and track referral campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {campaigns.map((campaign) => (
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
