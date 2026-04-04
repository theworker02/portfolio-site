import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Skills from '../components/Skills';
import { usePageMeta } from '../hooks/usePageMeta';
import { useTrackPageView } from '../hooks/useTrackPageView';

export default function SkillsPage({ portfolioData }) {
  const { profile, featuredProjects } = portfolioData;

  usePageMeta({
    title: `${profile.name} | Skills`,
    description: 'Core frontend, backend, tooling, and language strengths behind the portfolio.',
  });

  useTrackPageView({
    page: '/skills',
    title: 'Skills',
  });

  return (
    <AppLayout profile={profile}>
      <section className="site-shell pb-14 pt-8">
        <div className="surface-panel rounded-[38px] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <span className="eyebrow">Skills</span>
              <h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.6rem)] font-semibold leading-[0.92] text-white">
                Product polish comes from repeatable craft.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--secondary-muted)]">
                The portfolio spans interface systems, backend services, realtime workflows, and
                tooling experiments. This page pulls those strengths into one cleaner overview.
              </p>
            </div>

            <div className="rounded-[26px] border border-white/8 bg-white/[0.03] px-5 py-4 text-sm text-white/62">
              {featuredProjects.length} featured builds currently in rotation
            </div>
          </div>
        </div>
      </section>

      <Skills profile={profile} />

      <section className="site-shell pb-20">
        <div className="surface-panel rounded-[36px] p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow">Next Step</span>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
                See those skills in a real project context.
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/projects" className="button-primary min-w-[170px]">
                View Projects
              </Link>
              <Link to="/dashboard" className="button-secondary min-w-[170px]">
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
