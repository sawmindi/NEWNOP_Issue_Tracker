import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import type { Issue, IssueFormData } from "../../types";

interface IssueFormProps {
  initialData?: Partial<Issue>;
  onSubmit: (data: IssueFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
  </div>
);

const Select = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="input-base"
  >
    {options.map((o) => (
      <option key={o} value={o}>
        {o}
      </option>
    ))}
  </select>
);

const PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
const SEVERITIES = ["Minor", "Major", "Critical", "Blocker"] as const;
const STATUSES = ["Open", "In Progress", "Resolved", "Closed"] as const;

export const IssueForm: React.FC<IssueFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [form, setForm] = useState<IssueFormData>({
    title: "",
    description: "",
    priority: "Medium",
    severity: "Minor",
    status: "Open",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title ?? "",
        description: initialData.description ?? "",
        priority: initialData.priority ?? "Medium",
        severity: initialData.severity ?? "Minor",
        status: initialData.status ?? "Open",
        tags: initialData.tags ?? [],
      });
    }
  }, [initialData]);

  const set = (key: keyof IssueFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !(form.tags ?? []).includes(tag)) {
        set("tags", [...(form.tags ?? []), tag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    set("tags", (form.tags ?? []).filter((t) => t !== tag));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (form.title.length > 200) errs.title = "Title must be under 200 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Title *" error={errors.title}>
        <input
          className="input-base"
          placeholder="Brief summary of the issue…"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
        />
      </Field>

      <Field label="Description">
        <textarea
          className="input-base resize-none"
          rows={4}
          placeholder="Detailed description, steps to reproduce, expected behavior…"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Status">
          <Select value={form.status!} onChange={(v) => set("status", v)} options={STATUSES} />
        </Field>
        <Field label="Priority">
          <Select value={form.priority!} onChange={(v) => set("priority", v)} options={PRIORITIES} />
        </Field>
        <Field label="Severity">
          <Select value={form.severity!} onChange={(v) => set("severity", v)} options={SEVERITIES} />
        </Field>
      </div>

      <Field label="Tags">
        <div className="input-base !h-auto flex flex-wrap gap-1.5 min-h-[42px]">
          {(form.tags ?? []).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent-muted text-accent rounded text-xs font-mono"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-white ml-0.5 text-accent/70"
              >
                ×
              </button>
            </span>
          ))}
          <input
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-slate-200 placeholder-slate-500"
            placeholder="Add tag, press Enter…"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
          />
        </div>
        <p className="text-xs text-slate-600 mt-1">Press Enter or comma to add a tag</p>
      </Field>

      <div className="flex justify-end gap-3 pt-2 border-t border-bg-border">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initialData?._id ? "Save Changes" : "Create Issue"}
        </Button>
      </div>
    </form>
  );
};