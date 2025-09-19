import React from "react";

const TutorsTable = ({
  title,
  tutors = [],
  onRequestStatusChange,
  variant,
  emptyMessage = "No data available",
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {tutors.length > 0 ? (
              tutors.map((tutor) => (
                <tr key={`tutor-${tutor.id}`} className="hover:bg-gray-50 transition-colors">

                  <td className="px-6 py-4 whitespace-nowrap">{tutor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tutor.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tutor.experience}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tutor.rating}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tutor.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {variant === "requests" && onRequestStatusChange && (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onRequestStatusChange(tutor.id, "Approved")}
                          className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onRequestStatusChange(tutor.id, "Rejected")}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TutorsTable;
