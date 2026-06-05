/**
 * Mường Rằng Landing Page - Interactive Application Logic
 * Implements SPA navigation, audio synthesis, interactive timeline, and stilt house simulation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize subsystems
  initSPA();
  initAudio();
  initIntersectionObserver();
  initPlatterInteraction();
  initEpicTimeline();
  initVRInteraction();
  initModel3DInteraction();
  initSearchLogic();
});

/* ==========================================================================
   1. SINGLE PAGE APPLICATION (SPA) NAVIGATION
   ========================================================================== */
function initSPA() {
  const sections = document.querySelectorAll('.view-section');

  function switchTab(targetId) {
    if (!targetId || targetId.startsWith('#ex-')) return;
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Remove active class from all navigation items
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === targetId) {
        link.classList.add('active');
      }
    });

    // Toggle active section
    sections.forEach(section => {
      section.classList.remove('active');
      if ('#' + section.id === targetId) {
        section.classList.add('active');
      }
    });

    // Custom view lifecycle hooks
    if (targetId === '#su-thi') {
      setTimeout(updateTimelineProgress, 200);
    }
  }

  // Global Event Delegation for Links starting with '#'
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href && href.startsWith('#') && !href.startsWith('#ex-')) {
      e.preventDefault();
      switchTab(href);
      history.pushState(null, null, href);
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    const hash = window.location.hash || '#trang-chu';
    switchTab(hash);
  });

  // Sticky Header Effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Hamburger Toggle
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (mobileNavToggle && mainNav) {
    mobileNavToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      const icon = mobileNavToggle.querySelector('i');
      if (icon) {
        if (mainNav.classList.contains('active')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !mobileNavToggle.contains(e.target)) {
        mainNav.classList.remove('active');
        const icon = mobileNavToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
  }

  // Handle links clicking to showcase chapters from Trang chủ
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.showcase-link');
    if (link) {
      const chapterId = parseInt(link.getAttribute('data-go-chapter'));
      if (chapterId) {
        setTimeout(() => {
          const taleItem = document.querySelector(`.tale-list-item[data-id="${chapterId}"]`);
          if (taleItem) taleItem.click();
        }, 150);
      }
    }
  });

  // Set default view on load
  const initialHash = window.location.hash || '#trang-chu';
  switchTab(initialHash);
}


/* ==========================================================================
   2. DYNAMIC WEB AUDIO AMBIENCE SYNTHESIZER
   ========================================================================== */
let audioCtx = null;
let isAudioPlaying = false;
let ambientHum = null;
let bgMusicInterval = null;
let noiseFilterInterval = null;

function initAudio() {
  const controller = document.getElementById('audio-control');
  const icon = controller.querySelector('.audio-icon');
  const waves = controller.querySelector('.audio-waves');

  controller.addEventListener('click', () => {
    if (!audioCtx) {
      // Lazy initialize Audio Context on user gesture due to browser policies
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (isAudioPlaying) {
      // Pause
      isAudioPlaying = false;
      waves.classList.remove('playing');
      icon.className = 'fa-solid fa-volume-xmark';
      stopAmbiance();
    } else {
      // Play
      isAudioPlaying = true;
      waves.classList.add('playing');
      icon.className = 'fa-solid fa-volume-high';
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      playAmbiance();
    }
  });
}

function playAmbiance() {
  if (!audioCtx) return;

  // 1. Synthesize Forest Hum (Sweeping low frequency noise filter simulating wind)
  const bufferSize = 2 * audioCtx.sampleRate;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1; // White noise
  }

  const whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 1.0;
  filter.frequency.value = 200;

  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.03; // Soft volume

  whiteNoise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  whiteNoise.start();
  ambientHum = whiteNoise;

  // Sweep wind frequency back and forth
  let angle = 0;
  noiseFilterInterval = setInterval(() => {
    if (audioCtx) {
      const freq = 200 + Math.sin(angle) * 80;
      filter.frequency.setValueAtTime(freq, audioCtx.currentTime);
      angle += 0.05;

      // Occasional birds chirp
      if (Math.random() > 0.96) {
        triggerBirdChirp();
      }
    }
  }, 100);

  // 2. Ceremonial Pentatonic Bells loop (randomized)
  const gongNotes = [110, 130.81, 146.83, 164.81, 196.00, 220.00]; // Low A, C, D, E, G, A
  bgMusicInterval = setInterval(() => {
    if (Math.random() > 0.4) {
      const note = gongNotes[Math.floor(Math.random() * gongNotes.length)];
      triggerGongSound(note, 0.06);
    }
  }, 3500);
}

function triggerBirdChirp() {
  if (!audioCtx || !isAudioPlaying) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
  osc.frequency.exponentialRampToValueAtTime(1800 + Math.random() * 200, now + 0.15);

  gain.gain.setValueAtTime(0.005, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}

function stopAmbiance() {
  if (ambientHum) {
    try {
      ambientHum.stop();
    } catch(e) {}
    ambientHum = null;
  }
  if (noiseFilterInterval) {
    clearInterval(noiseFilterInterval);
    noiseFilterInterval = null;
  }
  if (bgMusicInterval) {
    clearInterval(bgMusicInterval);
    bgMusicInterval = null;
  }
}

// Procedural Gong Synthesizer (Metallic bronze ring)
function triggerGongSound(frequency = 110, volume = 0.2) {
  if (!audioCtx || !isAudioPlaying) return;

  const now = audioCtx.currentTime;
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator(); // harmonic
  const gainNode = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(frequency, now);

  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(frequency * 1.5, now); // 5th harmonic

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, now);
  filter.frequency.exponentialRampToValueAtTime(100, now + 2.0);

  gainNode.gain.setValueAtTime(volume, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.5); // long decay

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 2.6);
  osc2.stop(now + 2.6);
}


/* ==========================================================================
   3. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
   ========================================================================== */
function initIntersectionObserver() {
  const animatedElements = document.querySelectorAll('.scroll-fade-up, .scroll-scale');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}


/* ==========================================================================
   4. CULINARY PLATTER INTERACTIVE ROTATION
   ========================================================================== */
