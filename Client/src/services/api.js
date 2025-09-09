import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// User APIs
export const userAPI = {
  getMe: () => api.get("/users/me"),
  getAllUsers: () => api.get("/users"),
  getUserById: (id) => api.get(`/users/${id}`),
};

// Attendance APIs
export const attendanceAPI = {
  markAttendance: (data) => api.post("/attendance/mark", data),
  getStudentAttendance: (studentId) =>
    api.get(`/attendance/student/${studentId}`),
  getAttendanceByDate: (date) => api.get(`/attendance/date/${date}`),
  getAttendanceSummary: (studentId) =>
    api.get(`/attendance/summary/${studentId}`),
};

export default api;
