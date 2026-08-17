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
      <div className="container">
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

        {/* Team Members Grid */}
        <div
          className="btc-members-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            marginBottom: '60px'
          }}
        >
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="btc-member-card"
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px 16px',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                border: '1px solid rgba(196, 154, 42, 0.25)',
                transition: 'all 0.3s ease'
              }}
            >
              <div
                className="btc-avatar-wrap"
                style={{
                  position: 'relative',
                  width: '90px',
                  height: '90px',
                  margin: '0 auto 16px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid var(--accent-gold)'
                }}
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h4
                className="btc-name"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.05rem',
                  color: 'var(--primary-red)',
                  marginBottom: '6px'
                }}
              >
                {member.name}
              </h4>
              <span
                className="btc-role"
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--earth-brown)',
                  background: 'rgba(196, 154, 42, 0.15)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  display: 'inline-block'
                }}
              >
                {member.role}
              </span>
            </div>
          ))}
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
