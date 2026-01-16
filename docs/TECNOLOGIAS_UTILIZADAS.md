
# 💻 Tecnologias Utilizadas - Gestorate

Este documento detalha todas as bibliotecas e dependências utilizadas no desenvolvimento do Gestorate, categorizadas por funcionalidade.

## 📦 Dependências de Produção (`dependencies`)

Estas bibliotecas são essenciais para o funcionamento da aplicação em tempo de execução.

### Frontend Framework & Core
| Pacote | Versão | Descrição | Documentação |
| :--- | :--- | :--- | :--- |
| **react** | `^18.3.1` | Biblioteca JavaScript para construção de interfaces. | [React Docs](https://react.dev/) |
| **react-dom** | `^18.3.1` | Renderizador do React para a DOM web. | [React DOM](https://react.dev/) |
| **react-router-dom** | `^6.21.2` | Roteamento declarativo para aplicações React. | [React Router](https://reactrouter.com/) |
| **vite** | `^4.4.5` | Build tool e servidor de desenvolvimento ultra-rápido. | [Vite](https://vitejs.dev/) |

### UI & Estilização
| Pacote | Versão | Descrição | Documentação |
| :--- | :--- | :--- | :--- |
| **tailwindcss** | `^3.4.17` | Framework CSS utilitário para design rápido. | [Tailwind CSS](https://tailwindcss.com/) |
| **tailwindcss-animate**| `^1.0.7` | Plugin para animações no Tailwind. | - |
| **lucide-react** | `^0.469.0` | Coleção de ícones SVG limpos e consistentes. | [Lucide](https://lucide.dev/) |
| **class-variance-authority** | `^0.7.1` | Utilitário para criar variantes de componentes (usado no Shadcn). | [CVA](https://cva.style/) |
| **clsx** | `^2.1.1` | Utilitário para construir strings de classe condicionalmente. | - |
| **tailwind-merge** | `^2.6.0` | Utilitário para mesclar classes Tailwind sem conflitos. | - |
| **@radix-ui/*** | `Variadas` | Primitivos de UI acessíveis e sem estilo (base do Shadcn/ui). | [Radix UI](https://www.radix-ui.com/) |

### Animações
| Pacote | Versão | Descrição | Documentação |
| :--- | :--- | :--- | :--- |
| **framer-motion** | `^11.15.0` | Biblioteca poderosa para animações complexas e gestos em React. | [Framer Motion](https://www.framer.com/motion/) |

### Backend & Dados
| Pacote | Versão | Descrição | Documentação |
| :--- | :--- | :--- | :--- |
| **@supabase/supabase-js** | `2.30.0` | Cliente oficial para interagir com o Supabase (Auth, DB, Realtime). | [Supabase](https://supabase.com/docs) |
| **axios** | `^1.6.5` | Cliente HTTP baseado em Promises para requisições externas. | [Axios](https://axios-http.com/) |
| **bcryptjs** | `^2.4.3` | Biblioteca para hash de senhas (segurança). | - |

### Calendário & Datas
| Pacote | Versão | Descrição | Documentação |
| :--- | :--- | :--- | :--- |
| **date-fns** | `^3.0.6` | Biblioteca leve para manipulação e formatação de datas. | [date-fns](https://date-fns.org/) |
| **react-calendar** | `^4.8.0` | Componente de calendário flexível. | - |
| **react-day-picker** | `^9.13.0` | Componente de seleção de datas (usado no DatePicker). | [DayPicker](https://react-day-picker.js.org/) |
| **react-big-calendar** | `^1.8.5` | Calendário completo estilo Google Calendar para gestão de agenda. | - |

### Gráficos & Visualização
| Pacote | Versão | Descrição | Documentação |
| :--- | :--- | :--- | :--- |
| **recharts** | `^2.10.0` | Biblioteca de gráficos composta construída com componentes React. | [Recharts](https://recharts.org/) |

### Exportação & Relatórios
| Pacote | Versão | Descrição | Documentação |
| :--- | :--- | :--- | :--- |
| **jspdf** | `^2.5.1` | Geração de arquivos PDF no lado do cliente. | [jsPDF](https://artskydj.github.io/jsPDF/docs/) |
| **jspdf-autotable** | `^3.8.1` | Plugin para criar tabelas automaticamente no jsPDF. | - |
| **html2canvas** | `^1.4.1` | Captura screenshots de elementos DOM (usado para exportar visuais). | [html2canvas](https://html2canvas.hertzen.com/) |
| **xlsx** | `^0.18.5` | Parser e gerador de planilhas Excel (Spreadsheets). | [SheetJS](https://sheetjs.com/) |

### Utilitários Diversos
| Pacote | Versão | Descrição |
| :--- | :--- | :--- |
| **react-helmet** | `^6.1.0` | Gerenciamento de tags `<head>` (SEO, Títulos) em React. |

---

## 🔧 Dependências de Desenvolvimento (`devDependencies`)

Ferramentas usadas apenas durante o desenvolvimento e build do projeto.

| Pacote | Versão | Descrição |
| :--- | :--- | :--- |
| **@vitejs/plugin-react** | `^4.3.4` | Plugin oficial do React para Vite (Fast Refresh). |
| **autoprefixer** | `^10.4.20` | Plugin PostCSS para adicionar prefixos de fornecedor CSS. |
| **postcss** | `^8.4.49` | Ferramenta para transformar CSS com JavaScript. |
| **eslint** | `^8.57.1` | Linter para identificar e reportar padrões no código JS. |
| **eslint-config-react-app** | `^7.0.1` | Configuração ESLint usada pelo Create React App. |
| **@types/*** | `Variadas` | Definições de tipos TypeScript para bibliotecas JS. |
| **terser** | `^5.37.0` | Minificador de JavaScript para builds de produção. |

---

## 🌐 Integrações Externas

Além das bibliotecas npm, o projeto se integra com:

*   **Supabase Auth**: Para autenticação de usuários (Email/Senha).
*   **Supabase Database**: Banco de dados PostgreSQL hospedado.
*   **N8N (Opcional)**: Para automação de Webhooks e envio de mensagens WhatsApp.
