'use client';

import { useEffect, useRef, useState } from 'react';

interface AdsterraBannerProps {
  className?: string;
  showLabel?: boolean;
}

export default function AdsterraBanner({
  className = '',
  showLabel = true,
}: AdsterraBannerProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    const container = containerRef.current;

    // Prevent duplicate injection
    if (container.querySelector('iframe')) return;

    try {
      const isDesktop = window.innerWidth >= 768;
      const width = isDesktop ? 728 : 300;
      const height = isDesktop ? 90 : 250;
      const key = isDesktop
        ? 'f5082d15bf0c3de318d0515ebf8530c9'
        : 'e3ffb4ef06eee74dd870f87cbfb0aff6';

      const iframe = document.createElement('iframe');
      iframe.width = String(width);
      iframe.height = String(height);
      iframe.scrolling = 'no';
      iframe.style.border = '0';
      iframe.style.overflow = 'hidden';
      iframe.title = 'Advertisement';

      container.appendChild(iframe);

      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                  display: flex; 
                  justify-content: center; 
                  align-items: center; 
                  background: transparent; 
                  overflow: hidden; 
                  width: ${width}px;
                  height: ${height}px;
                }
              </style>
            </head>
            <body>
              <script type="text/javascript">
                atOptions = {
                  'key' : '${key}',
                  'format' : 'iframe',
                  'height' : ${height},
                  'width' : ${width},
                  'params' : {}
                };
              </script>
              <script type="text/javascript" data-cfasync="false" src="https://bicea.org/22/${key}"></script>
            </body>
          </html>
        `);
        doc.close();
      }
    } catch (err) {
      console.warn('Adsterra banner initialization caught:', err);
    }
  }, [mounted]);

  return (
    <div className={`w-full flex flex-col items-center justify-center my-6 ${className}`}>
      {showLabel && (
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2 select-none">
          Advertisement
        </span>
      )}
      <div
        ref={containerRef}
        className="flex justify-center items-center overflow-hidden rounded-xl border border-border/30 bg-card/20 p-2 shadow-sm min-h-[90px] w-full"
      />
    </div>
  );
}
