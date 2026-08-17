'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function VR360Page() {
  const [isRotating, setIsRotating] = useState(true);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
      script.onload = () => {
        if (window.pannellum && document.getElementById('full-panorama')) {
          try {
            viewerRef.current = window.pannellum.viewer('full-panorama', {
              type: 'equirectangular',
              panorama: '/VR360/photo360.jpg',
              autoLoad: true,
              autoRotate: -2,
              showControls: false,
              compass: true
            });
          } catch (e) {}
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  const toggleRotate = () => {
    if (viewerRef.current) {
      if (isRotating) {
        viewerRef.current.stopAutoRotate();
        setIsRotating(false);
      } else {
        viewerRef.current.startAutoRotate(-2);
        setIsRotating(true);
      }
    }
  };

  const handleZoom = (delta) => {
    if (viewerRef.current) {
      const currentHfov = viewerRef.current.getHfov();
      viewerRef.current.setHfov(Math.max(40, Math.min(120, currentHfov + delta)));
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#120906' }}>
      {/* Panorama Canvas */}
      <div id="full-panorama" style={{ width: '100%', height: '100%' }}></div>

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
          background: 'rgba(0,0,0,0.7)',
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
            color: 'var(--accent-gold-light)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        >
          <i className="fa-solid fa-arrow-left"></i> Quay lại
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Không Gian Nhà Sàn 360°</span>
      </div>

      {/* Bottom Floating Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          gap: '12px',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(10px)',
          padding: '10px 20px',
          borderRadius: '30px',
          border: '1px solid rgba(255,255,255,0.15)'
        }}
      >
        <button
          onClick={() => handleZoom(-15)}
          style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.1rem', padding: '6px' }}
          title="Phóng to"
        >
          <i className="fa-solid fa-magnifying-glass-plus"></i>
        </button>
        <button
          onClick={() => handleZoom(15)}
          style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.1rem', padding: '6px' }}
          title="Thu nhỏ"
        >
          <i className="fa-solid fa-magnifying-glass-minus"></i>
        </button>
        <button
          onClick={toggleRotate}
          style={{ background: 'transparent', border: 'none', color: isRotating ? 'var(--accent-gold)' : 'white', cursor: 'pointer', fontSize: '1.1rem', padding: '6px' }}
          title="Tự động xoay"
        >
          <i className="fa-solid fa-rotate"></i>
        </button>
      </div>
    </div>
  );
}
