import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Bell, Blocks, Building2, ChevronRight, CircleHelp, FlaskConical, FolderClosed, Inbox, LayoutDashboard, Menu, PanelLeftClose, Plus, Search, Sparkles, Workflow, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/support-ui";
import { demoTickets } from "@/lib/support-data";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/solicitacoes", label: "Solicitações", icon: Inbox },
  { to: "/novo-atendimento", label: "Novo atendimento", icon: Plus },
  { to: "/categorias", label: "Categorias", icon: FolderClosed },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: state => state.location.pathname });
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const currentLabel = path.startsWith("/solicitacoes/") ? "Detalhes do atendimento" : navItems.find(item => item.to === path)?.label ?? "Workspace";

  function toggleSidebar() {
    if (window.matchMedia("(max-width: 700px)").matches) setMobileOpen(value => !value);
    else setCollapsed(value => !value);
  }

  function search(event: FormEvent) {
    event.preventDefault();
    void navigate({ to: "/solicitacoes", search: { q: query } });
  }

  return <div className={`app-shell${collapsed ? " collapsed" : ""}${mobileOpen ? " mobile-open" : ""}`}>
    <Button variant="ghost" className="mobile-overlay" aria-label="Fechar menu" onClick={() => setMobileOpen(false)} />
    <aside className="app-sidebar" aria-label="Menu principal">
      <Link to="/" className="brand" aria-label="Fluxo de suporte por IA — Dashboard" onClick={() => setMobileOpen(false)}>
        <span className="brand-mark"><Workflow size={23} strokeWidth={2.2} /></span>
        <span className="brand-copy"><span className="brand-name">fluxo<span className="text-primary">.</span></span><span className="brand-caption block">SUPORTE POR IA</span></span>
      </Link>
      <div className="workspace-switch"><span className="workspace-icon"><Building2 size={16} /></span><div><p className="text-[11px] font-semibold">Meu workspace</p><p className="mt-0.5 text-[9px] text-muted-foreground">Ambiente de demonstração</p></div><Blocks className="ml-auto text-muted-foreground" size={13} /></div>
      <p className="nav-label">PRINCIPAL</p>
      <nav className="sidebar-nav">{navItems.map(item => {
        const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
        return <Link key={item.to} to={item.to} aria-label={item.label} className={`nav-item${active ? " active" : ""}`} aria-current={active ? "page" : undefined} title={collapsed ? item.label : undefined} onClick={() => setMobileOpen(false)}><item.icon size={18} strokeWidth={1.7} /><span className="nav-text">{item.label}</span>{item.to === "/solicitacoes" && <span className="nav-count">{demoTickets.length}</span>}</Link>;
      })}</nav>
      <div className="sidebar-bottom">
        <div className="demo-aside"><span className="demo-aside-icon"><FlaskConical size={16} /></span><p className="text-[11px] font-semibold">Um espaço para explorar</p><p className="mt-2 text-[10px] leading-[1.8] text-muted-foreground">Painel com dados de exemplo.<br />Novo atendimento com IA.</p><span className="mt-3 inline-flex items-center gap-1.5 text-[9px] font-medium text-primary"><span className="size-1.5 rounded-full bg-primary" />Modo demonstração</span></div>
        <div className="sidebar-profile"><span className="avatar">FL</span><div><p className="text-[11px] font-semibold">Workspace de exemplo</p><p className="mt-1 text-[9px] text-muted-foreground">Acesso de demonstração</p></div></div>
      </div>
    </aside>
    <div className="app-main">
      <header className="topbar">
        <IconButton label={collapsed ? "Expandir menu" : "Recolher menu"} onClick={toggleSidebar} className="-ml-2 hidden size-7 text-muted-foreground min-[701px]:inline-flex"><PanelLeftClose size={17} /></IconButton>
        <IconButton label={mobileOpen ? "Fechar menu" : "Abrir menu"} onClick={toggleSidebar} className="-ml-2 size-7 text-muted-foreground min-[701px]:hidden"><Menu size={18} /></IconButton>
        <div className="flex items-center gap-3 text-[11px]"><span className="breadcrumb-workspace text-muted-foreground">Workspace</span><ChevronRight size={12} className="breadcrumb-workspace text-muted-foreground" /><span className="font-medium">{currentLabel}</span></div>
        <form className="topbar-search" onSubmit={search} role="search"><Search size={14} /><Input value={query} onChange={event => setQuery(event.target.value)} aria-label="Buscar solicitações no workspace" placeholder="Buscar no workspace..." /></form>
        <span className="demo-label">Demonstração</span>
        <span className="topbar-divider" />
        <Dialog><DialogTrigger asChild><Button variant="ghost" size="icon" className="hidden size-7 text-muted-foreground sm:inline-flex" aria-label="Sobre a demonstração" title="Sobre a demonstração"><CircleHelp size={17} /></Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Fluxo de suporte por IA</DialogTitle><DialogDescription className="pt-3 leading-relaxed">O painel e as listas exibem atendimentos fictícios com análises de exemplo. No formulário de novo atendimento, os dados enviados são armazenados e processados por IA com acesso anônimo. O resultado fica disponível na aba de envio e não aparece nas listas públicas. Utilize informações fictícias. Nenhuma mensagem é enviada ao cliente.</DialogDescription></DialogHeader></DialogContent></Dialog>
        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Atividade de demonstração" title="Atividade de demonstração" className="size-7 text-muted-foreground"><Bell size={17} /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="notification-list"><DropdownMenuLabel className="mb-2 text-xs">Atividade de demonstração</DropdownMenuLabel>{demoTickets.slice(0, 3).map(ticket => <Link key={ticket.id} to="/solicitacoes/$id" params={{ id: ticket.id }} className="notification-item"><span className="mt-1 rounded-md bg-info-soft p-1.5 text-primary"><Inbox size={14} /></span><div><p className="text-[11px] font-medium">{ticket.subject}</p><p className="mt-1 text-[10px] text-muted-foreground">#{ticket.id} · {ticket.customer}</p></div></Link>)}</DropdownMenuContent></DropdownMenu>
        <span className="avatar size-7 text-[9px]" title="Workspace de demonstração">FL</span>
      </header>
      <main className="page-content entrance" key={path}>{children}<footer className="page-footer"><span>© 2026 Fluxo de suporte por IA</span><span className="footer-brand"><FlaskConical size={11} />Dados fictícios para demonstração</span></footer></main>
    </div>
  </div>;
}