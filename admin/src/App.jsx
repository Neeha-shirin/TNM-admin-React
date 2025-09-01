import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Reviews from "./pages/Reviews";
import Courses from "./pages/Courses";
import { UserNavbar } from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Tutor from "./pages/Tutor";
import Student from "./pages/Student";
import Assignment from "./pages/Assignment";
import Login from "./pages/Login";

export default function App() {
  const location = useLocation();

  // Check if current route is login
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex flex-col h-screen">
      {/* Show navbar only if not on login page */}
      {!isLoginPage && <UserNavbar />}

      <div className="flex flex-1">
        {/* Show sidebar only if not on login page */}
        {!isLoginPage && (
          <div className="w-64 bg-white shadow-md border-r">
            <Sidebar />
          </div>
        )}

        {/* Page content */}
        <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/course" element={<Courses />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/tutor" element={<Tutor />} />
            <Route path="/student" element={<Student />} />
            <Route path="/assignment" element={<Assignment />} />

            
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
