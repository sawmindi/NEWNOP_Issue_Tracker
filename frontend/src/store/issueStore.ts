import { create } from "zustand";
import type {
  Issue,
  IssueFilters,
  Pagination,
  StatusCounts,
} from "../types";
import { issuesApi } from "../api/issues.api";

interface IssueState {
  issues: Issue[];
  currentIssue: Issue | null;
  pagination: Pagination;
  statusCounts: StatusCounts;
  filters: IssueFilters;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchIssues: (filters?: IssueFilters) => Promise<void>;
  fetchIssue: (id: string) => Promise<void>;
  createIssue: (data: Partial<Issue>) => Promise<Issue>;
  updateIssue: (id: string, data: Partial<Issue>) => Promise<Issue>;
  deleteIssue: (id: string) => Promise<void>;
  updateStatus: (id: string, status: Issue["status"]) => Promise<void>;
  setFilters: (filters: Partial<IssueFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: IssueFilters = {
  page: 1,
  limit: 10,
  search: "",
  status: "",
  priority: "",
  severity: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: [],
  currentIssue: null,
  pagination: { total: 0, page: 1, limit: 10, pages: 1 },
  statusCounts: { Open: 0, "In Progress": 0, Resolved: 0, Closed: 0 },
  filters: defaultFilters,
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchIssues: async (newFilters) => {
    const filters = newFilters ?? get().filters;
    set({ isLoading: true, error: null });
    try {
      const res = await issuesApi.getAll(filters);
      set({
        issues: res.data,
        pagination: res.pagination,
        statusCounts: res.statusCounts,
        isLoading: false,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load issues";
      set({ error: msg, isLoading: false });
    }
  },

  fetchIssue: async (id) => {
    set({ isLoading: true, error: null, currentIssue: null });
    try {
      const res = await issuesApi.getOne(id);
      set({ currentIssue: res.data, isLoading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load issue";
      set({ error: msg, isLoading: false });
    }
  },

  createIssue: async (data) => {
    set({ isSubmitting: true });
    try {
      const res = await issuesApi.create(data as never);
      set((state) => ({
        issues: [res.data, ...state.issues],
        isSubmitting: false,
      }));
      return res.data;
    } catch (err) {
      set({ isSubmitting: false });
      throw err;
    }
  },

  updateIssue: async (id, data) => {
    set({ isSubmitting: true });
    try {
      const res = await issuesApi.update(id, data as never);
      set((state) => ({
        issues: state.issues.map((i) => (i._id === id ? res.data : i)),
        currentIssue:
          state.currentIssue?._id === id ? res.data : state.currentIssue,
        isSubmitting: false,
      }));
      return res.data;
    } catch (err) {
      set({ isSubmitting: false });
      throw err;
    }
  },

  deleteIssue: async (id) => {
    try {
      await issuesApi.delete(id);
      set((state) => ({
        issues: state.issues.filter((i) => i._id !== id),
      }));
    } catch (err) {
      throw err;
    }
  },

  updateStatus: async (id, status) => {
    try {
      const res = await issuesApi.updateStatus(id, status);
      set((state) => ({
        issues: state.issues.map((i) => (i._id === id ? res.data : i)),
        currentIssue:
          state.currentIssue?._id === id ? res.data : state.currentIssue,
      }));
    } catch (err) {
      throw err;
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 },
    }));
  },

  resetFilters: () => set({ filters: defaultFilters }),
}));
