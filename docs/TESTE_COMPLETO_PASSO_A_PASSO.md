
# 🧪 Como Testar Tudo - Guia Completo

Chegamos à reta final! Agora vamos ver a mágica acontecer. ✨

## a) Passo 1: Verificar se app está rodando 🖥️
1.  Certifique-se de que o comando `npm run dev` está rodando no seu terminal.
2.  Abra `http://localhost:5173` (ou a porta que aparecer) no navegador.
3.  O site abriu? Ótimo.

---

## b) Passo 2: Acessar página de agendamento público 📅
Vamos fingir que somos um cliente.

1.  Vá para a URL de agendamento público. Se você não sabe qual é, entre como Admin, vá em "Configurações" ou "Perfil" e procure "Link de Agendamento".
    *   *Geralmente é algo como: `http://localhost:5173/book/ID-DO-ADMIN`*

---

## c) Passo 3: Criar um agendamento de teste 📝
1.  Escolha uma data e horário disponíveis.
2.  Preencha o formulário:
    *   **Nome**: Teste Sistema
    *   **Email**: Use um email real seu (diferente do email que envia, para testar a recepção).
    *   **Telefone**: Use seu número de celular real (com DDD).
3.  Clique em **"Confirmar Agendamento"**.
4.  A tela de sucesso ("Agendamento Confirmado!") apareceu?

---

## d) Passo 4: Verificar se dados foram salvos no Supabase 🗄️
1.  Vá no painel do Supabase > **Table Editor** > **appointments**.
2.  Ordene pela coluna `created_at` (clique duas vezes no cabeçalho).
3.  O agendamento "Teste Sistema" apareceu lá no topo?
    *   ✅ **Banco de Dados: OK!**

---

## e) Passo 5: Verificar se webhook foi disparado no n8n 🎣
1.  Vá no painel do n8n.
2.  No menu esquerdo, clique em **Executions** (Execuções).
3.  Você deve ver uma nova linha verde (Success) no topo da lista.
4.  Se clicar nela, você vê o caminho que os dados fizeram.
    *   ✅ **Conexão Site -> n8n: OK!**

---

## f) Passo 6: Verificar se email foi enviado 📧
1.  Vá na caixa de entrada do email que você colocou no agendamento.
2.  Chegou um email de confirmação?
3.  Verifique também a pasta de Spam.
    *   ✅ **Envio de Email: OK!**

---

## g) Passo 7: Verificar se WhatsApp foi enviado 💬
1.  Vá no seu WhatsApp.
2.  Chegou a mensagem do número da Twilio?
    *   ✅ **Envio de WhatsApp: OK!**

---

## h) Troubleshooting (O que fazer se falhar) 🚑

**O site deu erro ao agendar:**
*   Verifique o console do navegador (F12 > Console). Se tiver erro vermelho de conexão, é o Supabase (Passo d). Verifique o `.env`.

**O agendamento salvou, mas o n8n não rodou:**
*   Verifique se a URL do Webhook no `.env` está correta.
*   Verifique se o workflow no n8n está **ATIVO** (verde).
*   Verifique os logs do servidor do site (terminal) para ver se teve erro ao chamar o webhook.

**O n8n rodou, mas deu erro no Email/Whats:**
*   Clique na execução "Failed" (vermelha) no n8n. Ele vai mostrar qual nó falhou.
*   Se for Gmail: Erro de senha (refaça a App Password).
*   Se for Twilio: Erro de "Not sent" (refaça a autorização da Sandbox).

---

### Checklist de Sucesso 🎉
- [ ] Agendamento feito no site.
- [ ] Registro apareceu no Supabase.
- [ ] Execução apareceu no n8n.
- [ ] Email recebido.
- [ ] WhatsApp recebido.

**PARABÉNS!** 🥳 Seu sistema de agendamento automatizado está 100% funcional.
