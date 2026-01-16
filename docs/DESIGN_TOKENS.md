
# 🪙 Design Tokens

Design Tokens são as "partículas atômicas" do nosso design. São variáveis que armazenam valores de design (cores, espaçamento, tipografia) para garantir consistência. No nosso projeto, eles são implementados via **Variáveis CSS**.

---

## 1. Color Tokens 🎨

| Token (Variável CSS) | Valor (Light) | Valor (Dark) | Descrição |
| :--- | :--- | :--- | :--- |
| `--primary-color` | `#6366F1` | `#6366F1` | Cor principal da marca (Indigo). |
| `--secondary-color` | `#EC4899` | `#EC4899` | Cor secundária (Pink). |
| `--bg-primary` | `#F8FAFC` | `#0F172A` | Fundo da página. |
| `--bg-secondary` | `#FFFFFF` | `#1E293B` | Fundo de componentes. |
| `--text-primary` | `#0F172A` | `#F8FAFC` | Texto principal. |
| `--text-muted` | `#94A3B8` | `#94A3B8` | Texto de baixo contraste. |
| `--border-color` | `#E2E8F0` | `#334155` | Bordas e divisores. |

---

## 2. Spacing Tokens 📏

| Token | Valor | Classe Tailwind Equiv. |
| :--- | :--- | :--- |
| `--spacing-xs` | 4px | `p-1`, `m-1` |
| `--spacing-sm` | 8px | `p-2`, `m-2` |
| `--spacing-md` | 16px | `p-4`, `m-4` |
| `--spacing-lg` | 24px | `p-6`, `m-6` |
| `--spacing-xl` | 32px | `p-8`, `m-8` |
| `--spacing-2xl` | 48px | `p-12`, `m-12` |

---

## 3. Typography Tokens ✍️

| Token | Valor |
| :--- | :--- |
| `--font-primary` | `'Poppins', sans-serif` |
| `--font-secondary` | `'Inter', sans-serif` |

---

## 4. Shadow & Radius Tokens ✨

| Token | Valor | Descrição |
| :--- | :--- | :--- |
| `--shadow-sm` | `0 1px 2px...` | Sombra leve. |
| `--shadow-md` | `0 4px 6px...` | Sombra média padrão. |
| `--shadow-lg` | `0 10px 15px...` | Sombra flutuante. |
| `--radius-sm` | `6px` | Pequeno arredondamento. |
| `--radius-md` | `12px` | Padrão UI (Botões). |
| `--radius-lg` | `16px` | Cards. |
| `--radius-xl` | `24px` | Modais / Containers grandes. |

---

## 5. Como Usar Tokens

### Em arquivos CSS:
