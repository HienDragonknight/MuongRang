'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/tracking';

export default function DiscoverySection({ onNavigateSub, onNavigate }) {
  const [activePlatterFood, setActivePlatterFood] = useState('com-lam');

  const foodData = {
    'com-lam': {
      title: 'Cơm Lam Nếp Nương',
      rotation: 0,
      desc: 'Hạt nếp nương thơm dẻo nướng chín trong ống nứa bánh tẻ non trên than hồng rực lửa, hòa quyện hương vị ngai ngái mộc mạc thơm lừng của núi rừng Tây Bắc.',
      meaning: 'Biểu tượng cho sự no ấm, thanh khiết và lòng hiếu khách chân thành nồng hậu của đồng bào Mường.'
    },
    'lon-ban': {
      title: 'Lợn Mán Thui Rơm Mắc Khén',
      rotation: -90,
      desc: 'Thịt lợn thả rông đồi săn chắc, thui rơm vàng rộm giòn bì, ướp hạt dổi rừng cay nồng, lá móc mật thơm ngát nướng xiên tre thơm nức mũi.',
      meaning: 'Lễ vật tôn nghiêm dâng cúng thần linh tổ tiên trong các dịp lễ tết và tiếp đãi khách quý bản mường.'
    },
    'rau-rung': {
      title: 'Rau Rừng Đồ Chấm Lòng Cá',
      rotation: -180,
      desc: 'Hái từ đọt hoa chuối rừng, ngọn rau dớn ven khe suối, lá tầm bóp non xanh mướt đồ chín tới giữ nguyên vị ngọt chát thanh tao chấm nước sốt lòng cá thơm ngậy.',
      meaning: 'Vị thuốc quý bồi bổ sức khỏe của thiên nhiên đại ngàn ban tặng cho cuộc sống người Mường.'
    },
    'mam-co': {
      title: 'Mâm Cỗ Lá Chuối Rừng',
      rotation: -270,
      desc: 'Toàn bộ món ăn được bày biện công phu đẹp mắt trên tàu lá chuối rừng xanh non mướt mát, tượng trưng cho đất trời mây núi giao hòa trọn vẹn.',
      meaning: 'Nếp sống cộng đồng đầm ấm sum vầy, sự gắn bó keo sơn giữa con người với cội nguồn cỏ cây bản địa.'
    }
  };

  const handleSelectFood = (foodKey) => {
    setActivePlatterFood(foodKey);
    const food = foodData[foodKey];
    if (food) {
      trackEvent('track', `am-thuc-${foodKey}`, `Ẩm Thực: ${food.title}`);
    }
  };

  return (
    <div className="discovery-section-wrapper">
      {/* 1. DISCOVERY OVERVIEW */}
      <section className="explore-overview-section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-intro">
            <span className="intro-tag">Không Gian Văn Hóa Mường</span>
            <h2 className="intro-title">Bốn Trụ Cột Đời Sống Truyền Thống</h2>
            <p>Khám phá chiều sâu bản sắc văn hóa người Mường qua kiến trúc, trang phục, ẩm thực và hội hè.</p>
          </div>

          <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            <div className="start-card" style={{ padding: '28px', background: 'white', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2.4rem', color: 'var(--primary-red)', marginBottom: '14px' }}>
                <i className="fa-solid fa-house-chimney-window"></i>
              </div>
              <h4 style={{ color: 'var(--primary-red)', fontSize: '1.25rem', marginBottom: '10px' }}>Nhà Sàn Truyền Thống</h4>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'var(--text-dark)' }}>
                Không gian cư trú đặc trưng với cấu trúc cột gỗ vững chãi, bếp lửa trung tâm sưởi ấm gia đình và chứa đựng nếp sống gia tộc ngàn đời.
              </p>
            </div>

            <div className="start-card" style={{ padding: '28px', background: 'white', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2.4rem', color: 'var(--accent-gold)', marginBottom: '14px' }}>
                <i className="fa-solid fa-vest-patches"></i>
              </div>
              <h4 style={{ color: 'var(--primary-red)', fontSize: '1.25rem', marginBottom: '10px' }}>Nghệ Thuật Cạp Váy</h4>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'var(--text-dark)' }}>
                Kiệt tác dệt thổ cẩm với họa tiết hình học, rùa thần vũ trụ và chim phượng hoàng, thể hiện sự tinh tế khéo léo của người phụ nữ Mường.
              </p>
            </div>

            <div className="start-card" style={{ padding: '28px', background: 'white', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2.4rem', color: 'var(--forest-green)', marginBottom: '14px' }}>
                <i className="fa-solid fa-bowl-rice"></i>
              </div>
              <h4 style={{ color: 'var(--primary-red)', fontSize: '1.25rem', marginBottom: '10px' }}>Ẩm Thực Mẹt Lá</h4>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'var(--text-dark)' }}>
                Bày cỗ trên lá chuối rừng xanh non với cơm lam nếp nương, thịt lợn mán thui rơm và rau rừng đồ giữ trọn hương vị thanh khiết núi rừng.
              </p>
            </div>

            <div className="start-card" style={{ padding: '28px', background: 'white', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '2.4rem', color: 'var(--primary-red-light)', marginBottom: '14px' }}>
                <i className="fa-solid fa-bullseye"></i>
              </div>
              <h4 style={{ color: 'var(--primary-red)', fontSize: '1.25rem', marginBottom: '10px' }}>Trò Chơi Ngày Xuân</h4>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'var(--text-dark)' }}>
                Tiếng cười giòn giã ném còn cầu may, đua cà kheo tốc độ, kéo co đồng sức rộn rã khắp thung lũng trong ngày hội xuống đồng Khai hạ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COSTUMES MALE & FEMALE */}
      <section style={{ background: 'var(--paper-beige-dark)', padding: '80px 0' }}>
        <div className="container">
          <div className="section-intro">
            <span className="intro-tag">Di Sản Phục Trang</span>
            <h2 className="intro-title">Trang Phục Nam & Nữ Người Mường</h2>
          </div>
          <div className="culture-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
            {/* Women's Costume Card */}
            <div className="start-card" style={{ padding: 0, textAlign: 'left', background: 'white', overflow: 'hidden', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', background: '#faf8f5', padding: '20px 0' }}>
                <img src="/resources/trang_phuc_nu.png" alt="Trang phục nữ người Mường" style={{ maxWidth: '100%', height: '440px', objectFit: 'contain', display: 'block' }} />
              </div>
              <div style={{ padding: '28px' }}>
                <h3 style={{ color: 'var(--primary-red)', borderBottom: '2px solid var(--primary-red)', paddingBottom: '10px', marginBottom: '15px', fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>
                  Trang Phục Nữ
                </h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--text-dark)', marginBottom: '12px' }}>
                  Gồm khăn trắng quấn đầu, áo cánh pắn ngắn, váy ống đen kết hợp cạp váy thổ cẩm dệt thủ công và bộ xà tích bạc truyền thống.
                </p>
                <p style={{ fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--primary-red-light)', marginBottom: 0 }}>
                  Điểm nhấn tinh tế nằm ở dải cạp váy dệt hoa văn phượng hoàng vũ trụ độc đáo.
                </p>
              </div>
            </div>

            {/* Men's Costume Card */}
            <div className="start-card" style={{ padding: 0, textAlign: 'left', background: 'white', overflow: 'hidden', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', background: '#faf8f5', padding: '20px 0' }}>
                <img src="/resources/trang_phuc_nam.png" alt="Trang phục nam người Mường" style={{ maxWidth: '100%', height: '440px', objectFit: 'contain', display: 'block' }} />
              </div>
              <div style={{ padding: '28px' }}>
                <h3 style={{ color: 'var(--primary-red)', borderBottom: '2px solid var(--primary-red)', paddingBottom: '10px', marginBottom: '15px', fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>
                  Trang Phục Nam
                </h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--text-dark)', marginBottom: '12px' }}>
                  Gồm áo cánh màu chàm xẻ ngực, quần ống rộng và khăn đội đầu đơn giản, phù hợp với sinh hoạt và lao động đồi nương thường ngày.
                </p>
                <p style={{ fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--primary-red-light)', marginBottom: 0 }}>
                  Thể hiện nét khỏe khoắn, giản dị và gần gũi với đời sống lao động núi rừng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE CULINARY PLATTER */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container">
          <div className="section-intro">
            <span className="intro-tag">Hương Vị Bản Mường</span>
            <h2 className="intro-title">Mẹt Ẩm Thực Tương Tác Xoay 360°</h2>
            <p>Nhấp vào từng món ăn để xoay đĩa ẩm thực và tìm hiểu ý nghĩa văn hóa ẩm thực truyền thống Mường.</p>
          </div>

          <div className="culinary-interactive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
            {/* Rotating Platter Visual */}
            <div className="platter-visual-wrap" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: '340px', height: '340px', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 15px 45px rgba(0,0,0,0.15)', border: '6px solid var(--paper-beige-dark)' }}>
                <img
                  src="/resources/muong_mam_co.png"
                  alt="Mẹt ẩm thực Mường"
                  id="interactive-platter-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `rotate(${foodData[activePlatterFood].rotation}deg)`,
                    transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </div>
            </div>

            {/* Food Details & Selectors */}
            <div className="platter-details-wrap">
              <div className="food-buttons-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
                {Object.keys(foodData).map((key) => (
                  <button
                    key={key}
                    className={`btn ${activePlatterFood === key ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.9rem', padding: '8px 18px' }}
                    onClick={() => handleSelectFood(key)}
                  >
                    {foodData[key].title}
                  </button>
                ))}
              </div>

              <div className="food-active-card" style={{ background: 'var(--paper-beige)', padding: '24px', borderRadius: '14px', borderLeft: '4px solid var(--accent-gold)' }}>
                <h3 style={{ color: 'var(--primary-red)', marginBottom: '10px', fontSize: '1.4rem' }}>
                  {foodData[activePlatterFood].title}
                </h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--text-dark)', marginBottom: '14px' }}>
                  {foodData[activePlatterFood].desc}
                </p>
                <div style={{ fontSize: '0.9rem', color: 'var(--earth-brown)', background: 'rgba(255,255,255,0.7)', padding: '10px 14px', borderRadius: '8px' }}>
                  <strong>Ý nghĩa di sản:</strong> {foodData[activePlatterFood].meaning}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
