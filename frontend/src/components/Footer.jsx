import { Link } from 'react-router-dom';
import BrandMark from './BrandMark';

export default function Footer({ profile }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-shell pb-10 pt-12">
      <div className="flex flex-col gap-5 border-t border-white/8 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
              <BrandMark className="h-6 w-6" />
            </div>
            <p className="font-display text-base font-semibold tracking-[-0.03em] text-white">
              {profile.name}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/48">
            <Link to="/docs" className="transition duration-200 hover:text-white">
              Docs
            </Link>
            <Link to="/dashboard" className="transition duration-200 hover:text-white">
              Dashboard
            </Link>
            <Link to="/contact" className="transition duration-200 hover:text-white">
              Contact
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 text-sm text-white/56 lg:items-end">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[var(--primary)] transition duration-200 hover:text-white"
          >
            GitHub
          </a>
          <p>© {year} {profile.name}</p>
        </div>
      </div>
    </footer>
  );
}
