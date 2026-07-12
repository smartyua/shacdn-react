import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Bell,
  BookOpen,
  Check,
  Command,
  GitBranch,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  UserPlus,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/Accordion/Accordion';
import { Alert, AlertDescription, AlertTitle } from '../../components/Alert/Alert';
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from '../../components/Avatar/Avatar';
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
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { Input } from '../../components/Input/Input';
import { InputGroup, InputGroupAddon } from '../../components/InputGroup/InputGroup';
import { InputOTP } from '../../components/InputOTP/InputOTP';
import { Kbd, KbdGroup } from '../../components/Kbd/Kbd';
import { Label } from '../../components/Label/Label';
import { useLocale } from '../../components/Locale/Locale';
import { Progress } from '../../components/Progress/Progress';
import { RadioGroup, RadioGroupItem } from '../../components/RadioGroup/RadioGroup';
import { Select } from '../../components/Select/Select';
import { Separator } from '../../components/Separator/Separator';
import { Skeleton } from '../../components/Skeleton/Skeleton';
import { Slider } from '../../components/Slider/Slider';
import { Spinner } from '../../components/Spinner/Spinner';
import { Switch } from '../../components/Switch/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/Tabs/Tabs';
import { Textarea } from '../../components/Textarea/Textarea';

import { BASE_DOCUMENT_TITLE, formatUsdAmount, getRoleVariant, getShadcnHomeCopy } from './ShadcnHome.copy';
import styles from './ShadcnHome.module.scss';

const SLIDER_MIN = 200;
const SLIDER_MAX = 800;

const SYNC_ICONS: Record<'sync-files' | 'update-packages' | 'deploy-build', LucideIcon> = {
  'sync-files': RefreshCw,
  'update-packages': Zap,
  'deploy-build': GitBranch,
};

