# Guia Completo de Configuração: n8n + WhatsApp + Supabase

Este documento fornece um guia passo a passo para configurar a automação de notificações via WhatsApp utilizando n8n e Supabase.

## Seção 1: Pré-requisitos

Antes de começar, certifique-se de ter:
1.  **Instância n8n Ativa**: Pode ser n8n Cloud ou self-hosted.
2.  **Node Baileys no n8n**: Necessário para comunicação com WhatsApp.
    - Se self-hosted: `npm install n8n-nodes-baileys`
3.  **WhatsApp para Teste**: Uma conta de WhatsApp (pessoal ou business) em um celular físico para escanear o QR Code.
4.  **Projeto Supabase**: Com as tabelas configuradas conforme a migração fornecida.
5.  **Telefone Admin**: O número `81997015454` será usado para notificações administrativas.

---

## Seção 2: Configuração do Baileys no n8n

1.  No n8n, crie uma nova credencial do tipo **Baileys**.
2.  Dê um nome (ex: "WhatsApp Principal").
3.  O n8n exibirá um **QR Code**.
4.  Abra o WhatsApp no seu celular > Aparelhos Conectados > Conectar um aparelho.
5.  Escaneie o QR Code.
6.  Aguarde a conexão ser estabelecida (status "Connected").

**Teste de Envio:**
1.  Crie um novo workflow de teste.
2.  Adicione um nó "Manually Trigger".
3.  Adicione um nó "Baileys".
4.  Selecione a operação "Send Text".
5.  No campo "Phone Number", coloque seu número (formato internacional, ex: `5581999999999`).
6.  Execute o nó. Se receber a mensagem, está funcionando.

---

## Seção 3: Workflow 1 - Nova Consulta (Usuário)

Este workflow notifica o usuário quando ele cria um agendamento.

1.  **Trigger (Webhook)**
    - Adicione um nó "Webhook".
    - Método: `POST`
    - Caminho: `/webhook/new-appointment`
    - Autenticação: None (ou Header Auth se configurado no Supabase).
2.  **Baileys (WhatsApp)**
    - Adicione um nó "Baileys".
    - Phone Number: Expression `{{$json.user_phone}}` (remova formatação se necessário).
    - Message: