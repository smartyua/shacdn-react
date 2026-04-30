import { NavLink } from 'react-router-dom';

import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';

import styles from './SiteHeader.module.scss';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `${styles.navLink}${isActive ? ` ${styles.navLinkActive}` : ''}`;

export const SiteHeader = () => (
  <header className={styles.wrap}>
    <div className={styles.inner}>
      <NavLink className={styles.brand} to="/" end>
        shacdn
      </NavLink>
      <nav className={styles.nav} aria-label="Навигация по сайту">
        <div className={styles.navCluster}>
          <NavLink className={navClass} to="/" end>
            Главная
          </NavLink>
          <NavLink className={navClass} to="/components">
            Компоненты
          </NavLink>
          <NavLink className={navClass} to="/sessy">
            Sessy
          </NavLink>
        </div>
      </nav>
      <div className={styles.actions}>
        <ThemeSwitcher variant="compact" />
      </div>
    </div>
  </header>
);
