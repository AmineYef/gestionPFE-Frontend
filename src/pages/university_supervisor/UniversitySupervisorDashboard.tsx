import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import {
Breadcrumb,
BreadcrumbItem,
BreadcrumbLink,
BreadcrumbList,
BreadcrumbPage,
BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
SidebarInset,
SidebarProvider,
SidebarTrigger,
} from "@/components/ui/sidebar";
import { uniSupervisorNavData } from "@/config/navigation";
import {
mockProject,
mockValidations,
mockTasks,
mockMeetings,
mockDashboardStats,
} from "@/data/mockData";
import { ValidationBadge, ProgressBar, MeetingStatusBadge } from "@/components/shared/Badges";
import { Button } from "@/components/ui/button";
import {
CheckCircle2,
XCircle,
FolderKanban,
ShieldCheck,
CalendarDays,
FileText,
ArrowRight,
Users,
Clock,
} from "lucide-react";
 
const routeLabels: Record<string, string> = {
"/uni/dashboard": "Vue d'ensemble",
"/uni/projects": "Projets",
"/uni/validations": "Validations",
"/uni/meetings": "Réunions",
"/uni/reports": "Rapports",
};
 
function UniOverview() {
const [validations, setValidations] = useState(mockValidations);
const pending = validations.filter((v) => v.status === "pending");
 
const handleValidate = (id: string, action: "approved" | "rejected") => {
setValidations((prev) =>
prev.map((v) => (v.id === id ? { ...v, status: action } : v))
);
};
 
return (
<div className="space-y-6">
{/* Stats */}
<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
{[
{
label: "Projets suivis",
value: 1,
icon: FolderKanban,
color: "bg-blue-50 text-blue-600",
},
{
label: "Validations en attente",
value: pending.length,
icon: ShieldCheck,
color: "bg-amber-50 text-amber-600",
},
{
label: "Réunions à valider",
value: mockMeetings.filter(
(m) => m.status === "completed" && !m.isValidatedByUni
).length,
icon: CalendarDays,

color: "bg-orange-50 text-orange-600",
},
{
label: "Tâches Done",
value: mockTasks.filter((t) => t.status === "Done").length,
icon: CheckCircle2,
color: "bg-emerald-50 text-emerald-600",
},
].map((s) => (
<div key={s.label} className="rounded-xl border bg-card p-4 flex items-start gap-3">
<div className={`rounded-lg p-2 ${s.color}`}>
<s.icon className="size-4" />
</div>
<div>
<p className="text-xl font-bold tabular-nums">{s.value}</p>
<p className="text-xs text-muted-foreground">{s.label}</p>
</div>
</div>
))}
</div>
 
{/* Project overview */}
<div className="rounded-xl border bg-card p-5">
<div className="flex items-center justify-between mb-4">
<h3 className="font-semibold text-sm">Projet suivi</h3>
</div>
<div className="flex items-start justify-between gap-4 mb-3">
<div>
<p className="font-medium">{mockProject.title}</p>
<p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
<Users className="size-3" />
{mockProject.studentName}
</p>
</div>
<span className="shrink-0 text-xs rounded-full border bg-emerald-50 border-emerald-200 text-emerald-700 px-2.5 py-0.5 font-medium">
Actif
</span>
</div>
<ProgressBar value={mockDashboardStats.progressPercent} size="md" />
</div>
 
{/* Pending validations */}
{pending.length > 0 && (
<div className="rounded-xl border bg-card p-5">
<div className="flex items-center justify-between mb-4">
<h3 className="font-semibold text-sm flex items-center gap-2">
<ShieldCheck className="size-4 text-amber-500" />
Tâches à valider ({pending.length})
</h3>
</div>
<div className="space-y-3">
{pending.map((val) => (
<div key={val.id} className="rounded-lg border p-3">
<div className="flex items-start justify-between gap-2 mb-2">
<p className="text-sm font-medium">{val.taskTitle}</p>
<ValidationBadge status={val.status} />
</div>
<p className="text-xs text-muted-foreground mb-3">
{new Date(val.createdAt).toLocaleDateString("fr-FR")}
</p>
<div className="flex gap-2">
<Button
size="sm"
className="bg-emerald-600 hover:bg-emerald-700 text-white"
onClick={() => handleValidate(val.id, "approved")}
>
<CheckCircle2 className="size-3 mr-1" />
Approuver
</Button>
<Button
size="sm"
variant="outline"
className="border-red-200 text-red-600 hover:bg-red-50"
onClick={() => handleValidate(val.id, "rejected")}
>
<XCircle className="size-3 mr-1" />
Rejeter
</Button>
</div>
</div>

))}
</div>
</div>
)}
 
{/* Meetings to validate */}
<div className="rounded-xl border bg-card p-5">
<h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
<CalendarDays className="size-4 text-muted-foreground" />
Réunions
</h3>
<div className="space-y-3">
{mockMeetings.map((m) => (
<div
key={m.id}
className="flex items-center justify-between gap-3 rounded-lg border p-3"
>
<div className="min-w-0">
<p className="text-sm font-medium truncate">{m.title}</p>
<p className="text-xs text-muted-foreground">
{new Date(m.scheduledDate).toLocaleDateString("fr-FR")}
</p>
</div>
<div className="flex items-center gap-2 shrink-0">
<MeetingStatusBadge status={m.status} />
{m.status === "completed" && !m.isValidatedByUni && (
<Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
Valider CR
</Button>
)}
{m.isValidatedByUni && (
<span className="text-xs text-emerald-600 flex items-center gap-1">
<CheckCircle2 className="size-3" />
Validé
</span>
)}
</div>
</div>
))}
</div>
</div>
</div>
);
}
 
export default function UniversitySupervisorDashboard() {
const location = useLocation();
const currentLabel = routeLabels[location.pathname] ?? "Dashboard";
const isRoot = location.pathname === "/uni/dashboard";
 
const user = (() => {
try {
return JSON.parse(localStorage.getItem("user") ?? "{}");
} catch {
return {};
}
})();
 
return (
<SidebarProvider>
<AppSidebar
data={uniSupervisorNavData}
userInfo={{
name: user.name ?? "Dr. Fourat Khelifi",
role: "Encadrant universitaire",
}}
/>
<SidebarInset>
<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
<SidebarTrigger className="-ml-1" />
<Separator orientation="vertical" className="mr-2 h-4" />
<Breadcrumb>
<BreadcrumbList>
<BreadcrumbItem className="hidden md:block">
<BreadcrumbLink asChild>
<Link to="/uni/dashboard">PFE Tracker</Link>
</BreadcrumbLink>
</BreadcrumbItem>
<BreadcrumbSeparator className="hidden md:block" />
<BreadcrumbItem>

<BreadcrumbPage>{currentLabel}</BreadcrumbPage>
</BreadcrumbItem>
</BreadcrumbList>
</Breadcrumb>
</header>
<div className="flex flex-1 flex-col gap-4 p-4 md:p-6 max-w-6xl">
{isRoot ? <UniOverview /> : <Outlet />}
</div>
</SidebarInset>
</SidebarProvider>
);
}
 
