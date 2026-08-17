'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Model3DViewer from './Model3DViewer';
import { trackEvent } from '@/lib/tracking';

export default function VRSection() {
  const [activeTab, setActiveTab] = useState('vr');
  const [isRotating, setIsRotating] = useState(true);
  const viewerRef = useRef(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'vr') {
      trackEvent('track', 'vr-360-viewer', 'Trải nghiệm VR 360 Không gian Mường');
    } else {
      trackEvent('track', 'model-3d-nhasan', 'Mô hình 3D Trống Đồng & Nhà Sàn');
    }
  };

  useEffect(() => {
    if (activeTab === 'vr') {
      // Load Pannellum scripts if not loaded
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
    }
  }, [activeTab]);

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

  return (
    <section className="vr-interactive-section" id="vr-tuong-tac" style={{ padding: '80px 0' }}>
      <div className="container">
        {/* Intro */}
        <div className="section-intro">
          <span className="intro-tag">Trải Nghiệm Đa Chiều</span>
          <h2 className="intro-title">Mô Phỏng Trực Quan 3D & VR 360°</h2>
          <p>Khám phá không gian nhà sàn Mường cổ qua góc nhìn 360 độ hoặc tương tác xoay ngắm mô hình 3D.</p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
          <button
            className={`btn ${activeTab === 'vr' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '10px 24px', borderRadius: '30px' }}
            onClick={() => handleTabChange('vr')}
          >
            <i className="fa-solid fa-vr-cardboard"></i> Không Gian VR 360°
          </button>
          <button
            className={`btn ${activeTab === '3d' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '10px 24px', borderRadius: '30px' }}
            onClick={() => handleTabChange('3d')}
          >
            <i className="fa-solid fa-cube"></i> Trưng Bày 3D Cổ Vật
          </button>
        </div>

        {/* VR 360 Pane */}
        {activeTab === 'vr' && (
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
        )}

        {/* 3D Model Pane */}
        {activeTab === '3d' && (
          <Model3DViewer />
        )}
      </div>
    </section>
  );
}
