const API_BASE = import.meta.env.VITE_API_BASE;
 
// ─── Types ────────────────────────────────────────────────────────────────────
export interface AuthResponse {
accessToken: string;
user: {
id: string;
name: string;
email: string;
role: "Student" | "UniSupervisor" | "CompSupervisor";
};
}
 
// ─── Helpers ──────────────────────────────────────────────────────────────────
function getAuthHeaders(): HeadersInit {
const token = localStorage.getItem("token");
return {
"Content-Type": "application/json",
...(token ? { Authorization: `Bearer ${token}` } : {}),
};
}
 
async function handleResponse<T>(res: Response): Promise<T> {
if (!res.ok) {
const body = await res.json().catch(() => ({}));
throw new Error(body.message ?? `Erreur ${res.status}`);
}
return res.json() as Promise<T>;
}
 
// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
const res = await fetch(`${API_BASE}/auth/login`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ email, password }),
});
return handleResponse<AuthResponse>(res);
}
 
export async function registerUser(data: {
name: string;
email: string;
password: string;
role: string;
}): Promise<AuthResponse> {
const res = await fetch(`${API_BASE}/auth/register`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(data),
});
return handleResponse<AuthResponse>(res);
}
 
export function logoutUser() {
localStorage.removeItem("token");
localStorage.removeItem("user");
window.location.href = "/login";
}
 
export function getCurrentUser() {
try {
return JSON.parse(localStorage.getItem("user") ?? "null");
} catch {
return null;
}
}
 
export function getToken(): string | null {
return localStorage.getItem("token");
}
 
// ─── Projects ─────────────────────────────────────────────────────────────────
export async function fetchProjects() {
const res = await fetch(`${API_BASE}/projects`, {
headers: getAuthHeaders(),
});
return handleResponse<any[]>(res);
}
 

export async function createProject(data: {
title: string;
description: string;
uniSupervisorId: string;
compSupervisorId: string;
}) {
const res = await fetch(`${API_BASE}/projects`, {
method: "POST",
headers: getAuthHeaders(),
body: JSON.stringify(data),
});
return handleResponse<any>(res);
}
 
export async function fetchProjectById(id: string) {
const res = await fetch(`${API_BASE}/projects/${id}`, {
headers: getAuthHeaders(),
});
return handleResponse<any>(res);
}
 
// ─── Sprints ──────────────────────────────────────────────────────────────────
export async function fetchSprints(projectId: string) {
const res = await fetch(`${API_BASE}/projects/${projectId}/sprints`, {
headers: getAuthHeaders(),
});
return handleResponse<any[]>(res);
}
 
export async function createSprint(
projectId: string,
data: { title: string; goal: string; startDate: string; endDate: string }
) {
const res = await fetch(`${API_BASE}/projects/${projectId}/sprints`, {
method: "POST",
headers: getAuthHeaders(),
body: JSON.stringify(data),
});
return handleResponse<any>(res);
}
 
// ─── User Stories ─────────────────────────────────────────────────────────────
export async function fetchUserStories(sprintId: string) {
const res = await fetch(`${API_BASE}/sprints/${sprintId}/user-stories`, {
headers: getAuthHeaders(),
});
return handleResponse<any[]>(res);
}
 
export async function createUserStory(
sprintId: string,
data: { title: string; description: string; priority: string; estimatedPoints: number }
) {
const res = await fetch(`${API_BASE}/sprints/${sprintId}/user-stories`, {
method: "POST",
headers: getAuthHeaders(),
body: JSON.stringify(data),
});
return handleResponse<any>(res);
}
 
// ─── Tasks ────────────────────────────────────────────────────────────────────
export async function fetchTasks(userStoryId: string) {
const res = await fetch(`${API_BASE}/user-stories/${userStoryId}/tasks`, {
headers: getAuthHeaders(),
});
return handleResponse<any[]>(res);
}
 
export async function createTask(
userStoryId: string,
data: { title: string; description: string; estimatedHours: number }
) {
const res = await fetch(`${API_BASE}/user-stories/${userStoryId}/tasks`, {
method: "POST",
headers: getAuthHeaders(),
body: JSON.stringify(data),
});
return handleResponse<any>(res);
}

 
export async function updateTaskStatus(taskId: string, status: string) {
const res = await fetch(`${API_BASE}/tasks/${taskId}/status`, {
method: "PATCH",
headers: getAuthHeaders(),
body: JSON.stringify({ status }),
});
return handleResponse<any>(res);
}
 
