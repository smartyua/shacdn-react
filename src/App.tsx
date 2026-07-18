import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './styles/globals.scss';
import { LocaleProvider } from './components/Locale/Locale';
import { SiteHeader } from './components/SiteHeader/SiteHeader';
import { Spinner } from './components/Spinner/Spinner';
import { ToastProvider } from './components/Toast/Toast';

const ShadcnHome = lazy(() =>
  import('./screens/ShadcnHome/ShadcnHome').then((m) => ({ default: m.ShadcnHome }))
);
const ComponentsShowcase = lazy(() =>
  import('./screens/ComponentsShowcase/ComponentsShowcase').then((m) => ({
    default: m.ComponentsShowcase,
  }))
);
const DashboardLayout = lazy(() =>
  import('./screens/Dashboard/DashboardLayout').then((m) => ({ default: m.DashboardLayout }))
);
const OverviewPage = lazy(() =>
  import('./screens/Dashboard/pages/OverviewPage').then((m) => ({ default: m.OverviewPage }))
);
const AnalyticsPage = lazy(() =>
  import('./screens/Dashboard/pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage }))
);
const TrafficPage = lazy(() =>
  import('./screens/Dashboard/pages/TrafficPage').then((m) => ({ default: m.TrafficPage }))
);
const TopologyPage = lazy(() =>
  import('./screens/Dashboard/pages/TopologyPage').then((m) => ({ default: m.TopologyPage }))
);
const OrdersPage = lazy(() =>
  import('./screens/Dashboard/pages/OrdersPage').then((m) => ({ default: m.OrdersPage }))
);
const CustomersPage = lazy(() =>
  import('./screens/Dashboard/pages/CustomersPage').then((m) => ({ default: m.CustomersPage }))
);
const ReportsPage = lazy(() =>
  import('./screens/Dashboard/pages/ReportsPage').then((m) => ({ default: m.ReportsPage }))
);
const ActivityPage = lazy(() =>
  import('./screens/Dashboard/pages/ActivityPage').then((m) => ({ default: m.ActivityPage }))
);
const SettingsPage = lazy(() =>
  import('./screens/Dashboard/pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const PatternsPage = lazy(() =>
  import('./screens/Dashboard/pages/PatternsPage').then((m) => ({ default: m.PatternsPage }))
);
const ProfilePage = lazy(() =>
  import('./screens/Dashboard/pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const PaymentsPage = lazy(() =>
  import('./screens/Dashboard/pages/PaymentsPage').then((m) => ({ default: m.PaymentsPage }))
);
const AuditLogPage = lazy(() =>
  import('./screens/Dashboard/pages/AuditLogPage').then((m) => ({ default: m.AuditLogPage }))
);
const RequestsPage = lazy(() =>
  import('./screens/Dashboard/pages/RequestsPage').then((m) => ({ default: m.RequestsPage }))
);
const SessyLanding = lazy(() =>
  import('./screens/SessyLanding/SessyLanding').then((m) => ({ default: m.SessyLanding }))
);

const RouteFallback = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '40vh',
      gap: '0.75rem',
    }}
  >
    <Spinner />
    <span>Loading…</span>
  </div>
);

const withShell = (page: ReactNode) => (
  <>
    <SiteHeader />
    <Suspense fallback={<RouteFallback />}>{page}</Suspense>
  </>
);

const LazyPage = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<RouteFallback />}>{children}</Suspense>
);

const App = () => {
  return (
    <LocaleProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={withShell(<ShadcnHome />)} />
            <Route path="/components" element={withShell(<ComponentsShowcase />)} />
            <Route path="/dashboard" element={withShell(<DashboardLayout />)}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<LazyPage><OverviewPage /></LazyPage>} />
              <Route path="analytics" element={<LazyPage><AnalyticsPage /></LazyPage>} />
              <Route path="traffic" element={<LazyPage><TrafficPage /></LazyPage>} />
              <Route path="topology" element={<LazyPage><TopologyPage /></LazyPage>} />
              <Route path="orders" element={<LazyPage><OrdersPage /></LazyPage>} />
              <Route path="customers" element={<LazyPage><CustomersPage /></LazyPage>} />
              <Route path="reports" element={<LazyPage><ReportsPage /></LazyPage>} />
              <Route path="activity" element={<LazyPage><ActivityPage /></LazyPage>} />
              <Route path="patterns" element={<LazyPage><PatternsPage /></LazyPage>} />
              <Route path="profile" element={<LazyPage><ProfilePage /></LazyPage>} />
              <Route path="payments" element={<LazyPage><PaymentsPage /></LazyPage>} />
              <Route path="audit-log" element={<LazyPage><AuditLogPage /></LazyPage>} />
              <Route path="requests" element={<LazyPage><RequestsPage /></LazyPage>} />
              <Route path="settings" element={<LazyPage><SettingsPage /></LazyPage>} />
            </Route>
            <Route path="/sessy" element={withShell(<SessyLanding />)} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </LocaleProvider>
  );
};

export default App;
