'use client';

import { useEffect, useRef } from 'react';

interface AdsterraBannerProps {
  className?: string;
  showLabel?: boolean;
}

export default function AdsterraBanner({
  className = '',
  showLabel = true,
}: AdsterraBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = bannerRef.current;
    if (!container) return;

    // Prevent duplicate script injection in React Strict Mode or hot reloads
    if (container.querySelector('script')) return;

    try {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl31227974.profitableratecpmnetwork.com/2a18dbbd80b5ecb940d263f0d6179195/invoke.js';

      container.appendChild(script);
    } catch (err) {
      console.error('Adsterra initialization error:', err);
    }

    return () => {
      // Clean up container children on component unmount for seamless SPA page navigation
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className={`w-full flex flex-col items-center justify-center my-8 ${className}`}>
      {showLabel && (
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2 select-none">
          Advertisement
        </span>
      )}
      <div className="w-full flex justify-center items-center overflow-hidden rounded-xl border border-border/40 bg-card/30 p-2 min-h-[90px] shadow-sm">
        <div
          id="container-2a18dbbd80b5ecb940d263f0d6179195"
          ref={bannerRef}
          className="w-full flex justify-center items-center"
        />
      </div>
    </div>
  );
}
