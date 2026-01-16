
# Checklist de Configuração n8n

Use este checklist para garantir que sua integração entre o Sistema de Agendamentos e o n8n está configurada corretamente do início ao fim.

## 1. Pré-requisitos
- [ ] Instância n8n rodando (Cloud, Docker ou Local via npm).
- [ ] Acesso administrativo ao Sistema de Agendamentos (App).
- [ ] Acesso ao servidor/arquivo `.env.local` do App.
- [ ] Contas de provedores de serviço (Gmail/SMTP, Twilio/Meta/Baileys).

## 2. Configuração do Webhook (n8n)
- [ ] Criar novo Workflow no n8n.
- [ ] Adicionar nó **Webhook**.
- [ ] Configurar método para **POST**.
- [ ] Definir caminho (Path) como `/webhook/appointments`.
- [ ] Salvar Workflow e ativá-lo (Toggle Active).
- [ ] Copiar a **Production URL** do Webhook.

## 3. Configuração do Aplicativo (Web App)
- [ ] Abrir arquivo `.env.local`.
- [ ] Definir variável `VITE_N8N_WEBHOOK_BASE_URL`.
    - **Atenção**: Coloque apenas a base da URL (ex: `https://n8n.meusite.com`). O App adiciona `/webhook/appointments` automaticamente.
- [ ] (Opcional) Definir `VITE_SUPABASE_WEBHOOK_SECRET` se for validar no n8n.
- [ ] Reiniciar o servidor de desenvolvimento (`npm run dev`) para carregar as novas variáveis.

## 4. Teste de Conexão
- [ ] No n8n, clique em **Listen for Test Event** (se usar URL de Teste) ou monitore as execuções (se Produção).
- [ ] No App, faça login como Admin ou Cliente.
- [ ] Crie um novo agendamento.
- [ ] Verifique no n8n se o evento foi recebido com status verde.
- [ ] Verifique se o JSON recebido contém os campos `client`, `admin`, `date`, `time`.

## 5. Configuração de Notificações
- [ ] **Email**: Adicionar nó de envio de email.
    - [ ] Autenticar com provedor.
    - [ ] Mapear campos `To`, `Subject` e `Body` usando expressões (`{{...}}`).
    - [ ] Testar envio.
- [ ] **WhatsApp**: Adicionar nó de envio de mensagem.
    - [ ] Autenticar com provedor.
    - [ ] Mapear número de telefone (`admin.phone` ou `client.phone`).
    - [ ] Testar envio.

## 6. Validação Final
- [ ] Simular criação de agendamento -> Verificar recebimento de Email/Whats.
- [ ] Simular cancelamento de agendamento -> Verificar recebimento de aviso de cancelamento.
- [ ] Verificar logs no console do navegador (`F12`) para mensagens de sucesso/erro do webhook.
