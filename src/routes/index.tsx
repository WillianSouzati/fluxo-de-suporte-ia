import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, CalendarDays, CheckCheck, CircleAlert, Clock3, Inbox, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewTicketButton, PageHeading } from "@/components/support-ui";
import { TicketTable } from "@/components/ticket-table";
import { ActivityChart, CategoryChart } from "@/components/dashboard-charts";
import { demoTickets, getTicketStats } from "@/lib/support-data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Dashboard | Fluxo de suporte por IA" },
    { name: "description", content: "Painel demonstrativo do Fluxo: solicitações, prioridades e categorias do atendimento ao cliente em um só lugar." },
    { property: "og:title", content: "Dashboard | Fluxo de suporte por IA" },
    { property: "og:description", content: "Uma visão clara do seu suporte. Explore indicadores e atendimentos com dados de demonstração." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Dashboard,
});

function Dashboard() {
  const [period, setPeriod] = useState("7");
  const days = Number(period);
  const cutoff = new Date(Date.UTC(2026, 10, 25 - days)).toISOString();
  const tickets = demoTickets.filter(ticket => ticket.receivedAt >= cutoff);
  const stats = getTicketStats(tickets);
  const cards = [
    { title: "Total de solicitações", value: stats.total, icon: Inbox, iconClass: "", caption: "recebidas no período", detail: "Visão geral", detailClass: "text-primary", trend: ArrowUpRight },
    { title: "Solicitações pendentes", value: stats.pending, icon: Clock3, iconClass: "stat-warning", caption: "aguardando resolução", detail: "Em aberto", detailClass: "text-warning", trend: Minus },
    { title: "Alta prioridade", value: stats.highPriority, icon: CircleAlert, iconClass: "stat-danger", caption: "alta ou urgente, em aberto", detail: "Atenção", detailClass: "text-danger", trend: ArrowUpRight },
    { title: "Solicitações concluídas", value: stats.completed, icon: CheckCheck, iconClass: "stat-success", caption: "do total de solicitações", detail: `${Math.round(stats.completed / Math.max(stats.total,1) * 100)}%`, detailClass: "text-success", trend: CheckCheck },
  ];

  return <>
    <PageHeading title="Dashboard" subtitle="Seu atendimento em perspectiva. Cada solicitação, no lugar certo."><div className="relative"><CalendarDays size={13} className="pointer-events-none absolute left-3 top-3 z-10 text-muted-foreground" /><Select value={period} onValueChange={setPeriod}><SelectTrigger className="h-9 w-[152px] bg-card pl-9 text-[11px] shadow-none" aria-label="Período do dashboard"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7">Últimos 7 dias</SelectItem><SelectItem value="3">Últimos 3 dias</SelectItem></SelectContent></Select></div><NewTicketButton /></PageHeading>
    <div className="stat-grid">{cards.map(card => <section key={card.title} className="stat-card surface"><div className="stat-top"><h2>{card.title}</h2><span className={`stat-icon ${card.iconClass}`}><card.icon size={17} strokeWidth={1.7} /></span></div><p className="stat-number">{card.value}</p><div className="stat-foot"><span className={`inline-flex items-center gap-1 font-medium ${card.detailClass}`}><card.trend size={11} />{card.detail}</span><span>{card.caption}</span></div></section>)}</div>
    <div className="chart-grid"><ActivityChart tickets={tickets} days={days} /><CategoryChart tickets={tickets} /></div>
    <section className="surface"><div className="table-section-heading"><div><h2 className="section-title">Solicitações recentes <span className="ml-1.5 rounded border border-border bg-background px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">{tickets.length}</span></h2><p className="section-subtitle">Os últimos atendimentos que chegaram por aqui.</p></div><Button variant="ghost" size="sm" asChild className="h-7 px-0 text-[10px] text-primary hover:bg-transparent"><Link to="/solicitacoes">Ver todas<ArrowRight size={12} /></Link></Button></div><TicketTable tickets={tickets} compact /></section>
    <div className="mt-5 flex items-center justify-between gap-3 text-[9px] text-muted-foreground"><span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-primary" />Workspace de demonstração</span><span>18–24 nov, 2026 · Dados de exemplo</span></div>
  </>;
}
