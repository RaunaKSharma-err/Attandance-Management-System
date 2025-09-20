import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Home, Users, Calendar, User, BarChart3, FileText, IdCard } from "lucide-react";

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const studentNavItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/attendance", icon: Calendar, label: "My Attendance" },
  ];

  const teacherAdminNavItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/students", icon: Users, label: "Students" },
    { path: "/mark-attendance", icon: Calendar, label: "Mark Attendance" },
    { path: "/assign-id", icon: IdCard, label: "assign-id" },
    { path: "/reports", icon: BarChart3, label: "Reports" },
    { path: "/export", icon: FileText, label: "Export Data" },
  ];

  const navItems =
    user?.role === "student" ? studentNavItems : teacherAdminNavItems;

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white hover:text-white"
                  : "text-white hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
