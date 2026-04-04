import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { usePageMeta } from '../hooks/usePageMeta';
import { useTrackPageView } from '../hooks/useTrackPageView';

export default function NotFoundPage({ portfolioData }) {
  const { profile } = portfolioData;

  usePageMeta({
    title: `${profile.name} | 404`,
    description: 'The requested portfolio route does not exist.',
  });

  useTrackPageView({
    page: '/404',
    title: '404',
  });

  return (
    <AppLayout profile={profile}>
      <section className="site-shell pb-20 pt-10">
        <motion.div
          className="surface-panel rounded-[40px] p-8 text-center sm:p-12"
          initial={{ opacity: 0, y: 10, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow">404</span>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
            This route is not part of the portfolio.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--secondary-muted)]">
            The page may have moved, or the URL may simply not exist. The main sections below are
            all wired and ready to explore.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/" className="button-primary min-w-[170px]">
              Back Home
            </Link>
            <Link to="/projects" className="button-secondary min-w-[170px]">
              Browse Projects
            </Link>
            <Link to="/docs" className="button-secondary min-w-[170px]">
              View Docs
            </Link>
          </div>
        </motion.div>
      </section>
    </AppLayout>
  );
}
