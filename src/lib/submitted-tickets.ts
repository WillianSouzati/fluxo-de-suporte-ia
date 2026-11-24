import type { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SubmittedTicket } from "@/lib/support-data";

const cacheKey = (ownerId: string, id: string) => ["submitted-ticket", ownerId, id] as const;
const storageKey = (ownerId: string, id: string) => `fluxo:submitted-ticket:${ownerId}:${id}`;

function isSubmittedTicket(value: unknown, id: string): value is SubmittedTicket {
  if (typeof value !== "object" || value === null) return false;
  const ticket = value as Record<string, unknown>;
  const fields = ["databaseId", "ticketNumber", "category", "priority", "status", "receivedAt", "summary", "department", "suggestedReply"];
  return ticket['id'] === id && id.startsWith("real-")
    && ["customer", "email", "subject", "description"].every(key => typeof ticket[key] === "string")
    && fields.every(key => ticket[key] === null || typeof ticket[key] === "string")
    && (ticket['receivedAt'] === null || Number.isFinite(Date.parse(String(ticket['receivedAt']))));
}

/** Called only after a real successful submission, never from dashboard/list pages. */
export function rememberSubmittedTicket(queryClient: QueryClient, ownerId: string, ticket: SubmittedTicket): void {
  queryClient.setQueryData(cacheKey(ownerId, ticket.id), ticket);
  try { sessionStorage.setItem(storageKey(ownerId, ticket.id), JSON.stringify(ticket)); }
  catch { /* In-memory cache still allows navigation if browser storage is unavailable. */ }
}

/** No database read: another visitor's URL cannot expose any real ticket. */
export async function loadSubmittedTicket(queryClient: QueryClient, id: string): Promise<SubmittedTicket | null> {
  if (!id.startsWith("real-")) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const cached = queryClient.getQueryData<SubmittedTicket>(cacheKey(data.user.id, id));
  if (cached && isSubmittedTicket(cached, id)) return cached;
  try {
    const stored = sessionStorage.getItem(storageKey(data.user.id, id));
    const ticket: unknown = stored ? JSON.parse(stored) : null;
    if (!isSubmittedTicket(ticket, id)) return null;
    queryClient.setQueryData(cacheKey(data.user.id, id), ticket);
    return ticket;
  } catch { return null; }
}