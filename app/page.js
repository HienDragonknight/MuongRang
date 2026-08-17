'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import DiscoverySection from '@/components/DiscoverySection';
import EpicTimeline from '@/components/EpicTimeline';
import VRSection from '@/components/VRSection';
import ExhibitionSection from '@/components/ExhibitionSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [currentSection, setCurrentSection] = useState('trang-chu');
  const [selectedChapter, setSelectedChapter] = useState(1);

  // Handle hash navigation
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        if (['trang-chu', 'kham-pha', 'su-thi', 'vr-tuong-tac', 'about'].includes(hash)) {
          setCurrentSection(hash);
        } else if (['van-hoa-muong', 'trang-phuc-muong', 'am-thuc-muong', 'tro-choi-muong'].includes(hash)) {
          setCurrentSection('kham-pha');
        }
      }
    };

    handleHash();
    window.addEventListener('popstate', handleHash);
    return () => window.removeEventListener('popstate', handleHash);
  }, []);

  const handleNavigate = (sectionId) => {
    setCurrentSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, null, `#${sectionId}`);
  };

  const handleNavigateChapter = (chapterId) => {
    setSelectedChapter(chapterId);
    setCurrentSection('su-thi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, null, '#su-thi');
  };

  return (
    <div className="muong-rang-app">
      {/* Header Navigation */}
      <Header currentSection={currentSection} onNavigate={handleNavigate} />

      {/* Main Views */}
      <main className="main-content-area">
        {/* VIEW 1: TRANG CHỦ */}
        {currentSection === 'trang-chu' && (
          <HeroSection
            onNavigateChapter={handleNavigateChapter}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW 2: KHÁM PHÁ VĂN HÓA MƯỜNG */}
        {currentSection === 'kham-pha' && (
          <DiscoverySection onNavigate={handleNavigate} />
        )}

        {/* VIEW 3: 26 PHẦN SỬ THI */}
        {currentSection === 'su-thi' && (
          <EpicTimeline initialChapter={selectedChapter} />
        )}

        {/* VIEW 4: VR & 3D */}
        {currentSection === 'vr-tuong-tac' && (
          <VRSection />
        )}

        {/* VIEW 5: VỀ DỰ ÁN, TRIỂN LÃM, BTC */}
        {currentSection === 'about' && (
          <>
            <ExhibitionSection />
            <AboutSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
