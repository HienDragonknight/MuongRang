'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/tracking';

export default function VRSection() {
  const [isRotating, setIsRotating] = useState(true);
  const viewerRef = useRef(null);

  useEffect(() => {
    // Load Pannellum scripts
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
      script.onload = () => {
        if (window.pannellum && document.getElementById('panorama-next')) {
          try {
            viewerRef.current = window.pannellum.viewer('panorama-next', {
              type: 'equirectangular',
              panorama: '/VR360/photo360.jpg',
              autoLoad: true,
              autoRotate: -2,
              showControls: true,
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
      viewerRef.current.setHfov(Math.max(50, Math.min(120, currentHfov + delta)));
    }
  };

  const handleMuseumClick = () => {
    trackEvent('track', 'tham-quan-bao-tang-metasteps', 'Tham quan Bảo Tàng Ảo MetaSteps');
  };

  return (
    <section className="vr-interactive-section" id="vr-tuong-tac" style={{ padding: '80px 0' }}>
      <div className="container">
        {/* Intro */}
        <div className="section-intro">
          <span className="intro-tag">Trải Nghiệm Đa Chiều</span>
          <h2 className="intro-title">Không Gian VR 360° & Bảo Tàng Ảo</h2>
          <p>Khám phá không gian nhà sàn Mường cổ qua góc nhìn thực tế ảo 360 độ và tham quan bảo tàng trực tuyến sống động.</p>
        </div>

        {/* Action Button Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div
            className="btn btn-secondary"
            style={{ padding: '10px 24px', borderRadius: '30px', cursor: 'default', background: 'var(--charcoal-black, #1a1a1a)', color: 'var(--accent-gold, #D4AF37)', borderColor: 'var(--accent-gold, #D4AF37)' }}
          >
            <i className="fa-solid fa-vr-cardboard"></i> Không Gian VR 360° Nhà Sàn
          </div>

          <a
            href="https://metasteps.com/curate/2bac9e13-ef6d-4c3e-aca0-7dfc028f17b4"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            onClick={handleMuseumClick}
            style={{
              padding: '10px 26px',
              borderRadius: '30px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 20px rgba(184, 51, 42, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fa-solid fa-landmark"></i>
            <span>Tham Quan Bảo Tàng Ảo (MetaSteps)</span>
            <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.85rem' }}></i>
          </a>
        </div>

        {/* VR 360 Stage */}
        <div className="vr360-stage-wrapper" style={{ position: 'relative', width: '100%', height: '540px', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 16px 45px rgba(0,0,0,0.18)' }}>
          <div id="panorama-next" style={{ width: '100%', height: '100%' }}></div>

          {/* Top Badge */}
          <div style={{ position: 'absolute', top: '20px', left: '24px', zIndex: 10, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', padding: '8px 16px', borderRadius: '12px', color: 'white', border: '1px solid rgba(196,154,42,0.4)' }}>
            <span style={{ color: 'var(--accent-gold-light)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <i className="fa-solid fa-vr-cardboard"></i> VR 360 Live
            </span>
            <h3 style={{ fontSize: '1.1rem', margin: '2px 0 0', fontFamily: 'var(--font-heading)' }}>Không Gian Nhà Sàn 360°</h3>
          </div>

          {/* Controls Bar */}
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '8px 16px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.15)' }}>
            <button
              className="btn-action"
              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '6px 10px', fontSize: '1rem' }}
              onClick={() => handleZoom(-15)}
              title="Phóng to"
            >
              <i className="fa-solid fa-magnifying-glass-plus"></i>
            </button>
            <button
              className="btn-action"
              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '6px 10px', fontSize: '1rem' }}
              onClick={() => handleZoom(15)}
              title="Thu nhỏ"
            >
              <i className="fa-solid fa-magnifying-glass-minus"></i>
            </button>
            <button
              className="btn-action"
              style={{ background: 'transparent', border: 'none', color: isRotating ? 'var(--accent-gold)' : 'white', cursor: 'pointer', padding: '6px 10px', fontSize: '1rem' }}
              onClick={toggleRotate}
              title="Tự động xoay"
            >
              <i className="fa-solid fa-rotate"></i>
            </button>
            <Link
              href="/vr360"
              className="btn-action"
              style={{ background: 'transparent', border: 'none', color: 'white', textDecoration: 'none', padding: '6px 10px', fontSize: '1rem' }}
              title="Xem chế độ toàn màn hình VR"
            >
              <i className="fa-solid fa-expand"></i>
            </Link>
          </div>
        </div>

        {/* Museum MetaSteps Promotion Card */}
        <div style={{
          marginTop: '36px',
          background: 'linear-gradient(135deg, rgba(107, 31, 26, 0.95), rgba(45, 13, 11, 0.95))',
          borderRadius: '16px',
          padding: '28px 36px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          border: '1px solid rgba(212, 175, 55, 0.3)'
        }}>
          <div style={{ maxWidth: '650px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold, #D4AF37)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
              <i className="fa-solid fa-sparkles"></i> Không Gian Triển Lãm Trực Tuyến
            </div>
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', margin: '0 0 8px 0', color: '#fff' }}>
              Tham Quan Không Gian Bảo Tàng Ảo Mường Răng
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.6 }}>
              Bước vào không gian triển lãm bảo tàng số 3D trên MetaSteps để chiêm ngưỡng toàn cảnh không gian trưng bày hiện vật, hình ảnh và tư liệu sử thi sống động.
            </p>
          </div>
          <div>
            <a
              href="https://metasteps.com/curate/2bac9e13-ef6d-4c3e-aca0-7dfc028f17b4"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              onClick={handleMuseumClick}
              style={{
                background: 'var(--accent-gold, #D4AF37)',
                color: '#1a1a1a',
                fontWeight: 700,
                padding: '14px 28px',
                borderRadius: '30px',
                border: 'none',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                whiteSpace: 'nowrap'
              }}
            >
              <i className="fa-solid fa-door-open"></i>
              <span>Vào Tham Quan Ngay</span>
              <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.85rem' }}></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
