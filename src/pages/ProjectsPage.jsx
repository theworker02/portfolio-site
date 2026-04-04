import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import ProjectCard from '../components/ProjectCard';
import Projects from '../components/Projects';
import { usePageMeta } from '../hooks/usePageMeta';
import { useTrackPageView } from '../hooks/useTrackPageView';

export default function ProjectsPage({ portfolioData }) {
  const { profile, repositories, featuredProjects, status } = portfolioData;

  usePageMeta({
    title: `${profile.name} | Projects`,
    description: `Project archive, detail pages, demos, and local setup guidance for ${profile.name}.`,
  });

  useTrackPageView({
    page: '/projects',
    title: 'Projects',
  });

  return (
    <AppLayout profile={profile}>
      <section className="site-shell pb-14 pt-8">
        <div className="surface-panel rounded-[38px] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="max-w-3xl">
              <span className="eyebrow">Projects</span>
              <h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.8rem)] font-semibold leading-[0.92] text-white">
                The portfolio archive, structured like a product catalog.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--secondary-muted)]">
                Every project card leads to a dedicated detail page, a real GitHub repository, and
                a demo route with either an embedded preview or the exact local workflow.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                  Project count
                </p>
                <p className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em] text-white">
                  {repositories.length || featuredProjects.length}
                </p>
              </div>
              <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                  Live analytics
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--secondary-muted)]">
                  Review usage data, demo launches, and project engagement from the analytics
                  dashboard.
                </p>
                <Link to="/dashboard" className="button-secondary mt-5 min-w-[150px]">
                  Open Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Projects
        projects={featuredProjects}
        status={status}
        title="Featured case studies with the strongest product depth."
        showArchiveLink={false}
      />

      <section className="site-shell pb-20">
        <motion.div
          className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl">
            <span className="eyebrow">Project Directory</span>
            <h2 className="section-title mt-5">Every public project, with a direct path forward.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--secondary-muted)]">
              Use this grid when you want the full catalog. Each card opens a dedicated project
              page, and every project page branches into GitHub, docs, and demo access.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/docs" className="button-secondary min-w-[150px]">
              Docs
            </Link>
            <Link to="/contact" className="button-primary min-w-[150px]">
              Contact
            </Link>
          </div>
        </motion.div>

        {status === 'loading' ? (
          <div className="projects-container">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="surface-panel rounded-[32px] p-6">
                <div className="loading-bar h-48 rounded-[24px]" />
                <div className="loading-bar mt-6 h-5 w-40 rounded-full" />
                <div className="loading-bar mt-4 h-4 w-full rounded-full" />
                <div className="loading-bar mt-3 h-4 w-10/12 rounded-full" />
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="loading-bar h-11 rounded-full" />
                  <div className="loading-bar h-11 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="projects-container">
            {repositories.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} compact />
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
