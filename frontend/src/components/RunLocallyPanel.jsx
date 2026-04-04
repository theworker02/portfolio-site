export default function RunLocallyPanel({ project, compact = false }) {
  const { localSetup } = project;

  return (
    <section className="surface-panel rounded-[34px] p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <span className="eyebrow">Run Locally</span>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
            Launch the project on your own machine.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--secondary-muted)]">
            {localSetup.summary}
          </p>
        </div>

        {!compact ? (
          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-4 text-sm text-white/62">
            {localSetup.requirements.join(' • ')}
          </div>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
            Requirements
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {localSetup.requirements.map((item) => (
              <span key={item} className="badge-pill">
                {item}
              </span>
            ))}
          </div>

          {localSetup.notes?.length ? (
            <div className="mt-6 space-y-3">
              {localSetup.notes.map((note) => (
                <p key={note} className="text-sm leading-7 text-[var(--secondary-muted)]">
                  {note}
                </p>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-[28px] border border-white/8 bg-[rgba(6,8,12,0.78)] p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
            Commands
          </p>

          <div className="mt-4 space-y-3">
            {localSetup.commands.map((command, index) => (
              <div
                key={`${command}-${index}`}
                className="overflow-x-auto rounded-[20px] border border-white/8 bg-black/20 px-4 py-3"
              >
                <code className="text-sm text-white/84">{command}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
