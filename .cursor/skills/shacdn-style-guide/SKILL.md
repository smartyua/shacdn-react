---
name: shacdn-style-guide
description: Apply shacdn (shadcn-style SCSS modules) tokens and reusable UI patterns across projects — load when exporting components, aligning new apps with shacdn, or integrating via docs/INTEGRATION_GUIDE.md.
---

# shacdn style guide skill

## When this applies

- Перенос или повторное использование компонентов из репозитория **shacdn**
- Новый экран «как каталог»: лендинги, секции документации, промо-блоки
- Вопросы «какие токены / как связать тему»

## Steps

1. Сверка с **[ui.shadcn.com](https://ui.shadcn.com)** и **`docs/DESIGN_REFERENCE.md`** / **`docs/SHADCN_PARITY_MATRIX.md`**.
2. Открыть **`docs/INTEGRATION_GUIDE.md`** — быстрый старт, deps, MCP, чеклист для consumer-проекта.
3. Выбор компонентов: **`docs/COMPONENTS_AI_REFERENCE.md`**; визуальные паттерны: **`docs/STYLE_GUIDE.md`**.
4. MCP **`shacdn`**: `get_design_system` → `get_component_bundle` (если доступен в Cursor).
5. Токены: `@use '../../styles/variables.scss' as *;` в SCSS модулей; не дублировать цвета вне `--*` / `$*` токенов без причины.
6. Компоненты копировать **парой файлов** (`.tsx` + `.module.scss`); сохранять `forwardRef`, вариантные классы через `styles[variant]` как в существующих примитивах.
7. CTA во внешние URL: **`Button` с `href`** (полиморфная ссылка).
8. Проверка: lint + production build проекта-потребителя.

## Reference implementation

`src/screens/SessyLanding/` — живой образец секций hero → steps → features → таблица сравнения → FAQ/deploy.
