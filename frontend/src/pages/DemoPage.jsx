import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { trackClick } from '../api/analytics';
import { getProjectBySlug, getProjectPath } from '../api/github';
import AppLayout from '../components/AppLayout';
import RunLocallyPanel from '../components/RunLocallyPanel';
import { usePageMeta } from '../hooks/usePageMeta';
import { useTrackPageView } from '../hooks/useTrackPageView';

export default function DemoPage({ portfolioData }) {
  const { projectId } = useParams();
  const { profile, repositories, status } = portfolioData;
  const project = getProjectBySlug(repositories, projectId);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  usePageMeta({
    title: project ? `${project.name} Demo | ${profile.name}` : `${profile.name} | Demo`,
    description:
      project?.demoUrl
        ? `Live demo access for ${project.name}.`
        : `Local launch instructions for ${project?.name || 'this project'}.`,
    image: project?.previewImages?.[0] || '/images/portfolio-preview.svg',
  });

  useTrackPageView({
    page: `/demo/${projectId || ''}`,
    title: project?.name ? `${project.name} demo` : 'Demo',
    projectId: project?.slug,
  });

  useEffect(() => {
    if (!project || !project.demoUrl) {
      return;
    }

    trackClick({
      page: `/demo/${project.slug}`,
      title: project.name,
      projectId: project.slug,
      target: 'demo',
      label: 'Opened demo route',
    });
  }, [project]);

  if (!project && status === 'loading') {
    return (
      <AppLayout profile={profile}>
        <section className="site-shell pb-20 pt-10">
          <div className="surface-panel rounded-[38px] p-8">
            <div className="loading-bar h-8 w-40 rounded-full" />
            <div className="loading-bar mt-6 h-14 w-2/3 rounded-[18px]" />
            <div className="loading-bar mt-8 h-[540px] rounded-[28px]" />
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
            <span className="eyebrow">Demo</span>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
              That demo route does not exist.
            </h1>
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
        <div className="surface-panel rounded-[38px] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="eyebrow">Demo Access</span>
              <h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-[0.92] text-white">
                {project.name}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--secondary-muted)]">
                {project.demoMode === 'local'
                  ? 'This project does not expose a public deployment right now, so the portfolio demo route becomes a launch guide with the exact local workflow.'
                  : project.demoMode === 'redirect'
                    ? 'This project uses an external live demo. The portfolio keeps a clean jump-off page so you can launch the experience without losing context.'
                    : 'This project supports an embedded live preview directly inside the portfolio.'}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to={getProjectPath(project)} className="button-secondary min-w-[160px]">
                Project Details
              </Link>
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="button-secondary min-w-[140px]"
                onClick={() => {
                  trackClick({
                    page: `/demo/${project.slug}`,
                    title: project.name,
                    projectId: project.slug,
                    target: 'github',
                    label: 'Open GitHub from demo page',
                  });
                }}
              >
                GitHub
              </a>
              {project.demoUrl ? (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-primary min-w-[170px]"
                  onClick={() => {
                    trackClick({
                      page: `/demo/${project.slug}`,
                      title: project.name,
                      projectId: project.slug,
                      target: 'fullscreen-demo',
                      label: 'Open demo fullscreen',
                    });
                  }}
                >
                  Open Fullscreen
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {project.demoMode === 'embed' ? (
        <section className="site-shell pb-20">
          <div className="surface-panel overflow-hidden rounded-[38px] p-4 sm:p-5">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
              {!iframeLoaded ? (
                <div className="absolute inset-0 z-[1] flex items-center justify-center bg-[rgba(5,7,11,0.9)]">
                  <div className="flex items-center gap-3 text-sm text-white/68">
                    <span className="loading-bar h-10 w-10 rounded-full" />
                    Loading live demo
                  </div>
                </div>
              ) : null}
              <iframe
                title={`${project.name} demo`}
                src={project.demoUrl}
                className="h-[78vh] min-h-[620px] w-full"
                onLoad={() => setIframeLoaded(true)}
              />
            </div>
          </div>
        </section>
      ) : null}

      {project.demoMode === 'redirect' ? (
        <section className="site-shell pb-20">
          <div className="surface-panel rounded-[38px] p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
              <span className="loading-bar h-10 w-10 rounded-full" />
            </div>
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-[-0.05em] text-white">
              External demo available.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[var(--secondary-muted)]">
              This project launches outside the portfolio. Use the fullscreen button above to open
              the live deployment directly.
            </p>
          </div>
        </section>
      ) : null}

      {project.demoMode === 'local' ? (
        <section className="site-shell pb-20">
          <RunLocallyPanel project={project} />
        </section>
      ) : (
        <section className="site-shell pb-20">
          <RunLocallyPanel project={project} compact />
        </section>
      )}
    </AppLayout>
  );
}
