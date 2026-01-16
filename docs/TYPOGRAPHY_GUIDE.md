
# ✍️ Guia de Tipografia

## 1. Famílias de Fontes

### Poppins (Primária)
*   **Uso:** Títulos (Headings), Botões, Navegação, Números em destaque.
*   **Características:** Geométrica, moderna, amigável.
*   **Pesos usados:** Regular (400), Medium (500), SemiBold (600), Bold (700).

### Inter (Secundária)
*   **Uso:** Corpo de texto, Parágrafos longos, Tabelas, Inputs, Legendas.
*   **Características:** Altamente legível, neutra, excelente para UI densa.
*   **Pesos usados:** Regular (400), Medium (500).

---

## 2. Escala de Tamanhos (Size Scale)

| Token | Tamanho (px) | Line Height | Letter Spacing | Uso Típico |
| :--- | :--- | :--- | :--- | :--- |
| **H1** | 48px | 1.1 | -0.02em | Título principal da página, Hero. |
| **H2** | 36px | 1.2 | -0.01em | Títulos de seção. |
| **H3** | 28px | 1.3 | Normal | Títulos de Cards grandes. |
| **H4** | 24px | 1.4 | Normal | Subtítulos, Títulos de Modais. |
| **Body** | 16px | 1.6 | Normal | Texto padrão, parágrafos. |
| **Small** | 14px | 1.5 | 0.01em | Legendas, labels de input, botões `sm`. |
| **XS** | 12px | 1.5 | 0.02em | Badges, datas pequenas, rodapés. |

---

## 3. Pesos (Weights)

*   **Light (300):** Raramente usado. Apenas para textos muito grandes (display).
*   **Regular (400):** Padrão para corpo de texto.
*   **Medium (500):** Labels de formulário, botões, destaques sutis.
*   **SemiBold (600):** Títulos H2-H4, Links importantes.
*   **Bold (700):** Títulos H1, KPIs, Números importantes.

---

## 4. Hierarquia Visual

Para criar uma boa hierarquia:
1.  Use **Tamanho** para distinção primária (H1 vs H2).
2.  Use **Peso** para destaque (Bold vs Regular).
3.  Use **Cor** para suavizar informações secundárias (Texto Slate-500 vs Slate-900).

**Exemplo de Cartão:**
*   Título: H3, Bold, Cor Primária.
*   Subtítulo: Small, Medium, Cor Secundária (Cinza).
*   Valor: H2, Bold, Cor Destaque.

---

## 5. Tipografia em Mobile 📱
O sistema ajusta automaticamente os tamanhos de fonte em telas menores (`src/styles/responsive.css`).
*   H1: 48px (Desktop) -> 32px (Mobile)
*   H2: 36px (Desktop) -> 28px (Mobile)
*   Body: Mantém 16px para legibilidade (não diminua para 14px em corpo de texto).

---

## 6. Acessibilidade de Texto
*   Nunca use tamanho menor que **12px**.
*   Garanta contraste. Evite texto cinza claro sobre fundo branco.
*   Use `line-height` (altura da linha) generosa (1.6) para blocos de texto longos para facilitar a leitura.
