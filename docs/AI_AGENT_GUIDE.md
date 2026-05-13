# shacdn — AI Agent Migration & Integration Guide

> **Для AI-агентов.** Этот документ — главная точка входа при переносе существующего интерфейса на компоненты shacdn или при написании нового кода с нуля. Содержит: архитектуру, правила импорта, типы пропсов, карту «старый код → новый компонент», шаблоны форм/страниц и контрольные списки.

---

## 1. Быстрая ориентация

| Параметр | Значение |
|----------|----------|
| Фреймворк | React 19 + TypeScript strict |
| Стили | SCSS Modules (`*.module.scss`); Tailwind **отсутствует** |
| Иконки | `lucide-react` |
| Роутинг | `react-router-dom` v7 |
| Компонентов | 51 папка в `src/components/` |
| Дизайн-система | Полный паритет с shadcn/ui без Radix UI |

### Что **не** включено (нужны доп. пакеты или ручная композиция)
`chart`, `carousel`, `command`, `navigation-menu`, `resizable`, `sidebar`, `sonner`

---

## 2. Структура проекта

```
src/
├── components/         # Все UI-компоненты
│   └── Button/
│       ├── Button.tsx
│       └── Button.module.scss
├── styles/
│   ├── variables.scss  # Токены дизайна (ЕДИНСТВЕННЫЙ источник констант)
│   └── globals.scss    # Темы, CSS-переменные, reset
├── App.tsx             # Демо и роутинг
└── main.tsx
```

### Обязательные условия при использовании компонентов
1. `globals.scss` подключён в корне приложения (`import './styles/globals.scss'`).
2. `ToastProvider` обёртывает дерево приложения, если используется `useToast`.
3. `TooltipProvider` присутствует в ветке дерева выше первого `Tooltip`.

---

## 3. Импорты — правила

### Путь импорта
```tsx
import { ComponentName } from './components/ComponentName/ComponentName';
// или из другого уровня вложенности:
import { ComponentName } from '../components/ComponentName/ComponentName';
```

### Никогда не импортируйте из `index.ts`
Barrel-файла нет. Каждый компонент импортируется напрямую из своей папки.

### Составные компоненты — импортировать вместе
```tsx
// Правильно — один именованный импорт
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/Card/Card';

// Неправильно — несколько отдельных импортов из разных файлов
import { Card } from './components/Card/Card';
import { CardHeader } from './components/Card/CardHeader'; // такого файла нет
```

---

## 4. Карта миграции: старый код → shacdn

### 4.1 HTML-элементы → компоненты

| Было | Стало | Папка |
|------|-------|-------|
| `<button>` | `<Button>` | `Button/` |
| `<a>` (стилизованная) | `<Button href="...">` | `Button/` |
| `<input type="text">` | `<Input>` | `Input/` |
| `<textarea>` | `<Textarea>` | `Textarea/` |
| `<select>` | `<Select>` | `Select/` |
| `<input type="checkbox">` | `<Checkbox>` | `Checkbox/` |
| `<input type="radio">` | `<RadioGroup>` + `<RadioGroupItem>` | `RadioGroup/` |
| `<label>` | `<Label>` | `Label/` |
| `<table>` | `<Table>` + составные | `Table/` |
| `<dialog>` / модалка | `<Dialog>` + составные | `Dialog/` |
| `<details>` / аккордеон | `<Accordion>` + составные | `Accordion/` |
| `<progress>` | `<Progress>` | `Progress/` |
| SVG-спиннер | `<Spinner>` | `Spinner/` |
| Skeleton div | `<Skeleton>` | `Skeleton/` |
| Тултип div | `<Tooltip>` | `Tooltip/` |

### 4.2 UI-библиотеки → shacdn

