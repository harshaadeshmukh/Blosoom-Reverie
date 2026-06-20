export default function ProcessStep({ num, title, body }) {
  return (
    <div
      className="reveal px-6 py-8 border-r border-border-soft last:border-r-0 group
                 transition-colors duration-300 hover:bg-ivory-soft"
    >
      <div className="font-playfair text-[36px] italic text-border-soft leading-none mb-5
                      transition-colors duration-300 group-hover:text-rose">
        {num}
      </div>
      <div className="text-[13px] text-charcoal mb-2">{title}</div>
      <p className="text-[12px] font-light text-text-light leading-[1.75]">{body}</p>
    </div>
  );
}
