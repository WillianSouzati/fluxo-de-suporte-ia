import { beforeEach, describe, expect, it, vi } from "vitest";
import { normalizeTicketResponse, processSupportTicket, analysisErrorMessage, processingErrorMessage } from "@/lib/support-service";

const mocks = vi.hoisted(() => ({ getSession: vi.fn(), getUser: vi.fn(), signInAnonymously: vi.fn(), invoke: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth: mocks, functions: { invoke: mocks.invoke } } }));

const input = { customer_name: "Cliente Fictício", customer_email: "teste@example.com", subject: "Cobrança duplicada", description: "Duas cobranças fictícias para a mesma assinatura." };
const row = { id: "ticket-test-id", ticket_number: 42, category: "Pagamentos", priority: "Alta", summary: "Duas cobranças para a mesma assinatura.", responsible_department: "Financeiro", suggested_reply: "Vamos verificar a duplicidade.", status: "Novo", created_at: "2026-11-24T20:00:00Z" };
const session = { access_token: "test-only-token", user: { id: "owner-a" } };

beforeEach(() => {
  vi.resetAllMocks();
  mocks.getSession.mockResolvedValue({ data: { session: null }, error: null });
  mocks.getUser.mockResolvedValue({ data: { user: session.user }, error: null });
  mocks.signInAnonymously.mockResolvedValue({ data: { session }, error: null });
  mocks.invoke.mockResolvedValue({ data: { ticket: row }, error: null });
});

describe("Processing real support tickets", () => {
  it("authenticates anonymously before invoking process-support-ticket with the four requested fields and obtained bearer", async () => {
    const result = await processSupportTicket(input);
    expect(mocks.signInAnonymously).toHaveBeenCalledOnce();
    expect(mocks.signInAnonymously.mock.invocationCallOrder[0]).toBeLessThan(mocks.invoke.mock.invocationCallOrder[0] ?? 0);
    expect(mocks.invoke).toHaveBeenCalledWith("process-support-ticket", { body: input, headers: { Authorization: "Bearer test-only-token" } });
    expect(result.ownerId).toBe("owner-a");
  });

  it("reuses and verifies an existing session instead of creating another anonymous user", async () => {
    mocks.getSession.mockResolvedValue({ data: { session }, error: null });
    await processSupportTicket(input);
    expect(mocks.getUser).toHaveBeenCalledOnce();
    expect(mocks.signInAnonymously).not.toHaveBeenCalled();
    expect(mocks.invoke).toHaveBeenCalledOnce();
  });

  it("does not submit without an authenticated session", async () => {
    mocks.signInAnonymously.mockResolvedValue({ data: { session: null }, error: { message: "internal diagnostic" } });
    await expect(processSupportTicket(input)).rejects.toThrow(processingErrorMessage);
    expect(mocks.invoke).not.toHaveBeenCalled();
  });

  it("does not trust an invalid existing identity", async () => {
    mocks.getSession.mockResolvedValue({ data: { session }, error: null });
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: new Error("invalid token") });
    await expect(processSupportTicket(input)).rejects.toThrow(processingErrorMessage);
    expect(mocks.invoke).not.toHaveBeenCalled();
  });

  it("preserves the actual ticket number and all returned AI fields", () => {
    expect(normalizeTicketResponse({ ticket: row }, input)).toEqual({ id: "real-ticket-test-id", databaseId: "ticket-test-id", ticketNumber: "42", customer: "Cliente Fictício", email: "teste@example.com", subject: "Cobrança duplicada", description: input.description, category: "Pagamentos", priority: "Alta", summary: "Duas cobranças para a mesma assinatura.", department: "Financeiro", suggestedReply: "Vamos verificar a duplicidade.", status: "Novo", receivedAt: "2026-11-24T20:00:00Z" });
  });

  it.each([row, { data: row }, { data: { ticket: row } }])("accepts record and data envelopes without changing actual fields", response => {
    expect(normalizeTicketResponse(response, input).ticketNumber).toBe("42");
  });

  it("never invents missing AI fields or a status", () => {
    const result = normalizeTicketResponse({ ticket: { id: "incomplete", created_at: "invalid" } }, input);
    expect([result.category, result.priority, result.summary, result.department, result.suggestedReply, result.status, result.ticketNumber, result.receivedAt]).toEqual([null, null, null, null, null, null, null, null]);
  });

  it.each([{}, null, { success: false, ticket: row }, { error: "internal secret" }])("rejects invalid or failed responses without treating them as success", response => {
    expect(() => normalizeTicketResponse(response, input)).toThrow(processingErrorMessage);
  });

  it("sanitizes provider errors instead of exposing internal diagnostics", async () => {
    mocks.invoke.mockResolvedValue({ data: null, error: { message: "private diagnostic must not reach users" } });
    await expect(processSupportTicket(input)).rejects.toThrow(processingErrorMessage);
  });

  it("warns that a record may already exist when AI processing fails after storage", async () => {
    mocks.invoke.mockResolvedValue({ data: null, error: { context: new Response(null, { status: 502 }) } });
    await expect(processSupportTicket(input)).rejects.toThrow(analysisErrorMessage);
  });
});