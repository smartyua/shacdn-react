# shadcn MCP Server - налз озможност

## MCP еве усешно оклчен!

**енткато**: `project-0-shacdn-shadcn` 
**азване**: shadcn 
**асоложене**: `/Users/smarty/.cursor/projects/Users-smarty-shacdn/mcps/project-0-shacdn-shadcn/`

---

## остуне нстумент

### 1. `list_items_in_registries`
олучт ссок все комонентов з shadcn/ui registry.

**аамет**:
- `registries`: Array (наме, `["@shadcn"]`)
- `limit`: Number (колчество езултатов)
- `offset`: Number (л агна)

**айено**: **403 комонента** в registry @shadcn!

### 2. `view_items_in_registries`
осмотет еталну нома о комонента (ко, завсмост).

**аамет**:
- `items`: Array (наме, `["@shadcn/alert", "@shadcn/button"]`)

### 3. `get_item_examples_from_registries`
олучт ме солзован комонентов с олнм коом.

**аамет**:
- `registries`: Array
- `query`: String (осковй заос, наме "alert-demo")

### 4. `search_items_in_registries`
оск комонентов о мен/осан.

### 5. `get_audit_checklist`
олучт чеклст л аута комонентов.

### 6. `get_project_registries`
сок остун registries.

### 7. `get_add_command_for_items`
оман л обавлен комонентов в оект.

---

## остуне комонент (то-50)

1. **accordion** 
2. **alert** (уже млементован)
3. **alert-dialog** (уже млементован)
4. **aspect-ratio** 
5. **avatar** (уже млементован)
6. **badge** (уже млементован)
7. **breadcrumb** (уже млементован)
8. **button** (уже млементован)
9. **button-group** 
10. **calendar** (уже млементован)
11. **card** (уже млементован)
12. **carousel** 
13. **chart** 
14. **checkbox** (уже млементован)
15. **collapsible** (нужно млементоват)
16. **combobox** 
17. **command** (нужно млементоват)
18. **context-menu** (нужно млементоват)
19. **dialog** (уже млементован)
20. **drawer** (уже млементован)
21. **dropdown-menu** (уже млементован)
22. **empty** 
23. **field** 
24. **form** 
25. **hover-card** (нужно млементоват)
26. **input** (уже млементован)
27. **input-group** (уже млементован)
28. **input-otp** 
29. **item** 
30. **label** (уже млементован)
31. **menubar** (нужно млементоват)
32. **navigation-menu** (нужно млементоват)
33. **pagination** (уже млементован)
34. **popover** (нужно млементоват)
35. **progress** (уже млементован)
36. **radio-group** (нужно млементоват)
37. **resizable** 
38. **scroll-area** (нужно млементоват)
39. **select** (уже млементован)
40. **separator** (уже млементован)
41. **sheet** 
42. **sidebar** 
43. **skeleton** (уже млементован)
44. **slider** (уже млементован)
45. **sonner** (нужно млементоват)
46. **spinner** (нужно млементоват)
47. **switch** (уже млементован)
48. **table** (уже млементован)
49. **tabs** (уже млементован)
50. **textarea** (уже млементован)

**сего в registry**: 403 комонента!

---

## ак солзоват MCP л текуей абот

### 1. олучт огналнй ко комонента

```typescript
CallMcpTool({
 server: "project-0-shacdn-shadcn",
 toolName: "view_items_in_registries",
 arguments: { items: ["@shadcn/tooltip"] }
})
```

### 2. осмотет ме солзован

```typescript
CallMcpTool({
 server: "project-0-shacdn-shadcn",
 toolName: "get_item_examples_from_registries",
 arguments: { 
 registries: ["@shadcn"],
 query: "tooltip-demo"
 }
})
```

### 3. айт комонент о заосу

```typescript
CallMcpTool({
 server: "project-0-shacdn-shadcn",
 toolName: "search_items_in_registries",
 arguments: {
 registries: ["@shadcn"],
 query: "popover"
 }
})
```

---

## актческе ме солзован

### ме 1: овека Alert

 олучл огналнй ко Alert з shadcn/ui:

```tsx
const alertVariants = cva(
 "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
 {
 variants: {
 variant: {
 default: "bg-card text-card-foreground",
 destructive: "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
 },
 },
 }
)
```

**лчеве наок**:
- солзует CSS Grid (не flexbox!)
- Условне grid-колонк чеез `has-[>svg]:`
- конка: `size-4` (16px, не 20px как умал!)
- Destructive: `bg-card` (не озачнй каснй!)

### ме 2: зучене немлементованн комонентов

л млемента Tooltip:
1. олучаем ко: `view_items_in_registries(["@shadcn/tooltip"])`
2. мотм ме: `get_item_examples_from_registries("tooltip-demo")`
3. зучаем завсмост
4. млементуем в SCSS

---

## емуества солзован MCP

### то можно елат:

1. **олучат огналнй ко** - точна млемента з shadcn/ui
2. **зучат ме** - 12+ меов л кажого комонента
3. **овет завсмост** - вет все завсмост комонента
4. **Бстое ототоване** - кооват стуктуу аатоват о SCSS
5. **ут суеству комонентов** - савнват с огналом

### то может елат:

1. аму устанавлват комонент (то read-only registry)
2. втоматческ конветоват Tailwind в SCSS
3. ооват суествуе айл

---

## екомена л текуей абот

### сокй отет (солзоват MCP)

л неоста ктческ важн комонентов:

1. **Tooltip** 
 ```typescript
 get_item_examples_from_registries({ 
 registries: ["@shadcn"], 
 query: "tooltip" 
 })
 ```

2. **Popover** 
 ```typescript
 view_items_in_registries({ items: ["@shadcn/popover"] })
 ```

3. **RadioGroup** 
 ```typescript
 view_items_in_registries({ items: ["@shadcn/radio-group"] })
 ```

### енй отет

4. **HoverCard**
5. **ScrollArea**
6. **Command**

### л аута суеству комонентов

солзоват MCP л савнен:
- Alert (уже овеен)
- Button
- Input
- Card
- Switch

---

## во

**shadcn MCP севе ОЬ О** л текуей абот!

### ожно солзоват л:

1. **млемента нов комонентов** - точнй reference code
2. **ута суеству** - савнене с огналом
3. **зучен best practices** - как shadcn елает комонент
4. **Бстого ототован** - стуктуа уже ест
5. **овек edge cases** - ме окват все сена

### Workflow:

1. олучт огналнй ко чеез MCP
2. зучт стуктуу стл
3. атоват о SCSS (вместо Tailwind)
4. млементоват в React
5. овет все ваант солзован

---

## татстка

- **сего комонентов в registry**: 403
- **млементовано в оекте**: ~28
- **остуно чеез MCP**: 100%
- **меов на комонент**: 5-15
- **олнота окумента**: Отлчна

**MCP севе готов к солзован!** 
