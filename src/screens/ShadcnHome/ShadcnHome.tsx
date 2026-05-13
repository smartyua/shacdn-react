import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
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

import styles from './ShadcnHome.module.scss';

const SLIDER_MIN = 200;
const SLIDER_MAX = 800;

const NOTIFICATIONS = [
  { initials: 'CN', name: 'Chloe Newton', text: 'joined your workspace', time: '2m ago', variant: 'default' as const },
  { initials: 'AL', name: 'Alex Lee', text: 'commented on your design', time: '1h ago', variant: 'secondary' as const },
  { initials: 'TK', name: 'Thomas Kim', text: 'mentioned you in Dashboard', time: '3h ago', variant: 'outline' as const },
];

const SYNC_ITEMS = [
  { icon: RefreshCw, label: 'Syncing files', status: 'In Progress', spinning: true },
  { icon: Zap, label: 'Updating packages', status: 'In Progress', spinning: true },
  { icon: GitBranch, label: 'Deploying build', status: 'Queued', spinning: false },
];

const SHORTCUTS = [
  { label: 'Open command palette', keys: ['⌘', 'K'] },
  { label: 'Search files', keys: ['⌘', 'P'] },
  { label: 'Toggle sidebar', keys: ['⌘', 'B'] },
  { label: 'New file', keys: ['⌘', 'N'] },
  { label: 'Save', keys: ['⌘', 'S'] },
];

const TEAM = [
  { initials: 'CN', name: 'Chloe Newton', role: 'Owner' },
  { initials: 'AL', name: 'Alex Lee', role: 'Editor' },
  { initials: 'TK', name: 'Thomas Kim', role: 'Viewer' },
];

const FAQ = [
  { q: 'Is this compatible with shadcn/ui?', a: 'Yes — same component API and design tokens, rebuilt with SCSS modules instead of Tailwind. Drop-in replacement for most use cases.' },
  { q: 'Can I use it without Radix UI?', a: 'Absolutely. Every component is a pure React + SCSS implementation with no external UI dependencies.' },
  { q: 'How do I customise the theme?', a: 'Override CSS variables in globals.scss or set data-theme on <html>. Six colour schemes and dark mode are included out of the box.' },
];

