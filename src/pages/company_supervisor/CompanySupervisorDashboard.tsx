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
import { compSupervisorNavData } from "@/config/navigation";
import {
mockProject,
mockValidations,
mockTasks,
mockDashboardStats,
mockReportVersions,
} from "@/data/mockData";
import { ValidationBadge, ProgressBar, TaskStatusBadge } from "@/components/shared/Badges";
import { Button } from "@/components/ui/button";
import {
CheckCircle2,
XCircle,
FolderKanban,
ShieldCheck,
FileText,
Users,
Clock,
Download,
} from "lucide-react";
 
const routeLabels: Record<string, string> = {
"/com/dashboard": "Vue d'ensemble",
"/com/projects": "Projets",
"/com/validations": "Validations",
"/com/reports": "Rapports",
};
 
function CompOverview() {
const [validations, setValidations] = useState(mockValidations);
const pending = validations.filter((v) => v.status === "pending");
 
const handleValidate = (id: string, action: "approved" | "rejected") => {
setValidations((prev) =>
prev.map((v) => (v.id === id ? { ...v, status: action } : v))
);
};
 
const doneTasks = mockTasks.filter((t) => t.status === "Done");
const inProgressTasks = mockTasks.filter((t) => t.status === "InProgress");
const standbyTasks = mockTasks.filter((t) => t.status === "Standby");
 
return (
<div className="space-y-6">
{/* Stats */}
<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
{[
{
label: "À valider",
value: pending.length,
icon: ShieldCheck,
color: "bg-amber-50 text-amber-600",
},
{
label: "Tâches Done",
value: doneTasks.length,
icon: CheckCircle2,
color: "bg-emerald-50 text-emerald-600",
},
{
label: "En cours",
value: inProgressTasks.length,
icon: Clock,

color: "bg-blue-50 text-blue-600",
},
{
label: "Versions rapport",
value: mockReportVersions.length,
icon: FileText,
color: "bg-violet-50 text-violet-600",
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
 
{/* Project + progress */}
<div className="rounded-xl border bg-card p-5">
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
<h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
<ShieldCheck className="size-4 text-amber-500" />
Tâches à valider ({pending.length})
</h3>
<div className="space-y-3">
{pending.map((val) => (
<div key={val.id} className="rounded-lg border p-3">
<div className="flex items-start justify-between gap-2 mb-2">
<p className="text-sm font-medium">{val.taskTitle}</p>
<ValidationBadge status={val.status} />
</div>
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
 
{/* Tasks overview */}
<div className="rounded-xl border bg-card p-5">
<h3 className="font-semibold text-sm mb-4">Suivi des tâches</h3>

<div className="space-y-2">
{mockTasks.slice(0, 6).map((task) => (
<div
key={task.id}
className="flex items-center justify-between gap-3 rounded-lg border p-2.5"
>
<p className="text-sm truncate flex-1">{task.title}</p>
<TaskStatusBadge status={task.status} />
</div>
))}
</div>
</div>
 
{/* Reports */}
<div className="rounded-xl border bg-card p-5">
<h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
<FileText className="size-4 text-muted-foreground" />
Historique des rapports
</h3>
<div className="space-y-3">
{[...mockReportVersions].reverse().map((rep) => (
<div
key={rep.id}
className="flex items-center justify-between gap-3 rounded-lg border p-3"
>
<div className="min-w-0">
<p className="text-sm font-medium truncate">{rep.fileName}</p>
<p className="text-xs text-muted-foreground">
{rep.version} ·{" "}
{new Date(rep.uploadedAt).toLocaleDateString("fr-FR")} ·{" "}
{rep.fileSize}
</p>
</div>
<Button variant="outline" size="sm" className="shrink-0">
<Download className="size-3 mr-1" />
Voir
</Button>
</div>
))}
</div>
</div>
</div>
);
}
 
export default function CompanySupervisorDashboard() {
const location = useLocation();
const currentLabel = routeLabels[location.pathname] ?? "Dashboard";
const isRoot = location.pathname === "/com/dashboard";
 
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
data={compSupervisorNavData}
userInfo={{
name: user.name ?? "Nada Bouhadida",
role: "Encadrant entreprise",
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
<Link to="/com/dashboard">PFE Tracker</Link>
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
{isRoot ? <CompOverview /> : <Outlet />}
</div>
</SidebarInset>
</SidebarProvider>
);
}
 
