'use client';

import Link from 'next/link';

export default function Footer({ onNavigate }) {
  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(sectionId);
    }
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          {/* Logo & Description */}
          <div className="footer-col">
            <h3 className="footer-logo-title">SỬ THI TÂN DIỆN</h3>
            <p className="footer-logo-desc">
              Không gian số hóa di sản sử thi Đẻ đất đẻ nước và văn hóa truyền thống đặc sắc của người Mường Việt Nam.
            </p>
            <div className="social-links">
              <a
                href="https://www.facebook.com/suthitandien"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Facebook"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a
                href="https://www.tiktok.com/@suthitandien?_r=1&_t=ZS-97HhZhEl1Fa"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="TikTok"
              >
                <i className="fa-brands fa-tiktok"></i>
              </a>
            </div>
          </div>

          {/* Col 1: Khám Phá */}
          <div className="footer-col">
            <h4>Khám Phá</h4>
            <ul>
              <li><a href="#kham-pha" onClick={(e) => handleLinkClick(e, 'kham-pha')}>Nhà Sàn Truyền Thống</a></li>
              <li><a href="#kham-pha" onClick={(e) => handleLinkClick(e, 'kham-pha')}>Nghệ Thuật Cạp Váy</a></li>
              <li><a href="#kham-pha" onClick={(e) => handleLinkClick(e, 'kham-pha')}>Ẩm Thực Mẹt Lá</a></li>
              <li><a href="#kham-pha" onClick={(e) => handleLinkClick(e, 'kham-pha')}>Trò Chơi Ngày Xuân</a></li>
            </ul>
          </div>

          {/* Col 2: Sử Thi */}
          <div className="footer-col">
            <h4>Sử Thi Tân Diện</h4>
            <ul>
              <li><a href="#su-thi" onClick={(e) => handleLinkClick(e, 'su-thi')}>Khai Thiên Lập Địa</a></li>
              <li><a href="#su-thi" onClick={(e) => handleLinkClick(e, 'su-thi')}>Kiến Thiết Đời Sống</a></li>
              <li><a href="#su-thi" onClick={(e) => handleLinkClick(e, 'su-thi')}>Tổ Chức Xã Hội</a></li>
              <li><a href="#su-thi" onClick={(e) => handleLinkClick(e, 'su-thi')}>Đấu Tranh Sinh Tồn</a></li>
            </ul>
          </div>

          {/* Col 3: Kết Nối */}
          <div className="footer-col">
            <h4>Kết Nối Di Sản</h4>
            <ul>
              <li><a href="#vr-tuong-tac" onClick={(e) => handleLinkClick(e, 'vr-tuong-tac')}>Trải Nghiệm Nhà Sàn 3D</a></li>
              <li><a href="#about" onClick={(e) => handleLinkClick(e, 'about')}>Đội Ngũ Sáng Lập</a></li>
              <li><a href="#about" onClick={(e) => handleLinkClick(e, 'about')}>Tư Liệu Nguồn Sử Thi</a></li>
              <li><a href="#about" onClick={(e) => handleLinkClick(e, 'about')}>Chính Sách Bảo Tồn</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Dự Án Sử Thi Tân Diện. Tất cả bản quyền được bảo lưu.</p>
          <div className="footer-bottom-links">
            <a href="#">Điều khoản sử dụng</a>
            <a href="#">Chính sách bảo mật</a>
            <Link href="/admin" className="admin-login-link" title="Quản trị viên">
              <i className="fa-solid fa-lock"></i> Quản trị
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
