import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import type { JSX } from "react";
//import Login from "@/pages/auth/Login";
import UniversitySupervisorDashboard from "@/pages/university_supervisor/UniversitySupervisorDashboard";
import CompanySupervisorDashboard from "@/pages/company_supervisor/CompanySupervisorDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signup";
// Example auth context or state
const fakeAuth = {
  isLoggedIn: true,
  userRole: "university_supervisor",
};

// PrivateRoute wrapper
function PrivateRoute({
  children,
  role,
}: {
  children: JSX.Element;
  role: string;
}) {
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* University Supervisor dashboard */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/uni/dashboard"
          element={
            <PrivateRoute role="UniSupervisor">
              <UniversitySupervisorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/com/dashboard"
          element={
            <PrivateRoute role="CompSupervisor">
              <CompanySupervisorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute role="Student">
              <StudentDashboard />
            </PrivateRoute>
          }
        />

        {/* Default/fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