| Radix / shadcn/ui | shacdn | Примечание |
|-------------------|--------|------------|
| `@radix-ui/react-dialog` | `Dialog/` | Та же API-форма |
| `@radix-ui/react-tabs` | `Tabs/` | controlled + uncontrolled |
| `@radix-ui/react-accordion` | `Accordion/` | type="single"\|"multiple" |
| `@radix-ui/react-checkbox` | `Checkbox/` | native input |
| `@radix-ui/react-switch` | `Switch/` | native input + role="switch" |
| `@radix-ui/react-tooltip` | `Tooltip/` | нужен TooltipProvider |
| `@radix-ui/react-dropdown-menu` | `DropdownMenu/` | — |
| `@radix-ui/react-popover` | `Popover/` | — |
| `@radix-ui/react-toast` / Sonner | `Toast/` | нужен ToastProvider |
| Tailwind `className` строки | SCSS через `className` проп | передавайте extra классы |
| Inline-стили с цветами | Нет — используйте CSS-переменные | см. раздел 6 |

### 4.3 Паттерны Tailwind → SCSS

При переносе компонентов с Tailwind **не** добавляйте Tailwind-классы. Используйте только:
- `className` для дополнительного пользовательского SCSS-класса
- CSS-переменные (HSL) из `globals.scss` для цветов
- `style` проп только для динамических значений (позиция, ширина от данных)

```tsx
// Было (Tailwind)
<div className="flex items-center gap-2 p-4 rounded-lg border border-gray-200 bg-white">

// Стало (shacdn + custom SCSS)
// В MyWidget.module.scss:
// .container { display: flex; align-items: center; gap: $spacing-sm;
//   padding: $spacing-md; border-radius: $radius-lg;
//   border: $border-width solid $border; background: $background; }
<div className={styles.container}>
```

---

## 5. Компоненты — быстрый справочник

### Формы

```tsx
import { Label } from './components/Label/Label';
import { Input } from './components/Input/Input';
import { Textarea } from './components/Textarea/Textarea';
import { Select } from './components/Select/Select';
import { Checkbox } from './components/Checkbox/Checkbox';
import { Switch } from './components/Switch/Switch';
import { RadioGroup, RadioGroupItem } from './components/RadioGroup/RadioGroup';
import { Button } from './components/Button/Button';
import { Field, FieldLabel, FieldDescription } from './components/Field/Field';

// Минимальная форма с label + input
<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>

// С описанием и ошибкой
<Field>
  <FieldLabel>Пароль</FieldLabel>
  <Input type="password" aria-invalid={hasError} />
  <FieldDescription>{hasError ? 'Минимум 8 символов' : 'Введите пароль'}</FieldDescription>
</Field>

// Select
<Select>
  <option value="">Выберите…</option>
  <option value="a">Вариант A</option>
</Select>

// Checkbox с label
<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
  <Checkbox id="terms" />
  <Label htmlFor="terms">Принимаю условия</Label>
</div>
```

### Кнопки

```tsx
import { Button } from './components/Button/Button';

// Варианты: default | secondary | outline | ghost | destructive | link
<Button variant="default">Сохранить</Button>
<Button variant="outline">Отмена</Button>
<Button variant="destructive">Удалить</Button>
<Button href="/login">Войти</Button>          // рендерится как <a>

// Размеры: xs | sm | md (default) | lg
// Иконка-кнопка: size="icon" | "iconSm" | "iconLg"
<Button size="icon"><TrashIcon /></Button>
<Button size="sm" variant="secondary">Черновик</Button>

// Состояние загрузки (пример)
<Button disabled>
  <Spinner size="sm" /> Отправка…
</Button>
```

### Уведомления и сообщения

