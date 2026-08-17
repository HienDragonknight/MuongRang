'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/tracking';

export default function ExhibitionSection() {
  const [trienLamIdx, setTrienLamIdx] = useState(0);
  const [talkshowIdx, setTalkshowIdx] = useState(0);

  const handleNextTrienLam = () => {
    setTrienLamIdx((prev) => (prev + 1) % trienLamImages.length);
    trackEvent('track', 'trien-lam-ar', 'Triển Lãm Thực Tế Tăng Cường AR');
  };

  const handleNextTalkshow = () => {
    setTalkshowIdx((prev) => (prev + 1) % talkshowImages.length);
    trackEvent('track', 'talkshow-ky-nguyen-so', 'Talkshow Sử Thi Trong Kỷ Nguyên Số');
  };

  const trienLamImages = [
    '/resources/trienlam_images/TRIỂN LÃM/DSC00465.jpeg',
    '/resources/trienlam_images/TRIỂN LÃM/DSC00472.jpeg',
    '/resources/trienlam_images/TRIỂN LÃM/DSC00486.jpeg',
    '/resources/trienlam_images/TRIỂN LÃM/DSC00511.jpeg',
    '/resources/trienlam_images/TRIỂN LÃM/DSC00542.jpeg',
    '/resources/trienlam_images/TRIỂN LÃM/DSC00628.jpeg',
    '/resources/trienlam_images/TRIỂN LÃM/DSC00716.jpeg',
    '/resources/trienlam_images/TRIỂN LÃM/DSC00851.jpeg'
  ];

  const talkshowImages = [
    '/resources/talkshow_images/TALKSHOW/DSC00010.jpeg',
    '/resources/talkshow_images/TALKSHOW/DSC00013.jpeg',
    '/resources/talkshow_images/TALKSHOW/DSC00020.jpeg',
    '/resources/talkshow_images/TALKSHOW/DSC00045.jpeg',
    '/resources/talkshow_images/TALKSHOW/DSC00055.jpeg',
    '/resources/talkshow_images/TALKSHOW/DSC00088.jpeg'
  ];

  useEffect(() => {
    const timer1 = setInterval(() => {
      setTrienLamIdx((prev) => (prev + 1) % trienLamImages.length);
    }, 3500);
    const timer2 = setInterval(() => {
      setTalkshowIdx((prev) => (prev + 1) % talkshowImages.length);
    }, 4000);
    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
    };
  }, [trienLamImages.length, talkshowImages.length]);

  return (
    <section className="about-journey-section" style={{ padding: '80px 0', background: 'white' }}>
      <div className="container">
        <div className="section-intro">
          <span className="intro-tag">Dấu Ấn Hành Trình</span>
          <h2 className="intro-title">Sắc Mường Đương Đại & Triển Lãm Thực Tế Tăng Cường</h2>
          <p>Các hoạt động triển lãm văn hóa và tọa đàm lan tỏa di sản Đẻ Đất Đẻ Nước đến cộng đồng người trẻ.</p>
        </div>

        {/* 1. Triển lãm AR */}
        <div className="journey-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center', marginBottom: '60px', background: 'var(--paper-beige)', borderRadius: '20px', padding: '32px' }}>
          <div className="journey-card-img" style={{ position: 'relative', width: '100%', height: '380px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <img
              src={trienLamImages[trienLamIdx]}
              alt="Triển lãm AR Sử Thi Tân Diện"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }}
            />
            <div style={{ position: 'absolute', bottom: '12px', right: '14px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem' }}>
              {trienLamIdx + 1} / {trienLamImages.length}
            </div>
            <button
              onClick={() => {
                setTrienLamIdx((prev) => (prev - 1 + trienLamImages.length) % trienLamImages.length);
                trackEvent('track', 'trien-lam-ar', 'Triển Lãm Thực Tế Tăng Cường AR');
              }}
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              onClick={handleNextTrienLam}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <div className="journey-card-content">
            <span style={{ background: 'var(--accent-gold)', color: 'var(--charcoal-black)', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>
              Triển Lãm & Trải Nghiệm AR
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', color: 'var(--primary-red)', margin: '12px 0 8px' }}>
              SẮC MƯỜNG ĐƯƠNG ĐẠI
            </h3>
            <p style={{ fontStyle: 'italic', color: 'var(--earth-brown)', fontSize: '1rem', marginBottom: '14px' }}>
              "Chạm vào văn hóa – Bước vào dòng chảy sử thi"
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)', marginBottom: '16px' }}>
              Không gian văn hóa “Sắc Mường Đương Đại” kết hợp Triển lãm thực tế tăng cường “Dòng chảy sử thi” là hoạt động trọng tâm của Sử thi Tân Diện. Người tham dự trực tiếp bước vào thế giới thần thoại Mường qua hệ thống tranh trưng bày, công nghệ AR quét mã 3D và các hoạt động tương tác trải nghiệm.
            </p>
            <div style={{ background: 'white', padding: '12px 18px', borderRadius: '8px', borderLeft: '3px solid var(--accent-gold)', fontSize: '0.88rem' }}>
              <strong>Mục đích:</strong> Chuyển tải kho tàng tri thức dân gian đồ sộ thành không gian đa chiều, sinh động, truyền cảm hứng tự hào cội nguồn tới giới trẻ.
            </div>
          </div>
        </div>

        {/* 2. Talkshow */}
        <div className="journey-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center', background: 'var(--paper-beige)', borderRadius: '20px', padding: '32px' }}>
          <div className="journey-card-content">
            <span style={{ background: 'var(--forest-green)', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>
              Tọa Đàm Văn Hóa
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', color: 'var(--primary-red)', margin: '12px 0 8px' }}>
              TALKSHOW SỬ THI TRONG KỶ NGUYÊN SỐ
            </h3>
            <p style={{ fontStyle: 'italic', color: 'var(--earth-brown)', fontSize: '1rem', marginBottom: '14px' }}>
              "Đối thoại giữa nghệ nhân dân gian, nhà nghiên cứu và công chúng trẻ"
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)', marginBottom: '16px' }}>
              Chuỗi tọa đàm chuyên sâu lắng nghe các nhà nghiên cứu văn hóa, nghệ nhân Mo Mường chia sẻ về triết lý nhân sinh, tính biểu tượng trong trường ca và giải pháp ứng dụng công nghệ số để bảo tồn di sản bền vững.
            </p>
          </div>

          <div className="journey-card-img" style={{ position: 'relative', width: '100%', height: '380px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <img
              src={talkshowImages[talkshowIdx]}
              alt="Talkshow Sử Thi Tân Diện"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }}
            />
            <div style={{ position: 'absolute', bottom: '12px', right: '14px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem' }}>
              {talkshowIdx + 1} / {talkshowImages.length}
            </div>
            <button
              onClick={() => {
                setTalkshowIdx((prev) => (prev - 1 + talkshowImages.length) % talkshowImages.length);
                trackEvent('track', 'talkshow-ky-nguyen-so', 'Talkshow Sử Thi Trong Kỷ Nguyên Số');
              }}
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              onClick={handleNextTalkshow}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
