'use client';

import { useState, useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/tracking';

export default function ExhibitionSection() {
  const [trienLamIdx, setTrienLamIdx] = useState(0);
  const [talkshowIdx, setTalkshowIdx] = useState(0);
  const [isHoverTrienLam, setIsHoverTrienLam] = useState(false);
  const [isHoverTalkshow, setIsHoverTalkshow] = useState(false);

  // Danh sách ảnh Triển Lãm (chính xác các file thực tế trong thư mục)
  const trienLamImages = [
    '/resources/trienlam_images/TRI%E1%BB%82N%20L%C3%83M/DSC00447.jpeg',
    '/resources/trienlam_images/TRI%E1%BB%82N%20L%C3%83M/DSC00449.jpeg',
    '/resources/trienlam_images/TRI%E1%BB%82N%20L%C3%83M/DSC00454.jpeg',
    '/resources/trienlam_images/TRI%E1%BB%82N%20L%C3%83M/DSC00458.jpeg',
    '/resources/trienlam_images/TRI%E1%BB%82N%20L%C3%83M/DSC00474.jpeg',
    '/resources/trienlam_images/TRI%E1%BB%82N%20L%C3%83M/DSC00533.jpeg',
    '/resources/trienlam_images/TRI%E1%BB%82N%20L%C3%83M/DSC00559.jpeg',
    '/resources/trienlam_images/TRI%E1%BB%82N%20L%C3%83M/DSC00628.jpeg',
    '/resources/trienlam_images/TRI%E1%BB%82N%20L%C3%83M/DSC00716.jpeg',
    '/resources/trienlam_images/TRI%E1%BB%82N%20L%C3%83M/DSC00731.jpeg',
    '/resources/trienlam_images/TRI%E1%BB%82N%20L%C3%83M/DSC00851.jpeg'
  ];

  // Danh sách ảnh Talkshow (chính xác các file thực tế trong thư mục)
  const talkshowImages = [
    '/resources/talkshow_images/TALKSHOW/DSC02996.jpeg',
    '/resources/talkshow_images/TALKSHOW/DSC03002.jpeg',
    '/resources/talkshow_images/TALKSHOW/DSC03048.jpeg',
    '/resources/talkshow_images/TALKSHOW/DSC03090.jpeg',
    '/resources/talkshow_images/TALKSHOW/DSC03195.jpeg',
    '/resources/talkshow_images/TALKSHOW/DSC03227.jpeg',
    '/resources/talkshow_images/TALKSHOW/DSC03432.jpeg',
    '/resources/talkshow_images/TALKSHOW/DSC03632.jpeg',
    '/resources/talkshow_images/TALKSHOW/DSC03768.jpeg',
    '/resources/talkshow_images/TALKSHOW/DSC03823.jpeg'
  ];

  const handleNextTrienLam = () => {
    setTrienLamIdx((prev) => (prev + 1) % trienLamImages.length);
    trackEvent('track', 'trien-lam-ar', 'Triển Lãm Thực Tế Tăng Cường AR');
  };

  const handlePrevTrienLam = () => {
    setTrienLamIdx((prev) => (prev - 1 + trienLamImages.length) % trienLamImages.length);
    trackEvent('track', 'trien-lam-ar', 'Triển Lãm Thực Tế Tăng Cường AR');
  };

  const handleNextTalkshow = () => {
    setTalkshowIdx((prev) => (prev + 1) % talkshowImages.length);
    trackEvent('track', 'talkshow-ky-nguyen-so', 'Talkshow Sử Thi Trong Kỷ Nguyên Số');
  };

  const handlePrevTalkshow = () => {
    setTalkshowIdx((prev) => (prev - 1 + talkshowImages.length) % talkshowImages.length);
    trackEvent('track', 'talkshow-ky-nguyen-so', 'Talkshow Sử Thi Trong Kỷ Nguyên Số');
  };

  // Tự động chuyển slide mượt mà (tự dừng khi rê chuột lên)
  useEffect(() => {
    if (isHoverTrienLam) return;
    const timer = setInterval(() => {
      setTrienLamIdx((prev) => (prev + 1) % trienLamImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHoverTrienLam, trienLamImages.length]);

  useEffect(() => {
    if (isHoverTalkshow) return;
    const timer = setInterval(() => {
      setTalkshowIdx((prev) => (prev + 1) % talkshowImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHoverTalkshow, talkshowImages.length]);

  return (
    <section className="about-journey-section" style={{ padding: '80px 0', background: 'white' }}>
      <div className="container">
        <div className="section-intro">
          <span className="intro-tag">Dấu Ấn Hành Trình</span>
          <h2 className="intro-title">Sắc Mường Đương Đại &amp; Triển Lãm Thực Tế Tăng Cường</h2>
          <p>Các hoạt động triển lãm văn hóa và tọa đàm lan tỏa di sản Đẻ Đất Đẻ Nước đến cộng đồng người trẻ.</p>
        </div>

        {/* 1. Triển lãm AR */}
        <div
          className="journey-card"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'center',
            marginBottom: '60px',
            background: 'var(--paper-beige)',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.06)'
          }}
        >
          {/* Slider Container with Smooth Crossfade */}
          <div
            className="journey-card-img-wrapper"
            onMouseEnter={() => setIsHoverTrienLam(true)}
            onMouseLeave={() => setIsHoverTrienLam(false)}
            style={{
              position: 'relative',
              width: '100%',
              height: '420px',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
              background: '#1a110d'
            }}
          >
            {/* Render all images layered for instant, zero-lag crossfade */}
            {trienLamImages.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`Triển lãm AR Sử Thi Tân Diện - ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: i === trienLamIdx ? 1 : 0,
                  visibility: i === trienLamIdx ? 'visible' : 'hidden',
                  transform: i === trienLamIdx ? 'scale(1) translateZ(0)' : 'scale(1.03) translateZ(0)',
                  transition: 'opacity 0.5s ease, transform 0.6s ease',
                  willChange: i === trienLamIdx ? 'opacity, transform' : 'auto',
                  zIndex: i === trienLamIdx ? 2 : 1
                }}
              />
            ))}

            {/* Counter Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                background: 'rgba(20, 10, 8, 0.75)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 600,
                zIndex: 10,
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <i className="fa-solid fa-images" style={{ marginRight: '6px', color: 'var(--accent-gold)' }}></i>
              {trienLamIdx + 1} / {trienLamImages.length}
            </div>

            {/* Prev Button */}
            <button
              onClick={handlePrevTrienLam}
              aria-label="Ảnh trước"
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(20, 10, 8, 0.65)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-red)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(20, 10, 8, 0.65)')}
            >
              <i className="fa-solid fa-chevron-left" style={{ fontSize: '1rem' }}></i>
            </button>

            {/* Next Button */}
            <button
              onClick={handleNextTrienLam}
              aria-label="Ảnh kế tiếp"
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(20, 10, 8, 0.65)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-red)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(20, 10, 8, 0.65)')}
            >
              <i className="fa-solid fa-chevron-right" style={{ fontSize: '1rem' }}></i>
            </button>
          </div>

          {/* Content */}
          <div className="journey-card-content">
            <span
              style={{
                background: 'var(--accent-gold)',
                color: 'var(--charcoal-black)',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '5px 14px',
                borderRadius: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Triển Lãm &amp; Trải Nghiệm AR
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', color: 'var(--primary-red)', margin: '14px 0 10px' }}>
              SẮC MƯỜNG ĐƯƠNG ĐẠI
            </h3>
            <p style={{ fontStyle: 'italic', color: 'var(--earth-brown)', fontSize: '1.05rem', marginBottom: '16px' }}>
              "Chạm vào văn hóa – Bước vào dòng chảy sử thi"
            </p>
            <p style={{ fontSize: '0.98rem', lineHeight: '1.75', color: 'var(--text-dark)', marginBottom: '18px' }}>
              Không gian văn hóa “Sắc Mường Đương Đại” kết hợp Triển lãm thực tế tăng cường “Dòng chảy sử thi” là hoạt động trọng tâm của Sử thi Tân Diện. Người tham dự trực tiếp bước vào thế giới thần thoại Mường qua hệ thống tranh trưng bày, công nghệ AR quét mã 3D và các hoạt động tương tác trải nghiệm.
            </p>
            <div style={{ background: 'white', padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid var(--accent-gold)', fontSize: '0.92rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <strong style={{ color: 'var(--primary-red)' }}>Mục đích:</strong> Chuyển tải kho tàng tri thức dân gian đồ sộ thành không gian đa chiều, sinh động, truyền cảm hứng tự hào cội nguồn tới giới trẻ.
            </div>
          </div>
        </div>

        {/* 2. Talkshow */}
        <div
          className="journey-card"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'center',
            background: 'var(--paper-beige)',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.06)'
          }}
        >
          {/* Content */}
          <div className="journey-card-content">
            <span
              style={{
                background: 'var(--forest-green)',
                color: 'white',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '5px 14px',
                borderRadius: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Tọa Đàm Văn Hóa
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', color: 'var(--primary-red)', margin: '14px 0 10px' }}>
              TALKSHOW SỬ THI TRONG KỶ NGUYÊN SỐ
            </h3>
            <p style={{ fontStyle: 'italic', color: 'var(--earth-brown)', fontSize: '1.05rem', marginBottom: '16px' }}>
              "Đối thoại giữa nghệ nhân dân gian, nhà nghiên cứu và công chúng trẻ"
            </p>
            <p style={{ fontSize: '0.98rem', lineHeight: '1.75', color: 'var(--text-dark)', marginBottom: '18px' }}>
              Chuỗi tọa đàm chuyên sâu lắng nghe các nhà nghiên cứu văn hóa, nghệ nhân Mo Mường chia sẻ về triết lý nhân sinh, tính biểu tượng trong trường ca và giải pháp ứng dụng công nghệ số để bảo tồn di sản bền vững.
            </p>
          </div>

          {/* Slider Container with Smooth Crossfade */}
          <div
            className="journey-card-img-wrapper"
            onMouseEnter={() => setIsHoverTalkshow(true)}
            onMouseLeave={() => setIsHoverTalkshow(false)}
            style={{
              position: 'relative',
              width: '100%',
              height: '420px',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
              background: '#1a110d'
            }}
          >
            {/* Render all images layered for instant, zero-lag crossfade */}
            {talkshowImages.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`Talkshow Sử Thi Tân Diện - ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: i === talkshowIdx ? 1 : 0,
                  visibility: i === talkshowIdx ? 'visible' : 'hidden',
                  transform: i === talkshowIdx ? 'scale(1) translateZ(0)' : 'scale(1.03) translateZ(0)',
                  transition: 'opacity 0.5s ease, transform 0.6s ease',
                  willChange: i === talkshowIdx ? 'opacity, transform' : 'auto',
                  zIndex: i === talkshowIdx ? 2 : 1
                }}
              />
            ))}

            {/* Counter Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                background: 'rgba(20, 10, 8, 0.75)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 600,
                zIndex: 10,
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <i className="fa-solid fa-images" style={{ marginRight: '6px', color: 'var(--accent-gold)' }}></i>
              {talkshowIdx + 1} / {talkshowImages.length}
            </div>

            {/* Prev Button */}
            <button
              onClick={handlePrevTalkshow}
              aria-label="Ảnh trước"
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(20, 10, 8, 0.65)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-red)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(20, 10, 8, 0.65)')}
            >
              <i className="fa-solid fa-chevron-left" style={{ fontSize: '1rem' }}></i>
            </button>

            {/* Next Button */}
            <button
              onClick={handleNextTalkshow}
              aria-label="Ảnh kế tiếp"
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(20, 10, 8, 0.65)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-red)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(20, 10, 8, 0.65)')}
            >
              <i className="fa-solid fa-chevron-right" style={{ fontSize: '1rem' }}></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
