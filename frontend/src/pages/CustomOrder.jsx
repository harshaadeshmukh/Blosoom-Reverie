import { useState, useEffect, useRef } from 'react';
import DatePicker from '../components/DatePicker';

const OCCASIONS = [
  'Birthday', 'Anniversary', 'Graduation', 'Friendship', 'Proposal',
  'Valentine\'s Day', 'Just Because', 'Other'
];

const BUDGET_RANGES = [
  '₹500 – ₹999',
  '₹1,000 – ₹1,999',
  '₹2,000 – ₹3,499',
  '₹3,500+',
];

import { COLLECTIONS as DATA_COLLECTIONS } from '../data/collections';

const COLLECTIONS = [
  { id: '', label: 'Select a collection (optional)' },
  ...DATA_COLLECTIONS.map(c => ({ id: c.slug, label: c.name })),
  { id: 'signature', label: 'The Signature (Fully Custom)' },
];

/* ─── Petals config ──────────────────────────────────────────────────── */
const PETALS = [
  { emoji: '🌸', x: -55, delay: 0,    dur: 1.8, size: 18 },
  { emoji: '✉️', x:  20, delay: 0.15, dur: 2.1, size: 22 },
  { emoji: '🌸', x:  60, delay: 0.3,  dur: 1.6, size: 14 },
  { emoji: '💌', x: -30, delay: 0.45, dur: 2.3, size: 20 },
  { emoji: '🌸', x:  45, delay: 0.1,  dur: 1.9, size: 16 },
  { emoji: '✨', x: -70, delay: 0.6,  dur: 2.0, size: 16 },
  { emoji: '🌸', x:  80, delay: 0.25, dur: 1.7, size: 12 },
  { emoji: '✨', x: -10, delay: 0.5,  dur: 2.2, size: 14 },
];

