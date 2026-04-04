import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { sendContactMessage } from '../api/contact';
import { SITE_CONFIG } from '../../config/site.ts';

export default function Contact({ profile }) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');

  const isSubmitDisabled = useMemo(
    () =>
      status === 'loading' ||
      !formState.name.trim() ||
      !formState.email.trim() ||
      !formState.message.trim(),
    [formState.email, formState.message, formState.name, status],
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback('');

    const payload = {
      name: formState.name.trim(),
      email: formState.email.trim(),
      message: formState.message.trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus('error');
      setFeedback('Complete all three fields before sending your message.');
      return;
    }

    try {
      setStatus('loading');
      await sendContactMessage(payload);
      setStatus('success');
      setFeedback('Message sent successfully. You can expect it to arrive in the portfolio inbox shortly.');
      setFormState({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      setStatus('error');
      setFeedback(error.message || 'Unable to send your message right now.');
    }
  }

  return (
    <section id="contact" className="site-shell scroll-mt-28 pb-20">
      <motion.div
        className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="surface-panel rounded-[36px] p-7 sm:p-8">
          <span className="eyebrow">Contact</span>
          <h2 className="section-title mt-5">Want to work together?</h2>
          <p className="mt-5 text-base leading-8 text-[var(--secondary-muted)]">
            Use the form to send a direct project inquiry, or jump straight to GitHub and the
            public repository archive if you want immediate context first.
          </p>

          <div className="mt-8 space-y-4">
            <a href={`mailto:${SITE_CONFIG.email}`} className="contact-link">
              {SITE_CONFIG.email}
            </a>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="contact-link"
            >
              GitHub profile
            </a>
            <a
              href={profile.repositoriesUrl}
              target="_blank"
              rel="noreferrer"
              className="contact-link"
            >
              Repository archive
            </a>
          </div>
        </div>

        <motion.form
          className="surface-panel rounded-[36px] p-7 sm:p-8"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="field-shell">
              <span className="field-label">Name</span>
              <input
                type="text"
                value={formState.name}
                onChange={(event) =>
                  setFormState((currentState) => ({ ...currentState, name: event.target.value }))
                }
                className="field-input"
                autoComplete="name"
                maxLength={120}
              />
            </label>

            <label className="field-shell">
              <span className="field-label">Email</span>
              <input
                type="email"
                value={formState.email}
                onChange={(event) =>
                  setFormState((currentState) => ({ ...currentState, email: event.target.value }))
                }
                className="field-input"
                autoComplete="email"
                maxLength={160}
              />
            </label>
          </div>

          <label className="field-shell mt-5">
            <span className="field-label">Message</span>
            <textarea
              value={formState.message}
              onChange={(event) =>
                setFormState((currentState) => ({ ...currentState, message: event.target.value }))
              }
              className="field-input min-h-[180px] resize-none"
              maxLength={4000}
            />
          </label>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" className="button-primary min-w-[160px]" disabled={isSubmitDisabled}>
              {status === 'loading' ? 'Sending...' : 'Send inquiry'}
            </button>
            <p className="text-sm leading-7 text-white/46">
              Messages are delivered directly to {SITE_CONFIG.email}.
            </p>
          </div>

          {feedback ? (
            <p
              className={`mt-4 text-sm leading-7 ${
                status === 'success' ? 'text-[var(--primary)]' : 'text-rose-300'
              }`}
            >
              {feedback}
            </p>
          ) : null}
        </motion.form>
      </motion.div>
    </section>
  );
}
