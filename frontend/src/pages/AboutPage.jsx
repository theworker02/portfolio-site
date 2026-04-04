import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import About from '../components/About';
import Skills from '../components/Skills';
import { usePageMeta } from '../hooks/usePageMeta';
import { useTrackPageView } from '../hooks/useTrackPageView';

export default function AboutPage({ portfolioData }) {
  const { profile, stats } = portfolioData;

  usePageMeta({
    title: `${profile.name} | About`,
    description: `Background, interests, and working style behind the projects published by ${profile.name}.`,
  });

  useTrackPageView({
    page: '/about',
    title: 'About',
  });

  return (
    <AppLayout profile={profile}>
      <section className="site-shell pb-14 pt-8">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="surface-panel rounded-[34px] p-6 sm:p-8">
            <img
              src={profile.avatarUrl}
              alt={`${profile.name} GitHub avatar`}
              className="h-24 w-24 rounded-[28px] border border-white/10 object-cover"
            />
            <h1 className="section-title mt-6">{profile.name}</h1>
            <p className="mt-3 text-lg text-[var(--primary)]">{profile.title}</p>
            <p className="mt-4 text-base leading-8 text-white/62">{profile.summary}</p>
          </div>

          <div className="surface-panel rounded-[34px] p-6 sm:p-8">
            <span className="eyebrow">Profile</span>
            <h2 className="section-title mt-5">Building serious products in public, one release at a time.</h2>
            <p className="mt-4 text-base leading-8 text-white/62">
              The portfolio spans interfaces, operational products, backend systems, and developer
              tooling. The common thread is simple: make the software feel considered before it
              ever feels noisy.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/projects" className="button-primary min-w-[160px]">
                View Projects
              </Link>
              <Link to="/docs" className="button-secondary min-w-[160px]">
                Open Docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <About profile={profile} stats={stats} showPageLink={false} />
      <Skills profile={profile} />

      <section className="site-shell pb-20">
        <div className="surface-panel rounded-[36px] p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow">Next Step</span>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
                See the philosophy translated into a real build.
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/projects" className="button-primary min-w-[170px]">
                Browse Projects
              </Link>
              <Link to="/contact" className="button-secondary min-w-[170px]">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
