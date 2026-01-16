
# 🎨 Referência Completa de Cores

## 1. Cores Primárias

### Indigo (Primary)
*   **Hex:** `#6366F1`
*   **Variável:** `--primary-color`
*   **Uso:** A principal cor da marca. Usada em botões de ação (CTA), links ativos, estados de foco e bordas de destaque.
*   **Variações:**
    *   Hover: `#4F46E5` (Mais escuro)
    *   Fundo sutil: `rgba(99, 102, 241, 0.1)` (Indigo 100 com opacidade)

### Pink (Secondary)
*   **Hex:** `#EC4899`
*   **Variável:** `--secondary-color`
*   **Uso:** Destaques secundários, gradientes com o Indigo, badges de "Novo", elementos femininos ou criativos.
*   **Variações:**
    *   Hover: `#DB2777`

### Amber (Accent)
*   **Hex:** `#F59E0B`
*   **Variável:** `--accent-color`
*   **Uso:** Ícones de dinheiro/receita, estrelas de avaliação, alertas que requerem atenção mas não são erros.

---

## 2. Cores de Status

### Success (Verde)
*   **Hex:** `#10B981`
*   **Variável:** `--success-color`
*   **Uso:** Confirmações, toasts de sucesso, status positivo, tendências de alta.

### Error (Vermelho)
*   **Hex:** `#EF4444`
*   **Variável:** `--error-color`
*   **Uso:** Mensagens de erro, botões de excluir, status cancelado, tendências de baixa.

### Info (Azul)
*   **Hex:** `#3B82F6`
*   **Variável:** `--info-color`
*   **Uso:** Informações neutras, links padrão.

---

## 3. Cores Neutras (Grayscale)

### Dark (Escuros - Backgrounds Dark Mode / Textos Light Mode)
*   `#0F172A` (Slate 900): Fundo principal (Dark Mode), Texto Títulos (Light Mode).
*   `#1E293B` (Slate 800): Fundo de cards (Dark Mode).
*   `#334155` (Slate 700): Bordas e divisores (Dark Mode).

### Light (Claros - Backgrounds Light Mode / Textos Dark Mode)
*   `#F8FAFC` (Slate 50): Fundo principal (Light Mode), Texto Títulos (Dark Mode).
*   `#F1F5F9` (Slate 100): Fundo alternativo (Light Mode).
*   `#E2E8F0` (Slate 200): Bordas e divisores (Light Mode).

### Mid-Gray (Textos Secundários)
*   `#64748B` (Slate 500): Texto de corpo, descrições.
*   `#94A3B8` (Slate 400): Texto desabilitado, placeholders.

---

## 4. Acessibilidade e Contraste 👁️

*   **Texto Branco sobre Indigo (#6366F1):** Contraste 4.6:1 (Passa AA). Ótimo para botões.
*   **Texto Slate-900 sobre Slate-50:** Contraste 15:1 (Passa AAA). Ótimo para leitura longa.
*   **Texto Amber (#F59E0B) sobre Branco:** Contraste baixo. **NÃO USE** para texto pequeno. Use Amber apenas para ícones ou fundos de badges com texto preto.

---

## 5. Gradientes 🌈

O sistema utiliza gradientes predefinidos para headers e destaques:

*   **Primary Gradient:** `bg-gradient-to-r from-indigo-500 to-pink-500`
    *   Uso: Hero sections, textos de destaque (`bg-clip-text`), bordas especiais.
