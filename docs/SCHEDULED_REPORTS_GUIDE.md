
# Guia de Relatórios Agendados

O módulo de Relatórios Agendados permite automatizar o envio de relatórios do sistema por e-mail para administradores e partes interessadas.

## 1. Visão Geral

Este recurso permite:
- Criar agendamentos recorrentes (diários, semanais, mensais).
- Enviar relatórios em PDF, Excel ou CSV.
- Gerenciar destinatários múltiplos.
- Executar relatórios manualmente a qualquer momento ("Run Now").

## 2. Criando um Novo Agendamento

1. Acesse o menu **Agendamentos** na barra lateral.
2. Clique no botão **Novo Agendamento**.
3. Preencha o formulário:
   - **Nome**: Identificador do relatório (ex: "Relatório Semanal de Vendas").
   - **Tipo**: Escolha entre Agendamentos, Resumo, Clientes, etc.
   - **Formato**: PDF (melhor para leitura), Excel (melhor para dados).
   - **Frequência**: Periodicidade do envio.
   - **Horário**: Hora exata do envio (fuso horário do sistema).
   - **Destinatários**: Digite o e-mail e pressione Enter ou clique no botão `+`.

## 3. Integração com n8n

O sistema utiliza webhooks para se comunicar com o n8n (ferramenta de automação).

- Quando você cria/edita um relatório, o sistema envia um webhook para o n8n configurar o agendamento (Cron).
- O n8n deve ter um workflow escutando no endpoint configurado em `VITE_N8N_SCHEDULED_REPORTS_WEBHOOK_BASE_URL`.

### Setup do n8n (Resumo)

1. Crie um webhook no n8n: `POST /webhook/scheduled-reports`.
2. O webhook receberá um JSON com `action` ("upsert", "delete", "trigger_now") e os dados do relatório.
3. **Lógica Sugerida no n8n**:
   - Salvar os agendamentos em um banco de dados local do n8n ou usar o "Cron Node" dinamicamente se possível (embora complexo).
   - *Alternativa mais comum*: Ter um workflow Cron rodando a cada hora que consulta a tabela `scheduled_reports` do Supabase via API, filtra os que devem rodar naquela hora, gera o relatório e envia o e-mail.
   - O botão **Executar Agora** envia `action: trigger_now`, que deve pular a checagem de horário e gerar o relatório imediatamente.

## 4. Histórico de Execuções

Cada relatório possui um botão de **Histórico** (ícone de relógio).
- Mostra datas de execução.
- Status (Sucesso/Erro).
- Link para baixar o arquivo gerado (se armazenado).

## 5. Solução de Problemas

**O relatório não chegou no horário:**
- Verifique se o n8n está rodando.
- Verifique se o horário do servidor (timezone) está correto.
- Consulte o **Histórico** para ver se houve erro na geração.

**Erro ao criar agendamento:**
- Verifique se a variável de ambiente `VITE_N8N_SCHEDULED_REPORTS_WEBHOOK_BASE_URL` está configurada corretamente no arquivo `.env.local`.
