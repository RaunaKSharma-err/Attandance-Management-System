import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { attendanceAPI } from "../services/api";
import type { AttendanceRecord, AttendanceSummary } from "../types";
import { Calendar, TrendingUp, Clock, CheckCircle } from "lucide-react";

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, attendanceRes] = await Promise.all([
        attendanceAPI.getSummary(user!._id),
        attendanceAPI.getStudentAttendance(user!._id, 1, 10),
      ]);

      setSummary(summaryRes.data);
      setRecentAttendance(attendanceRes.data.attendance || []);
    } catch (err: unknown) {
      // Narrow the error type
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === "present"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-[73vw]">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100">
          Track your attendance and academic progress
        </p>
        {user?.rollNumber && (
          <p className="text-blue-200 text-sm mt-1">
            Roll Number: {user.rollNumber}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Total Days
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {summary.totalDays}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Present</h3>
                <p className="text-2xl font-bold text-green-600">
                  {summary.presentDays}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Absent</h3>
                <p className="text-2xl font-bold text-red-600">
                  {summary.absentDays}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Percentage
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                  {(summary.attendancePercentage ?? 0).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Attendance */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Attendance
          </h2>
          <p className="text-sm text-gray-600">
            Your latest attendance records
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marked By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentAttendance.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(record.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof record.markedBy === "object"
                      ? record.markedBy.name
                      : "System"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(record.markedAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {recentAttendance.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No attendance records
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Your attendance records will appear here once marked.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
