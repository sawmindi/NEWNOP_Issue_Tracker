import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow, format } from "date-fns";
import {
  ArrowLeft, Pencil, Trash2, CheckCircle2, XCircle,
  Clock, Calendar, User, Tag, AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useIssueStore } from "../store/issueStore";
import { useAuthStore } from "../store/authStore";
import { IssueForm } from "../components/issues/IssueForm";
import { Modal } from "../components/ui/Modal";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Button } from "../components/ui/Button";
import { StatusBadge, PriorityBadge, SeverityBadge } from "../components/issues/Badges";
import type { Issue, IssueFormData, IssueStatus } from "../types";

const statusTransitions: Record<IssueStatus, { label: string; next: IssueStatus; icon: React.ReactNode; color: string }[]> = {
  Open: [
    { label: "Start Progress", next: "In Progress", icon: <Clock size={13} />, color: "text-amber-400 hover:bg-amber-500/10 border-amber-500/20" },
    { label: "Resolve", next: "Resolved", icon: <CheckCircle2 size={13} />, color: "text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20" },
  ],
  "In Progress": [
    { label: "Resolve", next: "Resolved", icon: <CheckCircle2 size={13} />, color: "text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20" },
    { label: "Reopen", next: "Open", icon: <AlertTriangle size={13} />, color: "text-blue-400 hover:bg-blue-500/10 border-blue-500/20" },
  ],
  Resolved: [
    { label: "Close", next: "Closed", icon: <XCircle size={13} />, color: "text-slate-400 hover:bg-slate-500/10 border-slate-500/20" },
    { label: "Reopen", next: "Open", icon: <AlertTriangle size={13} />, color: "text-blue-400 hover:bg-blue-500/10 border-blue-500/20" },
  ],
  Closed: [
    { label: "Reopen", next: "Open", icon: <AlertTriangle size={13} />, color: "text-blue-400 hover:bg-blue-500/10 border-blue-500/20" },
  ],
};

