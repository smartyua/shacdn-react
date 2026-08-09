import type { Locale } from '../../components/Locale/Locale';

export type TeamRoleKey = 'owner' | 'editor' | 'viewer';

export type NotificationVariant = 'default' | 'secondary' | 'outline';

export type ShadcnHomeCopy = {
  documentTitle: string;
  hero: {
    badge: string;
    title: string;
    leadBeforeRhythm: string;
    leadAfterRhythm: string;
    viewComponents: string;
    openCatalog: string;
  };
  payment: {
    title: string;
    description: string;
    nameOnCard: string;
    namePlaceholder: string;
    cardNumber: string;
    cardNumberPlaceholder: string;
    cvv: string;
    cvvPlaceholder: string;
    month: string;
    monthAriaLabel: string;
    monthPlaceholder: string;
    year: string;
    yearAriaLabel: string;
    yearPlaceholder: string;
    billingAddress: string;
    billingPlaceholder: string;
    billingHelper: string;
    sameAsShipping: string;
    comments: string;
    commentsPlaceholder: string;
    submit: string;
    cancel: string;
  };
  team: {
    title: string;
    description: string;
    pendingInvites: string;
    pending: string;
    invitePlaceholder: string;
    sendInvite: string;
    members: ReadonlyArray<{
      id: 'cn' | 'al' | 'tk';
      initials: string;
      name: string;
      roleKey: TeamRoleKey;
      role: string;
    }>;
  };
  priceRange: {
    title: string;
    description: (min: string, max: string) => string;
    results: string;
    current: (amount: string) => string;
    ariaLabel: string;
  };
  urlInput: {
    title: string;
    description: string;
    prefix: string;
    placeholder: string;
    ariaLabel: string;
  };
  twoFactor: {
    title: string;
    description: string;
    enable: string;
    enableAriaLabel: string;
    alertTitle: string;
    alertDescription: string;
  };
  appearance: {
    title: string;
    description: string;
    tabAppearance: string;
    tabNotifications: string;
    wallpaperTinting: string;
    wallpaperAriaLabel: string;
    wallpaperHelper: string;
    notificationsPlaceholder: string;
  };
  compute: {
    title: string;
    description: string;
    kubernetes: string;
    kubernetesHelper: string;
    virtualMachine: string;
    virtualMachineHelper: string;
    gpuCount: string;
    gpuHelper: string;
  };
  storage: {
    title: string;
    auto: string;
    used: (percent: number) => string;
    send: string;
  };
  referral: {
    title: string;
    description: string;
    ariaLabel: string;
    placeholder: string;
    options: {
      social: string;
      search: string;
      referral: string;
      other: string;
    };
  };
  terms: {
    title: string;
    agree: string;
  };
  processing: {
    title: string;
    description: string;
    cancel: string;
  };
  copilot: {
    title: string;
    prompt: string;
    promptPlaceholder: string;
    badgeAuto: string;
    badgeAllSources: string;
    badgeArchive: string;
  };
  notifications: {
    title: string;
    description: string;
    markAllAsRead: string;
    items: ReadonlyArray<{
      id: 'cn' | 'al' | 'tk';
      initials: string;
      name: string;
      text: string;
      time: string;
      variant: NotificationVariant;
    }>;
  };
  activity: {
    title: string;
    description: string;
    testsPassed: string;
    complete: string;
    spinnerAriaLabel: string;
    items: ReadonlyArray<{
      id: 'sync-files' | 'update-packages' | 'deploy-build';
      label: string;
      status: string;
      spinning: boolean;
    }>;
  };
  otp: {
    title: string;
    description: string;
    helper: string;
    verify: string;
    resend: string;
  };
  shortcuts: {
    title: string;
    description: string;
    items: ReadonlyArray<{
      id: 'command-palette' | 'search-files' | 'toggle-sidebar' | 'new-file' | 'save';
      label: string;
      keys: readonly [string, string];
    }>;
  };
  loadingState: {
    title: string;
    description: string;
    toggleAriaLabel: string;
    personName: string;
    personRole: string;
    badgeDesign: string;
    badgeUiUx: string;
  };
  teamMembers: {
    title: string;
    description: string;
    invitePlaceholder: string;
    invite: string;
  };
  search: {
    title: string;
    description: string;
    placeholder: string;
    ariaLabel: string;
    faq: ReadonlyArray<{ q: string; a: string }>;
  };
  cta: {
    openSource: string;
    componentCount: string;
    title: string;
    description: string;
    browseCatalog: string;
    viewSource: string;
  };
  footer: string;
};

