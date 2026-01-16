
# Guia de Configuração do Webhook n8n

Este guia fornece as informações essenciais para conectar o Sistema de Agendamentos ao n8n.

> **Documentação Detalhada Disponível:**
> - Para um fluxo completo com Email e WhatsApp, veja [N8N_COMPLETE_FLOW.md](./N8N_COMPLETE_FLOW.md).
> - Para uma lista de verificação de setup, veja [N8N_SETUP_CHECKLIST.md](./N8N_SETUP_CHECKLIST.md).
> - Para referência completa dos dados enviados, veja [WEBHOOK_PAYLOAD_REFERENCE.md](./WEBHOOK_PAYLOAD_REFERENCE.md).

## Configuração Rápida

### 1. No n8n
1.  Crie um novo Workflow.
2.  Adicione um nó **Webhook**.
3.  Configure o método como `POST`.
4.  Defina o caminho como `/webhook/appointments`.
5.  Copie a URL de produção (ex: `https://seu-n8n.com/webhook/appointments`).

### 2. No Aplicativo (Arquivo `.env.local`)
Edite ou crie o arquivo `.env.local` na raiz do projeto e adicione:

