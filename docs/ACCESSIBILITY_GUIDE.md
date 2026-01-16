
# ♿ Guia de Acessibilidade (A11y)

Acessibilidade não é uma "feature", é um requisito. O HorizonBook foi desenhado para ser inclusivo.

---

## 1. Contraste de Cores 🌗
Seguimos o padrão WCAG AA.

*   **Texto Normal:** Requer contraste de 4.5:1.
*   **Texto Grande/Bold:** Requer contraste de 3:1.
*   **Componentes de UI (Bordas, Ícones):** Requer 3:1.

**Verificado:**
*   Nossa cor Primária (Indigo) passa em fundo branco e fundo escuro.
*   Nossos tons de cinza para texto (`slate-500` para cima) são legíveis.
*   ⚠️ **Atenção:** Nunca use texto amarelo/amber sobre fundo branco.

---

## 2. Elementos Interativos point_up
*   **Tamanho do Alvo:** Todos os botões e links clicáveis têm no mínimo **44x44px** (ou padding suficiente para atingir essa área de toque). Isso é vital para usuários móveis e pessoas com dificuldades motoras.
*   **Foco Visível:** Nunca remova o `outline` de foco sem fornecer uma alternativa. Nossos inputs têm um anel Indigo claro (`ring-2`) quando focados.

---

## 3. Navegação por Teclado ⌨️
*   Toda a interface deve ser operável sem mouse.
*   A ordem do `Tab` deve seguir a ordem visual.
*   Modais devem prender o foco (Focus Trap) para que o usuário não navegue na página de fundo enquanto o modal está aberto. (O componente `Dialog` do Radix UI já faz isso automaticamente).

---

## 4. Imagens e Ícones 🖼️
*   **Imagens informativas:** Devem ter `alt="Descrição do que a imagem mostra"`.
*   **Ícones decorativos:** Devem ser ignorados por leitores de tela (`aria-hidden="true"`) ou, se forem botões, ter `aria-label="Ação"`.

**Exemplo:**