export const IssueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    currentIssue, isLoading, isSubmitting,
    fetchIssue, updateIssue, deleteIssue, updateStatus,
  } = useIssueStore();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusConfirm, setStatusConfirm] = useState<{ label: string; next: IssueStatus } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);

  useEffect(() => {
    if (id) fetchIssue(id);
  }, [id]);

  const handleEdit = async (data: IssueFormData) => {
    if (!currentIssue) return;
    try {
      await updateIssue(currentIssue._id, data as Partial<Issue>);
      setEditOpen(false);
      toast.success("Issue updated!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDelete = async () => {
    if (!currentIssue) return;
    setIsDeleting(true);
    try {
      await deleteIssue(currentIssue._id);
      toast.success("Issue deleted");
      navigate("/dashboard");
    } catch {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async () => {
    if (!currentIssue || !statusConfirm) return;
    setIsStatusUpdating(true);
    try {
      await updateStatus(currentIssue._id, statusConfirm.next);
      toast.success(`Status updated to "${statusConfirm.next}"`);
    } catch {
      toast.error("Status update failed");
    } finally {
      setIsStatusUpdating(false);
      setStatusConfirm(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 page-enter">
        <div className="h-8 skeleton w-32 rounded" />
        <div className="h-48 skeleton rounded-xl" />
        <div className="h-64 skeleton rounded-xl" />
      </div>
    );
  }

  if (!currentIssue) {
    return (
      <div className="max-w-4xl mx-auto text-center py-24">
        <AlertTriangle size={32} className="mx-auto mb-3 text-slate-600" />
        <p className="text-slate-400">Issue not found.</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const transitions = statusTransitions[currentIssue.status] ?? [];
  const isOwner = currentIssue.reporter?._id === user?._id;

  return (
    <div className="max-w-4xl mx-auto space-y-5 page-enter">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm transition-colors group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>
        {isOwner && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" icon={<Pencil size={13} />} onClick={() => setEditOpen(true)}>
              Edit
            </Button>
            <Button variant="danger" size="sm" icon={<Trash2 size={13} />} onClick={() => setDeleteOpen(true)}>
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Main card */}
      <div className="glass-card p-6 space-y-5">
        {/* Title + badges */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <StatusBadge status={currentIssue.status} />
            <PriorityBadge priority={currentIssue.priority} />
            <SeverityBadge severity={currentIssue.severity} />
          </div>
          <h1 className="text-xl font-semibold text-slate-100 leading-snug">
            {currentIssue.title}
          </h1>
        </div>

        {/* Status transition actions */}
        {transitions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {transitions.map((t) => (
              <button
                key={t.next}
                onClick={() => setStatusConfirm({ label: t.label, next: t.next })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${t.color}`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Description */}
        {currentIssue.description ? (
          <div className="pt-2 border-t border-bg-border">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {currentIssue.description}
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-600 italic pt-2 border-t border-bg-border">
            No description provided.
          </p>
        )}

        {/* Tags */}
        {currentIssue.tags?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={13} className="text-slate-500" />
            {currentIssue.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-accent-muted text-accent rounded text-xs font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Meta card */}
      <div className="glass-card p-5">
        <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetaRow
            icon={<User size={13} />}
            label="Reporter"
            value={
              <div className="flex items-center gap-2">
                <img
                  src={currentIssue.reporter?.avatar}
                  alt={currentIssue.reporter?.name}
                  className="w-5 h-5 rounded-full bg-bg-border"
                />
                <span>{currentIssue.reporter?.name}</span>
              </div>
            }
          />
          {currentIssue.assignee && (
            <MetaRow
              icon={<User size={13} />}
              label="Assignee"
              value={
                <div className="flex items-center gap-2">
                  <img
                    src={currentIssue.assignee.avatar}
                    alt={currentIssue.assignee.name}
                    className="w-5 h-5 rounded-full bg-bg-border"
                  />
                  <span>{currentIssue.assignee.name}</span>
                </div>
              }
            />
          )}
          <MetaRow
            icon={<Calendar size={13} />}
            label="Created"
            value={`${format(new Date(currentIssue.createdAt), "MMM d, yyyy")} (${formatDistanceToNow(new Date(currentIssue.createdAt), { addSuffix: true })})`}
          />
          <MetaRow
            icon={<Clock size={13} />}
            label="Last updated"
            value={formatDistanceToNow(new Date(currentIssue.updatedAt), { addSuffix: true })}
          />
          {currentIssue.resolvedAt && (
            <MetaRow
              icon={<CheckCircle2 size={13} />}
              label="Resolved"
              value={format(new Date(currentIssue.resolvedAt), "MMM d, yyyy · HH:mm")}
            />
          )}
          {currentIssue.closedAt && (
            <MetaRow
              icon={<XCircle size={13} />}
              label="Closed"
              value={format(new Date(currentIssue.closedAt), "MMM d, yyyy · HH:mm")}
            />
          )}
        </div>
      </div>

      {/* Edit modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Issue" size="lg">
        <IssueForm
          initialData={currentIssue}
          onSubmit={handleEdit}
          onCancel={() => setEditOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete this issue?"
        message={`"${currentIssue.title}" will be permanently removed.`}
        confirmLabel="Delete Issue"
        isLoading={isDeleting}
      />

      {/* Status change confirm */}
      <ConfirmDialog
        isOpen={!!statusConfirm}
        onClose={() => setStatusConfirm(null)}
        onConfirm={handleStatusChange}
        title={`${statusConfirm?.label}?`}
        message={`This will change the status to "${statusConfirm?.next}".`}
        confirmLabel={statusConfirm?.label ?? "Confirm"}
        variant="warning"
        isLoading={isStatusUpdating}
      />
    </div>
  );
};

const MetaRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-2.5">
    <span className="text-slate-500 mt-0.5">{icon}</span>
    <div>
      <p className="text-[10px] text-slate-600 uppercase tracking-wider font-mono mb-0.5">{label}</p>
      <div className="text-sm text-slate-300">{value}</div>
    </div>
  </div>
);
