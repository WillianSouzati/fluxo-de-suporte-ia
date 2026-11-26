# Fluxo de suporte IA

Crie uma aplicação web chamada Fluxo de suporte por IA.

OBJETIVO
Uma plataforma de atendimento inteligente que utiliza inteligência artificial para receber, classificar, priorizar e organizar solicitações de clientes.

IMPORTANTE
Quero uma interface profissional, moderna, intuitiva e responsiva. O sistema deve parecer um produto SaaS real, adequado para uma demonstração de portfólio profissional.

IDENTIDADE VISUAL
- Interface moderna e limpa.
- Fundo predominantemente branco ou cinza muito claro.
- Azul como cor principal.
- Cards discretos, cantos levemente arredondados e boa organização visual.
- Menu lateral para navegação.
- Design profissional, sem excesso de elementos.

ESTRUTURA

1. DASHBOARD
Criar um painel inicial com:
- Total de solicitações.
- Solicitações pendentes.
- Solicitações de alta prioridade.
- Solicitações concluídas.
- Lista das solicitações recentes.
- Distribuição das solicitações por categoria.

2. SOLICITAÇÕES
Criar uma página com tabela contendo:
- Número do atendimento.
- Nome do cliente.
- Assunto.
- Categoria.
- Prioridade.
- Status.
- Data de recebimento.

Permitir visualizar e filtrar solicitações por categoria, prioridade e status.

3. NOVO ATENDIMENTO
Criar um formulário para registrar uma solicitação com:
- Nome do cliente.
- E-mail.
- Assunto.
- Descrição detalhada do problema.

Incluir um botão para enviar a solicitação.

4. DETALHES DO ATENDIMENTO
Criar uma visualização contendo:
- Solicitação original.
- Resumo gerado pela IA.
- Categoria identificada.
- Prioridade sugerida.
- Setor recomendado.
- Resposta inicial sugerida pela IA.
- Status do atendimento.

5. CATEGORIAS
Utilizar categorias como:
- Acesso à conta.
- Pagamentos.
- Problemas técnicos.
- Entrega e pedidos.
- Cancelamento.
- Outros.

6. PRIORIDADES
Utilizar:
- Baixa.
- Média.
- Alta.
- Urgente.

7. STATUS
Utilizar:
- Novo.
- Em atendimento.
- Aguardando cliente.
- Concluído.

REGRAS DESTA PRIMEIRA ETAPA
- Crie somente a interface e a estrutura visual.
- Utilize dados fictícios claramente identificados como demonstração.
- Não implemente ainda banco de dados, autenticação ou integração com IA.
- Não crie funcionalidades falsas que aparentem estar conectadas a um backend.
- Deixe a estrutura preparada para futura integração com Supabase e Google Gemini.
- Não utilize serviços pagos.
- Não altere outros projetos.

Quero uma aplicação visualmente consistente, com navegação funcional entre as páginas e uma excelente experiência de uso.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e9ccf347-da6a-4607-9741-d53e0df331b4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
