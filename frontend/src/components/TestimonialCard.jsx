export default function TestimonialCard({ quote, name, city, image_url, rating = 5 }) {
  const clampedRating = Math.min(5, Math.max(0, Math.round(rating)));

  return (
    <div className="bg-charcoal-mid p-6 md:p-8 rounded-2xl group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_12px_24px_rgba(26,15,15,0.4)] flex flex-col gap-5 md:gap-6 border border-white/5 h-full">

      {/* Stars */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: clampedRating }).map((_, i) => (
          <svg key={i} className="w-4 h-4 text-rose drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <div className="relative">
        <span className="absolute -top-5 -left-3 text-[70px] font-playfair italic text-white/[0.03] leading-none pointer-events-none select-none">"</span>
        <p className="font-playfair text-[15px] italic text-text-warm leading-[1.8] relative z-10">
          "{quote}"
        </p>
      </div>

      {/* Image */}
      {image_url && (
        <div className="w-full aspect-[4/5] overflow-hidden rounded-xl relative mt-2 shrink-0">
          <img
            src={image_url}
            alt={`${name}'s gift`}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep/50 to-transparent opacity-50 group-hover:opacity-10 transition-opacity duration-500" />
        </div>
      )}

      {/* Pushes author to the bottom */}
      <div className="flex-grow" />

      {/* Divider + Author */}
      <div className="mt-2">
        <div className="w-8 h-[1px] bg-rose-muted/40 mb-3 transition-all duration-500 group-hover:w-16 group-hover:bg-rose-muted" />
        <div className="text-[10px] tracking-[2px] text-rose-muted uppercase font-inter font-medium">
          {name}{city ? <>&nbsp;·&nbsp;{city}</> : null}
        </div>
      </div>

    </div>
  );
}
