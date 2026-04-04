import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { trackClick } from '../api/analytics';
import { getProjectBySlug, getProjectDemoPath } from '../api/github';
import AppLayout from '../components/AppLayout';
import RunLocallyPanel from '../components/RunLocallyPanel';
import { usePageMeta } from '../hooks/usePageMeta';
import { useTrackPageView } from '../hooks/useTrackPageView';

function formatDate(dateString) {
  if (!dateString) {
    return 'Recently';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

export default function ProjectDetailPage({ portfolioData }) {
  const { projectId } = useParams();
  const { profile, repositories, status } = portfolioData;
  const project = getProjectBySlug(repositories, projectId);

  usePageMeta({
    title: project ? `${project.name} | ${profile.name}` : `${profile.name} | Project`,
    description:
      project?.fullDescription ||
      'Project detail page with product overview, how it works, and launch instructions.',
    image: project?.previewImages?.[0] || '/images/portfolio-preview.svg',
  });

  useTrackPageView({
    page: `/projects/${projectId || ''}`,
    title: project?.name || 'Project detail',
    projectId: project?.slug,
  });

  if (!project && status === 'loading') {
    return (
      <AppLayout profile={profile}>
        <section className="site-shell pb-20 pt-10">
          <div className="surface-panel rounded-[38px] p-8">
            <div className="loading-bar h-8 w-44 rounded-full" />
            <div className="loading-bar mt-6 h-14 w-2/3 rounded-[18px]" />
            <div className="loading-bar mt-4 h-5 w-full rounded-full" />
            <div className="loading-bar mt-3 h-5 w-10/12 rounded-full" />
            <div className="loading-bar mt-8 h-[420px] rounded-[28px]" />
          </div>
        </section>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout profile={profile}>
        <section className="site-shell pb-20 pt-10">
          <div className="surface-panel rounded-[38px] p-8 text-center">
            <span className="eyebrow">Project</span>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
              That project route does not exist.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--secondary-muted)]">
              The project may have been removed or renamed. You can head back to the archive or
              return home.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/projects" className="button-primary min-w-[170px]">
                Browse Projects
              </Link>
              <Link to="/404" className="button-secondary min-w-[170px]">
                Open 404 Page
              </Link>
            </div>
          </div>
        </section>
      </AppLayout>
    );
  }

  return (
    <AppLayout profile={profile}>
      <section className="site-shell pb-14 pt-8">
        <div className="surface-panel overflow-hidden rounded-[40px] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow">{project.category}</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/56">
                  {project.role}
                </span>
              </div>

              <h1 className="mt-6 font-display text-[clamp(3rem,7vw,5.8rem)] font-semibold leading-[0.92] text-white">
                {project.title}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--secondary-muted)]">
                {project.fullDescription}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={getProjectDemoPath(project)}
                  className="button-primary min-w-[170px]"
                  onClick={() => {
                    trackClick({
                      page: `/projects/${project.slug}`,
                      title: project.name,
                      projectId: project.slug,
                      target: 'demo',
                      label: 'Launch demo route',
                    });
                  }}
                >
                  Launch Demo
                </Link>
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-secondary min-w-[150px]"
                  onClick={() => {
                    trackClick({
                      page: `/projects/${project.slug}`,
                      title: project.name,
                      projectId: project.slug,
                      target: 'github',
                      label: 'Open GitHub repo',
                    });
                  }}
                >
                  GitHub
                </a>
                <Link to="/projects" className="button-secondary min-w-[150px]">
                  Back to Projects
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Primary language', value: project.language },
                  { label: 'Stars', value: String(project.stars) },
                  { label: 'Last updated', value: formatDate(project.updatedAt) },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                      {item.label}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[34px] border border-white/8 bg-black/20">
              <img
                src={project.previewImages[0]}
                alt={`${project.name} preview`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="site-shell pb-20">
        <div className="surface-panel rounded-[36px] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow">Gallery</span>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
                Product visuals and repository surfaces.
              </h2>
            </div>

            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="button-secondary min-w-[170px]"
                onClick={() => {
                  trackClick({
                    page: `/projects/${project.slug}`,
                    title: project.name,
                    projectId: project.slug,
                    target: 'external-demo',
                    label: 'Open external demo',
                  });
                }}
              >
                Open Fullscreen
              </a>
            ) : null}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {project.images.map((image, index) => (
              <motion.figure
                key={`${image.src}-${index}`}
                className="overflow-hidden rounded-[28px] border border-white/8 bg-black/20"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
              >
                <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
              </motion.figure>
            ))}

            <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                Demo availability
              </p>
              <p className="mt-4 text-base leading-8 text-[var(--secondary-muted)]">
                {project.demoUrl
                  ? 'This project includes a live demo path. You can launch it inside the portfolio or open it directly in a dedicated browser tab.'
                  : 'This project is currently local-first, so the demo route doubles as a run guide with the exact commands needed to launch it yourself.'}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link to={getProjectDemoPath(project)} className="button-primary min-w-[150px]">
                  Open Demo Route
                </Link>
                <Link to="/docs" className="button-secondary min-w-[150px]">
                  Read Docs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-shell pb-20">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-panel rounded-[36px] p-6 sm:p-8">
            <span className="eyebrow">How It Works</span>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
              The core product loop.
            </h2>
            <div className="mt-8 grid gap-4">
              {project.howItWorks.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                    {item.title}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[var(--secondary-muted)]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel rounded-[36px] p-6 sm:p-8">
            <span className="eyebrow">Tech Stack</span>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.05em] text-white">
              What powers it.
            </h2>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {project.techStack.map((item) => (
                <span key={item} className="badge-pill">
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Feature breakdown
              </p>
              <div className="mt-4 space-y-3">
                {project.features.map((feature) => (
                  <p key={feature} className="text-sm leading-7 text-[var(--secondary-muted)]">
                    {feature}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-shell pb-20">
        <div className="surface-panel rounded-[36px] p-6 sm:p-8">
          <span className="eyebrow">Development Story</span>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
            How the project evolved.
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {project.story.map((item) => (
              <div
                key={item.title}
                className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                  {item.title}
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--secondary-muted)]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-shell pb-20">
        <RunLocallyPanel project={project} />
      </section>
    </AppLayout>
  );
}
