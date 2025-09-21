import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { usersAPI, attendanceAPI } from "../services/api";
import type { User, AttendanceRecord } from "../types";
import {
  Users,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { AxiosError } from "axios";

export const TeacherAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<User[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>(
    []
  );
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    attendancePercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];

      const [studentsRes, attendanceRes] = await Promise.all([
        usersAPI.getUsers(),
        attendanceAPI.getAttendanceByDate(today),
      ]);

      const allStudents: User[] = Array.isArray(studentsRes.data?.students)
        ? studentsRes.data.students.filter((u: User) => u.role === "student")
        : [];

      const attendance: AttendanceRecord[] = Array.isArray(
        attendanceRes.data?.records
      )
        ? attendanceRes.data.records
        : [];
      console.log(attendance);

      setStudents(allStudents);
      setTodayAttendance(attendance);

      const presentCount = attendance.filter(
        (r) => r.status === "present"
      ).length;
      const attendancePercentage =
        allStudents.length > 0
          ? Number(((presentCount / allStudents.length) * 100).toFixed(1))
          : 0;

      const totalStudents = allStudents.length;

      setStats({
        totalStudents,
        presentToday: presentCount,
        absentToday: totalStudents - presentCount,
        attendancePercentage,
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch data");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  console.log(todayAttendance);

  return (
    <div className="space-y-6 w-[77vw] min-w-md h-[85vh] overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold">
          {user?.role === "admin" ? "Admin" : "Teacher"} Dashboard
        </h1>
        <p className="text-purple-100">
          Manage student attendance and monitor progress
        </p>
        <p className="text-purple-200 text-sm mt-1">Welcome, {user?.name}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Students
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {stats.totalStudents}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Present Today
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {stats.presentToday}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Absent Today
              </h3>
              <p className="text-2xl font-bold text-red-600">
                {stats.absentToday}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's %</h3>
              <p className="text-2xl font-bold text-purple-600">
                {stats.attendancePercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Attendance Summary */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Today's Attendance
              </h2>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {todayAttendance && todayAttendance.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todayAttendance.map((record) => (
                <div
                  key={record._id}
                  className={`p-4 rounded-lg border-2 ${
                    record.status === "present"
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {record.studentId?.name || "Student"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {record.studentId?.rollNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          record.status === "present"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {record.createdAt
                          ? new Date(record.createdAt).toLocaleTimeString()
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No attendance marked today
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Start marking attendance for your students.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Students */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Students Overview
          </h2>
          <p className="text-sm text-gray-600">
            Quick view of all registered students
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students && students.length > 0 ? (
                students.slice(0, 10).map((student) => {
                  const todayRecord = todayAttendance?.find((record) =>
                    typeof record.studentId === "object"
                      ? record.studentId?._id === student._id
                      : record.studentId === student._id
                  );

                  return (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.rollNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {todayRecord ? (
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              todayRecord.status === "present"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {todayRecord.status}
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            Not marked
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No students available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
