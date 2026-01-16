
# 🔐 Usuários e Credenciais - Gestorate

Este documento lista os usuários pré-configurados no banco de dados (Seed Data) para facilitar o teste e desenvolvimento das funcionalidades do sistema.

> **Nota de Segurança:** Estas credenciais são **exclusivas para ambiente de desenvolvimento**. Em produção, todas as senhas devem ser alteradas imediatamente e o acesso ao banco de dados deve ser restrito.

## 👥 Lista de Usuários Padrão

Abaixo estão os usuários criados automaticamente pelos scripts de migração (`seed_users.sql`).

| Nome | E-mail | Senha | Função (Role) | Status | Descrição |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Master Admin** | `master@gestorate.com` | `123456` | `master` | Ativo | Superusuário com acesso total irrestrito a todas as configurações. |
| **Admin Geral** | `admin@gestorate.com` | `123456` | `admin` | Ativo | Administrador padrão para gestão de agendamentos e relatórios. |
| **Dra. Ana Silva** | `ana@gestorate.com` | `123456` | `admin` | Ativo | Perfil de profissional de saúde (médica) para testar agenda médica. |
| **Dr. Carlos Santos**| `carlos@gestorate.com` | `123456` | `admin` | Ativo | Perfil de profissional de saúde para testes de múltiplos admins. |
| **Usuário Teste** | `user@gestorate.com` | `123456` | `user` | Ativo | Paciente padrão para testar fluxo de agendamento e perfil. |
| **Maria Oliveira** | `maria@gestorate.com` | `123456` | `user` | Ativo | Paciente adicional para testes de volume de dados. |
| **João Souza** | `joao@gestorate.com` | `123456` | `user` | Inativo | Usuário inativo para testar bloqueios de acesso. |

---

## 🚀 Como Fazer Login

1.  Acesse a rota `/login` no navegador.
2.  Insira um dos e-mails listados acima.
3.  Utilize a senha padrão `123456`.
4.  Clique em "Entrar".

Se o login falhar, verifique se as migrações do Supabase (Seed) foram executadas corretamente no seu ambiente local.

---

## ➕ Como Criar Novos Usuários

### Via Interface (Admin)
1.  Faça login com uma conta `admin` ou `master`.
2.  Navegue até o menu **Usuários** (`/users`).
3.  Clique no botão **"Novo Usuário"**.
4.  Preencha o formulário e defina a função desejada.

### Via Interface (Público)
1.  Acesse a rota `/register`.
2.  Preencha o formulário de cadastro.
3.  O usuário será criado automaticamente com a função `user` (Cliente).

---

## ⚠️ Notas Importantes

*   **Roles**:
    *   `master`: Pode deletar outros admins e acessar configurações sensíveis.
    *   `admin`: Pode gerenciar agendamentos de todos, ver relatórios e gerenciar usuários comuns.
    *   `user`: Pode apenas gerenciar seus próprios agendamentos e dados de perfil.
*   **Reset de Senha**: Em desenvolvimento, o envio de e-mail pode ser simulado. Acesse `/admin/users` para editar senhas diretamente se necessário.
