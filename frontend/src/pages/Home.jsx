import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import About from '../components/About';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import { usePageMeta } from '../hooks/usePageMeta';
import { useTrackPageView } from '../hooks/useTrackPageView';

export default function Home({ portfolioData }) {
  const { profile, featuredProjects, status, stats } = portfolioData;

  usePageMeta({
    title: `${profile.name} | Developer Portfolio`,
    description: profile.summary,
  });

  useTrackPageView({
    page: '/',
    title: 'Home',
  });

  return (
    <AppLayout profile={profile}>
      <Hero profile={profile} stats={stats} featuredProjects={featuredProjects} status={status} />
      <Projects
        projects={featuredProjects}
        status={status}
        title="Featured launches built to feel like real products."
      />
      <About profile={profile} stats={stats} />
      <Skills profile={profile} />

      <section className="site-shell pb-24">
        <motion.div
          className="surface-panel overflow-hidden rounded-[40px] p-6 sm:p-8 lg:p-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-3xl">
              <span className="eyebrow">Next Step</span>
              <h2 className="mt-5 font-display text-[clamp(2.8rem,5vw,4.9rem)] font-semibold leading-[0.94] text-white">
                Explore the archive, review the docs, or watch the analytics in motion.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--secondary-muted)]">
                The site is now structured like a real product: dedicated project pages, demo
                routes, live usage tracking, and a dashboard that shows portfolio activity over
                time.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                  Product archive
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--secondary-muted)]">
                  Move through the full project system, then launch detail pages and demos from one
                  consistent flow.
                </p>
                <Link to="/projects" className="button-primary mt-6 min-w-[150px]">
                  View Projects
                </Link>
              </div>

              <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                  Product operations
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--secondary-muted)]">
                  Read the technical docs or open the live analytics dashboard for site-wide usage
                  data.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <Link to="/docs" className="button-secondary min-w-[150px]">
                    Open Docs
                  </Link>
                  <Link to="/dashboard" className="button-secondary min-w-[150px]">
                    View Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </AppLayout>
  );
}