function initPlatterInteraction() {
  // Mẹt Ẩm Thực Hotspot & Sector Interaction
  const hotspots = document.querySelectorAll('.platter-hotspot');
  const sectors = document.querySelectorAll('.wheel-sector');
  const foodCards = document.querySelectorAll('.food-detail-card');
  const platterImg = document.getElementById('interactive-platter-img');

  if (!platterImg) return;

  function selectFood(targetFoodId) {
    // Update hotspots active state
    hotspots.forEach(h => {
      if (h.getAttribute('data-food') === targetFoodId) {
        h.classList.add('active');
      } else {
        h.classList.remove('active');
      }
    });

    // Update sectors active state
    sectors.forEach(s => {
      if (s.getAttribute('data-food') === targetFoodId) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    // Update food info display
    foodCards.forEach(card => {
      card.classList.remove('active');
      if (card.id === targetFoodId) {
        card.classList.add('active');
      }
    });

    // Play soft sound on click
    triggerGongSound(330, 0.05); // high pitch gong ring
    
    // Spin platter to highlight active food (brings it to the right position at 0deg)
    const rotationDegrees = {
      'com-lam': 0,
      'lon-ban': -90,
      'rau-rung': -180,
      'mam-co': -270
    };
    platterImg.style.transform = `rotate(${rotationDegrees[targetFoodId] || 0}deg)`;
    platterImg.style.transition = 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
  }

  // Click on hotspots
  hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', () => {
      const targetFoodId = hotspot.getAttribute('data-food');
      selectFood(targetFoodId);
    });
  });

  // Click on sectors
  sectors.forEach(sector => {
    sector.addEventListener('click', () => {
      const targetFoodId = sector.getAttribute('data-food');
      selectFood(targetFoodId);
    });
  });

  // Set initial active state for first sector
  const activeHotspot = document.querySelector('.platter-hotspot.active');
  if (activeHotspot) {
    const targetFoodId = activeHotspot.getAttribute('data-food');
    sectors.forEach(s => {
      if (s.getAttribute('data-food') === targetFoodId) {
        s.classList.add('active');
      }
    });
  }
}


/* ==========================================================================
   5. INTERACTIVE 26 EPIC PARTS TIMELINE
   ========================================================================== */
