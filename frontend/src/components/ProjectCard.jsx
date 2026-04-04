import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { trackClick } from '../api/analytics.js';
import { getCategoryMeta, getProjectDemoPath, getProjectPath, getTechCategory } from '../api/github.js';
import { motionTokens } from '../styles/tokens.ts';

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

export default function ProjectCard({ project, index, compact = false }) {
  const navigate = useNavigate();
  const categoryMeta = getCategoryMeta(project.category);
  const projectPath = getProjectPath(project);
  const demoPath = getProjectDemoPath(project);

  return (
    <motion.article
      className="project-card group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,19,28,0.96),rgba(8,10,16,0.98))]"
      style={{
        '--project-color': categoryMeta.color,
        '--project-border': categoryMeta.border,
        '--project-glow': categoryMeta.glow,
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: motionTokens.reveal, delay: index * 0.05, ease: motionTokens.ease }}
      onClick={(event) => {
        if (event.target instanceof Element && event.target.closest('a, button')) {
          return;
        }

        trackClick({
          page: '/projects',
          title: project.name,
          projectId: project.slug,
          target: 'details',
          label: 'Open project from card',
        });
        navigate(projectPath);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          trackClick({
            page: '/projects',
            title: project.name,
            projectId: project.slug,
            target: 'details',
            label: 'Open project from keyboard',
          });
          navigate(projectPath);
        }
      }}
      tabIndex={0}
      role="link"
      aria-label={`Open ${project.name} details`}
    >
      <div
        className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at top right, ${categoryMeta.glow}, transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.04), transparent 40%)`,
        }}
      />

      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={project.previewImages[0]}
          alt={`${project.name} repository preview`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,12,0.04)_0%,rgba(6,8,12,0.18)_54%,rgba(6,8,12,0.72)_100%)]" />
      </div>

      <div className="relative flex h-full flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="badge-pill"
                style={{
                  '--badge-color': categoryMeta.color,
                  '--badge-bg': categoryMeta.soft,
                  '--badge-border': categoryMeta.border,
                  '--badge-glow': categoryMeta.glow,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: categoryMeta.color }}
                />
                {project.category}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/52">
                {project.role}
              </span>
            </div>

            <div>
              <h3 className="font-display text-[1.8rem] font-semibold tracking-[-0.05em] text-white">
                {project.name}
              </h3>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/40">
                {project.language}
              </p>
            </div>
          </div>

          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-white/70">
            ★ {project.stars}
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--secondary-muted)]">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack.slice(0, compact ? 3 : 5).map((item) => {
            const techMeta = getCategoryMeta(getTechCategory(item));

            return (
              <span
                key={item}
                className="badge-pill"
                style={{
                  '--badge-color': techMeta.color,
                  '--badge-bg': techMeta.soft,
                  '--badge-border': techMeta.border,
                  '--badge-glow': techMeta.glow,
                }}
              >
                {item}
              </span>
            );
          })}
        </div>

        <div className="mt-auto pt-8">
          <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
            <span>Updated</span>
            <span>{formatDate(project.updatedAt)}</span>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              to={projectPath}
              className="button-primary min-w-[150px]"
              onClick={() => {
                trackClick({
                  page: '/projects',
                  title: project.name,
                  projectId: project.slug,
                  target: 'details',
                  label: 'View details button',
                });
              }}
            >
              View Details
            </Link>

            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="button-secondary min-w-[120px]"
              onClick={() => {
                trackClick({
                  page: '/projects',
                  title: project.name,
                  projectId: project.slug,
                  target: 'github',
                  label: 'GitHub button',
                });
              }}
            >
              GitHub
            </a>

            <Link
              to={demoPath}
              className="button-secondary min-w-[130px]"
              onClick={() => {
                trackClick({
                  page: '/projects',
                  title: project.name,
                  projectId: project.slug,
                  target: 'demo',
                  label: 'Live demo button',
                });
              }}
            >
              Live Demo
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
