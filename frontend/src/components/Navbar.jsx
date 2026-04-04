import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BrandMark from './BrandMark.jsx';
import { motionTokens } from '../styles/tokens.ts';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Docs', to: '/docs' },
  { label: 'About', to: '/about' },
  { label: 'Skills', to: '/skills' },
  { label: 'GitHub', to: '/github' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Contact', to: '/contact' },
];

function isActiveRoute(pathname, targetPath) {
  if (targetPath === '/') {
    return pathname === '/';
  }

  if (targetPath === '/projects') {
    return pathname === '/projects' || pathname.startsWith('/projects/') || pathname.startsWith('/demo/');
  }

  return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
}

export default function Navbar({ profile }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const { pathname } = useLocation();

  useMotionValueEvent(scrollY, 'change', (value) => {
    setIsScrolled(value > 18);
  });

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <motion.header
      className="navbar sticky top-0 z-[1000]"
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.page, ease: motionTokens.ease }}
    >
      <div className="site-shell pt-4">
        <div
          className={`relative rounded-full px-4 py-3 transition-all duration-200 ${
            isScrolled
              ? 'border border-white/10 bg-[linear-gradient(180deg,rgba(9,12,18,0.84),rgba(9,12,18,0.72))] shadow-[0_22px_60px_rgba(0,0,0,0.34)] backdrop-blur-3xl'
              : 'border border-white/6 bg-[linear-gradient(180deg,rgba(8,11,17,0.62),rgba(8,11,17,0.46))] backdrop-blur-2xl'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="group flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] shadow-[0_0_28px_rgba(41,151,255,0.12)]">
                <BrandMark className="h-7 w-7" />
              </div>

              <span className="hidden min-w-0 sm:block">
                <span className="block font-display text-sm font-semibold tracking-[-0.03em] text-white">
                  {profile.name}
                </span>
                <span className="block truncate text-xs text-white/42">
                  {profile.title}
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => {
                const isActive = isActiveRoute(pathname, link.to);

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`group relative rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
                      isActive
                        ? 'bg-white/[0.055] text-white'
                        : 'text-white/60 hover:bg-white/[0.035] hover:text-white'
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute inset-x-4 bottom-1.5 h-px origin-left rounded-full bg-gradient-to-r from-[var(--primary)] via-white/80 to-[var(--accent)] transition duration-300 ${
                        isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="button-secondary hidden min-w-[128px] sm:inline-flex"
              >
                Open GitHub
              </a>

              <motion.button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white lg:hidden"
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsMenuOpen((current) => !current)}
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <div className="relative h-4 w-5">
                  <span
                    className={`absolute left-0 top-0 h-0.5 w-full rounded-full bg-current transition duration-300 ${
                      isMenuOpen ? 'translate-y-[7px] rotate-45' : ''
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-[7px] h-0.5 w-full rounded-full bg-current transition duration-300 ${
                      isMenuOpen ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-[14px] h-0.5 w-full rounded-full bg-current transition duration-300 ${
                      isMenuOpen ? '-translate-y-[7px] -rotate-45' : ''
                    }`}
                  />
                </div>
              </motion.button>
            </div>
          </div>

          <motion.span
            className="absolute inset-x-8 bottom-0 h-px origin-left bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent"
            style={{ scaleX: scrollYProgress }}
          />
        </div>

        <AnimatePresence>
          {isMenuOpen ? (
            <motion.div
              className="overflow-hidden lg:hidden"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: motionTokens.hover, ease: motionTokens.ease }}
            >
              <div className="surface-panel rounded-[28px] p-3">
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`rounded-[20px] px-4 py-3 text-sm font-medium transition duration-300 ${
                        isActiveRoute(pathname, link.to)
                          ? 'bg-white/[0.055] text-white'
                          : 'text-white/74 hover:bg-white/[0.045] hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="button-secondary mt-1 justify-center"
                  >
                    Visit GitHub
                  </a>
                </nav>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
