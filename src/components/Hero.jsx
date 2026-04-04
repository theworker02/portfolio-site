import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { trackClick } from '../api/analytics';
import { getCategoryMeta, getProjectPath } from '../api/github';
import { motionTokens } from '../styles/tokens.ts';

function formatDate(dateString) {
  if (!dateString) {
    return 'Syncing';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

export default function Hero({ profile, stats, featuredProjects, status }) {
  const recentProjects = featuredProjects.slice(0, 3);

  return (
    <section
      id="home"
      className="site-shell relative scroll-mt-28 overflow-hidden pb-24 pt-10 lg:pb-32 lg:pt-20"
    >
      <div className="hero-ambient absolute inset-x-0 top-4 -z-10 h-[640px] rounded-[48px]" />
      <motion.div
        className="hero-light left-[6%] top-12 -z-10 h-64 w-64"
        style={{ background: 'rgba(41,151,255,0.24)' }}
        animate={{ x: [0, 14, 0], y: [0, -18, 0], opacity: [0.34, 0.58, 0.34] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />
      <motion.div
        className="hero-light right-[10%] top-24 -z-10 h-72 w-72"
        style={{ background: 'rgba(255,255,255,0.12)' }}
        animate={{ x: [0, -12, 0], y: [0, 18, 0], opacity: [0.28, 0.5, 0.28] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />

      <div className="mx-auto max-w-5xl text-center">
        <motion.div
        className="eyebrow"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionTokens.reveal }}
      >
          <span className="h-2 w-2 rounded-full bg-[var(--primary)] shadow-[0_0_18px_rgba(41,151,255,0.95)]" />
          {profile.title}
        </motion.div>

        <motion.h1
          className="mx-auto mt-8 max-w-5xl font-display text-[clamp(3.4rem,8vw,7rem)] font-semibold leading-[0.9] text-white"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.56, ease: motionTokens.ease }}
        >
          {profile.name}
          <span className="text-gradient mt-2 block">
            builds software with product discipline.
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-[var(--secondary-muted)] sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: motionTokens.reveal }}
        >
          {profile.tagline}
        </motion.p>

        <motion.p
          className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[var(--tertiary)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: motionTokens.reveal }}
        >
          {profile.heroIntro}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: motionTokens.reveal }}
        >
          <Link
            to="/projects"
            className="button-primary min-w-[170px]"
            onClick={() => {
              trackClick({
                page: '/',
                title: 'Hero',
                target: 'projects',
                label: 'View projects CTA',
              });
            }}
          >
            View Projects
          </Link>
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="button-secondary min-w-[170px]"
            onClick={() => {
              trackClick({
                page: '/',
                title: 'Hero',
                target: 'github',
                label: 'GitHub profile CTA',
              });
            }}
          >
            GitHub Profile
          </a>
        </motion.div>
      </div>

      <motion.div
        className="mt-16"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.66, ease: motionTokens.ease }}
      >
        <div className="surface-panel relative overflow-hidden rounded-[40px] p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),transparent_34%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(41,151,255,0.16),transparent_32%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={profile.avatarUrl}
                    alt={`${profile.name} GitHub avatar`}
                    className="h-16 w-16 rounded-[20px] border border-white/10 object-cover shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
                  />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
                      Live profile
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{profile.name}</h2>
                    <p className="mt-1 text-sm text-white/52">{profile.location}</p>
                  </div>
                </div>

                <span className="badge-pill" style={{ '--badge-color': '#8ec9ff' }}>
                  <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                  {status === 'success' ? 'Live GitHub signal' : 'Refreshing data'}
                </span>
              </div>

              <div className="mt-8 max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
                  Portfolio overview
                </p>
                <h3 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  {profile.summary}
                </h3>
                <p className="mt-5 max-w-xl text-base leading-8 text-[var(--secondary-muted)]">
                  {profile.availability}
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Public repos', value: stats.repoCount || '--' },
                  { label: 'Total stars', value: stats.totalStars || '--' },
                  { label: 'Languages used', value: stats.languageCount || '--' },
                  { label: 'Latest update', value: formatDate(stats.latestUpdate) },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="rounded-[26px] border border-white/8 bg-white/[0.035] px-5 py-5"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.26 + index * 0.06, duration: 0.42 }}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                      {item.label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
                    Recent launches
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">
                    Current work in motion.
                  </h3>
                </div>

                <Link to="/projects" className="text-sm font-semibold text-[var(--primary)]">
                  View all
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {status === 'loading' && recentProjects.length === 0
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4"
                      >
                        <div className="loading-bar h-32 rounded-[18px]" />
                        <div className="loading-bar mt-4 h-5 w-44 rounded-full" />
                        <div className="loading-bar mt-3 h-4 w-28 rounded-full" />
                      </div>
                    ))
                  : recentProjects.map((project, index) => {
                      const categoryMeta = getCategoryMeta(project.category);

                      return (
                        <motion.div
                          key={project.id}
                          className="overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.03]"
                          initial={{ opacity: 0, x: 14 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.06, duration: 0.4 }}
                        >
                          <div className="aspect-[16/9] overflow-hidden bg-black/20">
                            <img
                              src={project.previewImages[0]}
                              alt={`${project.name} preview`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>

                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <Link
                                  to={getProjectPath(project)}
                                  className="text-base font-semibold text-white transition duration-300 hover:text-[var(--accent)]"
                                  onClick={() => {
                                    trackClick({
                                      page: '/',
                                      title: project.name,
                                      projectId: project.slug,
                                      target: 'details',
                                      label: 'Recent launches project link',
                                    });
                                  }}
                                >
                                  {project.name}
                                </Link>
                                <p className="mt-1 text-sm text-white/52">{project.role}</p>
                              </div>

                              <span
                                className="badge-pill"
                                style={{
                                  '--badge-color': categoryMeta.color,
                                  '--badge-bg': categoryMeta.soft,
                                  '--badge-border': categoryMeta.border,
                                  '--badge-glow': categoryMeta.glow,
                                }}
                              >
                                {project.category}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
