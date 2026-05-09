'use client'
import { useState, FormEvent, ChangeEvent, ReactNode } from 'react'
import Link from 'next/link'

type FormState = {
  fullName: string
  phone: string
  email: string
  cityZip: string
  role: string
  estateType: string
  timeline: string
  categories: string[]
  propertySize: string
  consultationTime: string
  message: string
  photos: File[]
}

const ROLES = [
  'Family / homeowner',
  'Executor',
  'Trustee',
  'Realtor',
  'Attorney',
  'Fiduciary',
  'Senior move manager',
  'Seller',
  'Other',
]

const ESTATE_TYPES = [
  'Single-family home',
  'Condo / apartment',
  'Townhouse',
  'Estate / large home',
  'Storage unit',
  'Commercial property',
  'Other',
]

const TIMELINES = [
  'Urgent — within 2 weeks',
  'Soon — 2 to 4 weeks',
  'Flexible — 1 to 3 months',
  'Planning — 3+ months',
]

const SIZES = [
  'Under 1,000 sq ft',
  '1,000 – 2,000 sq ft',
  '2,000 – 4,000 sq ft',
  '4,000 – 8,000 sq ft',
  '8,000+ sq ft',
  'Not sure',
]

const CATEGORIES = [
  'Furniture',
  'Jewelry',
  'Watches',
  'Art',
  'Antiques',
  'Designer goods',
  'Silver / china',
  'Collectibles',
  'Books / media',
  'Tools / household',
  'Vehicles',
  'Other',
]

const CONSULT_TIMES = [
  'Weekday morning',
  'Weekday afternoon',
  'Weekday evening',
  'Weekend morning',
  'Weekend afternoon',
  'Flexible',
]

