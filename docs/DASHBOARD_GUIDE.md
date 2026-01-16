
# 📊 Guia do Dashboard Administrativo

O Dashboard é o centro de comando do seu negócio. Ele foi projetado para oferecer insights rápidos e acionáveis em uma única tela.

---

## 1. Visão Geral 🔭
O objetivo do dashboard é responder a três perguntas em menos de 5 segundos:
1.  Como está meu negócio hoje?
2.  Qual é a tendência do mês?
3.  O que preciso fazer agora?

---

## 2. Cartões de KPI (Key Performance Indicators) 📈

Estes são os cartões coloridos no topo da página.

*   **Total de Agendamentos (Mês):**
    *   *O que é:* Soma de todos os agendamentos (pendentes, confirmados, concluídos) nos últimos 30 dias.
    *   *Interpretação:* Volume bruto de trabalho.
*   **Taxa de Ocupação (%):**
    *   *Cálculo:* (Horas Agendadas / Horas Disponíveis Totais) * 100.
    *   *Meta:* Idealmente entre 70-85%. Abaixo de 50% indica ociosidade; acima de 90% indica necessidade de expandir ou aumentar preços.
*   **Receita Mensal:**
    *   *O que é:* Estimativa financeira baseada nos serviços agendados.
    *   *Indicador:* Acompanha um ícone de tendência (verde para alta, vermelho para baixa).
*   **Novos Clientes:**
    *   *O que é:* Contagem de usuários únicos que fizeram seu *primeiro* agendamento neste período.
    *   *Importância:* Indica saúde do marketing e crescimento da base.

---

## 3. Gráficos e Visualizações 📊

*   **Agendamentos por Dia (Barras):**
    *   Mostra os últimos 30 dias. Ajuda a identificar padrões semanais (ex: "Segundas são fracas, Sextas são cheias").
*   **Serviços Mais Populares (Pizza/Donut):**
    *   Mostra a distribuição dos tipos de exames/consultas. Ajuda a entender qual serviço traz mais volume.
*   **Receita Mensal (Linha):**
    *   Tendência dos últimos 6-12 meses. Fundamental para ver a saúde financeira a longo prazo.
*   **Atividade de Usuários:**
    *   Mostra proporção de usuários ativos vs. inativos.

---

## 4. Como Interpretar os Dados 🧠

*   **Alta Ocupação + Baixa Receita:** Você pode estar cobrando pouco ou fazendo muitos serviços de baixo valor.
*   **Baixa Ocupação + Novos Clientes Altos:** Seu marketing funciona, mas talvez a retenção seja baixa (clientes não voltam).
*   **Picos em dias específicos:** Use isso para planejar folgas ou promoções em dias fracos.

---

## 5. Atualização de Dados 🔄

*   **Tempo Real:** Os dados são buscados diretamente do banco de dados (Supabase) ao carregar a página.
*   **Cache:** Para performance, alguns cálculos complexos podem ter cache de alguns minutos.
*   **Atualização Manual:** Recarregue a página (F5) para forçar uma nova busca.

---

## 6. Personalização e Filtros ⚙️

*   **Filtro de Período:** Use o seletor no topo direito (Últimos 30 dias, Mês Atual, Ano) para ajustar todos os gráficos e KPIs.
*   **Dark Mode:** O dashboard é totalmente compatível com modo escuro para visualização noturna confortável.

---

## 7. Solução de Problemas (Troubleshooting) 🔧

*   **"Dados Zerados":** Verifique se o filtro de data está correto. Se você acabou de instalar o sistema, é normal não ter histórico.
*   **Gráficos Carregando Infinitamente:** Pode ser problema de conexão. Verifique sua internet ou o console do navegador (F12) para erros vermelhos.
*   **Valores incorretos:** Os relatórios consideram apenas agendamentos não-cancelados para cálculo de receita, a menos que especificado o contrário.
