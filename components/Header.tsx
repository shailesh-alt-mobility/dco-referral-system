import { Plus, Users } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

const Header = ({
  isReferralPage,
  user,
  logout,
  setShowCreateReferral,
}: {
  isReferralPage?: boolean;
  user: any;
  logout: () => void;
  setShowCreateReferral?: (show: boolean) => void;
}) => {
  return (
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
            {isReferralPage && (
              <Button
                onClick={() => setShowCreateReferral?.(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Refer a Customer
              </Button>
            )}

            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
