import React, { useState, useEffect } from "react";

const TutorAssignTable = () => {
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignedTutors, setAssignedTutors] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTutors, setSelectedTutors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tutorSearch, setTutorSearch] = useState("");
  const [activeTab, setActiveTab] = useState("students");

  useEffect(() => {
    // Mock tutors
    setTutors([
      { id: 1, name: "John Doe", email: "john@example.com", subject: "Mathematics", experience: "5 yrs", rating: 4.8, students: 12 },
      { id: 2, name: "Jane Smith", email: "jane@example.com", subject: "Physics", experience: "3 yrs", rating: 4.5, students: 8 },
      { id: 3, name: "Robert Johnson", email: "robert@example.com", subject: "Chemistry", experience: "7 yrs", rating: 4.9, students: 15 },
      { id: 4, name: "Emily Davis", email: "emily@example.com", subject: "Biology", experience: "4 yrs", rating: 4.7, students: 9 },
      { id: 5, name: "Michael Wilson", email: "michael@example.com", subject: "Computer Science", experience: "6 yrs", rating: 4.6, students: 11 },
      { id: 6, name: "Sarah Brown", email: "sarah@example.com", subject: "English", experience: "2 yrs", rating: 4.3, students: 6 },
    ]);

    // Mock students
    setStudents([
      { id: 1, name: "Alice Brown", level: "maths", progress: 75 },
      { id: 2, name: "Michael Scott", level: "python", progress: 40 },
      { id: 3, name: "Dwight Schrute", level: "english", progress: 90 },
      { id: 4, name: "Pam Beesly", level: "hindi", progress: 65 },
      { id: 5, name: "Jim Halpert", level: "mearn stack", progress: 85 },
      { id: 6, name: "Stanley Hudson", level: "malayalam", progress: 30 },
      { id: 7, name: "Kevin Malone", level: "music", progress: 60 },
      { id: 8, name: "Angela Martin", level: "Advanced", progress: 95 },
    ]);
  }, []);

  const handleAssignClick = (student) => {
    setSelectedStudent(student);
    setSelectedTutors(assignedTutors[student.id] || []);
  };

  const toggleTutor = (tutorId) => {
    setSelectedTutors((prev) =>
      prev.includes(tutorId)
        ? prev.filter((id) => id !== tutorId)
        : [...prev, tutorId]
    );
  };

  const handleSave = () => {
    if (selectedStudent) {
      setAssignedTutors((prev) => ({
        ...prev,
        [selectedStudent.id]: selectedTutors,
      }));
    }
    setSelectedStudent(null);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTutors = tutors.filter((tutor) =>
    tutor.name.toLowerCase().includes(tutorSearch.toLowerCase()) ||
    tutor.subject.toLowerCase().includes(tutorSearch.toLowerCase())
  );

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getAssignedTutorNames = (studentId) => {
    const tutorIds = assignedTutors[studentId] || [];
    return tutorIds.map(id => {
      const tutor = tutors.find(t => t.id === id);
      return tutor ? tutor.name : "";
    }).filter(name => name !== "").join(", ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Student Management System</h1>
          <p className="text-gray-600">Efficiently manage student-tutor assignments</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 rounded-xl font-medium ${activeTab === "students" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"}`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab("tutors")}
            className={`px-4 py-2 rounded-xl font-medium ${activeTab === "tutors" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"}`}
          >
            Tutors
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "students" ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header with search */}
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">Student Directory</h2>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search students or levels..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Tutors</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                              {student.name.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{student.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.level}</div>
                      </td>
                     
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getAssignedTutorNames(student.id) || "No tutors assigned"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleAssignClick(student)}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl transition-all transform hover:-translate-y-0.5"
                        >
                          Assign Tutors
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tutor Directory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tutors.map((tutor) => (
                <div key={tutor.id} className="border rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {tutor.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold">{tutor.name}</div>
                      <div className="text-sm text-gray-600">{tutor.subject}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Experience: {tutor.experience}</div>
                  <div className="text-sm text-gray-600">Rating: {tutor.rating}/5</div>
                  <div className="text-sm text-gray-600">Students: {tutor.students}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal for assigning tutors */}
{selectedStudent && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Assign Tutors to {selectedStudent.name}
        </h2>
        <button
          onClick={() => setSelectedStudent(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tutors..."
          value={tutorSearch}
          onChange={(e) => setTutorSearch(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="max-h-80 overflow-y-auto mb-6 border rounded-xl p-2">
        <div className="space-y-2">
          {filteredTutors.map((tutor) => (
            <label
              key={tutor.id}
              className="flex items-start p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mt-1"
                checked={selectedTutors.includes(tutor.id)}
                onChange={() => toggleTutor(tutor.id)}
              />
              <div className="ml-3 flex-1">
                <div className="text-gray-700 font-medium">{tutor.name}</div>
                <div className="text-sm text-gray-500">{tutor.email}</div>
                <div className="text-sm text-gray-500">
                  {tutor.experience} years experience • {tutor.qualification}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setSelectedStudent(null)}
          className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center"
        >
          <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
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