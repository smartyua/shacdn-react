import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BookOpen, Check, Loader2, Shield, Sparkles, Users } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '../../components/Alert/Alert';
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
import { Label } from '../../components/Label/Label';
import { Progress } from '../../components/Progress/Progress';
import { RadioGroup, RadioGroupItem } from '../../components/RadioGroup/RadioGroup';
import { Select } from '../../components/Select/Select';
import { Separator } from '../../components/Separator/Separator';
import { Slider } from '../../components/Slider/Slider';
import { Switch } from '../../components/Switch/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/Tabs/Tabs';
import { Textarea } from '../../components/Textarea/Textarea';

import styles from './ShadcnHome.module.scss';

const SLIDER_MIN = 200;
const SLIDER_MAX = 800;

export const ShadcnHome = () => {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(480);
  const [sameShipping, setSameShipping] = useState(true);
  const [tfa, setTfa] = useState(false);
  const [wallpaper, setWallpaper] = useState(false);
  const [terms, setTerms] = useState(false);
  const [compute, setCompute] = useState('k8s');

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
                <CardTitle>Team</CardTitle>
                <CardDescription>Invite collaborators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={styles.emptyTeam}>
                  <div className={styles.emptyIcon}>
                    <Users size={20} aria-hidden />
                  </div>
                  <div>
                    <p className={styles.label}>No Team Members</p>
                    <p className={styles.muted}>Invite your team to collaborate on this project.</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Invite Members
                  </Button>
                </div>
              </CardContent>
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
