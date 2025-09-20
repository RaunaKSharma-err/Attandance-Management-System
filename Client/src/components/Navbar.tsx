import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, User, Bell } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b w-full border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h4 className="text-2xl font-semibold text-gray-800">
            Attendance Management System
          </h4>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-700">{user?.name}</p>
                <p className="text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
