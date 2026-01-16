
# 🎬 Guia de Animações

Animações no HorizonBook não são apenas decorativas; elas servem para guiar a atenção do usuário, suavizar mudanças de estado e dar uma sensação de polimento e responsividade.

---

## 1. Filosofia de Animação 🧠
*   **Sutil:** A animação não deve distrair do conteúdo.
*   **Rápida:** Não deve fazer o usuário esperar.
*   **Significativa:** Deve indicar de onde algo veio ou para onde vai.

---

## 2. Animações Disponíveis 📦

Todas as animações estão definidas em `src/styles/animations.css` e disponíveis como classes utilitárias.

| Classe | Efeito | Duração | Caso de Uso |
| :--- | :--- | :--- | :--- |
| `animate-fade-in` | Opacidade 0 → 1 | 300ms | Carregamento inicial de páginas, imagens. |
| `animate-slide-up` | Sobe 20px + Fade In | 300ms | Cards, Modais, Toast Notifications (bottom). |
| `animate-slide-down` | Desce 20px + Fade In | 300ms | Menus Dropdown, Accordions. |
| `animate-slide-left` | Desliza da direita p/ esquerda | 300ms | Menu lateral (Drawer), navegação. |
| `animate-scale-in` | Zoom 95% → 100% | 150ms | Popups, Dialogs, Hover em cards. |
| `animate-pulse-slow` | Opacidade varia (loop) | 2s | Skeleton Loaders (estado de carregamento). |
| `animate-shimmer` | Brilho passando (loop) | 1.5s | Skeleton Loaders avançados. |
| `animate-bounce-subtle` | Pulo leve | 2s | Ícones de notificação, chamadas para ação. |

---

## 3. Classes de Delay (Atraso) ⏱️
Para criar o efeito de "cascata" (staggered), onde itens aparecem um após o outro, use as classes de delay:

*   `.delay-100` (100ms)
*   `.delay-200` (200ms)
*   `.delay-300` (300ms)

**Exemplo em Lista:**
