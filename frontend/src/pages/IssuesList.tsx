import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useIssueStore } from "../store/issueStore";
import { IssueTable } from "../components/issues/IssueTable";
import { IssueFiltersBar } from "../components/issues/IssueFilters";
import { IssueForm } from "../components/issues/IssueForm";
import { Modal } from "../components/ui/Modal";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Pagination } from "../components/ui/Pagination";
import { Button } from "../components/ui/Button";
import type { Issue, IssueFormData } from "../types";

export const IssuesList: React.FC = () => {
  const {
    issues, pagination, filters, isLoading, isSubmitting,
    fetchIssues, createIssue, updateIssue, deleteIssue, setFilters, resetFilters,
  } = useIssueStore();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [deletingIssue, setDeletingIssue] = useState<Issue | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { fetchIssues(filters); }, []);
  useEffect(() => { fetchIssues(filters); }, [filters]);

  const handleCreate = async (data: IssueFormData) => {
    try {
      await createIssue(data as Partial<Issue>);
      setCreateOpen(false);
      toast.success("Issue created!");
      fetchIssues(filters);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create issue");
    }
  };

  const handleEdit = async (data: IssueFormData) => {
    if (!editingIssue) return;
    try {
      await updateIssue(editingIssue._id, data as Partial<Issue>);
      setEditingIssue(null);
      toast.success("Issue updated!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDelete = async () => {
    if (!deletingIssue) return;
    setIsDeleting(true);
    try {
      await deleteIssue(deletingIssue._id);
      setDeletingIssue(null);
      toast.success("Issue deleted");
    } catch { toast.error("Delete failed"); }
    finally { setIsDeleting(false); }
  };

  return (
    <div className="space-y-5 page-enter max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">All Issues</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {pagination.total} issue{pagination.total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button icon={<Plus size={15} />} onClick={() => setCreateOpen(true)}>
          New Issue
        </Button>
      </div>

      <div className="glass-card">
        <div className="px-5 py-4 border-b border-bg-border">
          <IssueFiltersBar filters={filters} onFilterChange={setFilters} onReset={resetFilters} />
        </div>
        <div className="px-5 py-4">
          <IssueTable issues={issues} onEdit={setEditingIssue} onDelete={setDeletingIssue} isLoading={isLoading} />
          <Pagination pagination={pagination} onPageChange={(page) => setFilters({ ...filters, page })} />
        </div>
      </div>

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create Issue" size="lg">
        <IssueForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} isSubmitting={isSubmitting} />
      </Modal>
      <Modal isOpen={!!editingIssue} onClose={() => setEditingIssue(null)} title="Edit Issue" size="lg">
        {editingIssue && (
          <IssueForm initialData={editingIssue} onSubmit={handleEdit} onCancel={() => setEditingIssue(null)} isSubmitting={isSubmitting} />
        )}
      </Modal>
      <ConfirmDialog
        isOpen={!!deletingIssue}
        onClose={() => setDeletingIssue(null)}
        onConfirm={handleDelete}
        title="Delete issue?"
        message={`"${deletingIssue?.title}" will be permanently removed.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};
