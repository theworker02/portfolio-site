import { motion } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { usePageMeta } from '../hooks/usePageMeta';
import { useTrackPageView } from '../hooks/useTrackPageView';

function formatPathLabel(pathname) {
  if (pathname === '/') {
    return 'Home';
  }

  return pathname.replace(/^\//, '');
}

export default function DashboardPage({ portfolioData }) {
  const { profile } = portfolioData;
  const { data, status, error } = useDashboardStats();

  usePageMeta({
    title: `${profile.name} | Dashboard`,
    description: 'Live portfolio analytics dashboard showing visits, clicks, and demo engagement.',
  });

  useTrackPageView({
    page: '/dashboard',
    title: 'Dashboard',
  });

  return (
    <AppLayout profile={profile}>
      <section className="site-shell pb-14 pt-8">
        <div className="surface-panel rounded-[38px] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="eyebrow">Dashboard</span>
              <h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.6rem)] font-semibold leading-[0.92] text-white">
                Portfolio analytics, tracked by the real backend.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--secondary-muted)]">
                This dashboard refreshes automatically and surfaces site visits, project engagement,
                and demo usage from the analytics API.
              </p>
            </div>

            <div className="rounded-[26px] border border-white/8 bg-white/[0.03] px-5 py-4 text-sm text-white/62">
              Auto-refresh every 15 seconds
            </div>
          </div>
        </div>
      </section>

      {status === 'loading' ? (
        <section className="site-shell pb-20">
          <div className="grid gap-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="surface-panel rounded-[30px] p-6">
                <div className="loading-bar h-5 w-24 rounded-full" />
                <div className="loading-bar mt-5 h-10 w-28 rounded-[18px]" />
                <div className="loading-bar mt-6 h-4 w-full rounded-full" />
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="surface-panel rounded-[34px] p-6">
              <div className="loading-bar h-6 w-40 rounded-full" />
              <div className="loading-bar mt-6 h-64 rounded-[24px]" />
            </div>
            <div className="surface-panel rounded-[34px] p-6">
              <div className="loading-bar h-6 w-40 rounded-full" />
              <div className="loading-bar mt-6 h-64 rounded-[24px]" />
            </div>
          </div>
        </section>
      ) : null}

      {status === 'error' ? (
        <section className="site-shell pb-20">
          <div className="surface-panel rounded-[34px] border border-red-400/20 bg-red-400/[0.06] p-8">
            <span className="eyebrow">Analytics API</span>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.05em] text-white">
              Dashboard data is unavailable right now.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/72">{error}</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/56">
              Start the backend from `/backend` with `npm start`, or configure `VITE_API_URL` for
              production deployment.
            </p>
          </div>
        </section>
      ) : null}

      {status === 'success' && data ? (
        <>
          <section className="site-shell pb-20">
            <div className="grid gap-6 lg:grid-cols-4">
              {[
                { label: 'Site visits', value: data.totals.siteVisits },
                { label: 'Page views', value: data.totals.pageViews },
                { label: 'Project clicks', value: data.totals.projectClicks },
                { label: 'Demo launches', value: data.totals.demoLaunches },
              ].map((item) => (
                <div key={item.label} className="surface-panel rounded-[30px] p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                    {item.label}
                  </p>
                  <p className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em] text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="site-shell pb-20">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="surface-panel rounded-[34px] p-6 sm:p-8">
                <span className="eyebrow">Most Viewed Pages</span>
                <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.05em] text-white">
                  Route traffic
                </h2>
                <div className="mt-8 space-y-4">
                  {data.topPages.map((page) => {
                    const maxViews = data.topPages[0]?.views || 1;
                    const width = `${Math.max((page.views / maxViews) * 100, 12)}%`;

                    return (
                      <div key={page.page}>
                        <div className="mb-2 flex items-center justify-between gap-4 text-sm text-white/70">
                          <span>{formatPathLabel(page.page)}</span>
                          <span>{page.views}</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,#2997FF,#7CC7FF)]"
                            style={{ width }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="surface-panel rounded-[34px] p-6 sm:p-8">
                <span className="eyebrow">Top Projects</span>
                <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.05em] text-white">
                  Most engaged project pages
                </h2>
                <div className="mt-8 space-y-4">
                  {data.topProjects.map((project) => (
                    <div
                      key={project.projectId}
                      className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">{project.title}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/40">
                            {project.projectId}
                          </p>
                        </div>
                        <div className="text-right text-xs text-white/52">
                          <p>{project.views} views</p>
                          <p>{project.clicks} clicks</p>
                          <p>{project.demos} demos</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="site-shell pb-20">
            <div className="surface-panel rounded-[34px] p-6 sm:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <span className="eyebrow">Recent Events</span>
                  <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.05em] text-white">
                    Latest tracked activity
                  </h2>
                </div>
                <p className="text-sm text-white/52">Updated at {data.generatedAt}</p>
              </div>

              <div className="mt-8 overflow-hidden rounded-[28px] border border-white/8">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-white/8 bg-white/[0.03] px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                  <span>Event</span>
                  <span>Target</span>
                  <span>Time</span>
                </div>

                <div className="divide-y divide-white/8">
                  {data.recentEvents.map((event, index) => (
                    <div
                      key={`${event.createdAt}-${index}`}
                      className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-4 text-sm text-white/72"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {event.title || formatPathLabel(event.page)}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/36">
                          {event.eventType} · {event.page}
                        </p>
                      </div>
                      <span className="self-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/56">
                        {event.target || 'route'}
                      </span>
                      <span className="self-center text-xs text-white/42">{event.createdAt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </AppLayout>
  );
}