// Authentic 26 parts of Mo Mường Sử Thi
const epicData = [
  { id: 1, name: "Mở đầu", epoch: 1, kinh: "Thuở sơ khai chưa đẻ đất đẻ nước\nVũ trụ chỉ toàn là hơi khói mờ mịt...", muong: "Hết ngày xưa cỏ khô lại rữa\nHết ngày xưa đất cát lại trôi...", context: "Chương mở đầu diễn tả cội nguồn vũ trụ thuở hỗn mang, nước ngập mênh mông, đất chưa thành hình. Thầy Mo khấn mời linh hồn thần tiên tổ và thần linh đồi suối chứng kiến lễ cúng cầu an bản mường." },
  { id: 2, name: "Đẻ Đất", epoch: 1, kinh: "Đất đai đẻ ra từ khe sâu đá dựng\nĐất mọc mầm dâng đất cao lộng gió...", muong: "Đẻ tấc mọc núi cao ngất ngưởng\nĐất trồi lên chắn gió ngàn suối...", context: "Khắc họa sự kiến tạo lục địa và đất đai vững chãi. Từ lớp bùn lầy nứt nẻ trồi lên những sườn núi hiểm trở cheo leo, làm chỗ đứng cho vạn vật đầu tiên." },
  { id: 3, name: "Đẻ Nước", epoch: 1, kinh: "Nước từ khe nguồn rủ nhau chảy xuôi\nNước đổ đầy dòng suối xanh thung lũng...", muong: "Đẻ đác tuôn tràn ngập suối rộc\nNước nguồn tuôn mở lối sông sâu...", context: "Nước nguồn sinh ra rửa sạch khô hạn đồi núi, lấp đầy thung lũng sâu tạo thành suối mát sông dài, cung cấp nhựa sống tươi mới dạt dào cho đất mọc cỏ cây." },
  { id: 4, name: "Đẻ Cây Si", epoch: 1, kinh: "Hạt giống si mọc lên xanh ngát\nCành nối đất dày rễ nối trời cao...", muong: "Đẻ si cụ si gốc si cành khổng lồ\nLá xum xuê che kín vách trời...", context: "Cây Si thần mọc lên từ thuở ban sơ. Nó vươn cành khổng lồ nối liền âm dương đất trời, là tổ ấm che chở thần linh và chim muông huyền thoại sinh sống." },
  { id: 5, name: "Đẻ Mường", epoch: 1, kinh: "Phân chia bờ cõi thung lũng bốn phương\nMở mầm sống ấm cúng bốn phương mường...", muong: "Đẻ mường dựng cọc phân bờ suối\nChia làng xưa xóm cổ bình yên...", context: "Thiết lập vùng đất định cư sơ khởi cho đồng bào. Chia núi chia sông thành bốn phương Mường rạch ròi, ngăn nắp làm tiền đề dựng bản làng ấm cúng." },
  { id: 6, name: "Đẻ Người", epoch: 1, kinh: "Trứng si nở ra đôi nam nữ đầu tiên\nBước đi vững chãi mở dòng giống Mường...", muong: "Trứng nở đôi chim hóa ra đôi người\nTộc Lang tộc Cun mở đầu nòi giống...", context: "Chim thần đẻ ra vô số quả trứng trên cành si thần. Trứng nở ra các thủ lĩnh tộc Lang đạo, tộc Cun và những con người Mường đầu tiên mở đầu cho nòi giống." },
  { id: 7, name: "Đẻ Năm tháng", epoch: 1, kinh: "Sinh ra mười hai tháng luân hồi thời gian\nĐịnh mùa lúa trổ mùa mưa gió lạnh...", muong: "Chia năm tháng mười hai nhịp mùa vụ\nTrăng mọc trăng khuyết quy luật tự nhiên...", context: "Lập ra khái niệm thời gian tuần hoàn. Định rõ mười hai tháng, xuân hạ thu đông để bà con biết theo dõi mùa vụ cấy cày và ngày hội xuống đồng xuân sang." },
  { id: 8, name: "Đẻ Dịt Dàng", epoch: 1, kinh: "Sự phân chia các loài thú dữ đồi cao\nMuông chim thú rừng sinh sôi vách núi...", muong: "Sinh dịt dàng loài thú leo rừng rậm\nChim bay ngàn thú chạy ven khe suối...", context: "Mô tả sự xuất hiện của các loài động thực vật hoang dã. Phân loại muông thú, côn trùng để xác định ranh giới sinh tồn giữa con người và tự nhiên hoang dã." },
  { id: 9, name: "Đẻ Lang Tá Cái", epoch: 1, kinh: "Sự xuất hiện của nữ thần bảo trợ hoa văn\nDạy thêu dệt và nghi lễ linh thiêng...", muong: "Lang Tá Cái sinh ra giữ nếp dệt thổ cẩm\nGiữ phép cúng linh thiêng mường bản...", context: "Kể về vị nữ thần Lang Tá Cái, người dạy con gái Mường thêu dệt thổ cẩm cạp váy rực rỡ và lập ra các phép cúng tế gìn giữ đạo đức truyền thống tốt đẹp." },
  { id: 10, name: "Đẻ Lang Cun Cần", epoch: 1, kinh: "Người anh hùng đầu tiên dựng phép cai trị\nTập hợp sức mạnh lãnh đạo bốn mường...", muong: "Lang Cun Cần đứng đầu mường lớn\nDựng cọc quyền cai quản muôn dân...", context: "Tôn vinh Lang Cun Cần - vị thủ lĩnh đầu tiên có công thống nhất bờ cõi, tổ chức đời sống lao động tập thể và duy trì trật tự thái bình cho đất Mường." },
  { id: 11, name: "Làm nhà ở", epoch: 2, kinh: "Nhìn dáng rùa vàng bò lên sườn dốc\nDựng bốn cột gỗ gác mái nhà sàn...", muong: "Nhìn rùa vàng dựng nhà tránh gió sương\nBốn cột chân vững chãi như chân rùa...", context: "Thần Rùa vàng (Cáo Rùa) dạy người Mường cách dựng nhà sàn: mái dốc chống đọng sương, bốn cột to vững như chân rùa giúp tránh thú dữ đồi núi hiểm trở." },
  { id: 12, name: "Tìm lửa", epoch: 2, kinh: "Đập đá tảng lấy tia lửa hồng ấm cúng\nNhóm lò bếp khói xua tan giá băng...", muong: "Gõ đá lửa tìm lửa sưởi đêm lạnh\nGiữ than hồng góc bếp ấm nhà sàn...", context: "Cuộc hành trình vất vả tìm ra ngọn lửa từ việc đánh đá lửa. Ngọn lửa mang lại ánh sáng, sưởi ấm sàn đêm đông và đun chín lương thực ngọt ngào." },
  { id: 13, name: "Tìm lúa, trâu, bò, lợn, gà...", epoch: 2, kinh: "Thuần hóa trâu bò lội bùn kéo cày\nGieo hạt lúa nương gặt bông vàng dẻo...", muong: "Tìm hạt gạo vàng gieo đồi nương rộng\nBắt lợn gà về chuồng nuôi sinh sôi...", context: "Thời kỳ thuần hóa động thực vật phục vụ canh tác nông nghiệp. Người dân biết gieo trồng hạt lúa nương dẻo thơm, nuôi trâu cày ruộng, lợn gà đầy chuồng." },
  { id: 14, name: "Tìm rượu", epoch: 2, kinh: "Ủ men lá rừng chưng cất rượu cần ngọt lịm\nVít cong cần trúc quây quần sum họp...", muong: "Nấu rượu cần chum sành cắm cần trúc\nUống say nồng đượm nghĩa bạn mường...", context: "Sự ra đời của rượu cần - đồ uống nghi lễ thiêng liêng thể hiện lòng chân thành hiếu khách, sự gắn kết keo sơn của đồng bào quanh bếp lửa sàn." },
  { id: 15, name: "Lang Cun Cần lấy vợ...", epoch: 3, kinh: "Tìm người vợ hiền lập nếp gia tộc\nHai họ kết giao trọn đời gắn bó...", muong: "Lang Cun Cần tìm vợ lập đôi lứa\nĂn cỗ dạm hỏi dâng trầu dâng cau...", context: "Đặt ra quy tắc hôn nhân gia đình đầu tiên. Nghi thức dạm ngõ, cưới hỏi trân trọng rốt ráo ngăn ngừa tình trạng hôn nhân lộn xộn ngày sơ khởi." },
  { id: 16, name: "Đẻ Trống đồng", epoch: 4, kinh: "Đúc lò rèn đúc trống đồng vang dội\nTiếng đồng thiêng gọi bạn mường bốn phương...", muong: "Đúc trống thiêng đồng thau reo giòn giã\nGõ cồng chiêng ngân vang núi ngàn...", context: "Chế tác trống đồng thiêng liêng và dàn cồng chiêng 12 chiếc. Trở thành pháp khí linh hồn gắn bó với nghi lễ vòng đời sinh tử của đồng bào Mường." },
  { id: 17, name: "Chia ruộng đất", epoch: 4, kinh: "Phân chia bờ mương chia rẫy canh tác\nĐất của Lang giữ đất của dân cày...", muong: "Chia ruộng chia nước công bằng mường bản\nĐắp bờ mương lúa trổ bông xanh...", context: "Thiết lập phân chia ruộng đất công bằng để canh tác lúa nước. Đắp bờ ngăn nước suối về đồng ruộng, đảm bảo mùa vụ no đủ trật tự." },
  { id: 18, name: "Tìm Chu", epoch: 4, kinh: "Đi tìm loài cây gỗ quý dựng đền thờ\nGỗ đinh gỗ sến dựng cột nhà lang...", muong: "Tìm cây chu thiêng làm cột nhà lớn\nĐục mộng liên kết dựng đền nghiêm...", context: "Hành trình xuyên rừng sâu tìm kiếm cây Chu thiêng (gỗ cổ quý hiếm) để đốn về dựng cột nhà Lang vĩ đại chống đỡ gió bão đồi dốc." },
  { id: 19, name: "Chặt Chu", epoch: 4, kinh: "Quyết tâm chặt ngã thân gỗ si khổng lồ\nKhói búa vang rừng quyết giữ chí bền...", muong: "Vung búa sắt phạt gốc chu thiêng rộng\nNgã đổ vang trời đất mường rung...", context: "Ý chí kiên cường dũng mãnh đốn đổ cây Chu thần khổng lồ ngăn trở mặt trời, mở rộng ánh sáng rực rỡ chiếu rọi thung lũng gieo trồng mùa màng." },
  { id: 20, name: "Làm Nhà Chu", epoch: 4, kinh: "Dựng ngôi nhà lang vĩ đại nguy nga lộng gió\nChạm trổ rồng bay chim lạc vây quanh...", muong: "Dựng nhà Chu cột gỗ đanh vững chãi\nMái lá chuốt bóng lộng lẫy uy nghiêm...", context: "Hoàn thành dựng ngôi nhà sàn gỗ to lớn cho Lang Cun Cần cai trị, thể hiện tài nghệ xây dựng thủ công ghép mộng khớp mộc mạc vô song của thợ xưa." },
  { id: 21, name: "Đốt Nhà Chu", epoch: 5, kinh: "Giặc giã nổi lên châm lửa đốt nhà Chu\nKhói lửa cháy bùng căm phẫn lòng dân...", muong: "Lửa cháy nhà Chu khói đen mù mịt\nGiặc ngoài tàn ác hại dân lành...", context: "Sự xung đột xã hội nổ ra khi kẻ thù hung tợn phóng hỏa đốt phá nhà Chu. Thể hiện nỗi đau thương và sự căm phẫn kêu gọi nghĩa sĩ đứng dậy dẹp loạn." },
  { id: 22, name: "Săn Moong Lồ", epoch: 5, kinh: "Vác khiên vác cung săn mãnh thú Moong Lồ\nĐồng lòng diệt ác giữ bình yên bản mường...", muong: "Đi săn Moong Lồ thú dữ hại bản\nBắn cung tên vây chặt sườn đồi...", context: "Chiến công lẫy lừng tập hợp trai tráng săn tiêu diệt Moong Lồ (thú dữ khổng lồ phá hoại xóm làng). Minh chứng cho tinh thần đại đoàn kết bất khuất." },
  { id: 23, name: "Đánh Cá điên, qua điên", epoch: 5, kinh: "Vượt suối sâu lội sông bắt cá dữ\nLưới bện đay đanh giữ sạch nguồn nước...", muong: "Đánh cá điên phá lưới sông dữ dội\nBắt thuồng luồng giữ yên suối trong...", context: "Cuộc chiến chế ngự dòng nước dữ chống lại loài cá điên và thuồng luồng phá hoại lưới chài, bảo vệ nguồn nước trong mát yên bình cho bà con." },
  { id: 24, name: "Đánh Ma ruộng", epoch: 5, kinh: "Trừ khử tà ma quấy nhiễu ruộng lúa non\nGiữ bông lúa vàng trổ bông trĩu hạt...", muong: "Đuổi ma ruộng phá hoại lúa nương xanh\nGọi vía lúa về đầy bồ thóc ấm...", context: "Nghi lễ cúng trừ tà ma phá hại mùa màng lúa nước, gọi vía lúa thiêng trở về đầy bồ đầy kho nâng đỡ cuộc sống ấm no tràn đầy." },
  { id: 25, name: "Đánh Ma may Ma lang", epoch: 5, kinh: "Xua đuổi dịch bệnh quấy hại gia đạo\nĐốt ngải cứu xông ấm nhà sàn đêm đông...", muong: "Đánh ma bệnh hại con cháu ốm đau\nCầu sức khỏe bình an ngập nhà sàn...", context: "Vượt qua thử thách bệnh tật dịch bệnh hoành hành thung lũng cổ xưa, thầy Mo cúng chữa bệnh trừ tà giữ sức khỏe cho dân làng hanh thông thái bình." },
  { id: 26, name: "Lo quần áo", epoch: 6, kinh: "Mặc áo pắn thắt cạp váy thổ cẩm trang trọng\nBản mường bình yên thái bình muôn đời...", muong: "Mặc váy hoa cạp dệt phượng hoàng rực rỡ\nGiữ phép phục trang cội nguồn tiên tổ...", context: "Sử thi khép lại bằng nghi thức mặc trang phục truyền thống nghiêm cẩn. Quy định nề nếp ăn mặc chỉn chu, chúc cho đất Mường thái bình no ấm vĩnh cửu." }
];

