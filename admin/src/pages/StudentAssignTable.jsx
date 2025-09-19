import React, { useState, useEffect } from "react";
import api from "../api";

const StudentAssignTable = () => {
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [assignMode, setAssignMode] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [activeTab, setActiveTab] = useState("tutors");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const studentsRes = await api.get("/admin/students/");
      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);

      const tutorsRes = await api.get("/admin/tutors/approved/");
      setTutors(Array.isArray(tutorsRes.data) ? tutorsRes.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const openTutorDetails = (tutor) => {
    setSelectedTutor(tutor);
  };

  const openAssignStudents = () => {
    if (!selectedTutor) return;
    const assignedIds = Array.isArray(selectedTutor.assigned_students)
      ? selectedTutor.assigned_students.map((s) => Number(s.id))
      : [];
    setSelectedStudents(assignedIds);
    setAssignMode(true);
  };

  const toggleStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSave = async () => {
    if (!selectedTutor) return;

    const tutorId = Number(selectedTutor.id);
    const newIds = selectedStudents.map((id) => Number(id));
    const oldIds = Array.isArray(selectedTutor.assigned_students)
      ? selectedTutor.assigned_students.map((s) => Number(s.id))
      : [];

    const toAssign = newIds.filter((id) => !oldIds.includes(id));
    const toUnassign = oldIds.filter((id) => !newIds.includes(id));

    try {
      if (toAssign.length > 0) {
        await api.post("/admin/manage-students/", {
          tutor_id: tutorId,
          student_ids: toAssign,
          action: "assign",
        });
      }
      if (toUnassign.length > 0) {
        await api.post("/admin/manage-students/", {
          tutor_id: tutorId,
          student_ids: toUnassign,
          action: "unassign",
        });
      }

      alert("Assignments updated successfully");
      fetchData();
      setAssignMode(false);
      setSelectedTutor(null);
      setSelectedStudents([]);
    } catch (err) {
      console.error(err);
      alert("Failed to update assignments.");
    }
  };

  const filteredTutors = tutors.filter(
    (t) =>
      (t.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.qualification || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(
    (s) =>
      (s.full_name || "").toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.qualification || "").toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Tutor Management System
          </h1>
          <p className="text-gray-600">Manage tutor-student assignments efficiently</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setActiveTab("tutors")}
            className={`px-4 py-2 rounded-xl font-medium ${
              activeTab === "tutors" ? "bg-green-600 text-white" : "bg-white text-gray-700 border"
            }`}
          >
            Tutors
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 rounded-xl font-medium ${
              activeTab === "students" ? "bg-green-600 text-white" : "bg-white text-gray-700 border"
            }`}
          >
            Students
          </button>
        </div>

        {/* Tutors Table */}
        {activeTab === "tutors" && (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b flex flex-col md:flex-row justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 mb-3 md:mb-0">Tutor Directory</h2>
              <input
                type="text"
                placeholder="Search tutors..."
                className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qualification</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Students</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
  {filteredTutors.map((tutor, index) => (
    <tr
      key={tutor.id ?? index}
      className="hover:bg-green-50 transition-colors cursor-pointer"
      onClick={() => setSelectedTutor(tutor)}
    >
      {/* Profile Photo + Name */}
      <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
          {tutor.profile_photo ? (
            <img
              src={tutor.profile_photo}
              alt={tutor.full_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <i className="fas fa-user text-gray-400"></i>
          )}
        </div>
        <span>{tutor.full_name || "N/A"}</span>
      </td>

      {/* Qualification */}
      <td className="px-6 py-4 whitespace-nowrap">{tutor.qualification || "N/A"}</td>

      {/* Assigned Students */}
      <td className="px-6 py-4 whitespace-nowrap">
        {Array.isArray(tutor.assigned_students) && tutor.assigned_students.length > 0
          ? tutor.assigned_students.map((s) => s.full_name).join(", ")
          : "No students assigned"}
      </td>

      {/* Action */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
        Click row to view
      </td>
    </tr>
  ))}
</tbody>

              </table>
            </div>
          </div>
        )}

        {/* Students Grid */}
        {activeTab === "students" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Student Directory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="border rounded-xl p-4 hover:shadow-md transition">
                  <div className="font-semibold">{student.full_name || "N/A"}</div>
                  <div className="text-sm text-gray-600">Qualification: {student.qualification || "N/A"}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tutor Details Modal */}
        {selectedTutor && !assignMode && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedTutor.full_name}</h2>
                <button
                  onClick={() => setSelectedTutor(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-600 mb-2">
                <strong>Qualification:</strong> {selectedTutor.qualification || "N/A"}
              </p>

              {Array.isArray(selectedTutor.categories) && selectedTutor.categories.length > 0 && (
                <div className="mb-4">
                  <strong className="block text-gray-700 mb-1">Subjects:</strong>
                  <div className="flex flex-wrap gap-2">
                    {selectedTutor.categories.map((cat, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm" title={cat.name || cat}>
                        {cat.name || cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}


              <div className="flex justify-end">
                <button
                  onClick={openAssignStudents}
                  className="px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition font-semibold"
                >
                  Assign Students
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assign Students Modal */}
{assignMode && selectedTutor && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Assign Students to {selectedTutor.full_name}</h2>
        <button
          onClick={() => setAssignMode(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <input
        type="text"
        placeholder="Search students..."
        className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-green-600 focus:border-green-600"
        value={studentSearch}
        onChange={(e) => setStudentSearch(e.target.value)}
      />

      <div className="max-h-80 overflow-y-auto mb-6 border rounded-xl p-2">
        {filteredStudents.map((student) => (
          <label
            key={student.id}
            className="flex flex-col p-3 rounded-lg hover:bg-green-50 transition-colors cursor-pointer"
          >
            <div className="flex items-start">
              <input
                type="checkbox"
                className="h-5 w-5 text-green-700 rounded focus:ring-green-600 mt-1"
                checked={selectedStudents.includes(student.id)}
                onChange={() => toggleStudent(student.id)}
              />
              <div className="ml-3 flex-1">
                <div className="text-gray-700 font-medium">{student.full_name}</div>
                
              </div>
            </div>

            {/* Categories */}
            {Array.isArray(student.categories) && student.categories.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {student.categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                    title={cat.name || cat}
                  >
                    {cat.name || cat}
                  </span>
                ))}
              </div>
            )}
          </label>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setAssignMode(false)}
          className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-colors"
        >
          Save Assignments
        </button>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default StudentAssignTable;
