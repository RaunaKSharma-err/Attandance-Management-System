import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  User,
  BarChart3,
  Settings,
  FileText,
  CheckSquare,
  X,
} from "lucide-react";
import { Button } from "./ui/button";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    const commonItems = [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/profile", label: "Profile", icon: User },
    ];

    if (user?.role === "student") {
      return [
        ...commonItems,
        { href: "/attendance", label: "My Attendance", icon: Calendar },
        { href: "/reports", label: "Reports", icon: FileText },
      ];
    }

    if (user?.role === "teacher" || user?.role === "admin") {
      return [
        ...commonItems,
        { href: "/students", label: "Students", icon: Users },
        {
          href: "/mark-attendance",
          label: "Mark Attendance",
          icon: CheckSquare,
        },
        {
          href: "/attendance-reports",
          label: "Attendance Reports",
          icon: BarChart3,
        },
        ...(user?.role === "admin"
          ? [{ href: "/manage-users", label: "Manage Users", icon: Settings }]
          : []),
      ];
    }

    return commonItems;
  };

  const menuItems = getMenuItems();
  const isActiveRoute = (href) => location.pathname === href;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-pigment-indigo-600 border-r border-pigment-indigo-700 shadow-lg transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-pigment-indigo-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pigment-indigo-500 to-pigment-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">EduTrack</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "bg-pigment-indigo-500 text-white shadow-sm"
                    : "text-white/70 hover:bg-pigment-indigo-500/20 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