const EN_COPY = {
  documentTitle: 'shadcn/ui React Components — Home',
  hero: {
    badge: 'New',
    title: 'The Foundation for your Design System',
    leadBeforeRhythm:
      'A set of beautifully designed components that you can customize, extend, and build on. Start here then make it your own. Open Source. Open Code. This playground follows the same rhythm as ',
    leadAfterRhythm: ', rebuilt with SCSS modules in this repo.',
    viewComponents: 'View components',
    openCatalog: 'Open catalog',
  },
  payment: {
    title: 'Payment Method',
    description: 'All transactions are secure and encrypted',
    nameOnCard: 'Name on Card',
    namePlaceholder: 'John Doe',
    cardNumber: 'Card Number',
    cardNumberPlaceholder: 'Enter your 16-digit number',
    cvv: 'CVV',
    cvvPlaceholder: '123',
    month: 'Month',
    monthAriaLabel: 'Expiry month',
    monthPlaceholder: 'MM',
    year: 'Year',
    yearAriaLabel: 'Expiry year',
    yearPlaceholder: 'YYYY',
    billingAddress: 'Billing Address',
    billingPlaceholder: '123 Main St',
    billingHelper: 'The billing address associated with your payment method',
    sameAsShipping: 'Same as shipping address',
    comments: 'Comments',
    commentsPlaceholder: 'Add a note',
    submit: 'Submit',
    cancel: 'Cancel',
  },
  team: {
    title: 'Team',
    description: 'Invite collaborators',
    pendingInvites: '2 pending invites…',
    pending: 'Pending',
    invitePlaceholder: 'colleague@company.com',
    sendInvite: 'Send invite',
    members: [
      { id: 'cn', initials: 'CN', name: 'Chloe Newton', roleKey: 'owner', role: 'Owner' },
      { id: 'al', initials: 'AL', name: 'Alex Lee', roleKey: 'editor', role: 'Editor' },
      { id: 'tk', initials: 'TK', name: 'Thomas Kim', roleKey: 'viewer', role: 'Viewer' },
    ],
  },
  priceRange: {
    title: 'Price Range',
    description: (min, max) => `Set your budget range (${min} – ${max}).`,
    results: '12 results',
    current: (amount) => `Current: ${amount}`,
    ariaLabel: 'Budget range',
  },
  urlInput: {
    title: 'Input',
    description: 'With prefix addon',
    prefix: 'Web ·',
    placeholder: 'example.com',
    ariaLabel: 'Website URL',
  },
  twoFactor: {
    title: 'Two-factor authentication',
    description: 'Verify via email or phone number.',
    enable: 'Enable',
    enableAriaLabel: 'Enable two-factor authentication',
    alertTitle: 'Your profile has been verified.',
    alertDescription: 'Secure sign-in is ready for your account.',
  },
  appearance: {
    title: 'Appearance',
    description: 'Settings preview',
    tabAppearance: 'Appearance',
    tabNotifications: 'Notifications',
    wallpaperTinting: 'Wallpaper Tinting',
    wallpaperAriaLabel: 'Wallpaper tinting',
    wallpaperHelper: 'Allow the wallpaper to be tinted.',
    notificationsPlaceholder: 'Notification preferences would live here.',
  },
  compute: {
    title: 'Compute Environment',
    description: 'Select the compute environment for your cluster.',
    kubernetes: 'Kubernetes',
    kubernetesHelper: 'Run GPU workloads on a K8s configured cluster. This is the default.',
    virtualMachine: 'Virtual Machine',
    virtualMachineHelper: 'Access a VM configured cluster to run workloads. (Coming soon)',
    gpuCount: 'Number of GPUs',
    gpuHelper: 'You can add more later.',
  },
  storage: {
    title: 'Storage',
    auto: 'Auto',
    used: (percent) => `${percent}% used`,
    send: 'Send',
  },
  referral: {
    title: 'How did you hear about us?',
    description: 'Select the option that best describes how you heard about us.',
    ariaLabel: 'Referral source',
    placeholder: 'Select an option',
    options: {
      social: 'Social Media',
      search: 'Search Engine',
      referral: 'Referral',
      other: 'Other',
    },
  },
  terms: {
    title: 'Terms',
    agree: 'I agree to the terms and conditions',
  },
  processing: {
    title: 'Processing your request',
    description: 'Please wait while we process your request. Do not refresh the page.',
    cancel: 'Cancel',
  },
  copilot: {
    title: 'Copilot',
    prompt: 'Prompt',
    promptPlaceholder: 'Add context',
    badgeAuto: 'Auto',
    badgeAllSources: 'All Sources',
    badgeArchive: 'Archive',
  },
  notifications: {
    title: 'Notifications',
    description: 'You have 3 unread messages',
    markAllAsRead: 'Mark all as read',
    items: [
      {
        id: 'cn',
        initials: 'CN',
        name: 'Chloe Newton',
        text: 'joined your workspace',
        time: '2m ago',
        variant: 'default',
      },
      {
        id: 'al',
        initials: 'AL',
        name: 'Alex Lee',
        text: 'commented on your design',
        time: '1h ago',
        variant: 'secondary',
      },
      {
        id: 'tk',
        initials: 'TK',
        name: 'Thomas Kim',
        text: 'mentioned you in Dashboard',
        time: '3h ago',
        variant: 'outline',
      },
    ],
  },
  activity: {
    title: 'Activity',
    description: 'Live status of your deployment pipeline',
    testsPassed: 'Tests passed',
    complete: 'Complete',
    spinnerAriaLabel: 'Loading',
    items: [
      { id: 'sync-files', label: 'Syncing files', status: 'In Progress', spinning: true },
      { id: 'update-packages', label: 'Updating packages', status: 'In Progress', spinning: true },
      { id: 'deploy-build', label: 'Deploying build', status: 'Queued', spinning: false },
    ],
  },
  otp: {
    title: 'Verify Identity',
    description: 'Code sent to ••• 4823',
    helper: 'Enter the 6-digit code.',
    verify: 'Verify',
    resend: 'Resend code',
  },
  shortcuts: {
    title: 'Shortcuts',
    description: 'Keyboard navigation',
    items: [
      { id: 'command-palette', label: 'Open command palette', keys: ['⌘', 'K'] as const },
      { id: 'search-files', label: 'Search files', keys: ['⌘', 'P'] as const },
      { id: 'toggle-sidebar', label: 'Toggle sidebar', keys: ['⌘', 'B'] as const },
      { id: 'new-file', label: 'New file', keys: ['⌘', 'N'] as const },
      { id: 'save', label: 'Save', keys: ['⌘', 'S'] as const },
    ],
  },
  loadingState: {
    title: 'Loading State',
    description: 'Skeleton placeholder',
    toggleAriaLabel: 'Toggle loaded state',
    personName: 'Jane Doe',
    personRole: 'Product Designer',
    badgeDesign: 'Design',
    badgeUiUx: 'UI/UX',
  },
  teamMembers: {
    title: 'Team Members',
    description: '3 members · 2 pending',
    invitePlaceholder: 'email@company.com',
    invite: 'Invite',
  },
  search: {
    title: 'Search',
    description: 'Find components and documentation',
    placeholder: 'Search components…',
    ariaLabel: 'Search',
    faq: [
      {
        q: 'Is this compatible with shadcn/ui?',
        a: 'Yes — same component API and design tokens, rebuilt with SCSS modules instead of Tailwind. Drop-in replacement for most use cases.',
      },
      {
        q: 'Can I use it without Radix UI?',
        a: 'Absolutely. Every component is a pure React + SCSS implementation with no external UI dependencies.',
      },
      {
        q: 'How do I customise the theme?',
        a: 'Override CSS variables in globals.scss or set data-theme on <html>. Six colour schemes and dark mode are included out of the box.',
      },
    ],
  },
  cta: {
    openSource: 'Open Source',
    componentCount: '51 components',
    title: 'Built with SCSS Modules.',
    description:
      'No Tailwind. No Radix. Just React, TypeScript, and SCSS — fully yours to own and extend.',
    browseCatalog: 'Browse catalog',
    viewSource: 'View source',
  },
  footer:
    'Layout mirrors the public shadcn/ui marketing page; components on this site are from this repo only. Use the catalog to audit tokens and control sizes.',
} satisfies ShadcnHomeCopy;

