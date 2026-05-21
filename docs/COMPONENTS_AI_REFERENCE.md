# Справочник компонентов shacdn для AI и кросс-проектной разработки

Документ для **выбора нужного контроля** из папки `src/components/` репозитория shacdn. Каталог охватывает **54+ примитивов** в паритете с реестром [shadcn/ui](https://ui.shadcn.com) (без Tailwind: те же типичные высоты контролов **h-8 / h-9 / h-10**). Полный список папок см. навигацию в демо `App.tsx` и блок ниже.

> **Официальный референс дизайна:** [https://ui.shadcn.com](https://ui.shadcn.com) · [DESIGN_REFERENCE.md](./DESIGN_REFERENCE.md) · [SHADCN_PARITY_MATRIX.md](./SHADCN_PARITY_MATRIX.md)  
> **Подключение в другой проект:** [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) — копирование, зависимости, MCP, чеклист  
> **Визуальные токены:** [STYLE_GUIDE.md](./STYLE_GUIDE.md)

**Базовый импорт (пути относительно `src/`):**

```txt
./components/<ИмяПапки>/<ИмяФайла>.tsx
```

Подробные примеры API: [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md).

---

## Как пользоваться этим файлом (для ИИ)

1. Определите **тип задачи**: форма, навигация, оверлей, таблица, статус и т.д.
2. Найдите строку в [матрице «задача → компонент»](#матрица-задача--компонент) или в [сводном списке](#сводный-список-компонентов-shadcn-parity).
3. Используйте **ровно указанную папку** — имена совпадают с каталогами в `src/components/`.
4. Не смешивайте роли: например **`Alert`** — встроенный баннер, **`Toast`** — всплывающее после действия (нужен `ToastProvider`), **`AlertDialog`** — блокирующее подтверждение деструктивного действия.

---

## Матрица: задача → компонент

| Задача / контроль | Компонент(ы) | Папка |
|-------------------|----------------|-------|
| Кнопка действия или ссылка-CTA (`<button>` / `<a>`) | `Button` | `Button/` |
| Однострочный ввод текста, email, пароль, поиск, файл | `Input` | `Input/` |
| Многострочный ввод | `Textarea` | `Textarea/` |
| Выпадающий список значений (нативный `<select>`) | `Select` | `Select/` |
| Выбор одной опции из группы | `RadioGroup`, `RadioGroupItem` (+ `Label`) | `RadioGroup/`, `Label/` |
| Вкл/выкл опция («галочка») | `Checkbox` | `Checkbox/` |
| Вкл/выкл настройка в виде тумблера | `Switch` | `Switch/` |
| Числовой диапазон ползунком | `Slider` | `Slider/` |
| Выбор даты с календарём | `DatePicker` | `DatePicker/` |
| Префикс/суффикс к полю (URL, суффикс домена) | `InputGroup`, `InputGroupAddon` + `Input` | `InputGroup/` |
| Подпись к полю | `Label` | `Label/` |
| Карточка контента с заголовком/подвалом | `Card`, `CardHeader`, `CardTitle`, … | `Card/` |
| Статус, тег, метка на элементе | `Badge` | `Badge/` |
| Табличные данные | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` | `Table/` |
| Обход иерархии страниц | `Breadcrumb`, `BreadcrumbList`, … | `Breadcrumb/` |
| Переключение вкладок панелей | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | `Tabs/` |
| Нумерация страниц списка | `Pagination`, … | `Pagination/` |
| Меню действий из кнопки | `DropdownMenu`, … | `DropdownMenu/` |
| Горизонтальная навигация сайта с выпадающими панелями | `NavigationMenu`, … | `NavigationMenu/` |
| Карусель слайдов | `Carousel`, … | `Carousel/` |
| Палитра команд (поиск + действия) | `Command`, `CommandDialog`, … | `Command/` |
| Неблокирующее сообщение в контексте страницы | `Alert`, `AlertTitle`, `AlertDescription` | `Alert/` |
| Краткая обратная связь после действия | `ToastProvider`, `useToast`, `ToastTitle`, … | `Toast/` |
| Индикатор долгого процесса (полоска %) | `Progress` | `Progress/` |
| Индикатор ожидания (круг) | `Spinner` | `Spinner/` |
| Заготовка пока контент грузится | `Skeleton` | `Skeleton/` |
| Подсказка по hover/focus на элементе | `TooltipProvider`, `Tooltip`, … | `Tooltip/` |
| Модальное окно (форма, детали контента; API «dialog» или «modal») | `Dialog`, `DialogContent`, … или `Modal`, `ModalContent`, … | `Dialog/` или `Modal/` (Modal реэкспортирует Dialog) |
| Модальное подтверждение («Удалить?») | `AlertDialog`, `AlertDialogContent`, … | `AlertDialog/` |
| Боковая панель (мобильное меню, фильтры) | `Drawer`, `DrawerContent`, … | `Drawer/` |
| Разделитель блоков или пунктов меню | `Separator` | `Separator/` |
| Отображение сочетания клавиш | `Kbd`, `KbdGroup` | `Kbd/` |
| Аватар пользователя / группа участников | `Avatar`, … | `Avatar/` |
| Светлая/тёмная тема и цветовая схема | `ThemeSwitcher` | `ThemeSwitcher/` |

---

## Сводный список компонентов (shadcn parity)

Имена папок в `src/components/` (в скобках — примечание):

`Accordion`, `Alert`, `AlertDialog`, `AspectRatio`, `Avatar`, `Badge`, `Breadcrumb`, `Button`, `ButtonGroup`, `Calendar`, `Card`, `Carousel`, `Checkbox`, `Collapsible` (база для Accordion), `Combobox`, `Command`, `ContextMenu`, `DatePicker`, `Dialog`, `Drawer`, `DropdownMenu`, `Empty`, `Field`, `Form`, `HoverCard`, `Input`, `InputGroup`, `InputOTP`, `Item`, `Kbd`, `Label`, `Menubar`, `Modal` (алиас Dialog), `NavigationMenu`, `Pagination`, `Popover`, `Progress`, `RadioGroup`, `ScrollArea`, `Select`, `Separator`, `Sheet` (алиас Drawer), `Skeleton`, `Slider`, `Spinner`, `Switch`, `Table`, `Tabs`, `Textarea`, `ThemeSwitcher` (демо темы), `Toast`, `Toggle`, `ToggleGroup`, `Tooltip`.

**Zero-dep варианты реестра:** `chart` (SVG `BarChart`), `resizable` (pointer-drag panels), `sidebar` (layout provider). **Замены:** `sonner` → `Sonner`/`Toast`, `native-select` → `NativeSelect`/`Select`, `direction` → `DirectionProvider`. **Carousel / Command** — без Embla/cmdk. См. [SHADCN_PARITY_MATRIX.md](./SHADCN_PARITY_MATRIX.md).

---

## Каталог (детальные карточки) — первые 32 + расширения

Ниже сохранены подробные карточки исходного набора; новые примитивы следуют тем же правилам импорта (`Component/Component.tsx` + `Component.module.scss`).

Каждый блок: **назначение**, **когда использовать**, **экспорты**, **путь**, **тип контроля (English summary for tooling)**.

### 1. Alert

- **Назначение:** статусное сообщение на странице (инфо, успех по смыслу дизайна, ошибка через `variant="destructive"`).
- **Когда использовать:** предупреждения у формы, баннеры политики, результат операции без закрытия модалки.
- **Не путать с:** `Toast` (фиксируется в углу экрана), `AlertDialog` (модалка с фокус-ловушкой).
- **Экспорты:** `Alert`, `AlertTitle`, `AlertDescription`.
- **Путь:** `Alert/Alert.tsx`
- **Control type:** static inline messaging / banner

---

### 2. AlertDialog

- **Назначение:** модальное **подтверждение** (удалить, отменить подписку); обёртка над `Dialog` со стилизацией и кнопками `AlertDialogAction` / `AlertDialogCancel`.
- **Когда использовать:** деструктивные или необратимые действия перед выполнением.
- **Не путать с:** обычный `Dialog` (редактирование без акцента на «опасности»).
- **Экспорты:** `AlertDialog`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel`.
- **Путь:** `AlertDialog/AlertDialog.tsx`
- **Control type:** modal confirmation / destructive guard

---

### 3. Avatar

- **Назначение:** изображение пользователя, инициалы при отсутствии фото, бейдж статуса, группа аватаров с «+N».
- **Когда использовать:** профили, комментарии, списки участников.
- **Экспорты:** `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarBadge`, `AvatarGroup`, `AvatarGroupCount`.
- **Путь:** `Avatar/Avatar.tsx`
- **Control type:** user/media thumbnail display

---

### 4. Badge

- **Назначение:** компактная метка (статус, версия, фильтр-тег).
- **Когда использовать:** рядом с заголовками, в ячейках таблицы, на карточках.
- **Не путать с:** `Button` (кликабельное действие).
- **Экспорты:** `Badge`.
- **Путь:** `Badge/Badge.tsx`
- **Control type:** status / label chip

---

### 5. Breadcrumb

- **Назначение:** цепочка навигации «Home / Section / Page».
- **Когда использовать:** вложенные разделы app shell, документация.
- **Экспорты:** `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`.
- **Путь:** `Breadcrumb/Breadcrumb.tsx`
- **Control type:** hierarchical navigation

---

### 6. Button

- **Назначение:** основное нажатие; при **`href`** рендерится ссылка с теми же стилями.
- **Когда использовать:** submit, отмена, CTA, иконк-кнопки (`size="icon"`…).
- **Экспорты:** `Button`.
- **Путь:** `Button/Button.tsx`
- **Control type:** action trigger / link-styled CTA

---

### 7. Card

- **Назначение:** группировка контента с опциональным заголовком, описанием, футером и угловым действием.
- **Когда использовать:** дашборд-карточки, формы в рамке, списки элементов.
- **Экспорты:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`.
- **Путь:** `Card/Card.tsx`
- **Control type:** content container / panel

---

### 8. Checkbox

- **Назначение:** независимый выбор опций; нативный `input` с кастомной стилизацией.
- **Когда использовать:** согласия, мультивыбор фильтров, настройки.
- **Экспорты:** `Checkbox`.
- **Путь:** `Checkbox/Checkbox.tsx`
- **Control type:** boolean multi-select item

---

### 9. DatePicker

- **Назначение:** выбор даты через выпадающий календарь (контролируемый / неконтролируемый).
- **Когда использовать:** формы с датой, фильтры по периоду.
- **Пропсы (ключевые):** `label?`, `value?`, `defaultValue?`, `onValueChange?`, `disabled?`.
- **Экспорты:** `DatePicker`.
- **Путь:** `DatePicker/DatePicker.tsx`
- **Control type:** date input / calendar popover

---

### 10. Dialog

- **Назначение:** модальное окно с оверлеем, закрытие по Escape и клику вне (через `onClose` на контенте).
- **Когда использовать:** формы «создать/редактировать», детальный просмотр во всплывающем слое.
- **Экспорты:** `Dialog`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`.
- **Путь:** `Dialog/Dialog.tsx`
- **Control type:** modal dialog (general purpose)

---

### 11. Drawer

- **Назначение:** выезжающая панель с 4 сторон (`side`), аналог модалки для узких экранов или вторичных действий.
- **Когда использовать:** фильтры каталога, настройки, мобильное меню.
- **Экспорты:** `Drawer`, `DrawerOverlay`, `DrawerContent`, `DrawerHeader`, `DrawerFooter`, `DrawerTitle`, `DrawerDescription`, `DrawerClose`.
- **Путь:** `Drawer/Drawer.tsx`
- **Control type:** slide-over panel

---

### 12. DropdownMenu

- **Назначение:** список пунктов меню, открываемый с якоря (триггер).
- **Когда использовать:** меню «⋯», аккаунт, контекстные действия.
- **Экспорты:** `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, …
- **Путь:** `DropdownMenu/DropdownMenu.tsx`
- **Control type:** menu / command list (popover)

---

### 13. Input

- **Назначение:** однострочное поле; стандартные `type`, `placeholder`, `disabled`, `aria-invalid`.
- **Когда использовать:** почти все текстовые поля форм.
- **Экспорты:** `Input`.
- **Путь:** `Input/Input.tsx`
- **Control type:** text field (single-line)

---

### 14. InputGroup

- **Назначение:** визуально склеить **аддон** с `Input` (префикс/суффикс).
- **Когда использовать:** URL, валюта, единицы измерения.
- **Экспорты:** `InputGroup`, `InputGroupAddon`.
- **Путь:** `InputGroup/InputGroup.tsx`
- **Control type:** composed input with addon

---

### 15. Kbd

- **Назначение:** отображение клавиш в `<kbd>`; опционально `KbdGroup` для группировки.
- **Когда использовать:** подсказки горячих клавиш, документация.
- **Экспорты:** `Kbd`, `KbdGroup`.
- **Путь:** `Kbd/Kbd.tsx`
- **Control type:** keyboard hint display

---

### 16. Label

- **Назначение:** доступная подпись к контролу (`htmlFor` → `id` поля); поддержка `data-disabled` / `data-invalid` для стилей.
- **Когда использовать:** всегда с полями формы и `Radio`/`Checkbox` по возможности.
- **Экспорты:** `Label`.
- **Путь:** `Label/Label.tsx`
- **Control type:** form label

---

### 17. Pagination

- **Назначение:** навигация по страницам результата (`<nav aria-label="pagination">`).
- **Когда использовать:** списки, таблицы с постраничной выдачей.
- **Экспорты:** `Pagination`, `PaginationList`, `PaginationItem`, `PaginationLink`, `PaginationButton`, `PaginationEllipsis`.
- **Путь:** `Pagination/Pagination.tsx`
- **Control type:** paged navigation

---

### 18. Progress

- **Назначение:** полоса прогресса с `role="progressbar"` и `aria-valuenow`.
- **Когда использовать:** загрузка файла, шаги мастера, долгий запрос.
- **Экспорты:** `Progress`.
- **Путь:** `Progress/Progress.tsx`
- **Control type:** determinate progress bar

---

### 19. RadioGroup

- **Назначение:** ровно **один** выбор из группы; стилизованные радиокнопки.
- **Когда использовать:** планы тарифа, плотность интерфейса, любыe mutually exclusive options.
- **Экспорты:** `RadioGroup`, `RadioGroupItem`.
- **Путь:** `RadioGroup/RadioGroup.tsx`
- **Control type:** single-select group

---

### 20. Select

- **Назначение:** нативный `<select>` с оформлением shadcn.
- **Когда использовать:** длинные списки, простые перечисления без кастомного поиска.
- **Не путать с:** кастомные combobox (в библиотеке нет отдельного combobox — потребуется композиция или внешний паттерн).
- **Экспорты:** `Select`.
- **Путь:** `Select/Select.tsx`
- **Control type:** native dropdown select

---

### 21. Separator

- **Назначение:** горизонтальная или вертикальная линия; опция `decorative={false}` для семантического разделителя.
- **Когда использовать:** между секциями, в тулбарах.
- **Экспорты:** `Separator`.
- **Путь:** `Separator/Separator.tsx`
- **Control type:** visual / semantic divider

---

### 22. Skeleton

- **Назначение:** плейсхолдер во время загрузки (пульсация).
- **Когда использовать:** списки, карточки до прихода данных.
- **Экспорты:** `Skeleton`.
- **Путь:** `Skeleton/Skeleton.tsx`
- **Control type:** loading placeholder

---

### 23. Slider

- **Назначение:** диапазонное значение (нативный `input type="range"` под капотом по смыслу UI).
- **Когда использовать:** громкость, фильтр по цене, любой непрерывный параметр.
- **Экспорты:** `Slider`.
- **Путь:** `Slider/Slider.tsx`
- **Control type:** range slider

---

### 24. Spinner

- **Назначение:** круговой индикатор загрузки, размеры `sm` | `md` | `lg`.
- **Когда использовать:** кнопка «Отправка…», центр карточки при refresh.
- **Не путать с:** `Progress` (известный процент).
- **Экспорты:** `Spinner`.
- **Путь:** `Spinner/Spinner.tsx`
- **Control type:** indeterminate busy indicator

---

### 25. Switch

- **Назначение:** тумблер на базе `checkbox` + `role="switch"` (вкл/выкл настройки).
- **Когда использовать:** feature flags в UI, уведомления вкл/выкл.
- **Экспорты:** `Switch` (`size?: 'default' | 'sm'`).
- **Путь:** `Switch/Switch.tsx`
- **Control type:** toggle switch

---

### 26. Table

- **Назначение:** семантическая таблица с шапкой/телом/подвалом и ячейками.
- **Когда использовать:** админки, сравнения, данные в строках/колонках.
- **Экспорты:** `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`.
- **Путь:** `Table/Table.tsx`
- **Control type:** data table

---

### 27. Tabs

- **Назначение:** переключение панелей контента по вкладкам (контекст `Tabs` + `value`/`onValueChange`).
- **Когда использовать:** настройки с подразделами, карточка с режимами просмотра.
- **Экспорты:** `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`.
- **Путь:** `Tabs/Tabs.tsx`
- **Control type:** tabbed region

---

### 28. Textarea

- **Назначение:** многострочный ввод.
- **Когда использовать:** комментарии, описания, JSON вручную (осторожно с UX).
- **Экспорты:** `Textarea`.
- **Путь:** `Textarea/Textarea.tsx`
- **Control type:** multi-line text field

---

### 29. ThemeSwitcher

- **Назначение:** UI переключения **светлая/тёмная** тема и **цветовой схемы** (default, blue, green, …); пишет `data-theme` на `documentElement` и `localStorage`.
- **Когда использовать:** демо, настройки приложения-потребителя токенов из `globals.scss`.
- **Экспорты:** `ThemeSwitcher`.
- **Путь:** `ThemeSwitcher/ThemeSwitcher.tsx`
- **Control type:** theme / color-scheme preference UI

---

### 30. Toast

- **Назначение:** краткие уведомления в углу экрана; очередь через контекст.
- **Когда использовать:** «Сохранено», «Ошибка сети» без блокировки интерфейса.
- **Обязательно:** обернуть приложение в `ToastProvider`; вызывать `useToast().addToast({ title, description?, variant?, position? })`.
- **Экспорты:** `ToastProvider`, `useToast`, `Toast`, `ToastTitle`, `ToastDescription`, `ToastClose`, `ToastViewport`, …
- **Путь:** `Toast/Toast.tsx`
- **Control type:** transient notification (toast)

---

### 31. Tooltip

- **Назначение:** всплывающая подсказка у триггера; требуется `TooltipProvider` на ветке дерева.
- **Когда использовать:** иконки без текста, уточнение кнопок.
- **Экспорты:** `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent`.
- **Путь:** `Tooltip/Tooltip.tsx`
- **Control type:** hover/focus hint

---

### 32. Modal (modal window)

- **Назначение:** то же модальное окно, что и **`Dialog`**, экспортированное как **`Modal`**, **`ModalContent`**, … для проектов и спецификаций, где ожидают термин «modal».
- **Когда использовать:** выбирайте `Modal*` вместо `Dialog*` по соглашению команды (одна и та же доступность и стили; стили задаёт `Dialog.module.scss`).
- **Зависимость при переносе:** вместе с папкой `Modal/` нужен каталог **`Dialog/`** (импорт из `../Dialog/Dialog`).
- **Экспорты:** `Modal`, `ModalOverlay`, `ModalContent`, `ModalHeader`, `ModalFooter`, `ModalTitle`, `ModalDescription`, типы `ModalProps`, `ModalContentProps`.
- **Путь:** `Modal/Modal.tsx`
- **Control type:** modal dialog (alternate export name)

---

## Зависимости между компонентами (частые связки)

- **Форма:** `Label` + `Input` / `Textarea` / `Select` / `Switch` / `Checkbox` / `RadioGroup` + `Button` submit.
- **Таблица + статус:** `TableCell` внутри — `Badge`.
- **Модалка с формой:** `Dialog` или `Modal` + `Input` + `Button`.
- **Уведомление об успехе:** `ToastProvider` (корень) + `useToast` в обработчике.
- **Справка по UI:** `Tooltip` вокруг `Button` только с иконкой.

---

## Ограничения и внешние зависимости

Библиотека сознательно **без Radix / Tailwind**: сложные паттерны (навигационное меню уровня shadcn blocks, resizable panels, carousel, command palette на `cmdk`, диаграммы) подключаются либо отдельным пакетом в продукте, либо композицией текущих примитивов. См. [сводный список](#сводный-список-компонентов-shadcn-parity).
