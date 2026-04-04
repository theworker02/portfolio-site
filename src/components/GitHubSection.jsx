import { motion } from 'framer-motion';
import { startTransition, useDeferredValue, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackClick } from '../api/analytics';
import { getCategoryMeta, getProjectDemoPath, getProjectPath, getTechCategory, sortRepositories } from '../api/github';
import { motionTokens } from '../styles/tokens.ts';

const sortOptions = [
  { id: 'recent', label: 'Most recent' },
  { id: 'stars', label: 'Most starred' },
];

export default function GitHubSection({
  repositories,
  status,
  error,
  limit = 6,
  showViewAll = false,
  title = 'GitHub activity, surfaced with more clarity.',
}) {
  const [sortMode, setSortMode] = useState('recent');
  const deferredRepositories = useDeferredValue(repositories);
  const sortedRepositories = sortRepositories(deferredRepositories, sortMode).slice(0, limit);

  return (
    <section id="github" className="site-shell pb-20">
      <motion.div
        className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: motionTokens.reveal }}
      >
        <div className="max-w-3xl">
          <span className="eyebrow">GitHub</span>
          <h2 className="section-title mt-5">{title}</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--secondary-muted)]">
            Public repositories are fetched directly from the GitHub API, then sorted locally so
            the portfolio can shift between recent activity and star-weighted ranking without
            refreshing the page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  startTransition(() => {
                    setSortMode(option.id);
                  });
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${
                  sortMode === option.id
                    ? 'bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                    : 'text-white/56 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {showViewAll ? (
            <Link to="/projects" className="button-secondary">
              Open projects page
            </Link>
          ) : null}
        </div>
      </motion.div>

      {status === 'error' ? (
        <div className="surface-panel rounded-[30px] border border-red-400/20 bg-red-400/[0.06] p-6 text-white/70">
          {error}
        </div>
      ) : null}

      {status === 'loading' ? (
        <div className="projects-container">
          {Array.from({ length: Math.min(limit, 4) }).map((_, index) => (
            <div key={index} className="surface-panel rounded-[28px] p-6">
              <div className="loading-bar h-6 w-36 rounded-full" />
              <div className="loading-bar mt-5 h-4 w-full rounded-full" />
              <div className="loading-bar mt-3 h-4 w-10/12 rounded-full" />
              <div className="loading-bar mt-8 h-12 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : null}

      {status === 'success' ? (
        <div className="projects-container">
          {sortedRepositories.map((repository, index) => (
            <motion.article
              key={repository.id}
              className="project-card relative cursor-pointer rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,19,28,0.96),rgba(8,10,16,0.98))] p-6 sm:p-7"
              style={{
                '--project-color': getCategoryMeta(repository.category).color,
                '--project-border': getCategoryMeta(repository.category).border,
                '--project-glow': getCategoryMeta(repository.category).glow,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.05, duration: motionTokens.reveal }}
              onClick={(event) => {
                if (event.target instanceof Element && event.target.closest('a, button')) {
                  return;
                }

                trackClick({
                  page: '/github',
                  title: repository.name,
                  projectId: repository.slug,
                  target: 'github',
                  label: 'Open repo from GitHub card',
                });
                window.open(repository.repoUrl, '_blank', 'noopener,noreferrer');
              }}
              onKeyDown={(event) => {
                if (event.target instanceof Element && event.target.closest('a, button')) {
                  return;
                }

                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  trackClick({
                    page: '/github',
                    title: repository.name,
                    projectId: repository.slug,
                    target: 'github',
                    label: 'Open repo from GitHub keyboard',
                  });
                  window.open(repository.repoUrl, '_blank', 'noopener,noreferrer');
                }
              }}
              tabIndex={0}
              role="link"
              aria-label={`Open ${repository.name} on GitHub`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span
                      className="badge-pill uppercase tracking-[0.22em]"
                      style={{
                        '--badge-color': getCategoryMeta(repository.category).color,
                        '--badge-bg': getCategoryMeta(repository.category).soft,
                        '--badge-border': getCategoryMeta(repository.category).border,
                        '--badge-glow': getCategoryMeta(repository.category).glow,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: getCategoryMeta(repository.category).color }}
                      />
                      {repository.category}
                    </span>
                  </div>
                  <h3 className="font-display text-[1.85rem] font-semibold tracking-[-0.05em] text-white">
                    {repository.name}
                  </h3>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/40">
                    {repository.language}
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-white/68">
                  ★ {repository.stars}
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-[var(--secondary-muted)]">
                {repository.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {repository.techStack.slice(0, 4).map((item) => (
                  <span
                    key={item}
                    className="badge-pill"
                    style={{
                      '--badge-color': getCategoryMeta(getTechCategory(item)).color,
                      '--badge-bg': getCategoryMeta(getTechCategory(item)).soft,
                      '--badge-border': getCategoryMeta(getTechCategory(item)).border,
                      '--badge-glow': getCategoryMeta(getTechCategory(item)).glow,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={getProjectPath(repository)}
                  className="button-primary min-w-[130px]"
                  onClick={() => {
                    trackClick({
                      page: '/github',
                      title: repository.name,
                      projectId: repository.slug,
                      target: 'details',
                      label: 'View details from GitHub section',
                    });
                  }}
                >
                  View Details
                </Link>
                <a
                  href={repository.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-secondary min-w-[130px]"
                  onClick={() => {
                    trackClick({
                      page: '/github',
                      title: repository.name,
                      projectId: repository.slug,
                      target: 'github',
                      label: 'Open GitHub from GitHub section',
                    });
                  }}
                >
                  GitHub
                </a>
                {repository.demoUrl ? (
                  <Link
                    to={getProjectDemoPath(repository)}
                    className="button-secondary min-w-[130px]"
                    onClick={() => {
                      trackClick({
                        page: '/github',
                        title: repository.name,
                        projectId: repository.slug,
                        target: 'demo',
                        label: 'Launch demo from GitHub section',
                      });
                    }}
                  >
                    Live demo
                  </Link>
                ) : null}
              </div>
            </motion.article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
