'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { epicData, epochs } from '@/lib/epicData';
import { trackEvent } from '@/lib/tracking';

export default function EpicTimeline({ initialChapter = 1 }) {
  const [selectedEpoch, setSelectedEpoch] = useState(0); // 0 = all
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChapterId, setActiveChapterId] = useState(initialChapter);
  const [langMode, setLangMode] = useState('both'); // 'kinh', 'muong', 'both'
  const [isReading, setIsReading] = useState(false);

  const speechUtteranceRef = useRef(null);

  const handleSelectChapter = (chapId) => {
    setActiveChapterId(chapId);
    const target = epicData.find((c) => c.id === chapId);
    if (target) {
      trackEvent('track', `chuong-${target.id}`, `Sử Thi: ${target.name} (Phần ${target.id})`);
    }
  };

  useEffect(() => {
    if (initialChapter) {
      setActiveChapterId(initialChapter);
    }
  }, [initialChapter]);

  // Filtered Chapters
  const filteredChapters = useMemo(() => {
    return epicData.filter((chap) => {
      const matchEpoch = selectedEpoch === 0 || chap.epoch === selectedEpoch;
      const matchSearch =
        searchQuery.trim() === '' ||
        chap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `phần ${chap.id}`.includes(searchQuery.toLowerCase()) ||
        `chương ${chap.id}`.includes(searchQuery.toLowerCase()) ||
        (chap.context && chap.context.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchEpoch && matchSearch;
    });
  }, [selectedEpoch, searchQuery]);

  const activeChapter = useMemo(() => {
    return epicData.find((c) => c.id === activeChapterId) || epicData[0];
  }, [activeChapterId]);

  // Web Speech API Recitation
  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ phát âm thanh tự động.');
      return;
    }

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = activeChapter.kinh
        ? activeChapter.kinh.slice(0, 400).replace(/['"]/g, '')
        : activeChapter.name;

      trackEvent('track', `audio-recite-${activeChapter.id}`, `Nghe ngâm Mo: ${activeChapter.name}`);

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.88; // Slower cadence for epic recitation
      utterance.pitch = 0.95;

      utterance.onend = () => setIsReading(false);
      utterance.onerror = () => setIsReading(false);

      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  useEffect(() => {
    // Cancel speech if chapter changes
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    }
  }, [activeChapterId]);

  const handlePrev = () => {
    if (activeChapterId > 1) {
      handleSelectChapter(activeChapterId - 1);
    }
  };

  const handleNext = () => {
    if (activeChapterId < epicData.length) {
      handleSelectChapter(activeChapterId + 1);
    }
  };

  return (
    <div className="epic-timeline-container" id="su-thi" style={{ padding: '60px 0' }}>
      <div className="container">
        {/* Intro */}
        <div className="section-intro">
          <span className="intro-tag">Di Sản Ngàn Năm</span>
          <h2 className="intro-title">26 Chương Sử Thi Đẻ Đất Đẻ Nước</h2>
          <p>Trường ca đồ sộ chia thành 6 chặng thiêng liêng đắp bồi đời sống tinh thần của đất Mường</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="epic-search-filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          {/* Epoch Filters */}
          <div className="epoch-tabs-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              className={`btn ${selectedEpoch === 0 ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem', padding: '6px 14px', borderRadius: '20px' }}
              onClick={() => setSelectedEpoch(0)}
            >
              Tất cả (26)
            </button>
            {epochs.map((ep) => (
              <button
                key={ep.id}
                className={`btn ${selectedEpoch === ep.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem', padding: '6px 14px', borderRadius: '20px' }}
                onClick={() => setSelectedEpoch(ep.id)}
              >
                Chặng {ep.id}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="epic-search-wrap" style={{ position: 'relative', minWidth: '240px' }}>
            <input
              type="text"
              className="epic-search-input"
              placeholder="Tìm kiếm chương sử thi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 16px 8px 36px',
                borderRadius: '20px',
                border: '1.5px solid rgba(196, 154, 42, 0.4)',
                background: 'white',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)' }}></i>
          </div>
        </div>

        {/* Horizontal Track of Chapters */}
        <div className="timeline-horizontal-scroll" style={{ overflowX: 'auto', paddingBottom: '16px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '12px', minWidth: 'max-content' }}>
            {filteredChapters.map((chap) => {
              const isActive = chap.id === activeChapterId;
              return (
                <button
                  key={chap.id}
                  onClick={() => handleSelectChapter(chap.id)}
                  style={{
                    background: isActive ? 'var(--primary-red)' : 'white',
                    color: isActive ? 'white' : 'var(--text-dark)',
                    border: `1.5px solid ${isActive ? 'var(--primary-red)' : 'rgba(196, 154, 42, 0.3)'}`,
                    borderRadius: '12px',
                    padding: '10px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    minWidth: '150px',
                    boxShadow: isActive ? '0 6px 16px rgba(124, 31, 26, 0.25)' : '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: isActive ? 'var(--accent-gold-light)' : 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Phần {chap.id}
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {chap.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Tale Viewer */}
        {activeChapter && (
          <div className="tale-viewer-card" style={{ background: 'white', borderRadius: '18px', padding: '32px', boxShadow: '0 12px 40px rgba(0,0,0,0.08)', border: '1px solid rgba(196, 154, 42, 0.25)' }}>
            {/* Header of Viewer */}
            <div className="viewer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--paper-beige-dark)', paddingBottom: '18px', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <span style={{ background: 'var(--accent-gold)', color: 'var(--charcoal-black)', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                  Chương {activeChapter.id} / 26
                </span>
                <h3 style={{ color: 'var(--primary-red)', fontSize: '1.8rem', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
                  Phần {activeChapter.id}: {activeChapter.name}
                </h3>
              </div>

              {/* Recitation Speech & Language Switches */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                  onClick={toggleSpeech}
                  title="Nghe AI diễn xướng Mo sử thi"
                >
                  <i className={`fa-solid ${isReading ? 'fa-circle-stop' : 'fa-play'}`}></i>{' '}
                  {isReading ? 'Dừng đọc' : 'Nghe ngâm Mo'}
                </button>

                <div style={{ display: 'inline-flex', background: 'var(--paper-beige)', borderRadius: '8px', padding: '3px', border: '1px solid rgba(196, 154, 42, 0.3)' }}>
                  <button
                    onClick={() => setLangMode('both')}
                    style={{
                      border: 'none',
                      background: langMode === 'both' ? 'var(--primary-red)' : 'transparent',
                      color: langMode === 'both' ? 'white' : 'var(--text-dark)',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Song ngữ
                  </button>
                  <button
                    onClick={() => setLangMode('kinh')}
                    style={{
                      border: 'none',
                      background: langMode === 'kinh' ? 'var(--primary-red)' : 'transparent',
                      color: langMode === 'kinh' ? 'white' : 'var(--text-dark)',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Tiếng Phổ Thông
                  </button>
                  <button
                    onClick={() => setLangMode('muong')}
                    style={{
                      border: 'none',
                      background: langMode === 'muong' ? 'var(--primary-red)' : 'transparent',
                      color: langMode === 'muong' ? 'white' : 'var(--text-dark)',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Tiếng Mường
                  </button>
                </div>
              </div>
            </div>

            {/* Context Card */}
            {activeChapter.context && (
              <div style={{ background: 'var(--paper-beige)', padding: '14px 20px', borderRadius: '10px', marginBottom: '24px', borderLeft: '4px solid var(--accent-gold)' }}>
                <strong style={{ color: 'var(--primary-red)', fontSize: '0.9rem' }}>💡 Tóm tắt bối cảnh: </strong>
                <span style={{ fontSize: '0.92rem', color: 'var(--text-dark)' }}>{activeChapter.context}</span>
              </div>
            )}

            {/* Poetry Content Area */}
            <div
              className="poetry-display-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: langMode === 'both' ? '1fr 1fr' : '1fr',
                gap: '28px',
                maxHeight: '500px',
                overflowY: 'auto',
                paddingRight: '12px'
              }}
            >
              {/* Tiếng Phổ Thông */}
              {(langMode === 'both' || langMode === 'kinh') && (
                <div style={{ background: '#faf8f5', padding: '20px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <h4 style={{ color: 'var(--primary-red)', fontSize: '1.05rem', marginBottom: '14px', borderBottom: '1px dashed var(--accent-gold)', paddingBottom: '6px' }}>
                    <i className="fa-solid fa-book-open"></i> Bản Dịch Tiếng Phổ Thông
                  </h4>
                  <pre style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: 'var(--text-dark)' }}>
                    {activeChapter.kinh || 'Nội dung đang được cập nhật...'}
                  </pre>
                </div>
              )}

              {/* Tiếng Mường */}
              {(langMode === 'both' || langMode === 'muong') && (
                <div style={{ background: '#faf8f5', padding: '20px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <h4 style={{ color: 'var(--forest-green)', fontSize: '1.05rem', marginBottom: '14px', borderBottom: '1px dashed var(--forest-green-light)', paddingBottom: '6px' }}>
                    <i className="fa-solid fa-feather-pointed"></i> Nguyên Bản Tiếng Mường (Mo)
                  </h4>
                  <pre style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: 'var(--text-dark)', fontStyle: 'italic' }}>
                    {activeChapter.muong || 'Nội dung đang được cập nhật...'}
                  </pre>
                </div>
              )}
            </div>

            {/* Bottom Navigator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--paper-beige-dark)' }}>
              <button
                className="btn btn-secondary"
                disabled={activeChapterId <= 1}
                onClick={handlePrev}
                style={{ opacity: activeChapterId <= 1 ? 0.4 : 1, fontSize: '0.9rem' }}
              >
                <i className="fa-solid fa-chevron-left"></i> Phần trước
              </button>

              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Chương {activeChapterId} trên 26
              </span>

              <button
                className="btn btn-primary"
                disabled={activeChapterId >= epicData.length}
                onClick={handleNext}
                style={{ opacity: activeChapterId >= epicData.length ? 0.4 : 1, fontSize: '0.9rem' }}
              >
                Phần tiếp theo <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
