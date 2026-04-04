import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import GitHubSection from '../components/GitHubSection';
import { usePageMeta } from '../hooks/usePageMeta';
import { useTrackPageView } from '../hooks/useTrackPageView';

export default function GitHubPage({ portfolioData }) {
  const { profile, repositories, status, error } = portfolioData;

  usePageMeta({
    title: `${profile.name} | GitHub`,
    description:
      'Live GitHub repository feed with sorting, previews, and direct access to public code.',
  });

  useTrackPageView({
    page: '/github',
    title: 'GitHub',
  });

  return (
    <AppLayout profile={profile}>
      <section className="site-shell pb-14 pt-8">
        <div className="surface-panel rounded-[38px] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="eyebrow">GitHub</span>
              <h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.6rem)] font-semibold leading-[0.92] text-white">
                Public code, surfaced like a product archive.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--secondary-muted)]">
                This page pulls directly from the GitHub API and keeps the public repository feed
                sorted, readable, and immediately actionable. Every card leads to the real codebase
                and the connected project pages inside the portfolio.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="button-primary min-w-[160px]"
              >
                GitHub Profile
              </a>
              <Link to="/docs" className="button-secondary min-w-[160px]">
                Docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <GitHubSection
        repositories={repositories}
        status={status}
        error={error}
        limit={repositories.length || 12}
        showViewAll={false}
      />
    </AppLayout>
  );
}
