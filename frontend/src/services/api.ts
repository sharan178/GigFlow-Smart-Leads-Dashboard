import axios from "axios";
import { Lead, LeadFilters, PaginationMeta, User } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (payload: { email: string; password: string }) => {
    const { data } = await api.post<{ data: AuthResponse }>("/auth/login", payload);
    return data.data;
  },
  register: async (payload: { name: string; email: string; password: string; role: string }) => {
    const { data } = await api.post<{ data: AuthResponse }>("/auth/register", payload);
    return data.data;
  },
};

export const leadApi = {
  list: async (filters: LeadFilters) => {
    const params = {
      page: filters.page,
      sort: filters.sort,
      status: filters.status || undefined,
      source: filters.source || undefined,
      search: filters.search || undefined,
    };
    const { data } = await api.get<{ data: Lead[]; meta: PaginationMeta }>("/leads", { params });
    return data;
  },
  create: async (payload: Omit<Lead, "_id" | "createdAt" | "updatedAt">) => {
    const { data } = await api.post<{ data: Lead }>("/leads", payload);
    return data.data;
  },
  update: async (id: string, payload: Partial<Omit<Lead, "_id" | "createdAt" | "updatedAt">>) => {
    const { data } = await api.put<{ data: Lead }>(`/leads/${id}`, payload);
    return data.data;
  },
  remove: async (id: string) => api.delete(`/leads/${id}`),
};

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return String(error.response?.data?.message || error.message);
  }
  return "Something went wrong";
};
