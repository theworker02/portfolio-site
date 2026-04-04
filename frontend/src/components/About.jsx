import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function About({ profile, stats, showPageLink = true }) {
  const interestColors = [
    { color: '#3B82F6', soft: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.28)', glow: 'rgba(59,130,246,0.3)' },
    { color: '#8B5CF6', soft: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.28)', glow: 'rgba(139,92,246,0.3)' },
    { color: '#06B6D4', soft: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.28)', glow: 'rgba(6,182,212,0.3)' },
  ];

  const statItems = [
    {
      label: 'Repos in public',
      value: String(stats.repoCount || 0).padStart(2, '0'),
    },
    {
      label: 'Languages in play',
      value: String(stats.languageCount || 0).padStart(2, '0'),
    },
    {
      label: 'GitHub cadence',
      value: 'Always building',
    },
  ];

  return (
    <section id="about" className="site-shell scroll-mt-28 pb-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <motion.div
          className="surface-panel rounded-[36px] p-7 sm:p-8"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow">About</span>
          <h2 className="section-title mt-5">A quieter, more deliberate way of building.</h2>

          <div className="mt-7 space-y-5 text-base leading-8 text-[var(--secondary-muted)]">
            {profile.about.map((paragraph, index) => (
              <motion.p
                key={paragraph}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.06, duration: 0.45 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {showPageLink ? (
            <Link to="/about" className="button-secondary mt-8">
              Read full profile
            </Link>
          ) : null}
        </motion.div>

        <motion.div
          className="grid gap-4 sm:grid-cols-3"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              className="surface-panel rounded-[30px] p-5"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.08 + index * 0.06, duration: 0.45 }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                {item.label}
              </p>
              <p className="mt-4 font-display text-3xl font-semibold tracking-[-0.05em] text-white">
                {item.value}
              </p>
            </motion.div>
          ))}

          <motion.div
            className="surface-panel rounded-[30px] p-6 sm:col-span-3"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.22, duration: 0.45 }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
              Current focus
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--secondary-muted)]">
              The throughline across the portfolio is consistent: clearer interfaces, stronger
              interaction design, and software that feels intentional from the first screen.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {profile.interests.map((interest, index) => (
                <span
                  key={interest}
                  className="badge-pill px-3 py-2 text-sm"
                  style={{
                    '--badge-color': interestColors[index % interestColors.length].color,
                    '--badge-bg': interestColors[index % interestColors.length].soft,
                    '--badge-border': interestColors[index % interestColors.length].border,
                    '--badge-glow': interestColors[index % interestColors.length].glow,
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
