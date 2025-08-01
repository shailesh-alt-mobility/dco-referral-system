"use client";

import { useEffect, useState } from "react";
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
  Plus,
  Search,
  MessageCircle,
  Smartphone,
  Globe,
  Shield,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useGetAnalyticsQuery, useGetCustomerLeadsQuery } from "@/lib/api";
import Header from "@/components/Header";
import AllReferrals from "@/pages/AllReferrals";
import PayoutStructure from "@/pages/PayoutStructure";
import AbusePrevention from "@/pages/AbusePrevention";

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

  const [REFERRAL_ID, setREFERRAL_ID] = useState("");
  const [platform, setPlatform] = useState("whatsapp");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setREFERRAL_ID(userData?.Customer?.refer_code);
  }, []);

  const { data: referralData, isLoading: isLeadsLoading } =
    useGetCustomerLeadsQuery();

  console.log("customer leads", referralData);
  const { data: analyticsData, isLoading: isAnalyticsLoading } =
    useGetAnalyticsQuery();

  const link = `https://dco-referral-system.vercel.app/referral/${REFERRAL_ID}`;

  const rawMessage = `
Looking to buy or lease a car?

I know a dealership that can help. They offer:
- Easy monthly payments
- Low down payment options
- Fast approval, even with low or no credit
- Simple plans to lease or buy

Let me know if you're interested. I’ll send you the details. We both get benefits through their referral program.

${link}?source=${platform}
`;

  const referralMessage = encodeURIComponent(rawMessage);

  const handleShareReferral = (platform: string) => {
    setPlatform(platform);
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
    }
  };

  const stats = {
    totalReferrals: referralData?.customers?.length,
    activeReferrals: referralData?.customers?.filter(
      (r) => r.referralStatus !== "EMI Complete"
    ).length,
    totalEarnings: referralData?.customers?.reduce(
      (sum, r) => sum + Number(r.referralStatus),
      0
    ),
    pendingPayouts: referralData?.customers?.filter(
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

  const shareReferral = (
    platform: string,
    referralCode: string,
    messageData: string
  ) => {
    const message = `${messageData} ! Use my referral code: ${referralCode} or click: ${link}`;

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
        break;
      case "meta":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            link
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

  const filteredReferrals = referralData?.customers?.filter((referral) => {
    const matchesSearch =
      referral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || referral.referralStatus === statusFilter;
    const matchesType = typeFilter === "all" || referral.source === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <ProtectedRoute requiredRole="CUSTOMER">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header
          isReferralPage={true}
          user={user}
          logout={logout}
          setShowCreateReferral={setShowCreateReferral}
        />

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
                <div className="text-2xl font-bold">
                  {analyticsData?.analytics?.totalReferrals}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Successful Referrals
                </CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {analyticsData?.analytics?.activeReferrals}
                </div>
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
                  ₹{analyticsData?.analytics?.totalEarnings?.toLocaleString()}
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
                  {analyticsData?.analytics?.pendingPayouts}
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
                  {analyticsData?.analytics?.conversionRate}%
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
                  ₹{analyticsData?.analytics?.avgEarningsPerLead}
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
                    {referralData?.customers?.slice(0, 3).map((referral) => (
                      <div
                        key={referral.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{referral.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(referral.referralStatus)}
                          <p className="text-sm text-muted-foreground mt-1">
                            ₹{" "}
                            {referral?.referralStatus === "EMI Complete"
                              ? 2500
                              : referral?.referralStatus ===
                                "CONVERTED_TO_CUSTOMER"
                              ? 5000
                              : 0}{" "}
                            earned
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
              <AllReferrals
              filteredReferrals={filteredReferrals}
              setSelectedReferral={setSelectedReferral}
              setShowShareDialog={setShowShareDialog}
            />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PayoutStructure />

                <AbusePrevention />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Create Referral Dialog */}
        <Dialog open={showCreateReferral} onOpenChange={setShowCreateReferral}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Refer a Customer</DialogTitle>
              <DialogDescription>
                Refer a customer to get rewards
              </DialogDescription>
            </DialogHeader>
            <div className="flex space-x-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => handleShareReferral("whatsapp")}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                WhatsApp
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => handleShareReferral("driver-app")}
                disabled={true}
              >
                <Smartphone className="w-4 h-4 mr-1" />
                Driver App
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => handleShareReferral("meta")}
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
              <DialogTitle>Remind Customer</DialogTitle>
              <DialogDescription>
                Remind your customer to complete the referral process
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
                          onChange={(e) =>
                            setCustomReminderMessage(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    disabled={customReminderMessage.length === 0}
                    className="flex flex-col items-center p-4 h-auto bg-transparent"
                    onClick={() =>
                      shareReferral(
                        "whatsapp",
                        REFERRAL_ID,
                        customReminderMessage
                      )
                    }
                  >
                    <MessageCircle className="w-6 h-6 mb-2 text-green-600" />
                    <span className="text-sm">WhatsApp</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center p-4 h-auto bg-transparent"
                    onClick={() =>
                      shareReferral(
                        "driver-app",
                        REFERRAL_ID,
                        customReminderMessage
                      )
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
