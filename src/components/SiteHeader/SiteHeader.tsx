import { NavLink } from 'react-router-dom';

import { LocaleSwitcher, useLocale } from '../Locale/Locale';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';

import styles from './SiteHeader.module.scss';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `${styles.navLink}${isActive ? ` ${styles.navLinkActive}` : ''}`;

export const SiteHeader = () => {
  const { messages } = useLocale();

  return (
    <header className={styles.wrap} data-slot="site-header">
      <div className={styles.inner}>
        <NavLink className={styles.brand} to="/" end>
          shacdn
        </NavLink>
        <nav className={styles.nav} aria-label={messages.siteNav.ariaLabel}>
          <div className={styles.navCluster}>
            <NavLink className={navClass} to="/" end>
              {messages.siteNav.home}
            </NavLink>
            <NavLink className={navClass} to="/components">
              {messages.siteNav.components}
            </NavLink>
            <NavLink className={navClass} to="/sessy">
              {messages.siteNav.sessy}
            </NavLink>
          </div>
        </nav>
        <div className={styles.actions} data-slot="site-header-actions">
          <LocaleSwitcher variant="compact" />
          <ThemeSwitcher variant="compact" />
        </div>
      </div>
    </header>
  );
};
