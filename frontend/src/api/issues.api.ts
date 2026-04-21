import api from "./axios";
import type {
  Issue,
  IssueFilters,
  IssueFormData,
  IssuesResponse,
  IssueStatus,
} from "../types";

export const issuesApi = {
  getAll: async (filters: IssueFilters = {}): Promise<IssuesResponse> => {
    // Strip empty strings so they don't pollute query params
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== "" && v !== undefined)
    );
    const res = await api.get<IssuesResponse>("/issues", { params });
    return res.data;
  },

  getOne: async (id: string): Promise<{ success: boolean; data: Issue }> => {
    const res = await api.get(`/issues/${id}`);
    return res.data;
  },

  create: async (
    data: IssueFormData
  ): Promise<{ success: boolean; data: Issue }> => {
    const res = await api.post("/issues", data);
    return res.data;
  },

  update: async (
    id: string,
    data: Partial<IssueFormData>
  ): Promise<{ success: boolean; data: Issue }> => {
    const res = await api.put(`/issues/${id}`, data);
    return res.data;
  },

  updateStatus: async (
    id: string,
    status: IssueStatus
  ): Promise<{ success: boolean; data: Issue }> => {
    const res = await api.patch(`/issues/${id}/status`, { status });
    return res.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/issues/${id}`);
    return res.data;
  },

  exportUrl: (format: "csv" | "json", filters: Partial<IssueFilters> = {}) => {
    const params = new URLSearchParams({ format, ...filters as Record<string, string> });
    return `/api/issues/export?${params.toString()}`;
  },
};
