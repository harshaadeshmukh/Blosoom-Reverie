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
              <div className="text-center py-16">
                <div className="font-playfair text-[32px] italic text-charcoal mb-4">
                  Thank you.
                </div>
                <p className="text-[13px] font-light text-text-muted leading-[1.9] mb-8">
                  Your kind words mean the world to us. It's why we do what we do.
                </p>
                <button
                  onClick={() => setReviewStatus('idle')}
                  className="bg-charcoal text-ivory text-[10px] tracking-[2px] px-7 py-3.5 uppercase
                             font-inter transition-all duration-300 hover:bg-rose"
                >
                  Write Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-8 bg-white/40 p-6 md:p-12 border border-border-soft shadow-sm rounded-xl">
                
                <div className="text-center mb-8 border-b border-[#D0B8A8] pb-10">
                  <label className="block text-[10px] tracking-[3px] font-bold text-charcoal-mid uppercase mb-5">How was your experience?</label>
                  <div className="flex justify-center gap-3">
                    {STARS.map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-4xl focus:outline-none transition-transform hover:scale-110 drop-shadow-sm"
                        style={{
                          color: star <= (hoverRating || reviewForm.rating) ? '#C4968A' : '#E8DDD5',
                        }}
                      >
                        ★
                      </button>
                    ))}
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

      {/* Socials / Location footer inline block (Optional, moved from Contact) */}
      <div className="bg-ivory-soft py-12 px-6 border-t border-border-soft">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-12 text-center">
          <div>
            <div className="text-[9px] tracking-[3px] text-rose uppercase mb-2">WhatsApp</div>
            <a href="https://wa.me/918625902160" className="text-[13px] font-light text-text-muted hover:text-charcoal transition-colors">
              +91 86259 02160
            </a>
          </div>
          <div>
            <div className="text-[9px] tracking-[3px] text-rose uppercase mb-2">Instagram</div>
            <a href="https://instagram.com/blossomreverie.gifts" className="text-[13px] font-light text-text-muted hover:text-charcoal transition-colors">
              @blossomreverie.gifts
            </a>
          </div>
          <div>
            <div className="text-[9px] tracking-[3px] text-rose uppercase mb-2">Location</div>
            <p className="text-[13px] font-light text-text-muted">Pune, Maharashtra, India</p>
          </div>
        </div>
      </div>
    </div>
  );
}
