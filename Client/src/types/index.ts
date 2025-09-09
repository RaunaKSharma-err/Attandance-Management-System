export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  rollNumber?: string;
}

export interface AttendanceRecord {
  _id: string;
  student: string | User;
  date: string;
  status: 'present' | 'absent';
  markedBy: string | User;
  markedAt: string;
}

export interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  attendancePercentage: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
  rollNumber?: string;
}

export interface AttendanceFormData {
  studentId: string;
  date: string;
  status: 'present' | 'absent';
}