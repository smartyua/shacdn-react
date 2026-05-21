# Подключение shacdn в другой проект

> **Главная точка входа** для переноса компонентов и дизайн-системы shacdn в любой React + TypeScript проект (Vite, Next.js, CRA и т.д.). Без Tailwind — только SCSS Modules.

---

## Быстрый старт (5 минут)

### 1. Зависимости в целевом проекте

```bash
npm install sass
# опционально — для иконок в демо/экранах:
npm install lucide-react
```

React 18+ и TypeScript strict рекомендуются (в shacdn — React 19).

### 2. Скопировать дизайн-систему **первой**

| Из shacdn | В ваш проект |
|-----------|--------------|
| `src/styles/variables.scss` | `src/styles/variables.scss` |
| `src/styles/globals.scss` | `src/styles/globals.scss` |

Подключите в точке входа:

```tsx
// main.tsx или App.tsx
import './styles/globals.scss';
```

### 3. Скопировать нужные компоненты

Каждый компонент — **папка целиком**:

```
src/components/Button/
├── Button.tsx
└── Button.module.scss
```

Импорт (без barrel `index.ts`):

```tsx
import { Button } from './components/Button/Button';
import { Card, CardHeader, CardTitle, CardContent } from './components/Card/Card';
```

### 4. Провайдеры (если нужны)

```tsx
import { ToastProvider } from './components/Toast/Toast';
import { TooltipProvider } from './components/Tooltip/Tooltip';

<ToastProvider>
  <TooltipProvider>
    <App />
  </TooltipProvider>
</ToastProvider>
```

| Компонент | Провайдер |
|-----------|-----------|
| `useToast`, `Toast` | `ToastProvider` |
| `Tooltip` | `TooltipProvider` |

### 5. Проверка

```bash
npm run lint
npm run build
```

Переключите тему: `document.documentElement.setAttribute('data-theme', 'dark')`.

---

## Структура целевого проекта

Рекомендуемая раскладка (совпадает с shacdn):

```
your-app/
├── src/
│   ├── styles/
│   │   ├── variables.scss    ← токены (скопировать)
│   │   └── globals.scss      ← темы + reset (скопировать)
│   ├── components/           ← скопированные примитивы
│   │   ├── Button/
│   │   ├── Card/
│   │   └── ...
│   ├── screens/              ← опционально: ваши страницы
│   └── main.tsx              ← import './styles/globals.scss'
```

В каждом `*.module.scss` компонента путь к variables:

```scss
@use '../../styles/variables.scss' as *;
```

Если глубина папок другая — поправьте относительный путь.

---

## Зависимости между компонентами

При копировании учитывайте **внутренние связи** — без них сборка упадёт:

| Компонент | Требует также |
|-----------|---------------|
| `Accordion` | `Collapsible` |
| `AlertDialog` | `Dialog` |
| `Combobox` | `Input` |
| `DatePicker` | `Calendar` |
| `Modal` | `Dialog` (Modal — алиас) |
| `Sheet` | `Drawer` (Sheet — алиас) |
| `ToggleGroup` | `Toggle` |
| `SiteHeader` | `ThemeSwitcher` |

**Порядок копирования:** сначала зависимости, потом зависимый компонент.

---

## Типовые наборы компонентов

### Минимальный UI (форма + карточка)

```
styles/ (globals + variables)
Button, Input, Label, Card
```

### Форма с валидацией

```
+ Textarea, Select, Checkbox, Switch, Field, Alert
```

### Модальные окна

```
Dialog (+ Modal если нужен алиас)
AlertDialog → Dialog
Drawer / Sheet
```

### Уведомления и подсказки

```
Toast (+ ToastProvider)
Tooltip (+ TooltipProvider)
Alert
```

### Таблица + действия

```
Table, Badge, Button, DropdownMenu
```

### Лендинг (как SessyLanding)

```
Button, Card, Table, Badge, Separator, ThemeSwitcher
+ экран: src/screens/SessyLanding/
```

---

## Темизация

12 комбинаций: светлая/тёмная × 6 цветовых схем.

