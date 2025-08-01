"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield } from "lucide-react";
import React from "react";

const AbusePrevention = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Abuse Prevention</CardTitle>
        <CardDescription>Security measures in place</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium">Self-Referral Prevention</p>
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
  );
};

export default AbusePrevention;
