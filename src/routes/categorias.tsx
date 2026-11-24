import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CreditCard, Ellipsis, FolderClosed, KeyRound, Package, Wrench, XCircle } from "lucide-react";
import { categories, categoryDepartments, demoTickets } from "@/lib/support-data";
import { DemoNote, NewTicketButton, PageHeading } from "@/components/support-ui";

export const Route = createFileRoute("/categorias")({
  head: () => ({ meta: [
    { title: "Categorias | Fluxo de suporte por IA" },
    { name: "description", content: "Conheça as seis categorias de atendimento do Fluxo, seus setores recomendados e solicitações demonstrativas." },
    { property: "og:title", content: "Categorias | Fluxo de suporte por IA" },
    { property: "og:description", content: "Atendimentos demonstrativos organizados por acesso à conta, pagamentos, problemas técnicos, pedidos, cancelamento e outros." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Categories,
});

const icons = [Wrench, KeyRound, CreditCard, Package, XCircle, Ellipsis];
const descriptions = ["Falhas, erros e funcionamento do produto.", "Login, senha e recuperação de acesso.", "Cobranças, faturas e formas de pagamento.", "Acompanhamento, entregas e alterações.", "Cancelamentos e encerramento de planos.", "Dúvidas e demais solicitações."];

function Categories() {
  return <><PageHeading title="Categorias" subtitle="Uma visão organizada de cada tipo de solicitação."><NewTicketButton /></PageHeading><div className="mb-5 flex items-center gap-2 text-[11px] text-muted-foreground"><FolderClosed size={14} /><span>6 categorias</span><span className="mx-1">·</span><span>48 solicitações de demonstração</span></div><div className="category-grid">{categories.map((category, index) => {
    const tickets = demoTickets.filter(ticket => ticket.category === category);
    const pending = tickets.filter(ticket => ticket.status !== "Concluído").length;
    const Icon = icons[index] ?? FolderClosed;
    return <Link to="/solicitacoes" search={{ categoria: category }} key={category} className={`surface category-card category-color-${index}`}><div className="flex items-start justify-between"><span className="category-card-icon"><Icon size={20} strokeWidth={1.7} /></span><ArrowRight size={15} className="text-muted-foreground" /></div><h2 className="text-sm font-semibold">{category}</h2><p className="mt-2 text-[11px] text-muted-foreground">{descriptions[index]}</p><div className="mt-6 flex items-baseline justify-between"><p className="text-[25px] font-semibold">{tickets.length}<span className="ml-2 text-[10px] font-normal text-muted-foreground">solicitações</span></p><span className="text-[10px] text-muted-foreground">{pending} pendentes</span></div><progress className="category-bar" value={tickets.length} max={demoTickets.length} aria-label={`Proporção de solicitações de ${category}`} /><p className="mt-4 text-[10px] text-muted-foreground">Setor recomendado: <span className="text-foreground">{categoryDepartments[category]}</span></p></Link>;
  })}</div><div className="mt-6"><DemoNote>As categorias, os setores e as contagens desta página são exemplos demonstrativos, separados dos resultados enviados pelo formulário.</DemoNote></div></>;
}