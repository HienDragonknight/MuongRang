'use client';

import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/tracking';

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
      type: 'model-viewer',
      name: 'Nhà Sàn Truyền Thống Mường',
      category: 'Kiến trúc cổ',
      icon: 'fa-solid fa-house',
      src: '/3d/nhasan.glb',
      poster: '/resources/muong_stilt_house_hero.png',
      desc: 'Mô hình 3D chi tiết tái hiện không gian kiến trúc nhà sàn 4 mái, hệ thống cột giằng và cầu thang 9 bậc đặc trưng xứ Mường.'
    },
    chieng: {
      type: 'sketchfab',
      name: 'Chiêng Mường',
      category: 'Nhạc khí tâm linh',
      icon: 'fa-solid fa-compact-disc',
      embedUrl: 'https://sketchfab.com/models/062d910ebfa7478db164ad16bd48dbff/embed?autostart=1&transparent=1&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_stop=0&ui_vr=0&ui_fullscreen=0&ui_animations=0&ui_controls=0&ui_hint=0&ui_ar=0&preload=1',
      desc: 'Mô hình quét 3D thực tế chiêng Mường cổ - nhạc khí linh thiêng và biểu tượng tâm linh, nghệ thuật diễn xướng hàng đầu của xứ Mường.'
    },
    gui: {
      type: 'sketchfab',
      name: 'Gùi Dân Tộc Mường',
      category: 'Đan lát mây tre',
      icon: 'fa-solid fa-basket-shopping',
      embedUrl: 'https://sketchfab.com/models/37322b500b28492d90eb3d824afdd3ee/embed?autostart=1&transparent=1&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_stop=0&ui_vr=0&ui_fullscreen=0&ui_animations=0&ui_controls=0&ui_hint=0&ui_ar=0&preload=1',
      desc: 'Vật dụng đan lát mây tre tinh xảo đặc trưng của người Mường, dùng để gùi lúa bắp, rau củ và đồ dùng khi lên nương rẫy.'
    },
    liem: {
      type: 'sketchfab',
      name: 'Liềm Dân Tộc Mường',
      category: 'Nông cụ thu hoạch',
      icon: 'fa-solid fa-wheat-awn',
      embedUrl: 'https://sketchfab.com/models/35d376e4155b4eae85767b224a5509a1/embed?autostart=1&transparent=1&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_stop=0&ui_vr=0&ui_fullscreen=0&ui_animations=0&ui_controls=0&ui_hint=0&ui_ar=0&preload=1',
      desc: 'Nông cụ cầm tay rèn thủ công của người Mường, chuyên dùng gặt lúa nương, cắt cỏ và thu hái nông sản gắn với văn hóa lúa nước.'
    },
    na: {
      type: 'sketchfab',
      name: 'Ná (Nỏ) Săn Bắn Mường',
      category: 'Săn bắn & Tự vệ',
      icon: 'fa-solid fa-crosshairs',
      embedUrl: 'https://sketchfab.com/models/1488a531316048a8a6969ffb233cd6a7/embed?autostart=1&transparent=1&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_stop=0&ui_vr=0&ui_fullscreen=0&ui_animations=0&ui_controls=0&ui_hint=0&ui_ar=0&preload=1',
      desc: 'Vũ khí và công cụ săn bắt truyền thống làm từ gỗ rừng và dây gân dẻo dai, thể hiện sự mưu trí, dũng cảm của người thợ săn xứ Mường.'
    },
    sungkip: {
      type: 'sketchfab',
      name: 'Súng Kíp Dân Tộc Mường',
      category: 'Vũ khí săn bắn',
      icon: 'fa-solid fa-gun',
      embedUrl: 'https://sketchfab.com/models/e1f730d7c3cf4fb4b850ba7a989afb25/embed?autostart=1&transparent=1&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_stop=0&ui_vr=0&ui_fullscreen=0&ui_animations=0&ui_controls=0&ui_hint=0&ui_ar=0&preload=1',
      desc: 'Vũ khí săn bắn cổ truyền tự chế tác của người Mường với nòng sắt dài, báng gỗ uốn cong, nhồi thuốc súng và hạt nổ thủ công.'
    },
    dontre: {
      type: 'sketchfab',
      name: 'Dón Tre Mường',
      category: 'Vật dụng sinh hoạt',
      icon: 'fa-solid fa-boxes-stacked',
      embedUrl: 'https://sketchfab.com/models/3010d5b53d00414a84fe8b4b24076003/embed?autostart=1&transparent=1&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_stop=0&ui_vr=0&ui_fullscreen=0&ui_animations=0&ui_controls=0&ui_hint=0&ui_ar=0&preload=1',
      desc: 'Vật dụng đan lát tre nứa truyền thống của người Mường, dùng đựng và bảo quản thực phẩm, nông sản hàng ngày.'
    },
    bua: {
      type: 'sketchfab',
      name: 'Bừa Gỗ Cổ',
      category: 'Nông nghiệp lúa nước',
      icon: 'fa-solid fa-bars-staggered',
      embedUrl: 'https://sketchfab.com/models/fe951add1f614dd79e1470e6b937ef58/embed?autostart=1&transparent=1&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_stop=0&ui_vr=0&ui_fullscreen=0&ui_animations=0&ui_controls=0&ui_hint=0&ui_ar=0&preload=1',
      desc: 'Nông cụ truyền thống dùng sức kéo của trâu bò để làm tơi xốp, phẳng mặt ruộng nước trước khi cấy lúa.'
    },
    cay: {
      type: 'sketchfab',
      name: 'Cày Gỗ Xứ Mường',
      category: 'Nông cụ cày cấy',
      icon: 'fa-solid fa-wrench',
      embedUrl: 'https://sketchfab.com/models/8ff8a9ed99014ee09de2012257806f70/embed?autostart=1&transparent=1&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_stop=0&ui_vr=0&ui_fullscreen=0&ui_animations=0&ui_controls=0&ui_hint=0&ui_ar=0&preload=1',
      desc: 'Cày gỗ gắn lưỡi cày rèn sắt sắc bén của người Mường, công cụ cơ bản để vỡ đất, cày ải đất ruộng nương.'
    },
    huongan: {
      type: 'sketchfab',
      name: 'Hương Án Thờ Cổ',
      category: 'Nghi lễ tín ngưỡng',
      icon: 'fa-solid fa-place-of-worship',
      embedUrl: 'https://sketchfab.com/models/972ab717b3cc4118831565e768ecf542/embed?autostart=1&transparent=1&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_stop=0&ui_vr=0&ui_fullscreen=0&ui_animations=0&ui_controls=0&ui_hint=0&ui_ar=0&preload=1',
      desc: 'Bàn thờ hương án gỗ chạm khắc hoa văn cổ kính, dùng trong các nghi lễ thờ cúng tổ tiên, thần linh và mo Mường.'
    }
  };

  const handleSelectModel = (modelKey) => {
    setActiveModel(modelKey);
    const model = models[modelKey];
    if (model) {
      trackEvent('track', `model-3d-${modelKey}`, `Mô hình 3D: ${model.name}`);
    }
  };

  const current = models[activeModel] || models.nhasan;

  return (
    <div
      className="model-3d-explorer-wrapper"
      style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
        border: '1px solid rgba(196, 154, 42, 0.25)',
        overflow: 'hidden'
      }}
    >
      <div className="model-3d-layout">
        {/* LEFT SIDEBAR */}
        <aside className="model-3d-sidebar">
          {/* Sidebar Header */}
          <div className="model-3d-sidebar-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span className="sidebar-badge-tag">Danh mục hiện vật</span>
              <span className="sidebar-counter-badge">
                {Object.keys(models).length} hiện vật
              </span>
            </div>
            <h4 className="sidebar-main-title">
              Di Sản 3D Xứ Mường
            </h4>
          </div>

          {/* Sidebar List */}
          <div className="model-3d-sidebar-scroll">
            {Object.entries(models).map(([key, model]) => {
              const isActive = activeModel === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSelectModel(key)}
                  className={`model-item-btn ${isActive ? 'active' : ''}`}
                >
                  <div className={`model-item-icon-box ${isActive ? 'active' : ''}`}>
                    <i className={model.icon}></i>
                  </div>
                  <div className="model-item-text-wrap">
                    <div className="model-item-title">
                      {model.name}
                    </div>
                    <div className="model-item-category">
                      {model.category}
                    </div>
                  </div>
                  {isActive && (
                    <i className="fa-solid fa-chevron-right active-indicator-arrow"></i>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* RIGHT 3D STAGE & DETAILS */}
        <main className="model-3d-content">
          {/* Header Bar */}
          <div className="model-3d-stage-topbar">
            <div>
              <span className="stage-category-tag">
                {current.category}
              </span>
              <h3 className="stage-item-title">
                {current.name}
              </h3>
            </div>
            <div className="stage-interaction-hint">
              <i className="fa-solid fa-hand-pointer"></i>
              <span>Kéo xoay 360° • Lăn chuột thu phóng</span>
            </div>
          </div>

          {/* 3D Canvas Stage */}
          <div className="model-3d-stage-canvas">
            {current.type === 'sketchfab' ? (
              <iframe
                title={current.name}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
                mozallowfullscreen="true"
                webkitallowfullscreen="true"
                src={current.embedUrl}
              />
            ) : modelLoaded ? (
              <model-viewer
                src={current.src}
                poster={current.poster}
                alt={current.name}
                auto-rotate
                camera-controls
                shadow-intensity="1.2"
                exposure="1.0"
                interaction-prompt="auto"
                style={{ width: '100%', height: '100%' }}
              >
                <div
                  slot="poster"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    flexDirection: 'column',
                    color: 'var(--earth-brown)'
                  }}
                >
                  <i
                    className="fa-solid fa-spinner fa-spin"
                    style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--primary-red)' }}
                  ></i>
                  <span style={{ fontSize: '0.85rem' }}>Đang tải mô hình 3D di sản...</span>
                </div>
              </model-viewer>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  flexDirection: 'column',
                  color: 'var(--earth-brown)'
                }}
              >
                <i
                  className="fa-solid fa-spinner fa-spin"
                  style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--accent-gold)' }}
                ></i>
                <p style={{ fontSize: '0.85rem' }}>Đang chuẩn bị trình xem mô hình 3D...</p>
              </div>
            )}
          </div>

          {/* Description Footer */}
          <div className="model-3d-stage-desc">
            <i className="fa-solid fa-circle-info desc-icon"></i>
            <p className="desc-text">
              {current.desc}
            </p>
          </div>
        </main>
      </div>

      <style jsx>{`
        .model-3d-layout {
          display: grid;
          grid-template-columns: 285px 1fr;
          min-height: 520px;
        }

        .model-3d-sidebar {
          background: var(--paper-beige-dark, #ede4d0);
          border-right: 1px solid rgba(196, 154, 42, 0.2);
          display: flex;
          flex-direction: column;
        }

        .model-3d-sidebar-header {
          padding: 16px 18px;
          border-bottom: 1px solid rgba(196, 154, 42, 0.2);
          background: rgba(255, 255, 255, 0.5);
        }

        .sidebar-badge-tag {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--accent-gold, #c49a2a);
        }

        .sidebar-counter-badge {
          font-size: 0.72rem;
          font-weight: 700;
          background: var(--primary-red);
          color: white;
          padding: 2px 8px;
          borderRadius: 12px;
        }

        .sidebar-main-title {
          margin: 4px 0 0;
          font-family: var(--font-subheading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--charcoal-black);
        }

        .model-3d-sidebar-scroll {
          padding: 10px 12px;
          overflow-y: auto;
          max-height: 460px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .model-3d-sidebar-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .model-3d-sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(196, 154, 42, 0.4);
          border-radius: 10px;
        }

        .model-item-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.7);
          color: var(--text-dark);
          cursor: pointer;
          text-align: left;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .model-item-btn:hover:not(.active) {
          background: white;
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .model-item-btn.active {
          border-color: var(--primary-red);
          background: var(--primary-red);
          color: white;
          box-shadow: 0 6px 18px rgba(124, 31, 26, 0.28);
          transform: translateX(2px);
        }

        .model-item-icon-box {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(196, 154, 42, 0.15);
          color: var(--primary-red);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .model-item-icon-box.active {
          background: rgba(255, 255, 255, 0.2);
          color: var(--accent-gold-light, #ffd700);
        }

        .model-item-text-wrap {
          flex: 1;
          min-width: 0;
        }

        .model-item-title {
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .model-item-btn.active .model-item-title {
          font-weight: 700;
        }

        .model-item-category {
          font-size: 0.72rem;
          color: #7a6a58;
          margin-top: 1px;
        }

        .model-item-btn.active .model-item-category {
          color: rgba(255, 255, 255, 0.82);
        }

        .active-indicator-arrow {
          font-size: 0.75rem;
          color: var(--accent-gold-light);
        }

        .model-3d-content {
          display: flex;
          flex-direction: column;
          padding: 16px 20px;
          background: white;
        }

        .model-3d-stage-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          flex-wrap: wrap;
          gap: 8px;
        }

        .stage-category-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary-red);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stage-item-title {
          margin: 2px 0 0;
          font-family: var(--font-heading);
          font-size: 1.25rem;
          color: var(--charcoal-black);
        }

        .stage-interaction-hint {
          font-size: 0.75rem;
          background: var(--paper-beige);
          color: var(--earth-brown);
          padding: 4px 12px;
          border-radius: 20px;
          border: 1px solid rgba(196, 154, 42, 0.3);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .stage-interaction-hint i {
          color: var(--primary-red);
        }

        .model-3d-stage-canvas {
          width: 100%;
          height: 400px;
          background: radial-gradient(circle, #f7f0e3 0%, #ede4d0 100%);
          border-radius: 14px;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(196, 154, 42, 0.2);
        }

        .model-3d-stage-desc {
          margin-top: 10px;
          padding: 10px 14px;
          background: var(--paper-beige);
          border-radius: 10px;
          border-left: 3px solid var(--primary-red);
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .desc-icon {
          color: var(--primary-red);
          margin-top: 2px;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .desc-text {
          font-size: 0.84rem;
          margin: 0;
          color: var(--text-dark);
          line-height: 1.45;
        }

        /* Responsive Tablet & Mobile */
        @media (max-width: 960px) {
          .model-3d-layout {
            grid-template-columns: 240px 1fr;
          }
          .model-3d-stage-canvas {
            height: 360px;
          }
        }

        @media (max-width: 820px) {
          .model-3d-layout {
            grid-template-columns: 1fr;
          }
          .model-3d-sidebar {
            border-right: none;
            border-bottom: 1px solid rgba(196, 154, 42, 0.2);
          }
          .model-3d-sidebar-header {
            padding: 12px 14px;
          }
          .model-3d-sidebar-scroll {
            max-height: none;
            display: flex;
            flex-direction: row;
            overflow-x: auto;
            overflow-y: hidden;
            padding: 8px 12px 12px;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }
          .model-item-btn {
            flex-shrink: 0;
            width: auto;
            min-width: 170px;
            scroll-snap-align: start;
            padding: 8px 12px;
          }
          .model-3d-content {
            padding: 14px;
          }
          .model-3d-stage-canvas {
            height: 320px;
          }
          .stage-item-title {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 480px) {
          .model-3d-stage-canvas {
            height: 280px;
          }
          .stage-interaction-hint span {
            font-size: 0.7rem;
          }
          .stage-interaction-hint {
            padding: 3px 8px;
          }
          .model-item-btn {
            min-width: 155px;
          }
        }
      `}</style>
    </div>
  );
}

