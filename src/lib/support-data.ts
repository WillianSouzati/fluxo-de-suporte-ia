export const categories = ["Problemas técnicos", "Acesso à conta", "Pagamentos", "Entrega e pedidos", "Cancelamento", "Outros"] as const;
export const priorities = ["Baixa", "Média", "Alta", "Urgente"] as const;
export const statuses = ["Novo", "Em atendimento", "Aguardando cliente", "Concluído"] as const;

export type Category = typeof categories[number];
export type Priority = typeof priorities[number];
export type Status = typeof statuses[number];

export interface Ticket {
  id: string;
  customer: string;
  email: string;
  subject: string;
  description: string;
  category: Category;
  priority: Priority;
  status: Status;
  receivedAt: string;
  summary: string;
  department: string;
  suggestedReply: string;
}

export const categoryDepartments: Record<Category, string> = {
  "Acesso à conta": "Suporte ao cliente",
  Pagamentos: "Financeiro",
  "Problemas técnicos": "Suporte técnico",
  "Entrega e pedidos": "Logística",
  Cancelamento: "Relacionamento",
  Outros: "Atendimento geral",
};

const scenarios: { customer: string; email: string; subject: string; category: Category; description: string; summary: string }[] = [
  { customer: "Ana Oliveira", email: "ana.oliveira@example.com", subject: "Não consigo acessar minha conta", category: "Acesso à conta", description: "Olá! Desde hoje pela manhã não consigo acessar minha conta. Ao tentar entrar com meu e-mail e senha, recebo a mensagem ‘Credenciais inválidas’. Já tentei redefinir a senha, mas o e-mail de recuperação não chegou, nem na caixa de spam.\n\nPreciso acessar meus pedidos com urgência. Podem me ajudar? Obrigada!", summary: "A cliente relata falha de acesso à conta e não recebeu o e-mail de recuperação de senha. A indisponibilidade impede a consulta de pedidos. Recomenda-se verificar o cadastro e o envio dos e-mails de recuperação." },
  { customer: "Carlos Mendes", email: "carlos.mendes@example.com", subject: "Cobrança duplicada no cartão", category: "Pagamentos", description: "Identifiquei duas cobranças de R$ 149,90 no meu cartão, referentes à mesma assinatura de novembro. A compra foi realizada uma única vez. Preciso da verificação e do estorno do valor duplicado.", summary: "O cliente identificou duas cobranças de R$ 149,90 para uma única assinatura de novembro e solicita análise e estorno da duplicidade." },
  { customer: "Juliana Costa", email: "juliana.costa@example.com", subject: "Pedido com entrega atrasada", category: "Entrega e pedidos", description: "Meu pedido #8291 deveria ter chegado ontem, mas o rastreamento não é atualizado há três dias. Gostaria de confirmar a previsão de entrega e saber se aconteceu algum problema com o transporte.", summary: "A cliente solicita atualização do pedido #8291, cuja entrega está atrasada e o rastreamento está sem atualização há três dias." },
  { customer: "Pedro Santos", email: "pedro.santos@example.com", subject: "Erro ao finalizar uma compra", category: "Problemas técnicos", description: "Ao clicar em finalizar compra, a página fica carregando e depois apresenta o erro 500. Tentei no Chrome e no Safari, mas o problema continua. O pagamento não chegou a ser confirmado.", summary: "O cliente encontra erro 500 ao finalizar a compra em dois navegadores diferentes. A falha bloqueia a conclusão do pedido e requer análise técnica." },
  { customer: "Mariana Lima", email: "mariana.lima@example.com", subject: "Cancelamento da assinatura", category: "Cancelamento", description: "Gostaria de cancelar minha assinatura ao final do período atual. Não tenho mais necessidade do serviço e quero confirmar que não haverá renovação automática no próximo mês.", summary: "A cliente solicita o cancelamento ao fim do período contratado e a confirmação de que a renovação automática será interrompida." },
  { customer: "Lucas Ferreira", email: "lucas.ferreira@example.com", subject: "Redefinição de senha", category: "Acesso à conta", description: "Esqueci minha senha e não tenho mais acesso ao telefone cadastrado. Ainda tenho acesso ao meu e-mail. Gostaria de atualizar o telefone e recuperar minha conta.", summary: "O cliente precisa recuperar a senha e atualizar o telefone cadastrado. Ele informa que ainda possui acesso ao e-mail da conta." },
  { customer: "Beatriz Almeida", email: "beatriz.almeida@example.com", subject: "Aplicativo fecha ao abrir relatórios", category: "Problemas técnicos", description: "O aplicativo fecha sozinho sempre que tento abrir o relatório mensal. Estou usando a versão mais recente no Android 15. Já reiniciei o aparelho, mas o erro permanece.", summary: "A cliente relata encerramento inesperado do aplicativo ao abrir o relatório mensal no Android 15, mesmo após reiniciar o aparelho." },
  { customer: "Rafael Martins", email: "rafael.martins@example.com", subject: "Dúvida sobre os planos disponíveis", category: "Outros", description: "Quero entender a diferença entre os planos Profissional e Equipe. Somos cinco pessoas e precisamos compartilhar o acesso aos relatórios. Qual seria a opção mais adequada?", summary: "O cliente deseja comparar os planos Profissional e Equipe para cinco usuários que precisam compartilhar relatórios." },
  { customer: "Camila Rocha", email: "camila.rocha@example.com", subject: "Atualização dos dados de pagamento", category: "Pagamentos", description: "Meu cartão venceu e preciso atualizar os dados antes da próxima cobrança. Onde posso fazer essa alteração? Quero evitar a interrupção da assinatura.", summary: "A cliente deseja atualizar o cartão vencido antes da próxima cobrança para evitar a interrupção do serviço." },
  { customer: "Bruno Ribeiro", email: "bruno.ribeiro@example.com", subject: "Alteração de endereço do pedido", category: "Entrega e pedidos", description: "Acabei de fazer o pedido #8307 e percebi que selecionei meu endereço antigo. O pedido ainda está em preparação. Preciso corrigir o endereço antes do envio.", summary: "O cliente solicita a correção do endereço do pedido #8307, que ainda se encontra em preparação." },
  { customer: "Fernanda Alves", email: "fernanda.alves@example.com", subject: "Falha ao exportar relatório", category: "Problemas técnicos", description: "Ao exportar o relatório de vendas em PDF, o arquivo fica em branco. A visualização na tela está normal. O problema começou após a última atualização.", summary: "A cliente relata que a exportação de relatórios em PDF gera arquivos em branco após a última atualização, embora os dados apareçam na tela." },
  { customer: "Diego Pereira", email: "diego.pereira@example.com", subject: "Página apresenta lentidão", category: "Problemas técnicos", description: "O painel está demorando mais de um minuto para abrir desde esta manhã. Minha conexão funciona normalmente em outros sites. O problema também acontece com outras pessoas da equipe.", summary: "O cliente relata lentidão no painel que afeta diversos integrantes da equipe, sem indícios de falha na conexão local." },
];

