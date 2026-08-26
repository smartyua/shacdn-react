import { CalendarDays, Factory, Truck } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '../../components/Alert/Alert';
import { Bento, BentoItem } from '../../components/Bento/Bento';
import { Button } from '../../components/Button/Button';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  CarouselViewport,
} from '../../components/Carousel/Carousel';
import { Marquee, MarqueeContent } from '../../components/Marquee/Marquee';
import { ProgressRing } from '../../components/ProgressRing/ProgressRing';
import { TypographyMuted } from '../../components/Typography/Typography';

import { useCrm } from './crmContext';
import { formatCompactEur, SKUS, skuHealth } from './crmData';
import styles from './CrmErp.module.scss';

const TICKER = [
  'SO-2270 packed in Lyon — waiting dock slot',
  'INV-4882 60+ days · Baltic Ports still on watch',
  'HX-440 ATP 1 · Nordvik quote in review',
  'FAT week 38 held for Helvetia Labs',
  'Oslo Metro markup returned with redlines',
];

const VISITS = [
  { title: 'Nordvik shutdown walk', detail: 'Sundsvall · Fri 10:00 · Hanna + Jonas', action: 'visit' },
  { title: 'Rhine CIP P&ID', detail: 'Ludwigshafen · Tue 14:30 · Marek', action: 'visit' },
  { title: 'Gdańsk pump FAT', detail: 'Assembly hall · 8 Sep · Sofia', action: 'expedite' },
];

export const CrmOpsStrip = ({
  overdueSum,
  winRate,
}: {
  overdueSum: number;
  winRate: number;
}) => {
  const { setView, openVisit, openExpedite } = useCrm();
  const critical = SKUS.filter((sku) => skuHealth(sku) === 'critical').length;

  return (
    <div className={styles.opsStrip}>
      <Alert variant="destructive">
        <AlertTitle>Iberia Pharma is on credit hold</AlertTitle>
        <AlertDescription>
          WFI + AHU stays in proposal until INV-4874 clears. New shipments need collections sign-off.
          <Button variant="link" size="sm" onClick={() => setView('finance')}>
            Review AR
          </Button>
        </AlertDescription>
      </Alert>

      <Marquee pauseOnHover duration={32} aria-label="Live operations ticker">
        <MarqueeContent>
          {TICKER.map((item) => (
            <span key={item} className={styles.tickerItem}>
              {item}
            </span>
          ))}
        </MarqueeContent>
      </Marquee>

      <div className={styles.briefing}>
        <Bento className={styles.briefingBento} aria-label="Desk briefing">
          <BentoItem span={2}>
            <div className={styles.bentoInner}>
              <ProgressRing value={winRate} size={56} aria-label="Win rate">
                <span className={styles.ringLabel}>{winRate}%</span>
              </ProgressRing>
              <div>
                <p className={styles.sectionLabel}>Closed-won ratio</p>
                <TypographyMuted>Includes the Loire loss this quarter.</TypographyMuted>
              </div>
            </div>
          </BentoItem>
          <BentoItem>
            <div className={styles.bentoInner}>
              <Factory size={16} aria-hidden />
              <div>
                <strong>{critical} SKUs</strong>
                <TypographyMuted>blocking live quotes</TypographyMuted>
              </div>
            </div>
          </BentoItem>
          <BentoItem>
            <div className={styles.bentoInner}>
              <Truck size={16} aria-hidden />
              <div>
                <strong>{formatCompactEur(overdueSum)}</strong>
                <TypographyMuted>overdue AR</TypographyMuted>
              </div>
            </div>
          </BentoItem>
        </Bento>

        <Carousel className={styles.visitCarousel} aria-label="This week on site">
          <CarouselViewport>
            <CarouselContent>
              {VISITS.map((visit) => (
                <CarouselItem key={visit.title}>
                  <CarouselSlide className={styles.visitSlide}>
                    <CalendarDays size={14} aria-hidden />
                    <strong>{visit.title}</strong>
                    <TypographyMuted>{visit.detail}</TypographyMuted>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => (visit.action === 'visit' ? openVisit() : openExpedite())}
                    >
                      {visit.action === 'visit' ? 'Schedule' : 'Expedite'}
                    </Button>
                  </CarouselSlide>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </CarouselViewport>
          <CarouselDots />
        </Carousel>
      </div>
    </div>
  );
};
