import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Route } from "@/routes/novo-atendimento";
import type { SubmittedTicket } from "@/lib/support-data";

const mocks = vi.hoisted(() => ({ process: vi.fn(), remember: vi.fn(), navigate: vi.fn() }));
vi.mock("@/lib/support-service", () => ({ processSupportTicket: mocks.process, processingErrorMessage: "safe-processing-error", analysisErrorMessage: "safe-analysis-error" }));
vi.mock("@/lib/submitted-tickets", () => ({ rememberSubmittedTicket: mocks.remember }));
vi.mock("@tanstack/react-router", async importOriginal => ({
  ...await importOriginal<typeof import("@tanstack/react-router")>(),
  useNavigate: () => mocks.navigate,
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

const ticket: SubmittedTicket = { id: "real-test-id", databaseId: "test-id", ticketNumber: "12", customer: "Cliente Fictício", email: "teste@example.com", subject: "Teste fictício", description: "Solicitação fictícia para teste.", category: "Outros", priority: "Baixa", status: "Novo", receivedAt: null, summary: "Resumo retornado", department: "Atendimento", suggestedReply: "Resposta retornada" };
const response = { ownerId: "owner-a", ticket };

function fillForm() {
  const Component = Route.options.component;
  if (!Component) throw new Error("Missing form component");
  render(<QueryClientProvider client={new QueryClient()}><Component /></QueryClientProvider>);
  fireEvent.change(screen.getByLabelText(/Nome do cliente/), { target: { value: ticket.customer } });
  fireEvent.change(screen.getByLabelText(/E-mail/), { target: { value: ticket.email } });
  fireEvent.change(screen.getByLabelText(/Assunto/), { target: { value: ticket.subject } });
  fireEvent.change(screen.getByLabelText(/Descrição detalhada/), { target: { value: ticket.description } });
  const form = screen.getByLabelText(/Nome do cliente/).closest("form");
  if (!form) throw new Error("Missing submission form");
  return form;
}

beforeEach(() => { vi.resetAllMocks(); mocks.navigate.mockResolvedValue(undefined); });
afterEach(cleanup);

describe("Support form submission", () => {
  it("makes only one request while processing, even if the form is submitted repeatedly", async () => {
    let resolveRequest: ((value: typeof response) => void) | undefined;
    mocks.process.mockReturnValue(new Promise<typeof response>(resolve => { resolveRequest = resolve; }));
    const form = fillForm();
    fireEvent.submit(form);
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(mocks.process).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText(/Nome do cliente/)).toBeDisabled();
    resolveRequest?.(response);
    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith({ to: "/solicitacoes/$id", params: { id: "real-test-id" } }));
    expect(mocks.remember).toHaveBeenCalledWith(expect.any(QueryClient), "owner-a", ticket);
  });

  it("preserves entered data and permits a successful manual retry after failure", async () => {
    mocks.process.mockRejectedValueOnce(new Error("internal diagnostic")).mockResolvedValueOnce(response);
    const form = fillForm();
    fireEvent.submit(form);
    await waitFor(() => expect(screen.getByLabelText(/Nome do cliente/)).not.toBeDisabled());
    expect(screen.getByLabelText(/Descrição detalhada/)).toHaveValue(ticket.description);
    expect(mocks.navigate).not.toHaveBeenCalled();
    fireEvent.submit(form);
    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith({ to: "/solicitacoes/$id", params: { id: "real-test-id" } }));
    expect(mocks.process).toHaveBeenCalledTimes(2);
    expect(mocks.process).toHaveBeenLastCalledWith({ customer_name: ticket.customer, customer_email: ticket.email, subject: ticket.subject, description: ticket.description });
  });
});