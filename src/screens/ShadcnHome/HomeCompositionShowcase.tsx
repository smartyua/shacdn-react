import { useState } from 'react';
import {
  ArrowLeftRight,
  Music2,
  Pause,
  Play,
  Repeat,
  Route,
  Shuffle,
  SkipBack,
  SkipForward,
  ShoppingCart,
  Sparkles,
  Wallet,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '../../components/Avatar/Avatar';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/Card/Card';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '../../components/Combobox/Combobox';
import { Label } from '../../components/Label/Label';
import { useLocale, type Locale } from '../../components/Locale/Locale';
import { Progress } from '../../components/Progress/Progress';
import { Slider } from '../../components/Slider/Slider';
import { Stepper } from '../../components/Stepper/Stepper';
import { Switch } from '../../components/Switch/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/Tabs/Tabs';
import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from '../../components/Timeline/Timeline';
import { ToggleGroup, ToggleGroupItem } from '../../components/ToggleGroup/ToggleGroup';

import styles from './ShadcnHome.module.scss';

const FRAMEWORKS = ['Next.js', 'Remix', 'Astro', 'Nuxt.js', 'SvelteKit', 'SolidStart', 'Gatsby', 'Vite'];

const ORDER_STEPS = [
  { status: 'complete' as const, titleKey: 'confirmed' as const, timeKey: 't1' as const },
  { status: 'complete' as const, titleKey: 'packed' as const, timeKey: 't2' as const },
  { status: 'complete' as const, titleKey: 'sorting' as const, timeKey: 't3' as const },
  { status: 'complete' as const, titleKey: 'courier' as const, timeKey: 't4' as const },
  { status: 'current' as const, titleKey: 'out' as const, timeKey: 't5' as const },
  { status: 'upcoming' as const, titleKey: 'delivered' as const, timeKey: 't6' as const },
];

type CompositionCopy = {
  order: {
    title: string;
    meta: string;
    status: string;
    courier: string;
    stops: string;
    track: string;
    steps: Record<(typeof ORDER_STEPS)[number]['titleKey'], string>;
    /** Small muted note per step — optional, only a few steps have extra context. */
    descriptions: Partial<Record<(typeof ORDER_STEPS)[number]['titleKey'], string>>;
    times: Record<(typeof ORDER_STEPS)[number]['timeKey'], string>;
  };
  combobox: {
    title: string;
    description: string;
    placeholder: string;
    empty: string;
    selected: string;
  };
  product: {
    title: string;
    category: string;
    price: string;
    was: string;
    size: string;
    qty: string;
    add: string;
  };
  transactions: {
    title: string;
    all: string;
    income: string;
    spending: string;
    items: ReadonlyArray<{ id: string; title: string; meta: string; amount: string; tone: 'in' | 'out' }>;
  };
  model: {
    title: string;
    temperature: string;
    context: string;
    stream: string;
    tools: string;
  };
  player: {
    title: string;
    artist: string;
    now: string;
  };
};

const EN_COMPOSITION: CompositionCopy = {
  order: {
    title: 'Order #10482',
    meta: '2 items · $148.00',
    status: 'In transit',
    courier: 'Marcus is on the way',
    stops: '3 stops away',
    track: 'Track on map',
    steps: {
      confirmed: 'Order confirmed',
      packed: 'Packed & shipped',
      sorting: 'Arrived at sorting hub',
      courier: 'At local courier facility',
      out: 'Out for delivery',
      delivered: 'Delivered',
    },
    descriptions: {
      packed: 'Box weighed 1.2 kg · handed to FedEx',
      courier: 'Speedy Logistics · Denver hub',
    },
    times: {
      t1: 'Jul 3, 9:41 AM',
      t2: 'Jul 4, 6:12 PM',
      t3: 'Jul 5, 7:48 AM',
      t4: 'Today, 8:30 AM',
      t5: 'Today, 11:05 AM',
      t6: 'ETA 2:15 PM',
    },
  },
  combobox: {
    title: 'Combobox',
    description: 'Searchable select with clear + chevron',
    placeholder: 'Search a framework',
    empty: 'No frameworks found.',
    selected: 'Selected',
  },
  product: {
    title: 'Nimbus Runner',
    category: "Men's running shoes",
    price: '$96',
    was: '$120',
    size: 'Size',
    qty: 'Quantity',
    add: 'Add to cart',
  },
  transactions: {
    title: 'Recent transactions',
    all: 'All',
    income: 'Income',
    spending: 'Spending',
    items: [
      { id: '1', title: 'Payroll · Appica Inc.', meta: 'Income · Jul 1', amount: '+$4,150.00', tone: 'in' },
      { id: '2', title: 'Spotify Premium', meta: 'Subscription · Jul 2', amount: '-$11.99', tone: 'out' },
      { id: '3', title: 'Stripe payout', meta: 'Income · Jul 3', amount: '+$860.40', tone: 'in' },
      { id: '4', title: 'Whole Foods', meta: 'Groceries · Jul 4', amount: '-$74.20', tone: 'out' },
    ],
  },
  model: {
    title: 'Model settings',
    temperature: 'Temperature',
    context: 'Context window',
    stream: 'Stream responses',
    tools: 'Allow tool use',
  },
  player: {
    title: 'Midnight Drive',
    artist: 'Neon Waves — Retrograde',
    now: 'Now playing',
  },
};

const RU_COMPOSITION: CompositionCopy = {
  order: {
    title: 'Заказ #10482',
    meta: '2 товара · $148.00',
    status: 'В пути',
    courier: 'Маркус уже едет',
    stops: '3 остановки',
    track: 'Отследить на карте',
    steps: {
      confirmed: 'Заказ подтверждён',
      packed: 'Упакован и отправлен',
      sorting: 'На сортировочном центре',
      courier: 'У локального курьера',
      out: 'Курьер в пути',
      delivered: 'Доставлено',
    },
    descriptions: {
      packed: 'Вес посылки 1.2 кг · передано FedEx',
      courier: 'Speedy Logistics · хаб в Денвере',
    },
    times: {
      t1: '3 июл, 9:41',
      t2: '4 июл, 18:12',
      t3: '5 июл, 7:48',
      t4: 'Сегодня, 8:30',
      t5: 'Сегодня, 11:05',
      t6: 'ожид. 14:15',
    },
  },
  combobox: {
    title: 'Combobox',
    description: 'Поиск + выбор, clear и chevron',
    placeholder: 'Найти фреймворк',
    empty: 'Ничего не найдено.',
    selected: 'Выбрано',
  },
  product: {
    title: 'Nimbus Runner',
    category: 'Мужские кроссовки',
    price: '$96',
    was: '$120',
    size: 'Размер',
    qty: 'Количество',
    add: 'В корзину',
  },
  transactions: {
    title: 'Недавние операции',
    all: 'Все',
    income: 'Доход',
    spending: 'Расход',
    items: [
      { id: '1', title: 'Payroll · Appica Inc.', meta: 'Доход · 1 июл', amount: '+$4,150.00', tone: 'in' },
      { id: '2', title: 'Spotify Premium', meta: 'Подписка · 2 июл', amount: '-$11.99', tone: 'out' },
      { id: '3', title: 'Stripe payout', meta: 'Доход · 3 июл', amount: '+$860.40', tone: 'in' },
      { id: '4', title: 'Whole Foods', meta: 'Продукты · 4 июл', amount: '-$74.20', tone: 'out' },
    ],
  },
  model: {
    title: 'Настройки модели',
    temperature: 'Temperature',
    context: 'Context window',
    stream: 'Stream responses',
    tools: 'Разрешить tool use',
  },
  player: {
    title: 'Midnight Drive',
    artist: 'Neon Waves — Retrograde',
    now: 'Сейчас играет',
  },
};

const DE_COMPOSITION: CompositionCopy = {
  ...EN_COMPOSITION,
  order: {
    ...EN_COMPOSITION.order,
    title: 'Bestellung #10482',
    meta: '2 Artikel · $148.00',
    status: 'Unterwegs',
    courier: 'Marcus ist unterwegs',
    stops: 'Noch 3 Stopps',
    track: 'Auf Karte verfolgen',
    steps: {
      confirmed: 'Bestellung bestätigt',
      packed: 'Verpackt & versendet',
      sorting: 'Im Sortierzentrum',
      courier: 'Beim lokalen Kurier',
      out: 'In Zustellung',
      delivered: 'Zugestellt',
    },
    descriptions: {
      packed: 'Paket 1,2 kg · übergeben an FedEx',
      courier: 'Speedy Logistics · Hub Denver',
    },
    times: {
      t1: '3. Jul, 9:41',
      t2: '4. Jul, 18:12',
      t3: '5. Jul, 7:48',
      t4: 'Heute, 8:30',
      t5: 'Heute, 11:05',
      t6: 'ETA 14:15',
    },
  },
  combobox: {
    title: 'Combobox',
    description: 'Durchsuchbare Auswahl mit Clear + Chevron',
    placeholder: 'Framework suchen',
    empty: 'Keine Frameworks gefunden.',
    selected: 'Ausgewählt',
  },
  product: {
    ...EN_COMPOSITION.product,
    category: 'Herren-Laufschuhe',
    size: 'Größe',
    qty: 'Menge',
    add: 'In den Warenkorb',
  },
  transactions: {
    title: 'Letzte Transaktionen',
    all: 'Alle',
    income: 'Einnahmen',
    spending: 'Ausgaben',
    items: EN_COMPOSITION.transactions.items,
  },
  model: {
    title: 'Modell-Einstellungen',
    temperature: 'Temperature',
    context: 'Context window',
    stream: 'Stream responses',
    tools: 'Tool-Nutzung erlauben',
  },
  player: {
    ...EN_COMPOSITION.player,
    now: 'Jetzt läuft',
  },
};

const UA_COMPOSITION: CompositionCopy = {
  order: {
    title: 'Замовлення #10482',
    meta: '2 товари · $148.00',
    status: 'В дорозі',
    courier: 'Маркус уже їде',
    stops: '3 зупинки',
    track: 'Відстежити на карті',
    steps: {
      confirmed: 'Замовлення підтверджено',
      packed: 'Упаковано та відправлено',
      sorting: 'На сортувальному центрі',
      courier: 'У локального кур’єра',
      out: 'Кур’єр у дорозі',
      delivered: 'Доставлено',
    },
    descriptions: {
      packed: 'Вага посилки 1.2 кг · передано FedEx',
      courier: 'Speedy Logistics · хаб у Денвері',
    },
    times: {
      t1: '3 лип, 9:41',
      t2: '4 лип, 18:12',
      t3: '5 лип, 7:48',
      t4: 'Сьогодні, 8:30',
      t5: 'Сьогодні, 11:05',
      t6: 'очікув. 14:15',
    },
  },
  combobox: {
    title: 'Combobox',
    description: 'Пошук + вибір, clear і chevron',
    placeholder: 'Знайти фреймворк',
    empty: 'Нічого не знайдено.',
    selected: 'Обрано',
  },
  product: {
    title: 'Nimbus Runner',
    category: 'Чоловічі кросівки',
    price: '$96',
    was: '$120',
    size: 'Розмір',
    qty: 'Кількість',
    add: 'До кошика',
  },
  transactions: {
    title: 'Останні операції',
    all: 'Усі',
    income: 'Дохід',
    spending: 'Витрати',
    items: [
      { id: '1', title: 'Payroll · Appica Inc.', meta: 'Дохід · 1 лип', amount: '+$4,150.00', tone: 'in' },
      { id: '2', title: 'Spotify Premium', meta: 'Підписка · 2 лип', amount: '-$11.99', tone: 'out' },
      { id: '3', title: 'Stripe payout', meta: 'Дохід · 3 лип', amount: '+$860.40', tone: 'in' },
      { id: '4', title: 'Whole Foods', meta: 'Продукти · 4 лип', amount: '-$74.20', tone: 'out' },
    ],
  },
  model: {
    title: 'Налаштування моделі',
    temperature: 'Temperature',
    context: 'Context window',
    stream: 'Stream responses',
    tools: 'Дозволити tool use',
  },
  player: {
    title: 'Midnight Drive',
    artist: 'Neon Waves — Retrograde',
    now: 'Зараз грає',
  },
};

const PL_COMPOSITION: CompositionCopy = {
  order: {
    title: 'Zamówienie #10482',
    meta: '2 produkty · $148.00',
    status: 'W drodze',
    courier: 'Marcus jest w drodze',
    stops: '3 przystanki',
    track: 'Śledź na mapie',
    steps: {
      confirmed: 'Zamówienie potwierdzone',
      packed: 'Spakowane i wysłane',
      sorting: 'W centrum sortowania',
      courier: 'U lokalnego kuriera',
      out: 'W doręczeniu',
      delivered: 'Dostarczone',
    },
    descriptions: {
      packed: 'Paczka 1,2 kg · przekazana FedEx',
      courier: 'Speedy Logistics · hub w Denver',
    },
    times: {
      t1: '3 lip, 9:41',
      t2: '4 lip, 18:12',
      t3: '5 lip, 7:48',
      t4: 'Dziś, 8:30',
      t5: 'Dziś, 11:05',
      t6: 'szac. 14:15',
    },
  },
  combobox: {
    title: 'Combobox',
    description: 'Wyszukiwany wybór z clear i chevron',
    placeholder: 'Szukaj frameworka',
    empty: 'Nie znaleziono frameworków.',
    selected: 'Wybrano',
  },
  product: {
    title: 'Nimbus Runner',
    category: 'Męskie buty do biegania',
    price: '$96',
    was: '$120',
    size: 'Rozmiar',
    qty: 'Ilość',
    add: 'Dodaj do koszyka',
  },
  transactions: {
    title: 'Ostatnie transakcje',
    all: 'Wszystkie',
    income: 'Przychód',
    spending: 'Wydatki',
    items: [
      { id: '1', title: 'Payroll · Appica Inc.', meta: 'Przychód · 1 lip', amount: '+$4,150.00', tone: 'in' },
      { id: '2', title: 'Spotify Premium', meta: 'Subskrypcja · 2 lip', amount: '-$11.99', tone: 'out' },
      { id: '3', title: 'Stripe payout', meta: 'Przychód · 3 lip', amount: '+$860.40', tone: 'in' },
      { id: '4', title: 'Whole Foods', meta: 'Zakupy · 4 lip', amount: '-$74.20', tone: 'out' },
    ],
  },
  model: {
    title: 'Ustawienia modelu',
    temperature: 'Temperature',
    context: 'Context window',
    stream: 'Stream responses',
    tools: 'Zezwól na użycie narzędzi',
  },
  player: {
    title: 'Midnight Drive',
    artist: 'Neon Waves — Retrograde',
    now: 'Teraz odtwarzane',
  },
};

const COPY: Record<Locale, CompositionCopy> = {
  en: EN_COMPOSITION,
  ru: RU_COMPOSITION,
  de: DE_COMPOSITION,
  ua: UA_COMPOSITION,
  pl: PL_COMPOSITION,
};

export const HomeCompositionShowcase = () => {
  const { locale } = useLocale();
  const c = COPY[locale];

  const [framework, setFramework] = useState<string | null>('Next.js');
  const [size, setSize] = useState<string | string[]>('42');
  const [qty, setQty] = useState(1);
  const [temperature, setTemperature] = useState(0.7);
  const [contextSize, setContextSize] = useState(128);
  const [stream, setStream] = useState(true);
  const [tools, setTools] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [txTab, setTxTab] = useState('all');

  const sizeValue = Array.isArray(size) ? size[0] ?? '42' : size;
  const filteredTx =
    txTab === 'income'
      ? c.transactions.items.filter(i => i.tone === 'in')
      : txTab === 'spending'
        ? c.transactions.items.filter(i => i.tone === 'out')
        : c.transactions.items;

  return (
    <>
      <Card className={`${styles.cell} ${styles.cellThird} ${styles.compositionCard}`}>
        <CardHeader className={styles.compositionHeader}>
          <div className={styles.orderHead}>
            <div>
              <CardTitle className={styles.compositionTitle}>{c.order.title}</CardTitle>
              <CardDescription>{c.order.meta}</CardDescription>
            </div>
            <span className={styles.statusPill}>
              <span className={styles.statusDot} aria-hidden />
              {c.order.status}
            </span>
          </div>
          <div className={styles.orderProgress}>
            <Progress value={75} aria-label={c.order.status} />
          </div>
        </CardHeader>
        <CardContent>
          <Timeline aria-label={c.order.title}>
            {ORDER_STEPS.map(step => {
              const stepDescription = c.order.descriptions[step.titleKey];
              return (
                <TimelineItem key={step.titleKey} status={step.status}>
                  <TimelineIndicator />
                  <TimelineContent>
                    <TimelineTitle>{c.order.steps[step.titleKey]}</TimelineTitle>
                    {stepDescription ? <TimelineDescription>{stepDescription}</TimelineDescription> : null}
                    <TimelineTime>{c.order.times[step.timeKey]}</TimelineTime>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
          <div className={styles.courierRow}>
            <Avatar size="default">
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
            <div className={styles.courierText}>
              <span className={styles.label}>{c.order.courier}</span>
              <span className={styles.muted}>{c.order.stops}</span>
            </div>
            <Button type="button" variant="outline" size="icon" aria-label={c.order.track}>
              <Route size={16} aria-hidden />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className={`${styles.cell} ${styles.cellThird} ${styles.compositionCard}`}>
        <CardHeader>
          <CardTitle>{c.combobox.title}</CardTitle>
          <CardDescription>{c.combobox.description}</CardDescription>
        </CardHeader>
        <CardContent className={styles.stackGap}>
          <Combobox
            items={FRAMEWORKS}
            value={framework}
            onValueChange={setFramework}
            clearable
          >
            <ComboboxInput placeholder={c.combobox.placeholder} aria-label={c.combobox.placeholder} />
            <ComboboxContent>
              <ComboboxEmpty>{c.combobox.empty}</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <p className={styles.muted}>
            {c.combobox.selected}: <strong className={styles.label}>{framework ?? '—'}</strong>
          </p>
        </CardContent>
      </Card>

      <Card className={`${styles.cell} ${styles.cellThird} ${styles.compositionCard}`}>
        <div className={styles.productMedia} aria-hidden>
          <span className={styles.productBadge}>-20%</span>
        </div>
        <CardHeader>
          <CardTitle>{c.product.title}</CardTitle>
          <CardDescription>{c.product.category}</CardDescription>
          <div className={styles.priceRow}>
            <span className={styles.priceNow}>{c.product.price}</span>
            <span className={styles.priceWas}>{c.product.was}</span>
          </div>
        </CardHeader>
        <CardContent className={styles.stackGap}>
          <div>
            <Label className={styles.label}>{c.product.size}</Label>
            <ToggleGroup
              type="single"
              value={sizeValue}
              onValueChange={v => {
                if (typeof v === 'string' && v) {
                  setSize(v);
                }
              }}
              className={styles.sizeGroup}
              aria-label={c.product.size}
            >
              {['40', '41', '42', '43'].map(s => (
                <ToggleGroupItem key={s} value={s} aria-label={s}>
                  {s}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className={styles.qtyRow}>
            <Label className={styles.label}>{c.product.qty}</Label>
            <Stepper value={qty} min={1} max={9} onValueChange={setQty} aria-label={c.product.qty} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="button" style={{ width: '100%' }}>
            <ShoppingCart size={16} aria-hidden />
            {c.product.add}
          </Button>
        </CardFooter>
      </Card>

      <Card className={`${styles.cell} ${styles.cellThird} ${styles.compositionCard}`}>
        <CardHeader>
          <CardTitle>{c.transactions.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={txTab} onValueChange={setTxTab}>
            <TabsList style={{ width: '100%', marginBottom: '0.75rem' }}>
              <TabsTrigger value="all">{c.transactions.all}</TabsTrigger>
              <TabsTrigger value="income">{c.transactions.income}</TabsTrigger>
              <TabsTrigger value="spending">{c.transactions.spending}</TabsTrigger>
            </TabsList>
            <TabsContent value={txTab}>
              <ul className={styles.txList}>
                {filteredTx.map(item => (
                  <li key={item.id} className={styles.txItem}>
                    <span className={styles.txIcon} aria-hidden>
                      {item.tone === 'in' ? <Wallet size={14} /> : <ArrowLeftRight size={14} />}
                    </span>
                    <div className={styles.txBody}>
                      <span className={styles.label}>{item.title}</span>
                      <span className={styles.muted}>{item.meta}</span>
                    </div>
                    <span className={item.tone === 'in' ? styles.txIn : styles.txOut}>{item.amount}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className={`${styles.cell} ${styles.cellThird} ${styles.compositionCard}`}>
        <CardHeader>
          <div className={styles.modelHead}>
            <Sparkles size={16} aria-hidden />
            <CardTitle>{c.model.title}</CardTitle>
          </div>
          <Badge variant="secondary">pulse-4</Badge>
        </CardHeader>
        <CardContent className={styles.stackGap}>
          <div>
            <div className={styles.sliderRow}>
              <Label className={styles.label}>{c.model.temperature}</Label>
              <span className={styles.muted}>{temperature.toFixed(1)}</span>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={temperature}
              onValueChange={setTemperature}
              aria-label={c.model.temperature}
            />
          </div>
          <div>
            <div className={styles.sliderRow}>
              <Label className={styles.label}>{c.model.context}</Label>
              <span className={styles.muted}>{contextSize}k</span>
            </div>
            <Slider
              min={32}
              max={256}
              step={32}
              value={contextSize}
              onValueChange={setContextSize}
              aria-label={c.model.context}
            />
          </div>
          <label className={styles.inlineRow}>
            <Switch checked={stream} onChange={e => setStream(e.target.checked)} aria-label={c.model.stream} />
            <span className={styles.label}>{c.model.stream}</span>
          </label>
          <label className={styles.inlineRow}>
            <Switch checked={tools} onChange={e => setTools(e.target.checked)} aria-label={c.model.tools} />
            <span className={styles.label}>{c.model.tools}</span>
          </label>
        </CardContent>
      </Card>

      <Card className={`${styles.cell} ${styles.cellThird} ${styles.compositionCard}`}>
        <CardHeader>
          <Badge variant="outline">{c.player.now}</Badge>
          <div className={styles.playerCover} aria-hidden>
            <Music2 size={28} />
          </div>
          <CardTitle>{c.player.title}</CardTitle>
          <CardDescription>{c.player.artist}</CardDescription>
        </CardHeader>
        <CardContent className={styles.stackGap}>
          <Progress value={62} aria-label="Seek" />
          <div className={styles.playerControls}>
            <Button type="button" variant="ghost" size="icon" aria-label="Shuffle">
              <Shuffle size={16} aria-hidden />
            </Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Previous">
              <SkipBack size={16} aria-hidden />
            </Button>
            <Button
              type="button"
              size="icon"
              aria-label={playing ? 'Pause' : 'Play'}
              onClick={() => setPlaying(p => !p)}
            >
              {playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
            </Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Next">
              <SkipForward size={16} aria-hidden />
            </Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Repeat">
              <Repeat size={16} aria-hidden />
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
