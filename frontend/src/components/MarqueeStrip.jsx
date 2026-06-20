const ITEMS = [
  'Custom Photo Bouquets',
  'Handwritten Note Cards',
  'Foil Balloon Toppers',
  'Printed Memory Sticks',
  'Evil Eye & Theme Cutouts',
  'Handcrafted in Pimpri',
  'Black Paper Signature Wraps',
  'Birthdays · Anniversaries · Milestones',
  'Made Specifically For Them',
  'Quirky Stickers & Inside Jokes',
];

export default function MarqueeStrip() {
  // Duplicate for seamless loop
  const all = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className="bg-blush py-4 overflow-hidden border-t border-b border-border-soft">
      <div className="flex w-max animate-marquee">
        {all.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="text-[10px] tracking-[3.5px] text-text-muted uppercase px-7 whitespace-nowrap font-light">
              {item}
            </span>
            <span className="text-[10px] text-rose px-1">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
