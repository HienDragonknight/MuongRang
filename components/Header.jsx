'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Header({ currentSection, onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const audioCtxRef = useRef(null);
  const ambientHumRef = useRef(null);
  const intervalsRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Web Audio Ambiance Synthesizer
  const toggleAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const ctx = audioCtxRef.current;
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      stopAmbiance();
    } else {
      setIsPlayingAudio(true);
      if (ctx.state === 'suspended') ctx.resume();
      playAmbiance();
    }
  };

  const playAmbiance = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Forest wind hum
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.0;
    filter.frequency.value = 200;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.025;

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    whiteNoise.start();
    ambientHumRef.current = whiteNoise;

    // Pentatonic Gong Loop
    const gongNotes = [110, 130.81, 146.83, 164.81, 196.00, 220.00];
    const gongInterval = setInterval(() => {
      if (Math.random() > 0.45) {
        const note = gongNotes[Math.floor(Math.random() * gongNotes.length)];
        triggerGongSound(note, 0.05);
      }
    }, 3800);

    intervalsRef.current.push(gongInterval);
  };

  const triggerGongSound = (freq, vol = 0.05) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.5, now);

    gainNode.gain.setValueAtTime(vol, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.6);
    osc2.stop(now + 2.6);
  };

  const stopAmbiance = () => {
    if (ambientHumRef.current) {
      try { ambientHumRef.current.stop(); } catch (e) {}
      ambientHumRef.current = null;
    }
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];
  };

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(sectionId);
    }
  };

  return (
    <header className={isScrolled ? 'scrolled' : ''}>
      <div className="container">
        {/* Logo */}
        <a href="#trang-chu" onClick={(e) => { e.preventDefault(); handleNavClick('trang-chu'); }} className="logo-container">
          <img src="/resources/LOGO BACK ĐỎ.PNG" alt="Logo Sử Thi Tân Diện" className="logo-img" />
          <div className="logo-text-wrap">
            <span className="logo-title">Sử Thi Tân Diện</span>
            <span className="logo-subtitle">Đẻ Đất Đẻ Nước</span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className={`main-nav ${mobileMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li>
              <a
                href="#trang-chu"
                className={currentSection === 'trang-chu' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNavClick('trang-chu'); }}
              >
                Trang chủ
              </a>
            </li>
            <li>
              <a
                href="#kham-pha"
                className={currentSection === 'kham-pha' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNavClick('kham-pha'); }}
              >
                Khám phá
              </a>
            </li>
            <li>
              <a
                href="#su-thi"
                className={currentSection === 'su-thi' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNavClick('su-thi'); }}
              >
                Sử thi Tân diện
              </a>
            </li>
            <li>
              <a
                href="#vr-tuong-tac"
                className={currentSection === 'vr-tuong-tac' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNavClick('vr-tuong-tac'); }}
              >
                VR & 3D
              </a>
            </li>
            <li>
              <a
                href="#about"
                className={currentSection === 'about' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}
              >
                Về dự án
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Mở menu"
        >
          <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

        {/* Actions (Audio Controller) */}
        <div className="nav-actions">
          <button
            className="audio-toggle-btn"
            id="audio-control"
            onClick={toggleAudio}
            title={isPlayingAudio ? 'Tắt âm thanh di sản' : 'Bật âm thanh không gian Mường'}
          >
            <i className={`audio-icon fa-solid ${isPlayingAudio ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
            <span className="audio-label">Âm vang</span>
            <div className={`audio-waves ${isPlayingAudio ? 'playing' : ''}`}>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
