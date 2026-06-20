import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const CAL_W = 300;

/* ─── helpers ────────────────────────────────────────────────────────── */
function parseLocalDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function toDateString(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}
function formatDisplay(str) {
  if (!str) return '';
  return parseLocalDate(str).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}
function buildCells(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, cur: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true });
  const rem = 42 - cells.length;
  for (let d = 1; d <= rem; d++) cells.push({ day: d, cur: false });
  return cells;
}

/* ─── portal calendar ────────────────────────────────────────────────── */
function Calendar({ anchorRef, value, onSelect, onClear, onClose }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const initial = value ? parseLocalDate(value) : null;
  const [viewYear, setViewYear] = useState(initial?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial?.getMonth() ?? today.getMonth());
  const [hovered, setHovered] = useState(null);
  const [pos, setPos] = useState({ top: 0, left: 0, openUp: false });
  const calRef = useRef(null);

  // Position relative to trigger
  useEffect(() => {
    if (!anchorRef.current) return;
    const place = () => {
      const r = anchorRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - r.bottom;
      const spaceAbove = r.top;
      const openUp = spaceBelow < 340 && spaceAbove > spaceBelow;
      const calH = 340; // approximate
      setPos({
        top: openUp ? r.top + window.scrollY - calH - 8 : r.bottom + window.scrollY + 8,
        left: Math.min(r.left + window.scrollX, window.innerWidth - CAL_W - 16),
        openUp,
      });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [anchorRef]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        calRef.current && !calRef.current.contains(e.target) &&
        anchorRef.current && !anchorRef.current.contains(e.target)
      ) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, anchorRef]);

  const navigate = (delta) => {
    setViewMonth((m) => {
      const next = m + delta;
      if (next > 11) { setViewYear((y) => y + 1); return 0; }
      if (next < 0)  { setViewYear((y) => y - 1); return 11; }
      return next;
    });
  };

  const cells = buildCells(viewYear, viewMonth);

  const isSelected = (c) => {
    if (!c.cur || !value) return false;
    const s = parseLocalDate(value);
    return s.getFullYear() === viewYear && s.getMonth() === viewMonth && s.getDate() === c.day;
  };
  const isToday = (c) =>
    c.cur && today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === c.day;
  const isDisabled = (c) => {
    if (!c.cur) return true;
    const d = new Date(viewYear, viewMonth, c.day); d.setHours(0,0,0,0);
    return d < today;
  };

  return createPortal(
    <div
      ref={calRef}
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        width: CAL_W,
        zIndex: 99999,
        background: '#FDFAF7',
        border: '1px solid #E8DDD7',
        borderRadius: 12,
        boxShadow: '0 24px 64px rgba(44,26,26,0.18), 0 4px 16px rgba(44,26,26,0.08)',
        overflow: 'hidden',
        animation: 'dpIn .22s cubic-bezier(.16,1,.3,1)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg,#2C1A1A 0%,#4A2C2C 100%)',
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <HdrBtn onClick={() => navigate(-1)} title="Previous">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7l4-4" stroke="#FDFAF7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </HdrBtn>

        <div style={{ textAlign: 'center', lineHeight: 1.15 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontStyle: 'italic', color: '#FDFAF7', letterSpacing: '.02em' }}>
            {MONTHS[viewMonth]}
          </div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: '#C4A898', fontWeight: 600, marginTop: 2 }}>
            {viewYear}
          </div>
        </div>

        <HdrBtn onClick={() => navigate(1)} title="Next">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3l4 4-4 4" stroke="#FDFAF7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </HdrBtn>
      </div>

      {/* ── Day labels ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '10px 14px 4px' }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 9, letterSpacing: 2, fontWeight: 700, color: '#9A8478', textTransform: 'uppercase', padding: '3px 0' }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: '#EDE5E0', margin: '0 14px' }} />

      {/* ── Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '8px 14px 14px', gap: 2 }}>
        {cells.map((c, i) => {
          const sel  = isSelected(c);
          const dis  = isDisabled(c);
          const tod  = isToday(c);
          const hov  = !dis && c.cur && hovered === `${viewYear}-${viewMonth}-${c.day}`;

          let bg     = 'transparent';
          let color  = c.cur ? '#2C1A1A' : '#D4C4BC';
          let fw     = 400;
          let border = 'none';

          if (sel)      { bg = '#8C4A40'; color = '#FDFAF7'; fw = 600; }
          else if (hov) { bg = '#F5EDE8'; color = '#8C4A40'; }
          else if (tod) { border = '1.5px solid #C4A898'; color = '#8C4A40'; fw = 600; }

          return (
            <button
              key={i}
              type="button"
              disabled={dis}
              onClick={() => { if (!dis) { onSelect(new Date(viewYear, viewMonth, c.day)); } }}
              onMouseEnter={() => !dis && setHovered(`${viewYear}-${viewMonth}-${c.day}`)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width: '100%', aspectRatio: '1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: bg, color: dis && c.cur ? '#C4B8B0' : color,
                fontWeight: fw, border, borderRadius: 6,
                fontSize: 12, cursor: dis ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'background .12s, color .12s, transform .1s',
                transform: hov ? 'scale(1.1)' : 'scale(1)',
                opacity: dis && c.cur ? 0.4 : 1,
                textDecoration: dis && c.cur ? 'line-through' : 'none',
              }}
            >
              {c.day}
            </button>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div style={{ borderTop: '1px solid #EDE5E0', padding: '9px 14px', display: 'flex', justifyContent: 'space-between' }}>
        <FooterBtn color="#9A8478" hoverColor="#8C4A40" onClick={onClear}>Clear</FooterBtn>
        <FooterBtn color="#8C4A40" hoverColor="#2C1A1A" onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); }}>Today</FooterBtn>
      </div>

      <style>{`
        @keyframes dpIn {
          from { opacity:0; transform:translateY(10px) scale(.96); }
          to   { opacity:1; transform:translateY(0)   scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}

/* ─── tiny sub-components ────────────────────────────────────────────── */
function HdrBtn({ onClick, title, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button type="button" onClick={onClick} title={title}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hov ? 'rgba(253,250,247,.15)' : 'transparent', border: 'none', cursor: 'pointer', transition: 'background .15s',
      }}
    >{children}</button>
  );
}

