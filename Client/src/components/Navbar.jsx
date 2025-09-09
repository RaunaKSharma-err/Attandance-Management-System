import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { LogOut, User, GraduationCap, Menu, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = ({   onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "text-destructive";
      case "teacher":
        return "text-primary";
      case "student":
        return "text-secondary";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <nav className="bg-pigment-indigo-600 border-b border-pigment-indigo-700 shadow-sm sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center gap-4">
            {onMenuClick && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMenuClick}
                className="lg:hidden text-white"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}

            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pigment-indigo-500 to-pigment-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pigment-indigo-400 via-pigment-indigo-500 to-pigment-indigo-600 bg-clip-text text-white">
                EduTrack
              </span>
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-pigment-indigo-400 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3 text-white"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-pigment-indigo-500 to-pigment-indigo-600 rounded-full flex items-center justify-center shadow-md">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium">{user?.name}</div>
                    <div
                      className={`text-xs capitalize ${getRoleColor(
                        user?.role
                      )}`}
                    >
                      {user?.role}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 bg-pigment-indigo-700 text-white"
              >
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-white/70">{user?.email}</p>
                  <p
                    className={`text-xs capitalize font-medium ${getRoleColor(
                      user?.role
                    )}`}
                  >
                    {user?.role}
                  </p>
                  {user?.rollNumber && (
                    <p className="text-xs text-white/70">
                      Roll: {user?.rollNumber}
                    </p>
                  )}
                </div>

                <DropdownMenuSeparator className="border-pigment-indigo-500/50" />

                <DropdownMenuItem asChild>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-white hover:text-pigment-indigo-200"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="border-pigment-indigo-500/50" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-pigment-indigo-400 hover:text-pigment-indigo-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
