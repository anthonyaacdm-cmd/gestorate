
# Gestorate - Guia Completo de Testes
### Instruções passo a passo para testar todas as funcionalidades

**Última atualização:** 24 de Janeiro de 2026

## 📑 Índice
1. [Seção A: Preparação para Testes](#seção-a-preparação-para-testes)
2. [Seção B: Teste 1 - Login e Autenticação](#seção-b-teste-1---login-e-autenticação)
3. [Seção C: Teste 2 - Dashboard](#seção-c-teste-2---dashboard)
4. [Seção D: Teste 3 - Calendário](#seção-d-teste-3---calendário)
5. [Seção E: Teste 4 - Agendamentos Públicos](#seção-e-teste-4---agendamentos-públicos)
6. [Seção F: Teste 5 - Relatórios](#seção-f-teste-5---relatórios)
7. [Seção G: Teste 6 - Agendamento de Relatórios](#seção-g-teste-6---agendamento-de-relatórios)
8. [Seção H: Teste 7 - Responsividade Completa](#seção-h-teste-7---responsividade-completa)
9. [Seção I: Teste 8 - Dark Mode](#seção-i-teste-8---dark-mode)
10. [Seção J: Teste 9 - Animações e Transições](#seção-j-teste-9---animações-e-transições)
11. [Seção K: Teste 10 - Performance](#seção-k-teste-10---performance)
12. [Seção L: Teste 11 - Banco de Dados](#seção-l-teste-11---banco-de-dados)
13. [Seção M: Teste 12 - Erros e Edge Cases](#seção-m-teste-12---erros-e-edge-cases)
14. [Seção N: Checklist Final](#seção-n-checklist-final)
15. [Seção O: Troubleshooting](#seção-o-troubleshooting)

---

## Seção A: Preparação para Testes

Antes de iniciar os testes, certifique-se de que o ambiente está configurado corretamente.

*   **Checklist de pré-requisitos:**
    *   [ ] Node.js (v20+) instalado
    *   [ ] npm instalado
    *   [ ] Navegador moderno (Chrome, Firefox, Edge ou Safari)
*   **Verificar se app está rodando:**
    *   Execute `npm run dev` no terminal.
    *   Acesse `http://localhost:5173` no navegador. A página inicial deve carregar.
*   **Verificar Supabase:**
    *   Acesse o Dashboard do seu projeto Supabase.
    *   Confirme se o status do projeto é "Active".
*   **Verificar dados:**
    *   Confirme via SQL Editor ou Table Editor se as tabelas `users`, `appointments` e `scheduled_reports` possuem dados de teste (se não, execute o script de seed).
*   **Limpar cache do navegador:**
    *   Pressione `Ctrl+Shift+Delete` (ou Cmd+Shift+Delete no Mac) e limpe imagens e arquivos em cache.
*   **Abrir DevTools:**
    *   Pressione `F12` ou clique com botão direito > Inspecionar para monitorar o Console e a aba Network durante os testes.

---

## Seção B: Teste 1 - Login e Autenticação

Este teste verifica se diferentes tipos de usuários conseguem acessar o sistema e suas respectivas áreas.

1.  **Passo 1:** Acessar `http://localhost:5173/login`.
2.  **Passo 2:** Fazer login com **Master Admin**.
    *   **Email:** `master@gestorate.com`
    *   **Senha:** `Master@123` (ou a senha definida no seu seed)
    *   **Esperado:** Redirecionar para `/admin-dashboard`.
    *   **Verificar:** Nome do usuário aparece no header/menu.
3.  **Passo 3:** Fazer logout.
    *   Clicar no avatar/perfil > Logout.
    *   **Esperado:** Redirecionar para a página de login (`/login` ou `/`).
4.  **Passo 4:** Fazer login com **Admin 1**.
    *   **Email:** `admin1@gestorate.com`
    *   **Senha:** `Admin@123`
    *   **Esperado:** Redirecionar para `/admin-dashboard`.
5.  **Passo 5:** Fazer login com **Usuário Regular**.
    *   **Email:** `user@gestorate.com`
    *   **Senha:** `User@123`
    *   **Esperado:** Redirecionar para `/user-dashboard` (Dashboard do Cliente).
6.  **Passo 6:** Testar "Esqueci minha senha".
    *   Na página de login, clicar em "Esqueci minha senha" (se implementado) ou verificar fluxo de recuperação.
    *   Inserir email válido.
    *   **Esperado:** Mensagem de sucesso (ex: "Email de recuperação enviado").
7.  **Passo 7:** Verificar dados do usuário.
    *   Estando logado, acessar `/profile`.
    *   **Verificar:** Nome, email e telefone aparecem corretamente e correspondem ao usuário logado.

**Checklist:**
- [ ] Login Master Admin funciona
- [ ] Login Admin funciona
- [ ] Login User funciona
- [ ] Logout funciona
- [ ] Recuperação de senha funciona
- [ ] Dados do usuário aparecem corretamente no perfil

---

## Seção C: Teste 2 - Dashboard

Verificação dos elementos visuais e funcionais do painel administrativo.

1.  **Passo 1:** Fazer login como Master Admin.
2.  **Passo 2:** Acessar `/admin-dashboard`.
    *   **Esperado:** Página carrega com os cartões de KPI (Total de Agendamentos, Usuários Ativos, Taxa de Confirmação, Receita, etc.).
3.  **Passo 3:** Verificar KPIs.
    *   Verificar se os números não estão zerados (assumindo que há dados).
    *   Verificar se os ícones aparecem ao lado dos números.
    *   Verificar se as cores indicativas (verde para alta, vermelho para baixa, etc.) estão corretas.
4.  **Passo 4:** Verificar gráficos.
    *   Gráfico de Agendamentos por Mês deve renderizar.
    *   Gráfico de Usuários Ativos/Inativos deve renderizar.
    *   Gráfico de Agendamentos por Dia deve renderizar.
    *   **Esperado:** Gráficos carregam e animam em menos de 2 segundos.
5.  **Passo 5:** Testar Dark Mode.
    *   Clicar no ícone de lua/sol no header.
    *   **Esperado:** O tema da página muda para escuro (fundo escuro, texto claro).
    *   **Verificar:** Textos e gráficos continuam legíveis.
    *   Clicar novamente para voltar ao modo claro.
6.  **Passo 6:** Testar Responsividade.
    *   Abrir DevTools (F12) e ativar "Toggle device toolbar" (Ctrl+Shift+M).
    *   **iPhone 12 (375px):** Menu deve virar hambúrguer ou barra inferior; cards devem empilhar em uma coluna.
    *   **iPad (768px):** Layout deve se ajustar (ex: 2 colunas de cards).
    *   **Desktop (1440px):** Layout completo (3-4 colunas).
7.  **Passo 7:** Verificar Animações.
    *   Recarregar a página (F5).
    *   Verificar o efeito *fade-in* dos cards.
    *   Verificar o efeito *slide-up* das barras dos gráficos.
    *   Verificar efeitos de *hover* ao passar o mouse sobre os cards.

**Checklist:**
- [ ] KPIs aparecem com dados
- [ ] Gráficos carregam corretamente
- [ ] Dark mode funciona e é legível
- [ ] Responsividade ok em mobile/tablet/desktop
- [ ] Animações funcionam suavemente
- [ ] Sem erros vermelhos no console

---

## Seção D: Teste 3 - Calendário

Teste da visualização e gerenciamento de agendamentos via calendário.

1.  **Passo 1:** Fazer login como Master Admin.
2.  **Passo 2:** Acessar `/calendar` (ou `/admin/calendar`).
    *   **Esperado:** Calendário grande aparece preenchido com os agendamentos existentes.
3.  **Passo 3:** Verificar agendamentos.
    *   Agendamentos **Confirmados** devem ter cor distinta (ex: verde).
    *   Agendamentos **Pendentes** devem ter cor distinta (ex: amarelo).
    *   Agendamentos **Cancelados** devem ter cor distinta (ex: vermelho).
4.  **Passo 4:** Interação com o dia.
    *   Clicar em um dia ou slot que tenha agendamento.
    *   **Esperado:** Modal abre mostrando detalhes (Cliente, Horário, Serviço, Status).
5.  **Passo 5:** Filtrar por status (se funcionalidade existir).
    *   Clicar no filtro e selecionar "Confirmado".
    *   **Esperado:** O calendário atualiza mostrando apenas os verdes.
6.  **Passo 6:** Testar Responsividade.
    *   **Mobile:** Calendário deve permitir scroll horizontal ou mudar para visualização de lista/diária.
    *   **Tablet:** Deve ocupar ~80-90% da tela.
    *   **Desktop:** Deve ocupar o espaço principal confortavelmente.
7.  **Passo 7:** Testar Dark Mode.
    *   Ativar dark mode.
    *   **Verificar:** Linhas de grade e textos de dias/horas estão legíveis sobre o fundo escuro.

**Checklist:**
- [ ] Calendário carrega
- [ ] Agendamentos aparecem nas datas corretas
- [ ] Cores corretas por status
- [ ] Modal de detalhes abre e fecha
- [ ] Filtros funcionam
- [ ] Responsividade ok
- [ ] Dark mode legível

---

## Seção E: Teste 4 - Agendamentos Públicos

Teste crítico: o fluxo que o cliente final utiliza.

1.  **Passo 1:** Acessar `http://localhost:5173/book` (ou a rota pública configurada) **SEM** estar logado (use janela anônima se necessário).
    *   **Esperado:** Página pública carregada, mostrando lista de profissionais/admins.
2.  **Passo 2:** Verificar lista de admins.
    *   Deve aparecer foto (avatar), nome e especialidade.
    *   Botão "Agendar" deve estar visível e clicável.
3.  **Passo 3:** Iniciar agendamento.
    *   Clicar em "Agendar" em um dos perfis.
    *   **Esperado:** Redireciona para a página de agendamento daquele profissional.
    *   **Verificar:** Nome do profissional selecionado aparece no topo.
4.  **Passo 4:** Preencher formulário.
    *   **Nome:** "João Silva Teste"
    *   **Email:** "joao.teste@email.com"
    *   **Telefone:** "(11) 98765-4321"
    *   **Data:** Selecionar uma data futura disponível.
    *   **Horário:** Selecionar um slot de horário disponível.
    *   **Tipo de Serviço:** Selecionar uma opção da lista.
    *   **Notas:** "Teste de agendamento público."
5.  **Passo 5:** Submeter.
    *   Clicar em "Confirmar Agendamento".
    *   **Esperado:** Spinner de carregamento aparece, seguido por mensagem de sucesso ou redirecionamento para página de confirmação.
6.  **Passo 6:** Verificar persistência (Backend).
    *   Acessar o Dashboard do Supabase > Tabela `appointments`.
    *   Filtrar pelos registros mais recentes.
    *   **Verificar:** O novo agendamento está lá com status "pending" (ou conforme regra de negócio) e os dados corretos.
7.  **Passo 7:** Testar validação.
    *   Voltar para `/book` e tentar agendar novamente.
    *   Clicar em "Confirmar" **SEM** preencher nada.
    *   **Esperado:** Mensagens de erro ("Campo obrigatório") aparecem em vermelho abaixo dos inputs.
8.  **Passo 8:** Testar em Mobile.
    *   Usar DevTools em modo iPhone 12.
    *   Repetir o fluxo.
    *   **Verificar:** Inputs fáceis de tocar, botões com tamanho adequado, sem quebra de layout.

**Checklist:**
- [ ] Lista de profissionais carrega
- [ ] Formulário abre corretamente
- [ ] Validação impede envio vazio
- [ ] Agendamento é salvo no banco
- [ ] Dados batem com o preenchido
- [ ] Responsividade mobile ok
- [ ] Feedback visual (sucesso/erro) funciona

---

## Seção F: Teste 5 - Relatórios

1.  **Passo 1:** Fazer login como Master Admin.
2.  **Passo 2:** Acessar `/reports`.
    *   **Esperado:** Página carrega com painel de filtros e área de visualização.
3.  **Passo 3:** Verificar filtros disponíveis.
    *   Período (Data Início/Fim), Status, Tipo de Relatório.
4.  **Passo 4:** Filtrar por período.
    *   Definir datas para um intervalo que você sabe que tem dados (ex: mês atual).
    *   Clicar em "Aplicar Filtros".
    *   **Esperado:** A lista/tabela atualiza mostrando apenas registros dentro das datas.
5.  **Passo 5:** Filtrar por status.
    *   Selecionar status "Confirmado".
    *   Clicar em "Aplicar".
    *   **Esperado:** Apenas agendamentos confirmados aparecem.
6.  **Passo 6:** Exportar PDF.
    *   Clicar no botão "Exportar PDF".
    *   **Esperado:** O navegador baixa um arquivo `.pdf` (ex: `relatorio_agendamentos_2026.pdf`).
    *   **Verificar:** Abrir o arquivo e conferir se os dados estão legíveis.
7.  **Passo 7:** Exportar Excel.
    *   Clicar no botão "Exportar Excel".
    *   **Esperado:** Download de arquivo `.xlsx`.
    *   **Verificar:** Abrir no Excel/Google Sheets e conferir colunas.
8.  **Passo 8:** Exportar CSV.
    *   Clicar no botão "Exportar CSV".
    *   **Esperado:** Download de arquivo `.csv`.
9.  **Passo 9:** Responsividade da Tabela.
    *   Em modo mobile/tablet, verificar se a tabela permite scroll horizontal para ver todas as colunas sem quebrar o layout da página.

**Checklist:**
- [ ] Painel de filtros visível
- [ ] Filtro de data funciona
- [ ] Filtro de status funciona
- [ ] Exportação PDF funciona
- [ ] Exportação Excel funciona
- [ ] Exportação CSV funciona
- [ ] Tabela responsiva (scroll horizontal se necessário)

---

## Seção G: Teste 6 - Agendamento de Relatórios

1.  **Passo 1:** Login como Master Admin.
2.  **Passo 2:** Acessar `/scheduled-reports`.
    *   **Esperado:** Lista de relatórios agendados existentes.
3.  **Passo 3:** Criar novo relatório agendado.
    *   Botão "+ Novo Relatório".
    *   **Nome:** "Teste Relatório Semanal".
    *   **Frequência:** "Semanal".
    *   **Dia/Hora:** Segunda-feira, 09:00.
    *   **Destinatários:** `admin@gestorate.com`.
    *   **Formato:** "PDF".
    *   Salvar.
    *   **Esperado:** Mensagem de sucesso e o item aparece na lista.
4.  **Passo 4:** Editar relatório.
    *   Clicar no ícone de editar (lápis).
    *   Alterar nome para "Teste Relatório Semanal - Editado".
    *   Salvar.
    *   **Esperado:** Nome atualizado na lista.
5.  **Passo 5:** Ver histórico (se disponível).
    *   Clicar para ver detalhes/histórico.
    *   **Esperado:** Modal ou página mostrando execuções anteriores (data, status).
6.  **Passo 6:** Deletar relatório.
    *   Clicar no ícone de lixeira.
    *   Confirmar.
    *   **Esperado:** Item desaparece da lista.
7.  **Passo 7:** Validação.
    *   Tentar criar novo sem preencher campos obrigatórios.
    *   **Esperado:** Mensagens de erro impedem o salvamento.

**Checklist:**
- [ ] Lista carrega
- [ ] Criação funciona
- [ ] Edição funciona
- [ ] Histórico visível
- [ ] Deleção funciona
- [ ] Validação de formulário ok

---

## Seção H: Teste 7 - Responsividade Completa

Teste focado em CSS e layout em diferentes dispositivos.

1.  **Passo 1:** DevTools (F12) > Toggle Device Toolbar.
2.  **Passo 2:** **Mobile (iPhone 12 - 375px)**.
    *   Navegar por `/admin-dashboard`, `/calendar`, `/reports`.
    *   **Verificar:** Menu hambúrguer funcionando. Cards empilhados. Sem scroll horizontal indesejado na página (apenas em tabelas específicas). Botões e inputs com altura clicável (>44px).
3.  **Passo 3:** **Tablet (iPad - 768px)**.
    *   **Verificar:** Menu lateral visível (ou hambúrguer, dependendo do design). Grid de cards se ajusta (2 colunas). Gráficos legíveis.
4.  **Passo 4:** **Desktop (1440px)**.
    *   **Verificar:** Uso eficiente do espaço (3-4 colunas de cards). Menu lateral fixo.
5.  **Passo 5:** Orientação Landscape.
    *   Girar o dispositivo mobile no DevTools.
    *   **Verificar:** Layout se adapta fluidamente.

**Checklist:**
- [ ] Mobile (375px) ok
- [ ] Tablet (768px) ok
- [ ] Desktop (1440px) ok
- [ ] Orientação Landscape ok
- [ ] Sem scroll horizontal na página principal (body)
- [ ] Elementos de toque com tamanho adequado

---

## Seção I: Teste 8 - Dark Mode

1.  **Passo 1:** Login como Admin.
2.  **Passo 2:** Acessar `/admin-dashboard`.
3.  **Passo 3:** Ativar Dark Mode (ícone Lua).
    *   **Verificar:** Fundo escuro, textos claros. Cards e modais com fundo levemente mais claro que o body, mas ainda escuros. Contraste adequado.
4.  **Passo 4:** Navegação.
    *   Ir para `/calendar`, `/reports`, `/user-dashboard`.
    *   **Verificar:** O tema escuro persiste durante a navegação.
5.  **Passo 5:** Desativar Dark Mode (ícone Sol).
    *   **Verificar:** Volta ao tema claro instantaneamente.
6.  **Passo 6:** Persistência.
    *   Ativar Dark Mode.
    *   Recarregar a página (F5).
    *   **Esperado:** A página recarrega já no modo escuro (preferência salva no localStorage).
7.  **Passo 7:** Mobile.
    *   Testar a troca de tema no modo mobile do DevTools.

**Checklist:**
- [ ] Ativação funciona
- [ ] Cores e contraste adequados
- [ ] Aplica-se a todas as páginas
- [ ] Desativação funciona
- [ ] Preferência persiste após F5
- [ ] Funciona em mobile

---

## Seção J: Teste 9 - Animações e Transições

1.  **Passo 1:** Login como Admin.
2.  **Passo 2:** Acessar Dashboard.
3.  **Passo 3:** Fade-in.
    *   Recarregar página.
    *   **Observar:** Elementos aparecem suavemente (fade-in) e não "pipocam" na tela bruscamente. Duração aprox. 0.5s.
4.  **Passo 4:** Slide-up.
    *   **Observar:** Conteúdos principais (gráficos, tabelas) deslizam levemente de baixo para cima ao entrar.
5.  **Passo 5:** Hover Effects.
    *   Passar mouse em cards, botões e links do menu.
    *   **Esperado:** Mudança de cor, leve escala ou sombra indicando interatividade. Transições suaves (CSS transition).
6.  **Passo 6:** Loaders.
    *   Acessar uma página que carrega dados (ex: `/reports`).
    *   **Esperado:** Spinner giratório ou Skeleton screens aparecem enquanto os dados são buscados.
7.  **Passo 7:** Navegação.
    *   Clicar entre links do menu lateral.
    *   **Esperado:** Troca de página rápida e suave.

**Checklist:**
- [ ] Fade-in inicial
- [ ] Slide-up de conteúdo
- [ ] Hover effects em elementos interativos
- [ ] Spinners/Skeletons de carregamento visíveis
- [ ] Transições sem "flicker" (piscar)

---

## Seção K: Teste 10 - Performance

1.  **Passo 1:** DevTools > Aba **Lighthouse** ou **Performance**.
2.  **Passo 2:** Login como Admin e acessar Dashboard.
3.  **Passo 3:** Executar análise (Lighthouse).
    *   Gerar relatório para "Desktop".
    *   **Metas:** Performance > 80.
4.  **Passo 4:** Métricas manuais (Aba Performance).
    *   **FCP (First Contentful Paint):** Conteúdo aparece em < 1.5s.
    *   **LCP (Largest Contentful Paint):** Principal elemento visível em < 2.5s.
    *   **CLS (Cumulative Layout Shift):** Página não fica "dançando" enquanto carrega (< 0.1).
5.  **Passo 5:** Console e Network.
    *   Aba **Console**: Verificar se há erros vermelhos (não deve haver). Warnings amarelos devem ser mínimos.
    *   Aba **Network**: Recarregar página. Verificar tempo total de load (< 3s em conexão 4G/Wifi). Tamanho total transferido idealmente < 2-3MB.
6.  **Passo 6:** Slow Network.
    *   Network > Throttling > "Slow 3G".
    *   Recarregar.
    *   **Esperado:** App não quebra, mostra loaders/skeletons por mais tempo, mas eventualmente carrega.

**Checklist:**
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1 (layout estável)
- [ ] Console sem erros críticos
- [ ] Load total razoável
- [ ] Resiliente a conexão lenta

---

## Seção L: Teste 11 - Banco de Dados

1.  **Passo 1:** Acessar Supabase Dashboard.
2.  **Passo 2:** Verificar Tabelas.
    *   `appointments`: Deve conter os registros criados nos testes anteriores.
    *   `users`: Deve listar os usuários (Master, Admins, Users).
    *   `scheduled_reports`: Deve listar os relatórios criados.
3.  **Passo 3:** Consultas SQL rápidas (SQL Editor).
    *   `SELECT COUNT(*) FROM appointments;` (Deve ser > 0).
    *   `SELECT * FROM appointments LIMIT 5;` (Verificar integridade dos dados).
4.  **Passo 4:** Relacionamentos.
    *   Verificar se `user_id` e `admin_id` na tabela `appointments` correspondem a IDs válidos na tabela `users`.
5.  **Passo 5:** RLS (Row Level Security).
    *   No Supabase > Authentication > Policies.
    *   Confirmar que RLS está habilitado (verde) nas tabelas sensíveis.
    *   Confirmar que usuários regulares não veem dados de outros usuários (testado na Seção B, mas validado aqui na configuração).

**Checklist:**
- [ ] Tabelas populadas corretamente
- [ ] Relacionamentos íntegros (Foreign Keys)
- [ ] RLS Ativo e configurado

---

## Seção M: Teste 12 - Erros e Edge Cases

1.  **Passo 1:** Agendamento vazio.
    *   Tentar enviar formulário de agendamento em branco.
    *   **Esperado:** Bloqueio e mensagens de erro.
2.  **Passo 2:** Datas inválidas.
    *   Tentar agendar data no passado (se a UI permitir seleção).
    *   **Esperado:** Erro "Data inválida" ou bloqueio no calendário.
3.  **Passo 3:** Login inválido.
    *   Tentar logar com email não cadastrado ou formato inválido (`teste@com`).
    *   **Esperado:** Mensagem "Email ou senha incorretos" ou "Email inválido".
4.  **Passo 4:** Acesso não autorizado (Rotas protegidas).
    *   Logar como Usuário Regular.
    *   Tentar acessar `/admin-dashboard` via barra de endereço.
    *   **Esperado:** Redirecionamento para `/user-dashboard` ou Home, com alerta "Sem permissão".
5.  **Passo 5:** JavaScript desabilitado.
    *   DevTools > Ctrl+Shift+P > "Disable JavaScript".
    *   Recarregar.
    *   **Esperado:** Mensagem `<noscript>` informando que o JS é necessário (tela branca ou mensagem amigável, não app quebrado visualmente).
    *   *Reabilitar JS após o teste.*

**Checklist:**
- [ ] Validações de formulário robustas
- [ ] Bloqueio de datas passadas
- [ ] Tratamento de erro no login
- [ ] Proteção de rotas (Guards) funcionando
- [ ] Comportamento com JS desativado verificado

---

## Seção N: Checklist Final

Para considerar o aplicativo pronto para produção (ou release candidate), todos os itens abaixo devem estar marcados:

- [ ] Todos os testes de Login e Autenticação passaram.
- [ ] Dashboard exibe dados corretos e responsivos.
- [ ] Calendário funcional (visualização, detalhes, filtros).
- [ ] Fluxo de Agendamento Público completo e validado.
- [ ] Relatórios geram e exportam corretamente.
- [ ] CRUD de Agendamento de Relatórios funcionando.
- [ ] Responsividade aprovada em Mobile, Tablet e Desktop.
- [ ] Dark Mode consistente em todo o app.
- [ ] Animações suaves e sem bugs visuais.
- [ ] Performance aceitável (Métricas Core Web Vitals).
- [ ] Banco de dados íntegro e seguro (RLS).
- [ ] Tratamento de erros e validações cobrindo casos de borda.
- [ ] Console do navegador limpo de erros críticos.

**✅ SE TUDO ESTIVER MARCADO: O APP ESTÁ PRONTO!**

---

## Seção O: Troubleshooting

Soluções rápidas para problemas comuns durante os testes.

*   **App não carrega / Tela Branca:**
    *   Verifique se o servidor `npm run dev` está rodando.
    *   Verifique o Console (F12) para erros de importação ou sintaxe.
    *   Limpe o cache ou tente em aba anônima.

*   **Supabase não conecta / Erro de Rede:**
    *   Verifique se o arquivo `.env.local` existe e contém `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` corretos.
    *   Verifique sua conexão com a internet.
    *   Verifique se há bloqueadores de anúncios/trackers impedindo a conexão.

*   **Login não funciona:**
    *   Verifique se o usuário existe na tabela `auth.users` do Supabase.
    *   Verifique se a senha está correta (se for ambiente dev, pode resetar no banco se souber como, ou criar novo usuário).
    *   Limpe o Local Storage (Application > Local Storage > Clear).

*   **Dados não aparecem no Dashboard/Gráficos:**
    *   Confirme se há dados nas tabelas.
    *   Verifique se as Policies RLS permitem que o usuário logado veja aqueles dados.
    *   Verifique erros de console relacionados a `403 Forbidden` ou `400 Bad Request`.

*   **Responsividade quebrada:**
    *   Verifique se a meta tag `viewport` está presente no `index.html`.
    *   Confirme se as classes Tailwind (ex: `md:grid-cols-2`, `lg:grid-cols-4`) estão corretas.

*   **Como reportar bugs:**
    *   Ao encontrar um erro, anote:
        1.  Passos exatos para reproduzir.
        2.  O que aconteceu vs. O que deveria acontecer.
        3.  Print do erro no Console (se houver).
        4.  Dispositivo/Navegador usado.
    *   Envie para a equipe de desenvolvimento (bugs@gestorate.com ou canal Slack).
