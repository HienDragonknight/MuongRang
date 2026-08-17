/**
 * Muong Rang QR - Visitor & Interaction Tracking Module
 * Integrated with Google Sheets & Google Apps Script
 */

(function () {
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzguGUS8MaKvFRDQc5zSuWXvjOIDL-cdZ6ibbuVTPxtMtNuAo2HwaK7RQTwJlTuZXWW/exec';
  let lastTrackTime = 0;

  // Send tracking beacon/request reliably across all browsers and domains
  function sendTrackingEvent(action, itemKey = '', itemName = '') {
    try {
      const now = Date.now();
      // Throttle rapid clicks (500ms)
      if (action === 'track' && now - lastTrackTime < 500) return;
      lastTrackTime = now;

      let url = `${SCRIPT_URL}?action=${encodeURIComponent(action)}`;
      if (itemKey) url += `&itemKey=${encodeURIComponent(itemKey)}`;
      if (itemName) url += `&itemName=${encodeURIComponent(itemName)}`;
      url += `&_t=${now}`;

      // 1. Try Beacon API first (standard for analytics)
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url);
      } else {
        // 2. Image beacon fallback (bypasses CORS restrictions)
        const img = new Image();
        img.src = url;
      }
    } catch (err) {
      console.warn('Tracking notice:', err);
    }
  }

  // Public method to track interaction
  window.trackItemInteraction = function (itemKey, itemName) {
    if (!itemKey || !itemName) return;
    sendTrackingEvent('track', itemKey, itemName);
  };

  // Track initial page visit
  function trackInitialVisit() {
    sendTrackingEvent('track', 'trang-chu', 'Trang chủ');
  }

  // Setup click listeners for interactive items
  function setupInteractionListeners() {
    // 1. Navigation links
    document.querySelectorAll('.nav-links a, .footer-col a').forEach(link => {
      link.addEventListener('click', () => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();
        if (href && href.startsWith('#') && text) {
          window.trackItemInteraction(href.replace('#', 'nav-'), `Mục: ${text}`);
        }
      });
    });

    // 2. VR 360 Viewer trigger
    document.querySelectorAll('a[href*="VR360"], button[data-action="vr"], .vr-preview-card, #btn-open-vr').forEach(btn => {
      btn.addEventListener('click', () => {
        window.trackItemInteraction('vr-360-viewer', 'Trải nghiệm VR 360 Không gian Mường');
      });
    });

    // 3. 3D Models
    document.querySelectorAll('model-viewer, .model-card, [data-model]').forEach(el => {
      el.addEventListener('click', () => {
        const title = el.getAttribute('data-title') || el.querySelector('h3, h4')?.textContent || 'Mô hình 3D';
        window.trackItemInteraction('model-3d-' + encodeURIComponent(title), `3D: ${title.trim()}`);
      });
    });

    // 4. Epic Chapters (Sử thi 26 phần)
    document.querySelectorAll('.timeline-item, .epic-card, .chapter-item, [data-chapter]').forEach(card => {
      card.addEventListener('click', () => {
        const chapterTitle = card.querySelector('h3, h4, .chapter-title, .epic-title')?.textContent || 'Chương Sử Thi';
        window.trackItemInteraction('su-thi-' + encodeURIComponent(chapterTitle.slice(0, 30)), chapterTitle.trim());
      });
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      trackInitialVisit();
      setupInteractionListeners();
    });
  } else {
    trackInitialVisit();
    setupInteractionListeners();
  }
})();
