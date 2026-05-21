# Style guide · shacdn (для других проектов)

Этот документ описывает **визуальные паттерны и токены** shacdn при переносе в приложения без Tailwind: React + TypeScript + SCSS modules + темы через CSS‑переменные.

> **Официальный референс:** [https://ui.shadcn.com](https://ui.shadcn.com) · [DESIGN_REFERENCE.md](./DESIGN_REFERENCE.md)  
> **Пошаговое подключение в новый репозиторий:** [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)  
> **Выбор компонентов по задаче:** [COMPONENTS_AI_REFERENCE.md](./COMPONENTS_AI_REFERENCE.md)

---

## Принципы

1. **Дизайн-токены** — только переменные из `src/styles/variables.scss`; не использовать «магические» hex/rgb там, где есть токен.
2. **Темизация** — цвет и фон через `hsl(var(--background))` и CSS‑переменные в `globals.scss` (`:root`, `data-theme`, цветовые схемы).
3. **Изоляция стилей** — один компонент = `ComponentName.tsx` + `ComponentName.module.scss`.
4. **Доступность** — видимые фокусы (`:focus-visible`), `aria-*` для иконок (`aria-hidden` на svg при наличии текста).

Утилита для скринридеров: `.visually-hidden` / `.visuallyHidden` в `globals.scss`.

---

## Что копировать (минимум)

| Путь в shacdn | Назначение | Порядок |
|---------------|------------|---------|
| `src/styles/variables.scss` | Sass-токены | **1** |
| `src/styles/globals.scss` | Темы, `:root`, reset | **2** |
| `src/components/<Name>/` | tsx + module.scss | **3** |

В целевом проекте:

```bash
npm install sass
```

```tsx
// main.tsx
import './styles/globals.scss';
```

Компоненты копируйте **целиком** (tsx + scss). См. таблицу зависимостей в [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md#зависимости-между-компонентами).

---

## SCSS в consumer-проекте

```scss
// MyPage.module.scss
@use '../../styles/variables.scss' as *;

.container {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-lg;
  background: $background;
  color: $foreground;
  border: $border-width solid $border;
  border-radius: $radius-lg;
  font-family: $font-sans;
  font-size: $font-size-sm;
  transition: background-color $transition-fast;

  &:focus-visible {
    outline: $focus-ring-width solid $ring;
    outline-offset: $focus-ring-offset;
  }
}
```

**Не добавляйте Tailwind.** Для layout используйте свой SCSS module или flex/grid в модуле страницы.

---

## Импорт компонентов

```tsx
import { Button } from './components/Button/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/Card/Card';
```

Barrel-файлов (`index.ts`) нет — только прямой импорт из папки компонента.

---

## Компонент `Button` как ссылка

При **`href: string`** рендерится `<a>` с теми же классами, что у `<button>`:

```tsx
<Button href="https://example.com" variant="outline" target="_blank" rel="noopener noreferrer">
  Открыть
</Button>
```

---

## Карта токенов

| Sass / CSS | Использование |
|------------|---------------|
| `$background`, `$foreground` | Базовый текст и подложка |
| `$primary`, `$primary-foreground` | Акцент, CTA |
| `$secondary`, `$secondary-foreground` | Вторичные кнопки, бейджи |
| `$muted`, `$muted-foreground` | Подписи, placeholder |
| `$accent`, `$accent-foreground` | Hover ghost-кнопок, меню |
| `$destructive`, `$destructive-foreground` | Ошибки, удаление |
| `$border`, `$input`, `$ring` | Обводки, фокус |
| `$card`, `$popover` | Фон карточек и поповеров |
| `$radius-*`, `$spacing-*`, `$font-size-*` | Сетка, типографика |
| `$control-h-sm/md/lg` | Высоты контролов (32/36/40px) |
| `$transition-fast/base/slow` | Анимации |
| `$z-floating`, `$z-overlay`, `$z-toast`, `$z-tooltip` | Слои |

Полный список: `src/styles/variables.scss`. Семантика тем: `src/styles/globals.scss`.

---

## Темизация

```ts
document.documentElement.setAttribute('data-theme', 'dark blue');
```

Схемы: `default`, `blue`, `green`, `purple`, `orange`, `rose`.  
Готовый UI: компонент `ThemeSwitcher`. Подробнее: [THEME_SYSTEM.md](./THEME_SYSTEM.md).

---

## Композиция страниц (примеры)

| Экран | Путь | Компоненты |
|-------|------|------------|
| Маркетинговый лендинг | `src/screens/SessyLanding/` | Button, Card, Table, Badge, Separator, ThemeSwitcher |
| Showcase библиотеки | `src/screens/ShadcnHome/` | Button, Card, Badge |

Паттерны: Hero + CTA (`Button` с `href`), сетки на CSS Grid, тарифы через `Table`, FAQ через `Accordion`.

---

## AI / MCP

В Cursor включите MCP **`shacdn`** для автоматического экспорта:

- `get_design_system` — токены
- `get_component_bundle` — компоненты с зависимостями
- `get_screen_pattern` — экран + bundle

Сборка: `cd mcp/shacdn-server && npm install && npm run build`

---

## Проверка после переноса

1. `npm run lint`
2. `npm run build`
3. Клавиатура: Tab по формам и CTA
4. Переключить light/dark и одну цветовую схему

---

## Связанные документы

| Документ | Содержание |
|----------|------------|
| [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) | Быстрый старт, Vite/Next.js, чеклист |
| [AI_AGENT_GUIDE.md](./AI_AGENT_GUIDE.md) | Миграция HTML/Tailwind → shacdn |
| [COMPONENTS_AI_REFERENCE.md](./COMPONENTS_AI_REFERENCE.md) | Матрица «задача → компонент» |
| [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) | API и примеры |
| `.cursor/rules/shacdn-reuse.mdc` | Правило для агентов в consumer-репо |
