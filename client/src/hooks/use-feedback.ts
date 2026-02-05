import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

type FeedbackStats = z.infer<typeof api.feedback.stats.responses[200]>;
type FeedbackList = z.infer<typeof api.feedback.list.responses[200]>;

export function useSubmitFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (satisfaction: string) => {
      const res = await fetch(api.feedback.vote.path, {
        method: api.feedback.vote.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ satisfaction }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to submit feedback");
      return api.feedback.vote.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      // Invalidate both stats and list queries to keep admin dashboard fresh
      queryClient.invalidateQueries({ queryKey: [api.feedback.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.feedback.stats.path] });
    },
  });
}

export function useFeedbackStats(date?: string, compareDate?: string) {
  return useQuery({
    queryKey: [api.feedback.stats.path, date, compareDate],
    queryFn: async () => {
      const url = buildUrl(api.feedback.stats.path);
      const params = new URLSearchParams();
      if (date) params.append("date", date);
      if (compareDate) params.append("compareDate", compareDate);
      
      const res = await fetch(`${url}?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.feedback.stats.responses[200].parse(await res.json());
    },
    refetchInterval: 10000, // Auto-refresh every 10s
  });
}

export function useFeedbackList(page = 1, limit = 20, date?: string) {
  return useQuery({
    queryKey: [api.feedback.list.path, page, limit, date],
    queryFn: async () => {
      const url = buildUrl(api.feedback.list.path);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (date) params.append("date", date);
      
      const res = await fetch(`${url}?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch feedback list");
      return api.feedback.list.responses[200].parse(await res.json());
    },
    refetchInterval: 10000, // Auto-refresh every 10s
  });
}

export function getExportUrl(type: 'csv' | 'txt', date?: string) {
  const path = type === 'csv' ? api.feedback.exportCsv.path : api.feedback.exportTxt.path;
  const params = date ? `?date=${date}` : '';
  return path + params;
}
