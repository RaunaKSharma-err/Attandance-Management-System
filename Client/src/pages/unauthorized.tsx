import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldX, ArrowLeft } from "lucide-react";

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-[100vw] min-w-md text-center">
        <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ShieldX className="h-8 w-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page. Please contact your
          administrator if you believe this is an error.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go to Dashboard</span>
        </button>
      </div>
    </div>
  );
};
