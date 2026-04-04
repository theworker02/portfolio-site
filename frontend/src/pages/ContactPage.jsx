import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Contact from '../components/Contact';
import { usePageMeta } from '../hooks/usePageMeta';
import { useTrackPageView } from '../hooks/useTrackPageView';

export default function ContactPage({ portfolioData }) {
  const { profile } = portfolioData;

  usePageMeta({
    title: `${profile.name} | Contact`,
    description:
      'Contact page for reaching out about collaborations, freelance work, or the next build.',
  });

  useTrackPageView({
    page: '/contact',
    title: 'Contact',
  });

  return (
    <AppLayout profile={profile}>
      <section className="site-shell pb-14 pt-8">
        <div className="surface-panel rounded-[38px] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="eyebrow">Contact</span>
              <h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.6rem)] font-semibold leading-[0.92] text-white">
                Start with the next product, not just the next message.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--secondary-muted)]">
                Reach out directly for product work, frontend engineering, or a deeper conversation
                about the projects in the archive. The form below now sends directly to the inbox.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/projects" className="button-secondary min-w-[160px]">
                View Projects
              </Link>
              <Link to="/dashboard" className="button-secondary min-w-[160px]">
                Dashboard
              </Link>
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="button-primary min-w-[170px]"
              >
                Open GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <Contact profile={profile} />
    </AppLayout>
  );
}
