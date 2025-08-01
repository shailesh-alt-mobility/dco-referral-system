"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Phone, Hash, MapPin } from "lucide-react";
import { useCreateLeadMutation } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReferralFormProps {
  referralCode: string;
}

export function ReferralForm({ referralCode }: ReferralFormProps) {
  const searchParams = useSearchParams();
  const sourceFromParams = searchParams?.get("source") || "";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [source, setSource] = useState(sourceFromParams);
  const [referralCodeState, setReferralCode] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [createLead, { isLoading }] = useCreateLeadMutation();

  useEffect(() => {
    // Set referral code from props
    setReferralCode(referralCode);

    // Extract referredBy from search params
    const referredByFromParams = searchParams?.get("referredBy");
    const sourceFromParams = searchParams?.get("source");
    if (referredByFromParams) {
      setReferredBy(referredByFromParams);
    }
    if (sourceFromParams) {
      setSource(sourceFromParams);
    }
  }, [referralCode, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const formData = {
        name,
        email,
        phone: phoneNumber,
        address,
        source: source || "other",
        referralCode: referralCodeState,
        campaign_id: referredBy || undefined,
      };

      await createLead(formData).unwrap();

      setSuccess(true);
      setName("");
      setEmail("");
      setPhoneNumber("");
      setAddress("");
      setSource("");
    } catch (err: any) {
      setError(
        err?.data?.error || "An error occurred while submitting the form"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {!success && (
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Referral Registration
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Complete your referral registration
            </p>
          </div>
        )}

        <Card>
          {!success && (
            <CardHeader>
              <CardDescription>
                Please fill in your details to complete the referral process
              </CardDescription>
            </CardHeader>
          )}

          {success && (
            <p className="text-center text-lg font-bold mt-4">
              Thank you! Submitted successfully.
            </p>
          )}
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!success && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your phone number"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">How did you hear about us?</Label>
                  <Select value={source} onValueChange={(value) => setSource(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="driver_app">Driver App</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referralCode">Referral Code</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="referralCode"
                      type="text"
                      value={referralCodeState}
                      disabled
                      className="pl-10 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                {referredBy && (
                  <div className="space-y-2">
                    <Label htmlFor="referredBy">Referred By</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="referredBy"
                        type="text"
                        value={referredBy}
                        disabled
                        className="pl-10 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
