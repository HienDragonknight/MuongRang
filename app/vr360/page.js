'use client';

import Link from 'next/link';

export default function VR360Page() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#120906' }}>
      {/* 3D Exhibition Iframe */}
      <iframe
        src="https://metasteps.com/viewer/embed/2bac9e13-ef6d-4c3e-aca0-7dfc028f17b4?showSignIn=0&showCommunications=0&showOrbitButton=0&showSettingsButton=0&showSoundButton=0&showLikeButton=0&forceOrbitCamera=0"
        title="Triễn Lãm Sắc Mường Đương Đại"
        width="100%"
        height="100%"
        style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
        allow="fullscreen; accelerometer; gyroscope; magnetometer; vr; xr-spatial-tracking"
        allowFullScreen
      ></iframe>

      {/* Top Floating Bar */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(10px)',
          padding: '10px 18px',
          borderRadius: '30px',
          border: '1px solid rgba(196, 154, 42, 0.4)',
          color: 'white'
        }}
      >
        <Link
          href="/#vr-tuong-tac"
          style={{
            color: 'var(--accent-gold-light, #f0d575)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        >
          <i className="fa-solid fa-arrow-left"></i> Quay lại trang chủ
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Triển Lãm Sắc Mường Đương Đại (3D & VR)</span>
      </div>
    </div>
  );
}
