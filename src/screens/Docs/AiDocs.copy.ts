import type { Locale } from '../../components/Locale/Locale';

/** Tool names exposed by `mcp/shacdn-server/src/index.ts`; `mcp/shacdn-server/llms.test.ts` keeps them in sync. */
export const MCP_TOOLS = [
  'search_components',
  'list_components',
  'get_component',
  'get_component_bundle',
  'get_install_command',
  'get_design_system',
  'get_integration_guide',
  'install_to_project',
  'list_screen_patterns',
  'get_screen_pattern',
] as const;

export type McpToolName = (typeof MCP_TOOLS)[number];

export type AiDocsCopy = {
  documentTitle: string;
  sidebarTitle: string;
  pageNav: string;
  onThisPage: string;
  breadcrumb: string;
  title: string;
  lead: string;
  intro: string;
  sections: {
    connect: string;
    tools: string;
    skill: string;
    install: string;
    context: string;
    prompt: string;
  };
  connect: {
    body: string;
    buildFirst: string;
    pathNote: string;
  };
  tools: {
    body: string;
    nameColumn: string;
    purposeColumn: string;
    descriptions: Record<McpToolName, string>;
  };
  skill: {
    body: string;
    files: { path: string; description: string }[];
  };
  install: {
    body: string;
    tokensOnly: string;
    withComponents: string;
    dryRun: string;
    after: string;
  };
  context: {
    body: string;
    items: { label: string; href: string; description: string }[];
  };
  prompt: {
    body: string;
    text: string;
  };
};

const en: AiDocsCopy = {
  documentTitle: 'AI and MCP — shacdn',
  sidebarTitle: 'Docs',
  pageNav: 'Documentation',
  onThisPage: 'On this page',
  breadcrumb: 'AI and MCP',
  title: 'shacdn for AI agents',
  lead: 'Give your coding agent the catalog, the source and a one-line install for every component. It can find the right piece, read how it works and add it without guessing.',
  intro:
    'shacdn is copy-paste: components land in your repo as plain TSX and SCSS modules that you own. Everything below works offline from a local clone — there is no hosted registry and no account.',
  sections: {
    connect: 'Connect the MCP server',
    tools: 'Tools',
    skill: 'Add the agent skill',
    install: 'Install with the CLI',
    context: 'Readable context',
    prompt: 'Try a prompt',
  },
  connect: {
    body: 'A local, read-mostly stdio server. Only install_to_project writes files, and it never overwrites without force.',
    buildFirst: 'Build it once in the shacdn clone:',
    pathNote: 'Replace /path/to/shacdn with the absolute path of your clone. Inside this repo, .cursor/mcp.json already points at the built server.',
  },
  tools: {
    body: 'What an agent can ask the server for:',
    nameColumn: 'Tool',
    purposeColumn: 'Use it to',
    descriptions: {
      search_components: 'Find components by intent, such as “confirm a destructive action” or “quota”.',
      list_components: 'Browse the whole catalog with providers and aliases marked.',
      get_component: 'Read one component’s TSX and SCSS source.',
      get_component_bundle: 'Get a component plus every internal dependency, in copy order.',
      get_install_command: 'Get one CLI command for several components, with copy order and providers.',
      get_design_system: 'Read the tokens (variables.scss) and theme globals to copy first.',
      get_integration_guide: 'Step-by-step setup for another React + Vite app.',
      install_to_project: 'Write tokens and components straight into a target folder (dry run supported).',
      list_screen_patterns: 'See full-page compositions built from the library.',
      get_screen_pattern: 'Read a screen’s source together with its component bundle.',
    },
  },
  skill: {
    body: 'Teaches the agent when to reach for shacdn, how to install it and which design rules to keep. Copy the skill folder into your project, or paste the rules into AGENTS.md or CLAUDE.md.',
    files: [
      { path: '.cursor/skills/shacdn-style-guide/SKILL.md', description: 'Entry point: tokens, patterns and the export workflow.' },
      { path: 'AGENTS.md', description: 'Always-on rules: setup, required checks, the two known traps.' },
      { path: 'design.md', description: 'UI contract: tokens, layout and which component to pick.' },
      { path: 'docs/INTEGRATION_GUIDE.md', description: 'Full consumer setup, theming and providers.' },
      { path: 'docs/COMPONENTS_AI_REFERENCE.md', description: 'Task → component matrix.' },
    ],
  },
  install: {
    body: 'The installer copies src/styles first, resolves internal dependencies and patches your app entry to import the theme.',
    tokensOnly: 'Design tokens only',
    withComponents: 'Tokens plus components',
    dryRun: 'Preview without writing',
    after: 'Then import each component from its folder, e.g. import { Button } from \'./components/Button/Button\'. Requires react, react-dom and sass; lucide-react is optional.',
  },
  context: {
    body: 'Plain text and JSON for agents, search and your own tooling. They are generated from the MCP catalog with npm run shacdn:llms and a test fails when they drift.',
    items: [
      { label: 'llms.txt', href: '/llms.txt', description: 'Index of every component with a one-line description.' },
      { label: 'llms-full.txt', href: '/llms-full.txt', description: 'Every component with exports, dependencies, providers and import line.' },
      { label: 'catalog.json', href: '/catalog.json', description: 'Machine-readable metadata for your own tooling.' },
      { label: 'Component catalog', href: '/components', description: 'Live examples of every component.' },
    ],
  },
  prompt: {
    body: 'Name the job, not the markup. The agent searches shacdn before it writes anything.',
    text: 'Build a settings page with shacdn. Use the shacdn MCP server to find\ncomponents for the profile form, a seats NumberField, a usage meter and a\nHoldToConfirm delete action. Install them with get_install_command, use\nonly tokens from variables.scss, and check light and dark themes.',
  },
};