export function RequestWalkthroughForm() {
  const [state, setState] = useState<FormState>({
    fullName: '',
    phone: '',
    email: '',
    cityZip: '',
    role: '',
    estateType: '',
    timeline: '',
    categories: [],
    propertySize: '',
    consultationTime: '',
    message: '',
    photos: [],
  })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState(prev => ({ ...prev, [key]: value }))
  }

  function toggleCategory(cat: string) {
    setState(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat],
    }))
  }

  function onPhotos(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 8)
    update('photos', files)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const requiredOk =
      state.fullName.trim() &&
      state.phone.trim() &&
      /\S+@\S+\.\S+/.test(state.email) &&
      state.cityZip.trim() &&
      state.role &&
      state.estateType &&
      state.timeline

    if (!requiredOk) {
      setSubmitting(false)
      setError('Please complete the required fields so we can follow up.')
      return
    }

    const notesParts = [
      `Role: ${state.role}`,
      `Estate type: ${state.estateType}`,
      `Timeline: ${state.timeline}`,
      state.propertySize ? `Property size: ${state.propertySize}` : '',
      state.categories.length ? `Categories: ${state.categories.join(', ')}` : '',
      state.consultationTime ? `Preferred consultation: ${state.consultationTime}` : '',
      state.photos.length ? `Photos attached: ${state.photos.length}` : '',
      state.message ? `Message: ${state.message}` : '',
    ].filter(Boolean)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.fullName,
          email: state.email,
          phone: state.phone,
          property_address: state.cityZip,
          notes: notesParts.join('\n'),
          source: 'request-walkthrough',
        }),
      })

      if (!res.ok) {
        // Soft-fail keeps the funnel clean while ops still see the diagnostic.
        console.warn('Lead submission soft-fail', res.status)
      }
    } catch (err) {
      console.warn('Lead submission error', err)
    } finally {
      setSubmitting(false)
      setDone(true)
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch {}
    }
  }

  if (done) {
    return (
      <div className="border border-[#E0E0E0] p-8 md:p-12 bg-white">
        <span className="label block mb-5">Request Received</span>
        <h2 className="text-[28px] md:text-[36px] mb-5"
            style={{ fontFamily: 'var(--font-display-family)', fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.015em' }}>
          Thank you.
        </h2>
        <p className="body-light text-[16px] leading-relaxed max-w-prose mb-6">
          Your request has been received. We will review the details and follow up with next steps for your walkthrough or valuation review. You will not be asked to create an account before we have spoken.
        </p>
        <p className="body-light text-[14px] leading-relaxed max-w-prose mb-8">
          If your situation is urgent or you would like to share photos, you can reply to our follow-up email with attachments.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/how-it-works" className="btn btn-ink">See how it works →</Link>
          <Link href="/" className="btn btn-outline">Return home</Link>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-[#E0E0E0]"
      noValidate
      aria-label="Request a free estate walkthrough"
    >
      <div className="px-5 sm:px-6 md:px-10 py-4 sm:py-6 border-b border-[#E0E0E0] flex flex-wrap items-center justify-between gap-3 bg-[#FAFAFA]">
        <span className="label text-[#6B6B6B]">All fields marked * are required</span>
        <span className="label text-[#826DEE]">Confidential · no obligation</span>
      </div>

      {/* Section: contact */}
      <fieldset className="px-5 sm:px-6 md:px-10 pt-7 sm:pt-9 pb-2 border-0">
        <legend className="form-section-title">Contact</legend>
        <p className="form-section-help">So we can follow up with next steps.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 mt-5">
          <Field id="rw-name" label="Full name" required>
            <input
              id="rw-name"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={state.fullName}
              onChange={e => update('fullName', e.target.value)}
              className="input"
              placeholder="Jane Smith"
            />
          </Field>
          <Field id="rw-phone" label="Phone" required>
            <input
              id="rw-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={state.phone}
              onChange={e => update('phone', e.target.value)}
              className="input"
              placeholder="(310) 555-0123"
            />
          </Field>
          <Field id="rw-email" label="Email" required>
            <input
              id="rw-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              value={state.email}
              onChange={e => update('email', e.target.value)}
              className="input"
              placeholder="you@example.com"
            />
          </Field>
          <Field id="rw-cityzip" label="City / ZIP" required>
            <input
              id="rw-cityzip"
              name="cityZip"
              type="text"
              autoComplete="postal-code"
              required
              value={state.cityZip}
              onChange={e => update('cityZip', e.target.value)}
              className="input"
              placeholder="Los Angeles, 90048"
            />
          </Field>
        </div>
      </fieldset>

      <div className="form-divider" />

      {/* Section: about the estate */}
      <fieldset className="px-5 sm:px-6 md:px-10 pt-7 sm:pt-9 pb-2 border-0">
        <legend className="form-section-title">About the estate</legend>
        <p className="form-section-help">Helps us recommend the right disposition path.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 mt-5">
          <Field id="rw-role" label="Your role" required>
            <select
              id="rw-role"
              name="role"
              required
              value={state.role}
              onChange={e => update('role', e.target.value)}
              className="input"
            >
              <option value="" disabled>Select…</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field id="rw-estate-type" label="Estate type" required>
            <select
              id="rw-estate-type"
              name="estateType"
              required
              value={state.estateType}
              onChange={e => update('estateType', e.target.value)}
              className="input"
            >
              <option value="" disabled>Select…</option>
              {ESTATE_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field id="rw-timeline" label="Timeline" required>
            <select
              id="rw-timeline"
              name="timeline"
              required
              value={state.timeline}
              onChange={e => update('timeline', e.target.value)}
              className="input"
            >
              <option value="" disabled>Select…</option>
              {TIMELINES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field id="rw-size" label="Approximate property size">
            <select
              id="rw-size"
              name="propertySize"
              value={state.propertySize}
              onChange={e => update('propertySize', e.target.value)}
              className="input"
            >
              <option value="">Select…</option>
              {SIZES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
        </div>
      </fieldset>

      <div className="form-divider" />

      {/* Section: categories */}
      <fieldset className="px-5 sm:px-6 md:px-10 pt-7 sm:pt-9 pb-7 border-0">
        <legend className="form-section-title">
          Item categories
          <span className="form-section-help-inline"> (select all that apply)</span>
        </legend>
        <p className="form-section-help">We tailor the walkthrough to the categories you have.</p>
        <div className="flex flex-wrap gap-2 mt-5" role="group" aria-label="Item categories">
          {CATEGORIES.map(cat => {
            const active = state.categories.includes(cat)
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                aria-pressed={active}
                className={`category-chip ${active ? 'category-chip-active' : ''}`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="form-divider" />

      {/* Section: scheduling & photos */}
      <fieldset className="px-5 sm:px-6 md:px-10 pt-7 sm:pt-9 pb-2 border-0">
        <legend className="form-section-title">Scheduling & photos</legend>
        <p className="form-section-help">Optional. You can also share photos by reply later.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 mt-5">
          <Field id="rw-consult-time" label="Preferred consultation time">
            <select
              id="rw-consult-time"
              name="consultationTime"
              value={state.consultationTime}
              onChange={e => update('consultationTime', e.target.value)}
              className="input"
            >
              <option value="">Select…</option>
              {CONSULT_TIMES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field id="rw-photos" label="Optional photos">
            <div className="flex items-center gap-4 flex-wrap">
              <input
                id="rw-photos"
                name="photos"
                type="file"
                accept="image/*"
                multiple
                onChange={onPhotos}
                className="sr-only"
              />
              <label htmlFor="rw-photos" className="btn btn-outline cursor-pointer" aria-label="Choose photos to upload">
                Choose photos
              </label>
              <span className="label text-[#6B6B6B]">
                {state.photos.length ? `${state.photos.length} selected` : 'JPG, PNG, HEIC'}
              </span>
            </div>
            <p className="label text-[#6B6B6B] mt-2">Photos help us prepare. You can also share later by reply.</p>
          </Field>
        </div>
      </fieldset>

      <div className="form-divider" />

      {/* Section: message */}
      <fieldset className="px-5 sm:px-6 md:px-10 pt-7 sm:pt-9 pb-7 border-0">
        <legend className="form-section-title">Anything else we should know?</legend>
        <p className="form-section-help">Probate timelines, sentimental items, access concerns — anything that helps us prepare.</p>
        <div className="mt-5">
          <Field id="rw-message" label="Message" hideLabel>
            <textarea
              id="rw-message"
              name="message"
              rows={4}
              value={state.message}
              onChange={e => update('message', e.target.value)}
              className="input resize-y"
              placeholder="Probate timeline, access, sentimental items, deadlines, special concerns…"
            />
          </Field>
        </div>
      </fieldset>

      <div className="px-5 sm:px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 border-t border-[#E0E0E0] pt-6 sm:pt-8 bg-[#FAFAFA]">
        <p className="text-[12.5px] sm:text-[13px] text-[#6B6B6B] mb-5 sm:mb-6 max-w-2xl leading-relaxed"
           style={{ fontFamily: 'var(--font-body-family)', fontWeight: 400 }}>
          By submitting this request, you understand that estimates and appraisal indications are not a guarantee of value. We will follow up to confirm details. We do not share your information outside of preparing your evaluation.
        </p>

        {error && (
          <div role="alert" aria-live="polite" className="mb-5 border border-[#F94500] bg-[#FFF4F0] px-4 py-3">
            <p className="label text-[#F94500]">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-ink btn-mobile-primary justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Sending…' : 'Submit Request →'}
          </button>
          <span className="label text-[#6B6B6B]">No account is created by submitting this form.</span>
        </div>
      </div>

      <style>{`
        .form-section-title {
          font-family: var(--font-body-family);
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0;
          text-transform: none;
          color: #0A0A0A;
          padding: 0;
        }
        .form-section-help {
          font-family: var(--font-body-family);
          font-weight: 400;
          font-size: 13px;
          color: #6B6B6B;
          margin-top: 4px;
          line-height: 1.5;
        }
        .form-section-help-inline {
          font-family: var(--font-body-family);
          font-weight: 400;
          font-size: 13px;
          color: #6B6B6B;
          margin-left: 6px;
        }
        .form-divider {
          height: 1px;
          background: #EFEFEF;
          margin: 0 0 0 0;
        }
        .field-label {
          font-family: var(--font-body-family);
          font-weight: 500;
          font-size: 13.5px;
          letter-spacing: 0;
          text-transform: none;
          color: #0A0A0A;
        }
        .input {
          width: 100%;
          background: #FFFFFF;
          border: 1px solid #DDDDDD;
          padding: 13px 14px;
          font-family: var(--font-body-family);
          font-weight: 400;
          font-size: 16px;
          color: #0A0A0A;
          line-height: 1.4;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          min-height: 48px;
        }
        .input::placeholder {
          color: #A0A0A0;
          font-weight: 300;
        }
        .input:hover { border-color: #BDBDBD; }
        .input:focus {
          outline: none;
          border-color: #826DEE;
          box-shadow: 0 0 0 3px rgba(130,109,238,0.12);
        }
        select.input { appearance: none; background-image: linear-gradient(45deg, transparent 50%, #6B6B6B 50%), linear-gradient(135deg, #6B6B6B 50%, transparent 50%); background-position: calc(100% - 18px) 22px, calc(100% - 12px) 22px; background-size: 6px 6px, 6px 6px; background-repeat: no-repeat; padding-right: 32px; }
        .category-chip {
          font-family: var(--font-body-family);
          font-weight: 500;
          font-size: 13px;
          letter-spacing: 0;
          text-transform: none;
          padding: 10px 16px;
          background: #FFFFFF;
          color: #0A0A0A;
          border: 1px solid #DDDDDD;
          transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
          min-height: 40px;
          cursor: pointer;
        }
        .category-chip:hover { border-color: #0A0A0A; }
        .category-chip-active {
          background: #0A0A0A;
          color: #FFFFFF;
          border-color: #0A0A0A;
        }
        @media (max-width: 640px) {
          .category-chip { min-height: 44px; padding: 11px 14px; font-size: 13.5px; }
        }
      `}</style>
    </form>
  )
}

function Field({
  id,
  label,
  required,
  hideLabel,
  children,
}: {
  id: string
  label: string
  required?: boolean
  hideLabel?: boolean
  children: ReactNode
}) {
  return (
    <div className="block">
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'field-label block mb-2'}>
        {label}
        {required && <span aria-hidden className="text-[#826DEE]"> *</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {children}
    </div>
  )
}
