import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { StudentDashboard } from "./pages/StudentDashboard";
import { TeacherAdminDashboard } from "./pages/TeacherAdminDashboard";
import { MarkAttendance } from "./pages/MarkAttendance";
import { Unauthorized } from "./pages/unauthorized";
import { useAuth } from "./contexts/AuthContext";
import AssignRFIDPage from "./pages/AssignRFID";

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return user.role === "student" ? (
    <StudentDashboard />
  ) : (
    <TeacherAdminDashboard />
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardRouter />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/mark-attendance"
            element={
              <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                <Layout>
                  <MarkAttendance />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Student-only routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Profile
                    </h2>
                    <p className="text-gray-600">Profile page coming soon...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Layout>
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      My Attendance
                    </h2>
                    <p className="text-gray-600">
                      Detailed attendance view coming soon...
                    </p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Teacher/Admin only routes */}
          <Route
            path="/students"
            element={
              <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                <Layout>
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Students
                    </h2>
                    <p className="text-gray-600">
                      Student management page coming soon...
                    </p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                <Layout>
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Reports
                    </h2>
                    <p className="text-gray-600">
                      Attendance reports coming soon...
                    </p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/assign-id"
            element={
              <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                <Layout>
                  <AssignRFIDPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/export"
            element={
              <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                <Layout>
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Export Data
                    </h2>
                    <p className="text-gray-600">
                      Export functionality coming soon...
                    </p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
