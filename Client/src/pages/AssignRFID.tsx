import { useEffect, useState } from "react";
import { usersAPI } from "../services/api";
import type { User } from "../types";

const AssignRFIDPage = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [rfid, setRfid] = useState<string>("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await usersAPI.getUsers();
        if (res.data && Array.isArray(res.data.students)) {
          setStudents(res.data.students);
        } else {
          console.error("No students array found", res.data);
        }
      } catch (err) {
        console.error("Error fetching students", err);
      }
    };
    fetchStudents();
  }, []);

  const handleAssign = async () => {
    if (!selectedStudent || !rfid) return;
    try {
      await usersAPI.assignRFID(selectedStudent, rfid);
      alert("RFID assigned successfully");
      setRfid("");
      setSelectedStudent("");
    } catch (err) {
      console.error("Error assigning RFID", err);
      alert("Failed to assign RFID");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mb-24">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Assign RFID to Student
        </h2>

        <label className="block mb-2 text-gray-700 font-medium">
          Select Student
        </label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full mb-4 p-3 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a student</option>
          {students.length > 0 ? (
            students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))
          ) : (
            <option disabled>No students available</option>
          )}
        </select>

        <label className="block mb-2 text-gray-700 font-medium">RFID Tag</label>
        <input
          type="text"
          value={rfid}
          placeholder="Enter RFID tag"
          onChange={(e) => setRfid(e.target.value)}
          className="w-full mb-6 p-3 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <button
          onClick={handleAssign}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Assign RFID
        </button>
      </div>
    </div>
  );
};

export default AssignRFIDPage;
