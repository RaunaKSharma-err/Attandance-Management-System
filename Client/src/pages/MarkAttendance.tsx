import React, { useState, useEffect } from "react";
import { usersAPI, attendanceAPI } from "../services/api";
import type { User } from "../types";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Save,
  AlertCircle,
} from "lucide-react";
import { AxiosError } from "axios";

interface AttendanceRecord {
  student: string | { _id: string };
  status: string; // or whatever type status actually is
}

export const MarkAttendance: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendance, setAttendance] = useState<
    Record<string, "present" | "absent" | null>
  >({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      fetchExistingAttendance();
    }
  }, [selectedDate, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers();

      // Correctly access the students array
      const usersArray = Array.isArray(response.data.students)
        ? response.data.students
        : Array.isArray(response.data)
        ? response.data
        : [];

      const studentList = usersArray.filter(
        (user: User) =>
          typeof user.role === "string" && user.role.toLowerCase() === "student"
      );

      setStudents(studentList);
    } catch (err: unknown) {
      console.error("Failed to fetch students:", err);
      setMessage({ type: "error", text: "Failed to fetch students" });
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingAttendance = async () => {
    if (students.length === 0) return;

    try {
      const response = await attendanceAPI.getAttendanceByDate(selectedDate);

      const existingAttendance: Record<string, "present" | "absent" | null> =
        {};
      students.forEach((student) => {
        existingAttendance[student._id] = null;
      });

      const records: AttendanceRecord[] = Array.isArray(response.data)
        ? response.data
        : response.data?.attendance || [];

      records.forEach((record) => {
        const studentId =
          typeof record.student === "object"
            ? record.student._id
            : record.student;

        existingAttendance[studentId] =
          record.status === "present" || record.status === "absent"
            ? record.status
            : null;
      });

      setAttendance(existingAttendance);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);

      const initialAttendance: Record<string, "present" | "absent" | null> = {};
      students.forEach((student) => {
        initialAttendance[student._id] = null;
      });
      setAttendance(initialAttendance);
    }
  };

  const handleAttendanceChange = (
    studentId: string,
    status: "present" | "absent"
  ) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const attendanceData = Object.entries(attendance)
        .filter(([, status]) => status !== null) // remove the _ variable
        .map(([studentId, status]) => ({
          studentId,
          date: selectedDate,
          status: status!, // non-null assertion is okay here because of the filter
        }));

      if (attendanceData.length === 0) {
        setMessage({
          type: "error",
          text: "Please mark attendance for at least one student",
        });
        setSaving(false);
        return;
      }

      // Mark attendance for each student
      await Promise.all(
        attendanceData.map((data) => attendanceAPI.markAttendance(data))
      );

      setMessage({
        type: "success",
        text: `Attendance marked successfully for ${attendanceData.length} students`,
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        // Axios error: has response.data.message
        setMessage({
          type: "error",
          text: err.response?.data?.message || "Failed to mark attendance",
        });
      } else if (err instanceof Error) {
        // Regular JS error
        setMessage({
          type: "error",
          text: err.message,
        });
      } else {
        // Unknown error
        setMessage({
          type: "error",
          text: "An unexpected error occurred",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const getAttendanceStats = () => {
    const marked = Object.values(attendance).filter(
      (status) => status !== null
    ).length;
    const present = Object.values(attendance).filter(
      (status) => status === "present"
    ).length;
    const absent = Object.values(attendance).filter(
      (status) => status === "absent"
    ).length;

    return { marked, present, absent, total: students.length };
  };

  const stats = getAttendanceStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-[75vw] min-w-md">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Mark Attendance
            </h1>
            <p className="text-gray-600">
              Select date and mark student attendance
            </p>
          </div>
          <Calendar className="h-8 w-8 text-blue-600" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Date
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="px-3 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-blue-600">
                  {stats.marked}
                </div>
                <div className="text-gray-500">Marked</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">
                  {stats.present}
                </div>
                <div className="text-gray-500">Present</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-red-600">{stats.absent}</div>
                <div className="text-gray-500">Absent</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`p-4 rounded-lg border flex items-center space-x-3 ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <AlertCircle className="h-5 w-5" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Attendance Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Student List</h2>
          <p className="text-sm text-gray-600">
            Mark attendance for each student
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600">
                    {student.rollNumber && `Roll: ${student.rollNumber} • `}
                    {student.email}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleAttendanceChange(student._id, "present")
                    }
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      attendance[student._id] === "present"
                        ? "bg-green-600 text-white"
                        : "bg-white border border-green-600 text-green-600 hover:bg-green-50"
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Present</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleAttendanceChange(student._id, "absent")
                    }
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      attendance[student._id] === "absent"
                        ? "bg-red-600 text-white"
                        : "bg-white border border-red-600 text-red-600 hover:bg-red-50"
                    }`}
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Absent</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {stats.marked} of {stats.total} students marked
            </div>

            <button
              type="submit"
              disabled={saving || stats.marked === 0}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Saving..." : "Save Attendance"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
