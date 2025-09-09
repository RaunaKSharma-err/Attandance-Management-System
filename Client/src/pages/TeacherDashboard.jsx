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
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Users,
  Calendar,
  CheckSquare,
  BarChart3,
  Plus,
  Search,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchAttendanceForDate();
  }, [selectedDate]);

  const fetchStudents = async () => {
    try {
      const response = await userAPI.getAllUsers();
      const studentUsers = response.data.filter((u) => u.role === "student");
      setStudents(studentUsers);
    } catch (error) {
      console.error("Error fetching students:", error);
      // Mock data for demo
      setStudents([
        {
          _id: "1",
          name: "John Doe",
          email: "john@demo.com",
          rollNumber: "2024001",
        },
        {
          _id: "2",
          name: "Jane Smith",
          email: "jane@demo.com",
          rollNumber: "2024002",
        },
        {
          _id: "3",
          name: "Mike Johnson",
          email: "mike@demo.com",
          rollNumber: "2024003",
        },
        {
          _id: "4",
          name: "Sarah Wilson",
          email: "sarah@demo.com",
          rollNumber: "2024004",
        },
        {
          _id: "5",
          name: "Tom Brown",
          email: "tom@demo.com",
          rollNumber: "2024005",
        },
      ]);
    }
  };

  const fetchAttendanceForDate = async () => {
    try {
      const response = await attendanceAPI.getAttendanceByDate(selectedDate);
      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setAttendanceData([]);
    }
  };

  const markAttendance = async (studentId, status) => {
    try {
      setLoading(true);
      await attendanceAPI.markAttendance({
        studentId,
        date: selectedDate,
        status,
      });

      toast({
        title: "Attendance Marked",
        description: `Student marked as ${status}`,
      });

      fetchAttendanceForDate();
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceStatus = (studentId) => {
    const record = attendanceData.find((a) => a.studentId === studentId);
    return record?.status || "not_marked";
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "present":
        return (
          <Badge
            variant="secondary"
            className="bg-success/10 text-success border-success/20"
          >
            Present
          </Badge>
        );
      case "absent":
        return <Badge variant="destructive">Absent</Badge>;
      case "late":
        return (
          <Badge
            variant="secondary"
            className="bg-warning/10 text-warning border-warning/20"
          >
            Late
          </Badge>
        );
      default:
        return <Badge variant="outline">Not Marked</Badge>;
    }
  };

  const stats = {
    totalStudents: students.length,
    presentToday: attendanceData.filter((a) => a.status === "present").length,
    absentToday: attendanceData.filter((a) => a.status === "absent").length,
    notMarked: students.length - attendanceData.length,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-hero rounded-lg p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Good morning, {user?.name}!</h1>
        <p className="text-white/80">
          Manage student attendance and track academic progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-card shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <CheckSquare className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {stats.presentToday}
            </div>
            <p className="text-xs text-muted-foreground">Students present</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <BarChart3 className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.absentToday}
            </div>
            <p className="text-xs text-muted-foreground">Students absent</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Marked</CardTitle>
            <Calendar className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {stats.notMarked}
            </div>
            <p className="text-xs text-muted-foreground">Pending attendance</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Management */}
      <Card className="bg-gradient-card shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Mark Attendance
              </CardTitle>
              <CardDescription>
                Mark attendance for students on selected date
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="date">Date:</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Students Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const status = getAttendanceStatus(student._id);
                  return (
                    <TableRow key={student._id}>
                      <TableCell className="font-medium">
                        {student.rollNumber}
                      </TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.email}
                      </TableCell>
                      <TableCell>{getStatusBadge(status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() =>
                              markAttendance(student._id, "present")
                            }
                            disabled={loading || status === "present"}
                          >
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              markAttendance(student._id, "absent")
                            }
                            disabled={loading || status === "absent"}
                          >
                            Absent
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No students found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "No students are enrolled yet."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
