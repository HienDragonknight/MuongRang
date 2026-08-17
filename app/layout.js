import '@/styles/globals.css';
import TrackingProvider from '@/components/TrackingProvider';

export const metadata = {
  title: 'Sử Thi Tân Diện | 26 phần sử thi Đẻ Đất Đẻ Nước',
  description: 'Không gian số hóa di sản sử thi Đẻ Đất Đẻ Nước và văn hóa truyền thống đặc sắc của người Mường Việt Nam. Trải nghiệm VR 360, mô hình 3D và 26 chương sử thi song ngữ.',
  icons: {
    icon: '/resources/LOGO BACK ĐỎ.PNG',
  },
  openGraph: {
    title: 'Sử Thi Tân Diện | 26 phần sử thi Đẻ Đất Đẻ Nước',
    description: 'Không gian số hóa di sản trường ca Đẻ Đất Đẻ Nước kết hợp công nghệ VR 360 & 3D.',
    images: ['/resources/LOGO BACK ĐỎ.PNG'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        {/* FontAwesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <TrackingProvider>{children}</TrackingProvider>
      </body>
    </html>
  );
}
