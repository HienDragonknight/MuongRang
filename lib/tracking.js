/**
 * Next.js Client-Side Tracking Helper
 * Routes requests to internal /api/track and /api/stats (proxy to Google Apps Script)
 */

export const GOOGLE_SCRIPT_DIRECT_URL = 'https://script.google.com/macros/s/AKfycbzguGUS8MaKvFRDQc5zSuWXvjOIDL-cdZ6ibbuVTPxtMtNuAo2HwaK7RQTwJlTuZXWW/exec';

let lastTrackTime = 0;
const SESSION_TRACKED_ITEMS = 'mr_session_tracked_keys';

function getSessionTrackedList() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_TRACKED_ITEMS) || '[]');
  } catch (e) {
    return [];
  }
}

function markSessionTracked(key) {
  if (typeof window === 'undefined') return;
  const list = getSessionTrackedList();
  if (!list.includes(key)) {
    list.push(key);
    try {
      sessionStorage.setItem(SESSION_TRACKED_ITEMS, JSON.stringify(list));
    } catch (e) {}
  }
}

/**
 * Sends a tracking event to Next.js API route (/api/track) with direct Google Apps Script fallback
 */
export function trackEvent(action = 'track', itemKey = 'trang-chu', itemName = 'Trang chủ') {
  if (typeof window === 'undefined') return;

  try {
    const now = Date.now();
    // Throttle duplicate rapid triggers (400ms)
    if (action === 'track' && now - lastTrackTime < 400) return;
    lastTrackTime = now;

    // Detect QR source
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('utm_source') || urlParams.get('source') || 'web';

    const payload = JSON.stringify({ itemKey, itemName, source, timestamp: now });

    // 1. Try sending to Next.js internal API route via sendBeacon or POST fetch
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      const sent = navigator.sendBeacon('/api/track', blob);
      if (!sent) {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true
        }).catch(() => {});
      }
    } else {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      }).catch(() => {
        // Fallback: direct image beacon to Google Script
        const fallbackUrl = `${GOOGLE_SCRIPT_DIRECT_URL}?action=track&itemKey=${encodeURIComponent(itemKey)}&itemName=${encodeURIComponent(itemName)}&source=${encodeURIComponent(source)}&_t=${now}`;
        const img = new Image();
        img.src = fallbackUrl;
      });
    }

    markSessionTracked(itemKey);
  } catch (err) {
    console.warn('Tracking notice:', err);
  }
}

/**
 * Fetches latest live statistics via /api/stats (or fallback to Google Apps Script directly)
 */
export async function fetchLiveStats() {
  try {
    // 1. Fetch from Next.js server API
    const res = await fetch(`/api/stats?_t=${Date.now()}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const data = await res.json();
      if (data && (data.totalViews !== undefined || data.status === 'success')) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Internal /api/stats notice, trying direct fallback...');
  }

  // 2. Direct Fallback to Google Apps Script
  try {
    const directUrl = `${GOOGLE_SCRIPT_DIRECT_URL}?action=get&_t=${Date.now()}`;
    const directRes = await fetch(directUrl, { method: 'GET', redirect: 'follow' });
    if (directRes.ok) {
      return await directRes.json();
    }
  } catch (e) {
    console.warn('Direct stats fetch notice:', e);
  }

  return null;
}
