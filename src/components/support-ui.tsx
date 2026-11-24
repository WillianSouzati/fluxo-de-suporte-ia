import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, ChevronsUp, Info, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Priority, Status } from "@/lib/support-data";

const priorityClasses: Record<Priority, string> = { Baixa: "priority-low", Média: "priority-medium", Alta: "priority-high", Urgente: "priority-urgent" };
const statusClasses: Record<Status, string> = { Novo: "status-new", "Em atendimento": "status-progress", "Aguardando cliente": "status-waiting", Concluído: "status-done" };

export function PriorityBadge({ priority }: { priority: Priority }) {
  const Icon = priority === "Baixa" ? ArrowDown : priority === "Urgente" ? ChevronsUp : priority === "Alta" ? ArrowUp : ArrowUpRight;
  return <span className={`priority-badge ${priorityClasses[priority]}`}><Icon size={10} strokeWidth={2} />{priority}</span>;
}

export function StatusBadge({ status }: { status: Status }) { return <span className={`status-badge ${statusClasses[status]}`}><span className="status-dot" />{status}</span>; }

export function PageHeading({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
  return <div className="page-heading"><div><h1 className="page-title">{title}</h1><p className="page-subtitle">{subtitle}</p></div>{children && <div className="page-actions">{children}</div>}</div>;
}

export function NewTicketButton() { return <Button asChild><Link to="/novo-atendimento"><Plus size={15} />Novo atendimento</Link></Button>; }

export function DemoNote({ children }: { children?: ReactNode }) { return <div className="demo-note"><Info size={16} /><p>{children ?? "Ambiente de demonstração. Todos os dados são fictícios. Nenhuma informação é enviada ou armazenada."}</p></div>; }

export function IconButton({ label, children, onClick, className = "" }: { label: string; children: ReactNode; onClick?: () => void; className?: string }) {
  return <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label={label} onClick={onClick} className={className}>{children}</Button></TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>;
}