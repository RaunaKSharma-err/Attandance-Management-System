import axios from 'axios';
import type{ RegisterData, AttendanceFormData } from '../types';

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (userData: RegisterData) =>
    api.post('/auth/register', userData),
};

// Users API
export const usersAPI = {
  getMe: () => api.get('/users/me'),
  getUsers: (page?: number, limit?: number) =>
    api.get('/users', { params: { page, limit } }),
  getStudents: () => api.get('/users/students'),
  assignRFID: (studentId: string, rfid: string) =>
    api.post(`/attendance/users/${studentId}/assign-rfid`, { rfid }),
};

// Attendance API
export const attendanceAPI = {
  getSummary: (studentId: string) =>
    api.get(`/attendance/summary/${studentId}`),
  getStudentAttendance: (studentId: string, page?: number, limit?: number) =>
    api.get(`/attendance/student/${studentId}`, { params: { page, limit } }),
  getAttendanceByDate: (date: string) =>
    api.get(`/attendance/date/${date}`),
  markAttendance: (data: AttendanceFormData) =>
    api.post('/attendance/mark', data),
  getAttendanceReport: (startDate?: string, endDate?: string) =>
    api.get('/attendance/report', { params: { startDate, endDate } }),
};

export default api;