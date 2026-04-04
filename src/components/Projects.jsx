import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

export default function Projects({
  projects,
  status = 'success',
  title = 'Selected work, presented like products.',
  showArchiveLink = true,
}) {
  return (
    <section id="projects" className="site-shell scroll-mt-28 pb-20">
      <motion.div
        className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-3xl">
          <span className="eyebrow">Projects</span>
          <h2 className="section-title mt-5">{title}</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--secondary-muted)]">
            A tighter look at the projects that best represent the portfolio right now: ambitious
            tooling, product-minded interfaces, and systems built to feel polished beyond a single
            demo screen.
          </p>
        </div>

        {showArchiveLink ? (
          <Link to="/projects" className="button-secondary min-w-[160px]">
            Open full archive
          </Link>
        ) : null}
      </motion.div>

      {status === 'loading' ? (
        <div className="projects-container">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="surface-panel rounded-[28px] p-6">
              <div className="loading-bar h-6 w-36 rounded-full" />
              <div className="loading-bar mt-6 h-8 w-2/3 rounded-full" />
              <div className="loading-bar mt-5 h-4 w-full rounded-full" />
              <div className="loading-bar mt-3 h-4 w-11/12 rounded-full" />
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="loading-bar h-12 rounded-2xl" />
                <div className="loading-bar h-12 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="projects-container">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
