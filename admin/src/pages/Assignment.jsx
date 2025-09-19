import React, { useState, useEffect } from "react";
import api from "../api.js";

const TutorAssignTable = () => {
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTutors, setSelectedTutors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tutorSearch, setTutorSearch] = useState("");
  const [activeTab, setActiveTab] = useState("students");
  const [assignMode, setAssignMode] = useState(false); // NEW: toggle between card and assign modal

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsRes = await api.get("/admin/students/");
        setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);

        const tutorsRes = await api.get("/admin/tutors/approved/");
        setTutors(Array.isArray(tutorsRes.data) ? tutorsRes.data : []);
      } catch (err) {
        console.error("API fetch error:", err.response || err);
      }
    };
    fetchData();
  }, []);

  // Open student card when row is clicked
  const handleRowClick = (student) => {
    setSelectedStudent(student);
    setAssignMode(false);
  };

  // Switch to tutor assignment modal
  const handleAssignClick = (student) => {
    setSelectedStudent(student);
    setAssignMode(true);

    const assignedIds = Array.isArray(student.assigned_tutors)
      ? student.assigned_tutors.map((t) => Number(t.id))
      : [];

    setSelectedTutors(assignedIds);
  };

  // Toggle tutor selection
  const toggleTutor = (tutorId) => {
    setSelectedTutors((prev) =>
      prev.includes(tutorId)
        ? prev.filter((id) => id !== tutorId)
        : [...prev, tutorId]
    );
  };

  // Save assignments
  const handleSave = async () => {
    if (!selectedStudent) return;

    const studentId = Number(selectedStudent.id);
    const newIds = selectedTutors.map((id) => Number(id));
    const oldIds = Array.isArray(selectedStudent.assigned_tutors)
      ? selectedStudent.assigned_tutors.map((t) => Number(t.id))
      : [];

    const toAssign = newIds.filter((id) => !oldIds.includes(id));
    const toUnassign = oldIds.filter((id) => !newIds.includes(id));

    try {
      if (toAssign.length > 0) {
        await api.post("/admin/manage-tutors/", {
          student_id: studentId,
          tutor_ids: toAssign,
          action: "assign",
        });
      }

      if (toUnassign.length > 0) {
        await api.post("/admin/manage-tutors/", {
          student_id: studentId,
          tutor_ids: toUnassign,
          action: "unassign",
        });
      }

      alert("Tutor assignments updated successfully");

      // Refresh
      const studentsRes = await api.get("/admin/students/");
      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);

      const tutorsRes = await api.get("/admin/tutors/approved/");
      setTutors(Array.isArray(tutorsRes.data) ? tutorsRes.data : []);

      setSelectedStudent(null);
      setSelectedTutors([]);
      setAssignMode(false);
    } catch (err) {
      console.error("Assignment error:", err.response?.data || err);
      alert("Failed to update tutor assignments");
    }
  };

  // Filters
  const filteredStudents = students.filter(
    (s) =>
      (s.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTutors = tutors.filter(
    (t) =>
      (t.full_name || "").toLowerCase().includes(tutorSearch.toLowerCase()) ||
      (t.qualification || "").toLowerCase().includes(tutorSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-0 to-emerald-0 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Student Management System
          </h1>
          <p className="text-gray-600">Manage student-tutor assignments</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 rounded-xl font-medium ${
              activeTab === "students"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab("tutors")}
            className={`px-4 py-2 rounded-xl font-medium ${
              activeTab === "tutors"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            Tutors
          </button>
        </div>

 {/* Students Tab */}
{activeTab === "students" && (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between bg-green-600 rounded-t-2xl">
      <h2 className="text-2xl font-semibold text-white mb-4 md:mb-0">
        Student Directory
      </h2>
      <input
        type="text"
        placeholder="Search students..."
        className="block w-full md:w-64 pl-4 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-green-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-green-700 uppercase tracking-wider">
              Student
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-green-700 uppercase tracking-wider">
              Assigned Tutors
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-green-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-100">
          {filteredStudents.map((student) => (
            <tr
              key={student.id}
              className="hover:bg-green-50 cursor-pointer"
              onClick={() => handleRowClick(student)}
            >
              {/* Photo + Name */}
              <td className="px-6 py-4 flex items-center space-x-4">
                <img
                  src={student.profile_photo || "/default-profile.png"}
                  alt={student.full_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
                />
                <span className="font-medium text-gray-800">{student.full_name || "-"}</span>
              </td>

              {/* Assigned Tutors */}
              <td className="px-6 py-4">
                {Array.isArray(student.assigned_tutors) && student.assigned_tutors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {student.assigned_tutors.map((tutor) => (
                      <span
                        key={tutor.id}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                      >
                        {tutor.full_name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">No tutors assigned</span>
                )}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <button
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-800"
                >
                  Assign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}



        {/* Tutors Tab */}
        {activeTab === "tutors" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tutor Directory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTutors.map((tutor) => (
                <div key={tutor.id} className="border rounded-xl p-4 hover:shadow-md transition">
                  <div className="font-semibold">{tutor.full_name || "N/A"}</div>
                  <div className="text-sm text-gray-600">
                    Qualification: {tutor.qualification || "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

       {/* Student Card Modal */}
{selectedStudent && !assignMode && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {selectedStudent.full_name}
        </h2>
        <button
          onClick={() => setSelectedStudent(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Profile Photo */}
      <div className="flex justify-center mb-4">
        <img
          src={selectedStudent.profile_photo || "/default-profile.png"}
          alt={selectedStudent.full_name}
          className="w-24 h-24 rounded-full object-cover border"
        />
      </div>

      {/* Qualification */}
      <p className="mb-2 text-gray-600">
        <strong>Qualification:</strong> {selectedStudent.qualification || "N/A"}
      </p>

      {/* Course (single field if exists) */}
      {selectedStudent.category && (
        <p className="mb-2 text-gray-600">
          <strong>Course:</strong> {selectedStudent.category}
        </p>
      )}

      {/* Categories (ManyToMany) */}
      {Array.isArray(selectedStudent.categories) &&
      selectedStudent.categories.length > 0 && (
        <div className="mb-4">
          <strong className="block text-gray-700 mb-1">Subjects:</strong>
          <div className="flex flex-wrap gap-2">
            {selectedStudent.categories.map((cat, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
              >
                {cat.name ? cat.name : cat}
              </span>
            ))}
          </div>
        </div>
      )}


      {/* Action */}
      <div className="flex justify-end">
        <button
          onClick={() => handleAssignClick(selectedStudent)}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition"
        >
          Assign Tutors
        </button>
      </div>
    </div>
  </div>
)}


        {/* Tutor Assignment Modal */}
        {selectedStudent && assignMode && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Assign Tutors to {selectedStudent.full_name}
                </h2>
                <button
                  onClick={() => setAssignMode(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <input
                type="text"
                placeholder="Search tutors..."
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-green-600 focus:border-green-600"
                value={tutorSearch}
                onChange={(e) => setTutorSearch(e.target.value)}
              />

             <div className="max-h-80 overflow-y-auto mb-6 border rounded-xl p-2">
  {filteredTutors.map((tutor) => (
    <label
      key={tutor.id}
      className="flex items-start p-3 rounded-lg hover:bg-green-50 transition-colors cursor-pointer"
    >
      <input
        type="checkbox"
        className="h-5 w-5 text-green-700 rounded focus:ring-green-600 mt-1"
        checked={selectedTutors.includes(tutor.id)}
        onChange={() => toggleTutor(tutor.id)}
      />
      <div className="ml-3 flex-1">
        <div className="text-gray-700 font-medium">{tutor.full_name}</div>

        

        {/* Subjects (Categories) */}
        {Array.isArray(tutor.categories) && tutor.categories.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-2">
            {tutor.categories.map((cat, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs"
              >
                {cat.name ? cat.name : cat}
              </span>
            ))}
          </div>
        )}
      </div>
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

export default TutorAssignTable;
