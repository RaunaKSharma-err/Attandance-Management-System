import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Calendar, User, Clock } from "lucide-react";

const AttendanceTable = ({
  attendance,
  title = "Attendance History",
  loading = false,
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
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
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-card shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>Loading attendance records...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-4 bg-muted rounded w-32"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-pigment-indigo-500 to-pigment-indigo-600 shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Calendar className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-white/70">
          {attendance?.length > 0
            ? `Showing ${attendance.length} attendance records`
            : "No attendance records found"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {attendance?.length > 0 ? (
          <div className="rounded-md border border-white/20 overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-pigment-indigo-300">
                  <TableHead className="text-white">Date</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Time</TableHead>
                  <TableHead className="text-white">Marked By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((record, index) => (
                  <TableRow
                    key={record._id || index}
                    className="hover:bg-pigment-indigo-500/10 transition-colors"
                  >
                    <TableCell className="font-medium text-white">
                      {formatDate(record.date)}
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell className="text-white/70">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {record.markedAt ? formatTime(record.markedAt) : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="text-white/70">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {record.markedBy?.name || "System"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-white/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No attendance records
            </h3>
            <p className="text-white/70">
              Attendance records will appear here once they are marked.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceTable;
