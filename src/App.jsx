import { Analytics } from '@vercel/analytics/react';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import RouteLoader from './components/RouteLoader';
import { usePortfolioData } from './hooks/usePortfolioData';
import { motionTokens } from './styles/tokens.ts';

const Home = lazy(() => import('./pages/Home'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const DemoPage = lazy(() => import('./pages/DemoPage'));
const DocsPage = lazy(() => import('./pages/DocsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const SkillsPage = lazy(() => import('./pages/SkillsPage'));
const GitHubPage = lazy(() => import('./pages/GitHubPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const timer = window.setTimeout(() => {
        const target = document.getElementById(location.hash.slice(1));

        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 80);

      return () => {
        window.clearTimeout(timer);
      };
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
    return undefined;
  }, [location.hash, location.pathname]);

  return null;
}

function renderRoute(routeName, element) {
  return <RouteErrorBoundary routeName={routeName}>{element}</RouteErrorBoundary>;
}

function AnimatedRoutes({ portfolioData }) {
  const location = useLocation();

  return (
    <>
      <ScrollManager />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={renderRoute('Home', <Home portfolioData={portfolioData} />)}
          />
          <Route
            path="/projects"
            element={renderRoute('Projects', <ProjectsPage portfolioData={portfolioData} />)}
          />
          <Route
            path="/projects/:projectId"
            element={renderRoute(
              'Project detail',
              <ProjectDetailPage portfolioData={portfolioData} />,
            )}
          />
          <Route
            path="/demo/:projectId"
            element={renderRoute('Demo', <DemoPage portfolioData={portfolioData} />)}
          />
          <Route
            path="/docs"
            element={renderRoute('Docs', <DocsPage portfolioData={portfolioData} />)}
          />
          <Route
            path="/about"
            element={renderRoute('About', <AboutPage portfolioData={portfolioData} />)}
          />
          <Route
            path="/skills"
            element={renderRoute('Skills', <SkillsPage portfolioData={portfolioData} />)}
          />
          <Route
            path="/github"
            element={renderRoute('GitHub', <GitHubPage portfolioData={portfolioData} />)}
          />
          <Route
            path="/dashboard"
            element={renderRoute('Dashboard', <DashboardPage portfolioData={portfolioData} />)}
          />
          <Route
            path="/contact"
            element={renderRoute('Contact', <ContactPage portfolioData={portfolioData} />)}
          />
          <Route
            path="/404"
            element={renderRoute('404', <NotFoundPage portfolioData={portfolioData} />)}
          />
          <Route
            path="*"
            element={renderRoute('404', <NotFoundPage portfolioData={portfolioData} />)}
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function AppShell() {
  const portfolioData = usePortfolioData();

  if (portfolioData.status === 'loading' && portfolioData.repositories.length === 0) {
    return <RouteLoader />;
  }

  return (
    <motion.div
      className="min-h-screen bg-[var(--background)] text-[var(--secondary)] antialiased"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionTokens.page, ease: motionTokens.ease }}
    >
      <Suspense fallback={<RouteLoader />}>
        <AnimatedRoutes portfolioData={portfolioData} />
      </Suspense>
    </motion.div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
      <Analytics />
    </BrowserRouter>
  );
}
