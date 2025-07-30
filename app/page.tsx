"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import ProtectedRoute from "@/components/protected-route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Copy,
  Share2,
  TrendingUp,
  Users,
  IndianRupee,
  Car,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Plus,
  Search,
  Download,
  MessageCircle,
  Smartphone,
  Globe,
  Shield,
  QrCode,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useGetLeadsQuery } from "@/lib/api";

// Mock data
// const referralData?.leads = [
//   {
//     id: "REF-DCO-001",
//     referrerType: "DCO",
//     referrerName: "Rajesh Kumar",
//     referrerId: "DCO-MH-001",
//     referralCode: "RAJESH-MH-001",
//     customerName: "Amit Sharma",
//     customerPhone: "+91-9876543210",
//     vehicleModel: "Tata Ace Gold",
//     status: "Delivered",
//     deliveryDate: "2024-01-15",
//     emiStatus: "2/3 Paid",
//     payout1: 5000,
//     payout2: 0,
//     totalEarned: 5000,
//     createdDate: "2024-01-10",
//   },
//   {
//     id: "REF-B2C-002",
//     referrerType: "B2C",
//     referrerName: "Priya Patel",
//     referrerId: "B2C-GJ-002",
//     referralCode: "PRIYA-GJ-002",
//     customerName: "Suresh Modi",
//     customerPhone: "+91-9876543211",
//     vehicleModel: "Mahindra Bolero Pickup",
//     status: "EMI Complete",
//     deliveryDate: "2023-12-20",
//     emiStatus: "3/3 Paid",
//     payout1: 5000,
//     payout2: 2500,
//     totalEarned: 7500,
//     createdDate: "2023-12-15",
//   },
//   {
//     id: "REF-DCO-003",
//     referrerType: "DCO",
//     referrerName: "Vikram Singh",
//     referrerId: "DCO-UP-003",
//     referralCode: "VIKRAM-UP-003",
//     customerName: "Rahul Gupta",
//     customerPhone: "+91-9876543212",
//     vehicleModel: "Ashok Leyland Dost",
//     status: "Processing",
//     deliveryDate: null,
//     emiStatus: "Pending",
//     payout1: 0,
//     payout2: 0,
//     totalEarned: 0,
//     createdDate: "2024-01-20",
//   },
// ];

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

// const referralMessage =`🚗%20Looking%20to%20Buy%20or%20Lease%20a%20Vehicle%3F%0A%0AI%E2%80%99m%20referring%20you%20to%20a%20dealership%20that%20offers%3A%0A%E2%9C%85%20Easy%20monthly%20payments%0A%E2%9C%85%20Low%20down%20payment%20options%0A%E2%9C%85%20Quick%20approval%20%E2%80%94%20even%20with%20limited%20credit%0A%E2%9C%85%20Simple%20lease%20or%20buy%20plans%0A%0ALet%20me%20know%20if%20you%E2%80%99re%20interested%20and%20I%E2%80%99ll%20send%20you%20the%20details.%20It%E2%80%99s%20part%20of%20a%20referral%20program%2C%20so%20we%20both%20benefit%21%20%F0%9F%99%8C%0Ahttp%3A%2F%2Flocalhost%3A3000%2Freferral%2F848756347876`





export default function DCOReferralSystem() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showCreateReferral, setShowCreateReferral] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<any>(null);
  const [customReminderMessage, setCustomReminderMessage] = useState("");

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000"; // fallback for local dev
const REFERRAL_ID = "848756347876"; // dynamically set this if needed


const { data: referralData, isLoading: isLeadsLoading } = useGetLeadsQuery();

console.log(referralData?.leads);
const link = `dco-referral-system.vercel.app/referral/${REFERRAL_ID}`;

