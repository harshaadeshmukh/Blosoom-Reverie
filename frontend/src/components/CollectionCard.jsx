export default function CollectionCard({ num, name, desc, tag, dark = false, onClick }) {
  if (dark) {
    return (
      <div
        onClick={onClick}
        className="bg-charcoal flex flex-col justify-end p-8 cursor-pointer group transition-all duration-300"
      >
        <p className="font-playfair text-base italic text-text-warm leading-relaxed mb-5">
          "Something made for no one else but them."
        </p>
        <button
          className="bg-rose text-charcoal border-none px-5 py-3 text-[10px] tracking-[2px] font-inter
                     uppercase cursor-pointer w-fit transition-all duration-300 hover:bg-ivory"
        >
          Start Custom Order
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-ivory-soft p-8 cursor-pointer group transition-all duration-400 hover:bg-white hover:-translate-y-0.5"
    >
      <div className="font-playfair text-[11px] italic text-rose-muted mb-5">{num}</div>
      <h3 className="font-playfair text-[19px] italic text-charcoal leading-[1.25] mb-2.5">
        {name}
      </h3>
      <p className="text-[12px] font-light text-text-light leading-[1.75] mb-5">{desc}</p>
      <span
        className="inline-block text-[9px] tracking-[2px] text-[#8C4A40] border border-rose-muted
                   px-2.5 py-1 uppercase transition-all duration-300
                   group-hover:bg-rose group-hover:text-white group-hover:border-rose"
      >
        {tag}
      </span>
    </div>
  );
}
