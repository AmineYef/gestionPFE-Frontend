import {
BrowserRouter as Router,
Routes,
Route,
Navigate,
} from "react-router-dom";
 
// Auth
import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";
 
// Student
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentOverview from "@/pages/student/StudentOverview";
import StudentProject from "@/pages/student/StudentProject";
import StudentSprints from "@/pages/student/StudentSprints";
import StudentTasks from "@/pages/student/StudentTasks";
import StudentTaskHistory from "@/pages/student/StudentTaskHistory";
import StudentMeetings from "@/pages/student/StudentMeetings";
import StudentReports from "@/pages/student/StudentReports";
import StudentValidations from "@/pages/student/StudentValidations";
import StudentJournal from "@/pages/student/StudentJournal";
 
// Supervisors
import UniversitySupervisorDashboard from "@/pages/university_supervisor/UniversitySupervisorDashboard";
import CompanySupervisorDashboard from "@/pages/company_supervisor/CompanySupervisorDashboard";
 
function App() {
return (
<Router>
<Routes>
{/* Auth */}
<Route path="/login" element={<LoginPage />} />
<Route path="/signup" element={<SignupPage />} />
 
{/* ─── Student ──────────────────────────────────────────── */}
<Route path="/student" element={<StudentDashboard />}>
<Route index element={<Navigate to="/student/dashboard" replace />} />
<Route path="dashboard" element={<StudentOverview />} />
<Route path="project" element={<StudentProject />} />
<Route path="sprints" element={<StudentSprints />} />
<Route path="stories" element={<StudentSprints />} />
<Route path="tasks" element={<StudentTasks />} />
<Route path="tasks/history" element={<StudentTaskHistory />} />
<Route path="meetings" element={<StudentMeetings />} />
<Route path="reports" element={<StudentReports />} />
<Route path="validations" element={<StudentValidations />} />
<Route path="journal" element={<StudentJournal />} />
</Route>
 
{/* ─── University Supervisor ───────────────────────────── */}
<Route path="/uni/dashboard" element={<UniversitySupervisorDashboard />} />
 
{/* ─── Company Supervisor ──────────────────────────────── */}
<Route path="/com/dashboard" element={<CompanySupervisorDashboard />} />
 
{/* Default fallback */}
<Route path="/" element={<Navigate to="/login" replace />} />
<Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
</Router>
);
}
 
export default App;
