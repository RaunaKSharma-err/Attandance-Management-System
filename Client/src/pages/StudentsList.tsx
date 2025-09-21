import { useEffect, useState } from "react";
import { usersAPI } from "../services/api";
import type { User } from "../types";

const StudentsList = () => {
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
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
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg h-[85vh] shadow-sm border overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden">
        <div className=" border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-white ">Student List</h2>
          <p className="text-sm text-white">
            Mark attendance for each student
          </p>
        </div>

        <div className="p-6 h-[90vh]">
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentsList;
