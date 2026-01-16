
# 🤖 Como Configurar n8n - Guia Completo para Iniciantes

## a) O que é n8n? 🤔
O **n8n** (pronuncia-se "n-eight-n") é como um gerente digital incansável. Ele fica esperando algo acontecer (ex: "Novo agendamento criado!") e então executa uma lista de tarefas que você mandou (ex: "Mandar email para o cliente" e "Mandar WhatsApp para o médico").

Sem ele, você teria que mandar essas mensagens manualmente toda vez.

---

## b) Passo 1: Acessar n8n 🌐
1.  Acesse [n8n.io](https://n8n.io).
2.  Você pode usar a versão **Cloud** (paga, mas tem teste grátis e é mais fácil) ou **Self-hosted** (grátis, mas você precisa instalar no seu computador ou servidor).
    *   *Recomendação para iniciantes:* Use o Cloud ou instale localmente com `npm install n8n -g` se souber usar o terminal.
3.  Faça login ou crie sua conta.

---

## c) Passo 2: Criar novo workflow 🆕
1.  No painel do n8n, clique em **"Add workflow"** (canto superior direito).
2.  Clique no nome "My workflow" no topo e mude para algo como `Notificações de Agendamento`.

---

## d) Passo 3: Adicionar Webhook Node 🎣
O "Webhook" é a orelha do n8n. É por onde ele "ouve" que algo aconteceu no seu site.

1.  Clique no botão **"+"** (Add first step).
2.  Digite `Webhook` na busca e selecione-o.
3.  Configure assim:
    *   **HTTP Method**: `POST` (Importante!)
    *   **Path**: `webhook/appointments`
    *   **Authentication**: `None` (Para facilitar o início).

