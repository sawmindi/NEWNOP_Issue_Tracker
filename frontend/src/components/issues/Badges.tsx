import React from "react";
import { Circle, Clock, CheckCircle2, XCircle } from "lucide-react";
import type { IssueStatus, IssuePriority, IssueSeverity } from "../../types";

// Status Badge
const statusConfig: Record<
  IssueStatus,
  { color: string; icon: React.ReactNode; label: string }
> = {
  Open: {
    color: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    icon: <Circle size={10} className="fill-current" />,
    label: "Open",
  },
  "In Progress": {
    color: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    icon: <Clock size={10} />,
    label: "In Progress",
  },
  Resolved: {
    color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    icon: <CheckCircle2 size={10} />,
    label: "Resolved",
  },
  Closed: {
    color: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
    icon: <XCircle size={10} />,
    label: "Closed",
  },
};

interface StatusBadgeProps {
  status: IssueStatus;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  const { color, icon, label } = statusConfig[status];
  return (
    <span
      className={`badge ${color} ${size === "sm" ? "!text-[10px] !px-1.5" : ""}`}
    >
      {icon}
      {label}
    </span>
  );
};

// Priority Badge
const priorityConfig: Record<
  IssuePriority,
  { color: string; dot: string; label: string }
> = {
  Low: {
    color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    dot: "bg-emerald-400",
    label: "Low",
  },
  Medium: {
    color: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    dot: "bg-blue-400",
    label: "Medium",
  },
  High: {
    color: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    dot: "bg-amber-400",
    label: "High",
  },
  Critical: {
    color: "bg-red-500/10 text-red-400 border border-red-500/20",
    dot: "bg-red-400",
    label: "Critical",
  },
};

interface PriorityBadgeProps {
  priority: IssuePriority;
  size?: "sm" | "md";
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = "md",
}) => {
  const { color, dot, label } = priorityConfig[priority];
  return (
    <span
      className={`badge ${color} ${size === "sm" ? "!text-[10px] !px-1.5" : ""}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
};

// Severity Badge
const severityConfig: Record<
  IssueSeverity,
  { color: string; label: string }
> = {
  Minor: { color: "bg-slate-500/10 text-slate-400 border border-slate-500/20", label: "Minor" },
  Major: { color: "bg-orange-500/10 text-orange-400 border border-orange-500/20", label: "Major" },
  Critical: { color: "bg-red-500/10 text-red-400 border border-red-500/20", label: "Critical" },
  Blocker: { color: "bg-purple-500/10 text-purple-400 border border-purple-500/20", label: "Blocker" },
};

export const SeverityBadge: React.FC<{ severity: IssueSeverity }> = ({
  severity,
}) => {
  const { color, label } = severityConfig[severity];
  return <span className={`badge ${color}`}>{label}</span>;
};