const epochs = [
  { id: 1, name: "Chặng 1: Khai Thiên Lập Địa", range: "Phần 1 - 10" },
  { id: 2, name: "Chặng 2: Kiến Thiết Đời Sống", range: "Phần 11 - 14" },
  { id: 3, name: "Chặng 3: Gia Đình & Gia Tộc", range: "Phần 15" },
  { id: 4, name: "Chặng 4: Tổ Chức Xã Hội", range: "Phần 16 - 20" },
  { id: 5, name: "Chặng 5: Đấu Tranh Sinh Tồn", range: "Phần 21 - 25" },
  { id: 6, name: "Chặng 6: Kiến Tạo Thái Bình", range: "Phần 26" }
];

let activeTaleId = 1;

function initEpicTimeline() {
  const filterWrap = document.getElementById('timeline-filters-list');
  const track = document.getElementById('timeline-track');
  const talesList = document.getElementById('tales-list');

  if (!filterWrap || !track || !talesList) return;

  // 1. Render timeline filter buttons
  filterWrap.innerHTML = `<button class="filter-btn active" data-epoch="all">Tất cả chặng</button>`;
  epochs.forEach(ep => {
    filterWrap.innerHTML += `<button class="filter-btn" data-epoch="${ep.id}">${ep.name}</button>`;
  });

  // 2. Render timeline nodes
  renderTimelineNodes('all');

  // 3. Filter button click event listener
  filterWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (btn) {
      filterWrap.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const selectedEpoch = btn.getAttribute('data-epoch');
      
      renderTimelineNodes(selectedEpoch);
      renderTalesList(selectedEpoch);
      
      // Select first item of the filtered list automatically
      const firstItem = talesList.querySelector('.tale-list-item');
      if (firstItem) {
        firstItem.click();
      }
    }
  });

  // 4. Render initial tales directory list
  renderTalesList('all');
  
  // Select first story details
  showTaleDetails(1);

  // 5. Speech Synthesis "Poetic Recitation" Trigger
  const speakBtn = document.getElementById('btn-recite');
  if (speakBtn) {
    speakBtn.addEventListener('click', () => {
      const activeTale = epicData.find(t => t.id === activeTaleId);
      if (!activeTale) return;

      // Check if speaking, then toggle
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        speakBtn.innerHTML = '▶ Nghe ngâm thơ';
        return;
      }

      const activeTextEl = document.querySelector('.bilingual-text.active');
      const textToSpeak = activeTextEl ? activeTextEl.textContent : activeTale.kinh;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.82; // Slower cadence for traditional poem ngâm Mo
      utterance.pitch = 0.85; // Lower pitch for solemn resonance

      utterance.onend = () => {
        speakBtn.innerHTML = '▶ Nghe ngâm thơ';
      };

      speakBtn.innerHTML = '⏸ Dừng nghe';
      window.speechSynthesis.speak(utterance);
      
      // Play a ceremonial gong sound at start of recitation
      triggerGongSound(110, 0.15);
    });
  }
}

