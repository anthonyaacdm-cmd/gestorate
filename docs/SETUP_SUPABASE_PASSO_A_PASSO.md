
# 🗄️ Como Configurar Supabase - Guia Completo para Iniciantes

## a) O que é Supabase? 🤔
Imagine que o **Supabase** é um arquivo digital gigante na nuvem. É lá que vamos guardar todas as informações importantes do seu sistema:
*   Quem são os usuários?
*   Quais são os horários marcados?
*   Quais dias os médicos estão disponíveis?

Sem o Supabase, seu aplicativo não tem "memória". Ele precisa desse banco de dados para lembrar das coisas.

---

## b) Passo 1: Acessar Supabase 🌐
1.  Abra seu navegador e vá para [supabase.com](https://supabase.com).
2.  Clique no botão verde **"Start your project"** (Iniciar seu projeto).
3.  Faça login com sua conta do GitHub (se tiver) ou crie uma conta nova.

---

## c) Passo 2: Criar novo projeto 🆕
1.  Clique no botão **"New Project"**.
2.  Escolha sua organização (geralmente seu nome de usuário).
3.  Preencha os campos:
    *   **Name**: Dê um nome, ex: `Sistema Agendamentos`.
    *   **Database Password**: Crie uma senha FORTE e anote-a! (Você vai precisar dela raramente, mas é vital).
    *   **Region**: Escolha a região mais próxima de você (ex: `South America (São Paulo)`).
4.  Clique em **"Create new project"**.
    *   *Aguarde alguns minutos enquanto o Supabase configura tudo para você.* ⏳

---

## d) Passo 3: Copiar credenciais 🔑
Você precisa de duas "chaves" para seu site conversar com o Supabase.

1.  No painel do seu projeto, vá no menu lateral esquerdo e clique no ícone de engrenagem ⚙️ (**Project Settings**).
2.  Clique em **"API"**.
3.  Você verá uma seção chamada **Project URL**. Copie a URL.
    *   Esta é a `SUPABASE_URL`.
4.  Abaixo, em **Project API keys**, você verá a chave `anon` `public`. Copie essa chave longa.
    *   Esta é a `SUPABASE_ANON_KEY`.

⚠️ **IMPORTANTE**: Nunca compartilhe a chave `service_role` (a chave secreta) em locais públicos. Use apenas a `anon` no seu site.

---

## e) Passo 4: Aplicar migrations 🏗️
"Migrations" são como plantas de arquitetura. Elas dizem ao Supabase como construir as tabelas (gavetas) do seu banco de dados.

Você deve rodar os comandos SQL que estão na pasta `supabase/migrations` do seu projeto.

**Estrutura dos arquivos:**