```ts
// default | blue | green | purple | orange | rose
document.documentElement.setAttribute('data-theme', 'light blue');
localStorage.setItem('theme', 'light blue');
```

Готовый переключатель: скопируйте `ThemeSwitcher/` + `globals.scss`.

Подробнее: [THEME_SYSTEM.md](./THEME_SYSTEM.md).

---

## Vite

Vite поддерживает SCSS из коробки после `npm install sass`. Дополнительный конфиг не нужен.

```tsx
// vite.config.ts — без изменений для shacdn
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()] });
```

---

## Next.js (App Router)

1. Скопируйте `styles/` и `components/` в корень проекта (или `src/`).
2. Импортируйте `globals.scss` в `app/layout.tsx`:

```tsx
import '../styles/globals.scss';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
```

3. Компоненты с `'use client'` — добавьте директиву в начало файлов с хуками (`Dialog`, `Toast`, `Tabs` и т.д.).

---

## MCP для AI-агентов (Cursor)

В репозитории shacdn есть **shacdn MCP Server** — агент может автоматически отдавать исходники и гайд:

```bash
cd mcp/shacdn-server && npm install && npm run build
```

Включите сервер **`shacdn`** в Cursor → Settings → MCP.

| Инструмент | Зачем |
|------------|-------|
| `search_components` | Найти компонент по задаче |
| `get_design_system` | Получить `variables.scss` + `globals.scss` |
| `get_component_bundle` | Компонент + зависимости в порядке копирования |
| `get_integration_guide` | Пошаговый гайд под ваш список компонентов |
| `get_screen_pattern` | Готовый экран (лендинг) + bundle |

Подробнее: [mcp/shacdn-server/README.md](../mcp/shacdn-server/README.md).

> **shadcn MCP** (официальный, Tailwind) — только для **аудита паритета**, не для копирования в SCSS-проект.

---

## Чеклист переноса

- [ ] `sass` установлен
- [ ] `globals.scss` + `variables.scss` скопированы и подключены
- [ ] Компоненты скопированы **с зависимостями** (tsx + module.scss)
- [ ] Пути `@use '../../styles/variables.scss'` корректны
- [ ] `ToastProvider` / `TooltipProvider` добавлены при необходимости
- [ ] Нет Tailwind-классов в новом коде
- [ ] Нет hardcoded hex — только `$primary`, `$border` и т.д.
- [ ] `npm run lint` — 0 ошибок
- [ ] `npm run build` — успешно
- [ ] Клавиатурная навигация и `:focus-visible` проверены
- [ ] Тема light/dark переключается

---

## Частые ошибки

| Симптом | Причина | Решение |
|---------|---------|---------|
| Нет цветов / «белый» UI | `globals.scss` не импортирован | `import './styles/globals.scss'` в entry |
| `useToast` throws | Нет провайдера | Обернуть в `<ToastProvider>` |
| Tooltip не виден | Нет провайдера | `<TooltipProvider>` выше `<Tooltip>` |
| Modal не работает | Скопирован только `Modal/` | Скопировать `Dialog/` (Modal — re-export) |
| SCSS: can't find variables | Неверный `@use` путь | Поправить относительный путь к `variables.scss` |
| Тема не меняется | Hex вместо токенов | `$background`, не `#fff` |

---

## Связанные документы

| Документ | Содержание |
|----------|------------|
| [COMPONENTS_AI_REFERENCE.md](./COMPONENTS_AI_REFERENCE.md) | Матрица «задача → компонент» |
| [AI_AGENT_GUIDE.md](./AI_AGENT_GUIDE.md) | Миграция HTML/Tailwind → shacdn, API-паттерны |
| [STYLE_GUIDE.md](./STYLE_GUIDE.md) | Токены, Button с `href`, визуальные паттерны |
| [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) | Примеры API каждого компонента |
| [THEME_SYSTEM.md](./THEME_SYSTEM.md) | Темы и цветовые схемы |
| `.cursor/rules/shacdn-reuse.mdc` | Правило для Cursor-агентов в consumer-репо |