function renderTimelineNodes(epochFilter) {
  const track = document.getElementById('timeline-track');
  if (!track) return;
  const filteredEpochs = epochFilter === 'all' ? epochs : epochs.filter(e => e.id == epochFilter);
  
  track.innerHTML = '<div class="timeline-progress-bar" id="timeline-progress-bar"></div>';
  
  filteredEpochs.forEach((ep) => {
    const firstTaleOfEpoch = epicData.find(t => t.epoch === ep.id);
    if (!firstTaleOfEpoch) return;
    const node = document.createElement('div');
    node.className = `timeline-node ${activeTaleId === firstTaleOfEpoch.id ? 'active' : ''}`;
    node.dataset.taleId = firstTaleOfEpoch.id;
    node.onclick = () => selectNode(node, firstTaleOfEpoch.id);

    node.innerHTML = `
      <span class="node-epoch">Chặng ${ep.id}</span>
      <div class="node-point"></div>
      <h4 class="node-title">${ep.name}</h4>
      <span class="node-desc">${ep.range}</span>
    `;
    track.appendChild(node);
  });

  setTimeout(updateTimelineProgress, 50);
}

function selectNode(nodeEl, taleId) {
  document.querySelectorAll('.timeline-node').forEach(node => node.classList.remove('active'));
  nodeEl.classList.add('active');
  showTaleDetails(taleId);

  // Sync index list
  const listItems = document.querySelectorAll('.tale-list-item');
  listItems.forEach(item => {
    item.classList.remove('active');
    if (item.dataset.id == taleId) {
      item.classList.add('active');
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  updateTimelineProgress();
}

function updateTimelineProgress() {
  const progressBar = document.getElementById('timeline-progress-bar');
  const activeNode = document.querySelector('.timeline-node.active');
  const nodes = document.querySelectorAll('.timeline-node');
  
  if (!progressBar || !activeNode || nodes.length <= 1) return;

  const activeIndex = Array.from(nodes).indexOf(activeNode);
  const totalSteps = nodes.length - 1;
  const progressPercent = (activeIndex / totalSteps) * 100;
  progressBar.style.width = `${progressPercent}%`;
}

function renderTalesList(epochFilter, matchingIds = null) {
  const listContainer = document.getElementById('tales-list');
  if (!listContainer) return;
  listContainer.innerHTML = '';
  
  let filteredTales = epicData;
  if (matchingIds) {
    filteredTales = epicData.filter(t => matchingIds.includes(t.id));
  } else if (epochFilter !== 'all') {
    filteredTales = epicData.filter(t => t.epoch == epochFilter);
  }

  filteredTales.forEach(tale => {
    const item = document.createElement('div');
    item.className = `tale-list-item ${tale.id === activeTaleId ? 'active' : ''}`;
    item.dataset.id = tale.id;
    item.onclick = () => {
      document.querySelectorAll('.tale-list-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      showTaleDetails(tale.id);

      // Sync active timeline node
      document.querySelectorAll('.timeline-node').forEach(node => {
        node.classList.remove('active');
        if (node.dataset.taleId == tale.id) {
          node.classList.add('active');
        }
      });
      updateTimelineProgress();
    };

    item.innerHTML = `
      <span class="tale-item-num">${tale.id.toString().padStart(2, '0')}</span>
      <span class="tale-item-name">${tale.name}</span>
    `;
    listContainer.appendChild(item);
  });
}

function showTaleDetails(taleId) {
  activeTaleId = taleId;
  const tale = epicData.find(t => t.id === taleId);
  const viewer = document.getElementById('tale-viewer');
  
  if (!tale || !viewer) return;

  // Cancel speech recitation if ongoing
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    const reciteBtn = document.getElementById('btn-recite');
    if (reciteBtn) reciteBtn.innerHTML = '▶ Nghe ngâm thơ';
  }

  viewer.innerHTML = `
    <div class="tale-detail-view">
      <div class="tale-detail-header">
        <div class="tale-title-area">
          <span class="tale-epoch-badge">Chặng ${tale.epoch} - Sử thi Đẻ Đất Đẻ Nước</span>
          <h3>Phần ${tale.id}: ${tale.name}</h3>
        </div>
      </div>
      
      <div class="narrative-tabs">
        <button class="narrative-tab-btn active" data-lang="kinh">Bản Phổ thông</button>
        <button class="narrative-tab-btn" data-lang="muong">Bản tiếng Mường cổ</button>
      </div>

      <div class="narrative-content">
        <div id="text-kinh" class="bilingual-text active">
          <p><strong>Dịch thơ Việt:</strong></p>
          <p style="white-space: pre-line; font-style: italic; font-family: var(--font-heading); font-size: 1.25rem; color: var(--primary-red); border-left: 2px SOLID var(--accent-gold); padding-left: 16px; margin-bottom: 24px; line-height:1.7;">
            ${tale.kinh}
          </p>
          <p><strong>Ý nghĩa cốt truyện:</strong></p>
          <p style="line-height:1.6; font-size:0.95rem;">${tale.context}</p>
        </div>
        <div id="text-muong" class="bilingual-text">
          <p><strong>Phiên âm Mường cổ:</strong></p>
          <p style="white-space: pre-line; font-style: italic; font-family: var(--font-heading); font-size: 1.25rem; color: var(--primary-red); border-left: 2px SOLID var(--accent-gold); padding-left: 16px; line-height:1.7;">
            ${tale.muong}
          </p>
        </div>
      </div>
    </div>
  `;

  // Re-attach narrative tab click listeners inside viewer
  const tabs = viewer.querySelectorAll('.narrative-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const lang = tab.getAttribute('data-lang');
      viewer.querySelectorAll('.bilingual-text').forEach(text => {
        text.classList.remove('active');
        if (text.id === `text-${lang}`) {
          text.classList.add('active');
        }
      });
    });
  });
}