function FooterBtn({ onClick, color, hoverColor, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700,
        fontFamily: 'Inter, sans-serif', background: 'none', border: 'none', cursor: 'pointer',
        padding: '4px 0', color: hov ? hoverColor : color, transition: 'color .15s',
      }}
    >{children}</button>
  );
}

/* ─── main export ────────────────────────────────────────────────────── */
export default function DatePicker({ value, onChange, id, placeholder = 'Select a date' }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  const handleSelect = useCallback((date) => {
    date.setHours(0, 0, 0, 0);
    onChange(toDateString(date));
    setOpen(false);
  }, [onChange]);

  const handleClear = useCallback(() => {
    onChange('');
    setOpen(false);
  }, [onChange]);

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      {/* Trigger */}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          border: open ? '1px solid #2C1A1A' : '1px solid #D0B8A8',
          background: '#FDFAF7', padding: '11px 16px', borderRadius: 6,
          fontSize: 14, color: value ? '#2C1A1A' : '#9A8478', cursor: 'pointer',
          transition: 'border-color .2s, box-shadow .2s',
          boxShadow: open ? '0 0 0 1px #2C1A1A' : 'none',
          fontFamily: 'Inter, sans-serif', textAlign: 'left',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <rect x="1" y="2.5" width="13" height="11.5" rx="2" stroke={value ? '#8C4A40' : '#C4A898'} strokeWidth="1.2"/>
            <path d="M1 6h13" stroke={value ? '#8C4A40' : '#C4A898'} strokeWidth="1.2"/>
            <path d="M4.5 1v3M10.5 1v3" stroke={value ? '#8C4A40' : '#C4A898'} strokeWidth="1.2" strokeLinecap="round"/>
            <rect x="4" y="8" width="2" height="2" rx=".5" fill={value ? '#8C4A40' : '#C4A898'}/>
            <rect x="6.5" y="8" width="2" height="2" rx=".5" fill={value ? '#8C4A40' : '#C4A898'}/>
            <rect x="9" y="8" width="2" height="2" rx=".5" fill={value ? '#8C4A40' : '#C4A898'}/>
          </svg>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{ transition: 'transform .25s', transform: open ? 'rotate(180deg)' : 'rotate(0)', flexShrink: 0 }}>
          <path d="M3 5l4 4 4-4" stroke="#9A8478" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <Calendar
          anchorRef={triggerRef}
          value={value}
          onSelect={handleSelect}
          onClear={handleClear}
          onClose={handleClose}
        />
      )}
    </>
  );
}
