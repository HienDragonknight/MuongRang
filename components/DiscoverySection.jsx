'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/tracking';

export default function DiscoverySection({ onNavigateSub, onNavigate }) {
  const [activePlatterFood, setActivePlatterFood] = useState('mam-co');

  const foodData = {
    'mam-co': {
      title: 'Mâm Cỗ Lá Chuối Rừng',
      image: '/resources/muong_mam_co_real.jpg',
      tag: 'Đặc sản linh hồn xứ Mường',
      desc: 'Toàn bộ món ăn được bày biện công phu đẹp mắt trên tàu lá chuối rừng xanh non mướt mát, tượng trưng cho đất trời mây núi giao hòa trọn vẹn. Mâm cỗ hội tụ đầy đủ thịt lợn mán thui rơm, gà đồi nướng hạt dổi, cơm lam nếp nương và rau rừng tươi ngọt.',
      meaning: 'Biểu tượng cho nếp sống cộng đồng đầm ấm sum vầy, sự tôn kính thiên nhiên và lòng hiếu khách chân thành nồng hậu của đồng bào Mường.'
    },
    'com-lam': {
      title: 'Cơm Lam Nếp Nương',
      image: '/resources/muong_com_lam_real.jpg',
      tag: 'Món ăn biểu tượng núi rừng',
      desc: 'Hạt gạo nếp nương dẻo thơm nướng chín trong ống nứa bánh tẻ non trên than hồng rực lửa. Khi bóc vỏ nứa, lớp màng lụa mỏng ôm lấy gióng cơm dẻo quánh, hòa quyện hương thơm ngai ngái mộc mạc của núi rừng chấm cùng muối vừng rang vàng.',
      meaning: 'Biểu trưng cho sự no ấm, thuần khiết và sức sống bền bỉ của người Mường qua bao thế hệ khai sơn phá thạch.'
    },
    'lon-ban': {
      title: 'Lợn Mán Thui Rơm Mắc Khén',
      image: '/resources/muong_lon_ban_real.jpg',
      tag: 'Món nướng thượng hạng',
      desc: 'Thịt lợn mán thả đồi săn chắc, thui rơm vàng rộm giòn tan phần bì, tẩm ướp hạt dổi rừng cay nồng, mắc khén thơm dịu và lá móc mật tươi nướng trên than hoa thơm nức mũi.',
      meaning: 'Lễ vật tôn nghiêm dâng cúng thần linh tổ tiên trong các dịp hội làng xuống đồng và thết đãi khách quý phương xa.'
    },
    'rau-rung': {
      title: 'Rau Rừng Đồ Chấm Lòng Cá',
      image: '/resources/muong_rau_rung_real.jpg',
      tag: 'Hương vị đại ngàn thanh khiết',
      desc: 'Hái từ đọt hoa chuối rừng, ngọn rau dớn ven khe suối, lá tầm bóp non xanh mướt đồ chín tới giữ trọn vị ngọt chát thanh tao, kết hợp nước sốt lòng cá chưng thơm ngậy béo bùi.',
      meaning: 'Phương thuốc quý bồi bổ sức khỏe của thiên nhiên đại ngàn ban tặng cho cuộc sống người Mường, cân bằng âm dương trong ẩm thực.'
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
        <div className="container" style={{ maxWidth: '1440px' }}>
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
        <div className="container" style={{ maxWidth: '1440px' }}>
          <div className="section-intro">
            <span className="intro-tag">Di Sản Phục Trang</span>
            <h2 className="intro-title">Trang Phục Nam &amp; Nữ Người Mường</h2>
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

      {/* 3. REAL AUTHENTIC CULINARY SHOWCASE */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container" style={{ maxWidth: '1440px' }}>
          <div className="section-intro">
            <span className="intro-tag">Hương Vị Bản Mường</span>
            <h2 className="intro-title">Ẩm Thực Truyền Thống Xứ Mường</h2>
            <p>Khám phá tinh hoa ẩm thực Tây Bắc với những món ăn đậm đà bản sắc được chuẩn bị trên mâm cỗ lá chuối rừng.</p>
          </div>

          <div
            className="culinary-interactive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '48px',
              alignItems: 'center',
              background: 'var(--paper-beige)',
              padding: '40px',
              borderRadius: '24px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.06)'
            }}
          >
            {/* Real Food Photography Visual with Crossfade */}
            <div
              className="platter-visual-wrap"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '480px',
                height: '440px',
                margin: '0 auto',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
                border: '4px solid var(--accent-gold)',
                background: '#1a100a'
              }}
            >
              {Object.keys(foodData).map((key) => {
                const item = foodData[key];
                const isActive = activePlatterFood === key;
                return (
                  <img
                    key={key}
                    src={item.image}
                    alt={item.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: isActive ? 1 : 0,
                      visibility: isActive ? 'visible' : 'hidden',
                      transform: isActive ? 'scale(1)' : 'scale(1.05)',
                      transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      zIndex: isActive ? 2 : 1
                    }}
                  />
                );
              })}

              {/* Dish Tag Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'rgba(20, 10, 8, 0.8)',
                  backdropFilter: 'blur(8px)',
                  color: 'var(--accent-gold-light)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  zIndex: 10,
                  border: '1px solid rgba(196, 154, 42, 0.4)'
                }}
              >
                <i className="fa-solid fa-utensils" style={{ marginRight: '6px' }}></i>
                {foodData[activePlatterFood].tag}
              </div>
            </div>

            {/* Food Details & Selectors */}
            <div className="platter-details-wrap">
              <div
                className="food-buttons-group"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  marginBottom: '28px'
                }}
              >
                {Object.keys(foodData).map((key) => {
                  const item = foodData[key];
                  const isActive = activePlatterFood === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectFood(key)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '14px',
                        border: isActive ? '2px solid var(--primary-red)' : '1px solid rgba(196, 154, 42, 0.3)',
                        background: isActive ? 'var(--primary-red)' : 'white',
                        color: isActive ? 'white' : 'var(--text-dark)',
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: isActive ? '0 6px 18px rgba(124, 31, 26, 0.25)' : '0 2px 8px rgba(0,0,0,0.04)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <i
                        className={
                          key === 'mam-co'
                            ? 'fa-solid fa-plate-wheat'
                            : key === 'com-lam'
                            ? 'fa-solid fa-bowl-rice'
                            : key === 'lon-ban'
                            ? 'fa-solid fa-drumstick-bite'
                            : 'fa-solid fa-leaf'
                        }
                        style={{ color: isActive ? 'var(--accent-gold-light)' : 'var(--primary-red)' }}
                      ></i>
                      <span>{item.title}</span>
                    </button>
                  );
                })}
              </div>

              <div
                className="food-active-card"
                style={{
                  background: 'white',
                  padding: '28px',
                  borderRadius: '18px',
                  borderLeft: '5px solid var(--accent-gold)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ background: 'rgba(196, 154, 42, 0.15)', color: 'var(--earth-brown)', fontSize: '0.78rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px' }}>
                    {foodData[activePlatterFood].tag}
                  </span>
                </div>
                <h3 style={{ color: 'var(--primary-red)', marginBottom: '12px', fontSize: '1.6rem', fontFamily: 'var(--font-heading)' }}>
                  {foodData[activePlatterFood].title}
                </h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.75', color: 'var(--text-dark)', marginBottom: '18px' }}>
                  {foodData[activePlatterFood].desc}
                </p>
                <div
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--earth-brown)',
                    background: 'var(--paper-beige)',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    lineHeight: '1.6',
                    border: '1px solid rgba(196, 154, 42, 0.2)'
                  }}
                >
                  <strong style={{ color: 'var(--primary-red)' }}>Ý nghĩa di sản:</strong> {foodData[activePlatterFood].meaning}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
