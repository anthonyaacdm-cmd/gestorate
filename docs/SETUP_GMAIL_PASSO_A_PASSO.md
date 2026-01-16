
# 📧 Como Configurar Gmail para Enviar Emails - Guia Completo

## a) O que é Gmail SMTP? 🤔
SMTP é a linguagem que os computadores usam para enviar emails. Para o n8n enviar emails "como você" (usando seu endereço @gmail.com), ele precisa de permissão.

Mas atenção: **NÃO use sua senha normal do Gmail!** O Google bloqueia por segurança. Vamos criar uma "Senha de Aplicativo" (App Password) específica para isso.

---

## b) Passo 1: Acessar Gmail 🌐
1.  Acesse sua conta Google em [myaccount.google.com](https://myaccount.google.com/).
2.  Certifique-se de estar logado na conta que enviará os emails (ex: a conta do consultório).

---

## c) Passo 2: Ativar 2FA (Verificação em 2 Etapas) 🔐
Para criar senhas de app, o 2FA **precisa** estar ativado.

1.  No menu esquerdo, clique em **Segurança** (Security).
2.  Em "Como você faz login no Google", procure por **Verificação em duas etapas**.
3.  Se estiver "Desativado", clique e siga os passos para ativar (usando seu celular).

---

## d) Passo 3: Gerar App Password 🔑
1.  Ainda em **Segurança**, na barra de busca no topo, digite "Senhas de app" (App passwords).
    *   *Se não achar, o link direto é: https://myaccount.google.com/apppasswords*
2.  Dê um nome para o app, ex: `Sistema Agendamentos n8n`.
3.  Clique em **Criar**.

---

## e) Passo 4: Copiar credenciais 📝
1.  O Google mostrará uma senha de 16 letras numa caixa amarela (ex: `abcd efgh ijkl mnop`).
2.  **Copie essa senha!** Você não conseguirá vê-la novamente depois de fechar a janela.
    *   *Nota: Os espaços não importam, pode copiar tudo junto ou separado.*

---

## f) Passo 5: Integrar com n8n 🤖
1.  Volte ao seu workflow no n8n.
2.  No nó do **Gmail**, clique em **Credentials** > **Create New**.
3.  **User/Email**: Seu endereço de email completo (ex: `doutor.exemplo@gmail.com`).
4.  **Password**: A senha de 16 letras que você acabou de gerar (NÃO a sua senha de login normal).
5.  **Host**: `smtp.gmail.com`
6.  **Port**: `465`
7.  **SSL/TLS**: Ativado.
8.  Clique em **Save**.

---

## g) Passo 6: Testar envio de email 🧪
1.  No nó do Gmail no n8n, clique em **Test step** ou **Execute Node**.
2.  Verifique se apareceu uma mensagem verde "Success".
3.  Corra na sua caixa de entrada (ou na caixa para onde você mandou). O email chegou?

---

## h) Troubleshooting (Resolução de Problemas) 🔧

**Problema:** "Invalid credentials" ou erro de autenticação.
*   **Solução 1:** Você usou sua senha normal de login. Use a Senha de App de 16 letras!
*   **Solução 2:** Você digitou o email errado no campo User.

**Problema:** "Connection timed out".
*   **Solução:** Verifique se a porta é `465` e SSL está `True`. Ou tente porta `587` com TLS `True`.

---

### Checklist de Verificação ✅
- [ ] 2FA ativado na conta Google.
- [ ] Senha de App (16 letras) gerada.
- [ ] Credencial criada no n8n usando a Senha de App.
- [ ] Teste de envio realizado com sucesso.

Próximo passo: Configurar o arquivo .env! 🔐
