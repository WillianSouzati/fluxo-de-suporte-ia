import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, FlaskConical, LoaderCircle, LockKeyhole, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DemoNote, PageHeading } from "@/components/support-ui";
import { processSupportTicket, processingErrorMessage } from "@/lib/support-service";
import { rememberSubmittedTicket } from "@/lib/submitted-tickets";
import type { SubmittedTicket } from "@/lib/support-data";

export const Route = createFileRoute("/novo-atendimento")({
  head: () => ({ meta: [
    { title: "Novo atendimento | Fluxo de suporte por IA" },
    { name: "description", content: "Envie uma solicitação fictícia para processamento e análise por IA no Fluxo e consulte o resultado do seu atendimento." },
    { property: "og:title", content: "Novo atendimento | Fluxo de suporte por IA" },
    { property: "og:description", content: "Novo atendimento com classificação, prioridade e resposta retornadas pela IA. Utilize informações fictícias." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NewRequest,
});

function NewRequest() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const submitting = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmittedTicket | null>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", description: "" });
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || result) return;
    submitting.current = true;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await processSupportTicket({ customer_name: form.name.trim(), customer_email: form.email.trim(), subject: form.subject.trim(), description: form.description.trim() });
      rememberSubmittedTicket(queryClient, response.ownerId, response.ticket);
      setResult(response.ticket);
      await navigate({ to: "/solicitacoes/$id", params: { id: response.ticket.id } });
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : processingErrorMessage);
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  }
  const change = (key: keyof typeof form, value: string) => { setForm(current => ({ ...current, [key]: value })); setError(null); };

  return <><PageHeading title="Novo atendimento" subtitle="Cada bom atendimento começa com uma escuta atenta."><Button variant="outline" asChild className="bg-card"><Link to="/solicitacoes"><ArrowLeft size={14} />Voltar às solicitações</Link></Button></PageHeading><div className="mb-6"><DemoNote>O envio é processado por IA e armazenado. Utilize apenas informações fictícias. A resposta sugerida não é enviada ao cliente.</DemoNote></div>
    <div className="form-layout"><form onSubmit={event => void submit(event)} className="surface" aria-busy={isSubmitting}><div className="table-section-heading border-b border-border"><div><h2 className="section-title">Dados da solicitação</h2><p className="section-subtitle">Novo registro · Demonstração</p></div><FileText size={18} className="text-muted-foreground" /></div><div className="form-body">{result ? <div className="flex min-h-[348px] flex-col items-center justify-center gap-4 text-center" role="status"><span className="grid size-14 place-items-center rounded-full bg-success-soft text-success"><CheckCircle2 size={27} /></span><h2 className="font-display text-xl font-bold">Atendimento processado!</h2><p className="max-w-sm text-xs leading-[1.9] text-muted-foreground">Sua solicitação foi registrada. O resultado retornado está disponível nos detalhes.</p><Button asChild variant="outline" className="mt-3"><Link to="/solicitacoes/$id" params={{ id: result.id }}>Ver resultado do atendimento<ArrowRight size={14} /></Link></Button></div> : <div className="form-grid"><div className="field"><label htmlFor="customer-name">Nome do cliente <span className="text-primary">*</span></label><Input id="customer-name" autoComplete="off" placeholder="Ex.: Ana Oliveira" required disabled={isSubmitting} value={form.name} onChange={event => change("name", event.target.value)} /></div><div className="field"><label htmlFor="customer-email">E-mail <span className="text-primary">*</span></label><Input id="customer-email" type="email" autoComplete="off" placeholder="Ex.: ana@example.com" required disabled={isSubmitting} value={form.email} onChange={event => change("email", event.target.value)} /></div><div className="field field-full"><label htmlFor="subject">Assunto <span className="text-primary">*</span></label><Input id="subject" placeholder="Ex.: Não consigo acessar minha conta" required disabled={isSubmitting} value={form.subject} onChange={event => change("subject", event.target.value)} /></div><div className="field field-full"><label htmlFor="description">Descrição detalhada <span className="text-primary">*</span></label><Textarea id="description" placeholder="Descreva o que aconteceu e inclua os detalhes relevantes para o atendimento..." required disabled={isSubmitting} value={form.description} onChange={event => change("description", event.target.value)} /><span className="text-right text-[9px] text-muted-foreground">{form.description.length} caracteres</span></div></div>}{error && !result && <p role="alert" className="mt-5 rounded-md border border-danger/20 bg-danger-soft p-3 text-xs leading-relaxed text-danger">{error}</p>}</div><div className="form-actions"><span className="privacy-notice text-[10px] text-muted-foreground"><LockKeyhole size={12} className="mt-0.5 shrink-0" /><span>Ambiente de demonstração. Os dados enviados são armazenados para processamento e análise por IA. Utilize informações fictícias.</span></span>{result ? <Button type="button" onClick={() => { setForm({ name: "", email: "", subject: "", description: "" }); setResult(null); setError(null); }}><FlaskConical size={14} />Novo atendimento</Button> : <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <LoaderCircle size={14} className="animate-spin motion-reduce:animate-none" /> : <Send size={14} />}{isSubmitting ? "Processando..." : error ? "Tentar novamente" : "Enviar solicitação"}</Button>}</div></form>
    <aside className="form-aside"><section className="aside-section"><span className="mb-4 inline-flex rounded-md bg-info-soft p-2 text-primary"><FlaskConical size={20} /></span><h2 className="text-sm font-semibold">Ambiente de demonstração</h2><p className="mt-3 text-xs leading-[1.9] text-muted-foreground">Solicitações fictícias com processamento real por IA. Nenhuma mensagem é enviada ao cliente.</p></section><section className="aside-section"><h2 className="text-[11px] font-semibold">Neste atendimento</h2><div className="aside-step"><span className="step-icon"><FileText size={16} /></span><div><p className="text-xs font-medium">Solicitação original</p><p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">Informações fictícias do cliente e do problema.</p></div></div><div className="aside-step"><span className="step-icon"><Sparkles size={16} /></span><div><p className="text-xs font-medium">Análise por IA</p><p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">Classificação e resposta retornadas para esta solicitação.</p></div></div></section><Button asChild variant="link" className="mt-3 px-0 text-xs"><Link to="/solicitacoes/$id" params={{ id: "1048" }}>Ver um atendimento de exemplo<ArrowRight size={14} /></Link></Button></aside></div>
  </>;
}