export const ShadcnHome = () => {
  const navigate = useNavigate();
  const { locale } = useLocale();
  const copy = getShadcnHomeCopy(locale);

  const [budget, setBudget] = useState(480);
  const budgetMinLabel = formatUsdAmount(SLIDER_MIN, locale);
  const budgetMaxLabel = formatUsdAmount(SLIDER_MAX, locale);
  const [sameShipping, setSameShipping] = useState(true);
  const [tfa, setTfa] = useState(false);
  const [wallpaper, setWallpaper] = useState(false);
  const [terms, setTerms] = useState(false);
  const [compute, setCompute] = useState('k8s');
  const [otpValue, setOtpValue] = useState('');
  const [skeletonLoaded, setSkeletonLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    document.title = copy.documentTitle;
    return () => {
      document.title = BASE_DOCUMENT_TITLE;
    };
  }, [copy.documentTitle]);

  return (
    <div className={styles.page}>
      <main className={styles.main} id="shacdn-home-top">
          <section className={styles.hero} aria-labelledby="hero-title">
            <div className={styles.heroBadge}>
              <Badge variant="secondary" className={styles.badgeWithIcon}>
                <Sparkles size={12} aria-hidden />
                {copy.hero.badge}
              </Badge>
            </div>
            <h1 id="hero-title" className={styles.heroTitle}>
              {copy.hero.title}
            </h1>
            <p className={styles.heroLead}>
              {copy.hero.leadBeforeRhythm}
              <strong>shadcn/ui</strong>
              {copy.hero.leadAfterRhythm}
            </p>
            <div className={styles.heroActions}>
              <Button type="button" size="md" onClick={() => navigate('/components')}>
                <BookOpen size={16} aria-hidden />
                {copy.hero.viewComponents}
              </Button>
              <Button variant="outline" size="md" type="button" onClick={() => navigate('/components')}>
                {copy.hero.openCatalog}
              </Button>
            </div>
          </section>

          <div className={styles.showcase}>
            <Card className={`${styles.cell} ${styles.cellWide}`}>
              <CardHeader>
                <CardTitle>{copy.payment.title}</CardTitle>
                <CardDescription>{copy.payment.description}</CardDescription>
              </CardHeader>
              <CardContent className={styles.fieldGrid}>
                <div className={styles.fieldGrow}>
                  <Label htmlFor="home-card-name" className={styles.label}>
                    {copy.payment.nameOnCard}
                  </Label>
                  <Input id="home-card-name" placeholder={copy.payment.namePlaceholder} autoComplete="cc-name" />
                </div>
                <div className={styles.fieldGrow}>
                  <Label htmlFor="home-card-number" className={styles.label}>
                    {copy.payment.cardNumber}
                  </Label>
                  <Input id="home-card-number" placeholder={copy.payment.cardNumberPlaceholder} inputMode="numeric" autoComplete="cc-number" />
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.fieldFixedSm}>
                    <Label htmlFor="home-cvv" className={styles.label}>
                      {copy.payment.cvv}
                    </Label>
                    <Input id="home-cvv" placeholder={copy.payment.cvvPlaceholder} maxLength={4} inputMode="numeric" autoComplete="cc-csc" />
                  </div>
                  <div className={styles.fieldGrow}>
                    <span className={styles.label}>{copy.payment.month}</span>
                    <Select id="home-exp-mm" aria-label={copy.payment.monthAriaLabel} defaultValue="">
                      <option value="" disabled>
                        {copy.payment.monthPlaceholder}
                      </option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className={styles.fieldGrow}>
                    <span className={styles.label}>{copy.payment.year}</span>
                    <Select id="home-exp-yy" aria-label={copy.payment.yearAriaLabel} defaultValue="">
                      <option value="" disabled>
                        {copy.payment.yearPlaceholder}
                      </option>
                      {Array.from({ length: 8 }, (_, i) => {
                        const y = 2025 + i;
                        return (
                          <option key={y} value={String(y)}>
                            {y}
                          </option>
                        );
                      })}
                    </Select>
                  </div>
                </div>
                <div className={styles.fieldGrow}>
                  <Label htmlFor="home-billing" className={styles.label}>
                    {copy.payment.billingAddress}
                  </Label>
                  <Input id="home-billing" placeholder={copy.payment.billingPlaceholder} autoComplete="street-address" />
                  <p className={styles.muted}>{copy.payment.billingHelper}</p>
                </div>
                <label className={styles.inlineRow}>
                  <Checkbox checked={sameShipping} onChange={e => setSameShipping(e.target.checked)} />
                  <span className={styles.label}>{copy.payment.sameAsShipping}</span>
                </label>
                <div className={styles.fieldGrow}>
                  <Label htmlFor="home-comments" className={styles.label}>
                    {copy.payment.comments}
                  </Label>
                  <Textarea id="home-comments" placeholder={copy.payment.commentsPlaceholder} rows={3} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="button" size="sm">
                  {copy.payment.submit}
                </Button>
                <Button type="button" variant="outline" size="sm">
                  {copy.payment.cancel}
                </Button>
              </CardFooter>
            </Card>

            <Card className={`${styles.cell} ${styles.cellNarrow}`}>
              <CardHeader>
                <div className={styles.sliderRow}>
                  <div>
                    <CardTitle>{copy.team.title}</CardTitle>
                    <CardDescription>{copy.team.description}</CardDescription>
                  </div>
                  <AvatarGroup>
                    {copy.team.members.map(m => (
                      <Avatar key={m.id} size="sm">
                        <AvatarFallback>{m.initials}</AvatarFallback>
                      </Avatar>
                    ))}
                    <AvatarGroupCount>+2</AvatarGroupCount>
                  </AvatarGroup>
                </div>
              </CardHeader>
              <CardContent>
                <ul className={styles.teamList}>
                  {copy.team.members.map(m => (
                    <li key={m.id} className={styles.teamItem}>
                      <Avatar size="sm">
                        <AvatarFallback>{m.initials}</AvatarFallback>
                      </Avatar>
                      <span className={styles.label} style={{ flex: 1 }}>{m.name}</span>
                      <Badge variant={getRoleVariant(m.roleKey)}>
                        {m.role}
                      </Badge>
                    </li>
                  ))}
                  <li className={styles.teamItem}>
                    <Avatar size="sm">
                      <AvatarFallback style={{ background: 'var(--muted)' }}>
                        <Users size={12} aria-hidden />
                      </AvatarFallback>
                    </Avatar>
                    <span className={styles.muted} style={{ flex: 1 }}>{copy.team.pendingInvites}</span>
                    <Badge variant="outline">{copy.team.pending}</Badge>
                  </li>
                </ul>
              </CardContent>
              <CardFooter style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem' }}>
                <Input
                  type="email"
                  placeholder={copy.team.invitePlaceholder}
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  style={{ width: '100%' }}
                  disabled={!inviteEmail.includes('@')}
                >
                  <UserPlus size={14} aria-hidden />
                  {copy.team.sendInvite}
                </Button>
              </CardFooter>
            </Card>

            <Card className={`${styles.cell} ${styles.cellThird}`}>
              <CardHeader>
                <div className={styles.sliderRow}>
                  <div>
                    <CardTitle>{copy.priceRange.title}</CardTitle>
                    <CardDescription>
                      {copy.priceRange.description(budgetMinLabel, budgetMaxLabel)}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{copy.priceRange.results}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Slider
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  step={10}
                  value={budget}
                  onValueChange={setBudget}
                  aria-label={copy.priceRange.ariaLabel}
                />
                <p className={styles.muted} style={{ marginTop: '0.5rem' }}>
                  {copy.priceRange.current(formatUsdAmount(budget, locale))}
                </p>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellThird}`}>
              <CardHeader>
                <CardTitle>{copy.urlInput.title}</CardTitle>
                <CardDescription>{copy.urlInput.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <InputGroup className={styles.urlField}>
                  <InputGroupAddon>{copy.urlInput.prefix}</InputGroupAddon>
                  <Input placeholder={copy.urlInput.placeholder} type="text" inputMode="url" aria-label={copy.urlInput.ariaLabel} />
                </InputGroup>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellThird}`}>
              <CardHeader>
                <CardTitle>{copy.twoFactor.title}</CardTitle>
                <CardDescription>{copy.twoFactor.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <label className={styles.inlineRow}>
                  <Switch checked={tfa} onChange={e => setTfa(e.target.checked)} aria-label={copy.twoFactor.enableAriaLabel} />
                  <span className={styles.label}>{copy.twoFactor.enable}</span>
                </label>
                <Separator style={{ margin: '1rem 0' }} />
                <Alert>
                  <Shield size={18} aria-hidden />
                  <div>
                    <AlertTitle>{copy.twoFactor.alertTitle}</AlertTitle>
                    <AlertDescription>{copy.twoFactor.alertDescription}</AlertDescription>
                  </div>
                </Alert>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellHalf}`}>
              <CardHeader>
                <CardTitle>{copy.appearance.title}</CardTitle>
                <CardDescription>{copy.appearance.description}</CardDescription>
              </CardHeader>
              <CardContent className={styles.tabsWrap}>
                <Tabs defaultValue="appearance">
                  <TabsList style={{ width: '100%' }}>
                    <TabsTrigger value="appearance">{copy.appearance.tabAppearance}</TabsTrigger>
                    <TabsTrigger value="notifications">{copy.appearance.tabNotifications}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="appearance">
                    <label className={styles.inlineRow} style={{ marginTop: '0.75rem' }}>
                      <Switch checked={wallpaper} onChange={e => setWallpaper(e.target.checked)} aria-label={copy.appearance.wallpaperAriaLabel} />
                      <span className={styles.label}>{copy.appearance.wallpaperTinting}</span>
                    </label>
                    <p className={styles.muted} style={{ marginTop: '0.5rem' }}>
                      {copy.appearance.wallpaperHelper}
                    </p>
                  </TabsContent>
                  <TabsContent value="notifications">
                    <p className={styles.muted} style={{ marginTop: '0.75rem' }}>
                      {copy.appearance.notificationsPlaceholder}
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellHalf}`}>
              <CardHeader>
                <CardTitle>{copy.compute.title}</CardTitle>
                <CardDescription>{copy.compute.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={compute} onValueChange={setCompute}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <RadioGroupItem value="k8s" id="home-k8s" />
                      <div>
                        <Label htmlFor="home-k8s">{copy.compute.kubernetes}</Label>
                        <p className={styles.muted}>{copy.compute.kubernetesHelper}</p>
                      </div>
                    </label>
                    <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <RadioGroupItem value="vm" id="home-vm" />
                      <div>
                        <Label htmlFor="home-vm">{copy.compute.virtualMachine}</Label>
                        <p className={styles.muted}>{copy.compute.virtualMachineHelper}</p>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
                <Separator style={{ margin: '1rem 0' }} />
                <div className={styles.fieldGrow}>
                  <Label htmlFor="home-gpus" className={styles.label}>
                    {copy.compute.gpuCount}
                  </Label>
                  <Input id="home-gpus" type="number" min={0} defaultValue={1} />
                  <p className={styles.muted}>{copy.compute.gpuHelper}</p>
                </div>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellThird}`}>
              <CardHeader>
                <CardTitle>{copy.storage.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.sliderRow}>
                  <span className={styles.label}>{copy.storage.auto}</span>
                  <Badge variant="outline">{copy.storage.used(52)}</Badge>
                </div>
                <Progress value={52} />
                <div style={{ marginTop: '0.75rem' }}>
                  <Button size="sm" variant="secondary">
                    {copy.storage.send}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellThird}`}>
              <CardHeader>
                <CardTitle>{copy.referral.title}</CardTitle>
                <CardDescription>{copy.referral.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Select aria-label={copy.referral.ariaLabel} defaultValue="">
                  <option value="" disabled>
                    {copy.referral.placeholder}
                  </option>
                  <option value="social">{copy.referral.options.social}</option>
                  <option value="search">{copy.referral.options.search}</option>
                  <option value="referral">{copy.referral.options.referral}</option>
                  <option value="other">{copy.referral.options.other}</option>
                </Select>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellThird}`}>
              <CardHeader>
                <CardTitle>{copy.terms.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <label className={styles.inlineRow}>
                  <Checkbox checked={terms} onChange={e => setTerms(e.target.checked)} />
                  <span className={styles.label}>{copy.terms.agree}</span>
                </label>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellHalf}`}>
              <CardContent className={styles.processingBox}>
                <Loader2 size={28} className={styles.spinIcon} aria-hidden />
                <div>
                  <p className={styles.label}>{copy.processing.title}</p>
                  <p className={styles.muted}>{copy.processing.description}</p>
                </div>
                <Button variant="outline" size="sm" type="button">
                  {copy.processing.cancel}
                </Button>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellHalf}`}>
              <CardHeader>
                <CardTitle className={styles.inlineRow} style={{ gap: '0.5rem' }}>
                  <Check size={18} aria-hidden />
                  {copy.copilot.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.fieldGrow}>
                  <Label htmlFor="home-prompt" className={styles.label}>
                    {copy.copilot.prompt}
                  </Label>
                  <Textarea id="home-prompt" placeholder={copy.copilot.promptPlaceholder} rows={4} />
                </div>
                <div className={styles.inlineRow} style={{ marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  <Badge>{copy.copilot.badgeAuto}</Badge>
                  <Badge variant="secondary">{copy.copilot.badgeAllSources}</Badge>
                  <Badge variant="outline">{copy.copilot.badgeArchive}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellNarrow}`}>
              <CardHeader>
                <div className={styles.sliderRow}>
                  <div>
                    <CardTitle>{copy.notifications.title}</CardTitle>
                    <CardDescription>{copy.notifications.description}</CardDescription>
                  </div>
                  <Badge variant="destructive">3</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className={styles.notificationList}>
                  {copy.notifications.items.map(n => (
                    <li key={n.id} className={styles.notificationItem}>
                      <Avatar size="sm">
                        <AvatarFallback>{n.initials}</AvatarFallback>
                      </Avatar>
                      <div className={styles.notificationBody}>
                        <p className={styles.label}>{n.name}</p>
                        <p className={styles.muted}>{n.text}</p>
                      </div>
                      <span className={styles.muted} style={{ flexShrink: 0 }}>{n.time}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm">
                  <Bell size={14} aria-hidden />
                  {copy.notifications.markAllAsRead}
                </Button>
              </CardFooter>
            </Card>

            <Card className={`${styles.cell} ${styles.cellWide}`}>
              <CardHeader>
                <CardTitle>{copy.activity.title}</CardTitle>
                <CardDescription>{copy.activity.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className={styles.syncList}>
                  {copy.activity.items.map(item => {
                    const Icon = SYNC_ICONS[item.id];
                    return (
                      <li key={item.id} className={styles.syncItem}>
                        <div className={styles.syncIcon}>
                          {item.spinning
                            ? <Spinner size="sm" aria-label={copy.activity.spinnerAriaLabel} />
                            : <Icon size={15} aria-hidden />}
                        </div>
                        <span className={styles.label} style={{ flex: 1 }}>{item.label}</span>
                        <Badge variant={item.spinning ? 'secondary' : 'outline'}>{item.status}</Badge>
                      </li>
                    );
                  })}
                  <li className={styles.syncItem}>
                    <div className={styles.syncIcon}>
                      <Check size={15} aria-hidden style={{ color: 'var(--color-success, hsl(142 71% 45%))' }} />
                    </div>
                    <span className={styles.label} style={{ flex: 1 }}>{copy.activity.testsPassed}</span>
                    <Badge>{copy.activity.complete}</Badge>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Progress value={62} style={{ flex: 1 }} />
                <span className={styles.muted} style={{ flexShrink: 0, marginLeft: '0.75rem' }}>62%</span>
              </CardFooter>
            </Card>

            <Card className={`${styles.cell} ${styles.cellThird}`}>
              <CardHeader>
                <CardTitle>{copy.otp.title}</CardTitle>
                <CardDescription>{copy.otp.description}</CardDescription>
              </CardHeader>
              <CardContent className={styles.otpBox}>
                <InputOTP
                  id="home-otp"
                  length={6}
                  value={otpValue}
                  onChange={setOtpValue}
                />
                <p className={styles.muted} style={{ marginTop: '0.5rem' }}>
                  {copy.otp.helper}
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" disabled={otpValue.length < 6}>{copy.otp.verify}</Button>
                <Button size="sm" variant="ghost">{copy.otp.resend}</Button>
              </CardFooter>
            </Card>

            <Card className={`${styles.cell} ${styles.cellThird}`}>
              <CardHeader>
                <CardTitle className={styles.inlineRow} style={{ gap: '0.5rem' }}>
                  <Command size={16} aria-hidden />
                  {copy.shortcuts.title}
                </CardTitle>
                <CardDescription>{copy.shortcuts.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className={styles.shortcutList}>
                  {copy.shortcuts.items.map(s => (
                    <li key={s.id} className={styles.shortcutItem}>
                      <span className={styles.muted}>{s.label}</span>
                      <KbdGroup>
                        {s.keys.map(k => <Kbd key={k}>{k}</Kbd>)}
                      </KbdGroup>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellThird}`}>
              <CardHeader>
                <div className={styles.sliderRow}>
                  <div>
                    <CardTitle>{copy.loadingState.title}</CardTitle>
                    <CardDescription>{copy.loadingState.description}</CardDescription>
                  </div>
                  <Switch
                    checked={skeletonLoaded}
                    onChange={e => setSkeletonLoaded(e.target.checked)}
                    aria-label={copy.loadingState.toggleAriaLabel}
                    size="sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {skeletonLoaded ? (
                  <div className={styles.skeletonReveal}>
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className={styles.label}>{copy.loadingState.personName}</p>
                      <p className={styles.muted}>{copy.loadingState.personRole}</p>
                    </div>
                  </div>
                ) : (
                  <div className={styles.skeletonReveal}>
                    <Skeleton className={styles.skeletonAvatar} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <Skeleton style={{ height: '0.875rem', width: '60%' }} />
                      <Skeleton style={{ height: '0.75rem', width: '40%' }} />
                    </div>
                  </div>
                )}
                <Separator style={{ margin: '1rem 0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {skeletonLoaded ? (
                    <>
                      <div className={styles.inlineRow}><Badge>{copy.loadingState.badgeDesign}</Badge><Badge variant="secondary">{copy.loadingState.badgeUiUx}</Badge></div>
                    </>
                  ) : (
                    <>
                      <Skeleton style={{ height: '0.75rem', width: '80%' }} />
                      <Skeleton style={{ height: '0.75rem', width: '60%' }} />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellHalf}`}>
              <CardHeader>
                <div className={styles.sliderRow}>
                  <div>
                    <CardTitle>{copy.teamMembers.title}</CardTitle>
                    <CardDescription>{copy.teamMembers.description}</CardDescription>
                  </div>
                  <AvatarGroup>
                    {copy.team.members.map(m => (
                      <Avatar key={m.id} size="sm">
                        <AvatarFallback>{m.initials}</AvatarFallback>
                      </Avatar>
                    ))}
                    <AvatarGroupCount>+2</AvatarGroupCount>
                  </AvatarGroup>
                </div>
              </CardHeader>
              <CardContent>
                <ul className={styles.teamList}>
                  {copy.team.members.map(m => (
                    <li key={m.id} className={styles.teamItem}>
                      <Avatar size="sm">
                        <AvatarFallback>{m.initials}</AvatarFallback>
                      </Avatar>
                      <span className={styles.label} style={{ flex: 1 }}>{m.name}</span>
                      <Badge variant={getRoleVariant(m.roleKey)}>
                        {m.role}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Input placeholder={copy.teamMembers.invitePlaceholder} style={{ flex: 1 }} type="email" />
                <Button size="sm" variant="secondary">
                  <UserPlus size={14} aria-hidden />
                  {copy.teamMembers.invite}
                </Button>
              </CardFooter>
            </Card>

            <Card className={`${styles.cell} ${styles.cellHalf}`}>
              <CardHeader>
                <CardTitle>{copy.search.title}</CardTitle>
                <CardDescription>{copy.search.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <InputGroup>
                  <InputGroupAddon>
                    <Search size={14} aria-hidden />
                  </InputGroupAddon>
                  <Input
                    placeholder={copy.search.placeholder}
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    aria-label={copy.search.ariaLabel}
                  />
                </InputGroup>
                <Separator style={{ margin: '1rem 0' }} />
                <Accordion type="single" collapsible>
                  {copy.search.faq.map((item, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger>{item.q}</AccordionTrigger>
                      <AccordionContent>{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellFull}`}>
              <CardContent className={styles.ctaBox}>
                <div className={styles.ctaLeft}>
                  <div className={styles.ctaBadgeRow}>
                    <Badge variant="secondary" className={styles.badgeWithIcon}>
                      <MessageSquare size={11} aria-hidden />
                      {copy.cta.openSource}
                    </Badge>
                    <Badge variant="outline" className={styles.badgeWithIcon}>
                      <Sparkles size={11} aria-hidden />
                      {copy.cta.componentCount}
                    </Badge>
                  </div>
                  <p className={styles.ctaTitle}>{copy.cta.title}</p>
                  <p className={styles.muted}>{copy.cta.description}</p>
                </div>
                <div className={styles.ctaActions}>
                  <Button size="md" onClick={() => navigate('/components')}>
                    <BookOpen size={15} aria-hidden />
                    {copy.cta.browseCatalog}
                  </Button>
                  <Button size="md" variant="outline" onClick={() => navigate('/components')}>
                    {copy.cta.viewSource}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <footer className={styles.footerNote}>
            <p>{copy.footer}</p>
          </footer>
        </main>
    </div>
  );
};