const RU_COPY = {
  documentTitle: 'shadcn/ui React Components — Главная',
  hero: {
    badge: 'Новое',
    title: 'Основа для вашей дизайн-системы',
    leadBeforeRhythm:
      'Набор красиво оформленных компонентов, которые можно настраивать, расширять и развивать. Начните здесь и сделайте их своими. Открытый исходный код. Открытая реализация. Эта площадка следует тому же ритму, что и ',
    leadAfterRhythm: ', но пересобрана с SCSS modules в этом репозитории.',
    viewComponents: 'Смотреть компоненты',
    openCatalog: 'Открыть каталог',
  },
  payment: {
    title: 'Способ оплаты',
    description: 'Все транзакции защищены и зашифрованы',
    nameOnCard: 'Имя на карте',
    namePlaceholder: 'John Doe',
    cardNumber: 'Номер карты',
    cardNumberPlaceholder: 'Введите 16-значный номер',
    cvv: 'CVV',
    cvvPlaceholder: '123',
    month: 'Месяц',
    monthAriaLabel: 'Месяц окончания срока',
    monthPlaceholder: 'ММ',
    year: 'Год',
    yearAriaLabel: 'Год окончания срока',
    yearPlaceholder: 'ГГГГ',
    billingAddress: 'Платёжный адрес',
    billingPlaceholder: '123 Main St',
    billingHelper: 'Адрес, связанный с вашим способом оплаты',
    sameAsShipping: 'Совпадает с адресом доставки',
    comments: 'Комментарии',
    commentsPlaceholder: 'Добавьте заметку',
    submit: 'Отправить',
    cancel: 'Отмена',
  },
  team: {
    title: 'Команда',
    description: 'Пригласите участников',
    pendingInvites: '2 ожидающих приглашения…',
    pending: 'Ожидает',
    invitePlaceholder: 'colleague@company.com',
    sendInvite: 'Отправить приглашение',
    members: [
      { id: 'cn', initials: 'CN', name: 'Chloe Newton', roleKey: 'owner', role: 'Владелец' },
      { id: 'al', initials: 'AL', name: 'Alex Lee', roleKey: 'editor', role: 'Редактор' },
      { id: 'tk', initials: 'TK', name: 'Thomas Kim', roleKey: 'viewer', role: 'Наблюдатель' },
    ],
  },
  priceRange: {
    title: 'Диапазон цен',
    description: (min, max) => `Укажите бюджет (${min} – ${max}).`,
    results: '12 результатов',
    current: (amount) => `Сейчас: ${amount}`,
    ariaLabel: 'Диапазон бюджета',
  },
  urlInput: {
    title: 'Поле ввода',
    description: 'С префиксом',
    prefix: 'Web ·',
    placeholder: 'example.com',
    ariaLabel: 'URL сайта',
  },
  twoFactor: {
    title: 'Двухфакторная аутентификация',
    description: 'Подтверждение по email или номеру телефона.',
    enable: 'Включить',
    enableAriaLabel: 'Включить двухфакторную аутентификацию',
    alertTitle: 'Ваш профиль подтверждён.',
    alertDescription: 'Безопасный вход для вашей учётной записи готов.',
  },
  appearance: {
    title: 'Оформление',
    description: 'Предпросмотр настроек',
    tabAppearance: 'Оформление',
    tabNotifications: 'Уведомления',
    wallpaperTinting: 'Тонировка обоев',
    wallpaperAriaLabel: 'Тонировка обоев',
    wallpaperHelper: 'Разрешить тонировку обоев.',
    notificationsPlaceholder: 'Здесь будут настройки уведомлений.',
  },
  compute: {
    title: 'Среда вычислений',
    description: 'Выберите среду вычислений для вашего кластера.',
    kubernetes: 'Kubernetes',
    kubernetesHelper:
      'Запускайте GPU-нагрузки в кластере с конфигурацией K8s. Это вариант по умолчанию.',
    virtualMachine: 'Виртуальная машина',
    virtualMachineHelper: 'Доступ к кластеру на базе VM для запуска нагрузок. (Скоро)',
    gpuCount: 'Количество GPU',
    gpuHelper: 'Позже можно добавить ещё.',
  },
  storage: {
    title: 'Хранилище',
    auto: 'Авто',
    used: (percent) => `Занято ${percent}%`,
    send: 'Отправить',
  },
  referral: {
    title: 'Как вы о нас узнали?',
    description: 'Выберите вариант, который лучше всего описывает, как вы о нас узнали.',
    ariaLabel: 'Источник перехода',
    placeholder: 'Выберите вариант',
    options: {
      social: 'Социальные сети',
      search: 'Поисковая система',
      referral: 'Рекомендация',
      other: 'Другое',
    },
  },
  terms: {
    title: 'Условия',
    agree: 'Я принимаю условия использования',
  },
  processing: {
    title: 'Обрабатываем ваш запрос',
    description: 'Подождите, пока мы обрабатываем запрос. Не обновляйте страницу.',
    cancel: 'Отмена',
  },
  copilot: {
    title: 'Copilot',
    prompt: 'Запрос',
    promptPlaceholder: 'Добавьте контекст',
    badgeAuto: 'Авто',
    badgeAllSources: 'Все источники',
    badgeArchive: 'Архив',
  },
  notifications: {
    title: 'Уведомления',
    description: 'У вас 3 непрочитанных сообщения',
    markAllAsRead: 'Отметить все как прочитанные',
    items: [
      {
        id: 'cn',
        initials: 'CN',
        name: 'Chloe Newton',
        text: 'присоединилась к вашему рабочему пространству',
        time: '2 мин. назад',
        variant: 'default',
      },
      {
        id: 'al',
        initials: 'AL',
        name: 'Alex Lee',
        text: 'прокомментировал ваш дизайн',
        time: '1 ч. назад',
        variant: 'secondary',
      },
      {
        id: 'tk',
        initials: 'TK',
        name: 'Thomas Kim',
        text: 'упомянул вас в Dashboard',
        time: '3 ч. назад',
        variant: 'outline',
      },
    ],
  },
  activity: {
    title: 'Активность',
    description: 'Статус вашего конвейера развёртывания в реальном времени',
    testsPassed: 'Тесты пройдены',
    complete: 'Готово',
    spinnerAriaLabel: 'Загрузка',
    items: [
      { id: 'sync-files', label: 'Синхронизация файлов', status: 'В процессе', spinning: true },
      { id: 'update-packages', label: 'Обновление пакетов', status: 'В процессе', spinning: true },
      { id: 'deploy-build', label: 'Развёртывание сборки', status: 'В очереди', spinning: false },
    ],
  },
  otp: {
    title: 'Подтверждение личности',
    description: 'Код отправлен на ••• 4823',
    helper: 'Введите 6-значный код.',
    verify: 'Подтвердить',
    resend: 'Отправить код повторно',
  },
  shortcuts: {
    title: 'Сочетания клавиш',
    description: 'Навигация с клавиатуры',
    items: [
      { id: 'command-palette', label: 'Открыть палитру команд', keys: ['⌘', 'K'] as const },
      { id: 'search-files', label: 'Поиск файлов', keys: ['⌘', 'P'] as const },
      { id: 'toggle-sidebar', label: 'Показать или скрыть боковую панель', keys: ['⌘', 'B'] as const },
      { id: 'new-file', label: 'Новый файл', keys: ['⌘', 'N'] as const },
      { id: 'save', label: 'Сохранить', keys: ['⌘', 'S'] as const },
    ],
  },
  loadingState: {
    title: 'Состояние загрузки',
    description: 'Заглушка-скелетон',
    toggleAriaLabel: 'Переключить состояние загрузки',
    personName: 'Jane Doe',
    personRole: 'Продуктовый дизайнер',
    badgeDesign: 'Дизайн',
    badgeUiUx: 'UI/UX',
  },
  teamMembers: {
    title: 'Участники команды',
    description: '3 участника · 2 ожидают',
    invitePlaceholder: 'email@company.com',
    invite: 'Пригласить',
  },
  search: {
    title: 'Поиск',
    description: 'Найдите компоненты и документацию',
    placeholder: 'Поиск компонентов…',
    ariaLabel: 'Поиск',
    faq: [
      {
        q: 'Совместимо ли это с shadcn/ui?',
        a: 'Да — тот же API компонентов и дизайн-токены, но пересобрано на SCSS modules вместо Tailwind. Подходит как замена в большинстве сценариев.',
      },
      {
        q: 'Можно ли использовать без Radix UI?',
        a: 'Конечно. Каждый компонент — чистая реализация на React + SCSS без внешних UI-зависимостей.',
      },
      {
        q: 'Как настроить тему?',
        a: 'Переопределите CSS-переменные в globals.scss или задайте data-theme на <html>. Шесть цветовых схем и тёмная тема включены из коробки.',
      },
    ],
  },
  cta: {
    openSource: 'Открытый исходный код',
    componentCount: '51 компонент',
    title: 'Создано на SCSS Modules.',
    description:
      'Без Tailwind. Без Radix. Только React, TypeScript и SCSS — полностью ваш код для развития и расширения.',
    browseCatalog: 'Открыть каталог',
    viewSource: 'Исходный код',
  },
  footer:
    'Макет повторяет публичную маркетинговую страницу shadcn/ui; компоненты на этом сайте — только из этого репозитория. Используйте каталог для проверки токенов и размеров элементов управления.',
} satisfies ShadcnHomeCopy;

