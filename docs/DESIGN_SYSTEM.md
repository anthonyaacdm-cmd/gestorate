
# 🎨 Sistema de Design Gestorate

Bem-vindo ao sistema de design oficial do Gestorate. Este documento detalha os fundamentos visuais, cores, tipografia e componentes que criam a estética "Premium Modern" da nossa aplicação.

---

## 1. Paleta de Cores 🌈

Nossa paleta foi escolhida para transmitir confiança, modernidade e energia. Todas as cores são acessíveis via variáveis CSS.

### Cores Principais
| Nome | Variável CSS | Hex | RGB | Uso |
| :--- | :--- | :--- | :--- | :--- |
| **Primary (Indigo)** | `--primary-color` | `#6366F1` | `99, 102, 241` | Ações principais, botões, links, destaques. |
| **Secondary (Pink)** | `--secondary-color` | `#EC4899` | `236, 72, 153` | Gradientes, destaques secundários, badges. |
| **Accent (Amber)** | `--accent-color` | `#F59E0B` | `245, 158, 11` | Ícones de destaque, alertas, receita. |

### Cores de Status
| Nome | Variável CSS | Hex | Uso |
| :--- | :--- | :--- | :--- |
| **Success** | `--success-color` | `#10B981` | Mensagens de sucesso, status "Confirmado". |
| **Warning** | `--warning-color` | `#F59E0B` | Alertas, status "Pendente". |
| **Error** | `--error-color` | `#EF4444` | Erros, ações destrutivas, status "Cancelado". |

### Cores Neutras (Modo Claro / Escuro)
| Categoria | Hex (Light) | Hex (Dark) | Uso |
| :--- | :--- | :--- | :--- |
| **Background Principal** | `#F8FAFC` | `#0F172A` | Fundo da página (body). |
| **Background Secundário** | `#FFFFFF` | `#1E293B` | Cards, modais, dropdowns. |
| **Texto Primário** | `#0F172A` | `#F8FAFC` | Títulos, texto principal. |
| **Texto Secundário** | `#64748B` | `#CBD5E1` | Legendas, descrições. |
| **Bordas** | `#E2E8F0` | `#334155` | Divisores, bordas de inputs. |

---

## 2. Tipografia ✍️

Utilizamos uma combinação de fontes sans-serif modernas para legibilidade e personalidade.

### Fontes
*   **Primária:** `Poppins` (Headings, UI Elements, Botões)
*   **Secundária:** `Inter` (Corpo de texto, Tabelas, Formulários longos)

### Escala Tipográfica
| Tag | Tamanho | Line Height | Peso Recomendado |
| :--- | :--- | :--- | :--- |
| **H1** | `48px` (3rem) | 1.1 | Bold (700) |
| **H2** | `36px` (2.25rem) | 1.2 | SemiBold (600) |
| **H3** | `28px` (1.75rem) | 1.3 | SemiBold (600) |
| **H4** | `24px` (1.5rem) | 1.4 | Medium (500) |
| **Body** | `16px` (1rem) | 1.6 | Regular (400) |
| **Small** | `14px` (0.875rem) | 1.5 | Regular (400) |
| **XS** | `12px` (0.75rem) | 1.5 | Medium (500) |

---

## 3. Componentes Principais 🧩

### Buttons
Botões são os principais elementos de interação.
*   **Primary:** Fundo Indigo, Texto Branco. Sombra média.
*   **Secondary:** Fundo Pink, Texto Branco.
*   **Outline:** Borda cinza/colorida, fundo transparente.
*   **Ghost:** Fundo transparente, hover cinza claro.
*   **Sizes:** `sm` (32px altura), `default` (40px altura), `lg` (48px altura).

### Cards
Utilizados para agrupar informações.
*   **Default:** Background Secundário, Borda sutil (`--border-color`), Sombra `sm`.
*   **Hover:** Transição suave para Sombra `lg` e `translateY(-2px)`.

### Badges
Indicadores de status compactos.
*   **Formato:** Arredondados (`rounded-full`), texto pequeno e bold.
*   **Cores:** Variantes `success` (Verde), `warning` (Amarelo), `destructive` (Vermelho), `outline`.

### Inputs
Campos de formulário acessíveis.
*   **Default:** Borda cinza clara, fundo branco/escuro.
*   **Focus:** Anel (Ring) Indigo com 2px de espessura.
*   **Error:** Borda vermelha, texto de ajuda vermelho.

---

## 4. Espaçamento e Grid 📐

Baseamos nosso sistema em uma escala de **4px**.

### Escala de Espaçamento
*   `xs`: 4px (`p-1`, `m-1`)
*   `sm`: 8px (`p-2`, `m-2`)
*   `md`: 16px (`p-4`, `m-4`)
*   `lg`: 24px (`p-6`, `m-6`)
*   `xl`: 32px (`p-8`, `m-8`)
*   `2xl`: 48px (`p-12`, `m-12`)
*   `3xl`: 64px (`p-16`, `m-16`)

### Grid System
*   **Desktop:** 12 colunas ou Grid Responsivo (3 colunas para cards).
*   **Tablet:** 6 colunas ou Grid Responsivo (2 colunas para cards).
*   **Mobile:** 1 coluna (Stack vertical).

---

## 5. Sombras e Efeitos ✨

### Shadows (Elevação)
*   `sm`: Leve destaque (botões secundários).
*   `md`: Elementos flutuantes padrão (botões primários).
*   `lg`: Cards e Dropdowns.
*   `xl`: Modais e Toast Notifications.

### Border Radius
*   `sm` (6px): Inputs, Checkboxes.
*   `md` (12px): Botões, Badges.
*   `lg` (16px): Cards pequenos, Elementos de lista.
*   `xl` (24px): Cards grandes, Modais, Containers principais.

### Glassmorphism
Usado no Header e Overlays.
*   `bg-opacity-80` + `backdrop-blur-md`.

---

## 6. Animações 🎬

Animações sutis para melhorar a experiência (detalhadas em `ANIMACOES_GUIDE.md`).

*   `fadeIn`: Carregamento de páginas.
*   `slideInUp`: Modais e Cards.
*   `slideInDown`: Dropdowns e Alertas.
*   `slideInLeft/Right`: Menus laterais.
*   `scaleIn`: Cards ao carregar.
*   `pulse`: Skeleton Loaders.
*   `shimmer`: Carregamento de dados.

---

## 7. Do's and Don'ts ✅❌

### ✅ Do (Faça)
*   Use variáveis CSS (`var(--primary-color)`) em vez de valores hexadecimais diretos.
*   Use os componentes de UI (`Button`, `Card`) em vez de divs genéricas.
*   Mantenha consistência no espaçamento (múltiplos de 4px).
*   Sempre teste em Modo Escuro no Gestorate.

### ❌ Don't (Não Faça)
*   Não crie novas cores fora da paleta sem aprovação.
*   Não misture fontes (use Poppins apenas para títulos/UI e Inter para texto).
*   Não use animações que duram mais de 500ms (exceto loops infinitos sutis).
*   Não use sombras pretas puras; use sombras coloridas com baixa opacidade para um look mais natural.