export const ShadcnHome = () => {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(480);
  const [sameShipping, setSameShipping] = useState(true);
  const [tfa, setTfa] = useState(false);
  const [wallpaper, setWallpaper] = useState(false);
  const [terms, setTerms] = useState(false);
  const [compute, setCompute] = useState('k8s');
  const [otpValue, setOtpValue] = useState('');
  const [skeletonLoaded, setSkeletonLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  return (
    <div className={styles.page}>
      <main className={styles.main} id="shacdn-home-top">
          <section className={styles.hero} aria-labelledby="hero-title">
            <div className={styles.heroBadge}>
              <Badge variant="secondary" className={styles.badgeWithIcon}>
                <Sparkles size={12} aria-hidden />
                New
              </Badge>
            </div>
            <h1 id="hero-title" className={styles.heroTitle}>
              The Foundation for your Design System
            </h1>
            <p className={styles.heroLead}>
              A set of beautifully designed components that you can customize, extend, and build on. Start here then make
              it your own. Open Source. Open Code. This playground follows the same rhythm as{' '}
              <strong>shadcn/ui</strong>, rebuilt with SCSS modules in this repo.
            </p>
            <div className={styles.heroActions}>
              <Button type="button" size="md" onClick={() => navigate('/components')}>
                <BookOpen size={16} aria-hidden />
                View components
              </Button>
              <Button variant="outline" size="md" type="button" onClick={() => navigate('/components')}>
                Open catalog
              </Button>
            </div>
          </section>

          <div className={styles.showcase}>
            <Card className={`${styles.cell} ${styles.cellWide}`}>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>All transactions are secure and encrypted</CardDescription>
              </CardHeader>
              <CardContent className={styles.fieldGrid}>
                <div className={styles.fieldGrow}>
                  <Label htmlFor="home-card-name" className={styles.label}>
                    Name on Card
                  </Label>
                  <Input id="home-card-name" placeholder="John Doe" autoComplete="cc-name" />
                </div>
                <div className={styles.fieldGrow}>
                  <Label htmlFor="home-card-number" className={styles.label}>
                    Card Number
                  </Label>
                  <Input id="home-card-number" placeholder="Enter your 16-digit number" inputMode="numeric" autoComplete="cc-number" />
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.fieldFixedSm}>
                    <Label htmlFor="home-cvv" className={styles.label}>
                      CVV
                    </Label>
                    <Input id="home-cvv" placeholder="123" maxLength={4} inputMode="numeric" autoComplete="cc-csc" />
                  </div>
                  <div className={styles.fieldGrow}>
                    <span className={styles.label}>Month</span>
                    <Select id="home-exp-mm" aria-label="Expiry month" defaultValue="">
                      <option value="" disabled>
                        MM
                      </option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className={styles.fieldGrow}>
                    <span className={styles.label}>Year</span>
                    <Select id="home-exp-yy" aria-label="Expiry year" defaultValue="">
                      <option value="" disabled>
                        YYYY
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
                    Billing Address
                  </Label>
                  <Input id="home-billing" placeholder="123 Main St" autoComplete="street-address" />
                  <p className={styles.muted}>The billing address associated with your payment method</p>
                </div>
                <label className={styles.inlineRow}>
                  <Checkbox checked={sameShipping} onChange={e => setSameShipping(e.target.checked)} />
                  <span className={styles.label}>Same as shipping address</span>
                </label>
                <div className={styles.fieldGrow}>
                  <Label htmlFor="home-comments" className={styles.label}>
                    Comments
                  </Label>
                  <Textarea id="home-comments" placeholder="Add a note" rows={3} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="button" size="sm">
                  Submit
                </Button>
                <Button type="button" variant="outline" size="sm">
                  Cancel
                </Button>
              </CardFooter>
            </Card>

            <Card className={`${styles.cell} ${styles.cellNarrow}`}>
              <CardHeader>
                <div className={styles.sliderRow}>
                  <div>
                    <CardTitle>Team</CardTitle>
                    <CardDescription>Invite collaborators</CardDescription>
                  </div>
                  <AvatarGroup>
                    {TEAM.map(m => (
                      <Avatar key={m.initials} size="sm">
                        <AvatarFallback>{m.initials}</AvatarFallback>
                      </Avatar>
                    ))}
                    <AvatarGroupCount>+2</AvatarGroupCount>
                  </AvatarGroup>
                </div>
              </CardHeader>
              <CardContent>
                <ul className={styles.teamList}>
                  {TEAM.map(m => (
                    <li key={m.initials} className={styles.teamItem}>
                      <Avatar size="sm">
                        <AvatarFallback>{m.initials}</AvatarFallback>
                      </Avatar>
                      <span className={styles.label} style={{ flex: 1 }}>{m.name}</span>
                      <Badge
                        variant={
                          m.role === 'Owner' ? 'default'
                          : m.role === 'Editor' ? 'secondary'
                          : 'outline'
                        }
                      >
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
                    <span className={styles.muted} style={{ flex: 1 }}>2 pending invites…</span>
                    <Badge variant="outline">Pending</Badge>
                  </li>
                </ul>
              </CardContent>
              <CardFooter style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem' }}>
                <Input
                  type="email"
                  placeholder="colleague@company.com"
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
                  Send invite
                </Button>
              </CardFooter>
            </Card>

            <Card className={`${styles.cell} ${styles.cellThird}`}>
              <CardHeader>
                <div className={styles.sliderRow}>
                  <div>
                    <CardTitle>Price Range</CardTitle>
                    <CardDescription>
                      Set your budget range (${SLIDER_MIN}&nbsp;–&nbsp;{SLIDER_MAX}).
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">12 results</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Slider
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  step={10}
                  value={budget}
                  onValueChange={setBudget}
                  aria-label="Budget range"
                />
                <p className={styles.muted} style={{ marginTop: '0.5rem' }}>
                  Current: <strong>${budget}</strong>
                </p>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellThird}`}>
              <CardHeader>
                <CardTitle>Input</CardTitle>
                <CardDescription>With prefix addon</CardDescription>
              </CardHeader>
              <CardContent>
                <InputGroup className={styles.urlField}>
                  <InputGroupAddon>Web ·</InputGroupAddon>
                  <Input placeholder="example.com" type="text" inputMode="url" aria-label="Website URL" />
                </InputGroup>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellThird}`}>
              <CardHeader>
                <CardTitle>Two-factor authentication</CardTitle>
                <CardDescription>Verify via email or phone number.</CardDescription>
              </CardHeader>
              <CardContent>
                <label className={styles.inlineRow}>
                  <Switch checked={tfa} onChange={e => setTfa(e.target.checked)} aria-label="Enable two-factor authentication" />
                  <span className={styles.label}>Enable</span>
                </label>
                <Separator style={{ margin: '1rem 0' }} />
                <Alert>
                  <Shield size={18} aria-hidden />
                  <div>
                    <AlertTitle>Your profile has been verified.</AlertTitle>
                    <AlertDescription>Secure sign-in is ready for your account.</AlertDescription>
                  </div>
                </Alert>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellHalf}`}>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Settings preview</CardDescription>
              </CardHeader>
              <CardContent className={styles.tabsWrap}>
                <Tabs defaultValue="appearance">
                  <TabsList style={{ width: '100%' }}>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  </TabsList>
                  <TabsContent value="appearance">
                    <label className={styles.inlineRow} style={{ marginTop: '0.75rem' }}>
                      <Switch checked={wallpaper} onChange={e => setWallpaper(e.target.checked)} aria-label="Wallpaper tinting" />
                      <span className={styles.label}>Wallpaper Tinting</span>
                    </label>
                    <p className={styles.muted} style={{ marginTop: '0.5rem' }}>
                      Allow the wallpaper to be tinted.
                    </p>
                  </TabsContent>
                  <TabsContent value="notifications">
                    <p className={styles.muted} style={{ marginTop: '0.75rem' }}>
                      Notification preferences would live here.
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellHalf}`}>
              <CardHeader>
                <CardTitle>Compute Environment</CardTitle>
                <CardDescription>Select the compute environment for your cluster.</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={compute} onValueChange={setCompute}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <RadioGroupItem value="k8s" id="home-k8s" />
                      <div>
                        <Label htmlFor="home-k8s">Kubernetes</Label>
                        <p className={styles.muted}>Run GPU workloads on a K8s configured cluster. This is the default.</p>
                      </div>
                    </label>
                    <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <RadioGroupItem value="vm" id="home-vm" />
                      <div>
                        <Label htmlFor="home-vm">Virtual Machine</Label>
                        <p className={styles.muted}>Access a VM configured cluster to run workloads. (Coming soon)</p>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
                <Separator style={{ margin: '1rem 0' }} />
                <div className={styles.fieldGrow}>
                  <Label htmlFor="home-gpus" className={styles.label}>
                    Number of GPUs
                  </Label>
                  <Input id="home-gpus" type="number" min={0} defaultValue={1} />
                  <p className={styles.muted}>You can add more later.</p>
                </div>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellThird}`}>
              <CardHeader>
                <CardTitle>Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.sliderRow}>
                  <span className={styles.label}>Auto</span>
                  <Badge variant="outline">52% used</Badge>
                </div>
                <Progress value={52} />
                <div style={{ marginTop: '0.75rem' }}>
                  <Button size="sm" variant="secondary">
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellThird}`}>
              <CardHeader>
                <CardTitle>How did you hear about us?</CardTitle>
                <CardDescription>Select the option that best describes how you heard about us.</CardDescription>
              </CardHeader>
              <CardContent>
                <Select aria-label="Referral source" defaultValue="">
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="social">Social Media</option>
                  <option value="search">Search Engine</option>
                  <option value="referral">Referral</option>
                  <option value="other">Other</option>
                </Select>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellThird}`}>
              <CardHeader>
                <CardTitle>Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <label className={styles.inlineRow}>
                  <Checkbox checked={terms} onChange={e => setTerms(e.target.checked)} />
                  <span className={styles.label}>I agree to the terms and conditions</span>
                </label>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellHalf}`}>
              <CardContent className={styles.processingBox}>
                <Loader2 size={28} className={styles.spinIcon} aria-hidden />
                <div>
                  <p className={styles.label}>Processing your request</p>
                  <p className={styles.muted}>Please wait while we process your request. Do not refresh the page.</p>
                </div>
                <Button variant="outline" size="sm" type="button">
                  Cancel
                </Button>
              </CardContent>
            </Card>

            <Card className={`${styles.cell} ${styles.cellHalf}`}>
              <CardHeader>
                <CardTitle className={styles.inlineRow} style={{ gap: '0.5rem' }}>
                  <Check size={18} aria-hidden />
                  Copilot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.fieldGrow}>
                  <Label htmlFor="home-prompt" className={styles.label}>
                    Prompt
                  </Label>
                  <Textarea id="home-prompt" placeholder="Add context" rows={4} />
                </div>
                <div className={styles.inlineRow} style={{ marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  <Badge>Auto</Badge>
                  <Badge variant="secondary">All Sources</Badge>
                  <Badge variant="outline">Archive</Badge>
                </div>
              </CardContent>
            </Card>

            {/* ── Row 6: Notifications + Sync Status ── */}
            <Card className={`${styles.cell} ${styles.cellNarrow}`}>
              <CardHeader>
                <div className={styles.sliderRow}>
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>You have 3 unread messages</CardDescription>
                  </div>
                  <Badge variant="destructive">3</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className={styles.notificationList}>
                  {NOTIFICATIONS.map(n => (
                    <li key={n.initials} className={styles.notificationItem}>
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
                  Mark all as read
                </Button>
              </CardFooter>
            </Card>

            <Card className={`${styles.cell} ${styles.cellWide}`}>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
                <CardDescription>Live status of your deployment pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className={styles.syncList}>
                  {SYNC_ITEMS.map(item => (
                    <li key={item.label} className={styles.syncItem}>
                      <div className={styles.syncIcon}>
                        {item.spinning
                          ? <Spinner size="sm" />
                          : <item.icon size={15} aria-hidden />}
                      </div>
                      <span className={styles.label} style={{ flex: 1 }}>{item.label}</span>
                      <Badge variant={item.spinning ? 'secondary' : 'outline'}>{item.status}</Badge>
                    </li>
                  ))}
                  <li className={styles.syncItem}>
                    <div className={styles.syncIcon}>
                      <Check size={15} aria-hidden style={{ color: 'var(--color-success, hsl(142 71% 45%))' }} />
                    </div>
                    <span className={styles.label} style={{ flex: 1 }}>Tests passed</span>
                    <Badge>Complete</Badge>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Progress value={62} style={{ flex: 1 }} />
                <span className={styles.muted} style={{ flexShrink: 0, marginLeft: '0.75rem' }}>62%</span>
              </CardFooter>
            </Card>

            {/* ── Row 7: OTP + Shortcuts + Skeleton ── */}
            <Card className={`${styles.cell} ${styles.cellThird}`}>
              <CardHeader>
                <CardTitle>Verify Identity</CardTitle>
                <CardDescription>Code sent to ••• 4823</CardDescription>
              </CardHeader>
              <CardContent className={styles.otpBox}>
                <InputOTP
                  id="home-otp"
                  length={6}
                  value={otpValue}
                  onChange={setOtpValue}
                />
                <p className={styles.muted} style={{ marginTop: '0.5rem' }}>
                  Enter the 6-digit code.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" disabled={otpValue.length < 6}>Verify</Button>
                <Button size="sm" variant="ghost">Resend code</Button>
              </CardFooter>
            </Card>

            <Card className={`${styles.cell} ${styles.cellThird}`}>
              <CardHeader>
                <CardTitle className={styles.inlineRow} style={{ gap: '0.5rem' }}>
                  <Command size={16} aria-hidden />
                  Shortcuts
                </CardTitle>
                <CardDescription>Keyboard navigation</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className={styles.shortcutList}>
                  {SHORTCUTS.map(s => (
                    <li key={s.label} className={styles.shortcutItem}>
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
                    <CardTitle>Loading State</CardTitle>
                    <CardDescription>Skeleton placeholder</CardDescription>
                  </div>
                  <Switch
                    checked={skeletonLoaded}
                    onChange={e => setSkeletonLoaded(e.target.checked)}
                    aria-label="Toggle loaded state"
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
                      <p className={styles.label}>Jane Doe</p>
                      <p className={styles.muted}>Product Designer</p>
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
                      <div className={styles.inlineRow}><Badge>Design</Badge><Badge variant="secondary">UI/UX</Badge></div>
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

            {/* ── Row 8: Team Members + FAQ ── */}
            <Card className={`${styles.cell} ${styles.cellHalf}`}>
              <CardHeader>
                <div className={styles.sliderRow}>
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>3 members · 2 pending</CardDescription>
                  </div>
                  <AvatarGroup>
                    {TEAM.map(m => (
                      <Avatar key={m.initials} size="sm">
                        <AvatarFallback>{m.initials}</AvatarFallback>
                      </Avatar>
                    ))}
                    <AvatarGroupCount>+2</AvatarGroupCount>
                  </AvatarGroup>
                </div>
              </CardHeader>
              <CardContent>
                <ul className={styles.teamList}>
                  {TEAM.map(m => (
                    <li key={m.initials} className={styles.teamItem}>
                      <Avatar size="sm">
                        <AvatarFallback>{m.initials}</AvatarFallback>
                      </Avatar>
                      <span className={styles.label} style={{ flex: 1 }}>{m.name}</span>
                      <Badge variant={m.role === 'Owner' ? 'default' : m.role === 'Editor' ? 'secondary' : 'outline'}>
                        {m.role}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Input placeholder="email@company.com" style={{ flex: 1 }} type="email" />
                <Button size="sm" variant="secondary">
                  <UserPlus size={14} aria-hidden />
                  Invite
                </Button>
              </CardFooter>
            </Card>

            <Card className={`${styles.cell} ${styles.cellHalf}`}>
              <CardHeader>
                <CardTitle>Search</CardTitle>
                <CardDescription>Find components and documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <InputGroup>
                  <InputGroupAddon>
                    <Search size={14} aria-hidden />
                  </InputGroupAddon>
                  <Input
                    placeholder="Search components…"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    aria-label="Search"
                  />
                </InputGroup>
                <Separator style={{ margin: '1rem 0' }} />
                <Accordion type="single" collapsible>
                  {FAQ.map((item, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger>{item.q}</AccordionTrigger>
                      <AccordionContent>{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* ── Row 9: Wide messaging card ── */}
            <Card className={`${styles.cell} ${styles.cellFull}`}>
              <CardContent className={styles.ctaBox}>
                <div className={styles.ctaLeft}>
                  <div className={styles.ctaBadgeRow}>
                    <Badge variant="secondary" className={styles.badgeWithIcon}>
                      <MessageSquare size={11} aria-hidden />
                      Open Source
                    </Badge>
                    <Badge variant="outline" className={styles.badgeWithIcon}>
                      <Sparkles size={11} aria-hidden />
                      51 components
                    </Badge>
                  </div>
                  <p className={styles.ctaTitle}>Built with SCSS Modules.</p>
                  <p className={styles.muted}>No Tailwind. No Radix. Just React, TypeScript, and SCSS — fully yours to own and extend.</p>
                </div>
                <div className={styles.ctaActions}>
                  <Button size="md" onClick={() => navigate('/components')}>
                    <BookOpen size={15} aria-hidden />
                    Browse catalog
                  </Button>
                  <Button size="md" variant="outline" onClick={() => navigate('/components')}>
                    View source
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <footer className={styles.footerNote}>
            <p>
              Layout mirrors the public shadcn/ui marketing page; components on this site are from this repo only. Use the
              catalog to audit tokens and control sizes.
            </p>
          </footer>
        </main>
    </div>
  );
};