const DE_COPY = {
  documentTitle: 'shadcn/ui React Components — Startseite',
  hero: {
    badge: 'Neu',
    title: 'Das Fundament für Ihr Designsystem',
    leadBeforeRhythm:
      'Eine Sammlung schön gestalteter Komponenten, die Sie anpassen, erweitern und weiterentwickeln können. Starten Sie hier und machen Sie sie zu Ihren eigenen. Open Source. Open Code. Dieser Playground folgt dem gleichen Rhythmus wie ',
    leadAfterRhythm: ', neu aufgebaut mit SCSS modules in diesem Repository.',
    viewComponents: 'Komponenten ansehen',
    openCatalog: 'Katalog öffnen',
  },
  payment: {
    title: 'Zahlungsmethode',
    description: 'Alle Transaktionen sind sicher und verschlüsselt',
    nameOnCard: 'Name auf der Karte',
    namePlaceholder: 'John Doe',
    cardNumber: 'Kartennummer',
    cardNumberPlaceholder: '16-stellige Nummer eingeben',
    cvv: 'CVV',
    cvvPlaceholder: '123',
    month: 'Monat',
    monthAriaLabel: 'Ablaufmonat',
    monthPlaceholder: 'MM',
    year: 'Jahr',
    yearAriaLabel: 'Ablaufjahr',
    yearPlaceholder: 'JJJJ',
    billingAddress: 'Rechnungsadresse',
    billingPlaceholder: '123 Main St',
    billingHelper: 'Die Rechnungsadresse Ihrer Zahlungsmethode',
    sameAsShipping: 'Entspricht der Lieferadresse',
    comments: 'Kommentare',
    commentsPlaceholder: 'Notiz hinzufügen',
    submit: 'Absenden',
    cancel: 'Abbrechen',
  },
  team: {
    title: 'Team',
    description: 'Mitarbeitende einladen',
    pendingInvites: '2 ausstehende Einladungen…',
    pending: 'Ausstehend',
    invitePlaceholder: 'colleague@company.com',
    sendInvite: 'Einladung senden',
    members: [
      { id: 'cn', initials: 'CN', name: 'Chloe Newton', roleKey: 'owner', role: 'Inhaberin' },
      { id: 'al', initials: 'AL', name: 'Alex Lee', roleKey: 'editor', role: 'Bearbeiter' },
      { id: 'tk', initials: 'TK', name: 'Thomas Kim', roleKey: 'viewer', role: 'Betrachter' },
    ],
  },
  priceRange: {
    title: 'Preisspanne',
    description: (min, max) => `Legen Sie Ihr Budget fest (${min} – ${max}).`,
    results: '12 Ergebnisse',
    current: (amount) => `Aktuell: ${amount}`,
    ariaLabel: 'Budgetspanne',
  },
  urlInput: {
    title: 'Eingabe',
    description: 'Mit Präfix-Addon',
    prefix: 'Web ·',
    placeholder: 'example.com',
    ariaLabel: 'Website-URL',
  },
  twoFactor: {
    title: 'Zwei-Faktor-Authentifizierung',
    description: 'Verifizierung per E-Mail oder Telefonnummer.',
    enable: 'Aktivieren',
    enableAriaLabel: 'Zwei-Faktor-Authentifizierung aktivieren',
    alertTitle: 'Ihr Profil wurde verifiziert.',
    alertDescription: 'Sichere Anmeldung ist für Ihr Konto bereit.',
  },
  appearance: {
    title: 'Darstellung',
    description: 'Vorschau der Einstellungen',
    tabAppearance: 'Darstellung',
    tabNotifications: 'Benachrichtigungen',
    wallpaperTinting: 'Hintergrund-Tönung',
    wallpaperAriaLabel: 'Hintergrund-Tönung',
    wallpaperHelper: 'Hintergrundbild tönen lassen.',
    notificationsPlaceholder: 'Benachrichtigungseinstellungen würden hier erscheinen.',
  },
  compute: {
    title: 'Compute-Umgebung',
    description: 'Wählen Sie die Compute-Umgebung für Ihren Cluster.',
    kubernetes: 'Kubernetes',
    kubernetesHelper:
      'GPU-Workloads in einem K8s-konfigurierten Cluster ausführen. Dies ist die Standardeinstellung.',
    virtualMachine: 'Virtuelle Maschine',
    virtualMachineHelper:
      'Auf einen VM-konfigurierten Cluster zugreifen, um Workloads auszuführen. (Demnächst)',
    gpuCount: 'Anzahl der GPUs',
    gpuHelper: 'Sie können später weitere hinzufügen.',
  },
  storage: {
    title: 'Speicher',
    auto: 'Auto',
    used: (percent) => `${percent} % belegt`,
    send: 'Senden',
  },
  referral: {
    title: 'Wie haben Sie von uns erfahren?',
    description: 'Wählen Sie die Option, die am besten beschreibt, wie Sie von uns erfahren haben.',
    ariaLabel: 'Herkunftsquelle',
    placeholder: 'Option auswählen',
    options: {
      social: 'Soziale Medien',
      search: 'Suchmaschine',
      referral: 'Empfehlung',
      other: 'Sonstiges',
    },
  },
  terms: {
    title: 'Bedingungen',
    agree: 'Ich akzeptiere die Allgemeinen Geschäftsbedingungen',
  },
  processing: {
    title: 'Anfrage wird verarbeitet',
    description: 'Bitte warten Sie, während wir Ihre Anfrage verarbeiten. Seite nicht neu laden.',
    cancel: 'Abbrechen',
  },
  copilot: {
    title: 'Copilot',
    prompt: 'Prompt',
    promptPlaceholder: 'Kontext hinzufügen',
    badgeAuto: 'Auto',
    badgeAllSources: 'Alle Quellen',
    badgeArchive: 'Archiv',
  },
  notifications: {
    title: 'Benachrichtigungen',
    description: 'Sie haben 3 ungelesene Nachrichten',
    markAllAsRead: 'Alle als gelesen markieren',
    items: [
      {
        id: 'cn',
        initials: 'CN',
        name: 'Chloe Newton',
        text: 'ist Ihrem Workspace beigetreten',
        time: 'vor 2 Min.',
        variant: 'default',
      },
      {
        id: 'al',
        initials: 'AL',
        name: 'Alex Lee',
        text: 'hat Ihr Design kommentiert',
        time: 'vor 1 Std.',
        variant: 'secondary',
      },
      {
        id: 'tk',
        initials: 'TK',
        name: 'Thomas Kim',
        text: 'hat Sie in Dashboard erwähnt',
        time: 'vor 3 Std.',
        variant: 'outline',
      },
    ],
  },
  activity: {
    title: 'Aktivität',
    description: 'Live-Status Ihrer Deployment-Pipeline',
    testsPassed: 'Tests bestanden',
    complete: 'Abgeschlossen',
    spinnerAriaLabel: 'Wird geladen',
    items: [
      { id: 'sync-files', label: 'Dateien synchronisieren', status: 'In Bearbeitung', spinning: true },
      { id: 'update-packages', label: 'Pakete aktualisieren', status: 'In Bearbeitung', spinning: true },
      { id: 'deploy-build', label: 'Build bereitstellen', status: 'In Warteschlange', spinning: false },
    ],
  },
  otp: {
    title: 'Identität bestätigen',
    description: 'Code gesendet an ••• 4823',
    helper: 'Geben Sie den 6-stelligen Code ein.',
    verify: 'Bestätigen',
    resend: 'Code erneut senden',
  },
  shortcuts: {
    title: 'Tastenkürzel',
    description: 'Tastaturnavigation',
    items: [
      { id: 'command-palette', label: 'Befehlspalette öffnen', keys: ['⌘', 'K'] as const },
      { id: 'search-files', label: 'Dateien suchen', keys: ['⌘', 'P'] as const },
      { id: 'toggle-sidebar', label: 'Seitenleiste ein-/ausblenden', keys: ['⌘', 'B'] as const },
      { id: 'new-file', label: 'Neue Datei', keys: ['⌘', 'N'] as const },
      { id: 'save', label: 'Speichern', keys: ['⌘', 'S'] as const },
    ],
  },
  loadingState: {
    title: 'Ladezustand',
    description: 'Skeleton-Platzhalter',
    toggleAriaLabel: 'Ladezustand umschalten',
    personName: 'Jane Doe',
    personRole: 'Produktdesignerin',
    badgeDesign: 'Design',
    badgeUiUx: 'UI/UX',
  },
  teamMembers: {
    title: 'Teammitglieder',
    description: '3 Mitglieder · 2 ausstehend',
    invitePlaceholder: 'email@company.com',
    invite: 'Einladen',
  },
  search: {
    title: 'Suche',
    description: 'Komponenten und Dokumentation finden',
    placeholder: 'Komponenten suchen…',
    ariaLabel: 'Suche',
    faq: [
      {
        q: 'Ist das mit shadcn/ui kompatibel?',
        a: 'Ja — dieselbe Komponenten-API und Design-Tokens, neu aufgebaut mit SCSS modules statt Tailwind. Drop-in-Ersatz für die meisten Anwendungsfälle.',
      },
      {
        q: 'Kann ich es ohne Radix UI verwenden?',
        a: 'Absolut. Jede Komponente ist eine reine React- + SCSS-Implementierung ohne externe UI-Abhängigkeiten.',
      },
      {
        q: 'Wie passe ich das Theme an?',
        a: 'CSS-Variablen in globals.scss überschreiben oder data-theme auf <html> setzen. Sechs Farbschemata und Dark Mode sind enthalten.',
      },
    ],
  },
  cta: {
    openSource: 'Open Source',
    componentCount: '51 Komponenten',
    title: 'Erstellt mit SCSS Modules.',
    description:
      'Kein Tailwind. Kein Radix. Nur React, TypeScript und SCSS — vollständig unter Ihrer Kontrolle und frei erweiterbar.',
    browseCatalog: 'Katalog durchsuchen',
    viewSource: 'Quellcode ansehen',
  },
  footer:
    'Das Layout spiegelt die öffentliche shadcn/ui-Marketingseite wider; Komponenten auf dieser Website stammen ausschließlich aus diesem Repository. Nutzen Sie den Katalog, um Tokens und Steuergrößen zu prüfen.',
} satisfies ShadcnHomeCopy;

