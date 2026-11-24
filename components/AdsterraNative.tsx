'use client';

import { useEffect, useRef, useState } from 'react';

interface AdsterraNativeProps {
  className?: string;
  showLabel?: boolean;
}

export default function AdsterraNative({
  className = '',
  showLabel = true,
}: AdsterraNativeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    const container = containerRef.current;

    // Prevent duplicate script injection
    if (container.querySelector('script')) return;

    try {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl31227974.profitableratecpmnetwork.com/2a18dbbd80b5ecb940d263f0d6179195/invoke.js';

      container.appendChild(script);
    } catch (err) {
      console.warn('Adsterra native ad initialization caught:', err);
    }
  }, [mounted]);

  return (
    <div className={`w-full flex flex-col items-center justify-center my-8 ${className}`}>
      {showLabel && (
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2 select-none">
          Sponsored Content
        </span>
      )}
      <div className="w-full flex justify-center items-center overflow-hidden rounded-xl border border-border/40 bg-card/30 p-2 min-h-[90px] shadow-sm">
        <div
          id="container-2a18dbbd80b5ecb940d263f0d6179195"
          ref={containerRef}
          className="w-full flex justify-center items-center"
        />
      </div>
    </div>
  );
}
