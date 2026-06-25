'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './Contact.module.css';

/* ── Quote form config ── */
const PROJECT_TYPES = [
  'Residential Installation',
  'Commercial Fit-Out',
  'Renovation / Repair',
  'Acoustic Partitions',
  'Fire-Rated Systems',
  'Feature Walls',
  'Other',
];

const BUDGET_RANGES = [
  'Under $5,000',
  '$5,000 – $15,000',
  '$15,000 – $50,000',
  '$50,000 – $150,000',
  '$150,000+',
  'Not sure yet',
];

/* ── Career form config ── */
const ROLES = [
  'Drywall Installer',
  'Taper / Finisher',
  'Steel-Stud Framer',
  'Labourer',
  'Project Supervisor',
  'Other',
];

const AVAILABILITY = [
  'Immediately',
  'Within 2 weeks',
  'Within a month',
  'Just exploring',
];

/* ══ Quote form ══ */
interface QuoteForm {
  name: string; email: string; phone: string;
  projectType: string; budget: string; message: string;
}
interface QuoteErrors {
  name?: string; email?: string; projectType?: string; message?: string;
}
const QUOTE_EMPTY: QuoteForm = {
  name: '', email: '', phone: '', projectType: '', budget: '', message: '',
};
function validateQuote(f: QuoteForm): QuoteErrors {
  const e: QuoteErrors = {};
  if (!f.name.trim())    e.name = 'Name is required';
  if (!f.email.trim())   e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email';
  if (!f.projectType)    e.projectType = 'Please select a project type';
  if (!f.message.trim()) e.message = 'Message is required';
  else if (f.message.trim().length < 20) e.message = 'Please add a bit more detail';
  return e;
}

