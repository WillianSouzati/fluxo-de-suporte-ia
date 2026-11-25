import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadSubmittedTicket, rememberSubmittedTicket } from "@/lib/submitted-tickets";
import { demoTickets, getTicketStats, type SubmittedTicket } from "@/lib/support-data";

const { getUser } = vi.hoisted(() => ({ getUser: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth: { getUser } } }));
const ticket: SubmittedTicket = { id: "real-private-id", databaseId: "private-id", ticketNumber: "1048", customer: "Cliente Fictício", email: "ficticio@example.com", subject: "Atendimento da minha sessão", description: "Teste fictício.", category: "Pagamentos", priority: "Alta", summary: "Resumo real retornado no teste", department: "Financeiro", suggestedReply: "Resposta retornada no teste", status: "Novo", receivedAt: "2026-11-24T20:00:00Z" };

beforeEach(() => {
  vi.restoreAllMocks();
  sessionStorage.clear();
  getUser.mockResolvedValue({ data: { user: { id: "owner-a" } }, error: null });
});

describe("Private result access", () => {
  it("reads the submitted result after refresh using a fresh in-memory cache", async () => {
    rememberSubmittedTicket(new QueryClient(), "owner-a", ticket);
    expect(await loadSubmittedTicket(new QueryClient(), ticket.id)).toEqual(ticket);
  });
  it("never reveals another session owner's result, even with the same URL and cache", async () => {
    const cache = new QueryClient();
    rememberSubmittedTicket(cache, "owner-a", ticket);
    getUser.mockResolvedValue({ data: { user: { id: "owner-b" } }, error: null });
    expect(await loadSubmittedTicket(cache, ticket.id)).toBeNull();
  });
  it("requires a currently verified user to read even an in-memory result", async () => {
    const cache = new QueryClient();
    rememberSubmittedTicket(cache, "owner-a", ticket);
    getUser.mockResolvedValue({ data: { user: null }, error: new Error("expired") });
    expect(await loadSubmittedTicket(cache, ticket.id)).toBeNull();
  });
  it("does not replace demonstration #1048 or alter dashboard records and counters", async () => {
    rememberSubmittedTicket(new QueryClient(), "owner-a", ticket);
    expect(await loadSubmittedTicket(new QueryClient(), "1048")).toBeNull();
    expect(demoTickets.find(item => item.id === "1048")?.customer).toBe("Ana Oliveira");
    expect(getTicketStats(demoTickets)).toEqual({ total: 48, pending: 16, highPriority: 10, completed: 32 });
  });
  it("still opens the result without resubmission when session storage is blocked", async () => {
    const cache = new QueryClient();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    rememberSubmittedTicket(cache, "owner-a", ticket);
    expect(await loadSubmittedTicket(cache, ticket.id)).toEqual(ticket);
  });
  it("does not throw or expose data when the stored response is corrupted", async () => {
    sessionStorage.setItem("fluxo:submitted-ticket:owner-a:real-private-id", "not-json");
    expect(await loadSubmittedTicket(new QueryClient(), ticket.id)).toBeNull();
  });
});