const rawMessage = `
Looking to buy or lease a car?

I know a dealership that can help. They offer:
- Easy monthly payments
- Low down payment options
- Fast approval, even with low or no credit
- Simple plans to lease or buy

Let me know if you're interested. I’ll send you the details. We both get benefits through their referral program.

${link}
`;

  const referralMessage = encodeURIComponent(rawMessage);

  const handleShareReferral = (platform: string) => {
  switch(platform){
    case 'whatsapp':
      window.open(`https://wa.me/?text=${referralMessage}`, '_blank');
      break;
    case 'meta':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${referralMessage}`, '_blank');
  }
  };

  const stats = {
    totalReferrals: referralData?.leads?.length,
    activeReferrals: referralData?.leads?.filter((r) => r.referralStatus !== "EMI Complete")
      .length,
    totalEarnings: referralData?.leads?.reduce((sum, r) => sum + Number(r.referralStatus), 0),
    pendingPayouts: referralData?.leads?.filter(
      (r) => r.referralStatus === "EMI Complete"
    ).length,
    conversionRate: 76.5,
    avgEarningsPerReferral: 4167,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONVERTED_TO_CUSTOMER":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1" />
           Successfully
          </Badge>
        );
      case "INPROGRESS":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Car className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const generateReferralCode = (name: string, location: string, id: string) => {
    return `${name.toUpperCase().replace(/\s+/g, "")}-${location}-${id}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const shareReferral = (platform: string, referralCode: string, messageData: string) => {
    const referralLink = `${BASE_URL}/referral/${referralCode}`;
    const message = `${messageData} ! Use my referral code: ${referralCode} or click: ${referralLink}`;

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
        break;
      case "meta":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            referralLink
          )}`
        );
        break;
      case "driver-app":
        // Simulate driver app sharing
        toast({
          title: "Shared to Driver App",
          description: "Referral shared successfully to Driver App",
        });
        break;
    }
  };

  const filteredReferrals = referralData?.leads?.filter((referral) => {
    const matchesSearch =
      referral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || referral.referralStatus === statusFilter;
    const matchesType =
      typeFilter === "all" || referral.source === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <ProtectedRoute requiredRole="CUSTOMER">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Customer Dashboard
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="text-capitalize">Welcome, {user?.name}</span>
                </div>
                <Button
                  onClick={() => setShowCreateReferral(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Refer a Customer
                </Button>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Referrals
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalReferrals}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Referrals
                </CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.activeReferrals}
                </div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Earnings
                </CardTitle>
                <IndianRupee className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ₹{stats.totalEarnings?.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Lifetime earnings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Payouts
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pendingPayouts}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting EMI completion
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Conversion Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.conversionRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Referral to sale
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Earnings
                </CardTitle>
                <IndianRupee className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  ₹{stats.avgEarningsPerReferral}
                </div>
                <p className="text-xs text-muted-foreground">Per referral</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="referrals">My Referrals</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Referral Activity</CardTitle>
                  <CardDescription>
                    Latest updates on your referrals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {referralData?.leads?.slice(0, 3).map((referral) => (
                      <div
                        key={referral.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {referral.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Referred by {referral.source} •{" "}
                              {referral.source}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(referral.referralStatus)}
                          <p className="text-sm text-muted-foreground mt-1">
                            ₹{referral.referralStatus} earned
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="referrals" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Search & Filter Referrals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by name, code, or customer..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="EMI Complete">
                          EMI Complete
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="DCO">DCO</SelectItem>
                        <SelectItem value="B2C">B2C Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Referrals Table */}
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
                      {filteredReferrals?.map((referral) => (
                        <TableRow key={referral.id}>
                         
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {referral.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {referral.phone}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(referral.referralStatus)}
                          </TableCell>
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

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <Card>
                  <CardHeader>
                    <CardTitle>Abuse Prevention</CardTitle>
                    <CardDescription>
                      Security measures in place
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium">
                            Self-Referral Prevention
                          </p>
                          <p className="text-sm text-muted-foreground">
                            System blocks self-referrals automatically
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium">Duplicate Number Check</p>
                          <p className="text-sm text-muted-foreground">
                            Prevents multiple referrals for same number
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium">CRM Integration</p>
                          <p className="text-sm text-muted-foreground">
                            Real-time validation with customer database
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Create Referral Dialog */}
        <Dialog open={showCreateReferral} onOpenChange={setShowCreateReferral}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Remind Customer</DialogTitle>
              <DialogDescription>
                Remind your customer to complete the referral process
              </DialogDescription>
            </DialogHeader>
            <div className="flex space-x-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => handleShareReferral('whatsapp')}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                WhatsApp
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => handleShareReferral('driver-app')}
                disabled={true}
              >
                <Smartphone className="w-4 h-4 mr-1" />
                Driver App
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => handleShareReferral('meta')}
              >
                <Globe className="w-4 h-4 mr-1" />
                Meta
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Share Referral</DialogTitle>
              <DialogDescription>
                Share your referral code across different platforms
              </DialogDescription>
            </DialogHeader>
            {selectedReferral && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                     
                      <div className="mt-3">
                      
                        <textarea
                          className="w-full border rounded px-2 py-1 text-sm"
                          placeholder="Type your custom message to remind the referee"
                          rows={6}
                          cols={30}
                          value={customReminderMessage}
                          onChange={e => setCustomReminderMessage(e.target.value)}
                        />
                      </div>
                    </div>
                
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="flex flex-col items-center p-4 h-auto bg-transparent"
                    onClick={() =>
                      shareReferral("whatsapp", REFERRAL_ID, customReminderMessage)
                    }
                  >
                    <MessageCircle className="w-6 h-6 mb-2 text-green-600" />
                    <span className="text-sm">WhatsApp</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center p-4 h-auto bg-transparent"
                    onClick={() =>
                      shareReferral("driver-app", REFERRAL_ID, customReminderMessage)
                    }
                  >
                    <Smartphone className="w-6 h-6 mb-2 text-blue-600" />
                    <span className="text-sm">Driver App</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center p-4 h-auto bg-transparent"
                    onClick={() =>
                      shareReferral("meta", REFERRAL_ID, customReminderMessage)
                    }
                  >
                    <Globe className="w-6 h-6 mb-2 text-purple-600" />
                    <span className="text-sm">Meta</span>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