function QuoteForm() {
  const [form,    setForm]    = useState<QuoteForm>(QUOTE_EMPTY);
  const [errors,  setErrors]  = useState<QuoteErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof QuoteForm, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  const set = (field: keyof QuoteForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const val = e.target.value;
      setForm(prev => ({ ...prev, [field]: val }));
      if (touched[field]) {
        const errs = validateQuote({ ...form, [field]: val });
        setErrors(prev => ({ ...prev, [field]: errs[field as keyof QuoteErrors] }));
      }
    };

  const blur = (field: keyof QuoteForm) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const errs = validateQuote(form);
    setErrors(prev => ({ ...prev, [field]: errs[field as keyof QuoteErrors] }));
  };

  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const allTouched = Object.fromEntries(Object.keys(form).map(k => [k, true])) as Partial<Record<keyof QuoteForm, boolean>>;
    setTouched(allTouched);
    const errs = validateQuote(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/contact/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setSuccess(true);
      setForm(QUOTE_EMPTY);
      setTouched({});
      setErrors({});
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
        <h3 className={styles.successTitle}>Quote Request Sent!</h3>
        <p className={styles.successText}>
          Thanks for reaching out. We'll review your project details and get back
          to you within one business day with a free estimate.
        </p>
        <button className={styles.successReset} onClick={() => { setSuccess(false); setSubmitError(null); }}>
          Send Another Request
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate aria-label="Get a Quote form">

      {submitError && (
        <div className={styles.errorMsg} style={{ marginBottom: '16px', textAlign: 'center' }} role="alert" aria-live="assertive">
          {submitError}
        </div>
      )}

      {/* Row 1: Name + Email */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="q-name">
            Full Name <span className={styles.required}>*</span>
          </label>
          <input id="q-name" type="text"
            className={`${styles.input} ${errors.name && touched.name ? styles.inputError : ''}`}
            placeholder="John Smith" value={form.name}
            onChange={set('name')} onBlur={blur('name')} autoComplete="name" />
          {errors.name && touched.name && <span className={styles.errorMsg}>{errors.name}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="q-email">
            Email Address <span className={styles.required}>*</span>
          </label>
          <input id="q-email" type="email"
            className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
            placeholder="john@example.com" value={form.email}
            onChange={set('email')} onBlur={blur('email')} autoComplete="email" />
          {errors.email && touched.email && <span className={styles.errorMsg}>{errors.email}</span>}
        </div>
      </div>

      {/* Row 2: Phone + Project Type */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="q-phone">Phone Number</label>
          <input id="q-phone" type="tel"
            className={styles.input} placeholder="+1 (416) 000-0000"
            value={form.phone} onChange={set('phone')} onBlur={blur('phone')} autoComplete="tel" />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="q-projectType">
            Project Type <span className={styles.required}>*</span>
          </label>
          <div className={styles.selectWrap}>
            <select id="q-projectType"
              className={`${styles.select} ${errors.projectType && touched.projectType ? styles.inputError : ''}`}
              value={form.projectType} onChange={set('projectType')} onBlur={blur('projectType')}>
              <option value="" disabled hidden>Select a type…</option>
              {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <svg className={styles.selectChevron} width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          {errors.projectType && touched.projectType && <span className={styles.errorMsg}>{errors.projectType}</span>}
        </div>
      </div>

      {/* Row 3: Budget */}
      <div className={styles.fieldFull}>
        <label className={styles.label}>Budget Range</label>
        <div className={styles.budgetGrid}>
          {BUDGET_RANGES.map(b => (
            <button key={b} type="button"
              className={`${styles.budgetChip} ${form.budget === b ? styles.budgetChipActive : ''}`}
              onClick={() => setForm(prev => ({ ...prev, budget: b }))}>
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Row 4: Message */}
      <div className={styles.fieldFull}>
        <label className={styles.label} htmlFor="q-message">
          Project Details <span className={styles.required}>*</span>
        </label>
        <textarea id="q-message" rows={5}
          className={`${styles.textarea} ${errors.message && touched.message ? styles.inputError : ''}`}
          placeholder="Tell us about your project — scope, timeline, any special requirements…"
          value={form.message} onChange={set('message')} onBlur={blur('message')} />
        {errors.message && touched.message && <span className={styles.errorMsg}>{errors.message}</span>}
      </div>

      <button type="submit"
        className={`${styles.submitBtn} ${loading ? styles.submitLoading : ''}`}
        disabled={loading}>
        {loading ? (
          <><span className={styles.spinner} />Sending…</>
        ) : (
          <>
            Get My Free Quote
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

/* ══ Career form ══ */
interface CareerForm {
  name: string; email: string; phone: string;
  role: string; experience: string; availability: string; message: string;
}
interface CareerErrors {
  name?: string; email?: string; role?: string; message?: string;
}
const CAREER_EMPTY: CareerForm = {
  name: '', email: '', phone: '', role: '', experience: '', availability: '', message: '',
};
function validateCareer(f: CareerForm): CareerErrors {
  const e: CareerErrors = {};
  if (!f.name.trim())    e.name = 'Name is required';
  if (!f.email.trim())   e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email';
  if (!f.role)           e.role = 'Please select a role';
  if (!f.message.trim()) e.message = 'Tell us a bit about yourself';
  else if (f.message.trim().length < 20) e.message = 'Please add a bit more detail';
  return e;
}

function CareerForm() {
  const [form,    setForm]    = useState<CareerForm>(CAREER_EMPTY);
  const [errors,  setErrors]  = useState<CareerErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CareerForm, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const set = (field: keyof CareerForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const val = e.target.value;
      setForm(prev => ({ ...prev, [field]: val }));
      if (touched[field]) {
        const errs = validateCareer({ ...form, [field]: val });
        setErrors(prev => ({ ...prev, [field]: errs[field as keyof CareerErrors] }));
      }
    };

  const blur = (field: keyof CareerForm) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const errs = validateCareer(form);
    setErrors(prev => ({ ...prev, [field]: errs[field as keyof CareerErrors] }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const allTouched = Object.fromEntries(Object.keys(form).map(k => [k, true])) as Partial<Record<keyof CareerForm, boolean>>;
    setTouched(allTouched);
    const errs = validateCareer(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/contact/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setSuccess(true);
      setForm(CAREER_EMPTY);
      setTouched({});
      setErrors({});
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
        <h3 className={styles.successTitle}>Application Sent!</h3>
        <p className={styles.successText}>
          Thanks for your interest in joining the team. We'll review your application
          and be in touch if there's a good fit.
        </p>
        <button className={styles.successReset} onClick={() => { setSuccess(false); setSubmitError(null); }}>
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate aria-label="Job application form">

      {submitError && (
        <div className={styles.errorMsg} style={{ marginBottom: '16px', textAlign: 'center' }} role="alert" aria-live="assertive">
          {submitError}
        </div>
      )}

      {/* Row 1: Name + Email */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="c-name">
            Full Name <span className={styles.required}>*</span>
          </label>
          <input id="c-name" type="text"
            className={`${styles.input} ${errors.name && touched.name ? styles.inputError : ''}`}
            placeholder="John Smith" value={form.name}
            onChange={set('name')} onBlur={blur('name')} autoComplete="name" />
          {errors.name && touched.name && <span className={styles.errorMsg}>{errors.name}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="c-email">
            Email Address <span className={styles.required}>*</span>
          </label>
          <input id="c-email" type="email"
            className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
            placeholder="john@example.com" value={form.email}
            onChange={set('email')} onBlur={blur('email')} autoComplete="email" />
          {errors.email && touched.email && <span className={styles.errorMsg}>{errors.email}</span>}
        </div>
      </div>

      {/* Row 2: Phone + Role */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="c-phone">Phone Number</label>
          <input id="c-phone" type="tel"
            className={styles.input} placeholder="+1 (416) 000-0000"
            value={form.phone} onChange={set('phone')} onBlur={blur('phone')} autoComplete="tel" />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="c-role">
            Role Applying For <span className={styles.required}>*</span>
          </label>
          <div className={styles.selectWrap}>
            <select id="c-role"
              className={`${styles.select} ${errors.role && touched.role ? styles.inputError : ''}`}
              value={form.role} onChange={set('role')} onBlur={blur('role')}>
              <option value="" disabled hidden>Select a role…</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <svg className={styles.selectChevron} width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          {errors.role && touched.role && <span className={styles.errorMsg}>{errors.role}</span>}
        </div>
      </div>

      {/* Row 3: Years of experience */}
      <div className={styles.fieldFull}>
        <label className={styles.label} htmlFor="c-experience">Years of Experience</label>
        <input id="c-experience" type="text"
          className={styles.input}
          placeholder="e.g. 3 years installing drywall in commercial fit-outs"
          value={form.experience} onChange={set('experience')} />
      </div>

      {/* Row 4: Availability chips */}
      <div className={styles.fieldFull}>
        <label className={styles.label}>Availability</label>
        <div className={styles.availGrid}>
          {AVAILABILITY.map(a => (
            <button key={a} type="button"
              className={`${styles.budgetChip} ${form.availability === a ? styles.budgetChipActive : ''}`}
              onClick={() => setForm(prev => ({ ...prev, availability: a }))}>
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Row 5: Cover note */}
      <div className={styles.fieldFull}>
        <label className={styles.label} htmlFor="c-message">
          Tell Us About Yourself <span className={styles.required}>*</span>
        </label>
        <textarea id="c-message" rows={5}
          className={`${styles.textarea} ${errors.message && touched.message ? styles.inputError : ''}`}
          placeholder="Describe your experience, the type of work you've done, and why you'd like to join New Canadian Drywall…"
          value={form.message} onChange={set('message')} onBlur={blur('message')} />
        {errors.message && touched.message && <span className={styles.errorMsg}>{errors.message}</span>}
      </div>

      <button type="submit"
        className={`${styles.submitBtn} ${loading ? styles.submitLoading : ''}`}
        disabled={loading}>
        {loading ? (
          <><span className={styles.spinner} />Sending…</>
        ) : (
          <>
            Submit Application
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

import ReviewForm from '@/component/ReviewForm';

/* ══ Main section ══ */
type Tab = 'quote' | 'career' | 'review';

const TAB_CONFIG = {
  quote: {
    heading: <>Start Your <em style={{ fontStyle: 'italic', color: '#c9973a' }}>Project</em> Today</>,
    sub: "Fill in the form and we'll get back to you within one business day with a free, no-obligation quote.",
  },
  career: {
    heading: <>Join Our <em style={{ fontStyle: 'italic', color: '#c9973a' }}>Team</em></>,
    sub: "We're always looking for skilled tradespeople. Send us your details and we'll be in touch.",
  },
  review: {
    heading: <>Share Your <em style={{ fontStyle: 'italic', color: '#c9973a' }}>Experience</em></>,
    sub: "We'd love to hear about your experience working with us. Your feedback helps us improve and serves as a reference for future clients.",
  },
};

export default function Contact() {
  const sectionRef            = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [tab, setTab]         = useState<Tab>('quote');

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cfg = TAB_CONFIG[tab];

  return (
    <section ref={sectionRef}
      className={`${styles.contact} ${visible ? styles.visible : ''}`}
      id="contact">

      {/* ── Section header — updates with tab ── */}
      <div className={styles.header}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          Get In Touch
        </p>
        <h2 className={styles.heading}>{cfg.heading}</h2>
        <p className={styles.sub}>{cfg.sub}</p>
      </div>

      <div className={styles.dividerWrap}><div className={styles.divider} aria-hidden="true" /></div>

      {/* ── Two-column body ── */}
      <div className={styles.body}>

        {/* ════ LEFT — Tab + Form ════ */}
        <div className={styles.formWrap}>

          {/* Tab switcher */}
          <div className={styles.tabBar} role="tablist">
            <button
              role="tab"
              aria-selected={tab === 'quote'}
              className={`${styles.tab} ${tab === 'quote' ? styles.tabActive : ''}`}
              onClick={() => setTab('quote')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              Get a Quote
            </button>
            <button
              role="tab"
              aria-selected={tab === 'career'}
              className={`${styles.tab} ${tab === 'career' ? styles.tabActive : ''}`}
              onClick={() => setTab('career')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                <line x1="12" y1="12" x2="12" y2="16"/>
                <line x1="10" y1="14" x2="14" y2="14"/>
              </svg>
              Join Our Team
            </button>
            <button
              role="tab"
              aria-selected={tab === 'review'}
              className={`${styles.tab} ${tab === 'review' ? styles.tabActive : ''}`}
              onClick={() => setTab('review')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20l-7-7a5 5 0 0 1 7-7 5 5 0 0 1 7 7l-7 7z"/>
                <circle cx="12" cy="11" r="1.5" fill="currentColor"/>
              </svg>
              Leave a Review
            </button>
          </div>

          {/* Render the active form — key forces remount/reset on tab switch */}
          {tab === 'quote'
            ? <QuoteForm key="quote" />
            : tab === 'career'
              ? <CareerForm key="career" />
              : <ReviewForm key="review" />
          }
        </div>

        {/* ════ RIGHT — Contact details ════ */}
        <div className={styles.details}>
          <div className={styles.infoCard}>
            <div className={styles.infoCardGlow} aria-hidden="true" />

            <h3 className={styles.infoTitle}>Contact Information</h3>
            <p className={styles.infoSub}>
              Prefer to talk? Reach us directly — we're available Monday to
              Friday, 7am – 6pm.
            </p>

            <div className={styles.infoList}>
              {[
                {
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16.92z"/></svg>,
                  label: 'Phone', value: '+1 (416) 452-2181', href: 'tel:+14164522181',
                },
                {
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
                  label: 'Email', value: 'info@newcanadiandrywall.ca', href: 'mailto:info@newcanadiandrywall.ca',
                },
                {
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                  label: 'Service Area', value: 'Greater Toronto Area, Ontario', href: null,
                },
                {
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                  label: 'Hours', value: 'Mon – Fri, 7:00am – 6:00pm', href: null,
                },
              ].map(({ icon, label, value, href }) => (
                <div key={label} className={styles.infoRow}>
                  <span className={styles.infoIcon}>{icon}</span>
                  <div className={styles.infoMeta}>
                    <span className={styles.infoLabel}>{label}</span>
                    {href
                      ? <a href={href} className={styles.infoValue}>{value}</a>
                      : <span className={styles.infoValue}>{value}</span>
                    }
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.infoDivider} />

            <div className={styles.trustGrid}>
              {[
                'Licensed & Insured',
                'Free Estimates',
                '5-Year Warranty',
                'Same-Day Response',
              ].map(text => (
                <div key={text} className={styles.trustItem}>
                  <span className={styles.trustIcon}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c9973a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className={styles.trustText}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}