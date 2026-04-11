'use client';
import { useEffect, useRef } from 'react';

type AdBannerProps = {
  dataAdSlot?: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
};

export default function AdBanner({
  dataAdSlot,
  dataAdFormat = 'auto',
  dataFullWidthResponsive = true,
}: AdBannerProps) {
  const adInited = useRef(false);

  // TEMPORARILY DISABLED: Returning null hides the ad placements 
  // without breaking the rest of the app's layout.
  // Remove this return statement once Google AdSense is approved.
  return null;

  useEffect(() => {
    // Prevent multiple initializations in React Strict Mode
    if (adInited.current) return;
    adInited.current = true;

    try {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // @ts-ignore
        window.adsbygoogle.push({});
      }
    } catch (error: any) {
      if (error.message && error.message.includes("already have ads")) {
        // Completely safe to ignore
      } else {
        console.error('AdSense Error:', error);
      }
    }
  }, []);

  return (
    <div className="flex justify-center my-4 overflow-hidden w-full min-h-[100px] border border-dashed border-border/50 rounded-lg p-2 items-center bg-card/30 relative group">
      {/* Visual Placeholder that shows up while Ad is unapproved or slot is missing */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/60 z-0 pointer-events-none">
        <span className="text-xs font-semibold uppercase tracking-widest">Advertisement Space</span>
        {!dataAdSlot && <span className="text-[10px] mt-1">(Missing Slot ID)</span>}
      </div>

      <div className="z-10 w-full flex justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minWidth: '300px', width: '100%', maxHeight: '250px' }}
          data-ad-client="ca-pub-8663470554199300"
          {...(dataAdSlot ? { 'data-ad-slot': dataAdSlot } : {})}
          data-ad-format={dataAdFormat}
          data-full-width-responsive={dataFullWidthResponsive.toString()}
        />
      </div>
    </div>
  );
}