const ru: AiDocsCopy = {
  documentTitle: 'AI и MCP — shacdn',
  sidebarTitle: 'Документация',
  pageNav: 'Документация',
  onThisPage: 'На этой странице',
  breadcrumb: 'AI и MCP',
  title: 'shacdn для AI-агентов',
  lead: 'Дайте агенту каталог, исходники и установку одной командой для каждого компонента. Он найдёт нужный, прочитает, как тот устроен, и добавит без догадок.',
  intro:
    'shacdn — copy-paste библиотека: компоненты попадают в ваш репозиторий обычными TSX и SCSS-модулями, которыми вы владеете. Всё ниже работает офлайн из локального клона — без хостинга реестра и без аккаунта.',
  sections: {
    connect: 'Подключите MCP-сервер',
    tools: 'Инструменты',
    skill: 'Добавьте skill для агента',
    install: 'Установка через CLI',
    context: 'Контекст для чтения',
    prompt: 'Пример промпта',
  },
  connect: {
    body: 'Локальный stdio-сервер, почти только для чтения. Файлы пишет лишь install_to_project, и без force ничего не перезаписывает.',
    buildFirst: 'Соберите его один раз в клоне shacdn:',
    pathNote: 'Замените /path/to/shacdn на абсолютный путь к клону. Внутри этого репозитория .cursor/mcp.json уже указывает на собранный сервер.',
  },
  tools: {
    body: 'Что агент может запросить у сервера:',
    nameColumn: 'Инструмент',
    purposeColumn: 'Для чего',
    descriptions: {
      search_components: 'Найти компоненты по задаче, например «подтвердить удаление» или «квота».',
      list_components: 'Посмотреть весь каталог с пометками о провайдерах и алиасах.',
      get_component: 'Прочитать TSX и SCSS одного компонента.',
      get_component_bundle: 'Получить компонент со всеми внутренними зависимостями в порядке копирования.',
      get_install_command: 'Получить одну CLI-команду для нескольких компонентов, порядок копирования и провайдеры.',
      get_design_system: 'Прочитать токены (variables.scss) и глобальные стили темы, которые копируются первыми.',
      get_integration_guide: 'Пошаговая настройка в другом React + Vite приложении.',
      install_to_project: 'Записать токены и компоненты прямо в целевую папку (есть dry run).',
      list_screen_patterns: 'Посмотреть готовые экраны, собранные из библиотеки.',
      get_screen_pattern: 'Прочитать исходник экрана вместе с набором его компонентов.',
    },
  },
  skill: {
    body: 'Учит агента, когда брать shacdn, как его устанавливать и каких правил дизайна держаться. Скопируйте папку skill в проект или вставьте правила в AGENTS.md или CLAUDE.md.',
    files: [
      { path: '.cursor/skills/shacdn-style-guide/SKILL.md', description: 'Точка входа: токены, паттерны и процесс экспорта.' },
      { path: 'AGENTS.md', description: 'Постоянные правила: установка, обязательные проверки, две известные ловушки.' },
      { path: 'design.md', description: 'UI-контракт: токены, сетка и выбор компонента.' },
      { path: 'docs/INTEGRATION_GUIDE.md', description: 'Полная настройка у потребителя, темы и провайдеры.' },
      { path: 'docs/COMPONENTS_AI_REFERENCE.md', description: 'Матрица «задача → компонент».' },
    ],
  },
  install: {
    body: 'Установщик сначала копирует src/styles, разрешает внутренние зависимости и добавляет импорт темы в точку входа приложения.',
    tokensOnly: 'Только дизайн-токены',
    withComponents: 'Токены и компоненты',
    dryRun: 'Предпросмотр без записи',
    after: 'Затем импортируйте компонент из его папки, например import { Button } from \'./components/Button/Button\'. Нужны react, react-dom и sass; lucide-react — по желанию.',
  },
  context: {
    body: 'Текст и JSON для агентов, поиска и ваших инструментов. Файлы генерируются из каталога MCP командой npm run shacdn:llms, а тест падает, если они разошлись с каталогом.',
    items: [
      { label: 'llms.txt', href: '/llms.txt', description: 'Индекс всех компонентов с описанием в одну строку.' },
      { label: 'llms-full.txt', href: '/llms-full.txt', description: 'Каждый компонент: экспорты, зависимости, провайдеры и строка импорта.' },
      { label: 'catalog.json', href: '/catalog.json', description: 'Машиночитаемые метаданные для своих инструментов.' },
      { label: 'Каталог компонентов', href: '/components', description: 'Живые примеры всех компонентов.' },
    ],
  },
  prompt: {
    body: 'Называйте задачу, а не разметку. Агент сначала ищет в shacdn, а потом пишет код.',
    text: 'Собери страницу настроек на shacdn. Через MCP-сервер shacdn найди\nкомпоненты для формы профиля, NumberField для мест, UsageMeter и\nHoldToConfirm для удаления. Установи их через get_install_command, используй\nтолько токены из variables.scss и проверь светлую и тёмную темы.',
  },
};

const AI_DOCS_COPY: Record<Locale, AiDocsCopy> = { en, ru, ua: en, de: en, pl: en };

export const getAiDocsCopy = (locale: Locale): AiDocsCopy => AI_DOCS_COPY[locale];
