import type { Issue } from "../types";

// Client-side CSV export
export function exportToCSV(issues: Issue[], filename = "issues-export.csv") {
  const headers = [
    "ID",
    "Title",
    "Status",
    "Priority",
    "Severity",
    "Reporter",
    "Assignee",
    "Tags",
    "Created At",
    "Resolved At",
  ];

  const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;

  const rows = issues.map((i) =>
    [
      i._id,
      escape(i.title),
      i.status,
      i.priority,
      i.severity,
      escape(i.reporter?.name ?? ""),
      escape(i.assignee?.name ?? ""),
      escape((i.tags ?? []).join("; ")),
      i.createdAt,
      i.resolvedAt ?? "",
    ].join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  downloadBlob(csv, filename, "text/csv");
}

// Client-side JSON export
export function exportToJSON(issues: Issue[], filename = "issues-export.json") {
  const json = JSON.stringify(issues, null, 2);
  downloadBlob(json, filename, "application/json");
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