/* ─── Animated success screen ────────────────────────────────────────── */
function SuccessScreen({ onReset }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0 80px', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes floatUp {
          0%   { opacity: 0; transform: translateY(0)   scale(.6) rotate(0deg);   }
          20%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(-160px) scale(1.1) rotate(25deg); }
        }
        @keyframes envelopeIn {
          0%   { opacity: 0; transform: translateY(30px) scale(.8); }
          60%  { transform: translateY(-6px) scale(1.04); }
          100% { opacity: 1; transform: translateY(0)  scale(1); }
        }
        @keyframes flapOpen {
          0%   { d: path("M 0 0 L 80 40 L 160 0"); }
          100% { d: path("M 0 0 L 80 -36 L 160 0"); }
        }
        @keyframes letterRise {
          0%   { transform: translateY(18px); opacity: 0; }
          100% { transform: translateY(-22px); opacity: 1; }
        }
        @keyframes checkDraw {
          0%   { stroke-dashoffset: 60; opacity: 0; }
          30%  { opacity: 1; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes ssTextIn {
          0%   { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes ssRingPulse {
          0%, 100% { transform: scale(1);   opacity: .18; }
          50%       { transform: scale(1.18); opacity: .08; }
        }
        .ss-petal { position: absolute; bottom: 60%; left: 50%; animation: floatUp linear both; pointer-events: none; }
        .ss-env   { animation: envelopeIn .8s cubic-bezier(.16,1,.3,1) .1s both; }
        .ss-letter { animation: letterRise .6s cubic-bezier(.16,1,.3,1) .7s both; }
        .ss-check { stroke-dasharray: 60; animation: checkDraw .5s cubic-bezier(.16,1,.3,1) 1s both; }
        .ss-h1    { animation: ssTextIn .7s cubic-bezier(.16,1,.3,1) .9s both; }
        .ss-p     { animation: ssTextIn .7s cubic-bezier(.16,1,.3,1) 1.05s both; }
        .ss-btn   { animation: ssTextIn .7s cubic-bezier(.16,1,.3,1) 1.2s both; }
        .ss-ring  { animation: ssRingPulse 3s ease-in-out infinite; }
      `}</style>

      {/* Floating petals */}
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="ss-petal"
          style={{
            fontSize: p.size,
            marginLeft: p.x,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}

      {/* Pulse ring behind envelope */}
      <div className="ss-ring" style={{
        width: 120, height: 120, borderRadius: '50%',
        border: '1.5px solid #C4968A',
        margin: '0 auto 0',
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Envelope SVG */}
        <div className="ss-env">
          <svg width="72" height="56" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Envelope body */}
            <rect x="4" y="36" width="152" height="80" rx="8" fill="#F5EDE8" stroke="#C4968A" strokeWidth="3"/>
            {/* Bottom V fold lines */}
            <path d="M 4 116 L 80 72 L 156 116" stroke="#D0B8A8" strokeWidth="2"/>
            {/* Left fold */}
            <path d="M 4 36 L 80 72" stroke="#D0B8A8" strokeWidth="2"/>
            {/* Right fold */}
            <path d="M 156 36 L 80 72" stroke="#D0B8A8" strokeWidth="2"/>
            {/* Flap (open) */}
            <path d="M 4 36 L 80 -4 L 156 36" fill="#EDE5E0" stroke="#C4968A" strokeWidth="3" strokeLinejoin="round"/>
            {/* Letter peeking out */}
            <g className="ss-letter">
              <rect x="32" y="8" width="96" height="68" rx="4" fill="#FDFAF7" stroke="#D0B8A8" strokeWidth="2"/>
              <path d="M 46 28 h 68" stroke="#C4968A" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M 46 40 h 52" stroke="#D0B8A8" strokeWidth="2" strokeLinecap="round"/>
              <path d="M 46 52 h 40" stroke="#D0B8A8" strokeWidth="2" strokeLinecap="round"/>
            </g>
            {/* Checkmark on flap */}
            <polyline
              className="ss-check"
              points="60,18 76,34 104,6"
              stroke="#8C4A40"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Text */}
      <div className="ss-h1" style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontStyle: 'italic', color: '#2C1A1A', marginTop: 28, lineHeight: 1.2 }}>
        Order received.
      </div>

      <p className="ss-p" style={{ fontSize: 13, fontWeight: 300, color: '#7A6460', lineHeight: 1.9, marginTop: 14, marginBottom: 32, maxWidth: 360, marginInline: 'auto' }}>
        Thank you — we'll be in touch within <strong style={{ fontWeight: 500, color: '#8C4A40' }}>24 hours</strong> to discuss your bouquet and start
        bringing it to life. Check your inbox! 🌸
      </p>

      <div className="ss-btn">
        <button
          onClick={onReset}
          style={{
            background: '#2C1A1A', color: '#FDFAF7',
            fontSize: 10, letterSpacing: '2.5px', padding: '14px 32px',
            textTransform: 'uppercase', fontFamily: 'Inter, sans-serif',
            border: 'none', cursor: 'pointer', borderRadius: 4,
            transition: 'background .3s',
          }}
          onMouseEnter={(e) => (e.target.style.background = '#8C4A40')}
          onMouseLeave={(e) => (e.target.style.background = '#2C1A1A')}
        >
          Place Another Order
        </button>
      </div>
    </div>
  );
}

export default function CustomOrder() {
  const ref = useRef(null);
  const [form, setForm] = useState({
    name: '',
    contact: '',
    phone: '',
    collection_id: '',
    occasion: '',
    photo_count: '',
    message: '',
    preferred_date: '',
    budget_range: '',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    el.querySelectorAll('.reveal').forEach((r) => {
      observer.observe(r);
      if (r.getBoundingClientRect().top < window.innerHeight) r.classList.add('visible');
    });
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          photo_count: parseInt(form.photo_count, 10) || 1,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        const errMsg = Array.isArray(data.detail) ? JSON.stringify(data.detail) : data.detail;
        throw new Error(errMsg || 'Something went wrong');
      }
      setStatus('success');
      setForm({
        name: '', contact: '', phone: '', collection_id: '', occasion: '',
        photo_count: '', message: '', preferred_date: '', budget_range: '',
      });
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  const inputCls =
    'w-full border border-[#D0B8A8] bg-ivory px-4 py-3 text-[14px] text-charcoal rounded-md ' +
    'placeholder:text-text-muted focus:outline-none focus:border-charcoal focus:ring-1 focus:ring-charcoal transition-all duration-200';

  const labelCls = 'block text-[10px] tracking-[3px] font-bold text-charcoal-mid uppercase mb-2';

  return (
    <div ref={ref} className="bg-ivory min-h-screen pt-24">
      {/* Header */}
      <div className="bg-ivory-soft py-12 px-6 md:px-10 border-b border-border-soft">
        <div className="max-w-3xl mx-auto">
          <div className="reveal flex items-center gap-2.5 mb-4">
            <span className="w-5 h-px bg-rose inline-block" />
            <span className="text-[9px] tracking-[4px] text-rose uppercase">Custom Orders</span>
          </div>
          <h1 className="reveal font-playfair text-[32px] md:text-[48px] italic text-charcoal leading-[1.1]">
            Tell us your story.
          </h1>
          <p className="reveal delay-100 text-[13px] font-light text-text-muted leading-[1.9] mt-5 max-w-md">
            Fill in the details below and we will reach out within 24 hours to discuss your order and
            begin crafting something made only for them.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
        {status === 'success' ? (
          <SuccessScreen onReset={() => setStatus('idle')} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Row 1: Name + Email + Phone */}
            <div className="animate-fade-in grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className={labelCls}>Your Name</label>
                <input
                  id="order-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Priya Sharma"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Email Address</label>
                <input
                  id="order-contact"
                  type="email"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  required
                  placeholder="priya@example.com"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>WhatsApp / Mobile</label>
                <input
                  id="order-phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 9876543210"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Row 2: Collection + Occasion */}
            <div className="animate-fade-in grid sm:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Collection</label>
                <select
                  id="order-collection"
                  name="collection_id"
                  value={form.collection_id}
                  onChange={handleChange}
                  className={`${inputCls} cursor-pointer`}
                >
                  {COLLECTIONS.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Occasion</label>
                <select
                  id="order-occasion"
                  name="occasion"
                  value={form.occasion}
                  onChange={handleChange}
                  required
                  className={`${inputCls} cursor-pointer`}
                >
                  <option value="">Select an occasion</option>
                  {OCCASIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Photo count + Preferred date */}
            <div className="animate-fade-in grid sm:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>
                  Approximate Number of Photos
                  <span className="text-[11px] text-text-muted normal-case tracking-normal block mt-1 font-medium">
                    (You'll send photos via email after we connect)
                  </span>
                </label>
                <input
                  id="order-photo-count"
                  type="number"
                  name="photo_count"
                  value={form.photo_count}
                  onChange={handleChange}
                  required
                  min="1"
                  max="100"
                  placeholder="10"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Preferred Delivery Date</label>
                <DatePicker
                  id="order-date"
                  value={form.preferred_date}
                  onChange={(val) => setForm((prev) => ({ ...prev, preferred_date: val }))}
                  placeholder="Pick a delivery date"
                />
              </div>
            </div>

            {/* Row 4: Budget */}
            <div className="animate-fade-in">
              <label className={labelCls}>Budget Range</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BUDGET_RANGES.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, budget_range: b }))}
                    className={`border px-3 py-2.5 text-[10px] tracking-[1px] font-inter uppercase transition-all duration-200 rounded-md ${
                      form.budget_range === b
                        ? 'bg-charcoal text-ivory border-charcoal'
                        : 'border-[#D0B8A8] text-charcoal hover:border-charcoal font-medium'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 5: Message */}
            <div className="animate-fade-in">
              <label className={labelCls}>Special Notes / Message / Ideas</label>
              <textarea
                id="order-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us about the person, the photos you have in mind, any colours or themes you like..."
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Error */}
            {status === 'error' && (
              <div className="animate-fade-in text-[12px] text-[#8C4A40] border border-[#C4968A] px-4 py-3">
                {error || 'Something went wrong. Please try again.'}
              </div>
            )}

            {/* Submit */}
            <div className="animate-fade-in">
              <button
                id="order-submit"
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto bg-charcoal text-ivory text-[10px] tracking-[2.5px] px-10 py-4 uppercase rounded-md
                           font-inter transition-all duration-300 hover:bg-rose disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending...' : 'Submit Order'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