```tsx
// Alert — встроенное в страницу сообщение
import { Alert, AlertTitle, AlertDescription } from './components/Alert/Alert';
<Alert variant="destructive">
  <AlertTitle>Ошибка</AlertTitle>
  <AlertDescription>Не удалось сохранить данные.</AlertDescription>
</Alert>

// Toast — временное уведомление в углу (нужен ToastProvider в корне)
import { useToast } from './components/Toast/Toast';
const { addToast } = useToast();
addToast({ title: 'Сохранено', description: 'Данные обновлены', variant: 'default' });
addToast({ title: 'Ошибка', variant: 'destructive', duration: 8000 });

// AlertDialog — блокирующее подтверждение деструктивного действия
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
} from './components/AlertDialog/AlertDialog';
<AlertDialog open={open} onClose={() => setOpen(false)}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Удалить запись?</AlertDialogTitle>
      <AlertDialogDescription>Это действие необратимо.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={() => setOpen(false)}>Отмена</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Оверлеи

```tsx
// Dialog / Modal — модальное окно
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from './components/Dialog/Dialog';
<Dialog open={open} onClose={() => setOpen(false)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Редактировать</DialogTitle>
      <DialogDescription>Внесите изменения и сохраните.</DialogDescription>
    </DialogHeader>
    {/* контент формы */}
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
      <Button onClick={handleSave}>Сохранить</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Drawer / Sheet — боковая панель
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './components/Drawer/Drawer';
<Drawer open={open} onClose={() => setOpen(false)}>
  <DrawerContent side="right">
    <DrawerHeader>
      <DrawerTitle>Фильтры</DrawerTitle>
    </DrawerHeader>
    {/* содержимое */}
  </DrawerContent>
</Drawer>
```

### Навигация и структура

```tsx
// Tabs
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs/Tabs';
<Tabs defaultValue="general">
  <TabsList>
    <TabsTrigger value="general">Основные</TabsTrigger>
    <TabsTrigger value="advanced">Расширенные</TabsTrigger>
  </TabsList>
  <TabsContent value="general">{/* … */}</TabsContent>
  <TabsContent value="advanced">{/* … */}</TabsContent>
</Tabs>

// Accordion
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/Accordion/Accordion';
<Accordion type="single" collapsible defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger>Вопрос 1</AccordionTrigger>
    <AccordionContent>Ответ на вопрос 1.</AccordionContent>
  </AccordionItem>
</Accordion>

// Breadcrumb
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './components/Breadcrumb/Breadcrumb';
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Главная</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Текущая страница</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Таблицы и данные

```tsx
import {
  Table, TableHeader, TableBody, TableRow,
  TableHead, TableCell, TableFooter, TableCaption,
} from './components/Table/Table';

<Table>
  <TableCaption>Список пользователей</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Имя</TableHead>
      <TableHead>Статус</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map(u => (
      <TableRow key={u.id}>
        <TableCell>{u.name}</TableCell>
        <TableCell><Badge variant={u.active ? 'default' : 'secondary'}>{u.active ? 'Активен' : 'Неактивен'}</Badge></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## 6. Дизайн-система — токены

Все константы в `src/styles/variables.scss`. Импортируйте в SCSS-модули:

```scss
@use '../../styles/variables.scss' as *;
```

### Цвета (CSS-переменные через SCSS)

```scss
$background       // фон страницы / карточки (hsl(--background))
$foreground       // основной текст
$primary          // акцентный цвет бренда
$primary-foreground
$secondary        // вторичный фон (кнопка secondary, бейдж)
$secondary-foreground
$muted            // приглушённый фон (таб-лист, disabled area)
$muted-foreground // подписи, placeholder, иконки
$accent           // hover-фон для ghost-кнопок, меню
$accent-foreground
$destructive      // красный (ошибка, удаление)
$destructive-foreground
$border           // цвет рамок карточек, разделителей
$input            // цвет рамки полей ввода
$ring             // цвет focus-кольца
$card             // фон карточки
$card-foreground
$popover          // фон поповера / тултипа
$popover-foreground
```

### Типографика

```scss
$font-sans        // системный шрифт SF Pro / Segoe UI / Helvetica
$font-size-xs     // 0.75rem  — бейджи, метки меню
$font-size-sm     // 0.875rem — основной UI-текст (кнопки, поля, таблицы)
$font-size-base   // 1rem     — заголовки alert, body
$font-size-lg     // 1.125rem — заголовки Card, Dialog
$font-size-xl     // 1.25rem  — заголовки секций
$tracking-ui      // -0.01em  — межбуквенный интервал UI
$tracking-tight   // -0.022em — заголовки
```

### Отступы

```scss
$spacing-xs  // 0.25rem  (4px)
$spacing-sm  // 0.5rem   (8px)
$spacing-md  // 1rem     (16px)
$spacing-lg  // 1.5rem   (24px)
$spacing-xl  // 2rem     (32px)
```

### Размеры контролов (Button / Input)

```scss
$control-h-sm   // 2rem    (32px) — size="sm"
$control-h-md   // 2.25rem (36px) — size="md" (default)
$control-h-lg   // 2.5rem  (40px) — size="lg"
$control-px     // 0.75rem         — горизонтальный padding
```

### Радиус

```scss
$radius-xs  // 0.3125rem
$radius-sm  // 0.4375rem
$radius-md  // 0.625rem  — кнопки, поля
$radius-lg  // 0.75rem   — карточки, модалки, аккордеон
$radius-xl  // 0.875rem
```

### Переходы

```scss
$ease-standard   // cubic-bezier(0.25, 0.1, 0.25, 1)  — hover, цвет
$ease-spring     // cubic-bezier(0.16, 1, 0.3, 1)      — поповеры, меню, анимации входа
$transition-fast // 120ms $ease-standard
$transition-base // 180ms $ease-standard
$transition-slow // 260ms $ease-standard
```

### Focus ring (стандарт)

```scss
$focus-ring-width  // 2px
$focus-ring-offset // 2px

// Паттерн для любого интерактивного элемента:
&:focus-visible {
  outline: $focus-ring-width solid $ring;
  outline-offset: $focus-ring-offset;
}
```

### Z-index

```scss
$z-docked           // 10
$z-sticky           // 100
$z-floating         // 200  — DropdownMenu, Popover
$z-overlay-backdrop // 1000 — оверлей диалога
$z-overlay          // 1001 — содержимое диалога
$z-toast            // 1100
$z-tooltip          // 1200
```

---

## 7. Создание нового компонента

Если нужного компонента нет, создайте его по шаблону:

```
src/components/MyWidget/
├── MyWidget.tsx
└── MyWidget.module.scss
```

**MyWidget.tsx:**
```tsx
import { forwardRef, type HTMLAttributes } from 'react';
import styles from './MyWidget.module.scss';

export interface MyWidgetProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary';
}

