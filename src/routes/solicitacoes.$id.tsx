import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Copy, FileText, Inbox, Mail, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoNote, PageHeading, PriorityBadge, StatusBadge } from "@/components/support-ui";
import { demoTickets, formatTicketDate, initials } from "@/lib/support-data";

export const Route = createFileRoute("/solicitacoes/$id")({
  head: ({ params }) => ({ meta: [
    { title: `Atendimento #${params.id} | Fluxo de suporte por IA` },
    { name: "description", content: `Atendimento demonstrativo #${params.id}: solicitação original, análise ilustrativa, categoria e resposta de exemplo.` },
    { property: "og:title", content: `Atendimento #${params.id} | Fluxo de suporte por IA` },
    { property: "og:description", content: "Detalhes de um atendimento fictício com resumo, prioridade e resposta ilustrativos, sem IA conectada." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: RequestDetails,
});

function RequestDetails() {
  const { id } = Route.useParams();
  const ticket = demoTickets.find(item => item.id === id);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  async function copyReply() {
    if (!ticket) return;
    try { await navigator.clipboard.writeText(ticket.suggestedReply); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  }

  if (!ticket) return <div className="empty-state"><span className="empty-icon"><Inbox size={24} /></span><h1 className="page-title">Atendimento não encontrado</h1><p className="text-xs text-muted-foreground">Este número não faz parte dos dados de demonstração.</p><Button asChild variant="outline"><Link to="/solicitacoes"><ArrowLeft size={14} />Voltar às solicitações</Link></Button></div>;

  return <><PageHeading title={`Atendimento #${ticket.id}`} subtitle={ticket.subject}><Button asChild variant="outline" className="bg-card"><Link to="/solicitacoes"><ArrowLeft size={14} />Voltar às solicitações</Link></Button></PageHeading>
    <div className="detail-grid"><div className="space-y-5"><section className="surface"><div className="table-section-heading border-b border-border"><h2 className="flex items-center gap-2 text-[13px] font-semibold"><FileText size={16} className="text-muted-foreground" />Solicitação original</h2><StatusBadge status={ticket.status} /></div><div className="detail-content"><div className="ticket-person mb-5"><span className="avatar">{initials(ticket.customer)}</span><div><p className="text-xs font-medium">{ticket.customer}</p><p className="mt-1 text-[10px] text-muted-foreground">{ticket.email}</p></div><span className="ml-auto text-[10px] text-muted-foreground">{formatTicketDate(ticket.receivedAt)}, {ticket.receivedAt.slice(11,16)}</span></div><h3 className="mb-3 text-[13px] font-semibold">{ticket.subject}</h3><p className="detail-text">{ticket.description}</p></div></section>
    <section className="surface"><div className="detail-content"><div className="ai-heading"><Sparkles size={17} /><h2>Análise do atendimento</h2><span className="ai-chip">Exemplo de IA</span></div><p className="mt-2 text-[10px] text-muted-foreground">Conteúdo ilustrativo pré-escrito · Nenhuma IA conectada</p><h3 className="mt-6 text-[11px] font-semibold">Resumo gerado pela IA <span className="font-normal text-muted-foreground">(demonstrativo)</span></h3><p className="ai-summary">{ticket.summary}</p><dl className="detail-properties"><div><dt>Categoria identificada</dt><dd>{ticket.category}</dd></div><div><dt>Prioridade sugerida</dt><dd><PriorityBadge priority={ticket.priority} /></dd></div><div><dt>Setor recomendado</dt><dd>{ticket.department}</dd></div></dl><div className="mt-6 border-t border-border pt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-[11px] font-semibold">Resposta inicial sugerida</h3><Button variant="ghost" size="sm" className="h-7 text-[10px] text-muted-foreground" onClick={() => void copyReply()}>{copied ? <Check size={12} /> : <Copy size={12} />}{copied ? "Resposta copiada" : "Copiar resposta"}</Button></div><div className="ai-summary mt-3">{ticket.suggestedReply}</div><p className="mt-3 text-[10px] text-muted-foreground" role="status">{copyError ? "Não foi possível copiar automaticamente. Selecione o texto da resposta para copiar." : "Resposta de exemplo. Nenhuma mensagem foi enviada ao cliente."}</p></div></div></section></div>
    <aside><section className="surface"><div className="detail-content"><h2 className="text-[13px] font-semibold">Informações do atendimento</h2><dl className="mt-2"><div className="detail-aside-row"><dt>Status atual</dt><dd><StatusBadge status={ticket.status} /></dd></div><div className="detail-aside-row"><dt>Prioridade</dt><dd><PriorityBadge priority={ticket.priority} /></dd></div><div className="detail-aside-row"><dt>Categoria</dt><dd>{ticket.category}</dd></div><div className="detail-aside-row"><dt>Setor responsável</dt><dd>{ticket.department}</dd></div><div className="detail-aside-row"><dt>Recebido em</dt><dd>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(ticket.receivedAt))}<span className="mt-1 block text-[10px] text-muted-foreground">às {ticket.receivedAt.slice(11,16)} · UTC</span></dd></div></dl></div></section><div className="mt-5"><DemoNote>Este atendimento é fictício. O status, a classificação e as sugestões são exemplos demonstrativos.</DemoNote></div></aside></div>
  </>;
}