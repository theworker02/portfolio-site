import { motion } from 'framer-motion';
import { getCategoryMeta, getTechCategory } from '../api/github';

const categoryIcons = {
  Frontend: 'UI',
  Backend: 'API',
  Tools: 'OPS',
  Languages: 'DEV',
};

export default function Skills({ profile }) {
  const getSkillCategory = (title) => {
    if (title === 'Tools') {
      return 'Tooling';
    }

    if (title === 'Languages') {
      return 'Full Stack';
    }

    return title;
  };

  return (
    <section className="site-shell pb-20">
      <motion.div
        className="mb-12 max-w-3xl"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <span className="eyebrow">Skills</span>
        <h2 className="section-title mt-5">The stack behind the polish.</h2>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--secondary-muted)]">
          The tools here reflect the actual GitHub work: modern frontend systems, backend
          services, deployment-friendly tooling, and the languages that keep showing up in real
          builds.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {profile.skillGroups.map((group, index) => {
          const categoryMeta = getCategoryMeta(getSkillCategory(group.title));

          return (
            <motion.article
              key={group.title}
              className="surface-panel skill-tile group rounded-[32px] p-6 sm:p-7"
              style={{
                '--skill-glow': categoryMeta.glow,
                '--skill-border': categoryMeta.border,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <div
                className="relative z-[1] flex h-12 w-12 items-center justify-center rounded-2xl border text-xs font-bold tracking-[0.22em]"
                style={{
                  borderColor: categoryMeta.border,
                  background: categoryMeta.soft,
                  color: categoryMeta.color,
                  boxShadow: `0 0 22px ${categoryMeta.glow.replace('0.35', '0.14')}`,
                }}
              >
                {categoryIcons[group.title]}
              </div>
              <h3 className="relative z-[1] mt-6 font-display text-[1.9rem] font-semibold tracking-[-0.05em] text-white">
                {group.title}
              </h3>
              <p className="relative z-[1] mt-3 text-sm leading-7 text-[var(--secondary-muted)]">
                {group.summary}
              </p>

              <div className="relative z-[1] mt-6 flex flex-wrap gap-2.5">
                {group.items.map((item) => {
                  const techMeta = getCategoryMeta(getTechCategory(item));

                  return (
                    <span
                      key={item}
                      className="badge-pill text-[11px]"
                      style={{
                        '--badge-color': techMeta.color,
                        '--badge-bg': techMeta.soft,
                        '--badge-border': techMeta.border,
                        '--badge-glow': techMeta.glow,
                      }}
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