export const MyWidget = forwardRef<HTMLDivElement, MyWidgetProps>(
  ({ variant = 'default', className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`${styles.widget} ${styles[variant]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </div>
  )
);

MyWidget.displayName = 'MyWidget';
```

**MyWidget.module.scss:**
```scss
@use '../../styles/variables.scss' as *;

.widget {
  border-radius: $radius-md;
  border: $border-width solid $border;
  font-family: $font-sans;
  font-size: $font-size-sm;
  transition: background-color $transition-fast;

  &:focus-visible {
    outline: $focus-ring-width solid $ring;
    outline-offset: $focus-ring-offset;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}

.default { background: $background; color: $foreground; }
.secondary { background: $secondary; color: $secondary-foreground; }
```

---

## 8. Типовые паттерны страниц

### Страница с формой

```tsx
<Card>
  <CardHeader>
    <CardTitle>Профиль</CardTitle>
    <CardDescription>Обновите данные учётной записи</CardDescription>
  </CardHeader>
  <CardContent>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <Label htmlFor="name">Имя</Label>
        <Input id="name" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="bio">О себе</Label>
        <Textarea id="bio" rows={4} value={bio} onChange={e => setBio(e.target.value)} />
      </div>
    </div>
  </CardContent>
  <CardFooter>
    <Button variant="outline" onClick={handleCancel}>Отмена</Button>
    <Button onClick={handleSave}>Сохранить</Button>
  </CardFooter>
</Card>
```

### Страница с таблицей и экшнами

```tsx
<div>
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
    <h1>Пользователи</h1>
    <Button onClick={() => setCreateOpen(true)}>Добавить</Button>
  </div>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Имя</TableHead>
        <TableHead>Статус</TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {users.map(u => (
        <TableRow key={u.id}>
          <TableCell>{u.name}</TableCell>
          <TableCell><Badge>{u.status}</Badge></TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="iconSm" variant="ghost"><MoreHorizontal /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleEdit(u)}>Редактировать</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleDelete(u)}>Удалить</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

### Настройки с переключателями

```tsx
<Card>
  <CardHeader><CardTitle>Уведомления</CardTitle></CardHeader>
  <CardContent>
    {[
      { id: 'email', label: 'Email-уведомления' },
      { id: 'push', label: 'Push-уведомления' },
    ].map(item => (
      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0' }}>
        <Label htmlFor={item.id}>{item.label}</Label>
        <Switch
          id={item.id}
          checked={settings[item.id]}
          onChange={e => updateSetting(item.id, e.target.checked)}
        />
      </div>
    ))}
  </CardContent>
</Card>
```

---

## 9. Тема и цветовая схема

Тема управляется атрибутом `data-theme` на `<html>`:

```
data-theme="light"          // светлая + нейтральная
data-theme="dark"           // тёмная + нейтральная
data-theme="light blue"     // светлая + синяя схема
data-theme="dark green"     // тёмная + зелёная схема
```

Поддерживаемые цветовые схемы: `default`, `blue`, `green`, `purple`, `orange`, `rose`.

Для переключения — компонент `ThemeSwitcher`. Для ручного управления:

```ts
document.documentElement.setAttribute('data-theme', 'dark blue');
localStorage.setItem('theme', 'dark blue');
```

---

## 10. Контрольный список миграции

При переносе экрана или компонента с другой библиотеки:

- [ ] Заменить все нативные `<button>` на `<Button>`
- [ ] Заменить `<input>` на `<Input>`, `<textarea>` на `<Textarea>`, `<select>` на `<Select>`
- [ ] Добавить `<Label htmlFor="...">` к каждому полю формы
- [ ] Убрать все Tailwind-классы (`className="flex items-center..."`)
- [ ] Переписать встроенные стили-константы в `*.module.scss` через переменные
- [ ] Заменить самодельные модалки на `Dialog` / `AlertDialog` / `Drawer`
- [ ] Заменить самодельные тосты на `Toast` (+ `ToastProvider` в корне)
- [ ] Заменить самодельные тултипы на `Tooltip` (+ `TooltipProvider`)
- [ ] Заменить спиннеры-SVG на `<Spinner>`
- [ ] Проверить focus-visible на всех интерактивных элементах
- [ ] Запустить `npm run lint` — должно быть 0 ошибок

---

## 11. Частые ошибки

| Ошибка | Причина | Решение |
|--------|---------|---------|
| `useToast` throws | `ToastProvider` не в дереве | Обернуть `<App>` в `<ToastProvider>` |
| Tooltip не показывается | `TooltipProvider` отсутствует | Добавить `<TooltipProvider>` выше `<Tooltip>` |
| Стили не применяются | `globals.scss` не импортирован | `import './styles/globals.scss'` в `main.tsx` |
| `Modal` не работает | `Dialog/` папка удалена | `Modal` — re-export из `Dialog`; нужны обе папки |
| Цвета не меняются при смене темы | Использованы hex-цвета вместо CSS-переменных | Использовать только `$primary`, `$background` и т.д. |
| Border не подхватывает тему | `1px solid #e2e8f0` вместо переменной | Использовать `$border-width solid $border` |

---

## 12. Ссылки

| Документ | Содержание |
|----------|------------|
| `docs/COMPONENT_GUIDE.md` | Полный API каждого компонента с примерами |
| `docs/COMPONENTS_AI_REFERENCE.md` | Матрица «задача → компонент» на русском |
| `docs/STYLE_GUIDE.md` | Визуальный стайл-гайд |
| `docs/THEME_SYSTEM.md` | Детали системы тем и цветовых схем |
| `src/styles/variables.scss` | Все токены дизайна (источник истины) |
| `src/App.tsx` | Живое демо всех 51 компонента |
