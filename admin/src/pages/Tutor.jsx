import React, { useState, useEffect } from "react";
import api from "../api";

import StatsCard from "../components/StatsCard"; // same as Payment.jsx

import TutorsTable from "../components/TutorsTable/TutorsTable";

const Tutor = () => {
  const [tutors, setTutors] = useState([]);
  const [tutorRequests, setTutorRequests] = useState([]);
  const [rejectedTutors, setRejectedTutors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch tutors from API
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);

        // Fetch all tutors
        const res = await api.get("/admin/tutors/");
        const allTutors = res.data.map((t) => ({
          id: t.id,
          name: t.full_name,
          email: t.email,
          subject: t.qualification || "N/A",
          status: t.is_approved ? "Approved" : t.is_rejected ? "Rejected" : "Pending",
          experience: t.experience_years || "N/A",
          rating: t.rating || 0,
        }));

        setTutorRequests(allTutors.filter((t) => t.status === "Pending"));
        setRejectedTutors(allTutors.filter((t) => t.status === "Rejected"));

        // Fetch approved tutors separately
        const approvedRes = await api.get("/admin/tutors/approved/");
        const approvedTutors = approvedRes.data.map((t) => ({
          id: t.id,
          name: t.full_name,
          email: t.email,
          subject: t.qualification || "N/A",
          status: "Approved",
          experience: t.experience_years || "N/A",
          rating: t.rating || 0,
        }));
        setTutors(approvedTutors);
      } catch (err) {
        console.error("Error fetching tutors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  // Approve / Reject
  const handleRequestStatusChange = async (tutorId, newStatus) => {
  try {
    const payload = { action: newStatus.toLowerCase() }; // "approve" or "reject"
    if (newStatus === "Rejected") payload.reason = "Rejected by admin"; // optional reason

    // PATCH request to backend
    const res = await api.patch(`/admin/review-user/${tutorId}/`, payload);

    // Find tutor in pending list
    const movedTutor = tutorRequests.find(t => t.id === tutorId);
    if (!movedTutor) return;

    // Remove from pending
    setTutorRequests(prev => prev.filter(t => t.id !== tutorId));

    // Prepare updated tutor
    const updatedTutor = {
      ...movedTutor,
      status: newStatus,
      is_approved: res.data.is_approved,
      is_rejected: res.data.is_rejected,
      rejection_reason: res.data.rejection_reason || "",
    };

    // Add to correct list
    if (newStatus === "Approved") setTutors(prev => [...prev, updatedTutor]);
    else if (newStatus === "Rejected") setRejectedTutors(prev => [...prev, updatedTutor]);

  } catch (err) {
    console.error("Failed to update tutor status:", err.response || err);
    alert("Failed to update tutor status");
  }
};

  // Filtering
  const q = searchTerm.toLowerCase();
  const filterBySearch = (arr) =>
    arr.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q)
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Tutor Management</h1>

        {/* Stats Overview */}
{/* Stats Overview */}
{/* Stats Overview */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  {[
    {
      icon: "fas fa-user-check",
      title: "Approved Tutors",
      value: tutors.length,
      color: "border-l-green-500",
    },
    {
      icon: "fas fa-user-clock",
      title: "Pending Requests",
      value: tutorRequests.length,
      color: "border-l-yellow-500",
    },
    {
      icon: "fas fa-user-times",
      title: "Rejected Tutors",
      value: rejectedTutors.length,
      color: "border-l-red-500",
    },
  ].map((s, i) => (
    <StatsCard key={i} {...s} />
  ))}
</div>



        <input
          type="text"
          placeholder="Search tutors by name, subject, email"
          className="mb-6 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <>
            <TutorsTable
              title="Pending Requests"
              tutors={filterBySearch(tutorRequests)}
              variant="requests"
              onRequestStatusChange={handleRequestStatusChange}
              emptyMessage="No tutor requests found."
            />
            <TutorsTable title="Approved Tutors" tutors={filterBySearch(tutors)} emptyMessage="No approved tutors found." />
            <TutorsTable title="Rejected Tutors" tutors={filterBySearch(rejectedTutors)} emptyMessage="No rejected tutors found." />
          </>
        )}
      </div>
    </div>
  );
};

export default Tutor;
