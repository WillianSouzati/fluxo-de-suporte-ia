import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ListFilter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewTicketButton, PageHeading } from "@/components/support-ui";
import { TicketTable } from "@/components/ticket-table";
import { categories, demoTickets, filterTickets, priorities, statuses, ticketSearch } from "@/lib/support-data";

export const Route = createFileRoute("/solicitacoes/")({
  validateSearch: ticketSearch,
  head: () => ({ meta: [
    { title: "Solicitações | Fluxo de suporte por IA" },
    { name: "description", content: "Explore solicitações fictícias e filtre o atendimento por categoria, prioridade e status no workspace Fluxo." },
    { property: "og:title", content: "Solicitações | Fluxo de suporte por IA" },
    { property: "og:description", content: "Todos os atendimentos organizados em uma visão demonstrativa com filtros de categoria, prioridade e status." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Requests,
});

function Requests() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const tickets = filterTickets(demoTickets, { query: search.q ?? "", category: search.categoria ?? "all", priority: search.prioridade ?? "all", status: search.status ?? "all" });
  const hasFilters = Boolean(search.q || (search.categoria && search.categoria !== "all") || (search.prioridade && search.prioridade !== "all") || (search.status && search.status !== "all"));
  const update = (values: Partial<typeof search>) => { void navigate({ to: "/solicitacoes", search: { ...search, ...values }, replace: true }); };
  const clear = () => { void navigate({ to: "/solicitacoes", search: {}, replace: true }); };

  return <><PageHeading title="Solicitações" subtitle="Todos os atendimentos, organizados em um só lugar."><NewTicketButton /></PageHeading>
    <section className="surface"><div className="table-section-heading"><div className="flex items-center gap-2"><h2 className="section-title">Todos os atendimentos</h2><span className="rounded bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{demoTickets.length}</span></div><span className="demo-label">Dados de exemplo</span></div>
    <div className="filter-bar"><div className="filter-search"><Search size={15} /><Input aria-label="Buscar solicitações" placeholder="Buscar por nome, assunto ou número..." value={search.q ?? ""} onChange={event => update({ q: event.target.value })} /></div>
      <Select value={search.categoria ?? "all"} onValueChange={value => update({ categoria: value })}><SelectTrigger className="filter-select" aria-label="Filtrar por categoria"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todas as categorias</SelectItem>{categories.map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
      <Select value={search.prioridade ?? "all"} onValueChange={value => update({ prioridade: value })}><SelectTrigger className="filter-select" aria-label="Filtrar por prioridade"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todas as prioridades</SelectItem>{priorities.map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
      <Select value={search.status ?? "all"} onValueChange={value => update({ status: value })}><SelectTrigger className="filter-select" aria-label="Filtrar por status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos os status</SelectItem>{statuses.map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
      {hasFilters && <Button variant="ghost" size="icon" aria-label="Limpar filtros" title="Limpar filtros" onClick={clear} className="size-8 text-muted-foreground"><X size={14} /></Button>}
    </div><TicketTable key={JSON.stringify(search)} tickets={tickets} resetFilters={clear} /></section>
    <p className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground"><ListFilter size={13} />{hasFilters ? `${tickets.length} solicitações correspondem aos filtros selecionados.` : "48 solicitações fictícias · 18 a 24 de novembro de 2026"}</p>
  </>;
}