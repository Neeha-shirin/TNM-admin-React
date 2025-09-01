// pages/Tutor.jsx
import React, { useState, useEffect } from "react";
import StatCard from "../components/Statcard/Statcard";
import TutorsTable from "../components/TutorsTable/TutorsTable"; // <-- NEW import

const Tutor = () => {
  const [tutors, setTutors] = useState([]);
  const [tutorRequests, setTutorRequests] = useState([]);
  const [rejectedTutors, setRejectedTutors] = useState([]); // <-- NEW
  const [editingTutor, setEditingTutor] = useState(null);
  const [deletingTutor, setDeletingTutor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setTutors([
      { id: 1, name: "John Doe", email: "john@example.com", subject: "Mathematics", experience: "5 years", rating: 4.8, status: "Active" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", subject: "Physics", experience: "3 years", rating: 4.5, status: "Active" },
    ]);
    setTutorRequests([
      { id: 101, name: "Robert Johnson", email: "robert@example.com", subject: "Chemistry", experience: "7 years", rating: 4.9, requestStatus: "Pending" },
      { id: 102, name: "Sarah Williams", email: "sarah@example.com", subject: "Biology", experience: "4 years", rating: 4.7, requestStatus: "Pending" },
    ]);
  }, []);

  // --- handlers (unchanged except for save requests) ---
  const handleEditClick = (tutor) => setEditingTutor(tutor);

  const handleSaveTutor = () => {
    setTutors(tutors.map((t) => (t.id === editingTutor.id ? editingTutor : t)));
    setEditingTutor(null);
  };

  const handleDeleteConfirm = () => {
    setTutors(tutors.filter((t) => t.id !== deletingTutor.id));
    setDeletingTutor(null);
  };

  const handleRequestStatusChange = (requestId, newStatus) => {
    setTutorRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, requestStatus: newStatus } : request
      )
    );
  };

  const handleSaveRequests = () => {
    const approved = tutorRequests.filter((r) => r.requestStatus === "Approved");
    const rejected = tutorRequests.filter((r) => r.requestStatus === "Rejected");

    // Move approved → tutors (default to Active)
    setTutors((prev) => [
      ...prev,
      ...approved.map((r) => ({ ...r, status: "Active" })),
    ]);

    // Move rejected → rejectedTutors
    setRejectedTutors((prev) => [
      ...prev,
      ...rejected.map((r) => ({ ...r, status: "Rejected" })),
    ]);

    // Keep only pending
    setTutorRequests((prev) => prev.filter((r) => r.requestStatus === "Pending"));
  };
  // -----------------------------------------------------

  // --- filtering (adds rejected filter) ---
  const lower = (s) => (s || "").toLowerCase();
  const q = lower(searchTerm);

  const filteredTutors = tutors.filter(
    (t) =>
      lower(t.name).includes(q) ||
      lower(t.subject).includes(q) ||
      lower(t.email).includes(q)
  );

  const filteredRequests = tutorRequests.filter(
    (r) =>
      lower(r.name).includes(q) ||
      lower(r.subject).includes(q) ||
      lower(r.email).includes(q)
  );

  const filteredRejectedTutors = rejectedTutors.filter(
    (t) =>
      lower(t.name).includes(q) ||
      lower(t.subject).includes(q) ||
      lower(t.email).includes(q)
  );
  // ---------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Tutor Management</h1>
            <p className="text-gray-600 mt-2">Manage all tutors in your institution</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title="Total students"
            value={tutors.length}
            bgColor="bg-white"
            iconBg="bg-blue-100 p-3"
          />

          <StatCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            title="Pending Requests"
            value={tutorRequests.length}
            bgColor="bg-white"
            iconBg="bg-green-100 p-3"
          />       
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tutors by name, subject or email"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* --- TABLES using ONE component --- */}
        <TutorsTable
          title="Tutor Requests"
          variant="requests"
          rows={filteredRequests}
          onRequestStatusChange={handleRequestStatusChange}
          onSaveRequests={handleSaveRequests}
          emptyMessage="No tutor requests found."
        />

        <TutorsTable
          title="Approved Tutors"
          tutors={filteredTutors}   // ✅ must pass an array
          onEdit={handleEditClick}
          onDelete={(tutor) => setDeletingTutor(tutor)}
        />

        <TutorsTable
          title="Rejected Tutors"
          tutors={filteredRejectedTutors}   // ✅ must pass an array
          onEdit={handleEditClick}
          onDelete={(tutor) => setDeletingTutor(tutor)}
        />

        {/* ------------------------------------ */}

        {/* Edit Modal */}
        {editingTutor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Edit Tutor</h2>
                <button
                  onClick={() => setEditingTutor(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingTutor.status || "Active"}
                    onChange={(e) =>
                      setEditingTutor({ ...editingTutor, status: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="onleave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => setEditingTutor(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTutor}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingTutor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Delete Tutor</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete <strong>{deletingTutor.name}</strong>? This action cannot be undone.
              </p>
              <div className="mt-5 flex justify-center space-x-3">
                <button
                  onClick={() => setDeletingTutor(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutor;