/* ==========================================================================
   6. INTERACTIVE 3D/VR STILT HOUSE SIMULATION
   ========================================================================== */
const vrHotspotData = {
  'bep-lua': {
    title: 'Bếp Lửa Sàn',
    desc: 'Bếp lửa là linh hồn của nhà sàn Mường, đặt trang trọng góc trong cùng. Vừa dùng sưởi ấm đêm sương rừng buốt lạnh, đun nấu ngũ cốc vừa là không gian gia tộc quây quần vít cần rượu nếp, mo kể sử thi.',
    img: 'resources/muong_hero_bg.png',
    freq: 150
  },
  'cong-chieng': {
    title: 'Dàn Cồng Chiêng',
    desc: 'Cồng chiêng là nhạc cụ đúc đồng linh thiêng nhất, nhịp gõ dẫn đường linh hồn cúng mo, chào đón lộc xuân sắc bùa cầu mong mùa vụ thóc lúa đầy bồ gia súc sinh sôi.',
    img: 'resources/muong_cong_chieng.png',
    freq: 110
  },
  'ruou-can': {
    title: 'Chum Rượu Cần',
    desc: 'Rượu cần Mường ủ men lá rừng thơm bùi, cắm cần trúc cong vút biểu trưng sum họp, xóa nhòa mọi ranh giới khách quý vây quanh đầm ấm nghĩa tình.',
    img: 'resources/muong_am_thuc.png',
    freq: 220
  },
  'cot-tru': {
    title: 'Cột Cái Nhà Sàn',
    desc: 'Cột cái làm bằng lim rừng đại ngọc nâng đỡ mái dốc nghiêng cao. Đại diện cho đạo lý tôn ty dòng tộc Lang đạo vững chãi che mưa sương núi đồi.',
    img: 'resources/muong_stilt_house_hero.png',
    freq: 80
  }
};

function initVRInteraction() {
  const canvas = document.getElementById('vr-canvas');
  const hotspots = document.querySelectorAll('#pane-tab-vr .hotspot-trigger');
  const detailSidebar = document.getElementById('vr-sidebar-content');
  const placeholder = document.getElementById('vr-sidebar-placeholder');

  if (!canvas || hotspots.length === 0) return;

  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    drawStiltHouseWireframe();
  }

  function drawStiltHouseWireframe() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background sky dark
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGrad.addColorStop(0, '#150f0a');
    skyGrad.addColorStop(1, '#3a2a1c');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Mountains shape
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.7);
    ctx.quadraticCurveTo(canvas.width * 0.25, canvas.height * 0.45, canvas.width * 0.5, canvas.height * 0.65);
    ctx.quadraticCurveTo(canvas.width * 0.75, canvas.height * 0.5, canvas.width, canvas.height * 0.75);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fillStyle = '#261a12';
    ctx.fill();

    // Stilt house wireframe lines
    ctx.strokeStyle = 'rgba(204, 164, 59, 0.25)';
    ctx.lineWidth = 2;

    const startX = canvas.width * 0.2;
    const houseW = canvas.width * 0.6;
    const groundY = canvas.height * 0.8;
    const floorY = canvas.height * 0.55;
    const roofY = canvas.height * 0.25;

    // Pillars
    for (let i = 0; i <= 4; i++) {
      const x = startX + (houseW * (i / 4));
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x, floorY);
      ctx.stroke();
    }

    // Floor beam
    ctx.beginPath();
    ctx.moveTo(startX - 20, floorY);
    ctx.lineTo(startX + houseW + 20, floorY);
    ctx.stroke();

    // Roof truss outline
    ctx.beginPath();
    ctx.moveTo(startX, floorY);
    ctx.lineTo(startX + 10, roofY + 40);
    ctx.lineTo(canvas.width * 0.5, roofY); // apex
    ctx.lineTo(startX + houseW - 10, roofY + 40);
    ctx.lineTo(startX + houseW, floorY);
    ctx.closePath();
    ctx.fillStyle = 'rgba(58, 42, 28, 0.4)';
    ctx.fill();
    ctx.stroke();

    // Fire glow center
    const fireGlow = ctx.createRadialGradient(
      canvas.width * 0.5, canvas.height * 0.5, 5,
      canvas.width * 0.5, canvas.height * 0.5, 80
    );
    fireGlow.addColorStop(0, 'rgba(204, 164, 59, 0.4)');
    fireGlow.addColorStop(1, 'rgba(204, 164, 59, 0)');
    ctx.fillStyle = fireGlow;
    ctx.beginPath();
    ctx.arc(canvas.width * 0.5, canvas.height * 0.5, 80, 0, Math.PI * 2);
    ctx.fill();
  }

  // Hotspot Click triggers
  hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', (e) => {
      const spotId = hotspot.getAttribute('data-target');
      const data = vrHotspotData[spotId];
      if (!data) return;

      placeholder.style.display = 'none';
      detailSidebar.style.display = 'block';

      // Load sidebar elements
      document.getElementById('vr-sidebar-img').src = data.img;
      document.getElementById('vr-sidebar-img').alt = data.title;
      document.getElementById('vr-sidebar-title').textContent = data.title;
      document.getElementById('vr-sidebar-desc').textContent = data.desc;

      // Handle speech synthesis click inside sidebar
      const speakBtn = document.getElementById('btn-vr-tts');
      const newSpeakBtn = speakBtn.cloneNode(true);
      speakBtn.parentNode.replaceChild(newSpeakBtn, speakBtn);

      newSpeakBtn.addEventListener('click', () => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          newSpeakBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Nghe thuyết minh';
          return;
        }
        const utterance = new SpeechSynthesisUtterance(data.desc);
        utterance.lang = 'vi-VN';
        utterance.rate = 0.95;
        utterance.onend = () => {
          newSpeakBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Nghe thuyết minh';
        };
        newSpeakBtn.innerHTML = '<i class="fa-solid fa-circle-stop"></i> Dừng nghe';
        window.speechSynthesis.speak(utterance);
      });

      // Play synthesized unique tone
      triggerGongSound(data.freq, 0.2);
    });
  });

  // Handle Tab Switcher VR/3D
  const btnTabVR = document.getElementById('btn-tab-vr');
  const btnTab3D = document.getElementById('btn-tab-3d');
  const paneTabVR = document.getElementById('pane-tab-vr');
  const paneTab3D = document.getElementById('pane-tab-3d');

  if (btnTabVR && btnTab3D && paneTabVR && paneTab3D) {
    btnTabVR.addEventListener('click', () => {
      btnTabVR.classList.add('active');
      btnTab3D.classList.remove('active');
      paneTabVR.classList.add('active');
      paneTab3D.classList.remove('active');
      resizeCanvas();
    });

    btnTab3D.addEventListener('click', () => {
      btnTab3D.classList.add('active');
      btnTabVR.classList.remove('active');
      paneTab3D.classList.add('active');
      paneTabVR.classList.remove('active');
      // Trigger default 3D model render
      renderActive3DModel('house');
    });
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
}