const UA_COPY = {
  documentTitle: 'shadcn/ui React Components — Головна',
  hero: {
    badge: 'Нове',
    title: 'Основа для вашої дизайн-системи',
    leadBeforeRhythm:
      'Набір красиво оформлених компонентів, які можна налаштовувати, розширювати й розвивати. Почніть тут і зробіть їх своїми. Відкритий вихідний код. Відкрита реалізація. Цей майданчик дотримується того ж ритму, що й ',
    leadAfterRhythm: ', але перезібраний з SCSS modules у цьому репозиторії.',
    viewComponents: 'Переглянути компоненти',
    openCatalog: 'Відкрити каталог',
  },
  payment: {
    title: 'Спосіб оплати',
    description: 'Усі транзакції захищені та зашифровані',
    nameOnCard: "Ім'я на картці",
    namePlaceholder: 'John Doe',
    cardNumber: 'Номер картки',
    cardNumberPlaceholder: 'Введіть 16-значний номер',
    cvv: 'CVV',
    cvvPlaceholder: '123',
    month: 'Місяць',
    monthAriaLabel: 'Місяць закінчення терміну',
    monthPlaceholder: 'ММ',
    year: 'Рік',
    yearAriaLabel: 'Рік закінчення терміну',
    yearPlaceholder: 'РРРР',
    billingAddress: 'Платіжна адреса',
    billingPlaceholder: '123 Main St',
    billingHelper: 'Адреса, пов’язана з вашим способом оплати',
    sameAsShipping: 'Збігається з адресою доставки',
    comments: 'Коментарі',
    commentsPlaceholder: 'Додайте нотатку',
    submit: 'Надіслати',
    cancel: 'Скасувати',
  },
  team: {
    title: 'Команда',
    description: 'Запросіть учасників',
    pendingInvites: '2 очікувані запрошення…',
    pending: 'Очікує',
    invitePlaceholder: 'colleague@company.com',
    sendInvite: 'Надіслати запрошення',
    members: [
      { id: 'cn', initials: 'CN', name: 'Chloe Newton', roleKey: 'owner', role: 'Власник' },
      { id: 'al', initials: 'AL', name: 'Alex Lee', roleKey: 'editor', role: 'Редактор' },
      { id: 'tk', initials: 'TK', name: 'Thomas Kim', roleKey: 'viewer', role: 'Спостерігач' },
    ],
  },
  priceRange: {
    title: 'Діапазон цін',
    description: (min, max) => `Вкажіть бюджет (${min} – ${max}).`,
    results: '12 результатів',
    current: (amount) => `Зараз: ${amount}`,
    ariaLabel: 'Діапазон бюджету',
  },
  urlInput: {
    title: 'Поле введення',
    description: 'З префіксом',
    prefix: 'Web ·',
    placeholder: 'example.com',
    ariaLabel: 'URL сайту',
  },
  twoFactor: {
    title: 'Двофакторна автентифікація',
    description: 'Підтвердження через email або номер телефону.',
    enable: 'Увімкнути',
    enableAriaLabel: 'Увімкнути двофакторну автентифікацію',
    alertTitle: 'Ваш профіль підтверджено.',
    alertDescription: 'Безпечний вхід для вашого облікового запису готовий.',
  },
  appearance: {
    title: 'Оформлення',
    description: 'Попередній перегляд налаштувань',
    tabAppearance: 'Оформлення',
    tabNotifications: 'Сповіщення',
    wallpaperTinting: 'Тонування шпалер',
    wallpaperAriaLabel: 'Тонування шпалер',
    wallpaperHelper: 'Дозволити тонування шпалер.',
    notificationsPlaceholder: 'Тут будуть налаштування сповіщень.',
  },
  compute: {
    title: 'Середовище обчислень',
    description: 'Оберіть середовище обчислень для вашого кластера.',
    kubernetes: 'Kubernetes',
    kubernetesHelper:
      'Запускайте GPU-навантаження в кластері з конфігурацією K8s. Це варіант за замовчуванням.',
    virtualMachine: 'Віртуальна машина',
    virtualMachineHelper: 'Доступ до кластера на базі VM для запуску навантажень. (Незабаром)',
    gpuCount: 'Кількість GPU',
    gpuHelper: 'Пізніше можна додати ще.',
  },
  storage: {
    title: 'Сховище',
    auto: 'Авто',
    used: (percent) => `Зайнято ${percent}%`,
    send: 'Надіслати',
  },
  referral: {
    title: 'Як ви про нас дізналися?',
    description: 'Оберіть варіант, який найкраще описує, як ви про нас дізналися.',
    ariaLabel: 'Джерело переходу',
    placeholder: 'Оберіть варіант',
    options: {
      social: 'Соціальні мережі',
      search: 'Пошукова система',
      referral: 'Рекомендація',
      other: 'Інше',
    },
  },
  terms: {
    title: 'Умови',
    agree: 'Я приймаю умови використання',
  },
  processing: {
    title: 'Обробляємо ваш запит',
    description: 'Зачекайте, поки ми обробляємо запит. Не оновлюйте сторінку.',
    cancel: 'Скасувати',
  },
  copilot: {
    title: 'Copilot',
    prompt: 'Запит',
    promptPlaceholder: 'Додайте контекст',
    badgeAuto: 'Авто',
    badgeAllSources: 'Усі джерела',
    badgeArchive: 'Архів',
  },
  notifications: {
    title: 'Сповіщення',
    description: 'У вас 3 непрочитані повідомлення',
    markAllAsRead: 'Позначити все як прочитане',
    items: [
      {
        id: 'cn',
        initials: 'CN',
        name: 'Chloe Newton',
        text: 'приєдналася до вашого робочого простору',
        time: '2 хв. тому',
        variant: 'default',
      },
      {
        id: 'al',
        initials: 'AL',
        name: 'Alex Lee',
        text: 'прокоментував ваш дизайн',
        time: '1 год. тому',
        variant: 'secondary',
      },
      {
        id: 'tk',
        initials: 'TK',
        name: 'Thomas Kim',
        text: 'згадав вас у Dashboard',
        time: '3 год. тому',
        variant: 'outline',
      },
    ],
  },
  activity: {
    title: 'Активність',
    description: 'Статус вашого конвеєра розгортання в реальному часі',
    testsPassed: 'Тести пройдено',
    complete: 'Готово',
    spinnerAriaLabel: 'Завантаження',
    items: [
      { id: 'sync-files', label: 'Синхронізація файлів', status: 'В процесі', spinning: true },
      { id: 'update-packages', label: 'Оновлення пакетів', status: 'В процесі', spinning: true },
      { id: 'deploy-build', label: 'Розгортання збірки', status: 'У черзі', spinning: false },
    ],
  },
  otp: {
    title: 'Підтвердження особи',
    description: 'Код надіслано на ••• 4823',
    helper: 'Введіть 6-значний код.',
    verify: 'Підтвердити',
    resend: 'Надіслати код повторно',
  },
  shortcuts: {
    title: 'Поєднання клавіш',
    description: 'Навігація з клавіатури',
    items: [
      { id: 'command-palette', label: 'Відкрити палітру команд', keys: ['⌘', 'K'] as const },
      { id: 'search-files', label: 'Пошук файлів', keys: ['⌘', 'P'] as const },
      { id: 'toggle-sidebar', label: 'Показати або сховати бокову панель', keys: ['⌘', 'B'] as const },
      { id: 'new-file', label: 'Новий файл', keys: ['⌘', 'N'] as const },
      { id: 'save', label: 'Зберегти', keys: ['⌘', 'S'] as const },
    ],
  },
  loadingState: {
    title: 'Стан завантаження',
    description: 'Заглушка-скелетон',
    toggleAriaLabel: 'Перемкнути стан завантаження',
    personName: 'Jane Doe',
    personRole: 'Продуктовий дизайнер',
    badgeDesign: 'Дизайн',
    badgeUiUx: 'UI/UX',
  },
  teamMembers: {
    title: 'Учасники команди',
    description: '3 учасники · 2 очікують',
    invitePlaceholder: 'email@company.com',
    invite: 'Запросити',
  },
  search: {
    title: 'Пошук',
    description: 'Знайдіть компоненти та документацію',
    placeholder: 'Пошук компонентів…',
    ariaLabel: 'Пошук',
    faq: [
      {
        q: 'Чи сумісне це з shadcn/ui?',
        a: 'Так — той самий API компонентів і дизайн-токени, але перезібрано на SCSS modules замість Tailwind. Підходить як заміна в більшості сценаріїв.',
      },
      {
        q: 'Чи можна використовувати без Radix UI?',
        a: 'Звісно. Кожен компонент — чиста реалізація на React + SCSS без зовнішніх UI-залежностей.',
      },
      {
        q: 'Як налаштувати тему?',
        a: 'Перевизначте CSS-змінні в globals.scss або задайте data-theme на <html>. Шість кольорових схем і темна тема включені з коробки.',
      },
    ],
  },
  cta: {
    openSource: 'Відкритий вихідний код',
    componentCount: '51 компонент',
    title: 'Створено на SCSS Modules.',
    description:
      'Без Tailwind. Без Radix. Лише React, TypeScript і SCSS — повністю ваш код для розвитку та розширення.',
    browseCatalog: 'Відкрити каталог',
    viewSource: 'Вихідний код',
  },
  footer:
    'Макет повторює публічну маркетингову сторінку shadcn/ui; компоненти на цьому сайті — лише з цього репозиторію. Використовуйте каталог для перевірки токенів і розмірів елементів керування.',
} satisfies ShadcnHomeCopy;

