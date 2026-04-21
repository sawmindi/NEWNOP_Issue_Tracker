// User
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

// Issue
export type IssueStatus = "Open" | "In Progress" | "Resolved" | "Closed";
export type IssuePriority = "Low" | "Medium" | "High" | "Critical";
export type IssueSeverity = "Minor" | "Major" | "Critical" | "Blocker";

export interface Issue {
  _id: string;
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  tags: string[];
  reporter: User;
  assignee?: User;
  resolvedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IssueFormData {
  title: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  severity?: IssueSeverity;
  tags?: string[];
}

// Pagination
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface StatusCounts {
  Open: number;
  "In Progress": number;
  Resolved: number;
  Closed: number;
}

// API
export interface IssueFilters {
  search?: string;
  status?: IssueStatus | "";
  priority?: IssuePriority | "";
  severity?: IssueSeverity | "";
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IssuesResponse {
  success: boolean;
  data: Issue[];
  pagination: Pagination;
  statusCounts: StatusCounts;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}
