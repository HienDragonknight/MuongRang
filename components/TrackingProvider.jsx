'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/tracking';

export default function TrackingProvider({ children }) {
  useEffect(() => {
    // 1. Initial Page Visit Tracking
    trackEvent('track', 'trang-chu', 'Trang chủ Next.js');

    // 2. Global interaction click delegation
    const handleClick = (e) => {
      const target = e.target.closest('a, button, .timeline-item, .game-card, .model-card');
      if (!target) return;

      const href = target.getAttribute('href');
      const text = target.textContent?.trim().slice(0, 40);

      if (href && href.startsWith('#')) {
        trackEvent('track', href.replace('#', 'nav-'), `Mục: ${text || href}`);
      } else if (target.getAttribute('data-track')) {
        trackEvent('track', target.getAttribute('data-track'), text || 'Tương tác');
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return <>{children}</>;
}
