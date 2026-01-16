
# 🌙 Guia do Modo Escuro (Dark Mode)

O HorizonBook possui suporte nativo e completo para Modo Escuro, oferecendo conforto visual e economia de bateria.

---

## 1. O que é?
O Modo Escuro inverte a paleta de cores da interface: fundos claros tornam-se escuros (azul-marinho profundo ou cinza chumbo) e textos escuros tornam-se claros. Não é apenas "preto e branco"; é uma paleta cuidadosamente calibrada para reduzir a fadiga ocular.

---

## 2. Como Ativar/Desativar 💡
1.  Localize o ícone de **Lua** 🌙 (ou **Sol** ☀️) no canto superior direito do cabeçalho (Header).
2.  Clique no botão.
3.  A interface mudará instantaneamente com uma transição suave.
4.  **Sua preferência é salva automaticamente** no navegador. Da próxima vez que abrir o site, ele lembrará sua escolha.

---

## 3. Paleta de Cores Adaptativa 🎨

O sistema usa variáveis CSS inteligentes. Você não precisa fazer nada; o código sabe qual cor usar.

| Elemento | Light Mode (Claro) | Dark Mode (Escuro) | Hex Dark |
| :--- | :--- | :--- | :--- |
| **Fundo Global** | `slate-50` | `slate-900` | `#0F172A` |
| **Cards / Modais** | `white` | `slate-800` | `#1E293B` |
| **Texto Principal** | `slate-900` | `slate-50` | `#F8FAFC` |
| **Texto Secundário** | `slate-500` | `slate-400` | `#94A3B8` |
| **Bordas** | `slate-200` | `slate-700` | `#334155` |
| **Primary Color** | `indigo-500` | `indigo-500` | `#6366F1` |

*Nota: A cor primária (Indigo) permanece a mesma, pois foi escolhida para ter bom contraste em ambos os fundos.*

---

## 4. Preferência do Sistema 🖥️
Se você nunca acessou o site antes, o HorizonBook verificará a configuração do seu sistema operacional (Windows, macOS, Android, iOS).
*   Se seu Windows está em modo escuro -> O site abre em modo escuro.
*   Se você clicar no botão de alternar, sua escolha manual sobrescreve a do sistema.

---

## 5. Acessibilidade 👁️
O Modo Escuro mantém as taxas de contraste exigidas pela WCAG (Web Content Accessibility Guidelines).
*   Evitamos preto puro (`#000000`) para fundos, pois causa "smearing" em telas OLED e cansa a vista com texto branco brilhante.
*   Usamos tons de `Slate` (azul-acinzentado) que são mais suaves.

---

## 6. Personalização Técnica (Para Desenvolvedores) 👨‍💻
As cores são definidas em `src/styles/theme.css`.

