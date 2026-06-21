import { useState, useRef } from 'react';

export default function ProcessStep({ num, title, body }) {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate rotation limits (-15 to 15 degrees)
    const rotateY = ((mouseX / width) - 0.5) * 30; 
    const rotateX = ((mouseY / height) - 0.5) * -30; 
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovering(true);
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 }); // Reset to flat
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative h-full p-8 rounded-2xl bg-white border border-border-soft/60 shadow-[0_4px_20px_rgba(44,26,26,0.03)] cursor-default overflow-hidden group"
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovering ? 1.05 : 1})`,
        transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.6s ease-out',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        boxShadow: isHovering ? '0 20px 40px rgba(196,150,138,0.25)' : '0 4px 20px rgba(44,26,26,0.03)'
      }}
    >
      {/* Background Watermark Number */}
      <div 
        className="absolute -bottom-4 right-2 font-playfair text-[80px] italic text-ivory-soft leading-none pointer-events-none transition-colors duration-500 group-hover:text-rose/10"
        style={{ 
          transform: isHovering ? 'translateZ(20px)' : 'translateZ(0px)', 
          transition: 'transform 0.3s ease-out, color 0.5s ease-out' 
        }}
      >
        {num}
      </div>
      
      {/* 3D Floating Content Wrapper */}
      <div 
        style={{ 
          transform: isHovering ? 'translateZ(50px)' : 'translateZ(0px)', 
          transition: 'transform 0.3s ease-out' 
        }}
      >
        {/* Animated Icon Circle */}
        <div className="w-12 h-12 rounded-full bg-ivory flex items-center justify-center mb-6 relative border border-border-soft/50 shadow-sm z-10 bg-white">
          <div className="absolute w-full h-full rounded-full border border-rose/30 animate-ping opacity-75" />
          <div className="w-3 h-3 rounded-full bg-rose/80" />
        </div>

        <div className="text-[15px] text-charcoal mb-3 relative z-10 font-medium tracking-wide group-hover:text-rose transition-colors duration-300">
          {title}
        </div>
        <p className="text-[13px] font-light text-text-light leading-[1.8] relative z-10">
          {body}
        </p>
      </div>
    </div>
  );
}
