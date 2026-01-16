
# 📱 Guia de Design Responsivo

O HorizonBook adota uma filosofia **Mobile-First**. Isso significa que projetamos primeiro para telas pequenas e expandimos a complexidade para telas maiores.

---

## 1. Breakpoints (Pontos de Quebra) 📏

Utilizamos os breakpoints padrão do Tailwind CSS.

| Prefixo | Largura Mínima | Dispositivos Típicos |
| :--- | :--- | :--- |
| **(base)** | 0px - 639px | Celulares (Portrait) |
| **sm** | 640px | Tablets (Portrait), Celulares Grandes (Landscape) |
| **md** | 768px | Tablets (Landscape), Laptops Pequenos |
| **lg** | 1024px | Laptops, Desktops Pequenos |
| **xl** | 1280px | Desktops Grandes |
| **2xl** | 1536px | Monitores Ultrawide |

---

## 2. Filosofia Mobile-First 📲

Ao escrever CSS ou classes Tailwind:
1.  Defina o estilo base para celular primeiro (ex: `w-full`, `grid-cols-1`).
2.  Adicione exceções para telas maiores usando prefixos (ex: `md:w-1/2`, `lg:grid-cols-3`).

**Exemplo:**
