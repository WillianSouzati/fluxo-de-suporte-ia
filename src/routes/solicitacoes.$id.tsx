import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, Copy, FileText, Inbox, LoaderCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoNote, PageHeading, PriorityBadge, StatusBadge } from "@/components/support-ui";
import { demoTickets, formatTicketDate, initials, type SubmittedTicket, type Ticket } from "@/lib/support-data";
import { loadSubmittedTicket } from "@/lib/submitted-tickets";

export const Route = createFileRoute("/solicitacoes/$id")({
  head: ({ params }) => ({ meta: [
    { title: `${params.id.startsWith("real-") ? "Resultado do atendimento" : `Atendimento #${params.id}`} | Fluxo de suporte por IA` },
    { name: "description", content: params.id.startsWith("real-") ? "Resultado do seu atendimento no Fluxo, disponível apenas na sessão de envio." : `Atendimento demonstrativo #${params.id}: solicitação original, análise ilustrativa, categoria e resposta de exemplo.` },
    { property: "og:title", content: `${params.id.startsWith("real-") ? "Resultado do atendimento" : `Atendimento #${params.id}`} | Fluxo de suporte por IA` },
    { property: "og:description", content: "Solicitação original, classificação, prioridade, resumo e resposta do atendimento no Fluxo." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: RequestDetails,
});

function RequestDetails() {
  const { id } = Route.useParams();
  if (id.startsWith("real-")) return <SubmittedRequestDetails key={id} id={id} />;
  const ticket = demoTickets.find(item => item.id === id);
  if (!ticket) return <MissingTicket real={false} />;
  return <TicketDetails key={id} ticket={ticket} />;
}

function SubmittedRequestDetails({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const [ticket, setTicket] = useState<SubmittedTicket | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    loadSubmittedTicket(queryClient, id)
      .then(result => { if (active) setTicket(result); })
      .catch(() => { if (active) setTicket(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, queryClient]);
  if (loading) return <div className="empty-state" role="status"><LoaderCircle size={24} className="animate-spin text-primary motion-reduce:animate-none" /><p className="text-xs text-muted-foreground">Carregando resultado do atendimento...</p></div>;
  if (!ticket) return <MissingTicket real />;
  return <TicketDetails ticket={ticket} />;
}

function MissingTicket({ real }: { real: boolean }) {
  return <div className="empty-state"><span className="empty-icon"><Inbox size={24} /></span><h1 className="page-title">Atendimento não encontrado</h1><p className="text-xs text-muted-foreground">{real ? "Este resultado não está disponível nesta sessão. Abra o atendimento na aba em que ele foi enviado." : "Este número não faz parte dos dados de demonstração."}</p><Button asChild variant="outline"><Link to="/solicitacoes"><ArrowLeft size={14} />Voltar às solicitações</Link></Button></div>;
}

function TicketDetails({ ticket }: { ticket: Ticket | SubmittedTicket }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const real = 'ticketNumber' in ticket;
  const number = real ? ticket.ticketNumber : ticket.id;
  const missing = "Não informado";
  const hasAnalysis = Boolean(ticket.summary || ticket.category || ticket.priority || ticket.department || ticket.suggestedReply);

  async function copyReply() {
    if (!ticket.suggestedReply) return;
    try { await navigator.clipboard.writeText(ticket.suggestedReply); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  }

  return <><PageHeading title={number ? `Atendimento #${number}` : "Resultado do atendimento"} subtitle={ticket.subject}><Button asChild variant="outline" className="bg-card"><Link to="/solicitacoes"><ArrowLeft size={14} />Voltar às solicitações</Link></Button></PageHeading>
    <div className="detail-grid"><div className="min-w-0 space-y-5"><section className="surface"><div className="table-section-heading border-b border-border"><h2 className="flex items-center gap-2 text-[13px] font-semibold"><FileText size={16} className="text-muted-foreground" />Solicitação original</h2>{ticket.status ? <StatusBadge status={ticket.status} /> : <span className="text-[10px] text-muted-foreground">Status não informado</span>}</div><div className="detail-content"><div className="ticket-person mb-5 flex-wrap"><span className="avatar">{initials(ticket.customer)}</span><div className="min-w-0"><p className="text-xs font-medium">{ticket.customer}</p><p className="mt-1 text-[10px] text-muted-foreground">{ticket.email}</p></div>{ticket.receivedAt && <span className="ml-auto text-[10px] text-muted-foreground">{formatTicketDate(ticket.receivedAt)}, {ticket.receivedAt.slice(11,16)}</span>}</div><h3 className="mb-3 text-[13px] font-semibold">{ticket.subject}</h3><p className="detail-text">{ticket.description}</p></div></section>
    <section className="surface"><div className="detail-content"><div className="ai-heading flex-wrap"><Sparkles size={17} /><h2>Análise do atendimento</h2><span className="ai-chip">{real ? hasAnalysis ? "Resultado da IA" : "Resultado recebido" : "Exemplo de IA"}</span></div><p className="mt-2 text-[10px] text-muted-foreground">{real ? "Dados retornados para esta solicitação" : "Conteúdo ilustrativo pré-escrito · Atendimento de exemplo"}</p><h3 className="mt-6 text-[11px] font-semibold">Resumo gerado pela IA {!real && <span className="font-normal text-muted-foreground">(demonstrativo)</span>}</h3><p className="ai-summary whitespace-pre-line">{ticket.summary ?? "O resumo não foi retornado para este atendimento."}</p><dl className="detail-properties"><div><dt>Categoria identificada</dt><dd>{ticket.category ?? missing}</dd></div><div><dt>Prioridade sugerida</dt><dd>{ticket.priority ? <PriorityBadge priority={ticket.priority} /> : missing}</dd></div><div><dt>Setor recomendado</dt><dd>{ticket.department ?? missing}</dd></div></dl><div className="mt-6 border-t border-border pt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-[11px] font-semibold">Resposta inicial sugerida</h3><Button variant="ghost" size="sm" className="h-7 text-[10px] text-muted-foreground" disabled={!ticket.suggestedReply} onClick={() => void copyReply()}>{copied ? <Check size={12} /> : <Copy size={12} />}{copied ? "Resposta copiada" : "Copiar resposta"}</Button></div><div className="ai-summary mt-3 whitespace-pre-line">{ticket.suggestedReply ?? "Nenhuma resposta sugerida foi retornada para este atendimento."}</div><p className="mt-3 text-[10px] text-muted-foreground" role="status">{copyError ? "Não foi possível copiar automaticamente. Selecione o texto da resposta para copiar." : real ? "Nenhuma mensagem foi enviada ao cliente." : "Resposta de exemplo. Nenhuma mensagem foi enviada ao cliente."}</p></div></div></section></div>
    <aside className="min-w-0"><section className="surface"><div className="detail-content"><h2 className="text-[13px] font-semibold">Informações do atendimento</h2><dl className="mt-2"><div className="detail-aside-row"><dt>Status atual</dt><dd>{ticket.status ? <StatusBadge status={ticket.status} /> : missing}</dd></div><div className="detail-aside-row"><dt>Prioridade</dt><dd>{ticket.priority ? <PriorityBadge priority={ticket.priority} /> : missing}</dd></div><div className="detail-aside-row"><dt>Categoria</dt><dd>{ticket.category ?? missing}</dd></div><div className="detail-aside-row"><dt>Setor responsável</dt><dd>{ticket.department ?? missing}</dd></div><div className="detail-aside-row"><dt>Recebido em</dt><dd>{ticket.receivedAt ? <>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(ticket.receivedAt))}<span className="mt-1 block text-[10px] text-muted-foreground">às {ticket.receivedAt.slice(11,16)} · UTC</span></> : missing}</dd></div></dl></div></section><div className="mt-5"><DemoNote>{real ? "Este resultado pertence ao atendimento enviado nesta sessão e não é exibido no dashboard ou nas listas de demonstração. Disponível nesta aba enquanto a sessão for mantida." : "Este atendimento é fictício. O status, a classificação e as sugestões são exemplos demonstrativos."}</DemoNote></div></aside></div>
  </>;
}