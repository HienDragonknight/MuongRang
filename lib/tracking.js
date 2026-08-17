/**
 * Tracking Helper for Google Sheets & Google Apps Script in Next.js
 */

export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzguGUS8MaKvFRDQc5zSuWXvjOIDL-cdZ6ibbuVTPxtMtNuAo2HwaK7RQTwJlTuZXWW/exec';

let lastTrackTime = 0;

export function trackEvent(action = 'track', itemKey = '', itemName = '') {
  if (typeof window === 'undefined') return;

  try {
    const now = Date.now();
    if (action === 'track' && now - lastTrackTime < 400) return;
    lastTrackTime = now;

    let url = `${SCRIPT_URL}?action=${encodeURIComponent(action)}`;
    if (itemKey) url += `&itemKey=${encodeURIComponent(itemKey)}`;
    if (itemName) url += `&itemName=${encodeURIComponent(itemName)}`;
    url += `&_t=${now}`;

    if (navigator.sendBeacon) {
      navigator.sendBeacon(url);
    } else {
      const img = new Image();
      img.src = url;
    }
  } catch (err) {
    console.warn('Tracking notice:', err);
  }
}

export async function fetchLiveStats() {
  try {
    const url = `${SCRIPT_URL}?action=get&_t=${Date.now()}`;
    const res = await fetch(url, { method: 'GET', redirect: 'follow' });
    if (!res.ok) throw new Error('Fetch failed');
    return await res.json();
  } catch (err) {
    console.warn('Stats fetch notice:', err);
    return null;
  }
}
