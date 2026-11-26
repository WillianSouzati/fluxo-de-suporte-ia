# AI Support Flow — Atendimento Inteligente com IA

Sistema de atendimento ao cliente com inteligência artificial para automatizar a análise, classificação e organização de solicitações de suporte.

**Aplicação:** https://fluxo-de-suporte-ia.lovable.app

## Sobre o projeto

O AI Support Flow é uma aplicação desenvolvida para demonstrar como a inteligência artificial pode apoiar processos de atendimento ao cliente.

A solução permite registrar solicitações de suporte e utilizar IA para analisar automaticamente o conteúdo enviado, identificar a categoria e a prioridade do atendimento, gerar um resumo do problema, indicar o departamento responsável e sugerir uma resposta ao cliente.

O projeto foi desenvolvido como uma demonstração prática da aplicação de inteligência artificial em processos de negócio e experiência do cliente.

## Problema e objetivo

O atendimento ao cliente envolve tarefas como leitura, interpretação, classificação e direcionamento de solicitações.

Essas atividades podem consumir tempo das equipes e gerar dificuldades na organização e priorização dos atendimentos.

O objetivo do projeto é demonstrar como a inteligência artificial pode auxiliar nesse processo, oferecendo informações estruturadas para apoiar a equipe de suporte e tornar o fluxo de atendimento mais organizado.

## Funcionalidades

- Cadastro de solicitações de atendimento.
- Análise automática das solicitações utilizando IA.
- Classificação por categoria.
- Identificação do nível de prioridade.
- Geração automática de resumo do problema.
- Sugestão de departamento responsável.
- Geração de respostas sugeridas ao cliente.
- Armazenamento das solicitações no banco de dados.
- Exibição dos resultados da análise após o processamento.
- Dashboard demonstrativo com indicadores e gráficos de atendimento.

## Tecnologias utilizadas

- **Lovable:** desenvolvimento da interface e publicação da aplicação.
- **Supabase:** banco de dados, autenticação e funções de backend.
- **Supabase Edge Functions:** processamento das solicitações e integração com serviços externos.
- **Google Gemini API:** análise e interpretação das solicitações por inteligência artificial.
- **GitHub:** versionamento e documentação do código-fonte.

## Arquitetura e fluxo da aplicação

1. O usuário acessa a aplicação e preenche o formulário de atendimento.
2. A solicitação é enviada para uma Supabase Edge Function.
3. A função valida os dados e registra a solicitação no banco de dados.
4. O conteúdo é encaminhado à API Google Gemini para análise.
5. A IA identifica a categoria, prioridade, resumo, departamento responsável e resposta sugerida.
6. Os resultados são armazenados no Supabase.
7. A aplicação apresenta ao usuário os resultados do processamento.

## Segurança e tratamento de dados

A integração com a API Gemini é realizada no backend, mantendo a chave de acesso armazenada nos Secrets do Supabase.

As operações que utilizam credenciais privilegiadas são executadas nas funções de backend, sem exposição dessas credenciais na interface pública.

A aplicação utiliza autenticação anônima para permitir o envio de solicitações sem exigir a criação de uma conta pelo visitante.

O ambiente é demonstrativo e utiliza dados fictícios nos testes. Não devem ser inseridas informações pessoais ou confidenciais.

## Testes realizados

Foram realizados testes funcionais para verificar:

- Preenchimento e envio do formulário.
- Comunicação com as Supabase Edge Functions.
- Integração com a API Google Gemini.
- Análise e classificação automática das solicitações.
- Geração de resumos e respostas sugeridas.
- Gravação dos registros no banco de dados.
- Retorno e apresentação dos resultados na interface.

Os cenários testados apresentaram funcionamento esperado.

## Limitações e melhorias futuras

Por se tratar de um projeto demonstrativo, algumas funcionalidades podem ser evoluídas futuramente:

- Implementação de painel administrativo.
- Gestão de usuários e permissões.
- Acompanhamento do histórico de atendimentos.
- Indicadores e relatórios baseados em dados reais.
- Evolução dos critérios de classificação e priorização.

## Autor

**Willian Scher**

Projeto desenvolvido com foco na aplicação prática de inteligência artificial em processos de negócio, automação de atendimento e experiência do cliente.
