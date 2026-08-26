import { useLayoutEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { getHostHomeUrl } from '../../embed';
import { LocaleSwitcher, useLocale } from '../Locale/Locale';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';

import styles from './SiteHeader.module.scss';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `${styles.navLink}${isActive ? ` ${styles.navLinkActive}` : ''}`;

export const SiteHeader = () => {
  const { messages } = useLocale();
  const hostHomeUrl = getHostHomeUrl();
  const { pathname } = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const dashboardActive = pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/bess');

  useLayoutEffect(() => {
    const node = headerRef.current;
    if (!node) return;
    const sync = () => {
      document.documentElement.style.setProperty('--site-header-height', `${node.offsetHeight}px`);
    };
    sync();
    if (typeof ResizeObserver === 'undefined') {
      return () => {
        document.documentElement.style.removeProperty('--site-header-height');
      };
    }
    const observer = new ResizeObserver(sync);
    observer.observe(node);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--site-header-height');
    };
  }, []);

  return (
    <header ref={headerRef} className={styles.wrap} data-slot="site-header">
      <div className={styles.inner}>
        <div className={styles.brandCluster}>
          {hostHomeUrl ? (
            <a className={styles.backLink} href={hostHomeUrl}>
              {messages.siteNav.backToHost}
            </a>
          ) : null}
          <NavLink className={styles.brand} to="/" end>
            shacdn
          </NavLink>
        </div>
        <nav className={styles.nav} aria-label={messages.siteNav.ariaLabel}>
          <div className={styles.navCluster}>
            <NavLink className={navClass} to="/" end>
              {messages.siteNav.home}
            </NavLink>
            <NavLink className={navClass} to="/components">
              {messages.siteNav.components}
            </NavLink>
            <NavLink className={() => navClass({ isActive: dashboardActive })} to="/dashboard">
              {messages.siteNav.dashboard}
            </NavLink>
            <NavLink className={navClass} to="/dashboard/bess">
              {messages.siteNav.bessSolar}
            </NavLink>
            <NavLink className={navClass} to="/transcoding">
              {messages.siteNav.transcoding}
            </NavLink>
            <NavLink className={navClass} to="/crm">
              {messages.siteNav.crm}
            </NavLink>
            <NavLink className={navClass} to="/sessy">
              {messages.siteNav.sessy}
            </NavLink>
          </div>
        </nav>
        <div className={styles.actions} data-slot="site-header-actions">
          <LocaleSwitcher variant="compact" />
          <ThemeSwitcher variant="compact" labels={messages.themeSwitcher} />
        </div>
      </div>
    </header>
  );
};