const activeStatuses: Status[] = ["Novo", "Em atendimento", "Aguardando cliente", "Novo", "Concluído", "Em atendimento", "Novo", "Aguardando cliente"];
const demoPriorities: Priority[] = ["Alta", "Urgente", "Média", "Alta", "Baixa", "Média", "Alta", "Baixa"];
const dailyCounts = [7, 6, 7, 5, 9, 6, 8];

export const demoTickets: Ticket[] = Array.from({ length: 48 }, (_, index) => {
  const scenario = scenarios[index % scenarios.length] ?? scenarios[0];
  if (!scenario) throw new Error("A demonstração precisa de um cenário.");
  let dayOffset = 0;
  let accumulated = dailyCounts[0] ?? 0;
  while (index >= accumulated && dayOffset < dailyCounts.length - 1) {
    dayOffset += 1;
    accumulated += dailyCounts[dayOffset] ?? 0;
  }
  const indexInDay = index - (accumulated - (dailyCounts[dayOffset] ?? 0));
  const date = new Date(Date.UTC(2026, 10, 24 - dayOffset, 14 - Math.floor(indexInDay / 3), 42 - indexInDay % 3 * 12));
  const status: Status = index < 18 ? activeStatuses[index % activeStatuses.length] ?? "Novo" : "Concluído";
  const firstName = scenario.customer.split(" ")[0] ?? scenario.customer;
  return {
    ...scenario,
    id: String(1048 - index),
    priority: demoPriorities[index % demoPriorities.length] ?? "Média",
    status,
    receivedAt: date.toISOString(),
    department: categoryDepartments[scenario.category],
    suggestedReply: `Olá, ${firstName}! Obrigado por entrar em contato. Recebemos sua solicitação sobre “${scenario.subject.toLocaleLowerCase("pt-BR")}” e entendemos a importância de resolver essa situação. Nossa equipe de ${categoryDepartments[scenario.category].toLocaleLowerCase("pt-BR")} vai analisar as informações e retornar com os próximos passos. Estamos à disposição!`,
  };
});

export interface TicketFilters { query?: string; category?: string; priority?: string; status?: string }

export function filterTickets(tickets: Ticket[], filters: TicketFilters): Ticket[] {
  const query = (filters.query ?? "").toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return tickets.filter(ticket => {
    const searchable = `${ticket.id} ${ticket.customer} ${ticket.subject} ${ticket.email}`.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return (!query || searchable.includes(query))
      && (!filters.category || filters.category === "all" || ticket.category === filters.category)
      && (!filters.priority || filters.priority === "all" || ticket.priority === filters.priority)
      && (!filters.status || filters.status === "all" || ticket.status === filters.status);
  });
}

export function getTicketStats(tickets: Ticket[]) {
  return {
    total: tickets.length,
    pending: tickets.filter(t => t.status !== "Concluído").length,
    highPriority: tickets.filter(t => t.status !== "Concluído" && (t.priority === "Alta" || t.priority === "Urgente")).length,
    completed: tickets.filter(t => t.status === "Concluído").length,
  };
}

export function initials(name: string): string { return name.split(" ").map(part => part[0] ?? "").slice(0, 2).join(""); }
export function formatTicketDate(value: string): string { return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" }).format(new Date(value)).replace(" de ", " ").replace(".", ""); }

export function ticketSearch(search: Record<string, unknown>): { q?: string; categoria?: string; prioridade?: string; status?: string } {
  return {
    ...(typeof search['q'] === "string" ? { q: search['q'] } : {}),
    ...(typeof search['categoria'] === "string" ? { categoria: search['categoria'] } : {}),
    ...(typeof search['prioridade'] === "string" ? { prioridade: search['prioridade'] } : {}),
    ...(typeof search['status'] === "string" ? { status: search['status'] } : {}),
  };
}