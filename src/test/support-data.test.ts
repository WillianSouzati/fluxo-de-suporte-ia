import { describe, expect, it } from "vitest";
import { categories, demoTickets, filterTickets, getTicketStats, priorities, statuses } from "@/lib/support-data";

describe("Support demonstration", () => {
  it("uses the six requested categories", () => {
    expect([...categories].sort()).toEqual(["Acesso à conta", "Pagamentos", "Problemas técnicos", "Entrega e pedidos", "Cancelamento", "Outros"].sort());
  });
  it("uses the four requested priority levels", () => {
    expect([...priorities]).toEqual(["Baixa", "Média", "Alta", "Urgente"]);
  });
  it("uses the four requested statuses", () => {
    expect([...statuses]).toEqual(["Novo", "Em atendimento", "Aguardando cliente", "Concluído"]);
  });
  it("filters by category", () => {
    const result = filterTickets(demoTickets, { category: "Pagamentos" });
    expect(result).toHaveLength(8);
    expect(result.every(ticket => ticket.category === "Pagamentos")).toBe(true);
  });
  it("filters by priority", () => {
    const result = filterTickets(demoTickets, { priority: "Urgente" });
    expect(result).toHaveLength(6);
    expect(result.every(ticket => ticket.priority === "Urgente")).toBe(true);
  });
  it("filters by status", () => {
    const result = filterTickets(demoTickets, { status: "Concluído" });
    expect(result).toHaveLength(32);
    expect(result.every(ticket => ticket.status === "Concluído")).toBe(true);
  });
  it("combines all filters and tolerates unaccented searches", () => {
    expect(filterTickets(demoTickets, { query: "cobranca", category: "Pagamentos", priority: "Urgente", status: "Em atendimento" }).map(ticket => ticket.id)).toEqual(["1047"]);
  });
  it("returns an empty result when no demonstration matches", () => {
    expect(filterTickets(demoTickets, { query: "inexistente-xyz" })).toEqual([]);
  });
  it("derives dashboard counters from the same tickets as the table", () => {
    expect(getTicketStats(demoTickets)).toEqual({ total: 48, pending: 16, highPriority: 10, completed: 32 });
  });
  it("does not include resolved tickets in the high priority queue", () => {
    expect(getTicketStats(demoTickets.filter(ticket => ticket.status === "Concluído")).highPriority).toBe(0);
  });
});