/* ==========================================================================
   7. INTERACTIVE 3D MODEL EXHIBITION INSPECTOR
   ========================================================================== */
const model3DData = {
  'house': {
    title: 'Nhà Sàn Mường',
    desc: 'Mô hình số hóa kiến trúc nhà sàn 3 gian 2 chái truyền thống. Thiết kế dốc dột thoát sương gió dâng đồi cao, cầu thang gỗ độc lập gắn gian đón khách bếp lửa đắp đất chính giữa đầm ấm.',
    structure: 'house'
  },
  'gong': {
    title: 'Cồng Chiêng Cổ',
    desc: 'Mô hình trống chiêng đồng thau đúc hoa văn mặt trời toả hào quang sừng sững tại núm chính tâm. Tiếng chiêng là báu vật trầm hùng dắt bùa cầu phúc thọ an khang.',
    structure: 'gong'
  },
  'pattern': {
    title: 'Thổ Cẩm Cạp Váy',
    desc: 'Mô phỏng trục dệt cạp váy thổ cẩm phụ nữ Mường. Đường thêu bọc tròn họa tiết phượng hoàng lửa thần lặp nhịp điệu rực rỡ tượng trưng linh hồn vũ trụ xưa.',
    structure: 'pattern'
  }
};

let current3DModel = 'house';
let rotationY = 0;
let rotationX = -10;
let isDragging3D = false;
let startX3D = 0;
let startY3D = 0;

