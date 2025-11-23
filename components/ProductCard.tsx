import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ProductCardProps {
  number: string;
  name: string;
  description: string;
  price?: string;
  warning?: string;
  art?: string;
  colorBg?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  number, 
  name, 
  description, 
  price = "SOLD OUT", 
  warning, 
  art, 
  colorBg = 'bg-white' 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    
    gsap.fromTo(cardRef.current, 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
        }
      }
    );
  }, []);

  return (
    <div ref={cardRef} className="group cursor-pointer font-sans">
      <div className={`relative aspect-[3/4] ${colorBg} border-2 border-ink overflow-hidden transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 shadow-[8px_8px_0px_#1a1a1a] hover:shadow-[12px_12px_0px_#1a1a1a]`}>
        
        {/* Misprint Hover Layers */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none z-10">
          <div className="absolute inset-0 bg-cyan-bright/30 mix-blend-multiply translate-x-0 translate-y-0 group-hover:translate-x-[6px] group-hover:translate-y-[6px] transition duration-200" />
          <div className="absolute inset-0 bg-orange-bright/30 mix-blend-multiply translate-x-0 translate-y-0 group-hover:-translate-x-[4px] group-hover:-translate-y-[4px] transition duration-200" />
        </div>

        {/* Art/Content */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
           {art && <img src={art} alt={name} className="w-full h-full object-contain drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]" />}
        </div>
        
        {/* Badge */}
        <div className="absolute top-0 left-0 border-b-2 border-r-2 border-ink bg-paper px-3 py-2 z-20">
            <span className="font-mono text-xs font-bold uppercase tracking-wider">Item #{number}</span>
        </div>

        {/* Warning Label */}
        {warning && (
             <div className="absolute bottom-4 right-4 bg-orange-bright text-white px-2 py-1 text-[10px] font-bold font-mono -rotate-2 z-20 border border-ink shadow-[2px_2px_0px_#1a1a1a]">
                {warning}
             </div>
        )}
      </div>

      <div className="mt-5 space-y-3">
        <h3 className="text-2xl font-bold uppercase leading-none tracking-tight">{name}</h3>
        <p className="font-mono text-sm text-ink/70 leading-tight min-h-[2.5em]">{description}</p>
        
        <div className="flex flex-wrap gap-3 pt-2">
          <button className="font-mono text-xs uppercase font-bold border-2 border-ink px-4 py-2 bg-cyan-bright text-black hover:-translate-y-0.5 hover:-translate-x-0.5 transition shadow-[4px_4px_0px_#1a1a1a] hover:shadow-[6px_6px_0px_#1a1a1a]">
            Add to Cart
          </button>
          <div className="font-mono text-xs uppercase font-bold border-2 border-ink px-3 py-2 bg-white flex items-center">
            {price}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
