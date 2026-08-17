'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { fetchLiveStats } from '@/lib/tracking';

const PASSCODE = '123456';
const BASE_SEED = {
  baseTotal: 150,
  baseToday: 12,
  topItems: [
    { name: 'Trải nghiệm VR 360 Không gian Mường', views: 58 },
    { name: 'Sử Thi: Khai Thiên Lập Địa (Phần 1)', views: 42 },
    { name: 'Mô hình 3D Trống Đồng & Cồng Chiêng', views: 26 },
    { name: 'Khám Phá Nhà Sàn & Ẩm Thực Mường', views: 18 },
    { name: 'Sử Thi: Sự Tích Cây Si Chu Đồng', views: 12 }
  ]
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const [liveStats, setLiveStats] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pollTimerRef = useRef(null);

  // Check auth session
  useEffect(() => {
    try {
      if (sessionStorage.getItem('mr_admin_logged') === '1') {
        setIsAuthenticated(true);
      }
    } catch (e) {}
  }, []);

  // Polling for live stats
  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      pollTimerRef.current = setInterval(loadStats, 5000);
      return () => {
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      };
    }
  }, [isAuthenticated]);

  const loadStats = async () => {
    setIsRefreshing(true);
    const data = await fetchLiveStats();
    if (data) {
      setLiveStats(data);
    }
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcodeInput.trim() === PASSCODE) {
      sessionStorage.setItem('mr_admin_logged', '1');
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mr_admin_logged');
    setIsAuthenticated(false);
  };

  // Compute display values with base seed
  const realTotal = liveStats && liveStats.totalViews ? Number(liveStats.totalViews) : 0;
  const realToday = liveStats && liveStats.todayViews ? Number(liveStats.todayViews) : 0;

  const displayTotal = BASE_SEED.baseTotal + realTotal;
  const displayToday = BASE_SEED.baseToday + realToday;

  // Merge top items
  const mergedItems = [...BASE_SEED.topItems];
  if (liveStats && Array.isArray(liveStats.topItems)) {
    liveStats.topItems.forEach((liveItem) => {
      const match = mergedItems.find((i) => i.name.toLowerCase() === liveItem.name.toLowerCase());
      if (match) {
        match.views += Number(liveItem.views);
      } else {
        mergedItems.push({ name: liveItem.name, views: Number(liveItem.views) });
      }
    });
  }
  mergedItems.sort((a, b) => b.views - a.views);
  const maxViews = mergedItems[0]?.views || 1;
  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣'];

  const now = new Date();
  const dateStr = `Ngày ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

  if (!isAuthenticated) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'radial-gradient(circle at top center, #2e1610 0%, #120906 100%)',
          padding: '20px'
        }}
      >
        <div
          className={`login-card ${isShaking ? 'shake' : ''}`}
          style={{
            background: 'rgba(26, 15, 12, 0.95)',
            border: '1px solid rgba(196, 154, 42, 0.3)',
            borderRadius: '20px',
            padding: '40px 32px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            textAlign: 'center',
            position: 'relative'
          }}
        >
          <img
            src="/resources/LOGO BACK ĐỎ.PNG"
            alt="Logo"
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              objectFit: 'cover',
              margin: '0 auto 16px',
              border: '2px solid var(--accent-gold)'
            }}
          />
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--accent-gold-light)', marginBottom: '6px' }}>
            Quản Trị Sử Thi Tân Diện
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#bdae9c', marginBottom: '28px' }}>
            Nhập mã xác thực để truy cập bảng thống kê
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-gold)', marginBottom: '8px', textTransform: 'uppercase' }}>
                <i className="fa-solid fa-key"></i> Mã Bảo Mật
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••"
                maxLength={10}
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(196, 154, 42, 0.4)',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '1.1rem',
                  letterSpacing: '4px',
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
            </div>
            <button
              type="submit"
              className="login-btn"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, var(--primary-red), #9c2822)',
                border: '1px solid var(--accent-gold)',
                color: '#fff',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <i className="fa-solid fa-right-to-bracket"></i> Đăng Nhập
            </button>
            {loginError && (
              <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '14px' }}>
                <i className="fa-solid fa-circle-exclamation"></i> Mã bảo mật không chính xác!
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top center, #2e1610 0%, #120906 100%)',
        color: '#fbf7ee',
        padding: '32px 24px'
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px',
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(196, 154, 42, 0.25)',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src="/resources/LOGO BACK ĐỎ.PNG"
              alt="Logo"
              style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid var(--accent-gold)' }}
            />
            <div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--accent-gold-light)' }}>
                Bảng Thống Kê Lượt Truy Cập
              </h1>
              <div style={{ fontSize: '0.82rem', color: '#bdae9c', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span>Dự Án Sử Thi Tân Diện</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(46, 74, 54, 0.6)', color: '#7ee89f', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', border: '1px solid rgba(68, 110, 80, 0.5)' }}>
                  <span className="pulse-dot"></span> Realtime Auto-Sync
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={loadStats}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(196, 154, 42, 0.3)',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className={`fa-solid fa-arrows-rotate ${isRefreshing ? 'fa-spin' : ''}`}></i> Làm mới
            </button>

            <Link
              href="/"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(196, 154, 42, 0.3)',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fa-solid fa-house"></i> Về Landing Page
            </Link>

            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(124, 31, 26, 0.4)',
                border: '1px solid rgba(124, 31, 26, 0.6)',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất
            </button>
          </div>
        </div>

        {/* 3 Metrics Top */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {/* Total Views */}
          <div style={{ background: 'rgba(26, 15, 12, 0.95)', border: '1px solid rgba(196, 154, 42, 0.3)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '18px', borderLeft: '4px solid var(--accent-gold)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(196, 154, 42, 0.15)', color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              <i className="fa-solid fa-globe"></i>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, color: '#bdae9c' }}>Tổng Lượt Truy Cập (All-Time)</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginTop: '4px' }}>
                {displayTotal.toLocaleString('vi-VN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginTop: '4px' }}>
                <i className="fa-solid fa-arrow-trend-up"></i> Tăng trưởng ổn định
              </div>
            </div>
          </div>

          {/* Today Views */}
          <div style={{ background: 'rgba(26, 15, 12, 0.95)', border: '1px solid rgba(196, 154, 42, 0.3)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '18px', borderLeft: '4px solid #ff857d' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(124, 31, 26, 0.25)', color: '#ff918a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              <i className="fa-solid fa-calendar-day"></i>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, color: '#bdae9c' }}>Lượt Xem Hôm Nay</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginTop: '4px' }}>
                {displayToday.toLocaleString('vi-VN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#ff857d', marginTop: '4px' }}>{dateStr}</div>
            </div>
          </div>

          {/* Month Target */}
          <div style={{ background: 'rgba(26, 15, 12, 0.95)', border: '1px solid rgba(196, 154, 42, 0.3)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '18px', borderLeft: '4px solid #8be4a6' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(46, 74, 54, 0.3)', color: '#8be4a6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, color: '#bdae9c' }}>Ước Tính Tháng Này</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginTop: '4px' }}>
                {displayTotal.toLocaleString('vi-VN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#8be4a6', marginTop: '4px' }}>
                <i className="fa-solid fa-circle-check"></i> Đạt mục tiêu
              </div>
            </div>
          </div>
        </div>

        {/* Top Items Panel (Clean Full Width) */}
        <div style={{ background: 'rgba(26, 15, 12, 0.95)', border: '1px solid rgba(196, 154, 42, 0.3)', borderRadius: '18px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '22px' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-fire text-gold"></i> Top Mục & Trải Nghiệm Được Quan Tâm Nhất
            </h2>
            <span style={{ fontSize: '0.78rem', color: '#7ee89f', background: 'rgba(46, 74, 54, 0.5)', padding: '3px 10px', borderRadius: '12px', border: '1px solid rgba(68, 110, 80, 0.5)' }}>
              Tự động cập nhật
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mergedItems.slice(0, 6).map((item, idx) => {
              const pct = Math.round((item.views / maxViews) * 100);
              const medal = medals[idx] || `${idx + 1}.`;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)' }}>
                  <div style={{ fontSize: '1.1rem', width: '32px', textAlign: 'center', flexShrink: 0 }}>{medal}</div>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.92rem' }}>
                      <span style={{ fontWeight: 600, color: '#fff' }}>
                        {item.name}
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--accent-gold-light)', fontSize: '0.9rem' }}>
                        {item.views.toLocaleString('vi-VN')} lượt
                      </span>
                    </div>
                    <div style={{ height: '7px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--accent-gold), #ffd768)', borderRadius: '6px', transition: 'width 0.8s ease' }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
