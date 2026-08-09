import { useState } from 'react';
import { Info, Route, TriangleAlert } from 'lucide-react';
import { Avatar, AvatarFallback } from '../../components/Avatar/Avatar';
import { Banner, BannerAction, BannerTitle } from '../../components/Banner/Banner';
import { Bento, BentoItem } from '../../components/Bento/Bento';
import { Button } from '../../components/Button/Button';
import { Callout, CalloutDescription, CalloutTitle } from '../../components/Callout/Callout';
import { Card, CardContent, CardHeader } from '../../components/Card/Card';
import { Chip } from '../../components/Chip/Chip';
import { ColorPicker } from '../../components/ColorPicker/ColorPicker';
import { ComboButton, ComboButtonAction, ComboButtonMenu } from '../../components/ComboButton/ComboButton';
import { DropdownMenuItem, DropdownMenuSeparator } from '../../components/DropdownMenu/DropdownMenu';
import { Lightbox, LightboxClose, LightboxContent, LightboxTrigger } from '../../components/Lightbox/Lightbox';
import { Marquee, MarqueeContent } from '../../components/Marquee/Marquee';
import { Masonry, MasonryItem } from '../../components/Masonry/Masonry';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import { Progress } from '../../components/Progress/Progress';
import { ProgressRing } from '../../components/ProgressRing/ProgressRing';
import { Scrollspy, ScrollspyLink } from '../../components/Scrollspy/Scrollspy';
import { Stepper } from '../../components/Stepper/Stepper';
import { Steps, StepsItem } from '../../components/Steps/Steps';
import {
  Timeline,
  TimelineContent,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from '../../components/Timeline/Timeline';
import { TokenField } from '../../components/TokenField/TokenField';
import styles from './ComponentsShowcase.module.scss';

const ORDER_STEPS = [
  { status: 'complete' as const, title: 'Order confirmed', time: 'Jul 3, 9:41 AM' },
  { status: 'complete' as const, title: 'Packed & shipped', time: 'Jul 4, 6:12 PM' },
  { status: 'complete' as const, title: 'Arrived at sorting hub', time: 'Jul 5, 7:48 AM' },
  { status: 'complete' as const, title: 'At local courier facility', time: 'Today, 8:30 AM' },
  { status: 'current' as const, title: 'Out for delivery', time: 'Today, 11:05 AM' },
  { status: 'upcoming' as const, title: 'Delivered', time: 'ETA 2:15 PM' },
];

const MULTI_OPTIONS = [
  { value: 'design', label: 'Design' },
  { value: 'research', label: 'Research' },
  { value: 'ops', label: 'Ops' },
  { value: 'sales', label: 'Sales' },
];

export const NameThatUiSections = () => {
  const [step, setStep] = useState('payment');
  const [multi, setMulti] = useState<string[]>(['design', 'ops']);
  const [tokens, setTokens] = useState<string[]>(['Design', 'Q3']);
  const [copies, setCopies] = useState(2);
  const [color, setColor] = useState('#3b82f6');
  const [chipSelected, setChipSelected] = useState(true);
  const [bannerVisible, setBannerVisible] = useState(true);

  return (
    <>
      <section id="banner" className={styles.section}>
        <h2>Banner</h2>
        <div className={styles.demoStack}>
          {bannerVisible ? (
            <Banner variant="warning" dismissible onDismiss={() => setBannerVisible(false)}>
              <BannerTitle>Your card on file expires in 3 days.</BannerTitle>
              <BannerAction>
                <Button size="sm" variant="outline">
                  Update
                </Button>
              </BannerAction>
            </Banner>
          ) : (
            <Button size="sm" variant="secondary" onClick={() => setBannerVisible(true)}>
              Show banner
            </Button>
          )}
          <Banner variant="info">
            <BannerTitle>New components from NameThatUI are available in this catalog.</BannerTitle>
          </Banner>
        </div>
      </section>

      <section id="bento" className={styles.section}>
        <h2>Bento</h2>
        <Bento>
          <BentoItem span={2} rowSpan={2} style={{ padding: '1rem', background: 'hsl(var(--muted))', borderRadius: '0.5rem' }}>
            <strong>Revenue</strong>
            <div style={{ fontSize: '1.75rem', fontWeight: 600 }}>$48.2k</div>
          </BentoItem>
          <BentoItem span={2} style={{ padding: '1rem', background: 'hsl(var(--muted))', borderRadius: '0.5rem' }}>
            <strong>Users</strong>
            <div>2.4k</div>
          </BentoItem>
          <BentoItem style={{ padding: '1rem', background: 'hsl(var(--muted))', borderRadius: '0.5rem' }}>
            Growth ↑ 12%
          </BentoItem>
          <BentoItem style={{ padding: '1rem', background: 'hsl(var(--muted))', borderRadius: '0.5rem' }}>
            +9 signups today
          </BentoItem>
        </Bento>
      </section>

      <section id="callout" className={styles.section}>
        <h2>Callout</h2>
        <div className={styles.demoStack} style={{ maxWidth: 560 }}>
          <Callout variant="info">
            <Info aria-hidden size={16} />
            <div>
              <CalloutTitle>Tip</CalloutTitle>
              <CalloutDescription>
                Callouts sit in the content flow — they are not toasts or page banners.
              </CalloutDescription>
            </div>
          </Callout>
          <Callout variant="warning">
            <TriangleAlert aria-hidden size={16} />
            <div>
              <CalloutTitle>Watch this</CalloutTitle>
              <CalloutDescription>Deployments pause during the maintenance window.</CalloutDescription>
            </div>
          </Callout>
          <Callout variant="success">
            <CalloutTitle>All checks passed</CalloutTitle>
            <CalloutDescription>Lint, tests, and build are green.</CalloutDescription>
          </Callout>
        </div>
      </section>

      <section id="chip" className={styles.section}>
        <h2>Chip</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <Chip selected={chipSelected} onClick={() => setChipSelected(v => !v)}>
            Active
          </Chip>
          <Chip variant="secondary">Design</Chip>
          <Chip variant="outline" onRemove={() => undefined}>
            Removable
          </Chip>
          <Chip variant="destructive" size="sm">
            Alert
          </Chip>
        </div>
      </section>

      <section id="color-picker" className={styles.section}>
        <h2>Color Picker</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ColorPicker value={color} onValueChange={setColor} id="accent-color" />
          <code>{color}</code>
        </div>
      </section>

      <section id="combo-button" className={styles.section}>
        <h2>Combo Button</h2>
        <ComboButton>
          <ComboButtonAction onClick={() => undefined}>Save</ComboButtonAction>
          <ComboButtonMenu>
            <DropdownMenuItem>Save As…</DropdownMenuItem>
            <DropdownMenuItem>Save All</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Export…</DropdownMenuItem>
          </ComboButtonMenu>
        </ComboButton>
      </section>

      <section id="lightbox" className={styles.section}>
        <h2>Lightbox</h2>
        <Lightbox>
          <LightboxTrigger asChild>
            <Button variant="outline">Open photo</Button>
          </LightboxTrigger>
          <LightboxContent>
            <LightboxClose aria-label="Close" />
            <img
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80"
              alt="Mountain landscape"
              style={{ maxWidth: 'min(90vw, 720px)', maxHeight: '80vh', borderRadius: '0.5rem' }}
            />
          </LightboxContent>
        </Lightbox>
      </section>

      <section id="marquee" className={styles.section}>
        <h2>Marquee</h2>
        <Marquee pauseOnHover duration={28}>
          <MarqueeContent>
            <span style={{ marginRight: '2rem' }}>▲ Vertex</span>
            <span style={{ marginRight: '2rem' }}>● Orbit</span>
            <span style={{ marginRight: '2rem' }}>■ Quadra</span>
            <span style={{ marginRight: '2rem' }}>✦ Nova</span>
            <span style={{ marginRight: '2rem' }}>◆ Prism</span>
            <span style={{ marginRight: '2rem' }}>⬢ Hexal</span>
          </MarqueeContent>
        </Marquee>
      </section>

      <section id="masonry" className={styles.section}>
        <h2>Masonry</h2>
        <Masonry columns={3} gap="md">
          {[120, 180, 90, 150, 110, 200].map((height, index) => (
            <MasonryItem key={height}>
              <div
                style={{
                  height,
                  borderRadius: '0.5rem',
                  background: 'hsl(var(--muted))',
                  padding: '0.75rem',
                  border: '1px solid hsl(var(--border))',
                }}
              >
                Card {index + 1}
              </div>
            </MasonryItem>
          ))}
        </Masonry>
      </section>

      <section id="multi-select" className={styles.section}>
        <h2>Multi-select</h2>
        <div style={{ maxWidth: 360 }}>
          <MultiSelect
            options={MULTI_OPTIONS}
            value={multi}
            onValueChange={setMulti}
            placeholder="Teams"
          />
        </div>
      </section>

      <section id="progress-ring" className={styles.section}>
        <h2>Progress Ring</h2>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <ProgressRing value={65} aria-label="Upload 65 percent">
            <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>65%</span>
          </ProgressRing>
          <ProgressRing value={40} size={56} strokeWidth={5} aria-label="40 percent" />
        </div>
      </section>

      <section id="scrollspy" className={styles.section}>
        <h2>Scrollspy</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '1.5rem', maxWidth: 640 }}>
          <Scrollspy aria-label="On this page">
            <ScrollspyLink href="#scrollspy-overview">Overview</ScrollspyLink>
            <ScrollspyLink href="#scrollspy-setup">Setup</ScrollspyLink>
          </Scrollspy>
          <div style={{ maxHeight: 180, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div id="scrollspy-overview">
              <h3 style={{ margin: '0 0 0.5rem' }}>Overview</h3>
              <p style={{ margin: 0, color: 'hsl(var(--muted-foreground))' }}>
                The On this page list whose current link follows what you are reading.
              </p>
            </div>
            <div id="scrollspy-setup">
              <h3 style={{ margin: '0 0 0.5rem' }}>Setup</h3>
              <p style={{ margin: 0, color: 'hsl(var(--muted-foreground))' }}>
                Uses IntersectionObserver against section ids from each link href.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="stepper" className={styles.section}>
        <h2>Stepper</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label htmlFor="copies-stepper">Copies</label>
          <Stepper id="copies-stepper" value={copies} min={1} max={10} onValueChange={setCopies} />
        </div>
      </section>

      <section id="steps" className={styles.section}>
        <h2>Steps</h2>
        <Steps value={step} onValueChange={setStep} aria-label="Checkout">
          <StepsItem value="cart" title="Cart" />
          <StepsItem value="shipping" title="Shipping" />
          <StepsItem value="payment" title="Payment" />
          <StepsItem value="review" title="Review" />
        </Steps>
      </section>

      <section id="timeline" className={styles.section}>
        <h2>Timeline</h2>
        <p className={styles.sectionNote}>
          Vertical status history — compose with Card, Progress, and Avatar for order tracking.
        </p>
        <Card className={styles.orderTracker}>
          <CardHeader>
            <div className={styles.orderTrackerHeader}>
              <div className={styles.orderTrackerMeta}>
                <h3 className={styles.orderTrackerTitle}>Order #10482</h3>
                <p className={styles.orderTrackerDescription}>2 items · $148.00</p>
              </div>
              <span className={styles.orderStatus}>
                <span className={styles.orderStatusDot} aria-hidden />
                In transit
              </span>
            </div>
            <div className={styles.orderProgress}>
              <Progress value={75} aria-label="Delivery progress" />
            </div>
          </CardHeader>
          <CardContent>
            <Timeline aria-label="Shipment status">
              {ORDER_STEPS.map(item => (
                <TimelineItem key={item.title} status={item.status}>
                  <TimelineIndicator />
                  <TimelineContent>
                    <TimelineTitle>{item.title}</TimelineTitle>
                    <TimelineTime>{item.time}</TimelineTime>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
            <div className={styles.orderCourier}>
              <Avatar size="default">
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <div className={styles.orderCourierText}>
                <span className={styles.orderCourierName}>Marcus is on the way</span>
                <span className={styles.orderCourierDetail}>3 stops away</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className={styles.orderCourierAction}
                aria-label="Track on map"
              >
                <Route size={16} aria-hidden />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="token-field" className={styles.section}>
        <h2>Token Field</h2>
        <div style={{ maxWidth: 420 }}>
          <TokenField
            value={tokens}
            onValueChange={setTokens}
            placeholder="Add tag…"
            aria-label="Tags"
          />
        </div>
      </section>
    </>
  );
};
