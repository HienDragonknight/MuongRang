/**
 * Muong Rang QR - Visitor & Interaction Tracking Module
 * Integrated with Google Sheets & Google Apps Script
 */

(function () {
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzguGUS8MaKvFRDQc5zSuWXvjOIDL-cdZ6ibbuVTPxtMtNuAo2HwaK7RQTwJlTuZXWW/exec';
  const SESSION_KEY = 'mr_visited_session';
  const TRACKED_ITEMS_KEY = 'mr_tracked_items';

  let currentStats = {
    totalViews: 1219,
    todayViews: 48,
    todayDate: new Date().toISOString().slice(0, 10),
    topItems: [
      { key: 'vr-360-viewer', name: 'Trải nghiệm VR 360 Không gian Mường', views: 485 },
      { key: 'su-thi-chuong-1', name: 'Sử Thi: Khai Thiên Lập Địa (Phần 1)', views: 342 },
      { key: 'model-3d-trong-dong', name: 'Mô hình 3D Trống Đồng & Cồng Chiêng', views: 218 },
      { key: 'nav-kham-pha', name: 'Khám Phá Nhà Sàn & Ẩm Thực Mường', views: 156 },
      { key: 'su-thi-chuong-3', name: 'Sử Thi: Sự Tích Cây Si Chu Đồng', views: 98 }
    ]
  };

  // Get list of already tracked items in this session
  function getTrackedItems() {
    try {
      return JSON.parse(sessionStorage.getItem(TRACKED_ITEMS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function addTrackedItem(key) {
    const list = getTrackedItems();
    if (!list.includes(key)) {
      list.push(key);
      try {
        sessionStorage.setItem(TRACKED_ITEMS_KEY, JSON.stringify(list));
      } catch (e) {}
    }
  }

  // Animate number count up
  function animateValue(elem, start, end, duration) {
    if (!elem) return;
    if (isNaN(end)) {
      elem.textContent = end;
      return;
    }
    if (start === end) {
      elem.textContent = Number(end).toLocaleString('vi-VN');
      return;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      elem.textContent = current.toLocaleString('vi-VN');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        elem.textContent = Number(end).toLocaleString('vi-VN');
      }
    };
    window.requestAnimationFrame(step);
  }

  // Update UI Elements
  function updateUI(data) {
    if (!data) return;

    const totalEl = document.getElementById('stat-total-views');
    const todayEl = document.getElementById('stat-today-views');
    const topListEl = document.getElementById('stat-top-list');
    const dateBadgeEl = document.getElementById('stat-today-date');

    // Total Views
    if (totalEl) {
      const prevTotal = parseInt(totalEl.getAttribute('data-value') || '0', 10);
      totalEl.setAttribute('data-value', data.totalViews);
      animateValue(totalEl, prevTotal, data.totalViews, 800);
    }

    // Today Views
    if (todayEl) {
      const prevToday = parseInt(todayEl.getAttribute('data-value') || '0', 10);
      todayEl.setAttribute('data-value', data.todayViews);
      animateValue(todayEl, prevToday, data.todayViews, 800);
    }

    // Date Badge
    if (dateBadgeEl && data.todayDate) {
      const parts = data.todayDate.split('-');
      if (parts.length === 3) {
        dateBadgeEl.textContent = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }

    // Top Items
    if (topListEl && Array.isArray(data.topItems)) {
      if (data.topItems.length === 0) {
        topListEl.innerHTML = '<div class="stat-top-empty"><i class="fa-solid fa-chart-simple"></i> Đang cập nhật dữ liệu...</div>';
      } else {
        const maxViews = data.topItems[0] && data.topItems[0].views > 0 ? data.topItems[0].views : 1;
        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

        topListEl.innerHTML = data.topItems.map((item, idx) => {
          const percentage = Math.round((item.views / maxViews) * 100);
          const medal = medals[idx] || `${idx + 1}.`;
          return `
            <div class="stat-top-item">
              <div class="stat-top-rank">${medal}</div>
              <div class="stat-top-info">
                <div class="stat-top-name-row">
                  <span class="stat-top-name">${escapeHtml(item.name)}</span>
                  <span class="stat-top-count">${Number(item.views).toLocaleString('vi-VN')} lượt</span>
                </div>
                <div class="stat-top-bar-bg">
                  <div class="stat-top-bar-fill" style="width: ${percentage}%"></div>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // API Call Wrapper
  async function sendTrackingRequest(action, itemKey = '', itemName = '') {
    try {
      let url = `${SCRIPT_URL}?action=${encodeURIComponent(action)}`;
      if (itemKey) url += `&itemKey=${encodeURIComponent(itemKey)}`;
      if (itemName) url += `&itemName=${encodeURIComponent(itemName)}`;

      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (data && data.status === 'success') {
        currentStats = data;
        updateUI(data);
        return data;
      }
    } catch (err) {
      console.warn('Tracking request notice:', err.message);
    }
    return null;
  }

  // Track initial page visit
  function trackInitialVisit() {
    const isVisited = sessionStorage.getItem(SESSION_KEY);
    if (!isVisited) {
      // First visit in this session -> track as a new visitor
      sessionStorage.setItem(SESSION_KEY, '1');
      sendTrackingRequest('track', 'trang-chu', 'Trang chủ');
      addTrackedItem('trang-chu');
    } else {
      // Already visited -> just fetch current stats
      sendTrackingRequest('get');
    }
  }

  // Track specific interaction/item
  window.trackItemInteraction = function (itemKey, itemName) {
    if (!itemKey || !itemName) return;
    const tracked = getTrackedItems();
    if (!tracked.includes(itemKey)) {
      addTrackedItem(itemKey);
      sendTrackingRequest('track', itemKey, itemName);
    }
  };

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

    // 5. Refresh button
    const refreshBtn = document.getElementById('stat-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', (e) => {
        e.preventDefault();
        refreshBtn.classList.add('spinning');
        sendTrackingRequest('get').finally(() => {
          setTimeout(() => refreshBtn.classList.remove('spinning'), 600);
        });
      });
    }
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
