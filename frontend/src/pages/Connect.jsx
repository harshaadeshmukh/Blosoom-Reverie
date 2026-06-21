import { useState, useEffect, useRef } from 'react';
import ImageCropper from '../components/ImageCropper';

const STARS = [1, 2, 3, 4, 5];

export default function Connect() {
  const ref = useRef(null);
  // Review Form State
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 0, message: '' });
  const [reviewImage, setReviewImage] = useState(null);
  const [reviewPreview, setReviewPreview] = useState('');
  
  // Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);

  const [hoverRating, setHoverRating] = useState(0);
  const [reviewStatus, setReviewStatus] = useState('idle');
  const [reviewError, setReviewError] = useState('');

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

  // --- Handlers for Review ---
  const handleReviewChange = (e) =>
    setReviewForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleReviewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageToCrop(URL.createObjectURL(file));
      setCropperOpen(true);
      // Reset input value so the same file can trigger change again
      e.target.value = null;
    }
  };

  const handleCropComplete = (croppedBlob) => {
    // Generate a file from the blob to upload
    const croppedFile = new File([croppedBlob], "cropped-review.jpg", { type: "image/jpeg" });
    setReviewImage(croppedFile);
    setReviewPreview(URL.createObjectURL(croppedBlob));
    setCropperOpen(false);
    setImageToCrop(null);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating) {
      setReviewError('Please select a star rating.');
      setReviewStatus('error');
      return;
    }
    
    if (!reviewImage) {
      setReviewError('Please upload a photo of your beautiful bouquet.');
      setReviewStatus('error');
      return;
    }
    
    setReviewStatus('loading');
    setReviewError('');
    try {
      const formData = new FormData();
      formData.append('name', reviewForm.name);
      formData.append('rating', reviewForm.rating);
      formData.append('message', reviewForm.message);
      if (reviewImage) {
        formData.append('image', reviewImage);
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/reviews/`, {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("We are currently processing a high volume of requests. Please wait a moment before trying again.");
        }
        const data = await res.json();
        const errMsg = Array.isArray(data.detail) ? JSON.stringify(data.detail) : data.detail;
        throw new Error(errMsg || 'Something went wrong');
      }
      setReviewStatus('success');
      setReviewForm({ name: '', rating: 0, message: '' });
      setReviewImage(null);
      setReviewPreview('');
    } catch (err) {
      setReviewStatus('error');
      setReviewError(err.message);
    }
  };

  const inputCls =
    'w-full border border-[#D0B8A8] bg-ivory px-4 py-3 text-[14px] text-charcoal rounded-md ' +
    'placeholder:text-text-muted focus:outline-none focus:border-charcoal focus:ring-1 focus:ring-charcoal transition-all duration-200';
  const labelCls = 'block text-[10px] tracking-[3px] font-bold text-charcoal-mid uppercase mb-2';

  return (
    <div ref={ref} className="bg-ivory min-h-screen pt-24">
      {/* Header */}
      <div className="bg-ivory-soft py-16 px-6 md:px-10 border-b border-border-soft">
        <div className="max-w-4xl mx-auto text-center">
          <div className="reveal flex items-center justify-center gap-2.5 mb-4">
            <span className="w-5 h-px bg-rose inline-block" />
            <span className="text-[9px] tracking-[4px] text-rose uppercase">Reviews</span>
            <span className="w-5 h-px bg-rose inline-block" />
          </div>
          <h1 className="reveal font-playfair text-[32px] md:text-[56px] italic text-charcoal leading-[1.1]">
            Share your experience.
          </h1>
          <p className="reveal delay-100 text-[13px] font-light text-text-muted leading-[1.9] mt-5 max-w-md mx-auto">
            We'd love to hear what you thought of your bouquet. Your feedback means the world to us.
          </p>
        </div>
      </div>

      {/* Form Area */}
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-16">
        <div className="animate-fade-in">
            {reviewStatus === 'success' ? (
              <div key="success" className="text-center py-16 relative overflow-hidden" style={{ minHeight: 420 }}>
                <style>{`
                  @keyframes confettiFall {
                    0%   { transform: translateY(-20px) rotate(var(--cr)) scale(1); opacity: 1; }
                    100% { transform: translateY(340px) rotate(calc(var(--cr) + 360deg)) scale(0.6); opacity: 0; }
                  }
                  @keyframes glowPulse {
                    0%, 100% { opacity: 0.12; transform: scale(1); }
                    50%       { opacity: 0.22; transform: scale(1.08); }
                  }
                  @keyframes bloomScale {
                    0%   { opacity: 0; transform: scale(0.5) rotate(-8deg); }
                    60%  { opacity: 1; transform: scale(1.08) rotate(3deg); }
                    100% { opacity: 1; transform: scale(1) rotate(0deg); }
                  }
                  @keyframes petalDraw {
                    from { stroke-dashoffset: var(--len, 120); }
                    to   { stroke-dashoffset: 0; }
                  }
                  @keyframes curtainLeft {
                    0%   { clip-path: inset(0 50% 0 0); opacity: 0; }
                    30%  { opacity: 1; }
                    100% { clip-path: inset(0 0% 0 0); opacity: 1; }
                  }
                  @keyframes curtainRight {
                    0%   { clip-path: inset(0 0 0 50%); opacity: 0; }
                    30%  { opacity: 1; }
                    100% { clip-path: inset(0 0 0 0%); opacity: 1; }
                  }
                  @keyframes fadeSlideUp {
                    0%   { opacity: 0; transform: translateY(16px); }
                    100% { opacity: 1; transform: translateY(0); }
                  }
                  @keyframes orbFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50%       { transform: translateY(-8px) rotate(5deg); }
                  }

                  .rv-confetti {
                    position: absolute; top: 0; border-radius: 2px;
                    pointer-events: none;
                    animation: confettiFall var(--cd) ease-in var(--cdelay) infinite;
                  }
                  .rv-glow {
                    position: absolute; top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: 200px; height: 200px; border-radius: 50%;
                    background: radial-gradient(circle, #C4968A 0%, transparent 70%);
                    pointer-events: none;
                    animation: glowPulse 2.8s ease-in-out infinite;
                  }
                  .rv-bloom { animation: bloomScale 1s cubic-bezier(.175,.885,.32,1.275) .2s both; }
                  .rv-petal-path { stroke-dasharray: var(--len, 120); animation: petalDraw 1.2s ease-out var(--pd, 0.3s) both; }
                  .rv-orb { animation: orbFloat 4s ease-in-out infinite; }
                  .rv-title-l { animation: curtainLeft  .9s cubic-bezier(.16,1,.3,1) .8s both; }
                  .rv-title-r { animation: curtainRight .9s cubic-bezier(.16,1,.3,1) .8s both; }
                  .rv-sub     { animation: fadeSlideUp  .8s cubic-bezier(.16,1,.3,1) 1.3s both; }
                  .rv-cta     { animation: fadeSlideUp  .8s cubic-bezier(.16,1,.3,1) 1.6s both; }
                `}</style>

                {/* Confetti burst */}
                {[
                  { left: '10%', w: 8,  h: 4,  bg: '#C4968A', cr: '12deg',  cd: '3.2s', cdelay: '0s'    },
                  { left: '22%', w: 6,  h: 6,  bg: '#D0B8A8', cr: '-25deg', cd: '2.8s', cdelay: '0.15s' },
                  { left: '35%', w: 10, h: 4,  bg: '#8C4A40', cr: '40deg',  cd: '3.5s', cdelay: '0.3s'  },
                  { left: '50%', w: 6,  h: 8,  bg: '#C4968A', cr: '-10deg', cd: '3.0s', cdelay: '0.05s' },
                  { left: '63%', w: 8,  h: 4,  bg: '#D0B8A8', cr: '55deg',  cd: '2.6s', cdelay: '0.4s'  },
                  { left: '75%', w: 5,  h: 5,  bg: '#8C4A40', cr: '-38deg', cd: '3.3s', cdelay: '0.2s'  },
                  { left: '87%', w: 9,  h: 3,  bg: '#C4968A', cr: '22deg',  cd: '2.9s', cdelay: '0.35s' },
                  { left: '5%',  w: 7,  h: 5,  bg: '#D0B8A8', cr: '-50deg', cd: '3.1s', cdelay: '0.5s'  },
                  { left: '92%', w: 6,  h: 6,  bg: '#8C4A40', cr: '15deg',  cd: '3.4s', cdelay: '0.1s'  },
                  { left: '44%', w: 4,  h: 8,  bg: '#C4968A', cr: '-30deg', cd: '2.7s', cdelay: '0.45s' },
                ].map((c, i) => (
                  <div key={i} className="rv-confetti" style={{
                    left: c.left, width: c.w, height: c.h, background: c.bg,
                    '--cr': c.cr, '--cd': c.cd, '--cdelay': c.cdelay,
                  }} />
                ))}

                {/* Radial glow aura */}
                <div className="rv-glow" style={{ marginTop: -100 }}></div>

                {/* Rose bloom SVG */}
                <div className="rv-bloom rv-orb relative mx-auto mb-8" style={{ width: 110, height: 110 }}>
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="110" height="110">
                    {/* Outer petals */}
                    <ellipse className="rv-petal-path" cx="50" cy="28" rx="10" ry="18" fill="#C4968A" opacity="0.7" style={{ '--len': '100', '--pd': '0.3s' }} transform="rotate(0 50 50)" />
                    <ellipse className="rv-petal-path" cx="50" cy="28" rx="10" ry="18" fill="#C4968A" opacity="0.7" style={{ '--len': '100', '--pd': '0.45s' }} transform="rotate(60 50 50)" />
                    <ellipse className="rv-petal-path" cx="50" cy="28" rx="10" ry="18" fill="#C4968A" opacity="0.7" style={{ '--len': '100', '--pd': '0.6s' }} transform="rotate(120 50 50)" />
                    <ellipse className="rv-petal-path" cx="50" cy="28" rx="10" ry="18" fill="#C4968A" opacity="0.7" style={{ '--len': '100', '--pd': '0.75s' }} transform="rotate(180 50 50)" />
                    <ellipse className="rv-petal-path" cx="50" cy="28" rx="10" ry="18" fill="#C4968A" opacity="0.7" style={{ '--len': '100', '--pd': '0.9s' }} transform="rotate(240 50 50)" />
                    <ellipse className="rv-petal-path" cx="50" cy="28" rx="10" ry="18" fill="#C4968A" opacity="0.7" style={{ '--len': '100', '--pd': '1.05s' }} transform="rotate(300 50 50)" />
                    {/* Inner circle */}
                    <circle cx="50" cy="50" r="14" fill="#8C4A40" style={{ animation: 'bloomScale 0.6s cubic-bezier(.175,.885,.32,1.275) 1.1s both', opacity: 0 }} />
                  </svg>
                </div>

                {/* Title — curtain split reveal */}
                <div className="font-playfair text-[42px] md:text-[52px] italic text-charcoal mb-2 flex justify-center overflow-hidden">
                  <span className="rv-title-l inline-block">Thank&nbsp;</span>
                  <span className="rv-title-r inline-block">you.</span>
                </div>

                {/* Decorative separator */}
                <div className="rv-sub flex items-center justify-center gap-3 mb-5">
                  <div style={{ height: 1, width: 40, background: 'linear-gradient(to right, transparent, #C4968A)' }}></div>
                  <span style={{ color: '#C4968A', fontSize: 12 }}>✦</span>
                  <div style={{ height: 1, width: 40, background: 'linear-gradient(to left, transparent, #C4968A)' }}></div>
                </div>

                <p className="rv-sub text-[13px] font-light text-text-muted leading-[1.9] mb-10 max-w-xs mx-auto">
                  Your kind words mean the world to us. It's why we do what we do.
                </p>

                <div className="rv-cta">
                  <button
                    onClick={() => setReviewStatus('idle')}
                    className="bg-charcoal text-ivory text-[11px] tracking-[3px] px-8 py-4 uppercase rounded-md
                               font-inter transition-all duration-300 hover:bg-rose"
                  >
                    Write Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-8 bg-white/40 p-6 md:p-12 border border-border-soft shadow-sm rounded-xl">
                
                <div className="text-center mb-8 border-b border-[#D0B8A8] pb-10">
                  <label className="block text-[10px] tracking-[3px] font-bold text-charcoal-mid uppercase mb-5">How was your experience?</label>
                  <div className="flex justify-center gap-3">
                    {STARS.map((star) => {
                      const currentVal = hoverRating || reviewForm.rating;
                      const fillWidth = currentVal >= star ? '100%' : currentVal >= star - 0.5 ? '50%' : '0%';
                      return (
                        <div key={star} className="relative inline-block text-6xl group">
                          {/* Left half clickable area */}
                          <button
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star - 0.5 })}
                            onMouseEnter={() => setHoverRating(star - 0.5)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="absolute left-0 w-1/2 h-full z-10 cursor-pointer focus:outline-none"
                            title={`${star - 0.5} Stars`}
                          />
                          {/* Right half clickable area */}
                          <button
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="absolute right-0 w-1/2 h-full z-10 cursor-pointer focus:outline-none"
                            title={`${star} Stars`}
                          />
                          {/* Visual star */}
                          <div className="pointer-events-none transition-transform group-hover:scale-110 drop-shadow-sm relative">
                            <span className="inline-block" style={{ color: '#C4AFA8' }}>★</span>
                            <span
                              className="absolute left-0 top-0 overflow-hidden whitespace-nowrap inline-block"
                              style={{ color: '#C9860A', width: fillWidth }}
                            >
                              ★
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Your Name</label>
                  <input
                    name="name"
                    value={reviewForm.name}
                    onChange={handleReviewChange}
                    required
                    placeholder="Priya Sharma"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Your Review</label>
                  <textarea
                    name="message"
                    value={reviewForm.message}
                    onChange={handleReviewChange}
                    required
                    rows={5}
                    placeholder="What did you think of the bouquet?"
                    className={`${inputCls} resize-none min-h-[120px]`}
                  />
                </div>

                <div>
                  <label className={labelCls}>Add a Photo</label>
                  <div className="mt-3 border-2 border-dashed border-[#D0B8A8] hover:border-charcoal transition-colors bg-white/50 p-8 text-center relative group rounded-md">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      onChange={handleReviewImageChange} 
                    />
                    {reviewPreview ? (
                      <div className="flex flex-col items-center justify-center gap-3">
                        <img src={reviewPreview} alt="Preview" className="w-20 h-20 object-cover rounded shadow-md border border-border-soft" />
                        <span className="text-[10px] text-charcoal uppercase tracking-[2px] group-hover:text-rose transition-colors">Change Photo</span>
                      </div>
                    ) : (
                      <div className="space-y-3 pointer-events-none">
                        <div className="text-3xl grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">📸</div>
                        <div className="text-[11px] text-charcoal uppercase tracking-[2.5px]">Click to upload</div>
                        <div className="text-[12px] text-text-muted font-light">Show us your beautiful bouquet</div>
                      </div>
                    )}
                  </div>
                </div>

                {reviewStatus === 'error' && (
                  <div className="text-[12px] text-[#8C4A40] border border-[#C4968A] bg-[#C4968A]/10 px-4 py-3 text-center">
                    {reviewError || 'Something went wrong. Please try again.'}
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={reviewStatus === 'loading'}
                    className="w-full bg-charcoal text-ivory text-[11px] tracking-[3px] py-4 uppercase rounded-md
                               font-inter transition-all duration-300 hover:bg-rose disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {reviewStatus === 'loading' ? 'Sending...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
      </div>

      {/* Cropper Modal */}
      {cropperOpen && imageToCrop && (
        <ImageCropper
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setCropperOpen(false);
            setImageToCrop(null);
          }}
        />
      )}
    </div>
  );
}
