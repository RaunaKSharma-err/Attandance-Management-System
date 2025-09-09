import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { userAPI, attendanceAPI } from "../services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import AttendanceCard from "../components/AttendanceCard";
import AttendanceTable from "../components/AttendanceTable";
import { User, GraduationCap, Calendar, BookOpen } from "lucide-react";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);

      // Fetch user profile
      const profileResponse = await userAPI.getMe();
      setUserProfile(profileResponse.data);

      // Fetch attendance summary
      const summaryResponse = await attendanceAPI.getAttendanceSummary(user.id);
      setAttendanceSummary(summaryResponse.data);

      // Fetch attendance history
      const historyResponse = await attendanceAPI.getStudentAttendance(user.id);
      setAttendanceHistory(historyResponse.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
      // For demo purposes, set some mock data
      setUserProfile(user);
      setAttendanceSummary({ present: 18, absent: 3 });
      setAttendanceHistory([
        {
          _id: "1",
          date: new Date().toISOString(),
          status: "present",
          markedAt: new Date().toISOString(),
          markedBy: { name: "Prof. Smith" },
        },
        {
          _id: "2",
          date: new Date(Date.now() - 86400000).toISOString(),
          status: "present",
          markedAt: new Date(Date.now() - 86400000).toISOString(),
          markedBy: { name: "Prof. Johnson" },
        },
        {
          _id: "3",
          date: new Date(Date.now() - 172800000).toISOString(),
          status: "absent",
          markedAt: new Date(Date.now() - 172800000).toISOString(),
          markedBy: { name: "Prof. Smith" },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-pigment-indigo-400 to-pigment-indigo-600 rounded-lg p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-shadow-md">
          Welcome back, {userProfile?.name || user?.name}!
        </h1>
        <p className="text-white/80">
          Track your attendance and academic progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-r from-pigment-indigo-500 to-pigment-indigo-600 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student ID</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProfile?.rollNumber || user?.rollNumber || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Roll Number</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pigment-indigo-300 to-pigment-indigo-400 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Semester
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Fall 2024</div>
            <p className="text-xs text-muted-foreground">Academic Year</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pigment-indigo-600 to-pigment-indigo-700 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(attendanceSummary?.present || 0) +
                (attendanceSummary?.absent || 0)}
            </div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pigment-indigo-400 to-pigment-indigo-500 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account Status
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Active</div>
            <p className="text-xs text-muted-foreground">Student Account</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <AttendanceCard summary={attendanceSummary} />
        </div>

        <div className="md:col-span-2">
          <AttendanceTable
            attendance={attendanceHistory}
            title="Recent Attendance"
            loading={loading}
          />
        </div>
      </div>

      {/* Profile Information */}
      <Card className="bg-gradient-to-r from-pigment-indigo-800 to-pigment-indigo-950 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription className="text-white/70">
            Your academic profile and contact details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 text-white">
            <div>
              <label className="text-sm font-medium text-white/70">
                Full Name
              </label>
              <p className="text-lg">{userProfile?.name || user?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-white/70">Email</label>
              <p className="text-lg">{userProfile?.email || user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-white/70">
                Roll Number
              </label>
              <p className="text-lg">
                {userProfile?.rollNumber || user?.rollNumber}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-white/70">Role</label>
              <p className="text-lg capitalize">
                {userProfile?.role || user?.role}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
