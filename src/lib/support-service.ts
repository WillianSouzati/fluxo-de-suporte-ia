import { supabase } from "@/integrations/supabase/client";
import type { SubmittedTicket } from "@/lib/support-data";

export interface SupportTicketInput {
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
}

export const processingErrorMessage = "Não foi possível processar a solicitação. Confira sua conexão e tente novamente.";
export const analysisErrorMessage = "Não foi possível concluir a análise por IA. A solicitação pode ter sido registrada. Aguarde antes de tentar novamente para evitar um novo registro.";

function record(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

export function normalizeTicketResponse(response: unknown, input: SupportTicketInput): SubmittedTicket {
  const envelope = record(response);
  if (!envelope || envelope['error'] || envelope['success'] === false) throw new Error(processingErrorMessage);
  const data = record(envelope['data']);
  const ticket = record(envelope['ticket']) ?? record(data?.['ticket']) ?? data ?? envelope;
  const databaseId = text(ticket['id']);
  const rawNumber = ticket['ticket_number'];
  const ticketNumber = typeof rawNumber === "number" && Number.isFinite(rawNumber) ? String(rawNumber) : text(rawNumber);
  if (!databaseId && !ticketNumber) throw new Error(processingErrorMessage);
  const date = text(ticket['created_at']);
  return {
    id: `real-${databaseId ?? ticketNumber}`,
    databaseId,
    ticketNumber,
    customer: text(ticket['customer_name']) ?? input.customer_name,
    email: text(ticket['customer_email']) ?? input.customer_email,
    subject: text(ticket['subject']) ?? input.subject,
    description: text(ticket['description']) ?? input.description,
    category: text(ticket['category']),
    priority: text(ticket['priority']),
    status: text(ticket['status']),
    receivedAt: date && Number.isFinite(Date.parse(date)) ? date : null,
    summary: text(ticket['summary']),
    department: text(ticket['responsible_department']),
    suggestedReply: text(ticket['suggested_reply']),
  };
}

export async function processSupportTicket(input: SupportTicketInput): Promise<{ ownerId: string; ticket: SubmittedTicket }> {
  try {
    // getUser revalidates an existing identity; getSession is used only to attach its token.
    const existing = await supabase.auth.getSession();
    if (existing.error) throw new Error(processingErrorMessage);
    let session = existing.data.session;
    if (session) {
      const verified = await supabase.auth.getUser();
      if (verified.error || !verified.data.user || verified.data.user.id !== session.user.id) throw new Error(processingErrorMessage);
      const refreshed = await supabase.auth.getSession();
      if (refreshed.error) throw new Error(processingErrorMessage);
      session = refreshed.data.session;
    }
    if (!session) {
      const anonymous = await supabase.auth.signInAnonymously();
      if (anonymous.error || !anonymous.data.session) throw new Error(processingErrorMessage);
      session = anonymous.data.session;
    }
    const { data, error } = await supabase.functions.invoke<unknown>("process-support-ticket", {
      body: input,
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (error) {
      const context: unknown = error.context;
      if (context instanceof Response && context.status === 502) throw new Error(analysisErrorMessage);
      throw new Error(processingErrorMessage);
    }
    return { ownerId: session.user.id, ticket: normalizeTicketResponse(data, input) };
  } catch (error) {
    // Never pass server responses, tokens or provider diagnostics to the UI.
    throw new Error(error instanceof Error && error.message === analysisErrorMessage ? analysisErrorMessage : processingErrorMessage);
  }
}