export async function fetchTaskHistory(taskId: string) {
const res = await fetch(`${API_BASE}/tasks/${taskId}/history`, {
headers: getAuthHeaders(),
});
return handleResponse<any[]>(res);
}
 
// ─── Validations ──────────────────────────────────────────────────────────────
export async function fetchValidations(projectId: string) {
const res = await fetch(`${API_BASE}/projects/${projectId}/validations`, {
headers: getAuthHeaders(),
});
return handleResponse<any[]>(res);
}
 
export async function validateTask(
taskId: string,
data: { status: "approved" | "rejected"; comment?: string; meetingId?: string }
) {
const res = await fetch(`${API_BASE}/tasks/${taskId}/validate`, {
method: "POST",
headers: getAuthHeaders(),
body: JSON.stringify(data),
});
return handleResponse<any>(res);
}
 
// ─── Meetings ─────────────────────────────────────────────────────────────────
export async function fetchMeetings(projectId: string) {
const res = await fetch(`${API_BASE}/projects/${projectId}/meetings`, {
headers: getAuthHeaders(),
});
return handleResponse<any[]>(res);
}
 
export async function createMeeting(
projectId: string,
data: {
title: string;
scheduledDate: string;
agenda: string;
linkedUserStoryId?: string;
linkedTaskId?: string;
linkedReportVersionId?: string;
}
) {
const res = await fetch(`${API_BASE}/projects/${projectId}/meetings`, {
method: "POST",
headers: getAuthHeaders(),
body: JSON.stringify(data),
});
return handleResponse<any>(res);
}
 
export async function completeMeeting(
meetingId: string,
data: { minutesContent: string }
) {
const res = await fetch(`${API_BASE}/meetings/${meetingId}/complete`, {
method: "PATCH",
headers: getAuthHeaders(),
body: JSON.stringify(data),
});
return handleResponse<any>(res);
}
 
export async function validateMeeting(meetingId: string) {
const res = await fetch(`${API_BASE}/meetings/${meetingId}/validate`, {
method: "POST",
headers: getAuthHeaders(),

});
return handleResponse<any>(res);
}
 
// ─── Reports ──────────────────────────────────────────────────────────────────
export async function fetchReportVersions(projectId: string) {
const res = await fetch(`${API_BASE}/projects/${projectId}/reports`, {
headers: getAuthHeaders(),
});
return handleResponse<any[]>(res);
}
 
export async function uploadReportVersion(
projectId: string,
data: { version: string; notes: string; file: File }
) {
const formData = new FormData();
formData.append("version", data.version);
formData.append("notes", data.notes);
formData.append("file", data.file);
 
const token = localStorage.getItem("token");
const res = await fetch(`${API_BASE}/projects/${projectId}/reports`, {
method: "POST",
headers: token ? { Authorization: `Bearer ${token}` } : {},
body: formData,
});
return handleResponse<any>(res);
}
 
// ─── Dashboard ────────────────────────────────────────────────────────────────
export async function fetchDashboard(projectId: string) {
const res = await fetch(`${API_BASE}/projects/${projectId}/dashboard`, {
headers: getAuthHeaders(),
});
return handleResponse<any>(res);
}
 
export async function fetchJournal(projectId: string) {
const res = await fetch(`${API_BASE}/projects/${projectId}/journal`, {
headers: getAuthHeaders(),
});
return handleResponse<any[]>(res);
}
 
// ─── Sprint Reports HTML ──────────────────────────────────────────────────────
export async function generateSprintReport(sprintId: string): Promise<string> {
const res = await fetch(`${API_BASE}/sprints/${sprintId}/report`, {
headers: getAuthHeaders(),
});
if (!res.ok) throw new Error("Erreur génération rapport");
return res.text();
}
 
export async function generateProjectReport(projectId: string): Promise<string> {
const res = await fetch(`${API_BASE}/projects/${projectId}/report`, {
headers: getAuthHeaders(),
});
if (!res.ok) throw new Error("Erreur génération rapport");
return res.text();
}
 
