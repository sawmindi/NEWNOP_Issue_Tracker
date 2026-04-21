import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Pencil, MoreHorizontal } from "lucide-react";
import type { Issue } from "../../types";
import { StatusBadge, PriorityBadge } from "./Badges";

interface IssueTableProps {
  issues: Issue[];
  onEdit: (issue: Issue) => void;
  onDelete: (issue: Issue) => void;
  isLoading?: boolean;
}

export const IssueTable: React.FC<IssueTableProps> = ({
  issues,
  onEdit,
  onDelete,
  isLoading,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 skeleton rounded-lg" />
        ))}
      </div>
    );
  }

  if (!issues.length) {
    return (
      <div className="text-center py-16 text-slate-500">
        <MoreHorizontal size={32} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">No issues found.</p>
        <p className="text-xs mt-1 text-slate-600">
          Try adjusting your filters or create a new issue.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-bg-border">
            <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-4 w-12 font-mono">#</th>
            <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 pr-4">Title</th>
            <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 pr-4 hidden md:table-cell">Status</th>
            <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 pr-4 hidden lg:table-cell">Priority</th>
            <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 pr-4 hidden xl:table-cell">Reporter</th>
            <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 pr-4 hidden xl:table-cell">Created</th>
            <th className="w-20" />
          </tr>
        </thead>
        <tbody>
          {issues.map((issue, idx) => (
            <tr
              key={issue._id}
              className="table-row"
              onClick={() => navigate(`/issues/${issue._id}`)}
            >
              <td className="py-3 px-4 text-slate-600 font-mono text-xs">
                {String(idx + 1).padStart(3, "0")}
              </td>
              <td className="py-3 pr-4">
                <div className="font-medium text-slate-200 truncate max-w-[280px]">
                  {issue.title}
                </div>
                {issue.tags?.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {issue.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 bg-accent-muted text-accent rounded text-[10px] font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </td>
              <td className="py-3 pr-4 hidden md:table-cell">
                <StatusBadge status={issue.status} />
              </td>
              <td className="py-3 pr-4 hidden lg:table-cell">
                <PriorityBadge priority={issue.priority} />
              </td>
              <td className="py-3 pr-4 hidden xl:table-cell">
                <div className="flex items-center gap-2">
                  <img
                    src={issue.reporter?.avatar}
                    alt={issue.reporter?.name}
                    className="w-5 h-5 rounded-full bg-bg-border"
                  />
                  <span className="text-slate-400 text-xs">{issue.reporter?.name}</span>
                </div>
              </td>
              <td className="py-3 pr-4 hidden xl:table-cell text-slate-500 text-xs font-mono">
                {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
              </td>
              <td className="py-3 px-2">
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onEdit(issue)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => onDelete(issue)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
