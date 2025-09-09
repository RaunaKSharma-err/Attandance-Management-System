import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { CheckCircle, XCircle, Calendar, TrendingUp } from "lucide-react";

const AttendanceCard = ({ summary }) => {
  const attendancePercentage = summary
    ? Math.round(
        (summary.present / (summary.present + summary.absent)) * 100
      ) || 0
    : 0;

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 75)
      return { color: "text-success", icon: CheckCircle, label: "Good" };
    if (percentage >= 60)
      return { color: "text-warning", icon: TrendingUp, label: "Warning" };
    return { color: "text-destructive", icon: XCircle, label: "Critical" };
  };

  const status = getAttendanceStatus(attendancePercentage);
  const StatusIcon = status.icon;

  if (!summary) {
    return (
      <Card className="bg-gradient-card shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Attendance Summary
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-2"></div>
            <div className="h-2 bg-muted rounded mb-4"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-6 bg-muted rounded"></div>
              <div className="h-6 bg-muted rounded"></div>
              <div className="h-6 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-pigment-indigo-500 to-pigment-indigo-600 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">
          Attendance Summary
        </CardTitle>
        <StatusIcon className={`h-4 w-4 ${status.color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex items-center gap-2 text-white">
          {attendancePercentage}%
          <span className={`text-sm font-normal ${status.color}`}>
            {status.label}
          </span>
        </div>

        <Progress
          value={attendancePercentage}
          className="mt-2"
          indicatorClassName={
            attendancePercentage >= 75
              ? "bg-pigment-indigo-600"
              : attendancePercentage >= 60
              ? "bg-pigment-indigo-400"
              : "bg-pigment-indigo-300"
          }
        />

        <div className="grid grid-cols-3 gap-4 mt-4 text-sm text-white">
          <div className="text-center">
            <div className="text-2xl font-bold text-pigment-indigo-500">
              {summary.present || 0}
            </div>
            <div className="text-white/70">Present</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pigment-indigo-600">
              {summary.absent || 0}
            </div>
            <div className="text-white/70">Absent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pigment-indigo-400">
              {(summary.present || 0) + (summary.absent || 0)}
            </div>
            <div className="text-white/70">Total</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceCard;
