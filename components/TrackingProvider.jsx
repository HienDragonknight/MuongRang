'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/tracking';

export default function TrackingProvider({ children }) {
  useEffect(() => {
    // 1. Initial Page Visit Tracking
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('utm_source') || urlParams.get('source') || 'web';
    const isQR = source.toLowerCase().includes('qr') || source.toLowerCase().includes('poster');

    const visitLabel = isQR ? 'Quét mã QR Poster' : 'Truy cập Website';
    trackEvent('track', 'trang-chu', visitLabel);

    // 2. Global Event Delegation for clicks
    const handleClick = (e) => {
      const target = e.target.closest('a, button, .showcase-card, .game-card, .btc-member-card');
      if (!target) return;

      const href = target.getAttribute('href');
      const text = target.textContent?.trim().slice(0, 35) || 'Tương tác';

      if (href && href.startsWith('#')) {
        const key = href.replace('#', 'nav-');
        trackEvent('track', key, `Xem mục: ${text || href}`);
      } else if (target.getAttribute('data-track')) {
        const key = target.getAttribute('data-track');
        trackEvent('track', key, text);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return <>{children}</>;
}