const PL_COPY = {
  documentTitle: 'shadcn/ui React Components — Strona główna',
  hero: {
    badge: 'Nowość',
    title: 'Fundament Twojego systemu projektowego',
    leadBeforeRhythm:
      'Zestaw pięknie zaprojektowanych komponentów, które możesz dostosować, rozszerzyć i rozwijać. Zacznij tutaj, a potem uczyń je własnymi. Open Source. Open Code. To playground podąża za tym samym rytmem co ',
    leadAfterRhythm: ', przebudowany z SCSS modules w tym repozytorium.',
    viewComponents: 'Zobacz komponenty',
    openCatalog: 'Otwórz katalog',
  },
  payment: {
    title: 'Metoda płatności',
    description: 'Wszystkie transakcje są bezpieczne i szyfrowane',
    nameOnCard: 'Imię i nazwisko na karcie',
    namePlaceholder: 'John Doe',
    cardNumber: 'Numer karty',
    cardNumberPlaceholder: 'Wprowadź 16-cyfrowy numer',
    cvv: 'CVV',
    cvvPlaceholder: '123',
    month: 'Miesiąc',
    monthAriaLabel: 'Miesiąc ważności',
    monthPlaceholder: 'MM',
    year: 'Rok',
    yearAriaLabel: 'Rok ważności',
    yearPlaceholder: 'RRRR',
    billingAddress: 'Adres rozliczeniowy',
    billingPlaceholder: '123 Main St',
    billingHelper: 'Adres powiązany z Twoją metodą płatności',
    sameAsShipping: 'Taki sam jak adres dostawy',
    comments: 'Komentarze',
    commentsPlaceholder: 'Dodaj notatkę',
    submit: 'Wyślij',
    cancel: 'Anuluj',
  },
  team: {
    title: 'Zespół',
    description: 'Zaproś współpracowników',
    pendingInvites: '2 oczekujące zaproszenia…',
    pending: 'Oczekujące',
    invitePlaceholder: 'colleague@company.com',
    sendInvite: 'Wyślij zaproszenie',
    members: [
      { id: 'cn', initials: 'CN', name: 'Chloe Newton', roleKey: 'owner', role: 'Właściciel' },
      { id: 'al', initials: 'AL', name: 'Alex Lee', roleKey: 'editor', role: 'Edytor' },
      { id: 'tk', initials: 'TK', name: 'Thomas Kim', roleKey: 'viewer', role: 'Obserwator' },
    ],
  },
  priceRange: {
    title: 'Zakres cen',
    description: (min, max) => `Ustaw zakres budżetu (${min} – ${max}).`,
    results: '12 wyników',
    current: (amount) => `Aktualnie: ${amount}`,
    ariaLabel: 'Zakres budżetu',
  },
  urlInput: {
    title: 'Pole wprowadzania',
    description: 'Z prefiksem',
    prefix: 'Web ·',
    placeholder: 'example.com',
    ariaLabel: 'Adres URL witryny',
  },
  twoFactor: {
    title: 'Uwierzytelnianie dwuskładnikowe',
    description: 'Weryfikacja przez e-mail lub numer telefonu.',
    enable: 'Włącz',
    enableAriaLabel: 'Włącz uwierzytelnianie dwuskładnikowe',
    alertTitle: 'Twój profil został zweryfikowany.',
    alertDescription: 'Bezpieczne logowanie jest gotowe dla Twojego konta.',
  },
  appearance: {
    title: 'Wygląd',
    description: 'Podgląd ustawień',
    tabAppearance: 'Wygląd',
    tabNotifications: 'Powiadomienia',
    wallpaperTinting: 'Barwienie tapety',
    wallpaperAriaLabel: 'Barwienie tapety',
    wallpaperHelper: 'Zezwól na barwienie tapety.',
    notificationsPlaceholder: 'Tutaj znajdą się preferencje powiadomień.',
  },
  compute: {
    title: 'Środowisko obliczeniowe',
    description: 'Wybierz środowisko obliczeniowe dla klastra.',
    kubernetes: 'Kubernetes',
    kubernetesHelper:
      'Uruchamiaj obciążenia GPU w klastrze skonfigurowanym pod K8s. To ustawienie domyślne.',
    virtualMachine: 'Maszyna wirtualna',
    virtualMachineHelper:
      'Uzyskaj dostęp do klastra opartego na VM, aby uruchamiać obciążenia. (Wkrótce)',
    gpuCount: 'Liczba GPU',
    gpuHelper: 'Możesz dodać więcej później.',
  },
  storage: {
    title: 'Magazyn',
    auto: 'Auto',
    used: (percent) => `Wykorzystano ${percent}%`,
    send: 'Wyślij',
  },
  referral: {
    title: 'Skąd o nas wiesz?',
    description: 'Wybierz opcję, która najlepiej opisuje, skąd o nas wiesz.',
    ariaLabel: 'Źródło rekomendacji',
    placeholder: 'Wybierz opcję',
    options: {
      social: 'Media społecznościowe',
      search: 'Wyszukiwarka',
      referral: 'Polecenie',
      other: 'Inne',
    },
  },
  terms: {
    title: 'Warunki',
    agree: 'Akceptuję regulamin',
  },
  processing: {
    title: 'Przetwarzanie żądania',
    description: 'Poczekaj, aż przetworzymy Twoje żądanie. Nie odświeżaj strony.',
    cancel: 'Anuluj',
  },
  copilot: {
    title: 'Copilot',
    prompt: 'Prompt',
    promptPlaceholder: 'Dodaj kontekst',
    badgeAuto: 'Auto',
    badgeAllSources: 'Wszystkie źródła',
    badgeArchive: 'Archiwum',
  },
  notifications: {
    title: 'Powiadomienia',
    description: 'Masz 3 nieprzeczytane wiadomości',
    markAllAsRead: 'Oznacz wszystkie jako przeczytane',
    items: [
      {
        id: 'cn',
        initials: 'CN',
        name: 'Chloe Newton',
        text: 'dołączyła do Twojej przestrzeni roboczej',
        time: '2 min temu',
        variant: 'default',
      },
      {
        id: 'al',
        initials: 'AL',
        name: 'Alex Lee',
        text: 'skomentował Twój projekt',
        time: '1 godz. temu',
        variant: 'secondary',
      },
      {
        id: 'tk',
        initials: 'TK',
        name: 'Thomas Kim',
        text: 'wspomniał o Tobie w Dashboard',
        time: '3 godz. temu',
        variant: 'outline',
      },
    ],
  },
  activity: {
    title: 'Aktywność',
    description: 'Status potoku wdrożeniowego na żywo',
    testsPassed: 'Testy zaliczone',
    complete: 'Ukończono',
    spinnerAriaLabel: 'Ładowanie',
    items: [
      { id: 'sync-files', label: 'Synchronizacja plików', status: 'W toku', spinning: true },
      { id: 'update-packages', label: 'Aktualizacja pakietów', status: 'W toku', spinning: true },
      { id: 'deploy-build', label: 'Wdrażanie buildu', status: 'W kolejce', spinning: false },
    ],
  },
  otp: {
    title: 'Weryfikacja tożsamości',
    description: 'Kod wysłany na ••• 4823',
    helper: 'Wprowadź 6-cyfrowy kod.',
    verify: 'Zweryfikuj',
    resend: 'Wyślij kod ponownie',
  },
  shortcuts: {
    title: 'Skróty klawiszowe',
    description: 'Nawigacja klawiaturą',
    items: [
      { id: 'command-palette', label: 'Otwórz paletę poleceń', keys: ['⌘', 'K'] as const },
      { id: 'search-files', label: 'Szukaj plików', keys: ['⌘', 'P'] as const },
      { id: 'toggle-sidebar', label: 'Przełącz pasek boczny', keys: ['⌘', 'B'] as const },
      { id: 'new-file', label: 'Nowy plik', keys: ['⌘', 'N'] as const },
      { id: 'save', label: 'Zapisz', keys: ['⌘', 'S'] as const },
    ],
  },
  loadingState: {
    title: 'Stan ładowania',
    description: 'Placeholder szkieletu',
    toggleAriaLabel: 'Przełącz stan załadowania',
    personName: 'Jane Doe',
    personRole: 'Projektant produktu',
    badgeDesign: 'Design',
    badgeUiUx: 'UI/UX',
  },
  teamMembers: {
    title: 'Członkowie zespołu',
    description: '3 członków · 2 oczekujących',
    invitePlaceholder: 'email@company.com',
    invite: 'Zaproś',
  },
  search: {
    title: 'Szukaj',
    description: 'Znajdź komponenty i dokumentację',
    placeholder: 'Szukaj komponentów…',
    ariaLabel: 'Szukaj',
    faq: [
      {
        q: 'Czy to jest kompatybilne z shadcn/ui?',
        a: 'Tak — ten sam API komponentów i tokeny projektowe, przebudowane z SCSS modules zamiast Tailwind. Zastępstwo plug-and-play w większości przypadków.',
      },
      {
        q: 'Czy mogę używać tego bez Radix UI?',
        a: 'Oczywiście. Każdy komponent to czysta implementacja React + SCSS bez zewnętrznych zależności UI.',
      },
      {
        q: 'Jak dostosować motyw?',
        a: 'Nadpisz zmienne CSS w globals.scss lub ustaw data-theme na <html>. Sześć schematów kolorów i tryb ciemny są dostępne od razu.',
      },
    ],
  },
  cta: {
    openSource: 'Open Source',
    componentCount: '51 komponentów',
    title: 'Zbudowane z SCSS Modules.',
    description:
      'Bez Tailwind. Bez Radix. Tylko React, TypeScript i SCSS — w pełni Twoje, gotowe do rozbudowy.',
    browseCatalog: 'Przeglądaj katalog',
    viewSource: 'Zobacz kod źródłowy',
  },
  footer:
    'Układ odzwierciedla publiczną stronę marketingową shadcn/ui; komponenty na tej witrynie pochodzą wyłącznie z tego repozytorium. Użyj katalogu, aby sprawdzić tokeny i rozmiary kontrolek.',
} satisfies ShadcnHomeCopy;

export const BASE_DOCUMENT_TITLE = 'shadcn/ui React Components';

export const SHADCN_HOME_COPY: Record<Locale, ShadcnHomeCopy> = {
  en: EN_COPY,
  ru: RU_COPY,
  de: DE_COPY,
  ua: UA_COPY,
  pl: PL_COPY,
};

export const getShadcnHomeCopy = (locale: Locale): ShadcnHomeCopy => SHADCN_HOME_COPY[locale];

const LOCALE_TO_INTL: Record<Locale, string> = {
  en: 'en-US',
  ru: 'ru-RU',
  de: 'de-DE',
  ua: 'uk-UA',
  pl: 'pl-PL',
};

export const formatUsdAmount = (amount: number, locale: Locale): string =>
  new Intl.NumberFormat(LOCALE_TO_INTL[locale], {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

const getRoleVariant = (roleKey: TeamRoleKey): 'default' | 'secondary' | 'outline' => {
  switch (roleKey) {
    case 'owner':
      return 'default';
    case 'editor':
      return 'secondary';
    case 'viewer':
      return 'outline';
  }
};

export { getRoleVariant };
