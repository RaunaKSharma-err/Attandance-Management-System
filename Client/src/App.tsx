import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Dashboard wrapper component that routes based on user role

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === "student") {
    return <StudentDashboard />;
  } else if (user?.role === "teacher" || user?.role === "admin") {
    return <TeacherDashboard />;
  }

  return <div>Invalid role</div>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="text-center py-8">
                      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
                      <p className="text-muted-foreground">
                        Profile management coming soon...
                      </p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Student-only routes */}
            <Route
              path="/attendance"
              element={
                <ProtectedRoute roles={["student"]}>
                  <Layout>
                    <div className="text-center py-8">
                      <h1 className="text-2xl font-bold mb-4">My Attendance</h1>
                      <p className="text-muted-foreground">
                        Detailed attendance view coming soon...
                      </p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Teacher/Admin routes */}
            <Route
              path="/students"
              element={
                <ProtectedRoute roles={["teacher", "admin"]}>
                  <Layout>
                    <div className="text-center py-8">
                      <h1 className="text-2xl font-bold mb-4">
                        Students Management
                      </h1>
                      <p className="text-muted-foreground">
                        Student management coming soon...
                      </p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/mark-attendance"
              element={
                <ProtectedRoute roles={["teacher", "admin"]}>
                  <Layout>
                    <div className="text-center py-8">
                      <h1 className="text-2xl font-bold mb-4">
                        Mark Attendance
                      </h1>
                      <p className="text-muted-foreground">
                        Quick attendance marking coming soon...
                      </p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/unauthorized"
              element={
                <div className="min-h-screen flex items-center justify-center bg-background">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">403</h1>
                    <p className="text-xl text-muted-foreground mb-4">
                      Access Denied
                    </p>
                    <p className="text-muted-foreground">
                      You don't have permission to access this page.
                    </p>
                  </div>
                </div>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