function initModel3DInteraction() {
  const stage = document.getElementById('model-3d-stage');
  const visualizer = document.getElementById('model-3d-visualizer');

  if (!stage || !visualizer) return;

  // Handle model select buttons
  const modelBtns = document.querySelectorAll('[id^="btn-model-"]');
  modelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const modelKey = btn.getAttribute('data-model');
      current3DModel = modelKey;
      
      const visualizer = document.getElementById('model-3d-visualizer');
      if (modelKey === 'gong') {
        if (visualizer) visualizer.style.transform = 'none';
      } else {
        if (visualizer) visualizer.style.transform = `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;
      }
      
      const data = model3DData[modelKey];
      if (data) {
        document.getElementById('model-3d-title').textContent = data.title;
        document.getElementById('model-3d-desc').textContent = data.desc;
        renderActive3DModel(data.structure);
      }
      triggerGongSound(220, 0.05); // feedback chime
    });
  });

  // Drag-to-Rotate mouse/touch handlers
  stage.addEventListener('mousedown', (e) => {
    if (current3DModel === 'gong') return; // Skip custom drag for GLB model-viewer
    isDragging3D = true;
    stage.style.cursor = 'grabbing';
    startX3D = e.clientX;
    startY3D = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging3D || current3DModel === 'gong') return;
    const deltaX = e.clientX - startX3D;
    const deltaY = e.clientY - startY3D;
    startX3D = e.clientX;
    startY3D = e.clientY;

    rotationY += deltaX * 0.6;
    rotationX = Math.max(-45, Math.min(45, rotationX - deltaY * 0.6));
    visualizer.style.transform = `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;
  });

  window.addEventListener('mouseup', () => {
    isDragging3D = false;
    if (current3DModel !== 'gong') {
      stage.style.cursor = 'grab';
    }
  });

  // Mobile Touch support
  stage.addEventListener('touchstart', (e) => {
    if (current3DModel === 'gong') return; // Skip custom touch for GLB model-viewer
    if (e.touches.length === 1) {
      isDragging3D = true;
      startX3D = e.touches[0].clientX;
      startY3D = e.touches[0].clientY;
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging3D || e.touches.length !== 1 || current3DModel === 'gong') return;
    const deltaX = e.touches[0].clientX - startX3D;
    const deltaY = e.touches[0].clientY - startY3D;
    startX3D = e.touches[0].clientX;
    startY3D = e.touches[0].clientY;

    rotationY += deltaX * 0.6;
    rotationX = Math.max(-45, Math.min(45, rotationX - deltaY * 0.6));
    visualizer.style.transform = `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;
  });

  window.addEventListener('touchend', () => {
    isDragging3D = false;
  });
}

function renderActive3DModel(type) {
  const container = document.getElementById('visualizer-object-container');
  if (!container) return;
  container.innerHTML = '';

  if (type === 'gong') {
    // Render the real 3D GLB Gong model using <model-viewer>
    container.innerHTML = `
      <model-viewer 
        src="3d%20glb/round%20metal%20doorknob%203d%20model.glb" 
        camera-controls 
        auto-rotate 
        shadow-intensity="1.5" 
        exposure="1.2"
        style="width: 100%; height: 100%; min-height: 350px; background: transparent;"
        alt="Mô hình 3D Cồng Chiêng Cổ">
      </model-viewer>
    `;
    const stage = document.getElementById('model-3d-stage');
    if (stage) {
      stage.style.cursor = 'default';
    }
    return;
  }

  const obj = document.createElement('div');
  obj.className = 'threed-object';
  
  if (type === 'house') {
    // Generate simulated 3D house columns and roof faces using CSS 3D
    obj.innerHTML = `
      <!-- House base box -->
      <div class="threed-face" style="width:120px; height:60px; transform: rotateX(90deg) translateZ(30px); border-color:#c49a2a;">SÀN</div>
      <div class="threed-face" style="width:120px; height:50px; transform: translateZ(30px); border-color:#7c1f1a;">TRƯỚC</div>
      <div class="threed-face" style="width:120px; height:50px; transform: rotateY(180deg) translateZ(30px); border-color:#7c1f1a;">SAU</div>
      <div class="threed-face" style="width:60px; height:50px; transform: rotateY(90deg) translateZ(60px); border-color:#4a3520;">TRÁI</div>
      <div class="threed-face" style="width:60px; height:50px; transform: rotateY(-90deg) translateZ(60px); border-color:#4a3520;">PHẢI</div>
      <!-- Roof faces -->
      <div class="threed-face" style="width:120px; height:45px; transform: translateY(-30deg) rotateX(45deg) translateZ(30px); background:rgba(196,154,42,0.15);">MÁI TRƯỚC</div>
      <div class="threed-face" style="width:120px; height:45px; transform: translateY(-30deg) rotateX(-45deg) translateZ(-30px); background:rgba(196,154,42,0.15);">MÁI SAU</div>
    `;
  } else if (type === 'pattern') {
    // Render rotating polygon representing fabric cylinder
    obj.innerHTML = `
      <div class="threed-face" style="width:80px; height:110px; transform: translateZ(40px); background:rgba(107,31,26,0.2); font-size:0.6rem; text-align:center;">🌀 HOA VĂN</div>
      <div class="threed-face" style="width:80px; height:110px; transform: rotateY(90deg) translateZ(40px); background:rgba(107,31,26,0.2); font-size:0.6rem; text-align:center;">PHƯỢNG</div>
      <div class="threed-face" style="width:80px; height:110px; transform: rotateY(180deg) translateZ(40px); background:rgba(107,31,26,0.2); font-size:0.6rem; text-align:center;">LỬA</div>
      <div class="threed-face" style="width:80px; height:110px; transform: rotateY(-90deg) translateZ(40px); background:rgba(107,31,26,0.2); font-size:0.6rem; text-align:center;">RÙA THẦN</div>
    `;
  }

  container.appendChild(obj);
}


/* ==========================================================================
   8. HEADER SEARCH & FILTER CHAPTERS LOGIC
   ========================================================================== */
function initSearchLogic() {
  const searchInput = document.getElementById('header-search-input');
  const searchTriggerBtn = document.getElementById('search-trigger-btn');
  const searchAlertBox = document.getElementById('search-alert-box');
  const searchAlertText = document.getElementById('search-alert-text');
  const clearSearchBtn = document.getElementById('clear-search-btn');

  if (!searchInput) return;

  function triggerSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      clearSearch();
      return;
    }

    // Filter epic chapters
    const matchingTales = epicData.filter(tale => {
      return tale.name.toLowerCase().includes(query) ||
             tale.kinh.toLowerCase().includes(query) ||
             tale.muong.toLowerCase().includes(query) ||
             tale.context.toLowerCase().includes(query);
    });

    const matchingIds = matchingTales.map(t => t.id);

    // Redirect to sử thi section
    window.location.hash = '#su-thi';
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    document.getElementById('su-thi').classList.add('active');
    
    // Sync active nav item
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#su-thi') {
        link.classList.add('active');
      }
    });

    // Populate search alerts
    if (searchAlertBox && searchAlertText) {
      searchAlertBox.style.display = 'block';
      searchAlertText.textContent = `Tìm thấy ${matchingTales.length} phần sử thi chứa từ khóa "${searchInput.value}".`;
    }

    // Re-render list with filtered elements
    renderTalesList('all', matchingIds);

    // Hide timeline progress track during search to avoid confusion
    const track = document.getElementById('timeline-track');
    if (track) track.style.opacity = '0.3';

    // Show details of the first match if available
    if (matchingIds.length > 0) {
      showTaleDetails(matchingIds[0]);
    }
  }

  function clearSearch() {
    searchInput.value = '';
    if (searchAlertBox) searchAlertBox.style.display = 'none';
    
    const track = document.getElementById('timeline-track');
    if (track) track.style.opacity = '1';

    // Reset timelines to normal
    renderTalesList('all');
    showTaleDetails(1);
    updateTimelineProgress();
  }

  // Handle enter key in input
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      triggerSearch();
    }
  });

  if (searchTriggerBtn) {
    searchTriggerBtn.addEventListener('click', triggerSearch);
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', clearSearch);
  }
}
