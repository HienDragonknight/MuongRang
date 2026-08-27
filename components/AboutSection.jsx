'use client';

export default function AboutSection() {
  const teamMembers = [
    {
      name: 'Phạm Thanh Thảo',
      role: 'Project Manager & Event Manager',
      avatar: '/resources/btc_images/ANH THE BTC/Thao.jpg'
    },
    {
      name: 'Phùng Thị Huệ',
      role: 'Research & Event Manager',
      avatar: '/resources/btc_images/ANH THE BTC/Phung Thi Hue.jpg'
    },
    {
      name: 'Khuất Thị Kim Dung',
      role: 'Facebook Communications Manager',
      avatar: '/resources/btc_images/ANH THE BTC/Khuat Dung.JPG'
    },
    {
      name: 'Nguyễn Trương Mỹ Hoa',
      role: 'TikTok Manager & Video Producer',
      avatar: '/resources/btc_images/ANH THE BTC/Nguyen Linh Hoa.JPG'
    },
    {
      name: 'Nguyễn Thảo Nguyên',
      role: 'External Relations Manager',
      avatar: '/resources/btc_images/ANH THE BTC/Thao Nguyen.jpg'
    }
  ];

  return (
    <div className="about-section-wrapper" id="about" style={{ padding: '80px 0', background: 'var(--paper-beige-dark)' }}>
      <div className="container" style={{ maxWidth: '1480px', width: '100%', padding: '0 24px' }}>
        {/* Section Intro */}
        <div className="section-intro">
          <span className="intro-tag">Ban Tổ Chức</span>
          <h2 className="intro-title" style={{ fontSize: '2.2rem', color: 'var(--primary-red)' }}>
            NHỮNG NGƯỜI ĐỨNG SAU SỬ THI TÂN DIỆN
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'rgba(34, 23, 16, 0.75)' }}>
            Đội ngũ các bạn trẻ nhiệt huyết phụ trách xây dựng và vận hành dự án số hóa di sản
          </p>
        </div>

        {/* Team Members Grid - 5 cards in 1 row */}
        <div
          className="btc-members-grid"
          style={{
            maxWidth: '1440px',
            margin: '0 auto 70px'
          }}
        >
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="btc-member-card"
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px 20px 28px',
                textAlign: 'center',
                boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
                border: '1.5px solid rgba(196, 154, 42, 0.35)',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div
                className="btc-avatar-wrap"
                style={{
                  position: 'relative',
                  width: '165px',
                  height: '165px',
                  margin: '0 auto 20px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '4.5px solid var(--accent-gold)',
                  boxShadow: '0 10px 28px rgba(124, 31, 26, 0.2)',
                  background: '#f5f0e8'
                }}
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    transform: 'scale(1.25) translateZ(0)',
                    transformOrigin: 'top center',
                    transition: 'transform 0.4s ease'
                  }}
                />
              </div>
              <h4
                className="btc-name"
                style={{
                  fontFamily: 'var(--font-subheading)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--primary-red)',
                  marginBottom: '10px',
                  minHeight: '2.5em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {member.name}
              </h4>
              <span
                className="btc-role"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--earth-brown)',
                  background: 'rgba(196, 154, 42, 0.15)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  display: 'inline-block',
                  lineHeight: '1.4'
                }}
              >
                {member.role}
              </span>
            </div>
          ))}
        </div>

        {/* Nhà Tài Trợ Dự Án */}
        <div className="about-sponsors-section">
          <div className="section-intro" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="intro-tag">Đồng Hành Cùng Dự Án</span>
            <h2 className="intro-title" style={{ fontSize: '2.2rem', color: 'var(--primary-red)' }}>
              NHÀ TÀI TRỢ DỰ ÁN
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(34, 23, 16, 0.75)', maxWidth: '680px', margin: '8px auto 0' }}>
              Trân trọng cảm ơn sự đồng hành và trợ lực quý giá từ các Nhà tài trợ cho hành trình lan tỏa di sản văn hóa Mường
            </p>
          </div>

          {/* Golden Sponsors */}
          <div className="sponsors-tier-group" style={{ marginBottom: '40px' }}>
            <h3 className="sponsors-tier-title golden">
              <i className="fa-solid fa-crown" style={{ color: 'var(--accent-gold)' }}></i>
              <span>Nhà Tài Trợ Vàng</span>
            </h3>
            <div className="sponsors-grid">
              {/* Sponsor 1: Eduwing Global */}
              <div className="sponsor-card">
                <div className="sponsor-logo-box">
                  <img
                    src="/resources/sponsors/golden/eduwing-global.png"
                    alt="Eduwing Global"
                    className="sponsor-logo-img"
                  />
                </div>
              </div>

              {/* Sponsor 2: Edu2Review */}
              <div className="sponsor-card">
                <div className="sponsor-logo-box">
                  <img
                    src="/resources/sponsors/golden/edu2review.png"
                    alt="Edu2Review"
                    className="sponsor-logo-img"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Silver Sponsors */}
          <div className="sponsors-tier-group">
            <h3 className="sponsors-tier-title silver">
              <i className="fa-solid fa-medal" style={{ color: '#94a3b8' }}></i>
              <span>Nhà Tài Trợ Bạc</span>
            </h3>
            <div className="sponsors-grid" style={{ maxWidth: '420px' }}>
              {/* Sponsor 3: NET CORP */}
              <div className="sponsor-card silver">
                <div className="sponsor-logo-box">
                  <img
                    src="/resources/sponsors/silver/net-corp.png"
                    alt="NET CORP"
                    className="sponsor-logo-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lời Cảm Ơn */}
        <div
          className="about-thanks-card"
          style={{
            background: 'white',
            border: '2px dashed rgba(124, 31, 26, 0.3)',
            borderRadius: '20px',
            padding: '48px 40px',
            textAlign: 'center',
            boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
            position: 'relative'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--primary-red)',
              color: 'var(--accent-gold-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              margin: '-76px auto 20px',
              boxShadow: '0 4px 15px rgba(124,31,26,0.35)'
            }}
          >
            <i className="fa-solid fa-heart"></i>
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              color: 'var(--primary-red)',
              marginBottom: '16px'
            }}
          >
            LỜI CẢM ƠN
          </h3>

          <div
            style={{
              maxWidth: '860px',
              margin: '0 auto',
              fontSize: '1.02rem',
              lineHeight: '1.8',
              color: 'var(--text-dark)'
            }}
          >
            <p style={{ marginBottom: '14px' }}>
              Hành trình của <strong>Sử thi Tân Diện</strong> sẽ không thể trọn vẹn nếu thiếu đi sự đồng hành và đóng góp của rất nhiều cá nhân, nghệ nhân dân gian, chuyên gia văn hóa và đơn vị đối tác trong suốt thời gian qua.
            </p>
            <p style={{ marginBottom: '14px' }}>
              Và đặc biệt, <strong>cảm ơn bạn</strong> – vì đã dừng lại, lắng nghe, trải nghiệm và dành sự quan tâm sâu sắc cho những câu chuyện văn hóa Mường ngàn đời.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--primary-red)',
                marginTop: '20px'
              }}
            >
              Cảm ơn vì đã đồng hành cùng Sử thi Tân Diện, để những giá trị xưa tiếp tục được chạm tới, được sẻ chia và được kể tiếp trong hôm nay. ❤️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
