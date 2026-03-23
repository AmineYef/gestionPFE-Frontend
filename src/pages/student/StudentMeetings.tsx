import { useState } from "react";
import { mockMeetings } from "@/data/mockData";
import type { Meeting } from "@/types";
import { MeetingStatusBadge } from "@/components/shared/Badges";
import { Button } from "@/components/ui/button";
import {
CalendarDays,
Plus,
CheckCircle2,
XCircle,
Clock,
AlignLeft,
FileText,
ChevronDown,
ChevronRight,
} from "lucide-react";
 
function MeetingCard({ meeting }: { meeting: Meeting }) {
const [expanded, setExpanded] = useState(false);
 
return (
<div className="rounded-xl border bg-card overflow-hidden">
<button
className="w-full flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
onClick={() => setExpanded((v) => !v)}
>
<div className="mt-0.5 shrink-0">
{meeting.status === "completed" ? (
<CheckCircle2 className="size-4 text-emerald-500" />
) : meeting.status === "cancelled" ? (
<XCircle className="size-4 text-red-500" />
) : (
<Clock className="size-4 text-blue-500" />
)}
</div>
<div className="flex-1 min-w-0">
<div className="flex items-center gap-2 flex-wrap mb-1">
<span className="font-semibold text-sm">{meeting.title}</span>
<MeetingStatusBadge status={meeting.status} />
{meeting.isValidatedByUni && (
<span className="inline-flex items-center gap-1 rounded-full border bg-emerald-50 border-emerald-200 text-emerald-700 px-2 py-0.5 text-xs font-medium">
<CheckCircle2 className="size-3" />
Validée
</span>
)}
</div>
<p className="text-xs text-muted-foreground">
<CalendarDays className="inline size-3 mr-1" />
{new Date(meeting.scheduledDate).toLocaleDateString("fr-FR", {
weekday: "long",
day: "numeric",
month: "long",
year: "numeric",
hour: "2-digit",
minute: "2-digit",
})}
</p>
</div>
{expanded ? (
<ChevronDown className="size-4 text-muted-foreground shrink-0 mt-0.5" />
) : (
<ChevronRight className="size-4 text-muted-foreground shrink-0 mt-0.5" />
)}
</button>
 
{expanded && (
<div className="border-t px-4 pb-4 pt-3 space-y-4">
{/* Agenda */}
<div>
<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
<AlignLeft className="size-3" />
Ordre du jour
</p>
<pre className="text-sm whitespace-pre-wrap font-sans bg-muted/50 rounded-lg p-3">
{meeting.agenda}
</pre>
</div>
 
{/* Minutes */}
{meeting.minutesContent && (

<div>
<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
<FileText className="size-3" />
Compte rendu
</p>
<div className="text-sm bg-muted/50 rounded-lg p-3 space-y-1">
{meeting.minutesContent}
</div>
</div>
)}
 
{/* Actions */}
{meeting.status === "planned" && (
<div className="flex gap-2">
<Button size="sm">
<FileText className="size-3 mr-1" />
Ajouter compte rendu
</Button>
<Button size="sm" variant="outline">
Modifier
</Button>
</div>
)}
 
{meeting.status === "completed" && !meeting.isValidatedByUni && (
<p className="text-xs text-amber-600 flex items-center gap-1">
<Clock className="size-3" />
En attente de validation par l'encadrant universitaire
</p>
)}
</div>
)}
</div>
);
}
 
export default function StudentMeetings() {
const planned = mockMeetings.filter((m) => m.status === "planned");
const completed = mockMeetings.filter((m) => m.status === "completed");
 
return (
<div className="space-y-6">
<div className="flex items-center justify-between">
<div>
<h2 className="text-lg font-semibold">Réunions</h2>
<p className="text-sm text-muted-foreground">
{planned.length} planifiée(s) · {completed.length} complétée(s)
</p>
</div>
<Button size="sm">
<Plus className="size-4 mr-1" />
Planifier
</Button>
</div>
 
{/* Planned */}
{planned.length > 0 && (
<div>
<h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
<Clock className="size-4 text-blue-500" />
À venir ({planned.length})
</h3>
<div className="space-y-3">
{planned.map((m) => (
<MeetingCard key={m.id} meeting={m} />
))}
</div>
</div>
)}
 
{/* Completed */}
{completed.length > 0 && (
<div>
<h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
<CheckCircle2 className="size-4 text-emerald-500" />
Passées ({completed.length})
</h3>
<div className="space-y-3">
{completed.map((m) => (
<MeetingCard key={m.id} meeting={m} />

))}
</div>
</div>
)}
</div>
);
}
 
