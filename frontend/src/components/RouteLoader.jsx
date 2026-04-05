import { motion } from 'framer-motion';
import { SITE_CONFIG } from '../config/site.ts';
import BrandMark from './BrandMark.jsx';
import { motionTokens } from '../styles/tokens.ts';

export default function RouteLoader() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-6">
      <div className="page-orb left-[8%] top-[18%]" />
      <div className="page-orb right-[10%] top-[42%]" />

      <motion.div
        className="surface-panel relative flex w-full max-w-md flex-col items-center rounded-[36px] px-8 py-10 text-center"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: motionTokens.page, ease: motionTokens.ease }}
      >
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),rgba(41,151,255,0.08))] shadow-[0_0_42px_rgba(41,151,255,0.16)]"
          animate={{ scale: [1, 1.04, 1], opacity: [0.92, 1, 0.92] }}
          transition={{
            duration: motionTokens.pulse,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        >
          <BrandMark className="h-9 w-9" alt={`${SITE_CONFIG.username} brand mark`} />
        </motion.div>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
          Loading
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-white">
          Preparing the next view.
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--secondary-muted)]">
          Routes, project data, and live portfolio content are loading now.
        </p>
      </motion.div>
    </div>
  );
}
