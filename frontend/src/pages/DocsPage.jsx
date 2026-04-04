import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { usePageMeta } from '../hooks/usePageMeta';
import { useTrackPageView } from '../hooks/useTrackPageView';

const docsSections = [
  {
    title: 'Application architecture',
    body:
      'The portfolio runs as a multi-page Vite and React frontend with a dedicated analytics backend. GitHub project data powers the public archive, while internal routes handle project detail pages, demo surfaces, and dashboard views.',
  },
  {
    title: 'Analytics backend',
    body:
      'An Express service records page views, project interactions, and demo launches. Events are persisted to SQLite-compatible storage through sql.js and exposed through `/api/view`, `/api/click`, and `/api/stats`.',
  },
  {
    title: 'Project system',
    body:
      'Project metadata now lives in a dedicated data layer so demos, SEO metadata, gallery content, local run instructions, and GitHub links all stay consistent across the app.',
  },
  {
    title: 'Deployment model',
    body:
      'The frontend is prepared for Vercel with SPA rewrites and production minification. The backend is prepared for Railway or Render as a standalone Node service with environment-driven origins and database path configuration.',
  },
];

const commandBlocks = [
  {
    label: 'Frontend dev',
    commands: ['npm install', 'npm run dev'],
  },
  {
    label: 'Backend dev',
    commands: ['npm install', 'npm run dev:backend'],
  },
  {
    label: 'Run both',
    commands: ['npm install', 'npm run dev:full'],
  },
  {
    label: 'Production build',
    commands: ['npm run build', 'npm run preview'],
  },
];

export default function DocsPage({ portfolioData }) {
  const { profile } = portfolioData;

  usePageMeta({
    title: `${profile.name} | Docs`,
    description: 'Technical documentation, local setup commands, and deployment notes for the portfolio.',
  });

  useTrackPageView({
    page: '/docs',
    title: 'Docs',
  });

  return (
    <AppLayout profile={profile}>
      <section className="site-shell pb-14 pt-8">
        <div className="surface-panel rounded-[38px] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="eyebrow">Docs</span>
              <h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.6rem)] font-semibold leading-[0.92] text-white">
                Product notes, architecture, and deployment guidance.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--secondary-muted)]">
                This page exists so the portfolio can function like a real shipped product, with a
                clear explanation of how the frontend, analytics backend, project system, and
                deployment model fit together.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/dashboard" className="button-primary min-w-[160px]">
                Open Dashboard
              </Link>
              <Link to="/projects" className="button-secondary min-w-[160px]">
                View Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="site-shell pb-20">
        <div className="grid gap-6 lg:grid-cols-2">
          {docsSections.map((section, index) => (
            <motion.article
              key={section.title}
              className="surface-panel rounded-[32px] p-6 sm:p-7"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                {section.title}
              </p>
              <p className="mt-4 text-sm leading-8 text-[var(--secondary-muted)]">
                {section.body}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="site-shell pb-20">
        <div className="surface-panel rounded-[36px] p-6 sm:p-8">
          <span className="eyebrow">Commands</span>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
            Local development and release workflow.
          </h2>

          <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {commandBlocks.map((block) => (
              <div
                key={block.label}
                className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                  {block.label}
                </p>
                <div className="mt-4 space-y-3">
                  {block.commands.map((command) => (
                    <div
                      key={command}
                      className="overflow-x-auto rounded-[18px] border border-white/8 bg-black/20 px-4 py-3"
                    >
                      <code className="text-sm text-white/84">{command}</code>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
