'use client';

import { useEffect, useState } from 'react';

export default function Model3DViewer() {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [activeModel, setActiveModel] = useState('nhasan');

  useEffect(() => {
    // Dynamically import @google/model-viewer on client side only
    import('@google/model-viewer').then(() => {
      setModelLoaded(true);
    }).catch(() => {
      // Fallback: inject script tag
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
      script.onload = () => setModelLoaded(true);
      document.head.appendChild(script);
    });
  }, []);

  const models = {
    nhasan: {
      name: 'Nhà Sàn Truyền Thống Mường',
      src: '/3d/nhasan.glb',
      poster: '/resources/muong_stilt_house_hero.png',
      desc: 'Mô hình 3D chi tiết tái hiện không gian kiến trúc nhà sàn 4 mái, hệ thống cột giằng và cầu thang 9 bậc đặc trưng xứ Mường.'
    },
    doorknob: {
      name: 'Họa Tiết & Cổ Vật Đồng',
      src: '/3d/round metal doorknob 3d model.glb',
      poster: '/resources/muong_silver_jewelry.png',
      desc: 'Chi tiết chế tác kim loại và hoa văn đồng cổ thể hiện trình độ đúc đồng và nghệ thuật chạm khắc tinh xảo.'
    }
  };

  return (
    <div className="model-3d-viewer-container" style={{ background: 'white', borderRadius: '18px', padding: '28px', boxShadow: '0 12px 36px rgba(0,0,0,0.06)' }}>
      {/* Model Switcher Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeModel === 'nhasan' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.9rem', padding: '8px 18px' }}
          onClick={() => setActiveModel('nhasan')}
        >
          <i className="fa-solid fa-house"></i> Nhà Sàn Mường 3D
        </button>
        <button
          className={`btn ${activeModel === 'doorknob' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.9rem', padding: '8px 18px' }}
          onClick={() => setActiveModel('doorknob')}
        >
          <i className="fa-solid fa-coins"></i> Cổ Vật Đồng 3D
        </button>
      </div>

      {/* Model Viewer Stage */}
      <div style={{ width: '100%', height: '480px', background: 'radial-gradient(circle, #f7f0e3 0%, #ede4d0 100%)', borderRadius: '14px', position: 'relative', overflow: 'hidden' }}>
        {modelLoaded ? (
          <model-viewer
            src={models[activeModel].src}
            poster={models[activeModel].poster}
            alt={models[activeModel].name}
            auto-rotate
            camera-controls
            shadow-intensity="1.2"
            exposure="1.0"
            interaction-prompt="auto"
            style={{ width: '100%', height: '100%' }}
          >
            <div slot="poster" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', color: 'var(--earth-brown)' }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--primary-red)' }}></i>
              <span>Đang tải mô hình 3D di sản...</span>
            </div>
          </model-viewer>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', color: 'var(--earth-brown)' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2.5rem', marginBottom: '12px', color: 'var(--accent-gold)' }}></i>
            <p>Đang chuẩn bị trình xem mô hình 3D...</p>
          </div>
        )}

        <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.65)', color: 'var(--accent-gold-light)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.78rem', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          <i className="fa-solid fa-hand-pointer"></i> Kéo chuột hoặc vuốt để xoay 360° • Lăn chuột để phóng to/thu nhỏ
        </div>
      </div>

      {/* Model Description */}
      <div style={{ marginTop: '18px', padding: '14px 18px', background: 'var(--paper-beige)', borderRadius: '10px', borderLeft: '3px solid var(--accent-gold)' }}>
        <h4 style={{ color: 'var(--primary-red)', marginBottom: '4px', fontSize: '1.05rem' }}>{models[activeModel].name}</h4>
        <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-dark)' }}>{models[activeModel].desc}</p>
      </div>
    </div>
  );
}
