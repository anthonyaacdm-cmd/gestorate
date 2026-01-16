
# ✅ Checklist de Implementação de Design - Gestorate

Use esta lista para garantir que novas telas ou funcionalidades sigam o padrão do sistema de design do Gestorate.

## 1. Antes de Começar 🏁
- [ ] Entendi a paleta de cores (Indigo/Pink/Amber).
- [ ] Estou usando as importações corretas (`@/components/ui/...`).
- [ ] O componente será responsivo (Mobile-First).

## 2. Componentes UI 🧩
- [ ] **Botões:** Estou usando as variantes corretas? (Primary para a ação principal, Ghost/Outline para secundárias).
- [ ] **Espaçamento:** Estou usando classes Tailwind da escala (m-4, p-6, gap-2) e não valores arbitrários (m-[13px])?
- [ ] **Feedback:** Todos os botões têm estado `:hover` e `:active`? (O componente `Button` já traz isso, mas elementos customizados precisam).
- [ ] **Inputs:** Têm labels claros e mensagens de erro visíveis?

## 3. Implementação de Página 📄
- [ ] **Loading:** Adicionei `Skeleton` ou `Spinner` enquanto os dados carregam? A tela nunca deve ficar em branco.
- [ ] **Empty State:** Se a lista voltar vazia, mostro o componente `EmptyState` com uma mensagem amigável?
- [ ] **Título:** A página tem um `<h1>` ou título claro usando a tipografia padrão?
- [ ] **Meta Tags:** Adicionei `<Helmet>` com o título da página?

## 4. Design Responsivo 📱
- [ ] Testei em 320px (iPhone SE)? Nada quebra?
- [ ] Testei em 768px (Tablet)? O grid se ajustou (de 1 para 2 colunas)?
- [ ] Testei em 1024px+ (Desktop)? O layout aproveita o espaço extra?
- [ ] Tabelas têm rolagem horizontal em mobile?

## 5. Dark Mode 🌙
- [ ] Ativei o modo escuro e verifiquei a tela no Gestorate.
- [ ] O texto está legível (contraste suficiente)?
- [ ] Não há fundos brancos "duros" (`bg-white` forçado) que deveriam ser escuros (`bg-[var(--bg-secondary)]`)?

## 6. Acessibilidade ♿
- [ ] Imagens têm `alt="..."`?
- [ ] Botões que são apenas ícones têm `aria-label="..."`?
- [ ] A navegação por teclado (Tab) funciona na ordem lógica?

## 7. Animações 🎬
- [ ] Usei `animate-fade-in` para a entrada da página principal?
- [ ] Usei `animate-slide-up` para elementos que entram de baixo?
- [ ] As animações são rápidas e não travam a interação?

## 8. Finalização 🚀
- [ ] O código foi formatado?
- [ ] Não há logs (`console.log`) esquecidos?
- [ ] Testei o fluxo de erro (ex: falha na rede)?
