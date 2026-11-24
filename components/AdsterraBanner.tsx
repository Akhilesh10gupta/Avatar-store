'use client';

import React from 'react';

interface AdsterraBannerProps {
  className?: string;
  showLabel?: boolean;
}

export default function AdsterraBanner({
  className = '',
  showLabel = true,
}: AdsterraBannerProps) {
  // Mobile: 300x250, Desktop: 728x90 (Exactly ONE poster displayed per device)
  const mobileKey = 'e3ffb4ef06eee74dd870f87cbfb0aff6';
  const desktopKey = 'f5082d15bf0c3de318d0515ebf8530c9';

  const createAdHtml = (key: string, width: number, height: number) => `
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
  `;

  return (
    <div className={`w-full flex flex-col items-center justify-center my-6 ${className}`}>
      {showLabel && (
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2 select-none">
          Advertisement
        </span>
      )}

      {/* Desktop Banner (728x90) - Only visible on desktop screens (md: and above) */}
      <div className="hidden md:flex justify-center items-center overflow-hidden rounded-xl border border-border/30 bg-card/20 p-2 shadow-sm min-w-[728px] min-h-[90px]">
        <iframe
          title="Advertisement"
          srcDoc={createAdHtml(desktopKey, 728, 90)}
          width={728}
          height={90}
          scrolling="no"
          style={{ border: 0, overflow: 'hidden' }}
        />
      </div>

      {/* Mobile Banner (300x250) - Only visible on mobile/tablet screens (< md:) */}
      <div className="flex md:hidden justify-center items-center overflow-hidden rounded-xl border border-border/30 bg-card/20 p-2 shadow-sm min-w-[300px] min-h-[250px]">
        <iframe
          title="Advertisement"
          srcDoc={createAdHtml(mobileKey, 300, 250)}
          width={300}
          height={250}
          scrolling="no"
          style={{ border: 0, overflow: 'hidden' }}
        />
      </div>
    </div>
  );
}
