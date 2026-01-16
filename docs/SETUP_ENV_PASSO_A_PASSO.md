
# 🔐 Como Configurar Variáveis de Ambiente (.env) - Guia Completo

## a) O que é .env? 🤔
O arquivo `.env` (Environment Variables) é o "cofre" do seu projeto. É um arquivo de texto simples onde guardamos segredos que não devem ficar no meio do código (como senhas e chaves privadas).

O arquivo se chama `.env.local` no nosso projeto. O computador lê esse arquivo quando o site inicia.

---

## b) Passo 1: Localizar arquivo .env.local 📂
1.  Abra a pasta do seu projeto no VS Code ou no explorador de arquivos.
2.  Na raiz do projeto (onde está o `package.json`), procure um arquivo chamado `.env.local`.
    *   *Se não existir, procure `.env.local.example`, faça uma cópia dele e renomeie a cópia para `.env.local`.*

---

## c) Passo 2: Copiar credenciais do Supabase 🗄️
Abra o arquivo `.env.local`. Procure estas linhas e preencha com o que você copiou do **Guia Supabase**:

