---
name: shacdn-style-guide
description: Apply shacdn (shadcn-style SCSS modules) tokens and reusable UI patterns across projects — load when exporting components, aligning new apps with shacdn, or opening docs/STYLE_GUIDE.md workflows.
---

# shacdn style guide skill

## When this applies

- Перенос или повторное использование компонентов из репозитория **shacdn**
- Новый экран «как каталог»: лендинги, секции документации, промо-блоки
- Вопросы «какие токены / как связать тему»

## Steps

1. Открыть **`docs/COMPONENTS_AI_REFERENCE.md`** (выбор из 50+ примитивов по задаче), затем **`docs/STYLE_GUIDE.md`** по чеклисту переноса токенов.
2. Токены: `@use '../../styles/variables.scss' as *;` в SCSS модулей; не дублировать цвета вне `--*` / `$*` токенов без причины.
3. Компоненты копировать **парой файлов** (`.tsx` + `.module.scss`); сохранять `forwardRef`, вариантные классы через `styles[variant]` как в существующих примитивах.
4. CTA во внешние URL: использовать **`Button` с `href`** (полиморфная ссылка).
5. Проверка: lint + production build проекта-потребителя.

## Reference implementation

`src/screens/SessyLanding/` — живой образец секций hero → steps → features → таблица сравнения → FAQ/deploy.
