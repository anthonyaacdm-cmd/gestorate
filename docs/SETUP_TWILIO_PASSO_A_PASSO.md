
# 💬 Como Configurar Twilio para WhatsApp - Guia Completo

## a) O que é Twilio? 🤔
O **Twilio** é como um carteiro digital. Você entrega a mensagem para ele, e ele entrega no WhatsApp do seu cliente. O WhatsApp não deixa qualquer site mandar mensagem direto para evitar spam, então usamos o Twilio como intermediário autorizado.

---

## b) Passo 1: Criar conta Twilio 🌐
1.  Acesse [twilio.com](https://www.twilio.com).
2.  Clique em **"Sign up and start building"** (Cadastre-se).
3.  Preencha seus dados. Você precisará verificar seu email e seu número de telefone pessoal.
    *   *Nota: A conta gratuita dá um crédito inicial para testar.*

---

## c) Passo 2: Copiar Account SID e Auth Token 🔑
Assim que você entra no Dashboard (painel principal):
1.  Role a página um pouco para baixo.
2.  Procure a seção **Account Info**.
3.  Você verá:
    *   **Account SID**: (Começa com `AC...`)
    *   **Auth Token**: (Clique em "show" para ver)
4.  Copie esses dois códigos e guarde-os. Vamos usar no **n8n** e no **.env**.

---

## d) Passo 3: Configurar WhatsApp Sandbox 📦
Para contas gratuitas/teste, você não pode mandar mensagem para qualquer um. Você usa uma "Sandbox" (Caixa de Areia).

1.  No menu lateral, vá em **Messaging** > **Try it out** > **Send a WhatsApp message**.
2.  A tela mostrará instruções para ativar a Sandbox.
3.  Geralmente, pede para você enviar uma mensagem de WhatsApp (do seu celular) para um número deles com um código específico (ex: `join heavy-metal`).
4.  Faça isso. Se der certo, a tela vai atualizar dizendo "Message Received!".
    *   *Isso autoriza o Twilio a mandar mensagens para O SEU número.*

---

## e) Passo 4: Testar envio de mensagem 🧪
Na mesma tela da Sandbox:
1.  Clique em "Next Step".
2.  Você verá um botão para enviar um template de teste ("Your appointment is coming up...").
3.  Clique em **Make Request** ou **Send**.
4.  Verifique seu WhatsApp. Chegou? Ótimo! 🎉

---

## f) Passo 5: Integrar com n8n 🤖
Agora voltamos ao n8n para conectar o Twilio lá.

1.  No nó do **Twilio/WhatsApp** no n8n.
2.  Em **Credentials**, selecione "Create New".
3.  Cole o **Account SID** e o **Auth Token** que você copiou no Passo 2.
4.  Em **From** (De), você deve usar o número da Sandbox do Twilio (ex: `whatsapp:+14155238886`).
5.  Em **To** (Para), coloque o seu número (que você autorizou no Passo 3).

---

## g) Troubleshooting (Resolução de Problemas) 🔧

**Problema:** "Message not sent" ou erro 63015.
*   **Solução:** O número de destino não autorizou a Sandbox. Lembre-se: em modo de teste, CADA pessoa que for receber mensagem precisa mandar o código "join..." para o número do Twilio antes.

**Problema:** Credenciais inválidas.
*   **Solução:** Verifique se copiou o Account SID e Auth Token inteiros, sem espaços extras.

---

### Checklist de Verificação ✅
- [ ] Conta Twilio criada.
- [ ] SID e Token copiados.
- [ ] Sandbox ativada (mandei o "join..." do meu celular).
- [ ] Mensagem de teste recebida no meu celular.
- [ ] Credenciais configuradas no n8n.

Próximo passo: Configurar o Gmail! 📧
