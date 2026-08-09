import {
  Activity,
  BarChart3,
  Check,
  Layers,
  Mail,
  Minus,
  Radar,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/Card/Card';
import { Separator } from '../../components/Separator/Separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/Table/Table';
import styles from './SessyLanding.module.scss';

export const SessyLanding = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <div className={styles.pageIntro}>
        <span className={styles.introBrand}>Sessy</span>
        <nav className={styles.introNav} aria-label="Раздел страницы в стиле Sessy">
          <ul className={styles.navLinks}>
            <li>
              <a href="#features">Возможности</a>
            </li>
            <li>
              <a href="#pricing-table">Тарифы</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ul>
          <Button type="button" variant="ghost" size="sm" onClick={() => navigate('/components')}>
            Компоненты
          </Button>
        </nav>
      </div>

      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="sessy-hero-heading">
          <p className={styles.eyebrow}>Открытый инструмент для AWS SES · демо-экран</p>
          <h1 id="sessy-hero-heading" className={styles.title}>
            Know what happens after you hit send.
          </h1>
          <p className={styles.subtitle}>
            Open-source email observability для Amazon SES — доставки, отказы, открытия и жалобы на единой панели, которую
            вы хостите сами (вдохновлено оригинальным проектом <strong>sessy.do</strong>).
          </p>
          <div className={styles.heroActions}>
            <Button
              type="button"
              size="lg"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Смотреть возможности
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => navigate('/components')}>
              Каталог UI
            </Button>
          </div>
          <div className={styles.starsBadge} role="status">
            <Badge variant="secondary">★ Starred на GitHub</Badge>
          </div>
        </section>

        <figure className={styles.browserFrame} aria-label="Схема дашборда">
          <div className={styles.browserChrome}>
            <span className={styles.trafficLights} aria-hidden>
              <span className={styles.dot} data-tone="danger" />
              <span className={styles.dot} data-tone="warn" />
              <span className={styles.dot} data-tone="ok" />
            </span>
            <div className={styles.urlField}>sessy.example.com/dashboard</div>
          </div>
          <figcaption className="visuallyHidden">
            Превью панели: статистики и активность отправок из демонстрационного набора блоков (не живые
            данные).
          </figcaption>
          <div className={styles.previewBody}>
            <div className={styles.previewToolbar}>
              <Mail size={20} aria-hidden />
              <span className={styles.previewLabel}>Outbound activity</span>
              <Badge variant="outline">Live</Badge>
            </div>
            <Separator />
            <div className={styles.previewGrid} aria-hidden>
              <div className={styles.previewStat} />
              <div className={styles.previewStat} />
              <div className={styles.previewStat} />
              <div className={styles.previewStat} />
            </div>
            <div className={styles.previewChart} />
          </div>
        </figure>

        <div className={styles.productionStrip}>
          Running in production at
          <Badge variant="outline">BetaList</Badge>
          <Badge variant="outline">Startup Jobs</Badge>
          <Badge variant="outline">WIP Room</Badge>
          <Badge variant="outline">Room AI</Badge>
        </div>

        <section className={styles.stepsSection} aria-labelledby="steps-heading">
          <h2 id="steps-heading">Up and running in 1, 2, 3…</h2>
          <p className={styles.stepsIntro}>
            No AWS credentials. No complex integrations. Just a webhook URL.
          </p>
          <div className={styles.stepGrid}>
            <Card>
              <CardHeader>
                <Badge variant="secondary" style={{ alignSelf: 'flex-start', marginBottom: '0.5rem' }}>
                  # 1
                </Badge>
                <CardTitle>Deploy</CardTitle>
                <CardDescription>
                  Одна Docker-команда, SQLite или PostgreSQL, без дополнительных сервисов.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className={styles.note}>
                  См. раздел деплоя на сайте проекта <strong>sessy.do</strong> (вне этой демо-страницы).
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Badge variant="secondary" style={{ alignSelf: 'flex-start', marginBottom: '0.5rem' }}>
                  # 2
                </Badge>
                <CardTitle>Webhook в SES</CardTitle>
                <CardDescription>
                  Configuration set → SNS endpoint на URL Sessy, события идут в ваш инстанс.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className={styles.note}>
                  В консоли AWS: Configuration set → SNS → endpoint вашего инстанса; типы событий SES описаны в документации
                  Amazon SES.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Badge variant="secondary" style={{ alignSelf: 'flex-start', marginBottom: '0.5rem' }}>
                  # 3
                </Badge>
                <CardTitle>События в реальном времени</CardTitle>
                <CardDescription>
                  Поиск, фильтры, экспорт событий (delivered, bounced, complained, clicked…).
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section
          id="features"
          className={styles.featuresSection}
          aria-labelledby="features-heading"
        >
          <h2 id="features-heading">Everything you need to monitor SES</h2>
          <div className={styles.featureGrid}>
            <Card>
              <CardHeader>
                <div className={styles.featureIconWrap}>
                  <Activity size={22} aria-hidden />
                </div>
                <CardTitle>Real-time tracking</CardTitle>
                <CardDescription>
                  Все типы SES-событий: send, delivery, bounce, complaint, open, reject, delayed и др.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className={styles.featureIconWrap}>
                  <ShieldCheck size={22} aria-hidden />
                </div>
                <CardTitle>Reputation signals</CardTitle>
                <CardDescription>
                  Типизированные bounces и жалобы, чтобы ловить всплески до санкций AWS.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className={styles.featureIconWrap}>
                  <BarChart3 size={22} aria-hidden />
                </div>
                <CardTitle>Engagement</CardTitle>
                <CardDescription>
                  Opens / clicks и краткие тренды отправок без лишней аналитики «надстройкой» над SES.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className={styles.featureIconWrap}>
                  <Layers size={22} aria-hidden />
                </div>
                <CardTitle>Multi-source</CardTitle>
                <CardDescription>
                  Отдельные webhook и политики удержания на среду или продукт.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section
          id="pricing-table"
          aria-labelledby="compare-heading"
        >
          <h2 id="compare-heading" className={styles.compareTitle}>
            You shouldn&apos;t pay more per email just to see if they landed
          </h2>
          <p className={styles.sectionHeadingLead}>
            Пример маркетингового сравнения с сервисами с «надстройкой» над отправкой почты —
            сохранился смысл исходного лэндинга.
          </p>
          <div className={styles.comparisonWrap}>
            <Table>
              <caption className="visuallyHidden">Сводная таблица стоимости и возможностей</caption>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col" />
                  <TableHead scope="col">SES + Sessy</TableHead>
                  <TableHead scope="col">Postmark*</TableHead>
                  <TableHead scope="col">Resend*</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>10k писем / мес</TableCell>
                  <TableCell>~$1</TableCell>
                  <TableCell>$15</TableCell>
                  <TableCell>$20</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>100k писем / мес</TableCell>
                  <TableCell>~$10</TableCell>
                  <TableCell>~$177</TableCell>
                  <TableCell>$35</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>500k писем / мес</TableCell>
                  <TableCell>~$50</TableCell>
                  <TableCell>~$897</TableCell>
                  <TableCell>$350</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead scope="row">Поиск по письму</TableHead>
                  <TableCell>
                    <Check size={18} aria-label="Есть" />
                  </TableCell>
                  <TableCell>
                    <Minus size={18} aria-hidden />
                  </TableCell>
                  <TableCell>
                    <Minus size={18} aria-hidden />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead scope="row">Bounces & complaints</TableHead>
                  <TableCell>
                    <Check size={18} aria-label="Есть" />
                  </TableCell>
                  <TableCell>
                    <Minus size={18} aria-hidden />
                  </TableCell>
                  <TableCell>
                    <Minus size={18} aria-hidden />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead scope="row">Свои данные / свой сервер</TableHead>
                  <TableCell>
                    <Check size={18} aria-label="Есть" />
                  </TableCell>
                  <TableCell>
                    <Minus size={18} aria-hidden />
                  </TableCell>
                  <TableCell>
                    <Minus size={18} aria-hidden />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead scope="row">Email templates</TableHead>
                  <TableCell>
                    <Minus size={18} aria-hidden />
                  </TableCell>
                  <TableCell>
                    <Check size={18} aria-label="Есть" />
                  </TableCell>
                  <TableCell>
                    <Minus size={18} aria-hidden />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead scope="row">Open-source дашборд</TableHead>
                  <TableCell>
                    <Check size={18} aria-label="Есть" />
                  </TableCell>
                  <TableCell>
                    <Minus size={18} aria-hidden />
                  </TableCell>
                  <TableCell>
                    <Minus size={18} aria-hidden />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className={styles.comparisonLegend}>
              <p className={styles.note}>
                * Приблизительные публичные прайсы, для маркетинга не как юридическое предложение.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className={styles.faqSection} aria-labelledby="faq-heading">
          <h2 id="faq-heading">FAQ</h2>
          <div className={styles.faqGrid}>
            <Card>
              <CardHeader>
                <CardTitle>How much does it cost?</CardTitle>
                <CardDescription>
                  Бесплатно и OSS; хостинг — на вашей стороне. У Sessy планируется managed-версия.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Обязательно ли знать Rails?</CardTitle>
                <CardDescription>Нет: Docker-деплой, дальше — веб-интерфейс и SES.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Что нужно для облака AWS SES?</CardTitle>
                <CardDescription>Webhook после деплоя. Не нужны долгоживущие ключи под отчётность.</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <Card className={styles.finalCard}>
            <CardHeader className={styles.finalDeployHeader}>
              <Radar size={36} aria-hidden />
              <CardTitle className={styles.deployTitle}>Deploy в пять минут</CardTitle>
              <CardDescription>
                Одна команда образа Docker + одна SNS-ссылка = полное покрытие событий.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.finalCardContent}>
              <div className={styles.codeBlock} aria-label="Пример Docker">
                <span># Локальный запуск (пример)</span>
                <br />
                docker run -p 3000:3000 sessy-demo:local
              </div>
              <Badge variant="secondary">Привязать webhook SNS к /webhooks/&lt;token&gt; на вашем хосте</Badge>
              <Separator />
              <div className={styles.finalActions}>
                <Button type="button" onClick={() => navigate('/components')}>
                  Каталог компонентов
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  На главную
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className={styles.footerMinimal}>
        <Badge variant="ghost">Композиция из shacdn</Badge>
        <span>
          Демонстрационный экран по мотивам маркетинга <strong>sessy.do</strong> (не официальный продукт AWS/Sessy).
        </span>
      </footer>
    </div>
  );
}
