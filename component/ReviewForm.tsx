'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './ReviewForm.module.css';

interface ReviewForm {
  name: string; quote: string;
}
interface ReviewErrors {
  name?: string; quote?: string;
}
const REVIEW_EMPTY: ReviewForm = { name: '', quote: '' };

function validate(f: ReviewForm): ReviewErrors {
  const e: ReviewErrors = {};
  if (!f.name.trim())  e.name = 'Name is required';
  if (!f.quote.trim()) e.quote = 'Please write your review';
  else if (f.quote.trim().length < 10) e.quote = 'Please write at least a few more words';
  return e;
}

export default function ReviewForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form,    setForm]    = useState<ReviewForm>(REVIEW_EMPTY);
  const [errors,  setErrors]  = useState<ReviewErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ReviewForm, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const set = (field: keyof ReviewForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      setForm(prev => ({ ...prev, [field]: val }));
      if (touched[field]) {
        const errs = validate({ ...form, [field]: val });
        setErrors(prev => ({ ...prev, [field]: errs[field as keyof ReviewErrors] }));
      }
    };

  const blur = (field: keyof ReviewForm) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const errs = validate(form);
    setErrors(prev => ({ ...prev, [field]: errs[field as keyof ReviewErrors] }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const allTouched = Object.fromEntries(Object.keys(form).map(k => [k, true])) as Partial<Record<keyof ReviewForm, boolean>>;
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/contact/testimonial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setSuccess(true);
      setForm(REVIEW_EMPTY);
      setTouched({});
      setErrors({});
      onSuccess?.();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (statusRef.current) statusRef.current.focus();
  }, [success, submitError]);

  if (success) {
    return (
      <div className={styles.successBox} role="alert" aria-live="polite" tabIndex={-1} ref={statusRef}>
        <div className={styles.successIcon}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="#c9973a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className={styles.successTitle}>Review Submitted!</h3>
        <p className={styles.successText}>
          Thanks for your feedback! Your review will be visible on our website
          after a quick review by our team.
        </p>
        <button className={styles.successReset} onClick={() => { setSuccess(false); setSubmitError(null); }}>
          Leave Another Review
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate aria-label="Leave a review form">

      {submitError && (
        <div className={styles.errorMsg} style={{ marginBottom: '16px', textAlign: 'center' }} role="alert" aria-live="assertive">
          {submitError}
        </div>
      )}

      <div className={styles.fieldFull}>
        <label className={styles.label} htmlFor="r-name">
          Your Name <span className={styles.required}>*</span>
        </label>
        <input id="r-name" type="text"
          className={`${styles.input} ${errors.name && touched.name ? styles.inputError : ''}`}
          placeholder="Jane Doe" value={form.name}
          onChange={set('name')} onBlur={blur('name')} autoComplete="name" />
        {errors.name && touched.name && <span className={styles.errorMsg}>{errors.name}</span>}
      </div>

      <div className={styles.fieldFull}>
        <label className={styles.label} htmlFor="r-quote">
          Your Review <span className={styles.required}>*</span>
        </label>
        <textarea id="r-quote" rows={5}
          className={`${styles.textarea} ${errors.quote && touched.quote ? styles.inputError : ''}`}
          placeholder="Tell us about your experience working with New Canadian Drywall…"
          value={form.quote} onChange={set('quote')} onBlur={blur('quote')} />
        {errors.quote && touched.quote && <span className={styles.errorMsg}>{errors.quote}</span>}
      </div>

      <button type="submit"
        className={`${styles.submitBtn} ${loading ? styles.submitLoading : ''}`}
        disabled={loading}>
        {loading ? (
          <><span className={styles.spinner} />Sending…</>
        ) : (
          <>
            Submit Review
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
