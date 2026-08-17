'use client';

export default function HeroSection({ onNavigateChapter, onNavigate }) {
  return (
    <div className="home-view-container">
      {/* HERO BANNER */}
      <section className="hero-section">
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
          <div className="hero-inner">
            <div className="hero-content">
              <span className="hero-label">Dự Án Di Sản Số Hóa Văn Hóa Mường</span>
              <h1 className="hero-title">
                SỬ THI<br />TÂN DIỆN
              </h1>
              <div className="hero-ornament"><span></span></div>
              <p className="hero-desc">
                Hành trình khám phá 26 phần sử thi Đẻ đất đẻ nước. Bước vào thế giới sử thi Mường, nơi đất trời, muôn loài, con người và bản Mường được sinh ra qua lời kể ngâm vang ngàn đời.
              </p>
              <div className="hero-btns">
                <button
                  className="btn btn-primary"
                  onClick={() => onNavigate && onNavigate('su-thi')}
                >
                  Khám phá 26 phần
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => onNavigate && onNavigate('vr-tuong-tac')}
                >
                  Bắt đầu hành trình VR
                </button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-wrap">
                <img className="hero-image-main" src="/resources/muong_stilt_house_hero.png" alt="Nhà sàn Mường" />
                <div className="hero-deco-coin"></div>
                <div className="hero-birds">🕊️ 🕊️</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BIG IDEA & KEY MESSAGE */}
      <section className="big-idea-section">
        <div className="container">
          <div className="idea-box">
            <div className="idea-title-col">
              <span className="idea-badge">Ý Tưởng Chủ Đạo</span>
              <h2 className="idea-title">TRẠM KỂ</h2>
              <h3 className="idea-message">"Chạm miền sử thi – Trạm kể Mường xưa"</h3>
            </div>
            <div className="idea-content-col" style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
              <p>
                <strong>Đẻ đất đẻ nước (tiếng Mường: Te tấc te đác)</strong> là bộ sử thi thần thoại đồ sộ của dân tộc Mường. Tác phẩm là “bách khoa toàn thư” dân gian, phản ánh nhận thức, đời sống và khát vọng của người Mường cổ trong công cuộc kiến tạo thế giới và xây dựng cộng đồng.
              </p>
              <p style={{ marginTop: '16px' }}>
                Đẻ đất đẻ nước không chỉ là câu chuyện của người Mường trong quá khứ, mà còn là ký ức văn hóa đang chờ được thế hệ hôm nay lật mở. Sử thi tân diện tạo nên những điểm chạm số hóa để người trẻ nghe, nhìn, tương tác và tiếp tục hành trình của sử thi trong đời sống đương đại.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6-STAGE EPIC OVERVIEW */}
      <section className="home-timeline-section">
        <div className="container">
          <div className="section-intro">
            <span className="intro-tag">Hành Trình Cội Nguồn</span>
            <h2 className="intro-title">Dòng Chảy Sử Thi Qua 6 Chặng</h2>
            <p>Mười sáu vạn câu thơ Mo được xâu chuỗi mạch lạc thành một hành trình vĩ đại xây dựng thế giới</p>
          </div>
          <div className="home-timeline-grid">
            <div className="home-timeline-card">
              <span className="stage-tag">Chặng 1</span>
              <h4>Hình thành Đất, Nước, Con người</h4>
              <p>Từ thuở ban sơ hỗn mang, đất nước được kiến tạo, cây si thần lớn lên đẻ ra vạn vật và con người.</p>
            </div>
            <div className="home-timeline-card">
              <span className="stage-tag">Chặng 2</span>
              <h4>Xây dựng cơ sở vật chất</h4>
              <p>Con người biết làm nhà sàn che mưa nắng, tìm ra lửa ấm, thuần hóa lúa gạo, trâu bò và men rượu cần.</p>
            </div>
            <div className="home-timeline-card">
              <span className="stage-tag">Chặng 3</span>
              <h4>Lo ổn định gia đạo</h4>
              <p>Lang Cun Cần lấy vợ, tìm kiếm bạn đời lập nên khuôn phép hôn nhân gia đình cho các dòng họ bản mường.</p>
            </div>
            <div className="home-timeline-card">
              <span className="stage-tag">Chặng 4</span>
              <h4>Kiến lập trật tự nước nhà</h4>
              <p>Chế tác trống đồng, phân chia ruộng đất canh tác, tìm kiếm thủ lĩnh tối cao dựng lên nhà Chu.</p>
            </div>
            <div className="home-timeline-card">
              <span className="stage-tag">Chặng 5</span>
              <h4>Xung đột & Chiến công</h4>
              <p>Vượt qua biến cố đốt nhà Chu, đoàn kết săn Moong Lồ (thú dữ), đánh cá điên, trừ ma ruộng bảo vệ mùa màng.</p>
            </div>
            <div className="home-timeline-card">
              <span className="stage-tag">Chặng 6</span>
              <h4>Hoàn chỉnh chế độ cai trị</h4>
              <p>Lập ra nghi lễ phục trang, quy định luật tục cai trị gìn giữ bờ cõi bản Mường được bình yên no ấm.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CHAPTERS */}
      <section className="featured-chapters-section">
        <div className="container">
          <div className="section-intro">
            <h2 className="intro-title">Những Phần Sử Thi Nổi Bật</h2>
            <p>Cùng khám phá những chương nổi bật của sử thi Đẻ đất đẻ nước để hiểu thêm về thế giới quan đồ sộ của người Mường.</p>
          </div>
          <div className="grid-showcase">
            <div className="showcase-card">
              <div className="showcase-img-wrap">
                <span className="showcase-badge">Chương 4</span>
                <img src="/resources/muong_cay_si.png" alt="Đẻ Cây Si" />
              </div>
              <div className="showcase-body">
                <h4>Đẻ Cây Si</h4>
                <p>Cây si vươn lên, nối trời với đất và mở ra mầm sống trong thế giới Mường.</p>
                <button
                  className="showcase-link"
                  onClick={() => onNavigateChapter && onNavigateChapter(4)}
                >
                  Khám phá chương này <i className="fa-solid fa-arrow-right-long"></i>
                </button>
              </div>
            </div>

            <div className="showcase-card">
              <div className="showcase-img-wrap">
                <span className="showcase-badge">Chương 6</span>
                <img src="/resources/muong_hero_bg.png" alt="Đẻ Người" />
              </div>
              <div className="showcase-body">
                <h4>Đẻ Người</h4>
                <p>Con người xuất hiện, bắt đầu hành trình khai mở cuộc sống giữa núi rừng.</p>
                <button
                  className="showcase-link"
                  onClick={() => onNavigateChapter && onNavigateChapter(6)}
                >
                  Khám phá chương này <i className="fa-solid fa-arrow-right-long"></i>
                </button>
              </div>
            </div>

            <div className="showcase-card">
              <div className="showcase-img-wrap">
                <span className="showcase-badge">Chương 11</span>
                <img src="/resources/muong_stilt_house_hero.png" alt="Làm Nhà" />
              </div>
              <div className="showcase-body">
                <h4>Làm Nhà</h4>
                <p>Nhà sàn hình thành từ quan sát tự nhiên, trở thành biểu tượng cư trú của người Mường.</p>
                <button
                  className="showcase-link"
                  onClick={() => onNavigateChapter && onNavigateChapter(11)}
                >
                  Khám phá chương này <i className="fa-solid fa-arrow-right-long"></i>
                </button>
              </div>
            </div>

            <div className="showcase-card">
              <div className="showcase-img-wrap">
                <span className="showcase-badge">Chương 24</span>
                <img src="/resources/muong_cong_chieng.png" alt="Chặt Cây Chu" />
              </div>
              <div className="showcase-body">
                <h4>Chặt Cây Chu</h4>
                <p>Hành trình đốn hạ cây chu thần vĩ đại, mở ra thời kỳ bình yên thái bình cho xứ Mường.</p>
                <button
                  className="showcase-link"
                  onClick={() => onNavigateChapter && onNavigateChapter(24)}
                >
                  Khám phá chương này <i className="fa-solid fa-arrow-right-long"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
