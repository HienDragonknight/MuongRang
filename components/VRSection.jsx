'use client';

import { useState } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/tracking';

export default function VRSection() {
  const handleMuseumClick = () => {
    trackEvent('track', 'tham-quan-bao-tang-metasteps', 'Tham quan Bảo Tàng Ảo MetaSteps');
  };

  return (
    <section className="vr-interactive-section" id="vr-tuong-tac" style={{ padding: '80px 0' }}>
      <div className="container">
        {/* Intro */}
        <div className="section-intro">
          <span className="intro-tag">Không Gian Số Hóa 3D</span>
          <h2 className="intro-title">Triển Lãm Sắc Mường Đương Đại (3D & VR)</h2>
          <p>
            Khám phá không gian bảo tàng ảo 3D trực tuyến sống động, tương tác và chiêm ngưỡng các hiện vật, hình ảnh văn hóa Mường độc bản.
          </p>
        </div>

        {/* Action Button Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div
            className="btn btn-secondary"
            style={{
              padding: '10px 24px',
              borderRadius: '30px',
              cursor: 'default',
              background: 'var(--charcoal-black, #1a1a1a)',
              color: 'var(--accent-gold, #D4AF37)',
              borderColor: 'var(--accent-gold, #D4AF37)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="fa-solid fa-cube"></i> Bảo Tàng 3D Tương Tác Trực Tiếp
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
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
            <span>Mở Cửa Sổ Riêng Trên MetaSteps</span>
          </a>
        </div>

        {/* 3D Exhibition Frame */}
        <div
          className="vr360-stage-wrapper"
          style={{
            position: 'relative',
            width: '100%',
            height: '640px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            background: '#120906'
          }}
        >
          <iframe
            width="100%"
            height="100%"
            style={{ border: 'none', display: 'block', width: '100%', height: '100%' }}
            src="https://metasteps.com/viewer/embed/2bac9e13-ef6d-4c3e-aca0-7dfc028f17b4?showSignIn=0&showCommunications=0&showOrbitButton=0&showSettingsButton=0&showSoundButton=0&showLikeButton=0&forceOrbitCamera=0"
            title="Triễn Lãm Sắc Mường Đương Đại"
            allow="fullscreen; accelerometer; gyroscope; magnetometer; vr; xr-spatial-tracking"
            allowFullScreen
          ></iframe>
        </div>

        {/* Feature & Instruction Cards */}
        <div
          style={{
            marginTop: '28px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '18px'
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px 24px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(212, 175, 55, 0.15)',
                color: 'var(--accent-gold, #D4AF37)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                flexShrink: 0
              }}
            >
              <i className="fa-solid fa-hand-pointer"></i>
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--charcoal-black)' }}>
                Tự Do Di Chuyển
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', lineHeight: 1.4 }}>
                Kéo giữ chuột hoặc vuốt màn hình để xoay và bước vào từng gian phòng.
              </p>
            </div>
          </div>

          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px 24px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(184, 51, 42, 0.12)',
                color: 'var(--accent-red, #B8332A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                flexShrink: 0
              }}
            >
              <i className="fa-solid fa-circle-info"></i>
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--charcoal-black)' }}>
                Xem Chi Tiết Hiện Vật
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', lineHeight: 1.4 }}>
                Nhấp vào các tác phẩm, hiện vật để đọc thông tin và thuyết minh chi tiết.
              </p>
            </div>
          </div>

          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px 24px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(40, 167, 69, 0.12)',
                color: '#28a745',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                flexShrink: 0
              }}
            >
              <i className="fa-solid fa-expand"></i>
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--charcoal-black)' }}>
                Chế Độ Toàn Màn Hình
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', lineHeight: 1.4 }}>
                Bật toàn màn hình hoặc dùng kính VR để có trải nghiệm chìm đắm nhất.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
