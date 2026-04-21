import React, { useEffect, useState } from "react";
import { Plus, Download } from "lucide-react";
import toast from "react-hot-toast";
import { useIssueStore } from "../store/issueStore";
import { IssueTable } from "../components/issues/IssueTable";
import { IssueFiltersBar } from "../components/issues/IssueFilters";
import { IssueForm } from "../components/issues/IssueForm";
import { Modal } from "../components/ui/Modal";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Pagination } from "../components/ui/Pagination";
import { Button } from "../components/ui/Button";
// import { StatusBadge } from "../components/issues/Badges";
import { exportToCSV, exportToJSON } from "../utils/export";
import type { Issue, IssueFormData } from "../types";

const statCards = [
  { key: "Open", color: "border-blue-500/30 bg-blue-500/5", dot: "bg-blue-400" },
  { key: "In Progress", color: "border-amber-500/30 bg-amber-500/5", dot: "bg-amber-400" },
  { key: "Resolved", color: "border-emerald-500/30 bg-emerald-500/5", dot: "bg-emerald-400" },
  { key: "Closed", color: "border-slate-500/30 bg-slate-500/5", dot: "bg-slate-400" },
] as const;

export const Dashboard: React.FC = () => {
  const {
    issues, pagination, statusCounts, filters, isLoading, isSubmitting,
    fetchIssues, createIssue, updateIssue, deleteIssue, setFilters, resetFilters,
  } = useIssueStore();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [deletingIssue, setDeletingIssue] = useState<Issue | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initial load
  useEffect(() => {
    fetchIssues(filters);
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    fetchIssues(filters);
  }, [filters]);

  const handleCreate = async (data: IssueFormData) => {
    try {
      await createIssue(data as Partial<Issue>);
      setCreateOpen(false);
      toast.success("Issue created!");
      fetchIssues(filters);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create issue";
      toast.error(msg);
    }
  };

  const handleEdit = async (data: IssueFormData) => {
    if (!editingIssue) return;
    try {
      await updateIssue(editingIssue._id, data as Partial<Issue>);
      setEditingIssue(null);
      toast.success("Issue updated!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update issue";
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    if (!deletingIssue) return;
    setIsDeleting(true);
    try {
      await deleteIssue(deletingIssue._id);
      setDeletingIssue(null);
      toast.success("Issue deleted");
    } catch {
      toast.error("Failed to delete issue");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = (format: "csv" | "json") => {
    if (!issues.length) return toast.error("No issues to export");
    if (format === "csv") exportToCSV(issues);
    else exportToJSON(issues);
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6 page-enter max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track, manage, and resolve your team's issues
          </p>
        </div>
        <Button icon={<Plus size={15} />} onClick={() => setCreateOpen(true)}>
          New Issue
        </Button>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map(({ key, color, dot }) => (
          <button
            key={key}
            onClick={() => setFilters({ status: key === filters.status ? "" : (key as Issue["status"]) })}
            className={`glass-card border ${color} p-4 text-left hover:opacity-90 transition-all duration-150 ${
              filters.status === key ? "ring-1 ring-accent" : ""
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${dot}`} />
              <span className="text-xs text-slate-400 font-mono">{key}</span>
            </div>
            <p className="text-2xl font-semibold text-slate-100 font-mono">
              {statusCounts[key as keyof typeof statusCounts] ?? 0}
            </p>
          </button>
        ))}
      </div>

      {/* Issue list */}
      <div className="glass-card">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-bg-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">
              Issues
              {pagination.total > 0 && (
                <span className="ml-2 text-xs text-slate-500 font-mono">({pagination.total})</span>
              )}
            </span>
            <div className="flex items-center gap-2">
              <div className="relative group">
                <Button variant="outline" size="sm" icon={<Download size={13} />}>
                  Export
                </Button>
                <div className="absolute right-0 top-full mt-1 w-32 bg-bg-elevated border border-bg-border rounded-lg shadow-xl z-10 hidden group-hover:block animate-fade-in">
                  <button
                    onClick={() => handleExport("csv")}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-bg-border rounded-t-lg transition-colors"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => handleExport("json")}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-bg-border rounded-b-lg transition-colors"
                  >
                    Export JSON
                  </button>
                </div>
              </div>
            </div>
          </div>

          <IssueFiltersBar
            filters={filters}
            onFilterChange={setFilters}
            onReset={resetFilters}
          />
        </div>

        {/* Table */}
        <div className="px-5 py-4">
          <IssueTable
            issues={issues}
            onEdit={setEditingIssue}
            onDelete={setDeletingIssue}
            isLoading={isLoading}
          />
          <Pagination
            pagination={pagination}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </div>
      </div>

      {/* Create modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create Issue" size="lg">
        <IssueForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} isSubmitting={isSubmitting} />
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={!!editingIssue} onClose={() => setEditingIssue(null)} title="Edit Issue" size="lg">
        {editingIssue && (
          <IssueForm
            initialData={editingIssue}
            onSubmit={handleEdit}
            onCancel={() => setEditingIssue(null)}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deletingIssue}
        onClose={() => setDeletingIssue(null)}
        onConfirm={handleDelete}
        title="Delete issue?"
        message={`"${deletingIssue?.title}" will be permanently removed. This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};
