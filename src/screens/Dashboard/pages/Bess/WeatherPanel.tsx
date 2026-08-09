import { memo, type ComponentType } from 'react';
import { Sun, CloudSun, Cloud, Cloudy, CloudRain, Droplets, Wind, Thermometer, CloudSunRain } from 'lucide-react';

import { formatKw, type ForecastPoint, type Weather, type WeatherCondition } from './bessData';
import { t } from './bessCopy';
import styles from './weather.module.scss';

const ICONS: Record<WeatherCondition, ComponentType<{ className?: string }>> = {
  clear: Sun,
  partly: CloudSun,
  cloudy: Cloud,
  overcast: Cloudy,
  rain: CloudRain,
};

type Props = {
  weather: Weather;
  forecast: ForecastPoint[];
  pvPotentialKw: number;
};

export const WeatherPanel = memo<Props>(({ weather, forecast, pvPotentialKw }) => {
  const Icon = ICONS[weather.condition];
  const peak = Math.max(1, ...forecast.map(point => point.pvKw));

  return (
    <div className={styles.panel}>
      <div className={styles.current}>
        <div className={`${styles.currentIcon} ${styles[weather.condition]}`}>
          <Icon aria-hidden />
        </div>
        <div className={styles.currentBody}>
          <strong>{`${weather.temperature.toFixed(1)} °C`}</strong>
          <span>{t(`_BESS_WX_${weather.condition.toUpperCase()}`)}</span>
        </div>
      </div>

      <dl className={styles.metrics}>
        <div>
          <dt>
            <CloudSunRain aria-hidden />
            {t('_BESS_WX_CLOUD')}
          </dt>
          <dd>{`${Math.round(weather.cloudCover * 100)} %`}</dd>
        </div>
        <div>
          <dt>
            <Wind aria-hidden />
            {t('_BESS_WX_WIND')}
          </dt>
          <dd>{`${weather.windKph.toFixed(0)} km/h`}</dd>
        </div>
        <div>
          <dt>
            <Droplets aria-hidden />
            {t('_BESS_WX_HUMIDITY')}
          </dt>
          <dd>{`${Math.round(weather.humidity * 100)} %`}</dd>
        </div>
        <div>
          <dt>
            <Thermometer aria-hidden />
            {t('_BESS_WX_POTENTIAL')}
          </dt>
          <dd>{formatKw(pvPotentialKw)}</dd>
        </div>
      </dl>

      <div className={styles.forecast}>
        <span className={styles.forecastTitle}>{t('_BESS_WX_FORECAST')}</span>
        <ul className={styles.hours}>
          {forecast.map(point => {
            const HourIcon = ICONS[point.condition];
            return (
              <li key={point.minute} className={styles.hour}>
                <span className={styles.hourClock}>{point.clock}</span>
                <HourIcon aria-hidden className={`${styles.hourIcon} ${styles[point.condition]}`} />
                <span className={styles.hourTemp}>{`${Math.round(point.temperature)}°`}</span>
                <div className={styles.hourBar} aria-hidden>
                  <div className={styles.hourFill} style={{ height: `${(point.pvKw / peak) * 100}%` }} />
                </div>
                <span className={styles.hourPv}>{point.pvKw >= 1000 ? `${(point.pvKw / 1000).toFixed(1)}M` : Math.round(point.pvKw)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
});

WeatherPanel.displayName = 'WeatherPanel';
