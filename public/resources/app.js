/**
 * Sử Thi Tân Diện Landing Page - Interactive Application Logic
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
  initTransparentImages();
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
    } catch (e) { }
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
  { id: 1, name: "Mở đầu", epoch: 1, kinh: `I. MỞ ĐẦU
Nói một chuyện đời xưa
Trên đồi, ta nói với con bướm bạc
Dưới nước, ta nói với con chạng kha ('
Trên trời, ta nói với sông Ngân Hà
Trong cửa trong nhà
Người già truyền cho con cháu
Ngày xưa, ngày ấy
Dưới đất, chưa có đất
Trên trời chưa có trời
Trên trời chưa có ngôi sao đỏ đỏ
Dưới đất chưa có ngọn cỏ xanh xanh
Đất còn rời rạc
Nước còn bùng nhùng
Ngó lên, trông xuống mịt mùng
Con người ngày đó
Chưa nên chưa có
Thứ gì cũng chưa có chưa nên
Gió ẩm ẩm chưa qua
Rừng cây chưa có lá
Trên đất chưa có con bướm bạc
Mặt đất chưa có con chạng kha
Trong cửa trong nhà
Chưa có ông già chuyền đi nối lại`, muong: `I. CẤN DẤN


Vé mộch chiiến tới hơ, 
Trêng tốn chiến cho con pườm pạc, 
Tìn rác chiến cho mài cháng kha.
Trêng trới ha vé ôống khôông Ngân Há, 
Tlong cửa, tlong nhá
Ôông rá chiiến cho xôn con.
Năm hơ, ngáy rì,
Tìn tẩt chưa cò tất
Tlêng tlới chưa cò tiới
Tiêng trời chưa cò con khao tỏ tỏ, 
Tìn tất chưa cò ngọn cỏ xeng xeng.
Tẩt cón pạc lạc
Rảc cón puổng luống.
Hấu lêng, ngò xuông cón măng tín vín.
Con móol ngáy rì
Chưa rêng chưa cò
Thứ chi í chưa cò, chưa rêng.
Xò ấm ấm chưa qua
Rứng khăng khưa chưa lôộc là, 
Tiêng tất chưa cò con ườn - Pạc, 
Tlốc rảc chưa cò con Cháng - Kha Tlong cửa, tlong nhá
Chưa cò ôông rá chiến ti, nồn lái.`, context: "Chương mở đầu diễn tả cội nguồn vũ trụ thuở hỗn mang, nước ngập mênh mông, đất chưa thành hình. Thầy Mo khấn mời linh hồn thần tiên tổ và thần linh đồi suối chứng kiến lễ cúng cầu an bản mường." },
  { id: 2, name: "Đẻ Đất", epoch: 1, kinh: `II. ĐẺ ĐẤT
Muốn ăn cơm phải tìm giống gieo mạ
Muốn ăn cá phải tát suối tát ao
Muốn biết vì sao có đất đỏ đất nâu
Phải bảo nhau ngồi nghe truyện kể
Ngày xưa ngày ấy
Trông trời, trời bao la rộng rãi
Trông đất, đất vắng vẻ trống không
Đồn rằng
Có một năm mưa dầm mưa dãi
Nước vượt khỏi đồi U
Nước dâng tràn đổi Bái
Năm mươi ngày nước rút
Báy mươi ngày nước xuôi
Mọc lên một cây xanh xanh
Có chín mươi cành
Cành chọc lên trời, lá xanh biết cựa
Thân trên mặt đất, thân cây biết rung
Trong tán trong cành có tiếng đàn bà con gái
Cành chọc trời là con đầu
Tên gọi ông Thu Tha
Cành bung xung là con thứ hai
Tên gọi bà Thu Thiên
Hai ông bà nên đôi nên lứa
Truyền cho
Con gà có cựa
Dây dưa biết leo
Tre pheo có gai có ngọn
Con người biết nói
Khi đó dưới đất không còn rời rạc
Dưới nước không còn bùng nhùng
Trời không mông lung
Trông lên ngó xuống đã có nơi có chốn
Đã có
Lối đi xuống
Đường đi lên
Luồng muốn dậy, đã có ngãnh
Cau muốn dậy đã có mo ne
Dây củ mài muốn dậy leo vắt vẻo
Đã được leo vắt vẻo
Dây sắn muốn dậy néo buộc
Đã có nơi néo buộc
Con thác muốn dậy đã có con sao
Con sao muốn dậy đã có trời sáng
Con nhà con người muốn dậy, đã có em, có anh
Đạo làm vua không tranh
Đạo làm người không cướp
Vua đã yêu, chúa đã chuộng
Đã có người vụng người tài
Đã có người trai người gái
Đồi bãi đã có thú to
Rừng thưa đã có chim nhỏ
Dưới nước
Đã đẻ con cá, con tôm
Đầu hôm đã sinh con rùa
Tối ngày đã sinh con rái
Dưới đất
Cái gì cũng có
Gió ầm ầm đã nghe
Mưa le re đã thấy
Thứ nào muốn dậy đều nên thân nên hình
Đất đã có
Đất rộng thênh thanh
Chuyện chưa kể nên một gang
Chuyện chưa kể sang một lẽ
Người già người trẻ
Lại nghe chuyện đến, chuyện đi
Lại nghe chuyện xưa, chuyện cũ
Người ở sướng, ăn ngon
Cũng có đứa khôn, thăng dại
Người khôn nghe kể lại
Thắng dại nghe vội nghe vàng
Phải chờ nghe thêm
Chuyện đẻ nước`, muong: `II. TEỂ TẤT


Mònh ăn cơm phải xím nói, pắc má.
Mònh ăn cà phải trổ hòn, xảch ao.
Mònh mắt xí nó mà cỏ tất toỏ, tẩt nu 
Xì pảo phố ngối tlằng vô, tlằng chiiến.
Năm hơ, ngáy mửa
Tlông tlới, thới rêng pặc lặc, 
Ngò rác, rảc cón rêng pứa lứa.
Tốn vé:
Cò mộch năm mưa dú mưa dí
Rác ngượch ngượch tốn U


Rác tành chu tốn Pài,
Răm mươi ngáy rác thải
Pảy mươi ngáy rác mời tha
Moọc lêng mộch cân xeng ta
Cò chìn mươi céng
Céng choọc lêng tlới, là xeng, hay chứa
Poỏc mếng tlêng mặt tất mắt rung.
Tlong céng pung xung cò xiềng tán mú, con cài
Céng choọc tlới là con cả
Rố vé ôông Thu Tha,
Céng bả xả là con thừ han
Xên là pá Thu Thiên,
Han ôông, pá rêng tôi cày tùa.
Chiiến cho
Con kha cò tẩy
Rái củn mải leo
Cân pheo cò khoóng, cò ngón
Con moól xì mắt khể.


Lúc rì, tìn tất chăng cón pạc lạc
Lin rác, chăng cón puổng luống
Tlới chẳng cón puông luông
Tlông lêng, ngò xuồng tà cò nơi, cò chốn.
Tà cò khoòng ti xuồng
Tà cò mường ti lêng,
Luống mònh dấn tà cò ngễnh,
Nang mònh vèng tà cò mo ne,
Củ mònh dấn leo vắt leo vơ
Tà àn leo vắt leo vớ
Rái khành mònh dấn nèo vó
Tà cò púng mà nèo vó.
Rái phoó, con thác mònh dấn tà cò con khao,
Con khao mònh dấn, tà cò tlới làng
Con moói, con ngái mònh dấn tà cò ùn, cò eng.
Mấn vua chăng cheng,
Mến eng chăng cướp,
Vua tà yêu, chùa tà chuống
Tà cò moói pổông, moól tái
Tà cò ôông vảo, con mài


Tốn pài tà cò moong u
Khăng khưa tà cò chim nhó,
Tìn rác tà teẻ con cà, con xôm,
Trốc hôm tà teẻ con ró
Tủa ngáy tà teẻ con xài,
Tìn tất, cày chi í cò,
Xò rò ró tà măng
Mưa xăng văng tà kỉa
Xừ nó mònh dấn rêng xân, rêng mếng
Tà cò tất
Tất rêng pểnh lêng.
Chiiến chưa poọc rêng cang
Chiiến chưa giảng rêng lè.
Cồ rá, con rết
Lày trằng chiiến têng chiiến ti
Lày trằng chiiến hơ, chiiến cù.
Khá ở khung ăn khường
Í cò từa luồng, lấu rố,
Từa khôn trằng tếu lái,
Từa rái măng tếu pươi ươi
Phải trằng xa ơi cày chiiến teẻ rác.`, context: "Khắc họa sự kiến tạo lục địa và đất đai vững chãi. Từ lớp bùn lầy nứt nẻ trồi lên những sườn núi hiểm trở cheo leo, làm chỗ đứng cho vạn vật đầu tiên." },
  { id: 3, name: "Đẻ Nước", epoch: 1, kinh: `III. ĐẺ NƯỚC
Con gà gáy trên đèo xao xác
Con ác kêu trên núi oang oang
Mặt trời lên sáng rừng sáng bãi
Sáng cả chín đất, mười phương
Làm mùa không ra cơm
Lưới chài không ra cá
Nóng quá
Đất xác xơ
Đất cằn cõi hanh khô
Dây sắn úa hết lá
Cây cau úa hêt tàu
Rừng vàu không mọc măng
Con chim mò xuống đất
Con thú mò xuống nước
Chó thè lưỡi
Rái cá chạy lên đôi
Hạn chín tháng trời
Nắng mười hai năm xác đất
Cạn suối, vỡ mai ba ba
Khô đổi, gãy sừng hươu
Nắng nhiều, cây hết lá
Nắng cả, đất hết cỏ
Trâu ăn đất cóng
Người uống nước sương
Gà rừng kiếm nước ở mắt lóng bương
Ông Pồng Pêu (thần nước)
Ngồi đan lưới đan chài ở cửa sổ
Trông ra ngoài ngõ
Trông lên trên trời
Ông Pồng Pêu ao ước
- Ước ơ là ước
Ước sao được một trận mưa
Mưa dầm dề chín đêm mười bữa sáng
Mưa rào rào chín buổi sáng mười đêm
Mưa ở giữa đồng
Mưa vòng ra bờ suôi
Mưa xói núi
Mưa mòn gò
Mưa từ chân trời này
Mưa sang chân trời nọ
Mưa mưa, gió gió
Gió gió, mưa mưa
Mưa ngập ruộng sâu ruộng cạn
Mưa tràn bờ suối, gò cao
Đồn rằng khi đó
Trời kéo mây ùn ùn
Trời đùn mây kìn kìn
Gió ầm ầm bốn bên
Mây ùn lên từng đống
Mây kéo chồng từng mảng
Mây mưa, mây gió
Mây đen mây vàng
Nghe cơn gió vừ vù
Nghe ừ ù cơn mưa
Tiếngthnsm xung thét
Nữ thần Sét xuống gào
Đầu đem mưa to bằng hột cà
Sáng ra mưa to bằng quả bưởi
Mưa dù mưa dịn
Mưa chín đêm
Mưa liền chín ngày
Mưa bẻ cành, gấy lá
Mưa rước nàng Ngâu về trời
Mưa đưa chàng Ngâu qua sông Ngân
Mưa rửa sừng đàn hai
Mưa sạch lông chim phượng
Hôm đầu mưa ngập bụi
Hôm sau mưa ngập cây
Bốn tháng nước rút
Bảy tháng nước xuôi
Nước chín đồi đổ về một biển
Nước mười đồi đổ về một sông
Nước làm khó làm dễ
Xới đất đen lên bằng miệng ang
Xới đất vàng lên bằng miệng thúng
Trôi đàn cua đá
Trôi đàn cá trong hang
Trôi đàn ba ba đi thăm suối
Trôi đàn cá chuối đi thăm vực
Trôi đàn nòng nọc đi thăm đầm
Trôi đàn cá com đi ra bể rộng
Nước rút, nước xuôi
Nước dậy, nước đi
Có đất, đất đang xơ xác
Có nước, nước còn đục ngầu
Người khôn nghe kể lại
Thăng dại nghe vội nghe vàng
Phải chờ nghe thêm - Đẻ Cây Si`, muong: `III. TEẺ RÁC


Con kha cắn tiêng téo xao xảc
Con ác kêu tiêng tốn oang oang
Mặt tlới lêng tràng tứng, tràng pài
Tlàng cày tủa chìn tất, mưới phương
Mẫn mủa chăng rêng ăn
Quang chán chăng xa cà.
Rắng quà, tất xạc rạc
Tất xờ rờ xớ rơ
Là cún khành tơ vơ
Tlày nang ùa xàng ràng
Văng váu chăng mọc ăn,
Chim cán tlớc tất
Moong pật tlỏc rác
Chò lẻn lài vạc
Xài vảo tlỏc càng tốn


Hán chìn khàng tăm xăm,
Rằng mưới hai năm tập xập,
Hòn cán, pể cộp ton tải.
Khò tốn tlải khứng cày moong rai, moong hiêu,
Rắng chiêu xiêu cân, xườm là
Rằng cả cà, tất cổ cần,
Tlu ăn tất coòng,
Moól còng rác khúng, rác khương.
Kha cỏ còng rác môộc pương, môộc lào.
Lúc rì, ôông Pồng - Pêu ngối tan chán voòng cài
Dóm xa, ngò lái
Ngoài lêng àng tlới.
Ôông Pồng - Pêu ao ơ lày ước:


- "Ước nó ăn mộch khổ mưa
Mưa dú, mưa dín, mưa chìn têm, mưới ngáy.
Mưa xáy xáy chìn tlàng, mướn têm
Mưa pửa khừa tôống
Mưa voóng xa nầm hòn,
Mưa xòn tơn
Mưa xòn có
Mưa pở chân tới ní
Mưa rí rí phanh chân tlới noó.
Mưa mưa, xò xò
Xò xò, mưa mưa
Mưa ngập tlưa khu, ná caán
Mưa tán nầm hòn, có cao.


Tốn vé khi rì
Tlới kèo mân tún tún
Mân tún lêng ì i
Xò pề pế pồn pên
Mân tún lêng toồng toống
Mân kèo xuống mảng mảng
Mân mưa, mân xò
Mân tló, mân váng
Măng cơn xò ráng ráng,
Măng tàng ráng cơn mưa,
Xiếng xấn Khẩm hét xuống


Nữ tường Phét xuống hoòng,
Tlốc hôm, oóc mưa cớ tlày cá
Tlàng xa, mưa náy păng tlày pưới.
Mưa dú mưa dưởi
Mưa chìn têm
Mưa liên chìn ngáy
Mưa tếch khái, trải là,
Mưa rốc pá Ngâu vén tlới
Mưa tưa ông Ngâu phang khôông Ngân
Mưa xửa khứng rai
Mưa tlôi lông chim cả,
Ngáy mửa, mưa ngập pún pún
Ngáy khau, mưa chun cày cân cân.


Pồn khang, rác mời thảy
Pảy khang, rác mời tha,
Rác chìn tốn tỏ vền mộch pế
Rác mưới khể chôn vền mộch khôông,
Rác mưới khò, mân khan
Xời tất dâm lêng cớ méng ang
Xời tất váng lêng cơ mếng thùng.
Tlôi tán cua phuú
Tlôi lù cà tloong hang,
Tlôi tán tải tìn hòn
Tlôi tán cà pôồng vực
Tlôi ôn ôn tìn tấm
Tlôi cà loong boong ti xa pể pớng.
Rác rút, rác xuôi
Rác dấn, rác ti
Cò tất, tất cón xạc rạc
Cỏ rả, rác còn ngầu rầu
Moól khôn măng mònh kẻ lái
Lấu rái tlằng vối, tlằng váng
Phải tới tlằng xêm cày chiiến:
Teẻ cân khi.`, context: "Nước nguồn sinh ra rửa sạch khô hạn đồi núi, lấp đầy thung lũng sâu tạo thành suối mát sông dài, cung cấp nhựa sống tươi mới dạt dào cho đất mọc cỏ cây." },
  { id: 4, name: "Đẻ Cây Si", epoch: 1, kinh: `IV. ĐẺ CÂY SI
Đất trũng ngấm nước, đất đã tơi
Đất đổi ngấm nước, đất đã bở
Cây Si mọc lên rờ rỡ
Cây Si lớn lên nhanh nhanh
Đầu hôm, Si băng thân chày
Sáng ngày, Si bằng cây lim
Cây Si mọc bốn cành chìm
Cây Si mọc ba mươi cành nổi
Có một cành chót vót
Coa một lá chon von
Vút thắng, vút lên
Cha con trời thấy lạ
Đang ngồi bên cửa sổ
Uống rượu khể khà
Trông xuống gầm nhà
Thây Si mọc lên lô lộ
Thấy Si mọc lên xum xuê
Che kín một bên đất
Che kín một bên trời
Trần gian phơi lúa không khô
Phơi rau không ráo
Gai mắt, trời muốn phá
Gai mắt, sét muốn phang
Nhưng sợ hư ruộng mạ
Hỏng ruộng khoai
Trần gian chết đói
Bố con trời cạp thép vào miệng sâu Gang
Cạp vàng vào miệng sâu Hốc
Sai sâu Hốc xuống ăn hết da
Sai sâu Gang xuống đục hết lõi.
Từ đó
Sâu Hốc xuống ăn da
Sâu Gang xuống ăn ruột
Cắn gốc móc lòng cây Si
Cây Si héo rữ
Cây Si úa vàng
Cây Si đã mục
Gốc Si đã đổ
Cành Si ngã lấp đầy thung lũng
Đầu Si gẫy vật lên đồi Chu ")
Chuyện đó đã rồi
Hồi đó đã xong
Lại nghe chuyện cây Si long gốc
Lại nghe chuyện cây Si mục cành,
Đẻ ra mường, ra nước`, muong: `IV. TEẺ CÂN KHI


Tẩt lùng rảc ngầm, tẩt tà tơi
Tất tốn ngập rác, tất tà lở,
Cần khi mọc lêng rờ rờ
Cần khi náy lêng túng xúng,
Tlộc hôm, cần khi náy pắng cần kháy,
Tláng ngáy, khi dẫn păng cần lim
Cần khi mọc pồn đéng tím
Cần khi mọc pa mươi đéng rôi.
Cò mộch đéng chọt pọt
Cò mộch là vòn von
Pọt thắng phon lon
Pố con nhá vua Tlới kìa laá
Tang ngôi pang voòng cài
Tang còng ráo quân lài,
Mời ngoốc xuống ưỡng nhá
Kia cần khi dúm dá
Cốc khi mọc xa dum duê,
Chee kin mộch pên tất
Lấp kìn mộch pang tlới.
Chu chương tải loó chăng khanh
Tải ngánh chăng xào
Cau mặt, tlới mònh thào
Tlào mặt, Phét mònh pheng
Rỏ mơi rưởi hư trưa má
Rưởi rà roóng khoai
Cày món dương gian chết tòi.
Pổ, con Tlới liền cạp thép pao méng rôi gang
Cạp váng pao méng rôi hôốc
Khai rôi hôốc xuống ăn hết ta
Khai rôi há xuống tục hết lòi
Pở rì
Con rôi hôốc tà xuống ăn ta.
Con rôi há tà xuống ăn troong,
Cành côốc voc loóng cần Khi.
Cần khi héo táng xáng
Cần khi váng tờ rờ
Rèe cần khi tà mục
Côốc cần khi tà lở
Đéng khi pổ tấy thung
Ngoón cần khi pổ vật lêng, tlày tốn Chu.


Chiiến ní tà ru
Hối chu khi tà rối.
Lày tlăng chiiến tới cân khi loong côốc
Lày doọc chiiến cân khi mục đéng
Teẻ xa mướng, rác.`, context: "Cây Si thần mọc lên từ thuở ban sơ. Nó vươn cành khổng lồ nối liền âm dương đất trời, là tổ ấm che chở thần linh và chim muông huyền thoại sinh sống." },
  { id: 5, name: "Đẻ Mường", epoch: 1, kinh: `V. ĐẺ MƯỜNG
Cây Si chết ra điềm hay điểm gở
Trong năm đó
Thân Si mục
Hóá thành rắn nhiều đầu
Đuôi rắn ở rốn núi
Đầu rắn ở đổi Chu
Chạm phải rằn, rằn cắn, rắn thù
Rắn cắn chảy máu đen
Máu đen thành con vắt
Mắt Si lồi hóá thành con ong
Ong bạc đầu, nọc dài chín gang
Lưng ong dài chín sải
Gặp hổ nai, ong lùng ong đuổi
Lá Si nát hoá ra thú ra muông
Thú dữ như hổ lang
Muông hiền như chồn cáo
Gốc Si đổ ầm ầm
Rế Si đổ ình ình
Đổ một nghìn chín trăm mười chín cành
Một cành đổ thành đất Sạp


Nên mường Sạp ('
Một cành đổ thành đất Giạp
Nên mường Giạp (2)
Một cành đổ thành đất Bi, đất Lỗ
Nên mường Bi (3), mường Lỗ (4)
Một cành đổ thành đất Ống, đất Sà
Nên mường Ống (5)
, mường Sà (6)
Một cành đổ thành đất Vong
Nên mường Vong?
Một cành ngã về đất Khoòng, đất Dẹ (3)
Một cành đổ về đất Cò Ké, Tiên Lãng (9)
Một cành đổ về đất Băng, đất Bịn (10)
Một cành đổ về đất Lập, đất Yến (''
Một cành đổ về đất Khi, đất Dồ (12)
Một cành đổ về đất Én, đất Khô (13)
Một cành đổ về đất Ai, đất Khạt (14)
Một cành đổ về đất Hát, đất Trào (15)
Một cành đổ về đất Mo, đất Bói (16)
Một cành ngã về đất Khói (17)
Một cành ngã về đất Kim (18)
Một cành ngã về đất Nang (19)
Một cành ngã sang đất Mèn, đất Chẹ (20)
Một cành ngã về đất Vẩm
Một cành đâm sang đất Lụt, đất Lở
Một cành ngã về đất Vống
Một cành ngã sang đất Sàng, đất Tông
Một cành ngã về đất Bằng, đất Ún
Một cành ngã về đất Khao
_____________
(1) Nay thuộc Hòa Bình.
(2) Nay thuộc Hòa Bình.
(3) Nay thuộc Hòa Bình.
(4) Nay thuộc Hòa Bình.
(5) Nay thuộc Thanh Hóá.
(6) Nay thuộc Thanh Hóá.
(7): Nay thuộc Thanh Hoá
(8) (9) (10) (11) (12) (13) (14): Nay thuộc Thanh Hoá.
(15) Nay thuộc Hòa Bình.
(16) (17) (18) (19) (20): Nay thuộc Thanh Hóá.


Một cành ngã về đất Ao
Một cành ngã sang đất Cợi
Một cành ngã về đất Vịn
Một cành ngã về đất Ấm
Một cành ngã sang đất Dủ, đất O
Một cành ngã về đất Già
Một cành ngã sang đất Rặc
Một cành ngã về Hao Hao
Một cành ngã vào đất Én
Một cành ngã lên đất Ngón
Một cành vòng lên Lau, lên Khụ
Một cành rủ về đết Khói, đất Nen
Một cành trở lên Vin Vơng
Một cành sang mường Vang, mường Vó
Một cành sang mường Tráng, mường Tre
Một cành về đất Vành
Một cành về mường Chín
Một cành về mường Rồng
Một cành nên mường Khô, Man, Cốc, Piếng
Riêng cành chót thì nên mường Mê, mường Man '''
Còn một cành xanh non
Vẫn trơ trơ, sừng sững
Đòi về đất Sấm, đất Sét, đất ông Nhà Trời
Đất đã có
Đất chẳng còn nên xơ xác
Nước đã có
Nước chẳng còn tiêu điều
Trời đã có
Trời không còn mông lung
Có đất, có nước, có mường
Nhưng loài người chưa có
Nghe chuyện cho tỏ
Nghe chuyện cho tường
Nghe chuyện đẻ Người
Đoạn sau sẽ kể`, muong: `V. TEẺ MƯỚNG


Cân khi chết piển xa tếu kên, tếu cổ
Toong năm rì
Cââm cân khi tà mục
Tôốc xa con xành lí kí lái cái
Xành nhếu xai, nhếu tlốc
Tuôi tìn rôộc, tốc tlêng tốn Chu.
Tầm phải, xành ré cành, ré chú,
Xành cành chảy cày màu dấm dấm
Màu dấm tôốc xa tuông con pắt.
Mặt cân khi lõ piền xa tuông con oong
Oong pạc tlốc, trè dán chìn cang
Lưng oong dán chìn phải
Tốn húm, rai oong ruột.
Là khi mục piên rêng tuông moong.
Moong héo nhơ húm lang
Moong léng nhơ chỏn pón
Câấm cân khi tlổc ấm ấm,
Rè khi tâm xâm chình ình
Pổ mộch nghìn mộch trăm mưới chin đéng
Mộch đéng pổ thánh tất mướng Sạp,
Rêng mướng Sạp,
Mộch đéng pổ rêng tẩt Giạp
An mướng Giạp
Mộch đéng pổ rêng tẩt Pi, tẩt Lổ
Rêng mướng Pì, mướng Lổ
Mộch đéng pổ xa tất Ông, tẩt Sá
Rêng mướng Ống, mướng Sá


Mộch đéng pổ vến tẩt Voong
Rêng mướng Voong,
Mộch đéng pổ vến tẩt Khoóng, tất Teé
Rêng mướng Khoóng, mướng Teé,
Mộch đéng pổ vến tẩt Có Ké, Tiên Lăng
Rêng mướng Có Ké, Tiên Lăng,
Mộch đéng pổ vến tất Băng, tất Bín
Mộch đéng pổ vến tất Lập, tất Kền
Mộch đéng pổ vến tất Khi, tất Dố
Mộch đéng pổ vến tẩt Èm, tẩt Khô
Mộch đéng pổ vến tẩt Ai, tẩt Khạt,
Mộch đéng pổ vến tẩt Hảt, tất Tláo
Mộch đéng pổ vến tất Mo, tất Pòn
Mộch đéng dòn vến tẩt Khói
Mộch đéng vòi vến tất Kim
Mộch đéng pin vến tất Nang
Mộch đéng pổ phang tẩt Mén, tẩt Ché
Mộch đéng trẻ vến tất Vẩm
Mộch đén tâm phang tất Lụt, tất Lở,
Mộch đéng pổ vến tẩt Vôồng
Mộch đéng pổ tềng tất Sáng tất Tôông.
Mộch đéng vật vến tất Pắng, tẩt Ún
Mộch đéng vùn vến tất Khao
Mộch đéng vật vến tất Ao
Mộch đéng nghêng pao tẩt Cới
Mộch đéng pổ vến tất Vín
Mộch đéng pín xa tất Ấm
Mộch đéng xầm xa tẩt Ô, tất Đủ,
Mộch đéng củ phang tất Giá
Mộch đéng pổ xa tất Rặc,
Mộch đéng lặc vến Hao Hao
Mộch đéng pổ pao tất Ên
Mộch đéng pèn rêng tất Ngoón
Mộch đéng vòn rêng tất Lau, tất Khuú
Mộch đéng xủ vến tất Khòi, tất Nen
Mộch đéng chen vến Vin Vỏng
Mộch đéng pơng sang mướng Vang, mướng Voò
Mộch đéng loò rêng mướng Tlàng, mướng Tle
Mộch đéng que xa tất Vóng
Mộch đéng trành xa mướng Chìn,
Mộch đéng piền xa tẩt mướng Rôống.
Mộch đéng xa rêng mướng Kho, Man, Côoc, Piềng
Riêng đéng vỏt xì rêng mướng Mê, mướng Man
Cón mộch đéng xoong phoong
Đéng chon von, chập vập
Tói vến tẩt Khẩm, Phét, nhá ôông vua Tlới,
Tất tà cò
Tất chắng cón rêng pặc lặc
Rác tà cò
Rảc chẳng cón rêng pứa lứa
Tlới tà cò
Tlới chắng cón rêng puổng luống
Tà cò tẩt, cò rác, cò mướng
Rỏ mơi nói Moól chưa cò
Tlằng chiiến phải tủa
Vở chiiến phải tướng
Rêng tlằng lế chiiến teẻ Moól
Rằng khau lày nòi:`, context: "Thiết lập vùng đất định cư sơ khởi cho đồng bào. Chia núi chia sông thành bốn phương Mường rạch ròi, ngăn nắp làm tiền đề dựng bản làng ấm cúng." },
  { id: 6, name: "Đẻ Người", epoch: 1, kinh: `VI. ĐẺ NGƯỜI
Cây Si mục
Cành loà xoà hoá ra chân tay mụ Dạ Dần (')
Cành lù xù hóá ra đầu mụ Dạ Dần
Cành thia lía hoá ra tai, ra mắt mụ Dạ Dần
Cành sừng sững hoá ra ngực, ra lưng mụ Dạ Dần
Mụ Dạ Dần
Miệng hay đòi ăn cá
Dạ hay đòi ăn cơm
Miệng nói lời dạy bảo
Dạ nghĩ điều khôn ngoan
Mụ ở dưới đất nên thấp
Muốn cất lên trời cao cao
Mụ ăn, mụ đẻ
Mụ đẻ ra hai trứng
Một trứng nở ra Cun (2) Bướm Bạc
Một trứng nở ra Cun Bướm Bờ
Cun Bướm Bạc vừa nở
Đã ăn chín chõ cơm (3)
Người lớn bằng cái thúng (4)
Cun Bướm Bờ mới sinh
Đã ăn hết năm chõ xôi
Người lớn bằng cái nia (s)
Năm qua tháng qua
Hai anh em cao hơn đụn chín, đụn mười (6)
Tiếng cười như tiếng trống cái
Tiếng nói như tiếng sấm vang
Xương vai dài tám mươi lóng
Xương sống dài bảy trăm gang
Có tướng làm Đạo, làm Cun, làm Lang
Một năm vua trời cho con gái xuống chơi qua
Ba năm vua trời cho con gái xuống thăm lại
Con gái trời gọi là tiên
Tiên xuống trần đi chơi bông chơi hoa
Một sáng tiên xuống cành mây mưa
Một trưa tiên xuống cành mây gió
Tiên bay xuống tắm
Tắm bờ sông Tằm sông Tè
Á tiên đi ra đường rộng
À tiên đi xuống đường quang
Thấy cun Bướm Bạc
Thấy chàng Bướm Bờ
Chàng cưỡi ngựa vàng
Thấy chàng Bướm Bạc
Thấy cun Bướm Bờ
Cun cưỡi ngựa trắng
Nàng ả, nàng hai muốn hỏi thăm đường
Còn nghe nể con trai
Liên tránh lại một mé
Né sang một bên
Cho ngựa ngài đi tới
Hai cun đi hẳn
Gặp được bà nàng () con mái
Thấy người lạ muốn hỏi
Thấy người đẹp muốn ướm lời
Răng:
- "Người ở đất mường nào?
Mà đẹp dáng, đẹp người, lưng ong, tóc mượt".
Cun em giật cương cho ngựa dừng lại
Cun anh kéo cương cho ngựa dừng đi
Cùng mở lời chào:
- "Các nàng ở đất mường nào?
Mà qua rừng nhà tôi một sớm
Cho đất mường tôi tốt thêm lộc nuôi tằm
Mà các nàng đến thăm
Cho rừng dâu nhà tôi xanh kín lá
Cho suối lắm cá nhiều tôm
Cho con sao hôm về chậm
Cho con sao mai đến nhanh
Cho con chim nhảy nhót hót trên cành
Hót lời thương lời nhớ.
Chị em nghe lời đó
Cùng dục nàng ả nàng hai:
- "Hai chàng thưa chào
Chào ta như sao thức sao
Ta mất lòng nào mà chưa lên tiếng
Ra mà thăm mà nhìn
Ra mà chào mà thưa
Nghe thấy vui vui thì hãy đứng lâu
Nghe thấy ma cậu, ma cô thì đi ngay bõ ghét".
Nàng ả nàng hai
Đi ra đường cái
Đi lại đường con đứng đợi
Nàng ả nàng hai
Bước ra cúi đầu thưa lại:
- "Thưa ngài cun cả
Thưa ông cun hai
Chị em đâu dám tìm đường lần tránh
Chị em muốn về mường Đủ, mường Khói
Lạc lối, lạc bước đến vườn nhà ngài
Hai ngài mở lòng thương cùng
Thì cho chúng em vài tiếng nói".
Cun Bướm Bạc nói rằng:
- "Các nàng đã quá chân về đây
Đã nhúng chân vào đất nghèo
Chẳng ngại đất khô bám dính
Xin bước chân về giếng
Xin quá chân về nhà
Đất khó, mường nghèo
Nhung ngõ còn thông thống".
Nàng ả đi xuông
Cun Bướm Bạc dắt ngựa đi xuống
Nàng hai bước ra
Cun Bướm Bờ dắt ngựa đưa ra
Ở trên đỉnh núi đá Voi Nằm
Còn gọi là đỉnh Non Tiên
Hàng ngàn chị em đã nóng lòng đợi hai chị
Càng đợi càng lâu
Càng lâu càng vắng
Lắng chị càng bặt tăm
Trống nhà trời đã điểm canh năm
Trống nhà trời đã báo giờ cấm
Đành lòng hai chị vắng
Các tiên nàng vội vã về trời
Chị em lúc đi đông đủ
Lúc về bỏ lại hai
Cửa con trời đã cài
Cửa lớn, trời đã đóng
Nàng ả, nàng hai
Tai nghe cửa đóng sập
Tai lắng cửa cài then
Đành ở lại đây, nơi trần gian mường dưới
Cun Bướm Bạc lấy được nàng ả
Nên họ lang
Cun Bướm Bờ lấy được nàng hai
Nên họ dân
Chín tháng mười hai năm
Nàng Ả sinh con nối dõi
Thứ nhất, sinh ra Cun Khồng Làng
Thứ hai, sinh ra Cun Khồng Và
Thứ ba, sinh ra Cun Khồng Tập, Khổng Tồi
Thứ tư, sinh ra Cun Khồng Ếm, Không Am
Thứ năm, sinh ra Cun Khồng Lẫm, Khồng Lồ
Thứ sáu, sinh ra Cun Không May
Thứ bảy, sinh ra Cun Khồng Tốt
Nàng Hai sinh con thứ tám, Cun Chàng Vàng
Thứ chín, sinh ra Lang Chàng Xế
Thứ mười, sinh ra Trống Chim Tùng , Mái Chim Tót
Trống Chim Tùng
Mái Chim Tót
Là con Út con yêu.
Lại kể chuyện Trống Chim Tùng, mái Chim Tót
Không có nơi ăn
Chẳng có nơi ở
Đậu cành dâu da, đứt cành dâu da
Bám dây Ta tền, đứt dây Ta tền("
Chim Tùng, chim Tót
Định ra bến để nuốt lá ngón cho chết
Chết đi cho đỡ khổ
Định ra rừng giang thắt cổ
Chết đi cho đỡ nhục đỡ thương
Ra đường quang, sân rộng
Trống chim Tùng, mái Chim Tót
Gặp mụ Dạ Dần hay lo
Gặp mụ Dạ Dần hay thương hay bảo
Rắng:
- "Hai cháu đừng ra rừng mà sợ con gấu
Đừng vào thung mà sợ con cọp
Con mái thì tìm chỗ mát rỉa lông
Cho nên đá hang Trống(?)
Con trống thì ra rỉa mỏ
Cho nên đá hang Hao 3
Đi đào đất cho nên sông sâu ruộng rộng
Cho có nơi mà ăn
Cho có nơi mà ở
Chớ đi liều thân mà khổ"
Nghe lời mụ Dạ Dần
Con mái đã ra rỉa lông
Con trống đã ra rỉa mỏ
Đã có nơi mà ăn
Đã có nơi mà ở
Đã có chỗ chơi
Ban sáng chim đi xem
Mu Da Dân dệt lua
Buổi chiều chim đi xem
Mụ Dạ Dần dệt gấm
Lụa mụ Dạ Dần có chấy có rận
Gấm mụ Dạ Dần có bọ chó, bọ ma
Chim xem, chim đã rõ
Chim ngó, chim đã từng
Trống chim Tùng, mái chim Tót
Về nhà học dệt lụa
Học dệt gấm
Lụa của chim Tùng không có chấy có rận
Gấm của chim Tót chẳng có bọ chó, bọ ma
Mụ Dạ Dân lại bảo:
- "Các cháu phải nghe
Con mái bay vào núi đá hang Trống
Đục lấy chín phiến đá
Con trống bay vào núi hang Hao
Đục lấy chín phiến đất
Đục thành hốc, thành lỗ
Con Trống bay vào sông Cái
Cặp lấy chín nén cỏ Bái
Con Mái bay xuống sông con
Công lấy mười nén cỏ gianh
Về khoanh đi khoanh lại làm tổ
Tổ tròn như mặt trời
Tổ rộng như cửa sông
Miệng tổ cao như quả núi
Cuối tổ như mái nhà sàn
Đầu tổ như mái nhà trước
Đi vào phải nhẹ bước
Đi ra phải nhẹ chân
Đáy tổ to bằng miệng sông, miệng bể".
Được ngày, được tháng
Chim Tùng, chim Tót vào hang, vào ổ
Vào tổ đẻ trứng
Chín ngày, chín đêm, chín tháng
Được một nghìn chín trăm mười chín trứng tốt
Còn một trứng bảy góc, chín cạnh, mười khuông
Đó là trứng ung, trứng xấu
Chim Tùng ấp chín mươi ngày bặt tăm
Chim Tót ấp chín mươi ngày bặt tích
Trứng không hé không nở
Trứng không nở nên con
Chim Tùng, chim Tót nối giận hầm hầm


Đem trứng đi bỏ
Bỏ một trứng lên trời
Nở ra ông Thần Chớp
Ném một trứng lên trời
Nở ra ông Thần Mây
Ném một trứng dài dài
Nở ra nòi chuột chù
Ném một trứng to to
Nở ra nòi con lợn
Ném một trứng lùn lùn
Nở ra loài con voi
Ném một trứng loi ngoi
Nở ra nòi con cá
Ném một trứng vào lá
Nở ra loài thú dữ trong rừng
Ném một trứng ra chuôm
Nở nên họ hàng cây cỏ
Ném một trứng lên đồi đất đỏ
Nở ra họ cây nứa
Trống chim Tùng mái chim Tót
Tháng Tư lại đi xem
Mụ Dạ Dần dệt lụa
Tháng Ba lại đi xem
Mụ Dạ Dần dệt gấm
Dệt gấm, dệt lụa chưa xong
Trông chim Tùng mái chim Tót đã mang trứng
Được ngày, được tháng
Chim Tùng, chim Tót lại vào ổ đẻ
Lại vào tổ ấp trứng
Âp bốn mươi chín ngày bặt tăm
Ấp năm mươi ngày bặt tích
Được một trứng đen đen bốn khúc
Trứng bầu dục bốn khuông
Mặt vuông, mặt tròn chín cạnh
Rành rành mười hai quai
Trứng này là trứng Giông trứng Dòng
Là nòi trứng nên ông nên người


Chim Tùng, chim Tót
Ra đường về tô
Trả ổ cho mụ Dạ Dần:
- Trứng mụ đem cất
Con mụ chăm nom"
Mụ Dạ Dần chạy đi rao chín tiếng:
- "Hỡi đất ma nhà trời
Hỡi chim côi chim góa
Ai bay vào Hang Trông
Áp cho nứt trứng
Ấp cho nở trứng Chiếng
Mai sau
Ta cho áo xống
Ta cho vàng bạc
Ta cho ruộng sâu
Ta cho ruộng mùa".
Khi đó, ở đất ma nhà trời
Đất chim côi, chim goá
Có con bìm bịp lành lòng
Có con công lành đuôi
Chuyển tiếng chuyển lời:
- "Chúng tôi xin vào ấp
Nhưng không có lưng để mặc váy
Không có bụng để mặc áo
Chúng tôi không biết ăn cơm uống rượu
Nên không cân ruộng nương
Tháng Tư cho chúng tôi được làm tổ nơi tốt
Tháng Chín, tháng Mười cho chúng tôi làm tố ở nơi đẹp".
Lòng mụ Dạ Dần đã ưng
Chim Bịp, chim Công vào ấp
Ấp bốn tháng nghe nên biển biệt
Ấp chín tháng nghe nên mịt mù
Chim Bịp chim Công
Vội trở về nhà
Mụ Dạ Dần lại đi rao:
- "Hỡi đất ma nhà trời
Hỡi chim côi chim góa
Có ai ấp nứt trứng Pỏ
Nở trứng Chiêng
Mai sau
Muốn quần áo ta cho quần áo
Muốn vàng bạc ta cho vàng bạc
Muốn ruộng sâu ta cho ruộng sâu
Muốn ruộng mùa ta cho ruộng mùa".
Khi đó lại có chim chiên chiện
Bay qua nhà mụ Dạ Dần
Lên tiêng:
- "Chúng tôi xin vào ấp
Nhưng có lưng đâu mà mặc quần
Có bụng đâu mà mặc áo
Chúng tôi không biết ăn cơm uống rượu
Nên chẳng lấy ruộng nương
Chúng tôi xin làm tổ nơi hay nơi đẹp".
Lòng mụ Dạ Dân đã Cng
Chim chiên chiện hối hả bay vào ấp
Những buổi sáng
Con mái lấy cánh vàng che mặt trời
Buổi chiều
Con trống lấy cánh bạc che mặt trời
Con mái lấy hòn đá đập giả
Con trống lấy ngọn lá đập hờ hờ
Bỗng thất nứt trứng Pỏ
Nở trứng Chiếng
Nghe ồn ào tiếng Lào
Nghe lao nhao tiếng Kinh
Nghe ình inh tiếng Mường
Nghe xôn xao tiếng Thái
Nghe hối hả tiếng Mán
Nghe nháo nhác tiếng Mẹo
Nghe léo xéo inh inh
Nghe tiếng nói tiếng cười
Trứng một - nở ra ông Dịt Dàng
Trứng hai - nở ra ông Lang bà Cái
Trứng ba - nở ra Lang Cun Cần
Trứng bốn - nở được Bố Bướm Khang
Trứng năm- nở ra Xang Xí
Trứng sáu - nở nàng Vạ Hai Kịt
Trứng bảy - nở nàng Mằm


Trứng tám - nở ra cả Chu Chương mường nước
Trứng chín - nở đứa bạc tạng đứa lồi mắt
Trứng mười - nở ra con côi bà hoá
Trứng mười một - nở đứa què hay trèo cây cọ
Trứng mười hai - nở đứa chột đứa đui
Như vậy:
Người Trần gian ai cũng sinh từ hang Trống
Lấy tiếng từ Hang Hao
Hãy nghe tiếp chuyện sau
Hãy nhớ câu đàng trước
Truyền đi cho được
Cả mường cả nước đừng quên
Để nghe tiếp chuyện Chia năm, chia tháng.`, muong: `VI. TEẺ MOÓN


Cân khi mục
Đéng bục dục hoà xa chân, xa xay Mú Da Dấn,
Đéng Xân rên hoà xa tlốc Mú Da Dấn
Đéng xài rai, hoà xài rai xa mặt Mú Da Dấn.
Đén xương rương, hoà xa pán rương Mú Da Dấn.


Mú Da Dấn
Méng hay tói ăn cà,
Tá hay tói ăn cơm
Méng tơm xiềng taấy pào
Tá nhào lới pôông va
Mú ở tìn tất măng khấp
Mòn nấp lêng tlới cao
Mú ăn, mú teẻ
Mú trẻ xa han cày tlờng
Mộch tlờng rếch xa àn Cun Pườm Pạc,


Mà cảc dí mài, pá náng tênh nhởn
Cho rứng tô nhá tôi xớn xơ
Cho hòn ró cà, mà xôm xôm
Cho con khao hôm vến muốt ì rà.
Cho con khao tính vến xeo
Cho tán chim chéo pheo păn làng
Ré pảo xiềng xim xéng.
Ùm xim măng lới rì
Giục khè náng ả, náng han:
- "Ní nời, han eng thưa cháo,
Cháo ha nhơ khao lói khao,
Ha vất lóng nó mà chưa lêng xiềng?
Xa mà poi, mà iềng
Xa mà cháo, mà thưa
Măng tếu ưa ưa xì muốt từng lô
Măng xa tếu ma cù, ma cô xì ti cho bỏ khèn mặt
Náng ả, náng han
Ti xa táng cài
Tì lái tăng con từng toới,
Han náng cùi trốc thưa lái:
- "Thưa ông ngái cun cả
Thưa nửa, ông cun han,
Ùn dí nó tàm trèo trò.
Ùn mái mònh vến La Khơn, Đủ Ô, mường Khòi cớ nống.
Chớ ní lạc pưởc tềng vướn nhá ông
Xật xá cườn han Cun xương cho túa
Vở lóng cho ùn mái vái xiềng chăng?
Cun Pườm Pạc vé ló hoong:
- "Cảc pá náng măng xương tà trài chó tếng lùng
Ta nhung chó tềng cày tất mướng nghéo,
Chăng chê tất khô ngheo neo
Cườn náng cheo chó xa chiêng,
Cườn riềng riếng trài tồ vến nhá
Tất khò, mướng rá
Rỏ mơi ngỏ pao, mướng xa cón rêng thồng thồng.
Náng ả ti xuống
Cun Pườm Pạc tách ngứa ti xuống,
Náng han pước xa
Cun Pườm Pớ tách ngứa tưa xa.


Ở trêng pọt tốn phủ Voi Nắm
Còn rố vé Ngám Tốn Tiên
Nghìn nghìn náng tién tiên tơi han ới văng văng
Cáng trằng cáng lô
Cáng lô cáng quéng
Vèng véng tăm xăm
Lúc rì, trôồng nhá tlới tà tèng pấn răm
Trôồng tà phang xiềng cầm
Thổi xi cho han ới quẳng quắng
Tán tiên đằng dắng pằn vến tlới.
Ùn máng lúc ti cặp cặp
Lập vền cón lạc lái han.
Cửa con tlới tà cái
Cửa náy tlới tà toòng.
Náng ả, náng han
Xai măng cửa khập
Xai trằng noòng cửa cái,
Thôi, phải ở lái mướng dương gian mướng tìn.
Cun Pườm Pạc lễ ăn náng à
Pêng hoó nhá lang:
Cun Pườm Pớ lễ ăn náng han
Rêng hoó dân:
Chín khàng mưới han năm
Các náng teẻ con nổn doóng:
Xừ mộch, teẻ ăn Cun Khôống Láng,
Xừ han, teẻ xa Cun Khôống Vá,
Xừ pa, teẻ xa Cun Khôống Tập, Khôống Tối
Xừ pôn, teẻ xa Cun Khôống Êm, Khôống Am
Xừ răm, teẻ xa Cun Khôống Lẩm, Khôống Lố
Xừ phầu, teẻ xa Cun Khôống May
Xừ pảy, teẻ xa Cun Khôống Lốt
Xừ xàm, teẻ xa Cun Cháng Váng
Xử chìn, teẻ xa Lang Cháng xề
Xừ mưới, teẻ xa Khôồng Chim Túng, Mài Chim Tỏt
Khôồng Chim Túng
Mài Chim Tỏt
Là con ủch, con yêu.


Lày kể chiiến Chim Túng, Chim Tỏt
Chàng cò nơi mà ăn
Chăng cò ngắn mà ở
Rùm đéng chu da, tếnh đéng chu da
Pàm khái ta - tên, tếch khái ta tền
Chim Túng, Chim Tót
Liếu xa rứng tang xắt cỏc
Chết ti cho đỡ nhục, đỡ xương
Xa táng quang, khường rống
Khôổng Chim Túng, mài Chim Tót
Tấm tốn mú Da Dấn hay lo
Mú Da Dó hay xương, hay pảo
Rắng là:
- "Han xôn tứng xa rứng mà rưới cù
Tứng pao rù mà rưới khàn húm, /
Con mài ti xím púng mách mà chày lôông,
Cho rêng hón phú Hang Tlồng
Con khôổng ti xa chày mỏ
Cho rêng trày phú Hang Hao,
Tí táo tất cho rêng trưa khu, khôông rôông,
Tế cò nơi mà ăn
Cho cò ngắn mà ở
Tứng má ti liếu xân mà khổ.
Tlằng xiềng mú Da Dấn
Con mài tà xa xôm lôông
Con khôổng tà xa chày mỏ, choỗ cèng
Tà cò nơi mà ăn
Tà cò ngắn mà ở
Tà cò àng phêng
Pơn khờm chim ti hẩu
Mú Da Dấn chuông tách cày xaái,
Chèo rào tủa ngày chim ti ngoong
Mú da dấn chuông cầm.
Xaái cố Mú Da Dấn cò chì, cò phếng
Cầm cố Mú Da Dấn cò tha ma
Chim hẩu chim tà tủa.
Chim ngò, chim tà tướng.
Khôổng Chim Túng, Mài Chim Tót
Lạy trở vến tún hoọc chuông cày xaái.
Tày phố chuông lễ cày cầm.


Xaái cố chim Túng chẳng cò chì, cò phếng,
Cầm cố chim Tỏt chẳng cò tha ma.
Mú Da Dấn lày pảo:
- "Các xôn phải trằng lẽ
Con mài hảy păn pao trày phuú Hang Trôồng
Vẩu lễ chìn phiền phuú
Con khôổng păn pao trày phuú Hang Hao
Tục lế chìn vèng khu, vèng rôông
Vầu rêng hốc, rêng lổ
Con khôông păn tếng khôông cả
Cặp tế chìn neén cỏ pài pài,
Con mài păn pao khôông con
Côông lễ mưới nèn cỏ gieng gieng,
Vến khoeng ti, khoeng lái mấn ổ,
Ổ trón nhơ mặt trới,
Ổ rôống nhơ ang khôông,
Méng ổ cao càng tốn
Trôốn ổ nhơ màng pài,
Xài ổ nhơ màng xôm,
Ti pao phải ròn rèn
Ti pao phải ròn cột.
Pọt ổ có méng khôồng, méng pổ
Ăn ngáy, ăn khảng
Chim Túng, chim Tót pao hang, pao ổ
Pao ổ lẻ trờng
Chìn ngáy, chìn têm, chìn khảng
Ăn mộch nghìn chìn trăm mưới chìn trờng xốch
Cón mộch trờng pảy khuông, chìn ceéng, mưới han vóng
Rì là trờng ung, trờng hồi
Chim Túng ốp trờng chìn mưới ngáy tăm xăm,
Chim Tỏt ốp chìn mưới ngáy tất xắt
Chẳng rểnh trờng pỏ
Chẳng rỏ trờng tiềng
Chim Túng, chim Tót rổi cơn dừ pớn chớn
Pơn trờng ti lác
Lác mộch trờng lêng trới
Rở xa ôông Thần Chớp
Quăng mộch trờng dợp dợp
Rở xa ôông Thần Mân,


Nèm mộch trờng xân rân
Rố rêng tuông chuột chú,
Nèm mộch trờng lô lố
Rở àn tuông cày cùn,
Nèm mộch trờng cùn hùn
Rở xa tuông voi,


Quảng mộch trờng lii ngoi
Rở nói ruông cày cà,
Nèm mộch trờng pao: thung pao thà
Rở àn tuông moong to
Nèm mộch trờng lo xo
Rở xa tuông cỏ pách
Nèm mộch trờng lên tôốn tất
Rểnh xa tuông cần lào,
Khôông Chim Túng, mài him tỏt
Khàng pồn lày ti xa
Hấu Mú Da Dấn chuông xaái
Khàng pa lày xa tế ngò
Mú Da Dấn chuông cầm, chuông phà,
Chuông phà, chuông xaái chưa xoong
Khôông Chim Túng, mài Chim Tỏt tà pơng trờng
An ngáy ăn khàng
Chim Túng, chim Tót lày ti pao ốp ổ
Lày pao ổ ốp trờng
Ốp pồn mươi chìn ngáy tăm xăm
Ốp răm mươi ngáy pặt xặt
Teẻ ăn mộch trờng dấm dấm pồn khúc,
Trờng pục dục pồn khuông
Mặt vuông, mặt trón, chìn ceéng
Teéng deéng mưới han quai
Tròng ní là trờng nói, trờng doóng
Là nói trờng rêng ôông, rêng trùa.


Chim Túng, chim Tót
Xa táng, vến ổ
Trả ổ cho mú Da Dân:
- “Trờng mú dong mon
Con mú dong iềng.
Mú Da Dấn chắn ti rao chìn xiềng:
- "Hỡi tẩt ma nhá trới!
Hỡi chim côi, chim khoà,
Ay păn Hang Trôồng
Ốp cho roo trờng Chiềng
Khau mai vên ngáy
Ha cho ào, cho xôồng
Ha cho váng, cho pạc
Ha cho trưa khu
Ha cho ná múa"
Lúc rì, ở tẩt ma nhá trới
Tất chim côi, chim khoa
Cò con pọp pịp léng lôông
Cò con chim côông léng tuôi
Chiiến xiềng, chiiến lới:
- "Mú à, mú ới.
Mộch tôi cườn àn pao ổp
Mơi chăng cò lưng nó tói mặc ào,
Chăng nhào rào nó tói mặc văn
Mộch tôi chăng mắt ăn cơm òng ráo
Rêng chăng cấn vốc khu, vốc rôông.
Khàng pồn mộch tôi cườn mấn ổ nấm ná,
Khàng han khàng pa cho àn mấn ổ nấm hòn,
Khàng chìn, khàng mưới mấn ổ pún deng deng.
Loóng mú Da Dấn tà ưng
Trôông mú Da Dân tà chíu
Chim pịp, chim côông pao ổp
Ốp pồn khàng tăng xăng
Ốp chìn khàng tịp xịp
Chim pip, chim côông
Trở pài lái nhá
Mú Da Dân lày ti rao:
- "Hỡi tất ma nhá trới!
Hỡi chim côi, chim khoa!
Cò ay ốp rểch trờng pỏ, rỏ trờng chiềng
May khau
Mònh xôồng ào ho cho xoồng ào
Mònh váng pạc ho cho váng pạc
Mònh vốc khu, vốc rôông ho cho vốc khi vốc, rôông.


Lúc rì,
Tà là cò chim chăng chiến
Riễng riếng têng nhá mú Da Dấn
Lêng xiêng:
- "Mộch tôi cườn pao ổp trờng,
Mơi chăng cò lưng nó vé mặc xôồng,
Chăng cò rôồng nó tái mặc ào
Chăng ăn cơm, òng ráo
Tế tói phấn trưa, phấn ná,
Mộch tôi cườn mấn ổ púng dâm da càng hòn".
Loóng mú Da Dấn tà ưa
Chim Chẳng Chiến phưa lưa tềng ốp,
Nó mơi pơn khờm
Con mài lế ceèng che piến trới moọc,
Pơn khuống
Con khôồng lè cèng pạc che mặt trới lắn,
Con mài lê hôn phuú tập giả,
Con khôồng lế ngón là tập giớ
Vất cá khớ rếch xa trờng pỏ
Rỏ cày trờng chiềng
Măng lốn nhốn xiềng Láo,
Măng lao nhao xiêng Chếng
Măng lếng lẽng xiềng Moón
Măng hón hón xiêng Táy
Măng láy váy xiêng Màn
Măng vôn vàn xiềng Meéo
Cheo péo chỏng pẻng xiềng cưới, xiềng khể.
Trờng mộch tẻ àn ôông Dịt Dáng,
Trờng han, tẻ xa Lang Tà Cái,
Trờng pa, tẻ àn Lang Cun Cấn
Trờng pôn, tẻ xa pổ Pườm Khang,
Trờng răm, tẻ xa ôông Xa Xí,
Trờng phàu, tẻ xa náng Vá Hai Kịp,
Trờng pảy, tẻ àn náng Mắm
Trờng xàm, tẻ àn chu chương mướng rảc
Trờng chìn tẻ xa từa pạc, từa lối
Trờng mưới, tẻ xa con côi, mế khoa,
Trờng mưới mộch, tẻ xa từa qué hay tréo mún
Trờng mưới han, tẻ xa lấu tun hay nhầm lán nà.


Xí rì:
Moon ha ay i tẻ pở trày phuú Hang Trôồng
Lế xiềng khể phở Hang Hao.
Tà là trằng xêm chiiến khau
Tế nền pao chiiến trưởc
Chiiến ti cho àn
Cả mướng rác chăng phêng
Răm reng trắng chiiến chia năm, phân khàng.`, context: "Chim thần đẻ ra vô số quả trứng trên cành si thần. Trứng nở ra các thủ lĩnh tộc Lang đạo, tộc Cun và những con người Mường đầu tiên mở đầu cho nòi giống." },
  { id: 7, name: "Đẻ Năm tháng", epoch: 1, kinh: `VII. CHIA NĂM CHIA THÁNG
 Dưới đã có đất
Trên đã có trời
Đã có chu chương mường nước
Nhưng chưa có ngày có tháng
Chưa biết đưa ngày nào ra trước
Rước ngày nào ra sau
Thuở ấy
Có ông Cuông Minh Vàng Rậm
Có nàng Á Sấm Trời
Đã đi khai mỏ đồng
Đúc làm mặt trăng
Đã ra khai mỏ vàng
Đức làm mặt trời
Đúc được chín mặt trời
Đúc được mười hai mặt trăng
Nắng gay nắng gắt
Làm rấy chẳng nên ngô
Trên nguồn không có nước
Làm nương không nên lúa
Để có gạo ăn
Để có nước uống
Để có ruộng làm
Để có sân mà chơi
Ta phải bắn bớt mặt trời
Mới yên mường mà ở
Đồn rằng
Lúc ấy họ nhà Ngao
Ong thần Nỏ Ná
Sắm tên bương già, ba năm xông khói
Chín mặt trời bắn rơi đi tám
Mười hai mặt trăng bằn đi mười một
Ai không biết đêm thì tìm mặt trăng
Ai không biết ngày thì theo mặt trời
Từ đó
Ban ngày có mặt trời
Ban đêm có mặt trăng
Nhưng chưa có năm có tháng
Chu chương mường nước đi rao
- "Ai kêu được trời đem sáng
Muốn bạc muốn vàng
Muốn chín trâu mười bò
Muốn gì mường cho cái đó".
Có con gà thưa rằng:
- 'Tôi không lấy bạc lấy vàng
Không ruộng dọc ruộng ngang
Nên không lấy trâu, bò mộng".
Có con vịt thưa rằng:
- "Từ nay vễ sau
Trứng chúng tôi đẻ gà phải ấp
Con chúng tôi nở, người phải chăm".
Lòng ông Pồng Pêu đã ưng
Gà nhảy lên lưng vịt
Bơi trên sông trên hồ
Nó gáy một tiếng đàng đông
Gáy vồng sang phía đàng tây
Mặt trời nghe gà kêu
Lên rải nắng vàng
Mặt trăng nghe tiếng vịt
Mặt trăng đã mọc lên
Từ đó có trời đêm, trời sáng
Nhưng chưa có tháng có năm
Đồn rằng
Mường lớn nhất có ông Thu Tha
Mường lớn nhì có bà Thu Thiên
Đứng ra truyền làm năm làm tháng
Đặt ra rằng
Một năm có 12 tháng
Một tháng có 30 ngày
Có năm đây năm vơi
Có tháng no tháng thiếu
Lấy tháng đủ trước là tháng giêng
Gọi là tháng đâu năm
Cho tằm lên leo lá
Đặt ra tháng hai, tháng ba
Cho cá lên đồng
Đặt ra tháng tư
Cho cá biển phơi lưng
Đặt ra tháng năm, tháng sáu
Cho vua Nước lên nuôi binh, nuôi mường
Đặt ra tháng bảy, tháng tám
Cho trời làm mưa, làm gió
Đặt ra tháng chín, tháng mười
Đặt ra tháng mười một, mười hai
Cho ông Táo cưỡi mây lên thượng giới
Chuyện chưa hết lối
Nói chưa hết lời
Chuyện ta hãy còn dài
Ngồi lại mà lắng
Đứng lại mà nghe.`, muong: `VII. PHÂN NĂM CHIA KHÀNG


Tìn tà cò tẩt
Trên tà cò trới
Tà cò chu chương mướng rảc
Rỏ mơi chưa cò ngáy cò khàng
Chưa mắt dàng ngáy nó xa hơ
Giơ ngáy nó xa trưởc xa khau?


Mưa rì,
Cò ôông Cuông Minh Váng Râấm
Cò náng Ả Khẩm Trơi
Tà ti khai mỏ tôống
Túc mấn mặt tràng,
Tà ti khai mỏ váng
Túc án mặt trới,
Túc rêng chìn mặt trới
Tuc àn mưới han mặt tràng
Rằng păng khăng pặt khặt
Lật rong chăng rêng kháu
Táo hòn chăng cò rảc
Vạc roóng chăng rêng loó,
Tẻ roó xa cào
Tẻ ngào xa rảc
Nảc má tẻ mấn
Phèng quang àng rôống mà phui
Xì ha phải pành pồch mặt trới
Mời yên phui mướng ở.
Tốn dốn tốn vé,
Lúc rì - Hó nhá Ngao


Là ông thân Nà
Nò phằm lán pương rá pa năm chẳng khòi
Chin mặt trới pành ti xàm mặt
Mưới han mặt tràng pành ti mưới một,
Ay chăng mắtêm xỉ xím mặt tràng
Ay chăng mắt ngáy xì ràng mặt trới.
Pở rì,
Pơn ngáy tà cò mặt trới
Pơn hôm tà cò mặt khàng.
Ró mơi chưa cò năm, cò tràng,
Chu chương mướn rắc ti rao:
- "Ung ay rô àn trới tom tràng
Mònh pạc mònh váng
Mònh chỉn tru, mưới pó
Mònh cày chi mướng rác cho cày rì:
Cò con kha thưa lêng:
- "Tôi chăng lế pạc, lế váng
Chăng trưa khu, vốc rôông
Rêêng chăng tham tru, côống pó
Lày cò con vịt pảo tra:
- "Pở ní vến khau
Trờng mộch tôi tẻ xa, xì con kha phải ổp
Con cài mộch tôi xì moón phải chăm".
Loóng ôông Pồng Pêu tà ưng
Tế kha nhảy lêng lưng cày vịt
Pơi pơi trêng khôông, trêng hố
Reé cằn mộch xiêng táng đông
Cắn vôống vôống mộch xiềng táng Tây
Mặt trới tà măng kha cằn
Tể lêng quải rằng
Mặt tràng tà măng vịt rố xeo lêng.
Pở rì tlà cò trới hôm, trới tràng
Rỏ mơi chưa cò khàng cò năm
Tôn vée:
Mướng náy cả cò ôông Thu Tha
Mướng náy han cò pá Thu Thiên
Từng xa chiiến tẻ mẫn năm, mấn khàng
Tà tệch xa àn:
Mộch năm cò mưới han khàng


Mộch khàng cò pa mươi ngáy
Cò năm tây năm lưng
Cò khàng ro khàng xiêu
Lế khàng đủ trưởc rốc mấn khàng xiêng,
Rôố veé khàng tấu năm
Cho xắm lêng ăn là
Tệch xa khàng han, khàng pa
Cho cà lêng tôống
Tệch xa khàng pồn
Cho cà môống nôông lên tái hạc,
Tệch xa khàng răm, khàng phàu
Cho vua rảc lêng ruôi binh, chiềm mướng.
Tệch xa khàng pảy, khàng xàm
Cho trới mấn mưa, mấn xò,
Tệch xa khàng chìn, kháng mưới
Cho pôông cơm trày loó đoòng đeeng
Tệch xa khàng mưới mộch, khàng mưới han
Cho ôông pếp cời mân lêng trới.
Chiiến chưa tủa lới
Poọc chưa tủa xiềng
Chiiến riềng riiếng láng láng
Ngôi hơi mai lày trăng
Từng lới lày xeo...`, context: "Lập ra khái niệm thời gian tuần hoàn. Định rõ mười hai tháng, xuân hạ thu đông để bà con biết theo dõi mùa vụ cấy cày và ngày hội xuống đồng xuân sang." },
  { id: 8, name: "Đẻ Dịt Dàng", epoch: 1, kinh: `VIII. DỊT DÀNG
Dưới đã có đất
Trên đã có trời
Mọi người muốn ông Dịt Dàng ra cầm binh
Thì mường nước mới sang
Dân mới giầu mới có
Ông Dịt Dàng gọi đứa con trong cửa
Gọi đứa ở trong nhà
Lấy chiếu trải ra
Lấy trầu lấy cau đãi bạn
Lúc này Dịt Dàng cất giọng
Cọi vọng ra mọi người:
- "Mường ơi, mường à
Hôm nay ngày nắng tỏ
Xanh cây xanh cỏ
Mường nước đến đây có việc gì
Hay đến gọi tôi đi săn nai
Hay đến gọi tôi đi săn hoẳng".
Mọi người thưa:
- "Không, không ông Dịt Dàng à!
Dạ ông Dịt Dàng ơi!
Chúng tôi không gọi ông đi săn nai
Chúng tôi không mời ông đi săn hoằng
Chúng tôi thây
Từ thuở có trời
Từ ngày có đất
Có người ăn người ở
Chúng tôi muốn cử ông ra cầm mường
Để mường nước được yên
Để dân giầu dân có"
Dịt Dàng nói rằng:
- "Mường nước à
Tôi ra cầm binh còn sợ ma
Tôi ra giữ mường còn sợ thuồng luồng
Dân mường phải nướng mười con thịt
Để cúng ma ếm
Phải nộp chín gánh vàng
Phải cúng vua đất, vua trời.
Trời nắng
Dân mường dọn cây
Để vua có lối
Trời mưa
Dân mường hạ cành hạ cối
Để vua có cầu
Kẻ đón đằng trước, người rước đằng sau
Dịt Dàng bước xuống bậc thang đầu
Mọi người xì xào bàn tán
Dịt Dàng đi ra sân
Ai cũng rõ cũng tường
Dịt Dàng đi ra đường
Gió ào ào, ạt ạt
Lá quất cành cong
Dịt Dàng bị ma ếm đón đường
Ma ếm thì chín mươi chín lưỡi đỏ
Ma ếm giơ chín mươi chín răng cọc
Liếm mặt Dịt Dàng
Lại rồng xông tới nhe nanh
Lại thuồng luồng mào xanh nhe nọc
Lúc đó Dịt Dàng đành quay chân về
Bởi đi chẳng nổi
Dịt Dàng đành bảo rằng:
- "Xin dân mường cho tôi được trở lại nhà
Tôi chẳng dám đi ra
Chẳng dám cầm binh cầm mường
Bởi đàn ma đã ngăn đường
Bởi rồng vàng ngăn ngõ".
Nghe xong
Dân mường đưa Dịt Dàng về nhà
Lại vào xin Lang Tà Cái
Xin Lang Tà Cái ra cầm binh cho sang
Ra làm lang cho dân mường giàu có.
Dưới đã có đất
Trên đã có trời
Đã có người chọn nơi để ở
Nhưng mường nước phải giầu phải có
Dân mường muốn Lang Tà Cái ra cẩm binh
Rạng ngày
Người ta kêu nhau ầm ầm
Đi chật một bên mường
Vòng sang núi con núi cái
Tiếng cười vang đồi bãi
Họ kéo nhau đến nhà Lang Tà Cái
Lang Tà Cái rằng:
- "Mường ơi, hôm nay ngày nắng đẹp
Dân mường gọi tôi đi săn hoẳng hay săn nai?"
Mường rước liền thưa :
- "Lang Tà Cái ơi!
Không gọi ông đi săn hoẳng săn nai
Mà chu chương chúng tôi
Thấy từ thuở đã có trời
Dưới đất có lắm người tìm ăn tìm ở
Muốn cử ông ra cầm mường
Để mường nước được yên được ấm".
Lang Tà Cái rằng:
- "Tôi ra cầm binh sợ con ma
Tôi ra cầm mường sợ rồng, sợ thuồng luồng
Chu chương phải thịt mười con thú lớn
Để cúng ma ếm
Phải chín gánh vàng mười gánh bạc
Để cúng vua Đất vua Trời"
Trời nắng
Chu chương dọn cây
Để Lang Tà Cái có lối
Trời mưa
Mường nước hạ cây hạ cối
Để Lang Tà Cái có câu đi lại
Lang Tà Cái đi vội
Rồng cuốn tới nhe nanh
Thuồng luồng xanh nhe nọc
Lang Tà Cái đành trở về
Đi chẳng nổi
Để ra giữ mường giữ nước
Lang Tà Cái đành bảo :
- "Xin chu chương mường nước
Cho tôi được trở lại nhà
Tôi chẳng dám ra cầm binh cầm mường
Bởi ma chắn đường
Thuồng luồng rồng, xanh chắn ngõ".
Đưa Lang Tà Cái về đến nhà đến cửa
Chu chương mường nước trở ra
Lại vào nhà Lang Cun Cần
Mời Lang Cun Cần ra giữ mường giữ nước`, muong: `VIII. DỊT DÁNG
Từng lới lày xeo...
Trêng tà có trới
Chu chương mướng rác mònh ôông Dịt Dáng xa cấm binh
Xi mương mời tràng,
Lùng láng mời cháu mời cò.
Ôông Dịt Dáng rố từa con troong cứa
Hốc từa ở troong nhá
Lế chiều xa mà giảt
Lê ốch trú nang tom xa,
Lúc rì, Dịt Dáng veé
Treẻ lưới xa ôống lùng:
- "Chu chương mướng rác à,
Mửa ní trới rằng rà


Cho là cỏ xeng xeng
Mướng rảc tồng ní cò công chi việc chi.
Hay tềng rố tôi ti tọt?
Moong rai, moong vang ở nó?
Chu chương mướng rảc veé:
- "Chăng chăng ôông ới,
Dà đà ôông á,
Lùng láng chăng rố ôông ti thăn cày rai,
Chu chương chăng rố ôông ti tọt moong vang,
Mộch tôi kỉa
Pở trước cò trới
Pở ngáy cò tất
Cò ngăn ăn, moón ở
Mướng rảc mònh cử ôông xa cấm mướng
Tẻ mướng rác àn yên
Tẻ tất leéng cháu cơm, cháu cà.
Dịt Dáng lày pảo:
- "Chu chương mướng rác à,
Tôi xa cẩm binh cón rưởi tán ma
Tôi xa chín mướng cón rưởi xuống luống,
Mướng rảc phải nàng mưới con xịt
Tổ lởi ma êm
Phải phằm chìn rướng váng
Tế lời tềng vua tất, vua trới.
Trới rằng rằng
Chu chương ràng cân
Tể vua xa cò khoòng
Trơi mưa phăm
Mướng rác cổn cân, trôổc ceéng
Pắc xa cày cấu
Moón haánh haánh táng trưởc, táng khau
Dịt Dáng ti xa, pước xuồng man côốc
Moón rước tước xếu xáo
Dịt Dáng ti xa phêng
Ay mênh nhênh ngằm ngò
Dịt Dáng trò xa táng
Xò páng láng pạt lạt,
Là quạt, céng voong


Cò tán ma ểm tòn táng
Ma ềm dắng dắng chìn mươi chìn lài tỏ tỏ,
Ma ềm nhỏỏ loỏ chìn mươi chìn xăng cày húm.
Púm púm xeo xa tói liềm mặt,
Cà lật cày khù hành neeng
Xuống luống máo xeeng hành lài
Xí rì, Dịt Dáng phải trài chó trở pài
Trài choó trổ vến, tỉ chăng rêng chăng khồm,
Dịt Dáng veé cồm nhồm:
- "Cườm chu chương mướng rác cho tôi àn trở pài lái nhá.
Tôi xật là chăng tàm ti xa
Chăng mân nó cấm binh mướng choo àn,
Pởi tán ma êm pàng
Tán rôống váng răm reeng".
Măng tếu chi con xiềng rỉ
Chu chương tưa Dịt Dáng vến nhá
Lày rô phố pao cườn Lang Tà Cái
Xa cấm binh cho khang
Mấn lang cho cháu, cho cò.`, context: "Mô tả sự xuất hiện của các loài động thực vật hoang dã. Phân loại muông thú, côn trùng để xác định ranh giới sinh tồn giữa con người và tự nhiên hoang dã." },
  { id: 9, name: "Đẻ Lang Tá Cái", epoch: 1, kinh: `IX. LANG TÀ CÁI
Lang Tà Cái rằng:
- "Mường ơi, hôm nay ngày nắng đẹp
Dân mường gọi tôi đi săn hoẳng hay săn nai?"
Mường rước liền thưa :
- "Lang Tà Cái ơi!
Không gọi ông đi săn hoẳng săn nai
Mà chu chương chúng tôi
Thấy từ thuở đã có trời
Dưới đất có lắm người tìm ăn tìm ở
Muốn cử ông ra cầm mường
Để mường nước được yên được ấm".
Lang Tà Cái rằng:
- "Tôi ra cầm binh sợ con ma
Tôi ra cầm mường sợ rồng, sợ thuồng luồng
Chu chương phải thịt mười con thú lớn
Để cúng ma ếm
Phải chín gánh vàng mười gánh bạc
Để cúng vua Đất vua Trời"
Trời nắng
Chu chương dọn cây
Để Lang Tà Cái có lối
Trời mưa
Mường nước hạ cây hạ cối
Để Lang Tà Cái có câu đi lại
Lang Tà Cái đi vội
Rồng cuốn tới nhe nanh
Thuồng luồng xanh nhe nọc
Lang Tà Cái đành trở về
Đi chẳng nổi
Để ra giữ mường giữ nước
Lang Tà Cái đành bảo :
- "Xin chu chương mường nước
Cho tôi được trở lại nhà
Tôi chẳng dám ra cầm binh cầm mường
Bởi ma chắn đường
Thuồng luồng rồng, xanh chắn ngõ".
Đưa Lang Tà Cái về đến nhà đến cửa
Chu chương mường nước trở ra
Lại vào nhà Lang Cun Cần
Mời Lang Cun Cần ra giữ mường giữ nước`, muong: `IX. LANG TÀ CÁI
Tỉn tà cò tất
Trêng tà cò trới
Tà cò nơi ăn, ngắn ở
Rỏ mơi mướng rảc phải cháu, phải cò
Chu chương mònh Lang Tà Cái xa cấm binh.
Pich mooc,
Moón rôô phố han han
Ti chật mộch pang mướng
Voóng phang tốn con, tốn cài.
Lang Tà Cái măng xiềng cưới vang tốn pài
Dồi dài chu chương kèo tềng tún, tềnh nhá
Ôông ha treẻ xiềng khề:
- "Chu chương mướng rác à,
Ngáy nay rằng trới tom xốch
Chu chương rô tôi ti thăn vang hay là tọt rai?
Mướng rác thưa lêng:
- "Lang Tà Cái ới,
Chăng rô ôông ti tọt vang, thăn rai
Mà mộch tôi
Kía pở thưở tà cò trới
Tìn tẩt cò lằm moón xím ăn, xím ở
Mònh cử ôông xa cấm mướng
Tẻ mướng rảc àn yên, àn ẩm.
Lang Tà, Cái lày veé:
- "Tôi xa cấm binh cón rưởi con ma,
Tôi xa cấm mướng cón măng rưởi khù, xuống luống,
Chu chương phải nàng mưới con moong cá,
Tẻ lời tra cày tán ma êm.
Phải phằm chin triêng váng, mưới triêng pạc
Tẻ lởi pao vua Tất, vua Trới.
Trới tom cày rắng păng hăng
Chu chương raáng cân
Tẻ Lang Tà Cái cò khoòng
Trới mưa,
Mướng rảc cổn cố mách ceéng
Tẻ Lang Tài Cài cò câu mà ti mà lái,
Lang Tà Cái lập cập xuồng cốc man tấu
Khù váo váo hành neeng
Xuống luống xeeng hành lài.
Lang Tà Cái í ti chăng rổi
Phải quay chó trổ pài lài vến,
Chăng xa cấm binh, cấm mướng àn.
Lang Tà Cái muốt pảo:
- "Cườn chu chương mướng rảc
Cho tôi àn trở pài, lái nhá
Tôi chăng tàm xa tẻ cấm binh, cấm mướng,
Tà cò con ma tòn táng
Xuống luống, khù xeeng tòn khà".
Tua Lang Tà Cái vến tềng nhá, tềng cửa
Chu chương mướng rảc trở xa
Uổt uổt ti pao nhá Lang Cun Cấn
Tẻ rởi ôông Lang Cun Cấn ti xa cấm binh cho khang
Cấm mướng cho cháu, cho cò.`, context: "Kể về vị nữ thần Lang Tá Cái, người dạy con gái Mường thêu dệt thổ cẩm cạp váy rực rỡ và lập ra các phép cúng tế gìn giữ đạo đức truyền thống tốt đẹp." },
  { id: 10, name: "Đẻ Lang Cun Cần", epoch: 1, kinh: `X. LANG CUN CẦN
Rạng sáng
Người kêu nhau ầm ầm
Đi đến nhà Lang Cun Cần
Lang Cun Cần
Gọi lính vác chiếu ra trải
Lấy trầu lấy cau ra mời
Lang Cun Cần thay quần bảy gang
Mang áo chín sải
Dắt múi khăn như đầu rái
Thắt dây lưng tám sải màu đen
Đứng dậy rõ tướng con thú dữ
Nói oang oang như sấm
Nhưng nhắm mắt lại
Lang Cun Cần hiền hiền
Mở mắt ra
Lang Cun Cần cũng lành lành
Lang Cun Cần hỏi:
- "Mường ơi, mường à
Hôm nay ngày tốt gió
Nước trong, nắng tỏ, rừng yên
Mường nước gọi tôi đi săn
Hay đi quăng chài thả lưới".
Mường nước nói:
- "Không, không, Lang Cun Cần à!
Dạ, dạ, Lang Cun Cần ơi!
Dân mường không gọi ông đi săn
Không gọi ông đi quăng chài thả lưới
Chúng tôi thấy
Từ năm có trời
Dưới đất có người tìm ăn tìm ở
Đã cử Dịt Dàng và Lang Tà Cái
Cầm binh cho sang
Cầm mường cho yên cho ấm
Nhưng hai ông ra đên đầu mường
Bi ma ếm
Đành quay về nhà
Bây giờ Lang Cun Cần đừng chê rằng khó
Mường nước muốn rước lang ra cầm mường"
Lang Cun Cần rằng:
- "Nghe chu chương nói
Tôi rối trong thân
Lo xa lo gần trong dạ
Sức bằng quả sung quả vả
Tài lại nhỏ như hột muồng muồng
Vâng tôi sẽ đi ra cầm binh giữ mường
Nhưng còn sợ ma ếm
Chu chương phải đốt mười núi lớn
Để đuổi ma ra khỏi mường khỏi ngõ".
Trời nắng
Chu chương dọn cây
Để Lang Cun Cần có lối
Trời tối
Mường nước dọn cối dọn cành
Cho Lang Cun Cần ra đường
Lang Cun Cần ra đường
Kẻ đón trước, người rước sau
Ma chạy từng bầy trốn vào trong núi
Ma rồng sợ Lang Cun Cần trói
Thuồng luồng sợ Lang Cun Cần đánh.
Từ nay đã có Lang Cun Cần
Câm binh, binh sẽ sang
Cầm mường, mường sẽ giầu sẽ có
Có người, chưa có của
Có người, phải có nhà
Nghe chuyện sau làm nhà lang cho trọn.`, muong: `X. LANG CUN CẤN
Rướng tràng.
Moón rố phố hanh hanh
Tể ti tềng nhá Lang Cun Cấn
Lang Cun Cân
Rố lình vảc chiều xa trảt
Lễ trú, lễ nang xa mới.
Lang Cun Cân thay xôông pảy cang
Vang ào chìn khải
Chắt nhói khăn nhơ trốc cày xài
Pít khái lưng xàm khải dấm dấm,
Từng dâấn xật xa cày tường moong
Xiềng oang oang khẩm tôống
Rỏ mơi ôông nhằm mặt lái
Lang Cun Cấn rỏ là hiến hiến
Vớ mặt xa
Lang Cun Cân xật là leéng leéng
Lang Cun Cấn mời pơi:
- "Chu chương mướng rảc à.
Mửa ní xốch xò
Rảc troong tò ò, rằng chờ chờ, rứng khoong,
Mướng rác rố tôi ti thăn
Hay là ti quải chán, treẻ lài?
Mướng rác veé:
- "Chăng chăng Lang Cun Cấn à,
Dà dá, Lang Cun Cấn ới,
Chu chương chăng rô ôông ti tọt,
Í chăng phải rô ti trẻe lài, quải chán
Mà mòch tôi kỉa
Pơ thuơ cò trới,
Tìn tất tà cò moón xím ăn, ngăn ở
Tà muổi cử Dịt Dáng, côống Lang Tà Cái
Xa cấm binh cho khang
Cấm mướng cho yên, cho ẩm
Roỏ mơi han ôông mời xa tềnh tấu mướng
Phải tán ma reé ềm
Dờm dờm quay trốc vến nhá,
Chớ ní, Lang Cun Cấn tứng chê rắng là khò
Mướng rảc mônh rốc Lang xa cấm mướng".
Lang Cun Cấn pảo:
- "Trằng chu chương khăn la
Tôi í khăn lồi
Lo xa, lo xôi troong nò,
Khửc tôi nắp nò trày vả, trày khung,
Tái xum nhun có trày mè mée.
Dà, tôi sẻ ti xa cấm binh chín mướng
Roỏ mơi cón rưởi ma ềm
Chu chương phải tốch mưới tốn cả
Tể tọt ma xa khỏi ngỏ, àng phênh".
Trói rằng rằng
Chu chương raáng cỏ, choo cân
Tể Lang Cun Cấn cò khoòng,
Trới xổn
Mướng rác xuôm cân, ráng ceéng
Cho Lang Cun Cấn mắt táng,
Lang Cun Cấn xa táng
Máang tòn trưởc, rởc khau
Ma ềm nhao nhao trồn pao troong rù.
Ma khù rưởi Lang Cung Cấn tròi
Xuống luống rưởi Lang Cun Cấn phang
Pở ní, tà coò ôông Lang Cun Cấn
Cấm binh, binh phải khang,
Cấm mướng, phải cháu, cò.
Cò moón rỏ mơi chưa cò cửa
Cò moón, phải cò nhá
Trằng lế àng chiiến khau: mấn nhá Lang cho ree ruột rằng.`, context: "Tôn vinh Lang Cun Cần - vị thủ lĩnh đầu tiên có công thống nhất bờ cõi, tổ chức đời sống lao động tập thể và duy trì trật tự thái bình cho đất Mường." },
  { id: 11, name: "Làm nhà ở", epoch: 2, kinh: `XI. LÀM NHÀ LANG CUN CẦN
Lang Cun Cần chưa có cửa mà vào mà ra
Chưa có nhà mà ăn mà ngủ
Còn phải lấy rừng làm nhà
Thuở ây có một người đi săn
Đi vào giữa rừng giang
Thấy con rùa đen
Nằm trong gầm núi đá
Một bận lật mai rùa đế ngửa
Chẻ lạt nứa buộc ngang
Chẻ lạt giang buộc đọc
Trói vào cọc
Néo cổ néo chân
Quân dây quanh thân
Người đi săn vững dạ hả lòng
Mới chặt cây song làm đòn khiêng đòn gánh
Người đi săn thấy trong lòng vui lắm:
- "Rùa ơi!
Tao trói mi vào đòn
Đem về róc thịt vào nồi con nấu giấm
Bỏ thịt vào nồi lớn tao rang
Nấu với rau răm
Băm với riềng ớt
Tao vừa ăn cái, vừa húp nước canh rùa"
Rùa thưa:
-
"Đừng trói tôi làm chi chết oan
Thịt tôi chẳng đầy một ống bương
Xương tôi chẳng đầy một ống nứa
Gan không no con nít
Tôi biết kiểu làm nhà
Xin ông thả tôi ra
Tôi bầy cho kiểu dựng"
Người đi săn nghe thương
Tháo dây đầu dây gót
Cởi nút buộc ngang cổ
Mở lạt buộc ngang hầu
Rùa ngẩng đầu lên thưa:
- "Bốn chân tôi làm nên cột cái
Nhìn sườn dài, sườn cụt mà xếp làm rui
Nhìn qua đuôi làm chái
Nhìn lại mặt làm cửa thang cửa số
Nhìn vào xương sống làm đòn nóc dài dài
Muốn làm mái thì trông vào mai
Vào rừng mà lấy tranh, lấy nứa mà làm vách
Lấy chạc vốt mà buộc kèo".
Người đi săn nửa đêm bước đến đất Cun Bướm Bạc
Đi hết sáng về chiều
Đến hang chim Tùng chim Tót
Tối sẩm sẩm đến đất mường Bằng
Sáng giăng giăng đến đất Đồng chì, tam quan kẻ Chợ
Sáng ra vào hầu Lang Cun Cần
Kể lại chuyện con rùa
Lang Cun Cần nghe reo trong dạ
Nghe hả trong lòng
Cho người nhà đi rao
Gọi dân mường
Trong ngày một phải qua
Ngày hai ngày ba phải đến
Dựng nhà cho Lang Cun Cần có nơi ăn chốn ở
Cửa trời sáng sáng
Bụng trời rạng rạng
Mường gần kéo qua
Mường xa kéo đến
Làm nhà cho Lang Cun Cần
Lang Cun Cân có nơi ăn chốn ở
Mường lớn, mường nhỏ
Đã làm được cửa được nhà
Cửa nhìn qua ngó lại
Nhà hai chái mười hai ngăn
Ba mươi sáu cái cửa sổ
Nay
Làng Cun Cần làm cun đã sang
Làm lang đã giầu đã có
Đời đó đã vắng
Đoạn đó đã qua
Ta kể sang chuyện khác.`, muong: `XI. MẤN NHÁ LANG CUN CẤN
Lang Cun Cấn chưa cò cửa mà pao xa,
Chưa cò nhá mà ăn, mà ở,
Cón phải tế rứng khù mấn nhá,
Thuở rỉ, cò mộch khá ti thăn
Ti pao khứa thung tang tang
Kía con roó dấm
Tảy xâm pâm ường phuú.
Mộch pớn, lật cộp roó ngả ngả
Cheẻ lạach tang tang puộc doọc
Tròi pao coọc
Nèo cooc, nèo choó
Quần khái queng co
Khá ti thăn ẩm loóng âm roọch
Mời chạch cân khoong mấn tón
Khá ti thăn phui loóng, cưới rờ:
- "Ró ới, ró à,
Hoo tròi đâu pao tón
Doong vến lết xịt, chuôn pao nối nổ giấm,
Nầm xịt phang ẩm máy hoo rang
Nô côông xâu xăm
Pắm tra phiếng, ỏt
Hoo ăn cài, hỏt rác ceeng ró.
Con ró lày mắt khế:
- "Tứng tròi tôi mấn chi chết oan
Xịt tôi chăng tấy mộch ôồng pương
Xương chăng tấy ôồng lào
Lóm lá chăng ro con rét
Mà tôi lày mắt kiểu mấn nhá.
Cườn ngái trởi tôi xa
Cườn ôông trởi tôi xật,
Tôi páy choo tỏt mẫn nhá.
Khá ti thăn măng xương
Thảo ngay rái puộc trốc
Dóc luôn rái puộc choó, puộc coóc.
Vở rái doc ngang hấu
Ró ngác trổc lêng:
- "Pồn chó tôi dóm xa rêng tố cài,
Hầu xương phaánh dái, cụt mà xếp mấn rui
Hầu qua tuôi mấn chài
Hẩu lái mặt mấn cửa man, cửa voòng.
Hẩu xương rôồng mà mấn tón nóc chướn dướn.
Mân màng pài xì xeo màng cộp
Pao rứng tèng pài mà lợp
Lê lào taanh nưng
Lê rái vốt, rái khoóng puộc kéo,
Khá ti thăn Pú Dút
Nửa têm vến tềng tẩt cun Pườm Pớ
Tràng xa tềng tất cun Phườm Pạc
Ti rạc tràng pở khuống
Tềng hang chim Túng, chim Lỏt
Xồn xặt ngặt vến tất mướng Bắng
Tràng phăng phăng tềng tôống chí tam quan keẻ chớ
Tràng rờ, Pú Dủt pao hấu Lang Cun Cấn
Diên cày chiiến con ró
Lang Cun Cấn trằng, phui troong nò
Măng hả troong loóng
Cho moón nhá ti rao
Rố mướng troong ngáy mộch phải qua,
Ngáy han ngáy pa phải tềnh
Tể dền nhá cho Lang Cun Cấn cò nơi ăn, ngắn ở
Cửa trói tràng quáng
Trôống trới tràng quang
Mướng khênh kèo phang
Mướng xa kèo tềnh
Mấn cửa, mấn nhá cho lang Cun Cấn
Lang Cun Cấn cò nơi ăn, chồn ở
Mướng náy, mướng cả
Tà mấn àn cửa, àn nhá
Voòng hẩu qua, ngò lái
Nhá han chài, mưới han ngăn
Pa mươi phàu ngôn cửa voòng
Chớ ní,
Lang Cun Cấn mấn cun tà khang
Mấn lang tà cháu tà cò.
Tới rì tà rắng
Rằng rì tà rối
Trằng xêm phui rằng khảc.`, context: "Thần Rùa vàng (Cáo Rùa) dạy người Mường cách dựng nhà sàn: mái dốc chống đọng sương, bốn cột to vững như chân rùa giúp tránh thú dữ đồi núi hiểm trở." },
  { id: 12, name: "Tìm lửa", epoch: 2, kinh: `XII. TÌM LỬA TÌM NƯỚC
Lang Cun Cần đã có nhà mà ở
Nhưng chưa có lửa để đúc bạc
Chưa có nước để rửa nhà
Nuốt thuốc, thuốc không vào
Ăn rau còn đau bụng
Lang Cun Cần giao cho Viếng Cu Linh
Một mình đi xin lửa
Phải đi mấy ngày mấy bữa
Đem cho được lửa về
Mang cho được nước về
Viếng Cu Linh ra đi
Đi xin nước xin lửa
Bước đi lật đật
Bước tới vội vàng
Đầu hôm đên mặt trăng
Sáng ra đến mặt trời
Rẽ vào chơi nhà Tà Cắm Cọt
Tà Cắm Cọt thăm hỏi:
- "Mỏi chân nên cháu phải vào nhà
Hay có việc gì đến hỏi"
Viếng Cu Linh thưa rằng:
- "Tà Cắm Cọt à
Tôi đến nhà sớm sớm
Vì Lang Cun Cần chưa có lửa đúc bạc
Lang Cun Cần chưa có nước rửa nhà
Tôi đi xin nước xin lửa"
Tà Cắm Cọt đã ưng
Liền gọi lũ em lấy con dao cán ngà
Lên đồi Ca Da
Chặt lấy năm cành cây nằng
Chẻ lấy bảy mảnh lạt giang
Chẻ nứa vàng, nứa già làm bùi nhùi
Kéo lạt giang đi đi lại lại
Lửa bén bùi nhùi
Mang về trăm bó lửa
Chia một nửa cho Viếng Cu Linh
Tà Cắm Cọt nhốt Viếng Cu Linh vào mặt trống
Hỏi rằng:
- "'Mày thấy tối hay thấy sáng"
Viếng Cu Linh trả lời:
- "Tôi thấy tối như đêm như ống"
Lúc ấy,
Tà Cắm Cọt mới cho làm lửa
Lấy chín lá dong lành
Đùm tám gói lửa để dưới
Gói chín gói nước để trên
Lửa gói đã được
Nước đùm đã nên
Tà Cắm Cọt mới cho Viếng Cu Linh ra khỏi mặt trống
Cầm lấy tám gói lửa
Đỡ lây chín gói nước
Thưa rằng :
- "Xin chào Tà Cắm Cọt tốt bụng
Chăm việc chăm làm
Tôi xin trở về Đồng chì tam quan kẻ Chợ"
Tà Cắm Cọt ra tiễn
Cả mường Nước mường Lửa ra đưa.
Viếng Cu Linh xuống thang cửa quanh co
Về theo mặt trời
Đi theo mặt trăng
Tay va vào núi
Vỡ chín đùm nước ở trên
Tưới lên tám gói lửa ở dưới
Khói tắt đẳng khói
Nước trôi lại đằng đồng
Viếng Cu Linh về không
Lưng đã mỏi
Gối đau nhừ
Tay cầm nước, nước đã khô
Vai gánh lửa, lửa đã nguội
Mang hai tay về không
Về Đồng chì tam quan kẻ Chợ
Nửa đêm
Viếng Cu Linh vào hầu Lang Cun Cân
Quỳ gối để van
Co chân xin tôi
Lang Cun Cần nổi cơn dữ
Cử cơn hờn
Lấy chân phải đạp lại
Chân trái đạp qua
Đạp Viếng Cu Linh ở giữa nhà
Đạp văng ra cửa sổ
Mở tiếng mắng tiếng chửi
Dồn tiếng thối tiếng cay:
- "Mày phải lấy phân con lợn làm nhà
Đội phân con gà làm cửa"
Miệng Viếng Cu Linh đã thưa
Lòng đã vừa đã chịu ('
Lang Cun Cần lại hội chu chương mường nước
Hôm trước, con nít bàn qua
Hôm sau, ông già bàn đi bàn lại
Bây giờ phải cử anh chàng Tun Mun (2)
Đi xin lửa về cho Lang Cun Cần đúc bạc
Đi xin nước về cho Lang Cun Cần lau dọn sàn nhà
Anh chàng Tun Mun
Đòi ăn cơm giữa cửa số
Đòi uống rượu giữa sàn
Mới chịu đi xin lửa mang về cho Lang
Tun Mun bảo rằng:
- "Chúng tôi đi lấy lửa lấy nước mang về
Ngày trước chẳng nói làm gì
Nhưng từ nay về sau
Mường phải cho chúng tôi cắn người nằm trong rừng
Cắn trâu bò ngủ trong núi"
Miệng Lang Cur. Cần đã thưa
Lòng Lang Cun Cần đã chịu
Tun Mun đến nhà Tà Cắm Cọt
Tà Cắm Cọt bước ra thềm hỏi:
- "Chàng Tun Mun ơi!
Tun Mun mỏi chân vào nghỉ
Hay có việc gì?"
Tun Mun gãi đầu gãi tai
Thở dài, thưa rằng:
- "Chúng tôi không phải mỏi chân xin nghỉ
Mà có việc cần việc nóng
Tà Cắm Cọt ơi!
Lang Cun Cân nhà chúng tôi
Đã có cửa có nhà
Mà chưa có nước có lửa
Lang sai chúng tôi đi xin lửa xin nước"
Tà Cắm Cọt hỏi rằng:
- "Hôm trước ta đã cho Viếng Cu Linh
Chín gói nước, tám gói lửa
Sao Tun Mun lại còn xin"
Chàng Tun Mun nói một lời
Xin thêm một lẽ:
- "Của chẳng ăn chẵng để
Viếng Cu Linh gánh khỏe gánh tài
Nhưng đến núi Lèn En
Gói lửa va vào núi
Gói nước tưới lên trên
Lửa tắt im im
Lửa chìm, nước chạy.
Tà Cắm Cọt lại sai người đi lấy lửa
Đem về chia cho Tun Mun
Tà Cắm Cọt lại cho Tun Mun
Chui vào trong bụng trống
Lắc lắc hôi lâu rôi hỏi:
- "Chúng mày thấy tối hay thấy sáng?"
Chàng Tun Mun nói cứng
Đứng dậy vố mặt trống nói lừa:
- "Tôi thấy sáng lòa, sáng lắm
Sáng chói, sáng choang
Thấy cả đất Đồng chì tam quan kẻ Chợ"
Tà Cằm Cọt sợ lộ cách làm lửa
Vội nhốt Tun Mun vào giỏ
Bỏ lên gác bếp
Lại hỏi Tun Mun:
- "Chúng bay thấy tôi hay thấy sáng?"
Tun Mun trá lời :
- "Bây giờ nhìn xung quanh tối tối
Ngó lại thấy đen đen".
Nhưng anh chàng Tun Mun
Có mắt ở đỉnh đầu
Nhìn thâu qua giỏ
Ngó lọt qua nan
Thấy Tà Cắm Cọt kéo lửa
Bằng bùi nhùi giang
Kéo đi giằng lại
Tun Mun thấy lửa bén mùn
Khói ùn ùn bốc lên
Thấy Tà Cắm Cọt ra suối
Lây nước mang về đong vào ống
Tun Mun nhớ trong bụng
Giữ trong lòng
Cách lấy nước trong
Mẹo kéo ra lửa
Lang Cun Cần nghe bọn Tun Mun nói
Vội cho người đi sắm bùi nhùi, nứa già
Chở vội về nhà Lang
Đế quấn dây ngang ống nứa
Sai đứa ở kéo lửa
Càng kéo lại càng hăng
Khói bay ra ùn ùn
Lửa đùn ra đỏ đỏ
Lúc đó, nhà Lang đã có lửa
Còn phải sại người đi công nước dưới bể
Đi bế nước ngoài sông
Đào mạch trong đất
Lật mỏ trong suối
Nước đã vào ống nứa
Lửa đã sáng trong nhà
Ăn cá không còn sợ tanh
Ăn rau không còn đau bụng.`, muong: `II. XÍM CỦI XÍM RẢC
Lang Cun Cấn tà cò nhá tế ở
Mơi chưa cò củi túc pạc
Chưa cò rảc mấn quang, xồm nhá
Roỏch xuốc, xuốc chăng pao
Ăn xau cón khủi tá
Lang Cun Cần giao cho Viếng Cu Linh
Mộch mếng ti cườn nói củi
Phải ti mầy ngáy, mầy têm
Dom cho àn củi nói.
Viếng Cu Linh xa ti
Tế cườn nói củi nói rác,
Pước cho lật khật
Pước lênh láng kháng
Trốc hôm ti tềnh mặt khàng,
Tràng xa ti tềnh mặt trới
Treẻ pao dôống, pao poi nhá Tà Cắm Cọt,
Tà Cắm Cọt poi:
  - “Choó mỏi nó xôn pao nhá
Hay cò chá chi, công chi, việc chi?
Viếng Cu Linh rắng:
  - “Tà Cắm Cọt à,
Tôi tềng nhá tà dờm dờm
Viếng Cu Linh xuồng man cửa roóng reéng
Vến xeo mặt tràng
Tỉ xeo mặt trới,
Cha xay, tế xay va pao tốn
Pể pớng chìn túm rảc ở trêng
Oạp lêng xàm ổch củi pang tìn:
Củi xắt táng khòi
Rảc lái táng tôống
Viếng Cu Linh cha xay vến luồng.
Lưng mỏi coong nhoong
Cổ cồn chàng ngàng.
Xây cấm rác, rảc tà khô
Vai triêng củi củi tà xắt,
Cha xay cầm cật
Vến tềng tất Tôống chí tam quan kẻ chớ
Nửa têm,
Viếng Cu Linh pao hấu Lang Cun Cấn
Quý côn cồn tể vạn,
Cang rang chó tể chíu xối.
Lang Cun Cấn xổ cơn dừ pớn chớn
Rốn cơn hớn pờn chớn,


Lễ chó chăm tạp lái
Quái chó chiêu tạp qua
Tạp Viếng Cu Linh khừa nhá
Tạp văng xa voòng cài.
Vở xiềng vằng quài quái
Quải xiềng pời quài quăm:
- "Pở ní, nói dâu phải lế cồ ẻ cùn mấn cửa, mấn nhá
Tới cổ ẻ kha mấn trùa.
Meéng Viếng Cu Linh tà boong
Loóng Viếng Cu Linh tà chíu
Lang Cun Cấn lày hối chu, hối chương, hối mướng rảc
Pừa trưởc, con rẻt khááo qua
Ngáy khau, ôông rá bán ti, nhảo lái
Chớ ní, phải cử eeng cháng Tin Mun
Ti cườn nói củi vến cho Lang Cun Cấn mấu pạc,
Ti cườn rác vến cho Lang Cun Cấn mấn quang.
Eeng cháng Tun Mun
Cón tói ăn cơm khừa voòng,
Tói còng ráo khừa tún, khừa nhá,
Mời chíu ti cườn củi tom vến cho Lang,
Tun Mun pảo:
- "Mộch tôi ti lế củi lế rác vang vến
Ngáy trưởc chăng vé mán cày chi
Rỏ mơi pở ní vến khau
Mướng rảc cho mộch tôi cành moón tảy ru
Cành tru, pó troong tốn, troong rù.
Meéng Lang Cun Cấn tà boong
Loóng Lang Cun Cấn tà chu
Tun Mun tềnh nhá Tà Cằm Cọt
Tà Cắm Cọt pước chó xa poi thăm:
- "Eeng cháng Mun Mảch, Mun Moòng ới,
Ti nhởi mỏi chó nó pao nghỉ mai
Hay ngáy may cò pua chi, việc chi?
Tun Mun cải trốc mời veé:
- "Ôông Tà Cắm Cọt à,
Mộch tôi chăng phải mỏi chó tể cườn hơi mai,
Mà cò pua cò việc.
Tà Cắm Cọt ới,
Lang Cun Cấn nhá mộch tôi
à cò cứa, cò nhá
Mà chớ ní í chưa cò củi, cò rảc.
Lang pảo mộch tôi lêng côống tà cho cườn nói tom vến.
Tà Cắm Cọt pảo:
- "O, ngáy mửa ho tà cho Viếng Cu Linh
Chìn túm rác côống xàm ốch củi
Rêng nó Tun Mun lày cón lêng cườn?
Eeng cháng Tun Mun nòi lới rằng xa:
- "Của chăng ăn chăng tế
Viếng Cu Linh triêng nôống
Rỏ mơi pôông pôông ti tênh tôn Lén En
Ốch củi va pao càng phuú
Túm rác xủ khà trêng
Xắt củi bênh nhênh
Rác tím, củi lạc.
Tà Cắm Cọt lày khai moón ti cườn nói củi
Nhặp nhúi chia cho Tun Mun
Tà Cắm Cọt lày cho Tun Mun
Chui vào trong bụng trống
Lắc lắc hôi lâu rôi hỏi:
- "Pay kía trới hôm hay là trới tràng?
Eeng cháng Tun Mun khê ràng:
Từng dấn phổ mặt trôồng veé lứa:
- "Tôi kỉa trới tràng phơ rơ, xoà roà
Tràng chờ chờ cớ nôống
Kỉa cả tất tôống chí tam quan kẻ chớ
Tà Cắm Cọt vất cá ngớ
Rưởi lố cảch mấn củi ngằm nghe,
Lày tom xa nhồt Tun Mun pao cày troi
Ngoi lêng khửa rưưa
Lày poi xứ:
- "Tun Mun kỉa xôn tràng xí nó?
Tun Mun veé:
- "Chớ ní hẩu tum queng xồn mịt
Dóm ti ngò tềnh xôn xăm.
Rỏ mơi eeng cháng Tun Mun cò mặt ở đỉnh u
Hẩu àn qua lồ troi, lô lạt
Tà kỉa Tà Cắm Cọt ngắm ngọt kèo củi
Pắng búi nhúi cân tang tang
Kèo giăng ti nhẵng lái
Tun Mun kỉa khòi lêng ngăm ngòi
Khòi pèn búi nhúi,
Lày kỉa Tà Cằm Cọt ti xa càng hòn
Nhòn lế rác vang vến toong ôồng
Tun Mun nhờ troong lắng
Chín troong nghỉ troong xân
Xật là cày lốt mấn rêng củi, rác.
Lang Cun Cấn măng Tun Mun kể lái
Hổi hải cho moón ti phằm búi nhúi lào rung,
Triêng vến phênh quang àng rôống
Tể quần khái ngang ôồng lào
Khai lậu ở kèo ti ngào ngào
Trào lái ngào nghên,
Khòi tà tun lêng ngòi ngói
Củi vỏi lêng tỏ lee.
Lúc ní nhá lang tà cò củi
Cón phải khai moón ti coọc rác vái pể,
Ti pê rác vái pháo
Táo mạch troong tẩt
Lật mỏ troong hòn.
Rác tà pao ôồng lào
Củi tà tràng nhá cao
An cà chắng cón rưởi teng
Ăn xau, ăn ceeng chắng cón tau trôống.`, context: "Cuộc hành trình vất vả tìm ra ngọn lửa từ việc đánh đá lửa. Ngọn lửa mang lại ánh sáng, sưởi ấm sàn đêm đông và đun chín lương thực ngọt ngào." },
  { id: 13, name: "Tìm lúa, trâu, bò, lợn, gà...", epoch: 2, kinh: `XIII. TÌM CƠM TÌM LỬA
Lang chưa có cơm để ăn no
Chưa có lúa để làm sang
Nhà Lang phải gọi mụ Dạ Dần
Cầm Chòong đi đào củ mài
Cho nhà Lang đủ ăn
Làm nên bàn nên bữa
Mụ già Rấp lập cập đi đào củ
Cố mụ lụ khụ đi đào củ mài
Tóc xác như tro bếp
Răng mòn đến lợi
Đào củ không còn bê nổi đầu
Hái rau không còn bê nổi sọt
Nước mắt chảy đây áo
Nước mắt chảy đầy váy
Có con chuột đen trong ống
Nghe tiếng khóc giữa rừng
Nghe tiếng than giữa núi;
Chuột hỏi rằng:
- "Sao các mụ chẳng ăn cơm
Lại nằm co ro mà khóc?"
Già Rấp bèn nói:
- "Già không đau lưng, sưng cổ
Mà lo bữa ăn cho Lang Cun Cần chưa có!"
Chuột thưa rằng:
- "Có phải nhà Lang Cun Cần
Còn đói ăn khó ở
Chưa có cơm làm no
Chưa có lúa làm nên
Mường dưới mường trên
Nhà Lang còn nghèo, còn khó?
Chưa vui đằng ở
Chưa mật mỡ đằng ăn
Mụ nghe
Tôi nói cho mà làm"
Các cố mụ thưa rằng:
-
"Ơi chuột chuột
Mày nói điều hay điều lành
Tao lắng tao nghe
Mày bày nơi có cơm, mày mách nơi có canh
Tao nghe, tao chịu"
- Các cố mụ à
"Ở núi Nàng Ả, Nàng Út'''
Có nàng Liên Tiên Mái Lúa
Còn thừa bốn mươi giống lúa ruộng
Ba mươi giống lúa rấy
Tôi không nói dối
Nhà Lang cho người lên mà xin'
Trời sáng rõ chưa lâu
Các cố mụ vào hầu Lang Cun Cần
- "Lang ơi, Lang hỡi
Chúng tôi vào rừng đi đào củ mài
Gặp con chuột vàng co ro trong ống nứa
Chuột biết nói, biết thưa
Nó thưa rằng:
"Về bảo với nhà Lang
Đến nàng út vua Tiên
Đến nàng Tiên Tiên Mái Lúa
Xin lấy giống lúa ruộng, lúa rẫy
Mang vé làm nòi
Xin về làm giống"
Lòng Lang Cun Cần biết hay
Tay Lang Cun Cần nắm phải
Chạy vội ra mường
Đứng giữa mường kêu to lên rằng:
- "Binh ơi, mường ơi!
Tận trên nhà nàng Tiên Tiên Mái Lúa
Đủ bốn mươi giống lúa ruộng
Đủ ba mươi giống lúa rấy
Phải đi, phải tới
Phải đến, phải xin
Hỡi mường dưới, mường trên
Chọn lấy người khéo miệng
Nói tiếng khôn tiếng lành
Binh mường
Hãy chọn nàng Dặt Cái Dành
Biết mẹo nói khôn
Khéo mồm nói phải
Lấy sọt bẩy
Quấy gánh tre
Đi không đếm ngày
Đến nhà tiên xin giống lúa"
Đầu hôm
Nàng Dặt Cái Dành
Lên đến mặt trăng
Sang ra
Luồn qua mặt trời
Lên đến đất mường Trời
Đến nhà nàng Ả - Tiên Tiên Mái Lúa
Men theo ruộng của
Qua thửa ruộng nhà
Qua bờ ao, bờ giếng
Vào đến rào đến dậu
Có chậu nước trong
Múc nước rửa chân
Bước lên thang
Vào trong gian nhà giữa
Nàng Tiên Tiên Mái Lúa
Dậy, đi rửa mặt sớm mai
Rửa tay buổi sáng
Ngó ra cửa số
Ngó xuống cửa thang
Thây người chít khăn
Thấy nàng mang giỏ
Ngó kỳ mặt mày
Nhận ra nàng Dặt Cái Dành
-
"Ớ Dặt Cái Dành
Em đến chơi hay có công có việc ?"
Dặt Cái Dành rằng:
- "Kêu chị, chị à
Gọi chị, chị ơi
Em chẳng đến chơi
Em đâu đến nhởi
Vì Lang Cun Cần nhà em
Làm Cun chưa sang
Em lên xin cơm
Để nhà lang ăn no
Em lên xin lúa
Để nhà lang làm nên"
Nàng Tiên Mái Lúa
Đưa thóc giống ra cho Dạt Cái Dành xem
Lúa củ lúa vàng
Lúa sang lúa dé
Lúa ghé nếp nghè
Nếp trứng khe, chăm ốc
Đầu gối nếp Củ ong
Dặt Cái Dành xin đủ giống tốt mang về
Về tới nơi Đồng chì tam quan kẻ Chợ.
Nửa đêm vào tâu
Sáng ra vào hầu:
- "Thưa lang
Tôi đã lấy được giống lúa
Mang đủ về cho lang".
Lang Cun Cần trả lời:
"Mường ơi!
Lúa này ta ăn hãy hết
Phải để làm giống
Lang Cun Cần đánh trống đánh cồng
Gọi mường nước đi chặt cọc đắp phai
Chặt cây đắp mương
Đắp thành bờ cả
Vỡ nên bờ mương
Đưa nước lên nguồn
Về khắp đồng cao, đông thấp
Tháng bảy mài mại cây lúa non
Tháng tám lúa chửa đòng đòng
Tháng chín lúa trổ
Tháng mười lúa chín đỏ
Rực rỡ đầy đồng đầy nương
Bông cái bằng đuôi chó
Bông nhỏ bằng đuôi mèo
Gánh về xếp đống đầy nhà
Lúa nếp ở xùm xòa
Lúa tẻ đầy ba gian nhà chái
Phơi nắng phải ba mươi ngày
Ban đêm phơi gác bếp
Xếp thóc đã nỏ
Bỏ vào cối xay
Quay đi ra rá
Trả lại rào rào
Vào nhà lấy sàng lấy nia
Sảy lia đi, lia lại
Đem bỏ vào cối đá
Lấy chày cây vả
Giã xuống giã lên
Sảy lượt thêm
Xem gạo trắng
Gạo như hột nắng
Trắng như hoa cau
Lang Cun Cần mừng mừng lắm lắm
Đây thật là của ăn sống người
Của vui trăm nghìn họ
Lúa nên trồng ruộng cả
Mạ nên trồng ruộng con
Truyền khắp bản mường
Cày cấy từ nay theo mùa theo vụ
Cất giữ lấy ruộng lúa củ (lúa nếp)
Cất giữ lấy giống lúa chăm (lúa tẻ)
Ăn cơm quanh năm phải nhớ
Nhớ công Dặt Cái Dành.
Từ đó
Lang Cun Cần làm lang đã giàu đã có
Lúa gạo đầy nhà
Con người từ đây trở nên người biết lo biết nghĩ
Đời trước để lại đời sau
Chuyện này chuyển sang hồi khác.`, muong: `XIII. XÍM CỎM XÍM LÓ
Lang chưa cò cơm tể mấn ro
Chưa cò loó tể mấn khang,
Nhá lang phải rõ mú Da Dấn
Quảc choóng ti táo củ
Cho nhá lang cò ăn
Tẻng riêng pán cơm trêng lùm lùm
Mú rá rắp lập cập ti táo củ
Cồ mú lú khú ti táo giaáng
Trốc xắc nhơ vunh
Xăng moónh têng lơới,
Táo củ chăng pẻ rổi trốc
Dỏc xau chăng pốc rồi tam.
Rảc mặt nhào tấy vằn
Cò con chuột dấm ở troong ôồng tang.
Măng xiêng nhám khừa rù
Măng xiềng lu khừa tốn
Chuột mời poi:
- "Riêng nó mú chăng ăn cơm
Lày tảy chớm nơm mà nhám?
Rá Rảp lày veé:
- "Mú chăng tau lưng, phưng cooc
Mà là lo doỏc pừa hôm, pừa khờm cho nhá Lang Cun Cấn
Chuột dấm pảo:
- "Cò phải nhá Lang Cun Cấn
Cón tòi ăn khò ở
Chưa cò cơm mấn ro
Chưa cò ló mấn rêng
Mướng tìn mướng trêng
Nhá lang cón nghéo, cón khò.
Chưa phui táng ở
Chưa mệch, chưa mờ táng ăn.
Mú trắng,
Xôn vée cho mà mấn rêng.
Cảc cô mú poi:
- "Chuột ới, chuột à,
Dâu páy têu hay têu hơm
Ho chơm xiêng trắng
Dâu páy púng cò cơm, mách phúng chơm ceeng
Ho ngheng xai chíu
Chuột dấm lày veé:
- "Cảc cồ mú à,
Ơ tốn Náng Á, náng Úch
Cò náng Tiên Tiên Mài Loó
Cón xứa pồn mươi tỏng loó ná
Pa mươi nói loo roong,
Tôi chăng khế tồi
Nhá lang cho moón lêng mà cườn, mấn rêng.
Trới tràng pung hung
Cảc cồ mú ta pao hấu nhá Lang Cun Cấn:
- "Lang ới, Lang à,
Mộch tôi pao thung táo củ
Tốn ổ chuột dấm, chuột váng troong ồng lào
Chuột mắt khề mắt veé
Ré pảo vên poi nhá lang
Ti lêng nhá náng Úch, vua Tiên
Náng Tiến, Tiên Mài Loó
Cườn lế nói loó ná, loó roóng mấn rêng,
Vang vến mấn nói
Chói vến mấn trùa.
Loóng Lang Cun Cấn tà phay
Xay Lang Cun Cấn tà chíu
Chắn quải xa mướng
Từng rố chu chương khừa lùng:
- "Binh ơi, mướng à,
Pọt trêng nhá náng Tiên Tiên Mài Loo
Cò pồn mươi nói loó ná
Pa mươi tỏng loó roóng
Ha phải xeo lêng tềng
Phải cườn cho àn
Hỡi chu chương mướng rác.
Chón lễ từa khèo méng
Vée xiềng khôn xiềng léeng.
Pảo náng Dặt Cày Déng léng con khôn cày khèo
Mắt méeo khể khôn
Khèo mốm vée phải.
Lế pới pảy pảy
Phảy triêng pheo pheo
Ti chăng tềm ngáy
Tổ lêng nhá tiên cườn nói cơm cào.
Trốc hôm
Náng Dặt Cày Déng
Lêng chun mặt khàng,
Tràng xa
Luổng qua mặt trới,
Lêng tếng tất mướng trới
Tềng nhá náng Ả, Tiến Tiên Mài Loó
Rắp reng trưa mổ
Qua cửa trưa nhá
Men xa nầm chiềng
Riềng riiếng nầm ao,
Pao ráo, pao rấu
Cò chấu rác troong
Vúc rảo chao chó
Pước lêng man
Pao gian nhá khừa.
Náng Tiến Tiên Mài Loó
Dấn, ti xửa mặt khờm dao
Xửa xay pơn tràng,
Ngooc xa cừa voòng
Hoòng xuồng cửa man,
Kỉa moón pỉt khăn,
Kỉa náng vang ởp
Ngò xật mặt máy
Páy xa là náng Dặt,
Mời poi:
- "Náng Dặt Cày Déng ới,
Un tềng nhởi, tếng côông chi, pua chi?
Dặt Cày Déng rắng:
- 'Tốố ới, ới à,
Hốc náng náng ới,
Ùn chăng tềnh nhởi
Ùn nó tềnh roong
Pởi Lang Cun Cấn nhá ùn
Mấn cun chưa khang
Mẫn lang chưa cháu, chưa cò.
Ùn lêng cườn cơm
Tể nhá lang ăn ro,
Ùn cườn côống loó
Tể nhá lang mấn rêng
Náng Tiến Tiên Mài Loó
Tưa nói loó xa cho náng Dặt hầu
Loó củ, loó váng
Loó khang loó rè,
Củ khe, rểp nghé
Trờng khe, chăm ốc
Trốc mùa là loó rểp oong
Dặt Cày Déng cườn hết nói xốch, loó váng
Vang vến cho tôống chí tam quan kẻ chớ.
Khừa têm pao tâu
Tràng xa pao hấu
- "Thưa lang
Tôi tà lê àn nói loó
Vang cả vến cho lang,
Lang Cun Cấn mời rắng:
- "Chu chương mướng rác ới,
Loó ní ha ăn hay hết,
Phải xếp ti tể mấn má àn lô.
Lang Cun Cấn cho tèng trôồng, tèng côống
Rô chu chương ti xa tắp pai, chạch coọc
Cổn cân tắp mương
Giăng thánh nấm cả
Trở rênh nấm mương
Tưa rảc tốn phăm phăm
Vến tôống cao, ná rôộc.
Khàng pảy, mài mái cân lóc ròng
Khàng xàm loó chứa dón
Khàng chìn loó trổ
Khàng mưới loó chìn tỏ
Chờ chờ roóng trưa.
Poông cài phắng tuôi cày chò
Poông con pẳng tuôi cày méo,
Triêng vến xếp treo tấy tuún.
Loó rểp tôồng chùn ùn,
Loó chăm chờn ờn pa gian
Tái cho khanh phải pa mươi ngáy
Pơn hôm tải rưứa
Loó nhắp tà moòng
Tạp troong rôồng chìn cang,
Tráng loó pao xay ì ì
Lễ rôồng cùm, dấn kháng
Kháng lia ti lia lái,
Tom pao cổn phuú máy
Lê kháy cân vả
Chả xuồng, chuống lêng
Mấn rạch lượt trêng
Choi nghiêng cào trắng
Ốc cào nhơ pôông rằng
Phẳng phẳng nhơ cày pôông nang
Lang Cun Cấn mớng rờ rờ
Ní xật là của ăn khôồng trùa
Của doóc nghỉ léng lắng
Nói loó ní rêng trôông, rêng hài
Rêng trôông roóng cả
Rêng cần trưa con.
Chiiến khắp chu chương mướng rác
Cấn, cần pở ní xeo năm, xeo múa,
Chín lế nói loó củ
Xù mửa nói loó chăm.
Ăn còng queng năm phải nhờ,
Nhờ côông náng Dặt Cày Déng léng con khôn cày khèo.
Pở rì,
Lang Cun Cấn mấn lang tà cháu, tà cò
Loó, cào chừa ừa tấy tún, tấy nhá,
Con moón pở ní, trở rêng mắt lo, ró nghì.`, context: "Thời kỳ thuần hóa động thực vật phục vụ canh tác nông nghiệp. Người dân biết gieo trồng hạt lúa nương dẻo thơm, nuôi trâu cày ruộng, lợn gà đầy chuồng." },
  { id: 14, name: "Tìm rượu", epoch: 2, kinh: `XIV. ĐẺ RƯỢU CẦN
Kể chuyện mà nghe
Nói vè mà biết
Ngày xưa
Khi vua Dịt Dàng
Ra làm cun kẻ sang
Ra làm lang kẻ khó
Có nợ với cun Sâm, đạo Sóc
Cun Ngọc, đạo Khoang
Họ đều là người nhà trời
Vua Dịt Dàng sai Khao Che, Khao Chót đi đòi nợ
Cun Sâm, đạo Sóc rắng:
- "Ta không nợ với Dịt Dàng nhà anh!'"
Khao Che, Khao Chót nối nóng bừng bừng
Chạy xuống bắt trâu, bắt bò
Cầm sanh, cầm cháo
Cun Sâm, đạo Sóc xông ra đánh Khao Che
Xông ra đè Khao Chót
Khao Che, Khao Chót nói rằng:
- "Mường này có góc đánh chuột
Mường ta cũng có góc đánh chuột
Mường này có thói đánh người
Mường ta cũng có thói đánh người
Khao Che, Khao Chót quay về
Một đêm đi mau
Năm đêm nhanh bước
Bảy đêm đến đất mường
Vào chầu vua Dịt Dàng
Vua Dịt Dàng nối tức
Dậy đánh ba hồi chiêng năm
Quân hầu vào đầy sân
Quân lính vào đầy nhà
Người trẻ, người già
Ngồi đầy ba trăm chiếu
Quân hầu rằng:
- "Bực gì mà đánh chiêng ngài hỡi
Bực gì mà động hết binh mường?"
Vua Dịt Dàng rằng:
- "Tôi cho Khao Che, Khao Chót đi đòi nợ
Cun Sâm, đạo Sóc đánh Khao Che ba mươi đòn
Đánh Khao Chót ba mươi roi
Nó gửi tôi thêm ba mươi roi nữa
Quân ta đến đây đã đông
Ai không có cơm, vò lúa, giã gạo
Ai không có cá, tát đầm, tháo ao
Không có gươm, phải đánh gươm cho dài
Không có dao, phải đánh dao cho sáng
Một chiếc nỏ, ba cái kèn
Một nhà ba trăm tên hong khói
Ngày mai, ta đem quân đi đánh giặc!"
Sáng dậy
Vua đánh ba hồi trống cái
Đánh ba hồi trống con
Hết chấu, Vá ''' binh mường
Hái hoa rắc lên đường đi
Đi một đêm nhanh nhanh
Đi năm đêm đài dài
Đi bấy đêm đến đất Cun Sâm, đạo Sóc
Đóng đồn, cắm trại
Cho người chạy giấy vào trong
Cun Sâm nghiêng đầu dọc
Đạo Sóc ngoảnh cổ nhìn
Thấy chữ đen đen giống khói mây trút
Thấy chữ lút chút giống khói mây đen
Dịt Dàng đánh người hay đánh ta
Đánh người nó đi qua
Hay đánh ta thật người hỡi
Cun Sâm, đạo Sóc lên gác
Đánh ba hồi chuông
Chấu, vá, binh mường đủ mặt
Người người kéo đến đã đông
Cun Sâm răng:
- "Vua Dịt Dàng chuyển tờ vào
Mường này có nơi đánh chuột
Mường ta cũng có nơi đánh chuột
Mường này có lối đánh bầu bạn
Mường ta cũng có lối đánh bầu bạn".
Vua Dịt Dàng dàn quân ra đồi bái
Cun Sâm, đạo Sóc dàn quân ba trái đồi
Thằng nào chạy thì bắn
Đứa nào sợ thì chém
Tên bắn vào vù vù
Tên bắn ra phập phập
Máu chảy như miệng mương, miệng phai
Quân Dịt Dàng đánh được
Cun Sâm, đạo Sóc đánh thua.
Dịt Dàng đưa quân vễ
Đến ngã ba
Gặp nàng Lò Ô, Liệng Lệng
Đang chăn trâu cạnh gò
Dịt Dàng bắt lấy đưa về cho chăn trâu bò
Chăn từ mường dưới đất chăn lên
Chăn từ mường trên trời chăn xuống
Phải ngày Cun Sâm, đạo Sóc
Sắm cổ cúng hồn, cúng vía
Ân uống suốt ba tháng
Vui chơi sáng đêm hết ngày
Lò Ô, Liệng Lệng vào chờ hồn khóc vía
Nó cho uống một gáo rượu ngon
Lò Ô, Liệng Lệng say
Xuống đồng mò cua, mò ốc
Cua, ốc dạy rắng:
- "Lấy lúa phơi nắng, phơi khô
Lên đồi lấy rễ mật cú (')
Lên đồi lấy da cây mun (2)
Đây gia men (3 là xà can (4)
Lấy cỏ gia lộng ()
Xuống dốc lấy cỏ rậm rì rậm rạch (6)
Cỏ cách dạ hơn (?
Cây đờn (8) đen chân đen tay
Đem về giã ra làm bột
Giã ra làm bánh
Nặn lại xếp vào rổ
Nhắc vào đống ổ rơm
Được ba đêm đem ra hơ khói
Được men tốt, men lành
Đón bà Dịt vào làm
Đón bà Dành vào trộn
Rắc men như rắc muối rắc ớt
Ủ rượu vào ổ lá vo
Lấy nước mưa đổ vào
Rươu ngấm từng vòng
Rượu trong nước ngọt
Rượu đắng dễ nuốt
Rượu ngọt giống mật con ong
Mời Vua uống một gáo
Bảy gáo Dịt Dàng say
Dậy lấy nỏ ra giết
Dậy lây nỏ đê băn
Lò Ô Liệng Lệng mau chân
Chạy xuống khe lấy một nắm ốc
Chạy xuống rộc lấy một nắm ốc
Đem về dạ rượu cho vua
Dịt Dàng ra làm Lang Kẻ Chợ
Nuôi gà đã có người giã tấm
Chăn vịt đã có đứa sửa bu
Nuôi trâu đã có cột có chuồng
Vịt ngan đã có người chăn chiếm
Có người bầy cơm làm rượu.`, muong: `XIV. TẺE RÁC TOÒNG
Poọc chiiến mà trắng
Poọc răng nửa lày phui,
Ngáy hơ,
Khi vua Dịt Dáng
Xa mần cun kẻ khang
Mấn lang kẻ khò
Cò nớ côống cun Sâm, táo Sỏc
Cun ngoọc, táo Khoang
Máng tếu là moón nhà ôông mua Trới,
Vua Dịt Dáng khai Khao Chee, Khao Choỏt tì mỏt nớ,
Cun Sâm, táo Sóc răng:
- "Ho chăng nớ chi côống chi Dịt Dáng nhá pay,
Khao Chee, Khao Choỏt rỏi dừ pớn chớn
Chắn xuồng phêng pắt pó, gió tru
Pắt xeeng khu, chảo pơơng.
Cun Sâm, Táo soỏc xông xa tành Khao Chee
Mắm hé tành Khao Choỏt.
Khao chee, Khao choỏt veé rắng:
- "Mướng ní cò nhói tành chuột,
Mướng ha cò duộc tành chuột,
Mướng ní cò thòi tánh moón
Mướng ta cò duộc tành moón.
Khao Chee, Khao Choỏt trở pài lái nhá
Mộch têm ti qua
Răm pa têm ti truột
Pày têm buột tất tôống chí tam quan kẻ chớ.
Pao chấu vua Dịt Dáng, côống Lang Cun Cân.
Vua Dịt Dáng rồi dừ pấn chấn
Dấn tèng pa hối côống răm
Quân hấu pao tấy phêng
Quân lình pao tấy nhá
Con rét, ôông rá
Ngối tránh pa gian chiều
Quân hấu rằng:
- "Dừ chi mà tèng côông ngái hỡi?
Puốn chi mà dôống hết binh mướng?
Vua Dịt Dáng pảo veé:
- Tôi cho Khao Chee, Khao Choỏt ti tói nớ
Cun Sâm, táo Sooc tành Khao Chee pa mươi roi,
Tành Khao Choỏt pa mươi tón,
Phèe cởi tôi xêm pa mươi héo nữa,
Quân ha tềnh ní ngập trùa
Ay chăng cò cơm, tạp loó, tấm cào
Ay chăng cò cà, xảt tấm, trổ ao
Chăng cò tao, cò gươm, phải rén tao, gươm cho dán,
Mộch cày nà, pa cày kén
Mộch nhá pa trăm đán chằng khòi.
Pich moỏc ngáy dao ha ti tèng giặc.
Trang poro,
Vua tèng pa hối trôồng cài
Đành kéo chu trở lại Cầu Rồng, Cầu Nóc (9
Đến đất Đồng chì tam quan kẻ Chợ
Lúc ấy
Cun Tổi, Cun Tàng, Lang Cun Khương
Phải làm tờ nộp gổ
Phải làm sổ nộp chu
Tờ nộp nhà vua thu, nhà vua nhận
Nhà vua thưởng công
Cun Tôi năm trăm nén vàng
Cun Tàng năm trăm nén bạc
Dịt Dáng pắt lễ cho vến iềng tru, chiềm pó
lềnh pở mướng tìn tất iềng lêng
lềnh pở mướng trêng trới iềng xuồng.
Phải ngáy Cun Sâm, táo Soỏc
Phẳm vâm ráo lởi hốn, mấn vài
Ăn còng tủa chìn mươi ngáy,
Phui phay tràng têm, cán răng.
Lò ò, Liềng iềng pao tới hốn nhám vài
Phè cho òong mộch mốc ráo ngon
Lò ò, Liềng iềng phay
Xuồng tôống pắt cua, pắt ổc
Ốc, cua rắng là:
- "Lế loó tải rằng cho khanh
Lêênh tôn lễ ngay rè cân mật cù,
Lêênh rù lẽ ta cân mun
Lế rái ta men, là xả cán,
Lễ cỏ lá lốông
Xuồng rộộc lày lế cỏ rậm rí rấm rạch
Cỏ pảch tá hơnh
Cân tờnh dấm chó, dấm xay
Dom vến tấm tấm rối po lay mấn uôi mà lắt.
Tấm tầm tật mấn pèng
Lay hón tẻng pao tan
Xun xan ổ xooc
Ngoỏc pa têm doong xa hoòng khòi,
Dòi dói men xổch, men léng
Rốc mú Dịt pao mấn
Tòn mú Déng pao chôốn,
Pốn men nhơ pốn ởt, vòi
Tá ráo pao ổ là vo
Tên rảc mưa dằm dé
Ráo ngắm nghé voòng voóng,
Ráo troong rảc ngọch
Ráo tằng lời rọch
Ráo ngọch nhỏ mệch oong.
Mới vua ôông òong rềm
Pảy mốc, Dịt Dáng khay
Dấn lế nà xa pỏ
Lế nỏ xa pành
Lò Ò, Liềng lềng triền chó
Chẵn xa rôộc cảch là cỏ,
Moó lế năắm ổe vén
Dom vến luộc mấn cỏ dàng ráo cho vua,
Dịt Dáng xa mẫn lang kẻ chớ
Ruôi kha tà cò moón tấm rạch
Ruôi vịt tà cò từa tanh phu,
Ruôi tru tà cò rán, cò noòng
Vịt ngan tà cò moón ti iềng
Cò moón pắc viêng mấn ráo mấn ăn...`, context: "Sự ra đời của rượu cần - đồ uống nghi lễ thiêng liêng thể hiện lòng chân thành hiếu khách, sự gắn kết keo sơn của đồng bào quanh bếp lửa sàn." },
  { id: 15, name: "Lang Cun Cần lấy vợ...", epoch: 3, kinh: `XV. LANG CUN CẦN LẤY VỢ
Chưa có vợ nằm nhà
Chưa có bà sắm cơm, trộn rượu
Chưa có người tiếp khách trong binh, trong mường
Lang Cun Cần ra nằm ấp cửa sổ chái
Mắt trông ra ruộng
Ngó xuông bền nước
Thấy nàng Vạ Hai Chiếng ("
Đứng dựa bờ giếng gội đầu
Thấy ở mặt nước sâu
Trái tóc xanh mườn mượt
Thấy vượt trước ngực
Đôi gò vú tròn tròn
Thấy khuôn mặt non non
Thây con mắt đang cười với nước
Lang Cun Cần muốn được chăm sóc
Con người thắt đáy lưng ong
Đẹp người, khôn ngoan, có dáng
Trâu khôn không để sổng
Gái đẹp không để đi khỏi nhà
Lang Cun Cần muốn dòm Vạ Hai Chiếng
Rắp ranh lây em gái mình
Thế rồi Lang Cun Cần hội chu chương mường nước
Liền cho đứa hầu đi hò
Cho sa đi rao
Mời người đến để hội chu chương mường nước
Đầu sáng
Đàng dưới kéo lên
Đàng trên kéo xuống
Người đi kín ruộng kín bờ
Chật đường chật sá
Vào chật nhà kín cửa
Dân mường hỏi: "Lang hỡi!
Trầu nhà lang ngã vào núi đá
Bò nhà lang sập rãnh
Hay là trâu vắng chuồng
Nai phá nương
Mà nhà lang phải gọi chu chương
Mà nhà lang phải hội mường hội nước".
Lang Cun Cần vội nói:
- "Sân nhà lang chưa có người nuôi lợn nuôi gà
Trên nhà chưa có người chải mền dăng chiếu
Chưa có ai rót rượu mời khách
Chưa có ai coi gọi nuôi binh
Làm nhà cun chưa sang
Làm ông lang chưa giàu có
Lang muốn lấy nàng Vạ Hai Chiếng
Về làm duyên làm bạn
Sằm nên vợ nên chồng
Xin hỏi chu chương
Có nên không hỡi mường hỡi nước?
Lúc ấy
Chu chương mường nước
Kẻ trước người sau
Đều thưa một câu
Cùng nói một tiếng
- "Lang à
Lang Cun Cần với Vạ Hai Chiếng
Sinh chung một cha
Ra cùng một cửa
Gọi vợ gọi chồng sao nên hở lang
Lang còn yêu nàng em ruột
Thì chu chương mường nước
Làng trước, làng sau
Làng đầu làng cuối
Buổi chiều sẽ thôi đi chăn trâu
Buổi sáng sẽ thôi đi cày đồng sâu ruộng cạn
Bỏ nuôi gà, nuôi lợn
Không quét dọn cửa nhà
Không ra, không vào
Không lên, không xuống"
Lang Cun Cần nghe lời nói suông
Nghe tiếng đồn lên
Thấy gió lật chiếu
Thấy lòng yêu lảo đảo
Cơn bực lên dồn dồn
Cơn giận lên bừng bừng
Lang Cun Cần vẫn muốn lấy Vạ Hai Chiếng
Lang Cun Cần đi hỏi vua Pồn
Thần của suy nghĩ
Đi hỏi vua Châu Chấu
Thần thu xếp lo phiền
Vua Pồn, vua Châu Chấu là cha con
Hai cha con ra hỏi:
-
"Ới ! Lang Cun Cần!
Có việc gì mà đến sớm thế?"
Lang Cun Cần rằng:
- "Lạy vua
Nhà con, ở dưới sân chưa có ai nuôi gà vịt
Trên nhà, chưa có ai trải mền, dăng chiếu
Chưa có ai rót rượu mời khách
Chưa có ai giã gạo nuôi binh, nuôi mường
Con muốn lấy em gái là nàng Vạ Hai Chiếng
Về làm duyên làm bạn
Sắm nên vợ nên chồng
Có nên không
Hỡi hai ông vua lo vua lắng ?"
Hai vua trả lời:
- "Con muốn lấy Vạ Hai Chiếng
Đầu tháng phải xuống ăn cơm với lợn
Cuối tháng phải xuống uống nước với gà
Phải làm như vậy liền ba năm bảy tháng
Mới sống nên thân
Mới làm nên nghiệp"
Lang Cun Cần trở về lấy Vạ Hai Chiếng
Nhưng đầu tháng không ăn cơm với lợn
Cuối tháng không uống nước với gà
Vua trời ngồi trên sập ngai son
Vua con ngôi trên sập ngai bạc
Ngó xuống Lang Cun Cần
Vua dành bấm bụng
Sai cun Sấm xuống hét
Sai nàng Sét xuống đánh
Đánh chết Lang Cun Cần
Hai người ra đi
Đi rì rì đến bờ sông Tùng
Nàng Sét hơ hớ đi trước
Cun Sâm bước chân đi sau
Thấy đùi nàng Sét trắng phau
Mắt cun Sấm dán chặt vào bẹn
Nghe lòng ao ước
Nghe dạ xốn xang
Muốn cầm đùi trắng phau phau
Muốn được con người trăng trắng
Nàng Sét chưa lắng đã biết
Nàng Sét chưa thấy đã hay
Bèn tìm lời khéo khéo
- "Hỡi chàng Sấm à!
Lòng trâu thế nào
Lòng bò thế ây
Tôi không đánh Lang Cun Cần nữa
Chỉ đánh nhác, đánh lười
Vào chồi cây gạo
Vào áo cây vông"
Hai người một ý
Chung lẽ chung lời
Nhưng rồi
Vì Lang Cun Cần lấy em gái
Trời nổi cơn giận dữ
Cử cơn bão cơn giông
Ông phải trốn vào rú
Ở rừng ở rú đẻ ra con giun
Ở nước đen đẻ ra con chạng kha
Trong cửa trong nhà
Đẻ ra mười hai chàng ma ếm
Lũ ma ếm
Giữa mười hai bến nước
Ngăn bước mọi người
Bây giờ
Lang nước phải đi xem bói
Rắng:
- "Lang Cun Cần lấy Vạ Hai Chiếng
Lấy phải Cun Êm, chàng Ai
Là những thần chuyên làm điều xấu"
Thế nên
Người mường trên kéo tới
Người mường dưới kéo lên
Chật cứa, chật nhà lang
"Hỡi lang, lang hỡi"
Nếu lang còn lấy em gái
Thì chúng tôi chẳng chịu ở trong mường
Chúng tôi không chăn gà chăn lợn
Không đi đón trâu về chuồng
Chẳng đi cày đồng sâu, đồng trũng!"
Lúc ấy
Lang Cun Cần lo sợ
Mặt mày bơ phờ
Vội đưa nàng Hai Chiếng
Ra bỏ ngoài đồng
Bỏ vắng bỏ luôn
Trả lời buồn, lời đắng
Bỏ nàng quạnh vằng đến đời nay
Bấy giờ nhà lang lại đi mời ông mơ mường Ngòn
Mồm ông mơ hếch hếch
Tóc ông mơ ngôn ngộn trứng chây
Hàng búi trứng rận
Ông mơ bận cháu bận con
Đến đi làm mối cho tốt gốc tốt lòng
Làm mơ nòi, mơ dòng, mơ giống
Ông mơ mặc xống một dây
Mặc áo một đai, bó chặt
Nhà lang lên đổi cắt lá dong gốc
Xuống rộc cắt lá dong xanh
Gói bánh trưng vuông
Gói bánh tét tròn
Xuống sân bắt con gà vàng
Lên nhà ngâm ang gạo mới
Dọn mâm cơm nửa buổi
Mời ông mơ và đứa gái ngồi ăn
An no uống say
Ông mơ với tay gói trầu đi ăn đường
Lấy cau đi ăn sá
Trầuêm, trầu lá, ăn đi, ăn về
Rồi ông mơ chống gậy ra đi
Từ từ đi ra
Bước xuống bậc thang ngà
Đầu gối va lập cập
Bước xuống bậc thang gốc
Vấp ngã loạng choạng
Lưng cúi lọng khong
Đứa gái gánh quà theo sau
Đi cho mau ra bến
Đi cho đến đồng nhà
Đi cho qua đồng cửa
Ông mơ bước dài bước ngắn
L e n เ ลื่ น d e n h e t m u d n g v u a B i n h L a c
Đi thấy vào bờ giếng
Vòng liệng đường bờ ao
Vào đến rào đến dậu
Nghe gâu gâu chó sủa
Chó sủa chó cắn
Đàn chó lồng lộn chạy ra
Lúc ấy
Con gái nhà ông Binh Lạc
Chạy ra cống ngó trông
Chạy vào nhà mách bố
Vừa thở vừa mách mẹ ở trên sập nhà:
- "Có khách đường xa bô à!
Có khách đến nhà mẹ ơi!"
Ông vua Binh Lạc nói:
- "Khách đến chơi sao con không mời vào
Khách đến nhà sao con không đón
Con mách với bố với mẹ làm gì?"
Được lời nàng chạy trở ra
Chào khách mường xa đến cửa
Ong mơ rửa chân dội nước
Nước xôi tay sạch qua
Cùng đứa gái bước lên nhà
Ngôi gian mở cửa sổ bên trái
Rồi, nàng Vậm Đầu Đất lấy chiếu ra trải
Mời qua mời lại thấy ông mơ ngồi
Cùng mời bạn gái ngồi lên
Têm trầu bưng ra ăn chơi
Rót bát nước đầy mời khách uống
Ở trong gian nhà giữa
Vua Binh Lạc đang thay xống
Lủng củng thay áo bông vàng
Mới bước ra chào ông khách lạ
Ra ngồi tiếp bữa tiếp ngày
Mới thưa mới hỏi:
- "Ông ơi, ông à!
Ông ở mường xa, mường gần
Hay ở mường ngàn mường ngái
Ông tới mượn trâu sao không có chạc?
Ông tới mượn mác sao không có rong?
Ong tới mượn choòng sao không đem cán?
Ông tới mượn ván sao không có thừng?
Hay ông muốn hỏi điều gì?"
Ong mơ trả lời:
_
"Thưa ông
Tôi ở mường đất xa
Quá đất mường Tà mường Quạ
Tôi không đi mượn trâu mà đem chạc
Chẳng mượn mác mà đem rong
Không đi mượn choòng mà đem theo cán
Không mượn gỗ ván mà đem thừng
Mà tôi đi mang tin mừng
Mừng thật thà
Nghe nói nhà ta có nàng Vậm Đầu Đất
Thật nết lành người
Lang Cun Cần mường tôi
Muốn cho trâu ăn chung một bãi cỏ
Muốn cho bò uống chung một dòng suối
Muốn cho bố mẹ già ngồi chung một cửa sổ
Muốn uống rượu chung cần
Muốn xa nên gần
Muốn nên dâu nên da
Muốn làm cửa làm nhà
Muốn lấy nàng nhà ta làm bà lang
Có nên không ông vua hỡi?"
Ông vua Binh Lạc vuốt râu mới nói:
- "Ông à,
Muốn lấy con gái tôi làm bà nhà lang
Nhưng con Vậm Đầu Đất còn nhỏ lằm lắm
Càng ngắm càng thấy nhỏ nhiều nhiều
Đi củi một chiều chưa nên vác
Đi nước xuồng còn vơi
Đi chơi còn quên xống áo
Thấy mẹ còn đòi bú
Thấy chú còn vòi quà".
Rồi ông mơ vội thưa qua:
- "Ông à
Chồng nhỏ thì đi chăn trâu
Dâu nhỏ thì giữ em giữ cháu
Hỏi năm nay, năm sau mới cưới"
Vua Binh Lạc lại nói ra:
- "Chưa nên ông mơ ơi
Chưa được ông mơ à
Trâu nhà có họ


Bò nhà có chuồng
Còn phải đi gọi bác
Còn phải đi gọi chú
Để lo bàn chuyện này mới được"
Ông bác đã vào cửa trước
Bà cô đã vào cửa sau
Tiêng nói lao xao
Tiếng chào rộn rộn
Ông Binh Lạc đứng lên rón rón
Bước ra đón chào
Trao tiếng mở lời:
- "Cô ơi, bác ơi!
Con Vậm Đầu Đất nhà ta
Có tiếng đồn xa chín bản
Có tiếng đôn xa mười mường
Ông Lang Cun Cần muốn thương
Đem lòng muốn mến
Hôm nay cho ông mơ đến
Xin được chuyện được lời
Xin được nơi đi lại
Bác nghe phải cứ nói
Cô thấy trái nên thưa
Cho vừa lòng người ta
Cho đẹp ý họ hàng"
Rồi nhà ngoại nghe lòng vui ra
Cô nghe dạ vui vào
Nhưng còn muốn bày lời cao xa
Nói ra ý thách của cải
Rằng "Con gái nhà ta còn dại
Ngắm nó còn bé
Ai ngấp nghé để đi làm bà
Ta gả đi làm dâu làm con
Nhưng phải có trâu đực
Có bò mộng
Có rượu mật
Có tiền lát nhà
Trả công bố mẹ đẻ ra nuôi dạy
Mang đến nồi nấu rượu
Mười hai con trâu bạc đủi
Mười bảy con bò bạc lưng
Là của nuôi tập nói
Là của hỏi cậu, hỏi ngoại đường xa
Có khiêng bánh khiêng cơm thịt gà mở cổng
Có con dao cán bạc mở khiêng
Khăn trắng tinh cho đứa đi khiêng đi gánh
Có bánh, có váy áo cho đứa phù dâu
Có tiền cho đứa theo hầu vác chiếu
Nếu thiếu một món chẳng cho".
Th là bg ng n gn mn ting
-"Đòi chi đòi lăm mơi
Lời chi lời lắm thế
Để con gái nhà ta chết rũ trong nhà
Chết già trong mường
Nghe thương con lắm lắm
Của con gái là của quả mơ chua leo leo
Đòi nhiều được ít
Nghe ra chuyện con nít thì đừng sang
Nghe ra chuyện ông già thì mời đến"
Lúc đó
Ông mơ đứng lên gửi tiếng
Ông mơ gửi chuyện thưa lời:
- "Của cũng không bằng người
Lời cũng không bằng nghĩa
Vía cũng không bằng tình
Vậy xin có đủ mọi thứ đã thách
Thách thứ gì tôi xin sắm không thiếu
Chẳng dám sắm méo sắm vênh thứ chi
Xin ngoại để tôi về
Tâu qua tâu lại với Lang Cun Cần".
Ngày hôm sau
Lang Cun Cần hội dân mường
Nói rằng của phải lo
Trâu bò phải sắm đủ
Xuống sân mổ đực lợn lang
Lên nhà nấu khoang rượu nóng
Chú bác hô nhau đến uống
Một bữa no say
Có em gái bưng trầu
Có bà già kéo nhau đi rước
Bước lên mường nhà ngoại
Phải có gói trầu dọn cửa
Phải sửa khiêng cơn ở đường
Mới được đi vào trong sân rộng
Sáng ra
Hôm nay ngày tốt
Nhà ông bà ngoại
Có lòng rộng lòng thương
Cho nàng Vậm Đâu Đât đi làm dâu
Làm cái làm con
Mang theo mười khiêng đệm ngồi
Chín khiêng gối dựa
Chín màn đôi
Chín khiêng chăn bằng lụa
Chín chục gối con ong
Quần áo chiêng cồng
Gánh đến nhà Lang Cun Cần
Cho nên chồng nên vợ
Nhưng năm qua tháng qua
Nàng Vậm Đầu Đất vẫn vóc võ mình ròn
Chân vẫn son son
Nhìn cửa lòng nghe chua chua
Ngó nhà lòng nghe xót xót
Nhưng Lang Cun Cần
Thâu đêm gối đầu bằng tay
Ban ngày gối đầu bằng áo
Vi nàng Vậm Đâu Đất khi ngủ
Mồ hôi vã ra như sương
Khi ở nhà ngoài thì da như bạc
Khi về nhà lang thì da như chì
Dạy lợn thì mắng lợn là ma
Chăn gà thì chửi gà chết xác
Sao con hùm không đến vác
Con gâu không về mà tha
Nên Lang Cun Cần
Ngày lành còn thấy nàng khá
Ngày giận thấy má nàng thâm thâm
Lúc trời lâm râm muốn bỏ
Khi trời gió gió muốn buông
Trời nắng nghĩ thân mà thương
Trời sương nghĩ thân mà tủi
Lang Cun Cần lại hội dân mường:
 - "Nghe có nàng Vật Đầu Nước
Đáng nên giá khác của ta
Đáng nên bè khác của lang
Xin mường hãy xét
Ngày qua tháng lại
Đã sắm đủ bạc vàng
Lang Cun Cần rước ông mơ sang
Đi chật đàng là con trai khiêng bánh
Nàng Vật Đầu Nước
Đứng xoã tóc bên gốc hoa trẩu
Ngồi vấn đầu bên cội hoa vông
Búi tóc vồng vòng cánh công cánh phượng
Nếp khăn lượn lượn nên vành mây xanh
Nàng bước lại dạo quanh
Hoa trẩu dệt trắng vành chân váy
Nàng thấy rầm rầm nghe lạ
Sao có người đi chật đường
Nàng vội dắt lược vào lưng
Vội kéo chùng thêm váy
Lúc ấy đã vang tiếng bố gọi
Đã nghe lời mẹ kêu:
  - "Ở đâu rồi hở con gái yêu
Ở nơi nào hở con gái út
Chẳng về nhà nấu nước
Để mời họ nhà lang
Têm trầu bổ cau bưng ra đón khách
Đừng để nhà ông trách
Chớ để ông lang phải buồn
Lấy phải vợ con là đứa xấu nết."
Nàng Vật Đầu Nước đã về làm vợ Lang Cun Cần
Nàng ở trọn chín tháng một rằm
Qua hai năm nửa tháng
Trông nắng, nắng không lên
Ngó đèn, đèn chẳng tỏ.
Mong gió, gió không về
Thả bè, bè không đến bến
Khều nến, nến không sáng
Mong có con mà không có con
Khi ấy
Nàng Vật Đâu Nước
Má không còn như cánh vông đỏ đỏ
Môi chẳng nên như cánh trầu đầu mùa
Một mình đi sớm về trưa
Lang Cun Cần nghĩ ngày lành tháng lạnh
Ngày vắng, tháng mật, tháng mỏi rời
Ban đêm gối đầu cánh tay
Ban ngày gối đầu lên xống lên áo
Uống rượu không nghe say
Ăn cơm ngủ ngày không ngon giấc
Lang nghe phiền trong ngực
Nghe tức trong lòng
Nhìn ra dòng sông nước trôi lặng lặng
Trông ra trời nắng mắt chói nheo nheo
Ngước lên trời nghe con mắt reo reo
Nhìn thấy nàng Ả Sao, Ả Sáng, Ả Rạng nhà ông Vua Trời
Miệng cười tươi như bông
Tóc xanh như mặt suối,
Dao sắc chẳng sánh nổi đuôi con mắt
Trắng sáng văng vặc
Không bằng một góc mắt nàng Sao
Lang Cun Cần nay ước
Lang Cun Cần nay ao
Ước làm sao lấy được con mắt ấy
Lang Cun Cần lại họp dân mường
Để sắm trâu to, bò mộng
Sắm trống, sắm chiêng
Quần đỏ, áo xanh
Để theo ông lang
Đi hỏi Ả Sao, Ả Sáng, Ả Rạng nhà Trời
Để về làm vợ


Chiêng đã nổi lên
Trống đã kêu lên
Nàng Ả Sao nghe thẹn trong lòng
Nhưng lại cứ vui ran trong bụng
Mền rộng trăm chiếc có đứa đi ở vác
Váy đẹp trăm đôi có người hầu khiêng
Gối xếp, gối mềm bỏ vào rương dát bạc
Người đi không
Lũ lũ qua sông
Dòng dòng lội suôi
Chiêng ba dóng núi đàng cuối
Chiêng bảy gọi thung đàng đầu
Ngựa chín hồng mao đưa Lang Cun Cần đi trước
Ngựa tốt ngựa đẹp Á Sao đi sau
Áo đẹp quần màu
Chen nhau nườm nượp
Lang Cun Cần
Lấy được Ả Sao, Ả Sáng, Ả Rạng nhà vua Trời
Mâm cơm buổi sáng chung nồi
Vò rượu chung cần chung uống
Đi lên đi xuống
Cũng kể vai kề người
Đi rong đi chơi
Cùng chung đường chung sá
Khi nàng Ả Sao ngồi may ngồi vá
Lang Cun Cần chót má yêu yêu
Lúc nàng ngồi dệt ngồi thêu
Lang Cun Cần ngắm yêu nhìn mến
Tối nàng ngả cánh tay mềm
Để cho lang làm gối
Buổi tối lấy cặp vú trắng ngà ngà
Làm bông làm hoa cho Lang Cun Cần hái
Lây má phải má trái
Cho Lang Cun Cần kề miệng kề môi
Nhưng hai mùa rét đã rồi
Mùa nắng sôi kéo đến
Nàng Ả Sao cũng hiếm
Nàng Á Sao cũng chẳng có con
Một hôm
Nghe đồn rằng:
Mụ già Rỏ biết lấy thuốc
Mụ già góá biết lấy cỏ có con
Nhà lang cho người đi tìm già Rỏ
Mụ già Rỏ đi lấy cỏ có con
Thế rồi
Có ngày sao vui, mây múa
Cành lá reo reo
Con chào mào hay hát
Mặt sáng đã thật
Nàng Vậm Đâu Đất đé được Cun loi
Nàng Vật Đầu Nước để được Cun Tàng
Nàng Ả Sao, Ả Sáng, Ả Rạng con vua Trời
Đẻ ra Lang Cun Khương
Ả gái nuôi trong mường
Đẻ ra chàng Toóng In`, muong: `XV. LANG CUN CẤN LẾ DU
Chưa cò mú du tẩy nhá
Chưa cò pá phẳm cơm, phẳm ráo
Chưa cò pá tòn khẻch troong binh troong mướng
Lang Cun Cấn xa tẩy ấp voòng cài
Hẩu xa trưa xa ná
Dóm xa pền hòn
Kỉa náng Va Hai Chiềng
Từng nấm chiềng cồn trốc
Kỉa ở mặt rác troong
Xắc xeeng dấm hìn hín
Kỉa pín trưởc ức
Trày ú cao trón trón,
Kía nàng mặt non nong
Kía ngón mặt cưới xươi mặt rác,
Lang Cun Cấn mònh àn
Còn moón lưng cong
Xốch poỏc chéo kéo, eo lưng va chèng chéng.
Tru khôn chăng tể cho ti khỏi pài
Con mài xổch chăng tể cho tí khỏi nhá,
Lang Cun Cấn mònh lế náng Va Hai Chiềng
Rắp riềng lế ún cài va.
Xí là,
Lang Cun Cấn hối chu chương mướng rác
Cho lấu hấu ti rô
Lấu pố ti rao
Tràng ngáy dao chu chương têng nhá lang cho kịp.
Róng tràng
Táng tìn kèo lêng
Táng trêng kèo xuồng
Moòn ti huôn huồn hiến hiến
Chật táng nghiêng khà
Pao chật nhá kìn cửa
Mướng rảc poi: "Lang hời,
Nhá lang lở pao tốn phuú
Hay tru pó nhá lang treẻ rèng?
Hay là tru quéng rán?
Rai khán roóng
Mà nhá lang phải rố chu chương?
Mà nhá lang phải hối mướng rảc?".
Lang Cun Cấn nói lới rắng xa:
- "Phêng nhá lang chưa cò moón ruôi cùn, chiềm kha
Trêng nhá chưa cò ôông ay trải mến, dên chiều,
Chưa cò ay rỏch ráo mới khẻch,
Chưa ay rẹch cào ruôi binh, chiềm mướng,
Mấn cun chưa khang
Mấn nhá lang chưa cháu, chưa cò,
Lang mònh lế náng Vá Hai Chiềng
Vến ở piêng ở pán
Phằm rêng chàu, rêng du,
Cườn ốống chu chương
Cò rêng chăng là mướng rảc à?
Lúc rì,
Chu chương mướng rảc
Keẻ trưởc, khá khau
Tếu thưa mộch câu
Tếu nhao nhao mộch lới xiềng khế:
- "Lang Cun Cấn ới,
Lang cốống Vá Hai Chiềng
Con cài tếu mộch chúm rọch
Tẻ tếu mộch pồ
Xa mộc lồ mà thôi,
Rố pá mái cài con no rêng, no àn.
Lang cón mònh náng ùn
Xì chu chương mướng rảc
Láng trước, láng khau,
Láng tấu, lùng cuôi
Pơn khuống, chẳng con ti bò tru.
Pơn khờm chẳng cón ay ti cắn trưa khu, trưa rà.
Pảc pà chẳng ay ruôi cùn, ruôi khá,
Chăng ay quét nhá, tón tún.
Nhá lang chắng ay mònh chún
Chắng ay mònh pao xa lêng xuông mẫn chi.
Lang Cun Cấn măng lới chi con xiềng rì
Măng lới tốn xuông, muồng lêng
Kỉa xò dên dang cày chiều
Kía lóng xim xiêu xào xáo,
Dư lêng tơn tơn
Cơn giân pờn chớn
Lang chăng trăng cử lế náng Vá Hai Chiềng
Lang cón ti poi tra Vua Pôn hay lo
Vua Cáng Vó hay lo hay nghỉ.
Nò là vua xếp phiến, xếp lo
Vua Pồn, vua Cáng Vó là pồ con,
Pồ con pón nón xa hỏi:
- "Lang Cun Cấn à.
Cò côông chi, pua chi mà tênh dờm đờm?
Lang Cun Cấn rắng:
- "Lay vua pô, vua con
Nhá con chưa cò ay ruôi kha, chiểm vịt
Trêng nhá chưa ay trải mên, dân chiêu,
Chưa ay rỏch ráo tẻng khẻch,
Chưa ay tấm cào tế ro binh, ruôi mướng,
Con mònh lế ùn cài là náng Vá Hai Chiềng
Vên mần piêng mấn pán
Phẳm rêng chàu, rêng du,
Cò àn, cò rêng chăng ní là,
Ơi tra han ôông vua lo, vua lăng?
Han vua trá lè, trá lới:
- "Con ới, con mònh lế Vả Hai Chiêng
Tấu khàng phải xuồng ăn cơm ôống cùn,
Luún khàng phải xuông òng rảc ốống kha
Phải liến liến pa năm, pảy khàng.
Mời khổng àn rêng xân


Mời mấn rêng nghiệp.
Lang Cun Cấn trở pài, lái nhá lế nánh Vá Hai Chiềng
Rỏ mơi, tấu khàng chăng xuống ăn khàm cùn,
Luún khàng chăng xuồng òng rảc ôống kha.
Vua trới ngôi trêng khập ngai thon
Vua con ngối trêng khập ngai pạc
Ngò kỉa Lang Cun Cấn
Vua vân vân vùa vúa,
Khai cun Khẩm xuồng hét,
Khai náng Phét xuông tèng
Tèng cho chết Lang Cun Cấn.
Cun, pá xa ti
Rí tí têng nấm khôông Tùng
Náng Phét lờng lớng ti trưởc
Cun Khẩm hược hược xeo khau
Kỉa trày túi pấm náng phảt phau phau
Mặt Cun Khẩm theo lao túi phấm,
Loóng ao ở lày ưởc
Tá rước rưởc ao ơ
Mònh àn pá náng xim xéng.
Náng Phét chưa măng tà hay
Xím lới phui phay khèo khèo:
  - "Eeng cháng Khẩm à,
Loóng tru xí nó
Rọch pó xí rờ,
Tôi chăng mònh tèng Lang Cun Cấn mấn chi,
Chỉ tèng râm ri
Pao chồn cân cào
Pao ào cân pôông.
Pá náng chung phoong mộch ỳ
Chung lè mộch lới
Rỏ mơi,
Pởi Lang Cun Cấn lế ùn cài
Trới rổi cơn dừ
Cử cơn bảo, cơn dông
Ôông phải trồn pao rù
Xù náng Vá Hai Chiềng pao tốn
Tà tẻ xa con trún,
Ô rảc dấm tẻ xa con cháng - kha
Troong cửa troong nhá
Tẻ xa mưới han eeng cháng ma ềm,
Tán ma êm
Chín mưới ban trốc rảc
Ngàng pước chu chương mướng rác xăm răm.
Chớ ní
Láng rác phải ti pòn
Pòn veé rằng:
- "Lang Cun Cấn lế náng Vá Hai Chiểng
Lê phải cun êm, cháng Ai
Là cun cháng xúi xáy mến xủi mấn xầu
Cho rêng,
Mướng trêng kèo tềng
Mướn tìn kèo lêng
Chật xảc, chật phêng nhá lang:
- "Lang ới, lang à,
Lang Cón lế náng Vá Hai Chiềng
Chu chương chắng cón ở lái troong mướng,
Mộch tôi chắng túc cùn, chiềm khá,
Chẳng cón ti tru mà que vến rán nửa,
Chẳng ay ti căn pứa trưa khu, rôộc lủng mấn chi.
Lúc rì,
Lang Cun Cấn rưởi,
Mặt máy xơ rơ
Lập cập tưa náng Vá Hai Chiềng
Xa lác vằng vái tôống,
Lác phôông rôông quèng quéng.
Trẻe lới puốn lới tằng
Lác náng ùn quéng vằng tềnh tới ní.
Chớ ní, nhá lang lày cho mới ôông mơ mướng Ngón
Méng ôông mơ hếch hếch
Xắc mêch nhểch trờng chì,
Mì nhì trờng phênh
Ô ông mơ ní bấn xôn bấn con
Tềnh mấn mơ gióng xốch táng,
Mấn mơ nói, mơ gióng xổch trùa
Ôông mơ mặc xôồng mộch đai,
Mặc ào mộch rái pò chặt,
Nhá lang lêng tốn cách là toong cốc,
Xuồng rôộc cách là toong xeng
Ốch pèng chưng vuông
Pành bot chẳng vắng
Xuồng phêng pắt con kha váng,
Lềng nhá ngâm ang cào mời,
Teẻng vâm cơm khừa puổi
Tẻ ôông mơ vá mài triêng nom ăn.
Khi ăn roo, oòng khay
Oông mơ vời xay lế trú ti ăn khà
Lế mang ti nhà táng,
Trú xên, trú váng ăn ti, ăn tềng.
Ôông mơ chôồng cấy lập cập ti xa
É á xa ti
Pước xuồng pợc man ngá,
Troỏc cồn va lập cập
Pước xuồng pợc man côốc,
Lở lôổc loóng choóng
Lưng coong lóm khóm
Con mài triêng nom xeo khau chèm chém,
Ti rèn rén xa pần
Ti tủa tềng tôống ná
Ti puông xa tôống cửa
Ôông mơ pước dán, pước pằn
Dắn dắn tềng tất nhá vua Binh Lạc.
Rạp rạp pao nẩm chiểng,
Riềng riếng tềng nẫm ao
Ti pao ráo, pao rấấu
M a n g ฉั น ลิ น c h o t e
Măng thè thè chò cành.
• Tán chò hành xăng xa
Lúc rỉ,
Con cài nhá ôông Binh Lạc
Chẳn xa xảc ngò vôông
Chẩn lêng nhá mách pổ
Thở hồ hề mảch mế trêng khập ngá:
- "Cò khẻch táng xa pồ à,
Cò khẻch lá tềng nhá mế ới,
Ôông vua Binh Lạc vée:
- "Khẻch tềng nhá noó con chăng mới náng pao
Khẻch pao nhá nó con chăng xa tòn
Cón mách pồ, mech mế mấn chi ờ con.
Àn lới chi con xiềng rì
Náng chẵn xa cháo khẻch tềng tun, têng nhá
Ôông mơ xửa chó xào xáo
Xửa xay xào xơ,
Cốống từa mài triêng nom dờ dớ lêng cốc man pàn,
Ngối pàn chán voòng lái,
Rối náng Vấm Trốc Tất lế chiều xa trảt,
Giảt chiều xa mới ôông mơ lêng chiều ngá,
Mới ới mài chòn dòn pao chiều quang
Pơng trú, pơng nang tệch xa chiều trắng.
Ở troong gian nhá khừa voòng
Vua Binh Lạc thay xôồng chắng chúng
Thay ào chắng chơ
Mời xa hơ pước chó xa chà
Ngối xa tiểp pừa, tiểp ngáy
Mời poi thăm thỏch;
- "Ôông ới, ôông à,
Ôông ở mướng xa, mướng khênh
Hay ở tẩt mướng ngân, mướng ngài?
Ôông tềnh maánh tru nó chăng cò chạc,
Oông tềnh maánh mác nó chăng vang roong?
Ôông tềnh maánh choóng nó chăng cò càn?
Ôông tềnh maánh pàn nó chăng cò khái?
Hay ôông mònh poi côông chi, việc chi?
Ôông mơ trẻ lè, trẻ lới:
- "Thưa ôông ôông à,
Tôi ở tẩt xa
Qua tẩt mướng Tá, mướng Quá
Tôi chăng maánh tru nó dom xeo chạc,
Chăng ti maánh mác nó véc tom roong,
Chăng ti maánh choóng nó dom xeo càn,
Í Chăng maấnh pức, maánh pàn nó tom xeo khái,
Mà tôi ti vang tin mớng lơng lơng
Mớng xật là:
Măng veé nhá ha cò náng Vấm Trốc Tất
Xật nết, leéng lắng
Ôông Lang Cun Cần mướng tôi,
Mònh cho tru ăn chung môch àng,
Mònh cho pó oòng rác chung mộch hoong,
Mònh cho pồ rá, mể rá ngối chung mộch mà vòng,
Mònh oòng ráo toòng chung khoe,
Mònh ở xa rêng khêng
Mònh rêng táng du, khà dá,
Mònh àn mấn cửa, mấn nhá,
Mònh lế náng Vấm nhá ha mấn pá nhá lang.
Cò àn, cò rêng hay chăng là ôông vua nà?
Oông vua Binh Lạc quắc xô mời vée:
  - “Ôông à,
Mònh lễ con cái tôi mấn pá nhá lang
Rỏ mơi con cài nhá tôi cón rẻt cón ro'.
Cáng hẩu cáng kỉa òi òi cớ nốống.
Ti củi chưa rêng vảc,
Ti rác chăng rêng khuống.
Ti dôống cón khuênh xôồng ào,
Kia mế cón èo ú
Kia chù cón tói cày nom,
Măng lới chi con xiêng rì,
Oông mơ lày vée:
  - “Thưa ôông là ôông,
Chàu rẻt xì tỉ lềng tru,
Du rẻt xì ha cho iềng ủn,
Ha cho ăn hỏi năm ní, năm khau rởc í àn.”
Vua Binh Lạc lài rằng:
  - “Chưa rêng ôông ới,
Chưa àn ôông mơ á,
Tru nhá cò rừa, pó nhá cò rán,
Tôi cón phải ti rố pảc
Tôi cón phải poi tán chù
Tể cả trùa trằng chiiến ní mời rêng.
Ôông pác tà pao cửa trước,
Pà du tà phao xác khau,
Chù tà khê lao xao
Xiềng cháo nhao nhao nhiền nhiến.”
Oông Binh Lạc từng dấn
Pước xa tòn mới.


Trẻe lới chi con xiêng rờ:
- "Vá ới, pác à,
Con Vấm Trỏc Tất nhá ha
Cò xiềng tốn xa chìn ling" Cò xiềng tềng xa mưới mướng
Ôông Lang Cun Cấn mònh xương
Dòm loóng mònh xim,
Mửa nỉ, tà cho ôông mơ triêng nom tềng,
Cườn àn chiiến rêng xươi
Cườn àn nơi ti ti lài lái,
Pảc măng phải xì cho
Ô, chù, ì du kia chăng xì pảo.
Cho phui lóng máng
Xổch ỳ hoó háng xúm mủ cho rêng.
Măng lới cho rêng cho àn
Trúa nhá ôông Binh Lạc phui nốống,
Ì du măng bui troong loóng
Rỏ mơi cón mònh páy tếu tu leo khể pàng,
Ngàng xa tếu xẻch mẻch tố tóm
Rắng: - "Con cài nhá ha cớn raái
Hẩu ti, ngò lái xật là rẻt ròi
Ay mỏi mẹc tể ti mấn pá
Ha khả xeo mân du mẫn con,
Rỏ mơi phải cò tru tực toòng u
Pó u mấn môồng
Cò ráo toòng.
Cò xiến doòng trảt nhá
Tể trả côông pồ mế tẻe xa ruôi chiềm
Vang tềng nối nồ ráo pa mươi
Vạc ngâm tá men xàm quai
Mưới hai con tru pạc túi,
Mưới pảy con pó lang lưng,
Là của ruôi con tập khê,
Là nom hối cú, poi mốống táng xa.
Cò triêng pèng, triêng kha là cơm vở xác,
Cò tao càn pạc tề vở rướng
Cò pải trằng khốp triêng cho vảo mài triêng nom,
Cò pèng, cò xôồng ào cho từa phiêng du
Cò xiên tưa cho mài quả chiều.
Xiêu mệch tờng chăng cho".


Ròo róo ôông Binh Lạc vée xa mộch xiêng,
Mú Binh Lạc vée xa mộch lới:
- "Tói chi tói lăm mơi,
Lới chi lới lằm rả,
Tể cho con cài nhá ha chết rù troong nhá,
Chết rá troong mướng,
Măng tau, lắng xương con lằm lằm.
Con cài troong cửa là trày chua leo
Tôi nhếu àn ét
Măng xa chiiến rẻt ròi xì tứng cò phang,
Trằng phang chiiến ôông rá xì tom khố tềnh.
Lúc rì,
Ong mơ từng dân cới xiêng,
Oông mơ mới chiiên thưa lới:
- "Của í chăng pắng moón,
Xiềng í chăng pắng loóng,
Vài í chăng pắng xim,
Mộch tôi cườn phăm tô tờng rỉ,
Tói tờng nó cườn phằm rêng tờng rỉ,
Chí ní, tôi cườn xa vên
Tể tâu lái ốống Lang Cun Cấn nhá tôi
Ngáy khau
Lang Cun Cần hối chu chương mướng rác,
Vạc việc ní phải lo,
Tru pó phải phẳm,
Xuông phênh nàng tực cùn lang,
Lêng nhá nô khoang ráo tòong
Mộch pừa ro phay,
Cò ới mài pơng trú
Cò mú rá ti xeo pàng xò.
Phải tra mướng cú mốỗng,
Cò trú xốch, nang trờng vỏ rướng
Phải cò rướng cơm vỏ xác
Mời àn pưởc pao àng phênh.
Tràng xa,
Mửa ni ngáy xốch
Nhá cú, nhá mốống cò loóng xương
Cho náng Vâm Trôốc Tất ti mấn du
Ti xa mấn pá, mái, cài con,


Vang xeo mưới rướng teém,
Chìn rướng trày rứa.
Chìn pởi phà
Chìn rướng mến lố
Chìn mươi cày kén trốc con oong.
Xông ào roóng reéng
Triêng têng nhá Lan Cun Cấn
Cho rêng táng ti khà tềng.
Pở rì, Lang Cun Cấn tà cò du
Tìn khường, tà cò moọn túc cùn, túc kha
Trêng nhá, tà cò móon trải mên dên chiêu
Tà rốc àn du khèo cái va
Nhá lang tà tom dom cho du vến nhá
Pa ngáy trài tồ.
Rổ mơi, năm ro khàng xiều
Náng Vấm Trốc Tất cừ poỏc rỏ mếng rón
Ngáy nó í phon phon nhơ mún văng lào,
Nhá lang êu ào, lóng chua chua
Ngò xa loóng măng xót xỏt.
Lang Cun Cân
Pơn têm kền trổc trày xay,
Pơn ngáy kiền trốc cày ào,
Hấu pao náng Vấm Trốc Tất khi tảy
Rảc hốt xa nhơ xồm,
Ở nhá mốống, ta nhơ pạc
Vến nhá lang xì nó ta lày xạc rạc nhơ chí?
Ta dấm xi nhơ cốc roóng chằn.
Túc cùn, pời cùn là ma
Túc kha, xì vằng con kha chết xảc,
Nó con húm chăng tếng mà quảc
Con cù chăng têng mà vô,
Rêng Lang Cun Cấn
Ngáy léng cón kỉa khà khà,
Ngáy dừ, xì kia trày mà náng dấm dấm,
Trới mưa thâm mònh lảc
Trới xò xảc mònh puông
Trới răng xương dân
Trới khúng khương măng xiệt.
Lang Cun Cân lày nôi chu chương mướng rác,
Rắng: "Măng vé cò náng Vật Trồc Rác
Đàng rêng táng ti kh lái cố ha.
Đàng rêng pá khác cố lang,
Cườn ốống mướn xương rêng xương
Ngáy ro khàng lái
Tà phẳm tô pạc váng
Tôi mònh rởc ôông mơ phang
Ti chật táng là con từa triêng pênh.
Náng Vật Trốc Rảc
Từng chải trốc tìn poòng cân dấu,
Ngối cồn trồc ở cốc chôông pôông,
Pùi xắc pớng xớng kèng côông, cèng cạch.
Nhói khăn tệch rêng mên xeng,
Náng pưởc tum queng
Pôông dấu trăng reng chân văn
Náng măng phẳn ăn rống ránh
Chắt cơnh pao lưng
Kèo chúng vằn xuồng,
Lúc rì, mời có xiểng pồ rố
Tà măng xiềng mế lu:
-
"Ở nó rối con cài úch
Ở nó dâu con cài yêu?
Chăng ti vến nhá nồ rác,
Tế mới hó nhá lang
Xên trú, pứa nang cho khẻch?
Tứng tể nhá ôông trẻch
Tứng tế ôông lang puốn
Lế phải du con là từa òi ròi.
Náng Vật Trổc Rác tà vến mấn du nhá Lang Cun Cấn.
Náng ở ruộch chìn khàng môch rằm
Lày qua han năm nửa khàng,
Ngoong rằng, rằng chăng rêng
Ngoong tén tén chăng tỏ
Hoòng xò xò chăng vến,
Trôi pé, pé pên pến chăng pao tềng pền,
Chày nền, nền chăng tràng
Mònh cò con mà chăng àn con.
Lúc rỉ,
Náng Vật Trốc Rảc
Trày mà chắng cón păng hăng nhơ pôông chông pôông tỏ tỏ,
Vôi chăng cón chờ chờ nhơ pôông dấu tấu múa,
Một mếng ti hôm vến luồng.
Lang Cun Cấn lày nghỉ ngáy léng khàng coong
Ngáy quằng quắng, khàng quảng qué,
Pơn hôm, kền trồc trày xay
Pơn ngáy lày kền trốc xổồng ào,
Òong rào í chăng măng rố, măng phay.
An cơm, tẩy ngáy chăng măng ẩm nghì.
Lang măng pực troong nò
Măng khò troong xân troong mếng.
Hẩu xa khôông kháo pơng lơng
Vôông xa tôống rằng chòi.
Hấu lêng trới ròi rói
Lày kỉa ngay náng A Khao, A Khàng, A Ráng nhá ôông vua Trới.
Méng xươi xươi pôông rể rể
Xắc xeng kỉa hòn
Tuôi mặt pòn òn péng éng.
Trằng ý trăng xéng
Chăng pằng mặt náng Khao.
Lang Cun Cấn ao ơ Lày ước
Ước nó mà lế cho àn con mặt rì.
Lang Cun Lẫn lày hôi mướng,
Tể phằm tru roong, pó mồồng
Phằm trôồng, phằm cốống
Xôông tỏ, ào lè
Tể xeo nhá lang
Ti poi cho àn náng A Khao, A Khàng, A Ráng nhá ôông vua Trới.
Tể tưa vến mấn du mấn dá.
Côống tà doòng
Trôồng tà tèng
Náng Ả Khao măng vèng véng troong lắng,
Rỏ mơi phui ran troong nò.
Mến rốống trăm cày cò từa rướng,
Váy đẹp trăm đôi cò từa vang,
Kến trốc, trày rứa xếp pao rương pạc,
Moón ri rỏ


Nhùa nhùa qua pháo,
Nhấu nháo qua khôông,
Côông doòng tôn cuôi,
Cốống pảy doòng thung tấu
Ngứa chìn kệch tưa Lang Cun Cấn ti trưởc,
Ngứa xốch tưa náng Khao ti khau
Xôồng xổch, ào mấu
Chen pao lập lập.
Lang Cun Cấn
Lế àn náng Ả Khao, A Khàng, A Ráng nhá ôông vua Trới
Vâm cơm pơn khờm chung nối,
Vó ráo toòng chung khoe, chung oòng,
Ti lêng, ti xuồng
í kiền xay, păng chó
Ti nhởi táng nó
Chung táng chung khà.
Náng Á Khao ngối may, pà
Lang Cun Cấn chốch mà chéo kéo,
Lúc náng ngối xúa
Lang Cun Cấn hẩu xiêu ngả ngả,
Pơn hôm, náng vở xay mến
Cho lang mấn êm
Pơn têm, náng lễ trày ú trằng
Mân pôông, mấn va cho Lang Cun Cấn nhày,
Lế trày mà chăm, chiêu chò chày
Cho lang Cun Cấn chúp múp
Rỏ nơi, í tà trúp xêm han múa chồ chà,
Múa rằng, rà củ, rà khoai tà vến
Náng Á Khao í hiềm
Náng chèm vèm í chăng cò con.
Mộch ngáy,
Măng tốn dốn tốn vée,
Mú Rá Rỏ mắt lế cỏ
Mú Rá Rỏ mắt cỏ rêng con.
Nhá Lang cho moón ti rô, ti xím mú rì,
Mú Rá Rổ tà ti lế cỏ cò con.
Xí rối,
Cò ngáy khao phui, mân mừa,
Đéng là hủ reo
Con chéo - pheo hay hảt,
Mặt khàng tà xật
Náng Vấm Trổc Tất, teẻ àn Cun Tối,
Náng vật Trổc Rảo, teẻ àn Cun Táng,
Náng Ả Khao, Ả Khàng, Ả Ráng teẻ àn Lang Cun Khương
A mài ruôi troong mướng
Teẻ xa pồ Toóng In.`, context: "Đặt ra quy tắc hôn nhân gia đình đầu tiên. Nghi thức dạm ngõ, cưới hỏi trân trọng rốt ráo ngăn ngừa tình trạng hôn nhân lộn xộn ngày sơ khởi." },
  { id: 16, name: "Đẻ Trống đồng", epoch: 4, kinh: `XVI. ĐẺ TRỐNG ĐỒNG
Lang Cun Cần ngồi trên sập rồng
Trông xuống giữa nhà
Thấy vật đen đen giống con bò
Thấy vật có hoa giống cái sọt
Lang Cun Cần hỏi các mo mường
Đố biết đó là cái chi?
Các mo mường buông tóc loã xoã
Kẻ thưa, người dạ:
- "Thấy đen đen không gọi là bò
Thấy vằn vằn không gọi là sọt
Cáy ấy gọi là Khâu lạc mình đồng
Gọi là cái trống đồng".
Nghe lời tiếng ấy
Vua cùng Chấu, Vá, binh mường
Đi mượn trống đồng
Đến cầu Bồ Đề, bến Tráng
Vua bảo quân hầu
Trèo lên cây gọi:
-
"Ớ! Ông Vua nhà Nước


Vua chúng tôi chưa có khâu
Bảo chúng tôi xuống mượn".
Nghe rầm rầm tận đáy nước
Nghe thác dác dưới lòng sông
Vua bắc thuyền rồng vào xem vào ngó
Nhìn từ dưới nhìn lên
Nhìn từ trên dưới
Học cách đúc trống đồng
Bảo nhau quay về đền rồng
Nện đất ầm âm
Đắp khuôn ìì
Lây củi gôc đem nung
Lấy củi cành đem đun
Chảy nước đồng như bông hoa
Đổ một lần không ra
Đổ ba lần không được
Trống đã bị ma rước
Khâu đã bị ma ếm
Cun Khương đi đào củ gừng
Cun Vống bỏ vào miệng nhai
Phun vào trống đồng đuổi ma
Bây giờ, đổ trống đồng đã ra
Đổ ba lần, trống đồng đã nên
Đúc nên khâu lớn
Đúc nên khâu nhỏ
Tiêng nó vi vu
Vui vui trong bụng
Lấy cái tốt bỏ vào kho
Còn lại cho đem bán
Dặn chú Khoá thăng Lôi
Lấy đòn gánh cứng mà gánh
Lấy đòn khiêng bền mà khiêng
Khiêng khắp mường dưới mường trên
Lên chợ, lên mường mà bán:
"Trống của người Mường
Có quai nho nhó
Có đàn nhái ra hóng gió
Có Ả Sáng, Á Sao
Ai về cúng tổ, cúng tiên


Đánh trông này
Ban sớm biết đường ăn đường uống
Ban chiều biết đường xuống đường lên
Đổi gạo tôi không bán
Đối gà tôi không lấy
Cơm mường tôi vô số
Lúa mường tôi vô vàn
Chỉ bán lấy tiền không lấy lúa"
Chú Khóa thẳng Lôi
Buôn hết mường xa
Bán hết mường gần
Nàng Ả ra mua
Nàng Út ra gạ
Thấy quả thật trống đồng
Người mường gọi là khâu
Lấy tiền ra chầu
Lây bạc ra mua.`, muong: `XVI. TEỀ TRÔỒNG TÔỐNG


Lang Cun Cấn ngối trêng khập váng
Vôông phang khừa raánh
Kỉa, cày dấm dấm chôồng con pó,
Kỉa tờng cò va chôồng cày tam,
Lang Cun Cấn poi cảc cồ mo mướng
Cày tờng tôm ngôm rì là cày chí?
Cảc mo mướng xổ xắc xổ rở
Vở xiềng dà dá:
- "Của dấm dấm chăng rố vée cày tam
Cày vánh vánh nó pảo vée cày pới,
Cày rì rố là khâu lạc mếng tôống,
Là trôồng tôống chăng khai,
Măng lới cho con xiềng rì
Mua côống chấu, vá binh mướng
Ti maánh trôồng tôống
Tềnh cấu Pố Đế, Pền Tràng
Vua pảo quân hấu
Tréo lêng cân rôố:
- "Ớ, ôông vua nhá nước tống chi tam quan kẻ Chớ,
Vua mộch tôi chưa cò khâu,
Pảo mộch tôi xuồng maánh
Măng rấm tìn rảc
Măng thảc dảc tìn khôông,
Vua pảc thuyến tôống pao vôông, pao iềng.
Hẩu pở tìn hẩu lêng
Hẩu pang trêng xuồng tìn.
Hoọc nàng tủc trôồng tôống
Pảo khố trở vến đến Rôống
Khôống tất rấm rấm
Tắp khuôn ì ì
Lế củi côộc dom rung
Lế củi céng dom toỏ,
Rac tôống chảy nhơ va
Tôo mộc pớn chăng xa
Tôo pa pơn chăng àn,
Trồng tà bí ma rảc
Khâu tà chảc ma ểm,
Cun Khương ti táo củ cơng
Cun Vôồng lôồng pao méng nhàm
Phun ràm ràm pao trôồng tôống tọt ma.
Chớ ní? Tổ trôồng tôống tà xa
Tổ pa pớn, trôồng tôống tà rêng.
Túc àn khâu cả,
Túc xa khâu éng.
Xiềng khâu vèng véng
Phui rêng troong nò.
Cày xoch lế mon khoo,
Cón lái choo dom paành
Răắn chù khoà, lấu lối.
Lế tón triêng cừng vàng
Lế tón triêng mà rướng
Rướng khắp mướng tìn, mướng trêng,
Lêng chớ, lêng mướng mà paành,
"Trôồng cố moón Mướng,
Cò quai nhỏ nhỏ
Cò tán khe khe xa lố cố,
Cò Ả Khàng, Ả Khao
Ay vến lởi cổ tà
Tèng tra trôồng ní,
Pơn khờm, mắt táng ăn, táng oòng
Pơn khuống, mắt táng xuồng táng lêng,
Tổi cào tôi chăng paành
Tổi kha tôi chăng lế,
Cơm mướng tôi ể chể
Loó mướng tôi ả chả.
Choo rêng lế xiến chăng lế tổi của".
Chù khoà, lấu lối
Puôn hểt mướng xa
Paành hểt mướng khêng
Náng Ả xa vôông
Náng ủch xa rám,
Kỉa xật là trôồng tôống
Moón Mướng rố rée là cày khâu
Lế xiến xa chấu,
Lế pạc xa mua.`, context: "Chế tác trống đồng thiêng liêng và dàn cồng chiêng 12 chiếc. Trở thành pháp khí linh hồn gắn bó với nghi lễ vòng đời sinh tử của đồng bào Mường." },
  { id: 17, name: "Chia ruộng đất", epoch: 4, kinh: `XVII. LANG CUN CẦN CHIA ĐẤT
Lang Cun Cần mặt đã thấy tối
Đầu gối nghe long
Lưng còng sức yếu
Không còn muốn làm cun
Chẳng còn muốn làm lang
Một hôm nghe nói:
"Muốn giầu thì phải trồng dâu
Muốn sống lâu thì phải làm vía"
Lang Cun Cần chọn một tháng tốt
Trong tháng tốt chọn một ngày lành
Mời thầy làm vía
Lang Cun Cần bàn với Cun Tồi:
"Con ơi!
Bố không muốn làm lang, làm cun nữa
Bố chia đất cho các con
Chia bằng nhau khỏi mất lòng con sau, con trước
Nhưng các con phải bày cổ cầu vía
Cầu được vía lành vía tốt cho tao".
Cun Tồi đến làm vía
Dắt vào một bò mộng vàng
Cun Tàng đến làm vía
Dắt vào một trâu mộng bạc
Lang Cun Khương đến làm vía
Dắt con lợn chật ngõ, chật rào
Còn Toóng Ín đi vào tay không
Nó là con nuông, con chiều, con yêu, con út
Chẳng cần của nả gì cũng xong.
Thế là
Mây anh em cùng làm vía cho bố
Bố say cơm nghiêng ngả
Bố say rượu mềm mềm
Nằm thẳng chân ra nơi cửa sổ
Bắt đầu chia đất cho con
Cun Tôi, được chia đất Khấm Ngang
Cun Tàng, được chia đất Khấm Dọc
Ruộng sâu, ruộng nông chia cho Toóng Ín
Còn men ruộng mạ, nhỏ bằng tai khỉ
Còn chân đất xấu, nhỏ như tai mèo
Nơi con gà rừng đến ăn, đến đậu
Cò đi qua thấy đầu
Ốc bò qua thấy lưng
Thì bố chia phần cho Lang Cun Khương
Lúc đó
Lang Cun Khương cơn tức dồn đầy bụng
Cơn giận đốt nóng lưng
Sai lính đuổi rong
Chạy về nhà ngoại
Lang Cun Khương phi ngựa chong chóng
Phóng ngựa mau mau
Vào sân rào rào
Vào hầu vua cha, họ ngoại
Lang Cun Khương thưa vào
Lang Cun Khương nói qua
Khóc ra rả với vua trời:
- "Ong ơi, ông à!
Chia nhà không đủ
Cây chung cành, có quả chua, quả ngọt
Con chung ruột có đứa ghét, đứa thương
Bố chia đất chẳng bằng
Bố chia nước chẳng công
Mất lòng con đầu con thứ
Cháu chạy lên ở với ông cho sống
Về với bà cho khỏi khố".
Nghe thưa
Ông đi ra
Bà đi vào
Dạy một lời cho kỹ
Chỉ một đàng cho mà ở mà ăn
Rắng:
-
"Đã vậy cháu đừng lo
Cháu cứ trở về Đồng chì tam quan kẻ Chợ
Tháng tư người ta rủ nhau đi chọi gà
Cháu chớ đi chọi gà
Tháng hai, tháng ba
Người ta rử nhau đi đánh cá
Cháu đừng theo đi đánh cá
Cháu cứ lo chăm làm ăn
Tháng ba, đi cày ái
Tháng tư, đi quải phân
Ông bà sẽ làm cho hòà cốc phong đăng
Để cho cháu lúa nhiều, cá lắm".
Ruộng con, Cun Khương đã cấy
Đông của làng còn trông không
Tháng tư, Toóng In còn đi chọi gà
Tháng hai, tháng ba còn đi bắt cá
Chẳng lắng mùa mà làm ăn
Ruộng nhà người mạ xanh xanh
Đồng nhà người lúa đã kín
Bấy giờ Toóng Ín mới đi dành mở mạ
Tháng tám mới đi cày vỡ ruộng đồng
Đồng tốt, ruộng trong cũng không xanh mạ
Cho nên Toóng Ín cấy xong
Ruộng trên ruộng dưới
Cò đi qua thấy đầu
Ốc đi qua thấy lưng
Toóng in bị đói nửa chừng
Mặt nhăn mày nhó
Khó kiếm ra lúa mà ăn
Khó tìm được sắn mà nhá.
Toóng Ín phải lên rừng
Tìm cây chuối trổ
Phải xuống rộc
Hái năm rau mèn
Đem vê làm qua đi xin ăn xin uống.
Lang Cun Khương
Trong cửa ngó ra
Trong nhà ngó thấy
Thấy chàng Toóng Ín
Men bờ đầm đi vào cửa
Men ngả đồng đi vào nhà
Lang Cun Khương liền bảo đàn em
Đem ngựa nâu đi ra rước chú
Toóng In vào đến cửa đến nhà
Lang Cun Khương dọn mâm cơm thịt gà
Mời Toóng Ín
Cơm xong, rượu say
Toóng Ín ngỏ lời:
- "Anh ơi!
Đói lòng hết thở
Nhà em không biết xay giã cái chi
Phải lên rừng tìm hoa chuối đỏ
Phải xuống rộc hái nắm rau mèn
Nên phải về xin ăn với anh với chị"
Lang Cun Khương nghe thương trong dạ
Nghe xót trong lòng
Gọi đứa hầu người ở
Lên nhà lấy lúa trắng như bạc
Lấy chỗ gác lúa thơm như hương
Xếp gánh cho đứa em thương
Xếp quang cho chàng Toóng Ín
Toóng ín đem lúa về
Ăn ngày hai ngày ba lại hết
Bụng lại đói da da
Lòng lại đói diết diết
Lại phải lên đổi
Hái hoa chuối đỏ
Lại phải xuông rộc
Hái bó rau mèn
Lại lên nhà Cun Khương tìm bữa
Lang Cun Khương tựa cửa
Vợ Cun Khương tựa hòm
Bàn sớm bàn hôm thương em lắm lắm
Ngày đầu đưa cho em lúa trắng
Ngày này cho lúa bạc như vôi
Xêp cho một gánh
Toóng In gánh đi không nổi
Nhưng vợ Toóng In chẳng biết ăn dè
Thóc nhiều mà không biết chia bữa
Nấu một lân, ăn căng ruột ngựa
Buổi sớm ăn thừa
Buối chiều bỏ phí
Hết thóc, mặt lại nhăn
Hêt cơm, mặt lại héo.
Toóng in lại đi xin
Lân này
Không được lúa trắng, lúa dẻo
Chỉ được một dúm lúa đen
Đem về ăn nhăng nhít
Nhưng rồi cũng hết
Lại lêt đi xin
Lang Cun Khương bực mình
Phải nói một lời:
- "Lần đầu anh cho chú lúa trắng như bạc
Lần hai anh cho chú bạc như vôi
Lần ba anh cho lúa đen sì như sạn
Bây giờ anh cũng hết
Chú phải xin nơi khác".
Toóng In trở chân ra
Ngó thây nhà Lang Cun Khương
Rước thợ rèn lên cửa
Đốt lửa, làm bừa, làm cày
Rèn dao phay, dao phat
Toóng In liền nảy ra ý ác
Nghĩ ngoặt ra điều gian
Nói với Cun Tồi, Cun Tàng
Nhà Lang Cun Khương giàu có
Rước thợ về rèn súng, rèn dao
Hòng làm giặc cỏ
Hòng giết Cun Tồi mường quang
Giết Cun Tàng mường iớn.
Lập tức
Nhà lang cho đứa lính cai cả
Đứa ở cai hầu
Đi vào xem xét
Chúng vào tận rào nhà Lang Cun Khương
Đứa đứng ở rìa núi mà trông
Đứa đứng ở rìa đồng mà lắng
Nghe đúng là nhà Lang Cun Khương
Có tiếng đập sắt
Vội vàng về tâu lại chủ
Lập tức,
Nhà lang cho người đi hô
Cắt người đi rao
Đi bảo làng Rậm, làng Rộc
Làng Quan, làng Chèo
Làng Neo, làng Đông
Nhà ai không có cơm phải bớt lúa má
Nhà ai không có cá phải tát đầm tát ao
Sáng ngày sau phải đến
Rạng sớm
Người Mường dưới kéo lên
Người làng trên kéo xuống
Người đi chật ruộng chật rừng
Người đi như ong, như kiến
Cun Tổi cầm gươm đứng ở phía trong
Cun Tàng cưới ngựa hồng đứng xa ngoài cửa
Truyền rằng:
- "Hỡi chu, hỡi chương
Hỡi mường, hỡi nước
Nhà Cun Khương đã làm giặc
Muốn chặt tình nghĩa anh em
Muốn làm nhục mường trên
Muốn làm hèn mường dưới
Binh mường hãy nghe lời
Binh mường hãy lắng tiếng
Theo ta đi bắt Lang Cun Khương
Chăn đường vào ngõ ra
Rao lời to lời nhỏ
Hô chém cả bố con
Súng bắn vào ra rả
Ná bắn vào như mưa
Lang Cun Khương phải phá cửa
Nhảy khỏi nhà thoát thân
Mau chân chạy về trời
Về với ông bà ngoại
Mường rộng, mây xanh
Ông bà ngoại thấy cháu đến
Vui trong dạ, hả trong lòng
Nhưng thấy cháu đi không
Ông bèn hỏi gạn:
- "Mọi ngày, cháu về cưỡi ngựa
Có đứa lính cai cả
Có đứa lính hầu
Đi theo sau xách điếu
Sao hôm nay cháu về mặt méo
Mặt thiếu vui, thiếu cười
Về chơi sao có một mình
Về chơi sao không có quần áo tốt?".
Lang Cun Khương mới bảo:
- "Ông ơi là ông
Bố chia của con khinh, con ghét
Chia đứa ít đứa nhiều
Toóng Ín chơi nhởn sớm chiều
Nên bây giờ thiếu cơm thiếu lúa
Nó về với cháu, xin ăn xin uống
Chấu cho nó lúa bạc, lúa chì
Nhưng xin mãi xin hoài
Cháu cất tiếng mắng
Nó về Lang Cun Tồi xui dọc xui ngang
Xui Cun Tàng chịu tiếng
Hai anh đã nghe miệng Toóng Ín
Kéo qua giết cháu


Cháu thoát được, chạy lên với ông bà
Ở với ông bà cho lành
Mường cháu chẳng về
Quê cha, cháu không trở lại nữa
Cháu xin ông được làm bão làm gió
Cho chúng nó hết đời
Chỉ một gáo nước nhà trời
Ông ơi, bà ơi! cho cháu làm lựt".
Ông bà, họ hàng khuyên rằng:
-
"Đất cháu còn ở còn về
Quê cháu còn lại
Cháu chớ làm hại binh hại mường
Cháu hãy ăn thiêng ở lành
Những việc đó để họ hàng nhà ta làm hộ
Ta sẽ đi gieo bệnh tật tai ương
Xuống Đồng chì tam quan kẻ Chợ".
Lang Cun Khương rằng:
- "Ông bà ạ, họ hàng ơi!
Cháu phải làm cho sấm nổ, sét rơi
Cho đổ nhà đổ cửa
Làm tối nửa chân trời".
Họ hàng nói một lời:
- "Cháu à, cháu ơi!
Cháu đừng làm hại binh mường
Để nghe nhớ, nghe thương
Trên trời đã có đường, có cách
Làm cho đồng cạn xác xơ
Nước cạn hết tôm cá
Đồi hạn, gãy sừng con nai
Trâu nhai đất cứng
Người hứng nước sương".
Thế là
Cun Tồi cái khang
Cun Tàng cái lớn
Đi săn đi bắn
Đi dọc đi ngang
Đi từ rừng giang
Vào hang núi đá
Bỗng gặp ba con rùa cả

Đang hối hả đóng thuyền cây giang
Gặp đàn rùa vàng
Đang lắp thuyền cây nứa
Cun Tổi, Cun Tàng đón lời thăm hỏi:
- "Rùa ơi!
Nước sông con không bằng lá cỏ
Nước sông cái không bằng lá gianh
Sông Tằm, sông Tè nước không còn chảy
Sao bay đóng thuyền, đóng bè làm chi?"
Con rùa đen hay thưa
Con rùa vàng hay nói:
- Ới! Ông, ông Cun Tồi, Cun Tàng
Và chàng Toóng In
Đã đi làm giặc
Giết bố, giết con Cun Khương
Lang Cun Khương vế trời
Về bên mường ngoại
Động trời động mây
Cả đêm cả ngày
Làm giận làm dữ
Làm khổ đất Đồng chì tam quan kẻ Chợ
Kẻ khó ta phải đóng thuyền cây giang
Kẻ nghèo đóng mảng cây nứa
Ông lang, ông đạo đóng thuyền chò chỉ
Để chèo lên đất ông trời".
Đương chèo đương chống
Nghe hây hấy cơn gió
Nghe rồ rộ cơn mưa
Trưa, Cun Sấm xuống hét
Đêm, Nàng Sét xuống đánh
Đầu hôm mưa bằng hột cà
Sáng ra mưa bằng quả đấm
Mưa dầm, mưa dề
Ngập bờ ngập bụi
Đồi Bù Rinh còn bằng cái kéo
Đồi Bù Khéo còn bằng lá muồng
Nhìn về đất mường
Lụt lên cuồn cuộn
Lúc đó vua Trời nhìn qua mưa


Vua Trời rẽ từng mây
Trông rõ đó rõ đây
Trông rõ cây rõ ngọn
Vua Trời nói:
"Việc này không tha
Vạ này chẳng rồi
Lang Cun Khương lên kiện vua Trời
Rằng nên làm quái, làm gở
Nay ta cho nàng Dặt Cái Dành
Nàng lành con khôn cái khéo
Đầu hôm chui mặt trăng
Sáng ra chui mặt trời
Về bảo Cun Tồi, Cun Tàng
Mau mau rước Lang Cun Khương
Về làm cun cho sang
Rước về làm lang cho giàu cho có"
Lang Cun Khương
Đang cưỡi trên lưng gió
Ngồi trên từng mây
Nói rõ nói ràng:
- "Cun Tồi hỡi!
Nhà bay nghe sang hay chưa?
Cun Tàng ơi! làm giặc có sướng
Đất nhà lang phải theo
Nẻo nhà lang phải về
Nhưng phải thề một lời
Phải nói một tiếng
Bằng lấy gươm, lấy kiếm
Hãy chém bỏ Toóng Ín
Cho hết nòi nịnh người trên
Cho hết nòi xui lên
Cho hết tên xui xuống
Làm cho kẻ khác chết uống
Làm cho binh mường chết oan".
Cun Tổi, Cun Tàng
Lấy máu đen đen là máu chó cái
Đem lại cho nàng Dặt Cái Dành
Nàng lành con khôn cái khéo
Trèo lên trời nộp máu cho Cun Khương


Lang Cun Khương nhin qua
Lang Cun Khương ngó lại
Mở miệng nói đứng không phải
Mở lời nói đứng rằng sai
Máu đen đen là máu chó cái
Đừng nói gian nói dối người ta
Không phải máu lang họ nhà
Không phải máu thằng xui giục
Ta không thèm vê
Cun Tồi, Cun Tàng
Lại lây máu đo đỏ là máu con hoẳng
Nộp lên cho Lang Cun Khương
Lang Cun khương nói:
- "Máu đen đen là máu chó
Máu đo đỏ là máu hoằng
Không phải máu dòng dõi nhà lang".
Nhà lang bàn đi
Nhà lang bàn lại
Dân mường đói cơm xót ruột
Ở lênh đênh giữa nước giữa trời
Toóng In xin thưa lời:
- "Em chẳng nên, hai anh em cứ hành tội
Cho mường khỏi đói
Cho nước khỏi dâng
Năm nay đã hệt
Tháng này đã qua
Hôm nay về già
Mai sau về cuối
Em nuôi thân bằng gì?".
Cun Tồi, Cun Tàng thương em lắm lắm
Khổ thân nhiều nhiều
Hai anh nói một điều
- "Em không nên
Hai anh phải hành tội
Hôm nay về già, mai sau về cuối
Cho em làm chúa nơi đồng ruộng
Sống giữ nương, giữ đồng".
Cun Tồi, Cun Tàng
Phang đi, chém lại


Nàng Dặt Cái Dành
Lại đem máu lên trời
Nộp Lang Cun Khương:
- "Ngày trước
Máu đen là máu chó
Máu đỏ là máu hoẳng
Hôm nay máu vàng
Thật là máu nòi nhà lang"
Lang Cun Khương hết hờn hết dồi
Trật chân trở lại
Quái chân trở về
Về Đông chì tam quan kẻ Chợ
Làm Đạo Lang Khương
Cun Tồi ra chào Đạo Lang Khương
Được một mâm vàng
Cun Tàng ra chào Đạo Lang Khương
Được một mâm bạc
Con cái Toóng In ra chào
Lang Cun Khương chưa nghe đã nói:
- "Chặt cây sao không chặt gốc
Nhổ cây sao không nhồ rễ
Chém bố sao không chém con?".
Lập tức
Đạo Lang Khương
Dồn cơn dữ
Cử cơn giận
Năm gươm vàng
Phang chết con Toóng Ín
Máu vướng ra tay
Mau bay lên ao
Bấy giờ, Cun Khương ngạo mạn
Đi vào cứa nhà lang
Bước lên sàn nhà cun
Yên lòng nhìn chu chương mường nước
Nhà lang làm thịt trâu đực đen
Cúng ma dưới đất
Làm thịt trâu đực bạc
Cúng ma thuỷ phủ long vương


Cúng chín phương trời
Lạy mười phương đất
Dưới đất phải tế thần đất
Trên trời phải tế thần trời
Thế là
Chu chương mường nước gần xa
Vui cửa vui nhà
Vui đất Đồng chì tam quan kẻ Chợ`, muong: `XVII. LANG CUN CẤN CHIA TẤT
Lang Cun Cấn mặt tà kỉa xồn
Cổ cồn măng loong
Lưng phom, khửc yêu
Chăng cón mònh mấn cun
Chắng còn hung mấn lang
Mộch pừa măng vée:
- "Ay mònh chấu xì phải trôông tô.
Mònh khôồng lô xì phải mấn vài.
Lang Cun Cấn chón mộch khàng xổch
Khang xổch rì chón mộch ngáy léng
Mới ôông mo mấn vài.
Lang Cun Cấn rố Cun Tối cày khang
Cun Táng ày náy
- "Con ới,
Pồ hoo chắng mònh mấn cun, mấn lang nửa,
Pô phằm chia tất cho cảc con
Chia cho pằng phố, tứng vắt loóng con eng cày máng,
Rỏ mơi, các con phải tẻng vâm vài
Cấu pán voong cho lái
Pán vài cho léng cho hoa.
Cun Tối ti tềng mần vài cho pồ
Tách xeo tực pó váng,
Cun Táng tềng mấn vài
Tách pao mộch con con tru pạc
Lang Cun Khương tềnh mấn vài cho pồ
Rướng con cùn cật xác, chật phêng.
Cón lấu Pồ Toóng In ti tềng cha xay rỏ rỏ,


Ré là con ở con ủch, con yêu,
Chăng của chi í chiếu í àn.
Xí là,
Un máng con lang mấn vài cho pồ
Pồ phay cơm lả ngả
Vả ráo xốm xốm
Tảy chuồng chó xa càng voòng.
Lúc ní, lêng xiềng chia tẩt cho cảc con:
Cun Tối pồ chia cho Khẩm Ngang,
Cun Táng pồ chia cho Khẩm Doọc,
Trưa khu, trưa ruộc pồ chia cho pồ Toóng In,
Cón púng nó chấm pấm xai voọc, choọc xai méo
Téo chim ăn chim đùm
Có có ti qua kỉa trốc
Ốc ti qua kỉa lưng
Xì pồ chia cho Lang Cun Khương.
Lúc rì,
Lang Cun Khương dừ pớn chớn
Xổ cơn hớn pàn chán
Khai lình chắn nhoàng
Cun Khương chắn nôống
Lêng cú môống, cò ngứa păn khòi.
Ngứa ti vòi vói
Pao khườn vao vao
Pao hấu vua cha là ôông vua Trới
Lang Cun Khương mềnh nhềnh
Lang Cun Khương bạp nhạp:
- "Ông ới ôông à,
Pồ con chia tén chăng rêng.
Chia nhá chăng đủ,
Cân chung chá cò trày tha, trày ngọch
Con chung chúm rọch cò từa khét, từa xương.
Pồ tà chia tất chăng pắng
Tể vẩt lắng con eng cày ùn
Xôn chắn lêng ở ôống Môống cho khôổng,
Vến ôống cú cho khỏi khổ là ní.
Măng tếu chi con xiềng rì
Ôông ti pao, mú ti xa
Rắn mộch lới cho kỷ


Trỉ mộch táng cho mà mấn ăn.
Rắng là:
- "Là xí rì, xôn tứng mà lo
Xôn cừ trở pài lái nhá tôông chi tam quan kẻ chớ.
Khàng pồn phè ti chói kha
Xôn tứng ti chói kha,
Khàng han khàng pa
Máng ti tèng cà
Xôn tứng ti xeo tèng cà,
Xôn cừ chăm trưa, hầu ná
Khàng pa xa cắn ải
Khàng pôn xa quải puún,
Cú môống rối mấn xò mấn mưa
Tể cho xôn ló nhếu, cà lằm.
Trưa con, Cun Khương tà cần
Trưa cố láng cón phông lông.
Khàng pồn, Toóng In còn ti chói kha,
Khằng han khằng pa cón ti tèng cà
Chăng trằng khà mấn ăn,
Trưa máng nân tà xeng
Tôống mang loo tà kin.
Chớ ní, Toóng In mời ti pen tược má,
Xà rà khàng xàm ti cắn phổ
Xì trưa ná xốch í chắng kịp xeng
Cho rêng, Toóng In cần xoong
Trưa trêng ná tìn
Có có ti qua kỉa trổc
Octi qua kia khoong
Toóng In tòi phoong roong trợt trờ.
Mặt nhăn máy nhùa
Khò chơm àn loo mà ăn,
Khò xím àn khành mà nhàm,
Toóng In phải lêng rứng
Xím cân chuồi trở
Pổ xuồng rôộc
Cảch nén xâu mên
Dom vến ti mấn nom tể cườn ăn, cườn òong
Lang Cung Khương


Troong cửa ngò xa
Troong nhá hẩu kỉa
Xật pồ Toóng In
Rắp nầm chiềng pao xàc
Men ngoọc rảc pao nhá
Lang Cung Khương pảo từa ở trong nhá
Dom con ngứa nu ti xa rởc chù.
Toóng In pao tềng cửa tềng nhá
Lan Cun Khương tẻng vâm cơm xịt kha
Mới Toóng In
Cơm xoong ráo phay
Toóng In mời poi:
- "Eng ới,
Khảt rảc hềt hơi,
Tòi lắng hết nghỉ.
Nhá ùn chăng mắt xay tấm cày chi,
Phải lêng rứng cách là toong côốc
Xuồng rôộc pếch lế xâu mên,
Tể lêng ní cườn ăn ôống eng, ôống ười.
Lang Cun Khương măng xương troong noò
Măng khò troong lằng
Rố từa ở ta hấu
Lêng nhá lế loó trằng nhơ pạc
Lế cồ ló hơm, ló hương,
Xếp triêng cho từa ùn xương
Xếp rướng cho Toóng In dờm dờm.
Toóng In dom loó vền nhá
Ăn ngáy han, ngáy pa lày trói.
Trôống tà là tòi ma da
Tá tà tòi mài dài,
Lày phải tréo tốn
Pẻe pôông chuồi tỏo
Lày phải xuống rôộc
Cách pò xau vôn
Lày ti lêng nhá Cun Khương xím pừa.
Lang Cun Khương rưứa cửa
Du Cun Khương ngò hóm,
Dóm khờm, dóm hôm xương ùn lằm lằm
Cấn dấn tưa cho ùn loó trằng,


Ngáy ní ha cho loó pạc nhơ pun,
Xếp cho mộch tam
Toóng In triêng vắm vôi chăng tí àn,
Rỏ mơi du Toóng In chăng hay teẻng ăn rấn
Chăng hay phân chia khôm pừa.
Nồ mộch pớn, ăn ro ruọch ngứa
Pơn khờm ăn pứa lứa
Pờn khuống lác ti.
Hết loó, mặt lày nhăn nhe
Hết cơm, mặt lày nhèo hèo.
Toóng In lày ti cườn pừa
Chiền ní,
Chắng àn loó trằng, loó ngá
Chỉ àn mộch khoa loó dấm,
Dom vến ăn nhăng, ăn nhỉt.
Roo mơi ăn í hay hết
Phải lết ti cườn,
Lang Cun Khương xổ dứ pớn chớn
Vée chơm xiêng noòng:
- "Ngáy cấn, eng cho loó trằng nhơ pạc
Chiền han, eng cho loo pạc nhơ pun,
Chiền pa, eng cho loo dấm nhơ khăẳng,
Chớ ní eng í tà hết
Un phải ti cườn púng khảc thôi.
Toóng In trở pài lái nhá
Kia nhá Lang Cun Khương
Rởc xớ rén lêng man
Nhùm củi, tửc pứa rén choóng
Mấn cấn, mấn tao phay, mấn tao phảt,
Toóng In tang dừ, nghỉ xa tấu khác
Vạc xa tếu khề vu
Vến ku lao côống Cun Tối, Cun Táng
Là nhá Lang Cun Khương cháu cò
Tang rốc xớ rén khùng, rén tao
May dao mấn giặc pó dó
Ti poỏ Cun Tối, Cun Táng mướng quang, mướng náy
Lập tức,
Nhá Lang cho từa lình cài cả
Lâu ở cai hấu


Ti pao mỏch iềng
Thè pao tềng rấu, tềng ráo nhá Lang Cun Khương
Từa xì từng chôông vôông vái tốn
Xật là măng xiềng rén hôn hôn haành haành
Cò xiềng tập khách
Lập cập vến xẹch mẹch nhá Lang Cun.
Lúc rì,
Nhá lang cho moón ti hô
Cho pô ti rao
Ti pảo lùng Rấm, láng Rôộc
Lôồng Quan, láng Chèo,
Láng đeo, lùng phóm
Nhá ay chăng cò cơm phải pởch loo máá
Nhá ay chăng cò cà phải trổ tấm, xắt ao
Tràng ngáy khau phải tềng.
Roớng tràng,
Moón táng tìn kèo lêng
Moón mướn trêng kèo xuồng,
Ti háy háy hiến hiến
Ti nhơ kiền nhơ oong,
Cun Tối cấm gươm từng ở pang troong
Cun Táng cời ngưứa toỏ từng vái cửa,
Chiiến lêng:
- "Chu chương mướng rảc ới,
Lang Cun Khương tà mấn giặc
Mònh chạch xúm mủ ùn eng,
Mònh mấn nhục mướng trêng
Mònh mấn kên mướng tìn.
Binh mướng phải trằng xai
Mướng rảc nay trằng xiềng
Xeo nhá lang ti pắt Cun Khương.
Cheén táng pao, ngỏ xa,
Rao xiềng khẩm, xiềng vẹt
Phải triệt pồn pồ con
Khùng pành pao rả rả
Ná pành pao nhơ mưa.
Lang Cun Khương phải phà cửa
Dảy khỏi nhá chấn duông.
Tuông ngay vến trới.


Vến tói tâu cú môống
Mướng rôống mân xeng
Han môồng kỉa xôn lày lêng
Măng phui ơng troong noò.
Mơi kỉa xôn ti roỏ roỏ
Môống từa poi thăm:
- "Mơn ngáy xôn lêng cời ngưứa
Cò lấu lình cai cả
Cò từa ở cai hái
Ti xeo khâu xẻch ôồng điều,
Nó chớ ní xôn vền mặt mèo nhèo
Vôi trớn trèo chăng cưới?
Vến roong nó cò mộch xân
Vến dôống nó chăng cò xồng xổch ào léng?
Lang Cun Khương mời vée:
- "Ôông ới là mú,
Pồ chia của con khing, con khẻt
Chia từa ét, từa nhêu
Toóng In ti roong mấn liếu
Rêng chớ ní xiêu ăn xiêu oòng.
Ré vền cườn ăn nhá xôn
Xôn tà cho loó pạc, loó chí
Roỏ mơi cườn mải tú tí
Xôn tà the xiềng vằng.
Ré tà vến Lang Cun Tối xui dọc xui ngang
Xui Cun Táng trằng xiêng
Han eng tà trằng meéng Toóng In
Kèo binh mướng phang nhá pỏ xôn ời rà.
Xôn chắn vến cứ môống
Ở ôông môống cho léng
Mướng xôn chẳng trở vến
Quên xôn chẳng cón trở lái.
Xôn cườn môống àn mấn xò lụt càng quái
Cho ngập mướng phè chết xoi.
Chỉ mộch mốc rác trôi nhá trới,
Cờn ôông, mú cho xôn mấn lụt?
Cú môông lày pảo:
- "Tất rì xôn cón phải vến
Quên rì xôn phải xuồng


Xôn tứng má chuồng hái binh mướng ở xôn.
Xôn hảy ăn xiêng ở léng
Việc rì xôn mònh xì tế cú môống mấn cho.
Pa cho xuông tếu xầu, bếnh ta
Cho tẩt tôống chí tam quan kẻ chớ.
Lang Cun Khương vée:
- "Cú môống ới.
Xôn phải cho khẩm tôống, phẻt téng
Cho khéng nhá, trốc cừa.
Mẫn xôn nửa vàng trới.
Trúa nhá trới lày pảo:
- "Xôn Khương à, xôn nói ới!
Xôn tứng má mấn hái bình, hái mướng,
Tể măng nhớ, măng xương
Trêng trới tà cò táng cò nàng
Mẫn cho tôống cán xạc rạc
Mấn cho rạc cán chết con xôm, lôm phôm con cua,
Trêng tốn cán trải khứng rai
Tru liềm rảc coòng,
Kha cỏ oòng rảc khương,
Con moón tớng rảc môộc pương, môộc lào.
Xi là,
Cun Tôi cài khang
Cun Táng cài náy
Ti tọt, ti panh
Ti doọc ti ngang
Tì pửa rứng tang tang
Pao hang tôống phuú
Cá ngớ tầm tra pa con ró cả
Tang hởi hà toòng too cân tang
Tôốn tán roó váng
Tang puộc pée cân lào.
Cun Tối, Cun Táng thăm poi:
- "Roó ới,
Rảc khôông con chớ ní chăng cớ là pày pày,
Rảc khôông cài chăng có là deng deng
Khôông Tằm, khảo Tẻe rảc chăng cón cò
Rêng nóo pay toòng pée, toòng mảng mấn cày chi?
Con Roó dấm hay thưa


Con róó váng hay pôố:
- "Ôi, ôông Cun Tối, Cun Táng
Côống là eng cháng Toóng In,
Tà ti mẫn giặc
Poỏ pồ con nhá Lang Cun Khương
Lang Cun Khương là puông vến trới
Vến nơi cúu môống
Đôống trới tôống mân
Cả têm liến ngáy
Mẫn dừ mân dướng,
Mấn khổ tẩt tôống chí tam quan kẻ chớ.
Kẻe khò, ha phải lòng mảng cân tang,
Kẻe heén ha phải toòng pee cân lào
Ôông lang ôông taáo xì toòng pée cân nhá roó.
Tế chéo vắt chèo vó lêng mướng mân xeng lèe lèe.
Tang chéo pée phập phè
Măng tò doó cơn xò
Kỉa tò doò cơn mưa
Pơn khơi, Cun Khẩm xuông hét,
Pơn hôm, náng Phét xuông teèng.
Trốc têm, mưa pắng ỏoc me, ỏoc mín.
Mưa dú mưa diín
Ngập pún, ngập tá
Tốn Pú Rinh cón pắng cày kéo,
Tốn Pú Khéo cón cớ là mé mé
Hẩu vến tẩt mướng
Ngập lụt rêng láng láng
Lúc rỉ, vua Trới hẩu pở mân mưa
Vua ràng xa mân
Tà kỉa tung queng
Tà mắt côố ngoón
Vua Trới rằng:
- "Việc ní chăng tha
Vaá ní chăng rối
Lang Cun Khương lêng kiến vua Trới,
Pảo mấn cở mấn kền
Chớ ní, ha cho náng Dặt Cài Deéng
Náng Leéng con khôn cài khéo,
Trốc têm, chun mặt tràng


Tràng xa chun mặt trơi
Vến pảo lêế Cun Tối, Cun Táng
Mau mau rổc lế Lang Cun Khương trở pài lái nhá,
Tể mấn cun cho khang
Mấn lang cho chấu, cho cò,
Lang Cun Khương tang cời mân toó doó
Ngối trêng mâm teéc deéc
Veé:
- "Cun Tối à,
Nhà pay măng tà xém hay chưa?
Cun Táng ới!
Nhá pay mấn giặc cò lồm?
Tất nhá lang phải xeo
Nẻo nhá lang phải vến
Roỏ mơi pay phải xế mộch xiềng
Pắng lế gươm, cấm kiềm
Phải chèm lấu pồ Toóng ẻn
Cho hết nói xoọc trêng
Cho quẹt nói xui lêng
Cho rúm lấu xoọc xuồng.
Mấn cho khá khảc chết uổng
Mấn cho binh mướng rúm oan.
Cun Tối, Cun Táng
Lế dấm dấm là màu chò
Tom cho náng Dặt Cài Deéng
Náng leéng con khôn cài khéo,
Tréo lêng trới nộp màu cho Lang Cun Khương,
Lang Cun Khương ngooc qua
Lang Cun Khương hầu lái
Vở lới xật màu ní chăng phải
Vở xiếng lái màu ní chăng rêng
Dấm dấm là màu cày chò
Tứng cò khể lứa hoo
Ní chăng phải màu nhá lang
Chăng phải màu cà lâu xui nhăng
Ho lày chăng xém vến nửa.
Cun Tôi, Cun Táng
Lày lế toỏ too màu cày vang
Nộp lêng cho lang Cun Khương
Lang Cun Khương ngò qua lày pảo:


- "Dâm dấm là màu chò
Toỏ toỏ là màu vang
Ní chăng phải màu nói nhá lang
Ho í chăng vến nửa.
Nhá lang bán ti nhồi lái
Mướng tà tòi cơm, hèo rọch
Moón ở ngầp ngồi trêng pée
Toóng In cườn thưa lêng:
- "Un chăng rêng han eng cừ mấn xôối.
Cho mướng ha khỏi tòi,
Cho rảc thấy, rảc tha,
Năm ní phải qua
Khàng ní phải xuồng
Pở ní vến rá
Mai khau vến cuổi
Un ruôi xân pẳng chi?
Cun Tối, Cun Táng xương ùn lăm lằm
Khổ xân reé nhếu nhếu
Han eng vée mộch tếu
- "Ùn chăng phải, chăng rêng
Han eng phải mấn xiệt
Pa mí vến rá, may khau vến cuổi,
Cho ùn mấn chùa tôống ná
Khổng khừa mướng, khừa hòn.
Cun Tối, Cun Táng
Cấm gươm phang ti, chèm laái
Náng Dặt Cài Déng
Lày dom màu lêng trới
Nộp cho Lang Cun Khương:
- "Ngáy trưởc dấm dấm là màu chò
Toỏ toỏ là màu vang
Pừa ní là màu váng
Xật xá nói nhá lang rối dờ
Lang Cun Khương hết dừ
Trở pài lái nhá
Qua chó trở xuống
Vến tôống chí tam quan kẻe Chớ
Tể mấn cun cho khang.


"Mướng tìn mướng trêng,
Mướng con, mướng náy
Rởng ngáy khau
Ti xím chu côống nhá lang cho khờm
Tràng xa,
Măng pa hối côống,
Măng chìn hối chiêng,
Moón tềng kín kín
Moón ti hiền hiền,
Lúc tòi, ăn túm cơm cà
Khát quà, òong rảc hòn,
Ti chon mặt trới dấn
Tới mải chưa kỉa mặt trới xeo,
Pơn khuống ti xeo mặt khàng
Ti tô àng chó, àng mướng,
Ti tủa rứng tủa khăng,
Khừa táng tốn tán tẻt tru
Cun Khương poi tra:
- "Các ùn à,
Pay cò mắt hòn nó cò ỐC
Pay inắt rôộc nó cò vôn?
Tốn troong hay tốn vái cò dân chu tà là chu tôống
Pôông thau trày thiểc chăng là?
Tán rét trả lới:
- "Mướng ới, ôông à,
Hòn nó hòn chăng còn ốc,
Rôộc nó chăng cỏ vôn
Tốn nó tốn chăng cò chu cò lúi
Cân chu moọc tây thung
Cân lúi moọc tấy rứng,
Khàng mộch rée tơm pôông
Khàng han khàng pa chơm trày,
Khàng pồn, khàng răm trày chìn pủt ceéng
Ôông xím chu ăn trày
Hay cấn việc pua cừ pao thung khăng mà lế.
Cun Khương lày vée:
- "Xừ chu rì pa chăng máng
Tờng chu rì pa chăng xím,
Rì là cân chu chua


Múa nó ăn tra múa rì
Chu rì pa chăng mònh
Chu xoòng pa chăng xém
Máng tà là ti
Ti cúng ti kiệt
Tảy trệt tôn Lai Li mưới han khàng
Qua tôn Lai Làng tảy ru mưới han ngáy,
Chăng hẩu kỉa cân chu
Phải trài chó trở xa
Da chó trở lái,
Kỉa cân cào khừa tôông
Cân chôông pông khừa láng
Ngở là cân chu tà là chu tôống
Pôông thay trày thiếc
Khiếc phíu xa cổn
Cổn cân chăng chạch côố,
Trốc cân chăng trốc rè,
Kèo chu chết mộch trăm tru tực
Vực chu chết mộch trăm con pó
Ngáy khau,
Pa ùn máng nhá lang lày ti
Chu chương mướng rả lày xeo,
Lày tréo tốn Lai Li, Lai Làng
Táy lí mưới han khàng,
Tảy ráng mưới han ngáy
Chăng kỉa cân chi côống chi,
Là cân chu tà là chu tôống
Pôông thau trày thiếc.
Mộch pừa,
Tắm Tẹch là lấu ăn, lấu ở
Xeo Cun Khương ti thăn rai
Xuồng kháo quải chán pắt cà,
Tắm Tẹch xốch nghỉ léng lắng,
Lang Cun Khương ưa,
Lang Cun Khương
Cho eng cháng Tắm Tẹch
Vến pồn du pa pàa
Vên thăm pơ con pa ngáy,
Tắm Tẹch tang ở nhá ở cửa


Cá ngỡ mãng rá xiêng côong pa
Màng - xa xá xiêng côông páy
Tắm Tẹch hổi hải trổ vến nhá lang
Táng mời qua nửa truông
Trắng xiêng tà xa tằm dằm
Trở pài xì rưởi lang phạt
Ti ruột mướng
Rưởi lang pắt tến
Eng cháng ti men xen
Xeo ngôn Pài Khá
Nà xẹch nẻch xay
Lưng váy ôông lán
Chó pẩp poònh
Phúu cản là qua vai
Nửa têm qua trông qua choòng,
Eng khảt troong lắng
Tòi lăng xeo veo,
Chó pước quăn co
Xai vo vo, vẩt vài.
Tềng truông Ngoọc Lán Váng
Qua Truông Năng, Tôống Khòi,
Phải pao mướng cườn cơm ăn dói
Cườn rác còng cấm nghỉ, dèe hơi.
Lày ti tềnh mướng Vang
Tón pá máng mướng Vang ti cần
Tắm Tẹch poi thăm:
- "Các ùn ới,
Cò kia,
Cày cân chi cao vao
Là cân chu tà, là chu tôống, pôông thau trày thiểc?
Ùn mái cò mắt
Xì pảo dúm eng?
Lúc ní,
Ới mài xốch ngốch troong tán
Hầu eng cháng mà nhăm
Veé cho eng cháng măng mà nhè:
- "Eng poi mấn cày mơn chi,
Mộch tôi ùn maái chỉ cò ti cần
Eng ha chăng kỉa tum queng là rứng khăng à?


Poi mấn chi cho chá
Trắng xai í măng rêng xiêng voọc, pá khá
Troong thung xiều chi cân chu
Khừa rứng cáng lăm cân rì, tờng rì
Chu chề chề moọc dấn
Trày chìn toỏ lé
Khàng pồn, ăn poỏ, lác ta
Khàng răm, khàng phàu, ăn ta lác loóng.
Tắm Tẹch dàng chó nấm ná
Măng nhà nhà moón rôố
Ún ma ái khể pèn
Eng pảo:
  - "Hó chu rì pa chăng xím mấn chi, coống chi
Rì là doóng chu too
Hó chu chua chua.
Xí là,
Méeng vée, chó co
Qua rứng khi, rứng phăt
Ti àn mộch mệch
Xôn xắt tú mú
Vở pán xay xa chăng kỉa,
Mặt lỉa nghỉa chực lanh
Vất cá ngớ cò con chim tu vảo ở ngoón céng
Rố xiềng cheng cheng
Teéng lới toờng hoòng
Tắm Tẹch dấn xảc traành
Lế nà nhắm pành
Rèng nà phẩm laán
Kèo rái cái lêng
Lắp laán nắp nem
Tu vảo từng im
Chày mỏ van khế:
  - "Khá ới, tứng pỏ pa mà khổ
Tứng pành pa mà xương,
Moón mònh chi, pảo pa pa rẩn?"
Tấm Tẹch xuốch lán xa
Poi tra chim tu vảo:
  - "Chim tu vảo à
Dâu cò kỉa táng pao, khoòng xa"
Mắt muồng qua cân chu chăng là?
Tu vảo vée:
- "Moón xương hoo chăng pành
Hoo cườn rẩm tềng nơi,
Cò cân chu tà là chu tôống
Pôông thau trày thiểc
Khoòng ti mướng Ôồng cò mắt
Táng mướng Ôồng moón cò hay?
Cân chu ở trưởc voòng nhá ôông Ca Da
Ở khau nhá tào Kỳ, Ôồng?
Táng tềng rì cón lắm khôông, nhếu hòn
Qua lằm khoòng, khăng, ná
Cử rứng náy, rứng cả mà ti
Hầu rứng cân khi mà tềng.
Tắm Tẹch xa ti xeo choòng
Cử Khoòng tu vảo réng lêng
Lêng mướng Voong, tầm tra eng cháng Cập Noóng
Cập Noóng poi:
- "Khá moóng ới,
Tỉ laái ní nời,
Nôống nai xì vật keo xừ pa,
Mếng rá xì vật keo xừ mộch.
Tắm Tẹch khật khưởng pước xa
A ra pước laái:
- "Nời nời Cặp Noóng tốn pài
Cù nài tốn deeng
Dâu cò moòng cò pốt, cò neeng,
Mặt xeeng, mùi too
Dâu tể im cho hoo tảy ru
Hoo mời âm púng, noó dâu tềng nhày?
Cạp Noóng mày khày têng
Rée râm rêng lày vée
Mè nhé lày cưới
Phả xa nghỉ hôi hôi
Rée páo:
- "Hoo là thấn Cặp Noóng
Mốm hoo rôống rôống
Trôống tá tơ nhơ
Mơi chăng ăn xịt moón nó mà lo,


Chăng vooc mặt dâu nó mà rưởi
Lại ní vảy
Tể ha nhấn hó háng,
Cho xa con eeng cày máng
Tể mấn quan chìn khàng mưới tới.
Tắm Tệch măng chưa phui:
Troong lắng cón rưởi,
Cặp Noóng mắt ỳ
Mời pảo:
- "Khá moón ới!
Ho tà vée là xật
Hoo chăng mònh pỏ
Chỉ nhoỏ hoo mònh pật,
Ay hơn keo xì mấn eng
Ay xua phải reéng mấn ùn
Tắm Tẹch khể cừng:
- "Xay dâu cò moòng
Mặt xì trớn tráo trớn tra,
Meéng ý hà xa toỏ lèe.
Hầu tà păn tài
Ay cón tàm mó pao mà pật dâu.
Mònh pật xì tể hoo tròi
Dâu từng tìn tốn, tìn bải,
Hoo từng trêng chỏt cao cao,
Dâu xua, xì chíu mấn ùn chìn khàng,
Phải pàm làm hoó chìn tới.
Cặp Noóng ưng rối
Han pang pao pật,
Tắm Tẹch ở ngôn tốn
Xô Cặp Noóng Loóng choòng
Cặp Noóng liêu xiêu,
Thở xa lô xai,
Khửc tà mài nhài,
Cặp Noóng cườn xua
Rỏ mơi chưa ưa mấn ùn.
Lày pừng khừng vée áanh:
- "Hoo rêng xuối eeng
Nó dâu réng àn?
Dâu rởc xiềng ngược


Lày xooc xiêng ngang
Pật xâm keo păng hăng
Pật phang keo pờng hờng,
Bán cho xa nhẻ
Vè cho táng ráng
Lế khăng thung chừng kiền
Lê tán kiên từng vôông.
Tắm Tẹch xoa pán xay
- "Thôi, ha cừ pật
Pật keo ngon pèn loóng,
Àn xì rêng eng, rêng máng,
Xua xì mân ùn xật thôi,
Xí là,
Là cân khô tung lêng pồn xồn
Cân tổ xeo ám ám.
Mộch keo, Cặp Noóng pổ lăn,
Han keo, Cặp Noóng lở xuồng,
Tắm Tẹch ngối lêng trôống
Keo pa Tăm Tẹch lanh quay
Cặp Noóng cưới nhăn, cưới nhỏ
Keo pồn, Cặp Noóng lày lở
Nhơ cân trốc côố,
Tắm Tẹch àn mấn eng.
Cặp Noóng phui loóng rẩn eng ti xím chu, xím lúi.
Ti thăn ti tọt
Hết tốn Cào, tốn Khi.
Tràng xa,
Khúng cón mịt mịt
Tắm Tẹch ti xeo khoòng cân chu
Cặp Noóng pu nhu xeo pưởc
Qua tất mướng Ôồng
Tềng thung rôống Lai Làng, Lai Li
Pao tốn Khao Da
Tréo tró cửa nhá ôông táo Kỳ, Ôồng.
Chớ ní kỉa xật là
Cân ní là cân chu tà, là chu tôống
Pôông thay trày thiểc.
Va váng pảy
Trày váng pa.


Pôông nhơ Xaái,
Là păn nhoòng nheèng,
Céng voong, xò roong reeng reẻng ngưứa,
Hấu pang trêng ùn eng tếu kỉa,
Con húm từng chấu mộch pang,
Con vang từng chấu mộch pên,
Con sân từng chấu mộch háng,
Cùn lói, hiêu, rai từng chấu ở khừa
Côông, kẹch từng chấu mộch pên
Váng eng pắt rôi trêng ceéng, trêng là
Ta ta èo ò trêng pọt ceéng
Tắm Tẹch rèng nà
Xay tà xuổch laán
Hằm hẳm dơ nà lêng
Cò con váng eng trêng ceéng
Hẩu xuồng mời pảo:
- "Tứng pành tôi mấn chi chết roo,
Xịt tôi chăng roo ông rá lúc tòi,
Lóm lá chăng roo con rét,
Eeng mònh mộch trày váng,
Eeng ngoong han trày chìn.
Mơi tứng dén xa cửa trới,
Tứng páy xa rôi chơm xiêng roòng.
Trốống Tắm Tẹch tà ưng
Loóng Tắm Tẹch tà chíu
Mời kéo trả rái nà
Rởc trả cày laán
Ti lêng câấm cân chu
Tới váng eeng nèm trày
Váng eng lày răăn:
- "Khá ới!
Vến tềng cửa tềng nhá
Tứng dẻn xa ôống vua kẻ sang
Tứng moọc xa ôống lang kẻ chớ,
Xì chấu cò khò chi côống chi.
Của tây tún ngang
Váng tây tún doọc,
Nhá ngoọc, máng phui, kẻe troóng.
Cò loó xiềng chật nhá,


Cò tru tốn, poó pài
Cò nối tất, nối tôống
Cò hôông mưới, viềng chìn.
Trới tà cho của nả xì rêng chiín lế.
Câm trày chu trêng xay
Măng váng eng khên lồi
Han ùn máng măng phui troong noò
Măng cưới rở troong xân, troong lắng
Păng hăng ti xa vang trày
Mònh nhập nhày tếng nhá
Tì táng chăng cón chơi va nhởn pườm
Xuồng qua tốn nhá trới
Vến tếng tất tôống chí tam quan kẻ chớ
Tỉ táng vôông xa
Tắm Tẹch trành trôống tảy khờm.
Chưa poi ườm mú du
Du reé tà ti xa
Nhám nhê nha nhê nhồi
Kể lồi kể lang:
- "Eng ới, eng à,
Eng ti xa vằng vắng
Ti thăn ti pành vằng quéng
Rêng nó chăng kỉa àn cày moong chi?
Lác việc cun, việc quan
Quan tà phạt váa lế hết xeng ram, viếng pảy rối
Quảy hết nối ăn, tờng tớng troong tún,
Tắm Tẹch ngối tun nhun trằng khiểc
Loóng chăng tung leo
Trôống chăng nhều nhào
Nhảo ngay ôống du:
- 'Ùn ới, ùn à,
Vẩt rối lày cò,
Ha coò nhếu tờng lớng lớng.
Tắm Tẹch phưa treẻ lới xoong
Tà kỉa, tìm khường tấy tru, tấy pó
Trêng nhá, mầy kho loó cào
Cùn kha nhồn nhào
Chật tún là nối, viềng, côống.
Tắm Tẹch hẩu phang du, lày rắng:


- "Dâu cò kỉa
Chấu nhất mướng ha
Là nhá Lang Cun Khương,
Mơi mấn nó cho cò nhếu tru tực tâu tán,
Chưa cà pó khoang chìn rừa,
Ôông cun, ôông quan chưa cò chu, cò lúi.
Cón ho, ho tà cò chu, cò lúi,
Ho lày cón àn han trày váng
Cò han trày chin rờ.
Lúc rì,
Náng Dẻ là con mài náy nhá Lang Cun Khương,
An lang xương, lang chiếu
Lang yêu, lang chuống
Pơn ngáy pắn pải,
Pơn hôm chải chuống, ruôi xắm.
Nửa têm ngeng xai trằng
Măng lấu Tắm Tẹch mẹch chiiến cân chu,
Náng mònh tràng xa ti lu mỏch pô.
Cho pồ mắt tếu hay
Náng vée:
- "Con thưa pồ à,
Lúc kha tréo cúm,
Con chuông tủa chuống tách cân lào,
Trốc têm
Con chuông nốt chuống pải cân pương,
Cá ngớ, măng Tắm Tẹch dẻn xiềng pung lung,
Reé tà xím xa cân chu laá,
Náng Dẻ vée chưa kịp xào
Cun Tối tà pước ngang
Xuốch con tao càn pạc
Cun Táng xuốch con mác càn ngá.
Cun Khương xuổch roi ta treo cửa voòng,
Chắn xuông khỏi man,
Nhá lang chiến cho từa lình cài cả
Chiến cho lấu ở cai hấu
Ti tới Tắm Tệch cho mau
Rôi, Tăm Tệch chưa tềng
Tun Tối tói tành pồn mươi roi lảy trảy,
Tun Táng tói tành pảy mươi roi choóng khoóng,


Lang Cun Khương mừa xay
Vée lới xim rờ:
- "Han eng tôi ới!
Ùn páy rêng muồng xì han eng trằng
Chăng riêng xì lác vái rôống cày xai,
Máng tà chiiến rối
Con rét xì phải xòn túi cùn, túi khá,
Ôông rá ha xòn vâm cơm, chèn ráo.
Cơm pao, ráo xa
Ráo phay nhê nha
Rối lấu phay phải nhảo xa lảo lảo.
Mãng xoong, loóng tà chiu
Tà cho khá ấu Cóm
Ti phom phom tênh tói Tắm Tẹch.
Xuồng mướng cơm, rào vài nhá lang.
Cơm páy láng láng.
Ráo vó náng, xịt tẻng là chờn ờn,
Tắm Tẹch ro cơm, rố phay
Khể nhoi nhơ con iếng,
Méng dẻn nhơ vang pép
Chăng lép tếu chi côống chi
Nhá lang lày rỏch xêm ráo
Nhều nháo mới Tắm Tẹch
Xịt hết lày vang xêm
Ông ráo dên vôi ực ực.
Tắm Tẹch cáng vée, cáng nhược
Khê trới toạc, tất loong.
- "Ây dà các ôông lang ới,
Hởi pa ôông cun à
Các ôông chấu nhất mướng
Mà chưa nhều tru tấu rán
Chưa cò pó chìn rừa,
Mấn nó tà mắt khù chu, khù lúi,
Cón tôi tà mắt cân chu
Kỉa khoòng cân lúi
Ở lũng khau nhá Ca Da.
Mời hôm qua
Nhá tôi tà mê man của cỉa.
Tôi tà cò han trày chu too,
Mộch trày chu váng,
Tang treo ở ôồng nà
Nơi cửa xa voòng laái.
Khí ni,
Pa ùn máng nhá lang
Tà là róch ráo hăng cho lấu Tắm Tẹch
Rối Cun Tối vược mặt
Khai moón lêng ngay nhá Tăm tẹch
Xẻch lế ôồng nỏ
Xoo lế ôồng nà
Dom vến tún vến nhá lang ngay.
Cun Táng tổ xa
Kỉa cò trày chu tôống,
Pôông thay trày thiểc,
Cun Tối cấm trày lêng hẩu:
- "O, rée là trày nghia,
Cun Táng cấm lêng ngoong:
"Ní rée là trày nang,
Lang Cun Khương cấm trày lêng ngoò:
- "Trày toỏ chăng phải nang
Trày váng chăng phải, nghia,
Chăng phải trày chi, côống chi
Mà ní xật là khoỏt chu, khoỏt lúi
Cun Khương cấm lế trày váng
Tế pao rương khơn toỏ,
Lế trày chìn toỏ
Tể pao rương khơn dấm.
Dom lêng khập cạp cao mon, chù.
Lôô lôô,
Tắm Tẹch tỉnh ráo,
Mời mắt lang tà lứa,
Tà rệch trày chu, trày lúi.
Mãng xúi ngủi,
Lày pực pung hung
Eng giật con tao
Chực lao pao chèm phặt Lang troong cửa,
Choo hả troong xân troong noò.
Róc mơi, eng tà nghỉ tềng du, con
Tắm Tẹch lon ngon từng dấn


Lang Cun Khương ngò laái
Ngăn vối, pào vée:
- "Lấu Tắm Tẹch ới,
Dâu mònh khỏi dạc
Hay mònh tru, pó
Mònh nhá cao, cửa khoàng.
Dâu cón mònh khôổng,
Xì phải rển nhá lang xím cân chu
Chăng àn queng co
Mời hoóng khôồng lôô ốống trùa.
Dâu chăng trằng khể
Xi phải chèm nhỏ xày
Chết nảy nhơ tru phải tâm
Chết thâm ấm nhơ phét tàng,
Chết quéeng nhơ phuú, nhơ lăng lít mà thôi
Tắm Tẹch từng dấn mònh van
Mònh vée tếu rồ
Tà vả xa uộc uộc
Vả vôộc xa tấy xồng tấy ào
Lào ngào ti, lày lở,
Măng xiềng pảo vée phải lác du
Ngheng xai trắng vée phải lác con,
Lày vất trày chu trón
Hồn pạc, hón váng tà pao xay lang
Xỏt của tau lắng nhơ chết từng chờng ờng.
Lang Cun Khương lày pảo:
- "Dâu phải rẩn khoòng, măng chưa lấu kia!
Nhá lang lày lế xêm ráo xêm xịt
Lày tảch Tắm Tẹch pao ngối vâm nhơng,
Tắm Tẹch lày phay
Lày rằng:
- "Nhá lang ti pơn khờm
Tôi rẩn khoòng pơn khờm,
Nhá lang ti rơớng tràng
Tôi rẩn khà rơớng tràng
Khoòng tềng cân chu lời thôi
Mơi lú tềng côố chu xì khoò
Khửc phải nôống nhơ voi.
Pa ùn máng nhá lang
Nàng tru ăn mớng
Mớng vée:
Pở ní àn xím côn chu cốn lúi.`, context: "Thiết lập phân chia ruộng đất công bằng để canh tác lúa nước. Đắp bờ ngăn nước suối về đồng ruộng, đảm bảo mùa vụ no đủ trật tự." },
  { id: 18, name: "Tìm Chu", epoch: 4, kinh: `XVIII. TÌM CHU


Ba anh em nhà lang
Đi quăng chài sông cái
Đi thả lưới sông con
Gặp đàn kiến đỏ
Gặp họ kiến vàng
Kéo đi chật đường
Ùn ùn chật lối
Cun Tối liền hỏi
- "Hỡi đàn kiến kia!
Bay đi đâu đông đông
Mang cả chiêng đồng, trống bạc".
Đàn kiến trả lời:
-
"Ới! ông cun, ông lang!
Ông lắm của nhiều vàng
Ong lắm cơm nhiều lúa
Ông sung sướng lắm rồi
Nhưng còn kém chúng tôi
Bởi ông chưa biết
Chưa được nhìn cây Chu("
Chưa được chầu cây Chu".
Cun Tàng lại hỏi:
- "Này đàn kiễn ơi!
Bay đi châu cây chu vàng?
Hay đi chầu cây chu bạc?
Cây chu ở đầu bến nước?
Hay ở đầu ngọn suối, trong rừng?
Đàn kiến lại nói:
- "Này Cun Tồi, Cun Tàng
Này Lang Cun Khương
Cây Chu đó ở mường giáp đất
Ở mường cật trời
Nhà lang không đến được"
Anh em nhà lang bàn nhau:
- "Ba đứa ta
Nhà lắm bạc, nhiều vàng
Lúa nhiều, của lằm
Nhà ta sung sướng
Nhưng còn tha kiến đỏ, kiến vàng
Chưa được trông thây cây Chu".
Rôi, ba anh em trở về nhà
Cho người đi rao
Cho người đi báo
Lệnh rằng:
-
"Ới bản đàng trên
Ơi mường đàng dưới
Rạng ngày hôm sau
Đi tìm chu với nhà lang".
Sáng ra:
Nghe ba hồi cồng
Nghe chín hồi chiêng
Người đến kìn kin
Người đi chật lối
Lúc đói, ăn đùm cơm, gói cá
Khát quá, uống nước suối, nước khe
Đi từ khi mặt trời chưa dậy
Đợi mãi chưa thấy mặt trời theo
Buổi chiều tối, đi theo mặt trăng
Đi hết chợ, hết mường
Đi hết rừng, hết núi
Giữa đường đụng lũ trẻ chăn trâu
Cun Khương đi đầu liền hỏi:
- "Các em ơi!
Bay có biết suối nào có ốc?
Bay có biết rộc nào có môn, khoai
Đồi trong hay đồi ngoài
Có cây Chu tá, lá chu tôông
Bông thau quả thiếc?"
Lũ trẻ trả lời:
- "Ông ơi, mường à!
Suối nào, suối không có ốc
Rộc nào, rộc không môn, không khoai
Đồi nào không có chu có lụi
Cây chu mọc đầy núi
Cây lụi mọc đầy rừng
Tháng một, nó đơm hoa
Tháng hai, tháng ba nó kết trái
Tháng tư, tháng năm quả chín đây cành
Ông tìm chu để ăn
Hay có việc cần cứ vào rừng mà lây".
Cun Khương liên nói:
- "Thứ chu ây ta không chuộng
Giống chu ấy ta không muốn
Đó là cây chu chua
Mùa nào ăn theo mùa ây
Chu ấy ta không lấy
Chu ấy ta chẳng tìm".
Họ lại đi
Đi mãi, đi cùng
Ngủ đồi Lai Ly mười hai tháng
Qua đôi Lai Láng ngủ đúng mười hai ngày
Ngó chẳng thấy chu
Họ quay trở ra
Họ quay lại nhà
Thấy cây gạo giữa đồng
Thây cây vông cửa làng
Ngỡ đó là cây chu lá, lá chu tôông
Bông thau, quả thiếc
Liền lấy rìu ra chặt
Chặt cây không chặt gốc
Trốc chu, không trốc rễ
Kéo chu, chết một trăm trâu đực
Kéo chu, chết hoài một trấm con bò
Ngày sau,
Ba anh em nhà lang lại đi
Chu chương mường nước lại theo
Lại vào đôi Lai Ly, Lai Láng
Ngủ lỳ mười hai tháng
Ngủ ráng mười hai ngày
Chẳng thấy cây nào
Là cây chu lá, lá chu tôông
Bông thau, quả thiếc
Một hôm
Tặm Tạch là đứa ăn đứa ở
Cùng Cun Khương đi săn nai
Xuống sông lặn chài bắt cá
Tặm Tạch hiền lành tốt nết
Lang Cun Khương yêu thương
Lang Cun Khương
Cho chàng Tặm Tạch
Về thăm vợ ba hôm
Về thăm con ba bữa
Tặm Tạch đang ở nhà ở cửa
Bỗng ra rả tiếng cồng ba
Nghe xa xa tiêng công báy
Tặm Tạch vội trở về nhà lang
Đường mới qua nửa truông
Nghe tiếng cồng đã xa lắm lắm
Trở lại nhà thì sợ lang bắt phạt
Đi với mường nước
Sợ lang bắt đền
Chàng đi men men
Theo đường Bái Khạ
Xách ná ở tay
Lưng đeo tên nỏ
Chân vấp đá
Lá quặc vai
Nửa đêm qua chuông qua dốc
Tặm Tạch nghe khát trong cổ
Đói bụng nhỏ, bụng to
Bước chéo quanh co
Tai nghe vo vo, mất hồn mất vía
Đến truông Ngọc, Làn Vàng
Qua truông Năng, đồng Khói
Phải vào mường xin cơm ăn cho khoẻ
Xin nước uống cho lành hơi
Rồi đi tiếp đến mường Vang
Gặp các cô nàng mường Vang đi cấy
Tặm Tạch hỏi:
- "Các em ơi
Có thấy
Có cây cao cao
Cây chu lá, lá chu tôông, bông thau, quả thiếc
Các em có biết
Xin mách dùm cho".
Lúc ấy
Một ả gái đẹp nhất trong hàng
Ngó chàng ý tứ
Nói đủ cho chàng nghe:
- "Anh hỏi làm chi
Chúng tôi chỉ có nghế đi cấy
Anh chẳng thấy xung quanh là rừng à?
Hỏi làm gì cho xa
Lắng tai cũng đủ nghe tiếng khỉ, tiếng vượn.
Trong thung ấy có nhiêu cây chu
Khu rừng giữa càng nhiều chu ấy
Chu dựng cành mọc dậy
Quả chín tới, đỏ lừ
Tháng tư, ăn vỏ bỏ da
Tháng năm, tháng sáu ăn da bỏ lòng"
Tặm Tạch nghỉ chân nơi bờ ruộng
Nghe đông đông người nói
Nghe các em gái nói mềm
Chàng bảo:
- "Họ chu ấy ta không tìm
Đó là cây chu đỏ
Họ chu chua".
Thế rồi
Tặm Tạch miệng nói, chân đi
Qua rừng si, rừng trúc
Đi được một lúc
Tối tắt mù mù
Mở bàn tay, trông không rõ
Mắt lim dim chực ngủ
Bống có con tu hú
Đậu ở trên cành
Kêu một tiếng thanh thanh
Dành một lời rõ rõ
Tặm Tạch giật mình, tỉnh ngủ
Lây nó đem giương
Vung nỏ đem bắn
Kéo lên được dây
Nạp tên định bắn
Tu hú đứng im
Gô mô van xin:
"Người ơi! Đừng bắn ta mà khổ
Chớ giết bỏ ta mà thương
Người muốn gì, bảo ta, ta mách"
Tặm Tạch rút tên ra
Hỏi qua tu hú
- "Chim à
Mi có thấy đường lại lối ra
Biết đường qua cây chu không đó".
Tu hú rằng:
- "Người thương ta chẳng giấu
Ta xin chỉ đến nơi
Có cây chu đá, lá chu đông
Bông thau, quả thiếc
Lối đi mường Ống (Thanh Hoá) người có biết
Đúng lối mường Ống người có hay
Cây chu trước cổng nhà ông Cai Da
Sau nhà đạo Ký, Ống
Đường đến đó còn lắm sông, nhiều ruộng
Còn lắm dốc, nhiều rừng
Qua lắm truông, nhiều suối
Cứ rừng lớn mà đi
Nhằm rừng si mà bước".
Tặm Tạch ra đi theo dốc dựng
Cứ hướng tu hú vừa truyền
Lên mường Vong, đụng chăng Đười Ươi
Đười Ươi gọi với:
- "Người kia, mau nói!
Hãy lại đây cùng ta
Có khoé thì vât keo thứ ba
Minh già vật keo thứ nhất"
Tặm Tạch ngật ngưỡng bước qua
Từ từ bước lại:
- "Này Đười Ươi đồi bái
Gấu nái đồi tranh
Mày có vuốt có nanh
Mắt xanh mũi đỏ
Mày để yên cho tao ngủ
Tao vừa ấm chỗ, mày đã quấy, đã phiền"
Đười Ươi xầm xầm bước lại
Nó mở mồm lại nói
Mở miệng lại cười
Thở ra mây hơi
Nó bảo:
- 'Ta là thần Đười Ưới sống
Môm ta rồng rộng
Bụng ta to to
Nhưng ta không ăn thịt ngươi đâu mà lo
Chẳng móc mắt ngươi đâu mà sợ
Lại đây ta nhận họ
An ở cho ra anh em
Để làm quan chín tháng mười đời"
Tặm Tạch nghe chưa vui
Thấy bụng còn sợ sợ
Đười Ươi biết ý:
- "Người ơi!
Ta đã nói là thật
Ta không muốn giết
Chỉ thích vật nhau
Ai thắng hơn keo thì làm anh
Au thua phải chịu làm em".
Tặm Tạch dần quen
Mới nói:
- "Tay mi có móng nhọn
Mắt trợn lên xanh xanh
Mồm há ra đỏ đỏ
Nhìn đã sợ
Ai dám vật với mi
Muốn vật thì để ta trói
Mi thì đứng dưới đông dưới bãi
Ta thì đứng đỉnh núi đỉnh đồi
Mi thua phải chịu làm em chín tháng
Phải chịu làm họ chín đời.
Đười Ươi ưng lời
Hai bên xáp vào vật
Tặm Tạch ở đỉnh đồi
Xô Đười Ươi trôi đổ
Đười Ươi xiêu ngã
Hơi ra lố tai
Khi sức đã yếu
Đười Ươi chịu thua
Nhưng chưa chịu làm em
Lại mang lời nói tức:
- "Ta đáng tuổi làm anh
Sao mày dành lây được
Mày rước tiếng ngược
Mày rước lời ngang
Vật thêm keo hắng hăng
Vật thêm keo khoẻ khoẻ
Bàn cho ra nhẽ
Vẽ cho ra tường
Lấy cây rừng chứng kiến
Lấy đàn kiến đứng trông"
Tặm Tạch xoa bàn tay:
-'Thôi ta cứ vật
Vật keo nữa thật lòng
Thẳng để nên anh, nên ông
Thua để làm em cho phải phép"
Thế là:
Lá khô tung lộn lộn
Cây cối cuốn ẩm ầm
Một keo, Đười Ươi ngã lăn
Tặm Tạch ngồi dằn lên bụng
Hai keo, Đười Ươi ngã xuông
Keo ba, Tặm Tạch ngã lăn
Đười Ươi cười nhăn cười nhở
Keo bốn, Đười Ươi lại bổ
Như cây trốc cành
Tặm Tạch được làm anh
Đười Ươi phải dẫn anh đi tìm chu
Đi ăn, đi dạo
Hết đồi Gạo, rừng Si.
Sáng ra,
Sương còn mịt mù
Tặm Tạch đi theo hướng cây chu
Đười Ươi theo sát
Qua đất mường Ống
Đến thung rộng Lai Láng, Lai Li
Vào đồi Khao Da
Đến trước cửa nhà ông Ký, Ống
Thấy đúng là:
Cây chu đá, lá chu đồng, bông thau, quả thiếc
Hoa vàng bảy
Trái vàng ba
Bông như lụa là
Lá bay lấp lánh
Gió cành như nhạc ngựa
Nhìn bên trên, hai anh em đều thấy
Con cọp đứng trầu một bên
Con sên đứng trầu một hàng
Lợn lòi, hươu, mang đứng trầu ở giữa
Phượng hoàng đứng trầu một bên
Vàng anh bắt sâu trên cành trên lá
Đa đa réo vang trên ngọn
Tặm Tạch giương ná
Tay nữa lắp tên
Giơ ná sắp bắn
Có con vàng anh trên cành ngọn
Ngó xuống thưa rắng:
-
"Đừng bắn tôi làm chi người hỡi!
Thịt tôi không no ông già khi đói
Phổi tôi chẳng no con nít lúc no
Người muốn một quả vàng
Người mong hai quả chín
Nhưng đừng khoe ra cửa trời
Đừng bày ra lắm lắm"
Bụng Tạm Tạch đã ưng
Lòng đã vừa đã chịu
Mới kéo trả dây nỏ
Xỏ trả mũi tên
Đi lên gốc cây chu
Chờ vàng anh ném quả
Vàng anh lại dặn:
- "Người à!
Về đến cửa đến nhà
Đừng nói ra với vua kẻ sang
Đừng kể với lang kẻ Chợ
Thì mãi mãi người sẽ giàu sẽ có
Đầy của đây vàng
Nhà sang, người trọng
Có lúa giống chật sàn cao
Có trâu đàn, bò lũ
Có nồi đất, nồi đồng
Có chõ mười, niêng chín
Trời đã cho của thì người phải giữ"
Cầm quả trên tay
Nghe Vàng Anh lời bày, lời dặn
Hai anh em nghe vui trong dạ
Nghe hả trong lòng
Mang quả vễ,
Mong mau đến cửa, đến nhà
Dọc đường bỏ nghỉ, bỏ ngồi
Hết chơi, hết nhởi
Qua núi nhà Trời
Về đến đất Đồng chì tam quan kẻ Chợ
Vì đi đường xa
Tặm Tạch lăn ra ngủ
Chưa kịp hỏi thăm vợ
Đã có vợ đi ra
Vợ lăn ra giữa nhà mà khóc
Kể khúc, kể ngọn:
- "Anh ơi! anh à,
Anh đi xa vắng vắng
Đi săn hay đi bắn
Sao chẳng được con chi
Bỏ việc cun việc quan
Quan phạt vạ lấy xanh năm, niêng bảy
Quảy hết đồ ăn, đồ đựng trong nhà"
Tặm Tạch ngôi nghe vợ nói
Lòng chẳng thấy nao
Bụng chẳng thấy buồn
Nói luôn với vợ:
- "Em ơi, em à
Mất rồi lại có
Ta sẽ có đủ tất cả."
Tặm Tạch vừa nói xong
Đã thấy, dưới sàn đầy trâu bò
Trên nhà, mấy kho lúa gạo
Chật sân gà lợn
Chật nhà cổng, niếng, nồi đồng.
Tặm Tạch ngó vợ con lại nói:
  - "Chúng mày có thấy
Giàu nhất vùng ta
Là nhà Lang Cun Khương.
Nhưng họ chưa có trâu đực đầu đàn
Chưa có bò khoang chín rựa
Ông quan chưa có chu có lụi.
Còn tao, tao đã thấy cây chu
Tao còn được hai quả vàng ôi
Một trái chín hừng."
Lúc ấy,
Nàng Đẻ là con gái lớn Lang Cun Khương
Được lang thương, lang chiều
Lang yêu, lang chuộng.
Ban ngày nàng quay xa kéo sợi
Ban tối nàng dệt vải nuôi tằm
Nửa đêm lắng tai nghe
Tặm Tạch nói chuyện cây chu.
Nàng mong chóng sáng mách bố
Để bố biết, bố hay.
Nàng rằng:
  - "Con thưa bố à,
Lúc gà trèo chuồng
Con dệt nốt khung cửi cây nứa.
Nửa đêm,
Con dệt nốt khung cửi cây hương
Bỗng nghe Tặm Tạch bàn tiếng hung hăng
Rằng hẳn đã tìm ra cây chu lạ."
Nàng Đẻ nói chưa dứt tiếng
Cun Tồi liền bước xuống
Rút con dao cán bạc.
Cun Tàng rút con mác cán ngà
Cun Khương rút cái roi da treo nơi cửa sổ
Chạy xuống khỏi cầu thang
Nhà lang truyền cho đứa lính cai cả
Truyền cho đứa ở cai hầu
Đi đòi Tặm Tạch cho mau
Rôi, Tặm Tạch chưa đến
Cun Tồi đòi đánh bốn mươi roi máu chảy
Cun Tàng đòi đánh bảy mươi roi song
Lang Cun Khương xua tay
Nói lời tình nghĩa:
- "Hỡi hai anh
Em nói nên đàng thì hai anh lắng
Lắng không nên thì xin bỏ ngoài tai
Con nít ta lừa đùi lợn, tỏi gà
Ông già nên lừa mâm cơm, chén rượu
Cơm ăn no bụng
Rượu say xiêu xiêu
Tặm Tạch ắt nói liều, nói hết".
Nghe xong, lòng đã chịu
Cho ông ậu Còn
Đi đòi Tặm Tạch
Xuống mừng cơm, mừng vía cho lang
Cơm bày ra
Rượu vò, thịt lá
Mâm xếp trên dưới thẳng hàng
Năm người một mâm
An cơm, uông rượu
Tăm Tach no, Tặm Tạch say
Mồm nói như iếng
Miệng kêu như hoằng
Chẳng sót điều chi
Nhà lang rót thêm rượu
Đưa mời Tặm Tạch
Hết thịt lại mang ra
Uống mau ừng ực
Tặm Tạch càng nói càng hăng
Nói trời nổ, đất long
"Ôi ông lang ơi!
Hỡi ba ông Cun!
Các ông giàu nhất mường
Mà chưa có trâu đầu đàn
Chưa có bò chín rựa
Quan chưa biết cây chu cây lụi
Còn tôi, tôi đã biết cây chu
Rõ đường, rõ lôi
Rõ gốc rõ cội
Ở lũng sau nhà ông Cai Da
Mới hôm qua
Nhà tôi đã lằm của
Tôi có hai trái chín đỏ
Một quả chín hừng
Đang treo ở cột to giữa nhà
Nơi cửa ra cửa lại".
Lúc ấy,
Ba anh em nhà lang
Lại càng nâng chén cho Tặm Tạch
Rồi Cun Tồi quắc mắt
Sai người lên nhà Tặm Tạch
Xách lấy ống nỏ
Xỏ lấy ống ná
Đem về cho lang
Cun Tàng đổ ra
Thấy có quả chu đồng
Bông thau quả thiếc
Cun Tồi cầm quả lên nhìn
Nói:
-
"Ơ! Nó là trái cau"
Cun Tàng cầm trái lên xem
- "Ô! Nó là quả quýt"
Lang Cun Khương cầm quả mân mê:
- "Quả đỏ chẳng phải quả cau
Quả vàng không phải quả quýt
Chẳng gọi trái chi, quả chi
Mà là Khót chu, khót lụi"(1)
Cun Khương liền lấy quả vàng
Bỏ vào rương son đỏ
Lấy quả chín đỏ
Bỏ vào hòm sơn đen
Đem lên sàn cao cất giấu
Lúc lâu
Chàng Tặm Tạch tỉnh rượu
Biết được lang đã lừa
Vừa cướp xong quả chu quả lụi
Nửa nghe tủi tủi
Nửa lại giận hung
Chàng quơ vội con dao
Chực lao vào chém lang trong cửa
Để hả cái lòng
Nhưng nghĩ đến vợ đến con
Tặm Tạch nán lòng đứng dậy
Lang Cun Khương ngó lại
Vội ngăn, bảo rằng:
- "Này Tặm Tạch!
Mày muốn khỏi rách
Mày muốn trâu bò
Muốn nhà cao cửa rộng
Và mày muốn sống
Phải dẫn nhà lang đi tìm cây chu
Cấm nói quanh co
Mới được sống với con với vợ
Nếu không nghe lời
Thì mày phải chết chém như cây ráy
Chết giãy như trâu đâm
Chết thảm như sét giáng
Chết lặng như đá, như rêu".
Tặm Tạch đứng dậy muốn kêu
Muốn nói điều dấu
Nôn cơm ra đầy áo
Mửa rượu ra đầy quần
Quay cuồng lại ngã
Nghe lời hắn sẽ chết bỏ vợ
Nghe lời hắn phải chết bỏ con
Lại đã mất quả chu tròn
Quả vàng, trái bạc đã vào tay lang
Xót của đau lòng như chết trồng chết đứng
Cun Khương bảo:
- "Mày phải dẫn đường!
Nhà lang lây thêm rượu thịt
Lại diu Tặm Tạch vào mâm
Tặm Tạch lại say
Rằng.
- "Nhà lang đi ban sáng
Tôi dẫn đi ban sáng
Nhà lang đi lúc chạng vạng
Tôi dân đi lúc chạng vạng
Đến vùng cây chu thì rễ
Đến gốc nó thì khó vô cùng
Sức phải khỏe như voi".
Ba anh em nhà lang
Thịt trâu ăn mừng
Mừng rằng:
Sẽ tìm cách chặt chu chặt lụi.`, muong: `XVIII. XÍM CHU

Lang Cun Khương mừa xay
Vée lới xim rờ:
- "Han eng tôi ới!
Ùn páy rêng muồng xì han eng trằng
Chăng riêng xì lác vái rôống cày xai,
Máng tà chiiến rối
Con rét xì phải xòn túi cùn, túi khá,
Ôông rá ha xòn vâm cơm, chèn ráo.
Cơm pao, ráo xa
Ráo phay nhê nha
Rối lấu phay phải nhảo xa lảo lảo.
Mãng xoong, loóng tà chiu
Tà cho khá ấu Cóm
Ti phom phom tênh tói Tắm Tẹch.
Xuồng mướng cơm, rào vài nhá lang.
Cơm páy láng láng.
Ráo vó náng, xịt tẻng là chờn ờn,
Tắm Tẹch ro cơm, rố phay
Khể nhoi nhơ con iếng,
Méng dẻn nhơ vang pép
Chăng lép tếu chi côống chi
Nhá lang lày rỏch xêm ráo
Nhều nháo mới Tắm Tẹch
Xịt hết lày vang xêm
Ông ráo dên vôi ực ực.
Tắm Tẹch cáng vée, cáng nhược
Khê trới toạc, tất loong.
- "Ây dà các ôông lang ới,
Hởi pa ôông cun à
Các ôông chấu nhất mướng
Mà chưa nhều tru tấu rán
Chưa cò pó chìn rừa,
Mấn nó tà mắt khù chu, khù lúi,
Cón tôi tà mắt cân chu
Kỉa khoòng cân lúi
Ở lũng khau nhá Ca Da.
Mời hôm qua
Nhá tôi tà mê man của cỉa.
Tôi tà cò han trày chu too,
Mộch trày chu váng,
Tang treo ở ôồng nà
Nơi cửa xa voòng laái.
Khí ni,
Pa ùn máng nhá lang
Tà là róch ráo hăng cho lấu Tắm Tẹch
Rối Cun Tối vược mặt
Khai moón lêng ngay nhá Tăm tẹch
Xẻch lế ôồng nỏ
Xoo lế ôồng nà
Dom vến tún vến nhá lang ngay.
Cun Táng tổ xa
Kỉa cò trày chu tôống,
Pôông thay trày thiểc,
Cun Tối cấm trày lêng hẩu:
- "O, rée là trày nghia,
Cun Táng cấm lêng ngoong:
"Ní rée là trày nang,
Lang Cun Khương cấm trày lêng ngoò:
- "Trày toỏ chăng phải nang
Trày váng chăng phải, nghia,
Chăng phải trày chi, côống chi
Mà ní xật là khoỏt chu, khoỏt lúi
Cun Khương cấm lế trày váng
Tế pao rương khơn toỏ,
Lế trày chìn toỏ
Tể pao rương khơn dấm.
Dom lêng khập cạp cao mon, chù.
Lôô lôô,
Tắm Tẹch tỉnh ráo,
Mời mắt lang tà lứa,
Tà rệch trày chu, trày lúi.
Mãng xúi ngủi,
Lày pực pung hung
Eng giật con tao
Chực lao pao chèm phặt Lang troong cửa,
Choo hả troong xân troong noò.
Róc mơi, eng tà nghỉ tềng du, con
Tắm Tẹch lon ngon từng dấn


Lang Cun Khương ngò laái
Ngăn vối, pào vée:
- "Lấu Tắm Tẹch ới,
Dâu mònh khỏi dạc
Hay mònh tru, pó
Mònh nhá cao, cửa khoàng.
Dâu cón mònh khôổng,
Xì phải rển nhá lang xím cân chu
Chăng àn queng co
Mời hoóng khôồng lôô ốống trùa.
Dâu chăng trằng khể
Xi phải chèm nhỏ xày
Chết nảy nhơ tru phải tâm
Chết thâm ấm nhơ phét tàng,
Chết quéeng nhơ phuú, nhơ lăng lít mà thôi
Tắm Tẹch từng dấn mònh van
Mònh vée tếu rồ
Tà vả xa uộc uộc
Vả vôộc xa tấy xồng tấy ào
Lào ngào ti, lày lở,
Măng xiềng pảo vée phải lác du
Ngheng xai trắng vée phải lác con,
Lày vất trày chu trón
Hồn pạc, hón váng tà pao xay lang
Xỏt của tau lắng nhơ chết từng chờng ờng.
Lang Cun Khương lày pảo:
- "Dâu phải rẩn khoòng, măng chưa lấu kia!
Nhá lang lày lế xêm ráo xêm xịt
Lày tảch Tắm Tẹch pao ngối vâm nhơng,
Tắm Tẹch lày phay
Lày rằng:
- "Nhá lang ti pơn khờm
Tôi rẩn khoòng pơn khờm,
Nhá lang ti rơớng tràng
Tôi rẩn khà rơớng tràng
Khoòng tềng cân chu lời thôi
Mơi lú tềng côố chu xì khoò
Khửc phải nôống nhơ voi.
Pa ùn máng nhá lang
Nàng tru ăn mớng
Mớng vée:
Pở ní àn xím côn chu cốn lúi.`, context: "Hành trình xuyên rừng sâu tìm kiếm cây Chu thiêng (gỗ cổ quý hiếm) để đốn về dựng cột nhà Lang vĩ đại chống đỡ gió bão đồi dốc." },
  { id: 19, name: "Chặt Chu", epoch: 4, kinh: `XIX. CHẶT CHU
Được quả chu vàng
Nhà lang bàn chuyện lấy chu
Nhà lang sắm sửa rìu to, búa lớn
Từ ông già đến con trai mười ba, mười chín
Con gái gánh chuyển cơm gạo đi theo
Khiêng rìu, khiêng dao
Vào rừng, tìm chu, tìm lụi.
Hôm đó
Cun Tồi cưỡi voi yên vàng
Cun Tàng cưới voi yên bạc
Cun Khương đi kiệu gác đòn rồng
Có chiêng cồng
Có trống kêu
Có ông mo đi cùng chàng Tặm Tạch
Dân làng kéo đi kin kìn
Đi ra đường Đồng chì tam quan kẻ Chợ
Đi qua mường Chợ
Ra ngõ đồi Rồng
Ra truông Lèn En
Đến quèn mường Mon
Luồn ra cầu Uôn
Về bến Lúng
Rạng rạng cầu Nóc
Đi dọc chợ Ma
Ra đến đền Ông ở ngoài kẻ Chợ
Nhà lang giữ binh đóng trại
Mang hương vào đền khấn vái
Cầu Đức Ông cho lành buổi tìm trái
Vái Đức Ông cho tìm thấy cây chu
Lại một sớm
Mường rộng, thung dài
Dấu chân người đi như lá rụng
Một bận qua núi Làn Ai
Hai tháng qua nơi Vận Chiếng
Một hôm đến đồi Khao Da
Ba hôm qua đôi Khao Dịn (1)
Chín đêm mười ngày
Mới đến đồi nhà ông Cai Da
Đến sau nhà ông Đạo Ký, Ống
Trông đi trông lại
'Thấy sáng cả trời
Rạng nơi rừng giáp đất
Sáng khắp chín phương
Rạng đi bảy đường, tám lôi
Có đàn gấu đứng đợi chầu một bên
Có đàn voi đứng chầu ở phía ngang
Đàn hoẳng đứng chầu một phía
Chớp đổ rồng vàng leo lên leo xuống
Hoa vàng bảy, trái vàng ba
Lá và hoa kêu ra nhạc ngựa
Rõ là cây chu tá, lá chu tôông
Bông thau, quả thiếc.
Cun Tồi đến trước
Đóng đinh bên ngang
Cun Tàng đến sau
Làm trại dưới gốc
Cun Khương dựng trại bên gốc cây chu
Truyền cho dân mường thay nhau vào chặt
Phập rìu vào phải năm mươi người cầm
Lấy rìu ra phải năm mươi người giật
Sáng ra chặt được bằng cái chày
Trưa ngày, chặt to bằng một vòng tay
Chặt cả ngày, cây chu không chịu đổ
Hôm sau
Ngõ rừng vừa rạng sương
Anh em Cun Khương lại hò nhau vào chặt
Nửa chiều qua, chặt còn lỡ dở
Có một người
Đến cây chu trước nhất
Khoe thật, nói rằng:
- "Kìa cây chu vàng
Đó cây chu sang, chu có
Gốc nó hãy còn lành
Chỗ chặt hôm qua đã hàn kín lại
Cây chu lớn ra như cũ
Nó sợ vô cùng"
Cun Tàng trợn mắt ngó ngó
Cun Tồi ngửa cổ ngó cây
Cun Khương nhíu mặt nhãn mày
Đều đứng xa cây vẫn run run đầu gối
Riêng đứa hầu đêm qua ngủ lại
Ngủ lại gốc cây chu vàng
Ngả lưng nơi cây chu đá
Đứa hầu nói rằng:
- "Nửa đêm
Tôi nghe đàn ma van rối rít
Trời tối mịt mù
Ma hu hu khóc trên cây chu cây lụi
Ma hói:
Chỉ sợ lưỡi rìu to bằng bàn tay
Thân rìu bằng cây lảy trảy"'
Lắng đến lời đến lẽ
Đủ ý đủ lời
Nhà lang cho mường trở lại
Về trại giữa rừng
Đi tìm người thợ
Sai thợ đúc lưỡi rìu bằng bàn tay
Thân rìu bằng cây lảy trảy
Ba anh em nhà lang
Dọn mâm cơm cầu trời
Dọn ra nơi bờ suối
Hết khấn lại vái
Nói nói cười cười
Cầu ma trời cho rơi cho rõ
Để chặt cây cho đổ
Đổ cây cho nghiêng
Phòng ma đằng dưới đánh lên
Phòng ma đằng trên đánh xuống
Nhát một, vỏ cây bén
Nhát hai, vỏ rời rời
Nhát ba, cây chu rơi lá
Cây chu ngả nghiêng
Xiêu bên này, bên kia
Rìu lia đi, lia lại
Cội chu đã ngả
Rễ chu đã trốc
Cây chu lật như đánh chiêng
Đất nung lên như sấm gọi
Cội chu ngã chới với
Dội đi xa xa
O đất mường nhà
Ba đất mường trong
Cùng nghe tiếng cây chu đổ
Chu đổ có gió
Chu ngã có sấm có sét
Chu chết có ma
Thế là
Chặt chu đã chặt gốc
Trốc chu đã trốc rê
Cun Khương kêu trai gọi trẻ
Chặt dây, xâu chạc kéo vê
Bắt ông già chặt cây làm đà
Con gái, con trai ùn ra cùng kéo
Kéo lông kéo lộn
Kéo từ ban sáng
Kéo đên trời trưa
Mà cây chắng chuyển
Lang Cun Khương lại bày:
- "Ai hay bói, thử bói
Ai hay mo, thử mo
Ai tìm được nguyên do
Làm cho chu lay chuyển
Thì được thưởng tiền bạc"
Mọi người ngơ ngơ ngác ngác
Ngó ngược, ngó quanh
Giúp nhà lang tìm được ông mo, ông bí
Ông mo mù mắt, phải có người dắt tay
Có người bón cơm, đút nước
Ông mo hay ao hay ước
Ưước được quả trứng gà
Để ra cúng thánh
Ong bói hai mắt một mày
Tay dài chạm gót
Môi mắm, lưỡi lè ra như con rắn
Ông mo còn thách đòi ăn
Ông bói còn đòi uống rượu
Ăn no, rượu say, nói rằng:
- "Ma cây chu đòi ăn gạo ăn mật
Đòi ăn phổi thẳng Tặm Tạch
Phải lấy đầu lâu rạch làm mõ
Lấy xương nó thay gỗ làm đà
Mường sẽ kéo cây đi qua
Đi hung hung đỡ kéo
Cây mới chịu bỏ gốc
Cây mới trốc khỏi rừng"
Cun Khương nghe rõ lời
Liền sai đứa lính cả
Chạy mau về dinh về trại
Với lấy con dao cán bạc
Vác lấy con mác cán ngà
Đem ra chặt chàng Tặm Tạch.
Lúc ấy
Chàng Tặm Tạch
Quỳ trước cây chu đá lá chu đồng
Bông thau quả thiếc
Cúi mặt chờ chết
Nước mắt nhỏ ròng ròng
Mường nghe thương thương
Chu chương nhỏ nước mắt
Nghĩ lo, nghĩ thiệt
Sợ nhà lang phạt
Chẳng ai dám nói một câu
Tặm Tạch vòng tay ra sau chịu trói
Mồm chẳng nói một lời
Nước mắt cạn rôi
Lòng sôi căm cắm
Y căm giận dữ
Bụng nghĩ thương nơi ăn chốn ở
Nhớ vợ, thương con
Chịu chết vì ma hơn ma quở.
Rùng rùng nổi gió
Có lệnh lang truyền:
- "Hỡi chu, hỡi chương!
Hỡi mường, hỡi nước!
Nhà lang muốn yên
Dân làng muốn giàu muốn có
Phải giết bỏ Tặm Tạch
Chặt xác, xẻ thây
Lấy xương làm đà kéo chu kéo lụi
Chu chương đừng sợ
Mường nước chớ kinh"
Một lưỡi mác vút qua
Đầu Tặm Tạch lăn vội
Máu đỏ xối đất vàng
Lang róc xương làm đà
Lột da xoăn làm dây kéo
Người xúm tay hờ hờ
Kẻ thò tay ướm ướm
Chu rung rung chuyển chuyển
Ông già kéo đằng ngọn
Con trai uốn đằng đầu
Chân trước đạp chân sau
Bước lùi bước giật
Cây chu đi tuồn tuột
Trượt khỏi gò Cai Da, Ký, Ống
Kéo xuống núi Cửa Khổ Ràng Kho
Kéo ra sông ra suối
Kéo đến chân đồi
Lang cho mường nghỉ hơi nghỉ sức
Ông già ngồi nhổ râu bạc
Con gái xõa tóc bắt chấy cho nhau
Người vào núi hái nấm
Kẻ xuống rộc hái môn
Con trai ồn ổn trò chuyện
Bỗng:
Chạc mũi cây chu bị nghiến
Con kiến đòi ăn
Con trăn đòi thét
Con vẹt đòi cười
Con côi đòi có bố
Con chó chạy rông
Con công đòi ngủ
Cun Khương vội gọi mường lại kéo
Mường vừa nâng dậy
Cây chu đã chạy•
Mường vừa ngoái lại
Cây chu đã lao
Cây chu mắc phải gốc cây găng
Cây chu lăn quăng xuống Ang Vận Chiếng
Chìm nghỉm, mất tăm
Cây chu không có mồm có miệng
Nhưng lúc trôi nó có tiếng ẩm âm
Rầm rầm xuống dốc
Đuôi chu ở ngọn đồi Ca Da
Đầu chu cắm ra Ang Vận Chiếng
Người tuột dây ngậm miệng
Người lên tiếng kêu trời
Cây chu chạy trốn rồi
Cây chu trôi xuống sông xuống nước
Mường buông chạc trước
Rồi tuột chạc sau
Chạc dứt tay đau đau
Gai quặc đầu nhoi nhói
Cun Tôi từ dốc đi ra
Cun Tàng từ nhà đi lại
Cun Khương đợi ở bờ Ang Vận Chiếng
Lên tiếng nói rằng:
- "Nhà ta chẳng chịu điều quái
Chẳng làm nên điều gở
Chu này ta không bỏ
Khó này mường phải làm
Phải kéo chu về mường
Phải lặn xuống sông buộc dây cho chắc
Mắc dây cho cân".
Cả mường lặn mò cây chu
Từ lúc trời sáng
Đến lúc trăng mờ
Mò cây chu chẳng nổi
Trói vai chu chẳng nên
Mường đành lên đồi đóng trại
Mường sợ nhà lang giận
Sợ nhà lang đánh đòn
Con trai đau mắt
Ông già chết ngất chết ngơ
Từ dưới nước lên bờ
Quơ tay mỏi lả
Người ngã ngã, xiêu xiêu
Nửa chiều
Lang Cun Khương
Gặp đàn Rái bạc
Tuốt con dao sắc
Cun Khương sắp chém
Rút mác sắc bén
Cun Khương sắp đâm
Rái cá xin van:
- "Xin ông quan
Đừng chém nòi Rái cá
Muốn việc gì lang cứ nói
Gọi việc gì lang cứ kêu"
Cun Khương tra mác vào nắp
Lắp dao vào vỏ
Nói tỏ một lời:
- "Này con Rái đen
Này con Rái bạc
Mày ở đầu nước
Mày ở vũng sâu
Có thấy cây chu trôi đâu không hả Rái"!
Rái thưa:
-"Khi lặn buổi trưa
Lúc qua lòng xoáy
Tôi có gặp có thấy
Đầu cây chu ấy đã hóa ra con Cá Kè
Đuôi rẽ nên con cá Cản
Buổi sớm lượn lờ đi ăn
Buổi chiều bơi quanh Ang Vận Chiếng".
Cun Khương lại bảo:
- "Mách tao thật lòng, mai sau tao chuộng
Muốn uống rượu tao cho uống
Muốn cày ruộng tao cho cày
Muốn ăn quả cây tao cho rừng, cho núi
Mày có buộc được mũi cây chu không"?
Rái thưa:
- "Lặn rồi, chúng tôi xin buộc
Buộc rồi, chúng tôi xin kêu".
Cun Khương lại nói:
- "Này đàn Rái cá ơi!
Buộc được dây vào mũi
Trói được dây vào cây chu
Rái muôn ruộng ta cho ruộng
Rái muốn ao hô, ta cho ao hô
Rái muốn cái gì ta cho cái ấy".
Rái thưa:
- "Ông lang ơi!
Chúng tôi không ăn cơm uống rượu
Chúng tôi không lấy ruộng lây nương
Chỉ xin nhà lang
Tháng tư, tháng năm
Chúng tôi được xé nơm, xé đó
Tháng hai, tháng ba
Chúng tôi được xé nổ tha, nổ chặng("'
Và đẻ con vào bến nước nhà lang"
Nghe lời đàn Rái cá
Lòng nhà lang đã ưng
Bụng nhà lang đã chịu
Đàn Rái cá lặn xuống buộc dây
Nối được dây đầu
Cả mường kéo lật đằng sau
Cây chu nối nôi
Cội chu lên tuột tuột
Vực chu lên một hơi
Trôi một chặng, một đoạn
Cây chu kêu như sấm
Cả mường đánh cồng đánh trống
Kéo chu qua rừng
Qua bãi, qua núi, qua khe
Cả mường kéo chu qua Lài Rô '''
Xuống bến đò Lài Rê (2)
Qua Hổ Dô, Hổ Vành (3)
Qua đồi tranh, làng Kến (4)
Kéo đến Bưa Mu (5)
Kéo chu vòng ra bến Cầm, núi Nán (6)
Kéo chu xuống làm núi con Ai (?
Kéo qua làng Dé 18;
Kéo đến mỏ Xa (9)
Kéo chu rẽ ra núi Kheng núi Cái (10)
Kéo chu khỏi mường Tre '1!)
Kéo chu xộc mường Cốc (12)
Kéo chu qua rộc nhà ông lang đạo Quạng (13)
Kéo chu đi Bến Piệng ('4)
Kéo chu liệng Bến Púng (15)
Kéo chu ra chốn mường Rồng (16)
Kéo chu đi vòng mường khải, mường Be '''
Kéo chu trở về mường Chín (2)
Kéo chu đến đồi Vồng, bãi Pậm (3)
Kéo chu đi thăm giếng mường Vo (4)
Kéo chu ra thăm mường Trắm, mường Tró (5)
Kéo chu đi ngó đồng Vin Vơng đồi Cóm
Kéo chu đi trên mặt bái Dật
Kéo chu tắt chân núi làng Ne
Kéo chu ra sông Tẻ Vót
Kéo chu lọt sông Khôi, bến Lụng
Kéo chu xuống Bái Nại, mường Mặc, mường Quà
Ra thăm mường Trần, mường Trường, mường Um, mường Mộc.
Thấy nóc Chường Lầm, chợ Tráng
Kéo xuống sông Vó Dón, Vò Ly
Kéo đi mường Rậm, mường Khói
Kéo từ mường Côi đến Vó Giò
Kéo qua mường Vang, mường Cừa
Kéo qua bưa gò Rỏ, Nà Ốt
Kéo đến đất Cun Xưa, Đạo Bắp (6)
Kéo đến đền Vua Ông - Kẻ Chợ
Qua Cầu Rắn, đất Rồng
Cầu Rồng, cầu Nóc
Cầu ông Vua ước được
Kéo chu ngược qua núi Tiên (»)
Kéo đến đất mường Quyền, mường Lạng (8)
Gặp con ma yêu tinh đáng xuống
Gặp con ma mộng đánh vào`, muong: `XXV. GIẶC MA MAY, GIẶC MA


Toóng In xua xiệt
Phải lác trưa ná,
Xuồng ôống Long Vương
Van cườn vua rác
Vua rảc phải cho Toong In
Mẫn ma may cướp táng
Mấn ma lang cướp khà, chín khôông, chín hòn.
Lêng tôống ăn cơm loó mời khàng chìn
Vến pền còng ráo khàng răm,
Lụt phâm phâm xì ti nhởn luồng.
Ngay téeng khàng xào
Ti pắt con mài mải phui,
Ti pắt ôông vảo mãi dôống,
Tưa vến rinh, vến traái,
Pắt con rẻt rời mân từa pú nhá.
Pắt khá rá vến cho mấn nổ uông nồ chăẳng.
Toóng In àn mặc xôồng, mặc ào
Xôồng lánh tánh nàng lố cà vén,
Ao rón rén nhơ mang cà mé
Trốc cà khiên lé kée.
Mặt cà ngaáo phè phè chăng chê.
Ma may cho Toóng In mấn xây
Tưa linh ma may ngược pên
Rần lình ma máy lêng nầm,
Toóng In cò máo too too
Cò lưng rôống uồn eo
Từng vôông lêng tôống ná
Lày nhờ têng chú chăm Lang Cun Cân


Toóng In tà khai cà ngaáo chìn pi chìn pai,
Pơi xeo hòn tòn táng tòn khoòng,
Khai tường tải moòng
Lắn xuồng trỉ phủ Long Vương
Cườn Vua Rác cò loóng xương
Cho lêng tèng chôi Lang Cun Cấn.
Cà Ngaáo ti roó táng
Láng láng lình Cun Khương pắt àn
Quềng quàng phải cày lài xen cú
Cà Ngaáo lu lu pôồng nhôồng,
Tường Tải rôồng lênh
Kia moón tang tum queng kèo chán cập cật.
Lật lài xen cứ nhao nhao,
Tường tải nhếu nhaác,
Lao pao pảo Toóng In
Rắng:
- "Cà Ngaáo tà vắc lài
Máng tròi lôi lêng,
Khôông chíu caán
Cà vắc náan cườn tường ti teèng.
Phèeng phéeng pao rinh, pao cửa,
Cò lếng Long Vương Trỉ Phủ
Tứng ham teèng lôô,
Mà khố khá chu chương mướng rác,
Toóng In tà àn lới, àn xiềng
Vua pạc trốc tà vởi meng cho ti,
Pơn khờm tà ướng rảc lênh chân tốn
Pơn hôm tá ướng rảc lêng ăn chiềng.
Pắt lêế con chẳng - chiiến
Poi chiến nhá vua lang Cun
Chắng - chiến pảo véc
- "Lang Cun Khương tang mải teèng trôông
Mẫn cào, mân cơm,
Tưởc rành trốc khôông
Tưởc rấu ngoọc hòn,
Pắt lươnh pắt chẹch,
Lởi ma nhá cho khang,
Tổm ma tốn cho yên cho ẩm,
Rỏ mơi chăng cò lởi ma chín tấm
Chăng rêng vâm lởi xấn chín trưa,
Ma may, ma lang chăng àn chuống
An lới chi con chẳng - chilến
Toóng In chón khàng, chón ngáy
Lêng ngả tôống, ngả khôông toòng traái.
Toóng in tưới tường tải
Ngược tôốn pài toòng rinh,
Troong ngáy reéng khàng pảy,
Rôo rác teèng Cun Khương
Tèeng Dịt Dáng, Cun Tôi
Phà nơi ăn, ngắn ở
Phà tuún loo, roong khoai
Lúc rì, Dịt Dáng muốt ti thăn
Cá Ngaáo nhướng rảc lêng quầy nhày,
Cun Tôi, Cun Táng run pày pày
Phải chíu ngắm ngòi chết oan
Chíu tế cho ma may, ma lang pắt lế.
Tường tái tròi lôi ti
Phặc rác mùi ò e
Xai chi ù ú
Cun Táng tà giải phang cửa quan
Giải lan phang cửa vua
Toóng In chớ ní tà xôống va tổi ràng
Tà thay máng tối hính
Mặt moón, roo mơi chó, xay là xành
Úc tành trành
Lưng rôống váng
Cun Táng chăng mắt ní là lấu Toóng In,
Chăng hay ní là ùn côống nói
Chăng mắt ní là ùn côống pồ
Toóng In tới mù máo toỏ ti xa
Cun Táng ngò laái
Toóng In xẽch gươm ngá ti pao
Cun Táng ngò xeo.
Lô lô Toóng In mời vée:
- "Oi, eng Cun Táng
Lâu Toóng In ní chết chương
Chết phếnh, chết rù
Tể pa ùn eng nhá ngái cò nhá lúi, nhá chu,
Xí mà các ngái eng lốm xiêng
Chăng xém tơm hương, xớ khòi.
Cun Táng trằng doóng
Loóng păng hăng dừ dừ
- "Ma nó tròi ho dờ dờ
Chăng lế tao xa mà poỏ tỉ
Toóng In rée khôồng khôn, chết xiêng
Chớ ní tang àn mấn xấn chín tôống
Tang là ôông lang chín cơm, chín ná.
Khàng răm ho lởi cho ăn loó trổ
Khàng chìn, khàng mưới ho lởi cho cơm trẵng, cà kho.
Nhá ho chăng cò nói côống ma
Chăng dây do côống ma rôống, xành.
Toóng In măng Cun Táng vằng
Tói tường tải phang
Pão tra:
- "Hãy rôố lình cà kên, cà pôồng
Mặc xôồng lánh tánh
Mặc ào xeng toỏ, xìa
Mau mau kèo lêng nầm khôông cài
Lêng tềng bải khôông con
Tèng úp nhá lang
Pở khí khúng khương àm nàm.
Chu chương mướng rác
Rối mò, cỏ trôồng
Kèo lình tây trưa
Kèo moón tấy khôông
Xím xác Cun Táng
Cò Lang Cun Khương ti trưởc
Tâm phải giặc nó tèng tan giặc rề.
Hô quân tòn phèe
Rao lình teèng rốn
Khôm quân cà nghéng
Ránh lình cà ngaáo
Từa cấm tấu cò xô
Ró là con ma Long Vương Trỉ Phủ.
Lang Cun Khương hô binh teèng trả
Cà toỏ hẻt lêng:
- "Ho chăng àn ở nhá chu
Ho phải chú nhá lúi,
Ho chết ti, chết laái
Tể nhá lang ăn khung, ở leéng
Ho chíu mấn ma chín tôống
Mấn xấn chín cơm, chín loó
An cơm, ăn cà
Moón lởi cổ khàng năm,
Xí mà xân ho
Chắng ay iềng lởi
Nhá ho xiêu lẻe,
Puộc pẻe xiêu xao
Pở trưởc tà lêng xeo
Nhá vua cón teèng
Tâm ho chết xa xành, xa rôống
Chớ ní ho àn mấn vua ôông
Ho là Toóng In vua ùn Trỉ Phủ
Cho rảc lêng chín cửa
Rốố lình lêng chín nhá,
Liến rì,
Lang Cun Khương mừa gươm puộc tua too
Trỏ pao con rôống xeng
Con rôống khoọc lánh tánh toỏ lưng tàng xàng
Tàm dơ dẻn là ùn máng cun lang
Rắng:
- "Con ma toỏ kia,
Hó ma rôống nờ,
Cun Táng dâu phải tha
Nói nhá ho chăng cò quen rôống xành.
Toóng In mừa gươm teèng trả,
Mưa lụt rả rả
Gươm chả ti, gươm chèm laái
Gươm chạch chiêu, gươm chéo chăm.
Toóng In băn nhăn
Khửc măng miệt kiệt
Phải chắn xù mặt
Puông lật khừa tôống
Lang Cun Khương páng gươm xeo
Toóng In nháo phang khôông cài,
Con rôống chết lanh khừa pài


Rôống khày tất tung túng túng,
Giặc ma may tà xua
Giặc ma lang phải pu vến pên
Têê laái xác rôống lành tành
Chết hồi xầm cả mướng,
Cò con ác kỉa xương
Côông xịt rôống vến trày phúu Hang Trôồng
Côông xịt rôống vến phúu Chúa Chiến Hang Hao.
Trao vài con rôống
Từng chấu chôông vôông trêng nooc nhá nghé pở rì,
Vua Trới khen tán ác
Cho ác àn pở ní
Ăn loóng, ăn xịt
Ay nàng moong khừa khôông
Ay phổch loóng khừa pên
Phải dên loóng rọch
Mới con ác tềnh ăn,
Giặc ma trưa tà ngăn
Giặc ma may, ma lang tà triệt,
Nhá lang tà liệp liệp
Mướng rác tà khang
Cun Cấn rởc Dịt Dàng
Vên Tôông chí tam quan kẻ chớ.`, context: "Vượt qua thử thách bệnh tật dịch bệnh hoành hành thung lũng cổ xưa, thầy Mo cúng chữa bệnh trừ tà giữ sức khỏe cho dân làng hanh thông thái bình." },
  { id: 20, name: "Làm Nhà Chu", epoch: 4, kinh: `XX. LÀM NHÀ CHU
Lang Cun Cần cho thịt trâu, thịt bò
Cho làm cơm, làm rượu
Để làm vía cho Cun Tôi, Cun Tàng, Lang Cun Khương
Rượu thơm cùng uống
Thịt nướng cùng ăn
An xong Lang Cun Cần liền bảo:
- " Bây giờ,
Bố muốn làm nên cửa
Bố muốn sửa nên nhà
Bay phải đi mọi nơi
Tìm lấy mười ba người thợ khéo
Vê đóng kiệu đóng ngai
Đóng xà vàng, xà bạc".
Ba con được lời
Đi ngược đi xuôi
Tìm được mười ba thợ khéo
Đã đẽo nên cột
Đã gọt nên kèo
Bào nên xà dọc
Rọc nên xà ngang.
Nhưng dựng nhà mấy lần đều đổ
Đào ba mươi sáu lỗ mà dựng cột không nên.
Ba anh em
Lại đi khắp chu chương mường nước
Tìm rước về một ông Ậu mo (1).
Đầu Ậu có ba xoáy
Gáy Ậu có cánh dơi
Tai Ậu mỏng như chiếc mộc nhĩ.
Ậu ăn, Ậu nghỉ
Ậu để trứng gà lên vành tai
Để tay lên sống mũi.
Bói rằng:
  - "Nai đen bò vàng
Lợn lang trâu bạc
Ốc lặn ngoài đồng
Việc nhà ông lang.
Phải thịt năm trâu đen
Thịt năm con trâu bạc
Cúng ma ông, ma tổ
Cúng ma cố, ma bà
Cúng ma rừng, ma núi
Cúng ma chu, ma lụi
Lễ mường trời năm phương
Lễ mường đất tám hướng."
Nghe bói rành rành
Biết cành có lá
Biết cá có vây
Biết việc nhà này có chuyện.
Ba anh em ra bến
Về đến cửa đến nhà
Tâu lại vua cha
Những lời mo dặn
Xong cúng, xong lễ
Lang Cun Khương đánh cồng đánh trống
Hò mường nước đến dựng nhà chu
Thể rôi
Nhà chu dựng nên rộng rộng
Trước vườn dựng nhà Khú, nhà Rồng ('
Đàng trong dựng nhà Long, nhà Phụng
Dựng nhà dài ngoài hiên
Làm nên nhà tiếp khách
Đặt nên nhà ăn làm
Làm kho lúa, kho muối
Làm kho mắm kho bát
Chín ngăn kho vàng.
Mười ngăn kho bạc
Làm ngăn kho súng
Làm vùng diêm sinh
Dựng dinh Cun Tồi
Dựng trại Cun Tàng
Xây bếp bạc
Xây ngõ vàng
Cho Lang Cun Khương
Dựng được nhà cun lang kẻ Chợ
Làm nơi ăn, chốn ở
Cho nàng Dặt Cái Dành chăn tằm ươm tơ
Xây nên cửa Đông
Trông lên cứa Tây
Xây nên cửa Bắc
Đắp nên cửa Nam
Xây nên thành Đồng chì tam quan kẻ Chợ
Có chín nhà chứa ngựa
Có mười nhà chứa voi
Xây nhà đủ cho một vạn lính
Giữ thành cun lang kẻ Chợ


Nhà chu làm xong
Nhưng nhà chu chưa sáng
Trong nhà chu chưa rạng
Ngoài nhà chu chưa vàng
Lúc ấy
Nghe đồn rằng:
Có nàng Sông Đón
Đẹp lắm đẹp ghê
Má nàng đỏ như hoa
Tay nàng trắng như nõn chuối
Gót chân hồng như trứng gà
Nhưng nàng đã thương chàng Khán Đông
Chẳng đến phần ai thương nữa
Lang Cun Cần nghe đau trong dạ
Nghe mỏi trong ngực
Nghe tức trong lòng
Muốn lây nàng làm vợ
Nhưng không có mẹo
Rồi lang khéo nghĩ nên mưu
Bắt chàng Khán Đông
Phải lội xuống sông
Tìm rùa vàng, nộp nhà lang
Khán Đông ăn ngủ không yên
Ngày đêm ứ rũ
Cơm không buồn nuốt
Sáng đi thăm ruộng
Chiều đi săn muông
Lúc nào cũng chỉ nhớ nàng Sông Đón
Chàng thổi sáo ôi
Gọi người tình lại
Nàng Sông Đón tới
Cùng ngồi ăn trầu
Rủ nhau ăn quả mơ, quả quýt
Khán Đồng nói lại lời Cun Cần
Đã bảo nên, dặn có
Khán Đồng nhớ thì nhớ
Sông Đón thương cứ thương


Hẹn nên tốt đàng chồng vợ
Thế trắc thế trở
Không lấy được nhau
Thì cùng ăn lá ngón (''
Một hôm đi làm rấy
Khán Đồng gặp rùa vàng
Chạy về bắt lấy
Rùa ra sức chạy
Chui vào hang đá đen đen
Khán Đồng đút tay theo
Bỗng hàm đá ập lại
Tay mắc vào đá
Chẳng thể rút ra
Chẳng có ai mà kêu cứu
Lúc đó, con chó vắn vện
Đến bên chủ nhìn
Chó chạy xuống, chạy lên
Con chó thương chủ
Khán Đồng liền bảo:
- "Vện ơi, chạy về nhà
Cắn váy nàng Sông Đón
Lôi đến cứu ta"
Nghe xong lời chủ
Vện chạy qua đồng
Vện băng qua sông
Về tìm nàng Sông Đón
Nàng đến đầu dốc
Mắt đã đỏ ngầu
Nàng gục đầu vào đá
Khóc chuyển núi rừng
Truyền đến tai ông Bụt
Bụt hiện lên bảo rằng:
- "Hỡi con gái yêu!
Hỡi con chiều, con chuộng
Chớ khóc lắm mà già
Đừng khóc nữa mà khổ
Ta biết con có hiếu


Ta hiểu con khôn ngoan
Ta sẽ cứu chồng con
Hai con đừng buồn nữa.
Bụt vẫy tay khe khẽ
Đá té nhào nhào
Khán Đồng phủi tay choáng váng
Vội khoe với nàng Sông Đón:
  – “Bụt cho ta rùa vàng.”
Sông Đón và Khán Đồng
Được rùa, mừng lắm
Khán Đồng nghe tiếc của
Chẳng muốn nộp lang.
Nhưng không nộp rùa vàng
Thì mất nàng Sông Đón
Khán Đồng đành đem đi nộp
Xẩm tối mang rùa sang.
Nhà lang mừng quá
Hớn hở túm lấy rùa
Không đòi lấy nàng Sông Đón nữa
Lang Cun Cần sai người đi tìm thợ.
Nấu nước rùa vàng
Đi tắm khắp nhà chu
Từ đó
Sáng mái, sáng nhà
Sáng kho, sáng trại
Sáng ngai, sáng kiệu
Sáng chiếu, sáng giường
Sáng Đông, sáng Tây
Sáng Nam, sáng Bắc.
Một hôm
Nhà lang bắn pháo, tháo ống lệnh
Rồi cho đứa lính cai cả
Và đứa ở cai hầu
Đi mời các ông mường Bi, mường Vang
Mường Thàng, mường Động
Mời những ông mường lớn nhất
Đến ăn mừng nhà chu.
Khi nhà chu đã sáng tỏ
Ngõ nhà Chu đã sáng tường.
Sáng nhà Chu sáng cả binh mường
Sáng cửa, sáng người
Sáng trời, sáng đất
Thế mới thật nên nhà ông Cun, ông Quan
`, muong: `XX. MẤN NHÁ CHU
Lang Cun Cấn nàng tru nàng pó
Cho mấn cơm, pốc ráo,
Tể mấn vài cho Cun Tối, Cun Táng, Lang Cun Khương
Ráo hơm tếu oòng
Xịt nàng tếu ăn
Ăn xoong, Lang Cun Cấn mời pảo:
- "Chớ ní
Pồ mònh mấn rêng cửa
Pô mònh sửa rêng tún, rêng nhá,
Pay phải ti khôm chu chương mướng rảc,
Xím lế mưới pa ôông xơớ khèo
Vến toòng kiếu, toòng ngai
Toòng xá đai váng đai pạc.
Pa con àn xiêng àn lới
Ti ngược ti xuôi
Xím àn ngay mưới pa khá xớơ khèo
Tà vàn rêng tôố
Tà vô rêng kẻe.
Páo nhẻ rêng tón xay
Mấn rêng xá tung quay ngang doọc,
Rỏ mơi xooc nhá, nhá lày lở
Táo pa mươi phàu lồ mà tứng tôố nhá chăng rêng,
Pa ùn máng nhá lang
Lày tí khẩm chu chương mướng rảc
Rởc àn mộch ấu mo
Âu mo cò pa khoày
Nhói xắc nhơ càng phin phin,
Xai ấu moỏng đên nhơ cày tồn tồn,
Ấu ăn, ấu nghỉ
Âu tể trờng kha lêng véng xai
Tể ngòn xay nhay khôốr.g mùi


Pòn vée:
- "Rai dấm, pó váng
Cùn lang, tru pạc,
Ốc ngạc vái tôống
Việc pua nhá lang
Phải nàng răm tru dấm
Nàng xâm răm cày tru pạc.
Lởi tra ma ôông, mà cổ
Lởi ma cổ ma múu
Lởi ma khù, ma tôn
Lởi ma chu, ma lúi
Lởi mướng trớt răm pang
Lởi mướng tất xàm vàng.
Măng pòn xật ngật
Mắt céng cò là
Mắt tờng cà cò mang
Mắt pua ní nhá lang cò thưứ.
Pa ùn máng xa pền
Vến tềng cửa, tềng nhá
Tâu lái vua pồ
Lới ôông mo tà páo.
Xoong mo, xoong cảo
_ang Cun Khương tà doòng côống tèng trồng
Tê mướng rác têng nơng nhà chu
Xí rối.
Nhá chu tưứng rêng tàng ráang
Trước àng tứưng nhá long, nhá phướng
Tưưng nhá đáai vái hiên
Mấn rêng nhá tiểp khẻch,
Tệch rêng nhá ăn, nhá mấn,
Mấn kho loó, kho vằm, kho vòi
Mấn kho toói, khi khinh,
Chìn ngăn kho váng,
Mưới ngăn kho pạc,
Mấn ngăn kho khùng
Mấn púng diêm khinh,
Tương rinh Cun Tối,
Tứơng tráai Cun Táng
Mấn pếp pạc, pếp váng
Cho lang Cun Khương
Tứơng tà àn, tà rêng nhá cun lang kẻ chớ.
Mấn xa nơi ăn, ngắn ở
Cho náng Dặt Cài Déng ruôi xắm, xiết kèn
Xây àn nhá táng đông
Voông lêng cứa Tây
Xây àn cửa táng Bắc
Tắp rêng cửa táng Nam
Mấn rêng cày thánh tôống chí tam quan kẻ chớ.
Cò chin nhá cho ngưứa
Cò mưới nhá rán voi
Xây nhá phui phay cho mộch ván từa linh.
Tể chín lế thánh cun lang kẻ chớ.
Nhá chu mấn tà xoong
Roỏ mơi nhá chu chưa tràng
Nhá chu chưa tàng ráng
Nhá lang chưa òang òang cớ ní.
Lúc rì,
Măng tồn dốn
Cò náng Khôông Dón
Xổch phon phon lằm lằm,
Trày mà păng hăng
Xay trằng nhơ ngồn loòng.
Càng coch nhơ trờng cày kha.
Rỏ mơi náng tà phui xim eng cháng Khàn Tôống
Chăng tềng xay ay xương nữa.
Lang Cun Cấn măng tau troong nò
Măng mỏi troong rương
Măng puốn troong lắng
Mònh lế náng mấn du dá cài con,
Mơi chăng cò meéo
Rối lang khèo nhèo rêng miu
Pắt eng cháng Khàn Tôống
Phải lôối xuồng khôông
Xím ré váng nộp nhá chu cho àn.
Khàn Tôống ăn tảy chăng rêng
Ngáy têm ột rột
Cơm chăng mònh roọch
Khớm ti thăm tôống
Khuống ti thăm moong
Lúc nó í ngoong ới náng Khôông Dón
Eng thổi phào ôi văn vắn
Rôố xim rờ laái,
Náng Khôông Dón tà tềnh
Têu vở trú nang
Rủ phố ăn trày mư, trày mín
Khàn Tôống chiến laái lại Lang Cun Cấr
Tà pảo rêng, răắn cò,
Khàn Tôống nhờ xì nhờ
Khôông Dón xương xì xương
Hén rêng xốch táng cày táng dôông
Tà pôông lôông xàng ngàng
Lễ phố chăng àn
Xì ăn là ngòn xeo phô.
Mộch ngáy ti mấn roóng chơm ăn
Khàn Tôống tồn tra con ró váng
Tung ngoăng pắt lế,
Con ró chắn lể kể
Tuông pao hang phúu dấm
Khàn Tôống xâm xay xeo
Xì hám phúu ngạp laái
Xay vắc pao phúu nhày
Chăng chày chò xa
Lu loa ay cho rêng, cho àn,
Lúc rì, cò con chò vến
Têng ôống chủ vút vắt văn ruôi,
Chắn xuôi, chắn ngược
Chò xương chùa xật
Khàn Tôống pảo chờ:
- "Choò ới, chắn vến nhá
Chăng lế chân vằn náng Dón
Tách náng tềng ní choò ời
Măng xoong lới chủ
Chò pửa qua tôông
Pươi qua khôông
Vến xím cho têng náng KhôôngDón
Náng têng ngôn choòng
Mặt tà ngấu ngâu
Náng ủ lế phúu
Nhám hỉ nhám hương
Chiến têng xai pụt
Pụt hiến lêng pảo:
- "Con cài yêu ới!
Con phui con ngọch
Tứng má nhám chi cho rá rỏ,
Tứng nhám ư ở cho xiệt xân
Pụt mắt con cò lắng
Pụt xương con cò nói
Rối pụt chừa cho chàu con
Han con tứng ỉu xiu
Pụt mày xay khè khè
Hàm phúu tà nhè he
Khàn Tôống phủi xay nhà hơ,
Dẻn phố lô ôống náy Khao Dón.
- "Pụt cho ha ró váng
Eng cháng côống náng àn con ró mớng rờ rờ
Khàn Tôống măng tợt của lằm
Chăng mònh nộp cho nhá lang
Mơi chăng nộp con ró váng
Xì vẩt cho lang cày náng yêu Dón nì
Khàn Tôống xâm xì ti pao nộp ró
Chớm nớm khuống tom ró pao
Nhá lang nhao nhao mớng rờ,
Phờ phờ chỏch con ró,
Chăng tói pắt náng Khao Dón mấn chi.
Nhá lang khai moón ti xím xớơ
Nồ rảc con ró váng
Dom rác xôm nhá chu, nhá lúi
Pở rì,
Khoàng màng pài, tràng mài nhá
Tràng kho, rưng traái,
Tràng ngai rừng kiếu
Tràng chiều, rừng giướng
Tràng đông, raáng Tây
Tràng nam, rừng Bắc.
Mộch hôm,
Nhá lang pành phào, thào ôồng lếng
Rối cho từa lình cai cả
Và lấu ở cai hấu
Ti mới cảc ôông mướng Pi, mướng Vang
Mướng Tháng, mướng Tôống
Mới ôông mướng náy nhất
Tềng ăn mớng nhá chu
Pở ní, nhá chu tà tràng khoàng
Ngỏ nhá lúi tà tràng hình
Tràng nhá chu, tràng queng binh mướng
Tràng cửa, tràng moón
Tràng trới phon on, tràng tẩt pời lời.
Xí mời rêng tất nhá ôông cun, ôông quan,
Xật rêng tờng cày nhá ôông lang mướng Moón.`, context: "Hoàn thành dựng ngôi nhà sàn gỗ to lớn cho Lang Cun Cần cai trị, thể hiện tài nghệ xây dựng thủ công ghép mộng khớp mộc mạc vô song của thợ xưa." },
  { id: 21, name: "Đốt Nhà Chu", epoch: 5, kinh: `XXI. ĐỐT NHÀ CHU
Từ ngày Tặm Tạch
Bỏ xác trên gốc Chu
Bỏ lại vợ dại, với hai đứa con thơ
Nghe nhà lang ăn mừng to
Thằng Tặm vơ lấy áo
Con Tạch chạy theo anh
Hai đứa đến nhà lang
Đứng ngoài đường mà ngó
Người ta ăn mừng cứa
Sao bố mình đã chết đi
Người ta ăn mừng nhà
Sao bố mình đã chết mất?
Bố có công đi tìm chu mật
Bô có công đi tìm chu sáng, chu vàng
Bố có công tìm của
Bố có công mách dàng
Sao cho ta nhịn đói?...
Thấy Cun Tồi đi tới
Hai đứa vội tránh đàng
Ngỡ bước chân ông lang
Ra đón con của ngươi có công vao cứa
Nhưng Cun Tồi cứ đi nữa
Bỏ qua hai đôi mắt trông mong
Chân đứng đã mỏi
Bụng đói đòi ăn
Thằng Tặm, con Tạch đi dẫn vào sân
Lính cai lôi ngay ra cửa
Đuổi hai đứa ra bờ rào
Thằng Tặm, con Tạch ngó nhau
Rầu rầu đi qua rào, qua ngõ
Trở chân về nhà
Hai đứa còn con nít
Đã biết tức biết căm
Mặt giận nên hầm hầm
Mắt căm nên tia tía
Thằng Tặm cầm một ống xương bò
Giáng mạnh vào mặt trống
Mặt trống thủng mảng lớn
Trống tan, tang rách
Lập tức
Cun Tồi xách gươm cán bạc
Cun Tàng xách kiểm cán ngà
Lăm lăm chực chém
Săn ống xương, Tặm Tạch ném vào mặt lính
Hai đứa nói rằng :
-
"Ới, ông lang!
Bố tôi chịu bỏ xác
Trên đồi Lai Láng, Lai Li
Chết nằm trên đồi chu
Bỏ cửa, bỏ cơm
Bỏ con, bỏ vợ
Mà các ông sao ở bạc
Mà mường nước sao vô tình?".
Mặt các lang ngó theo
Thằng Tặm trèo lên cửa sổ
Cất giọng khân ma bô
Vươn cô gọi ma bà
Khấn rằng:
-"Ma ông ở đâu hãy về nghe cho rõ
Ma bố ở đâu hãy về mà bênh con"
Lập tức
Trời nổi mây đen
U ù sấm chớp
Thắp đèn, đèn tắt
Thắp đuốc, đuốc tàn
Anh em Tặm, Tạch nhảy quàng ra sân
Chạy luôn ra ruộng
Chạy xuống rừng dâu
Chạy vào suối cạn
Chạy ra hón sâu
Chạy vào rừng cao
Chạy ra bãi lớn
Chạy quanh, chạy lộn
Trốn biệt mất tăm.
Nhà lang đến bắt tội mẹ
Tặm, Tạch lại phải mò về
Ra xưng, vào thú.
Cun Khương quay lại bảo Tặm, Tạch:
 - "Bay về bán cửa, bán nhà
Bán đồng gần đồng xa
Mua cho nhà lang chín con khỉ
Một trăm con mèo
Chuộc vạ mới xong."
Tặm, Tạch đi ra
Lòng nghe tức bực
Thương mẹ, giận nhà lang
Bèn đứng giữa đàng kêu khóc.
Ai thấy cũng thương
Người người dừng chân dỗ ngọt.
Thế rồi
Có bà đi gặt
Lật đật quẩy gánh đi qua
Hỏi ra, hỏi dồn:
  - "Cháu ơi, cháu à!
Nhà có việc gì
Mà ra ngồi đây lóc?"
Thằng Tặm chìa tay áo
Lau ráo nước mắt
Nói ngay, nói thật.
Bà đi gặt, rưng rưng nước mắt:
 - "Thôi thôi, Tặm à
Khóc qua đi, Tạch hỡi!
Hai cháu chớ ngồi chốn này khóc lóc
Đừng khóc cho nhục cho nhằn
Đừng khóc nhăn khóc hại
Đừng khóc nhói, khóc thương.
Đã thế
Các cháu hãy buộc rơm vào đuôi mèo
Treo lửa vào đuôi khỉ
Để nó leo lên nhà chu nhà lụi."
Liền đó
Thằng Tặm, con Tạch
Xách gói trở về
Nghe theo lời bà đi gặt
Đặt cách đặt lời
Đã nghe vui trong dạ
Nghe hả trong lòng
Thằng Tặm lội rừng không còn mệt
Con Tạch, lội rậm không biết nhọc
Bắt khỉ, bắt mèo
Buộc vội, buộc vàng
Đốt lửa vào rơm.
Nhà chu đùng đùng bốc cháy
Rực cả núi Con Ai
Sáng cả đôi Lai Li, Lai Láng
Lửa bốc mười chín ngày
Khói toả mười chín đêm
Cháy hết, quèn, hết đất
Cháy hết nhà hết đụn
Cháy đúng kho diêm sinh
Cháy hết dinh Cun Tồi
Cháy sém sập bạc, ngai vàng
Cháy lan ra mường
Cháy quàng ra núi
Cháy cả đồi chăn trâu
Lửa cháy đến đâu
Khói ào đến đó
Trụi rừng, hết cỏ
Nát đá, cạn khe
Anh em nhà lang
Xông ra đuổi chém anh em Tặm Tạch
Nhưng anh em Tặm Tạch
Đã chạy lên núi, lên rừng, vào thung, xuống ruộng
Thăng Tặm biết biến hoá
Con Tạch biết ẩn chui
Ấn vào gốc cây si
Nhà lang đi qua chẳng biết
Mường nước đi đến chẳng hay
Lang Cun Khương vác dao chém lăng nhăng
Chém cội cây si giữa đồng
Cho hả lòng, hả tức
Để hả cơn bực đuổi thua
Không ngờ trong cây si có máu đỏ chảy ra
Máu người hòà máu si trắng đục
Thương thằng Tặm, con Tạch
Biến ra cây, còn máu thật, máu tươi
Máu còn đây mà người chẳng thấy
Máu chảy vào gốc cây cà
Cây cà liền biến ra con moong mật (')
Máu chảy vào bụi rau lôt
Bụi rau lốt biến ra con moong hai (2)
Máu chảy vào trong rừng khăng khai (3)
Rừng khăng khai biến nên con moong ba moong bảy (4)
Có một tia máu ròng ròng
Biến ra con moong biết cười hơn hớn
Con moong lớn tường vường
Cả rừng, cả truông
Không con nào to bằng con ấy
Sấm dậy
Nó mọc móng, mọc vuốt
Sét dậy
Nó mọc mắt mọc tai
Tai nó biết dò
Chân nó biết bò, biết đi
Khoác văn rắn ri ngang lưng, dọc sống
Nó giống con hươu sao
Nhưng nó hay cào hay cắn
Mắt sáng như đuốc như nến
Móng vuốt sắc bén như liềm cắt gianh
Người không thiêng không lành
Ai chạy không nhanh
Thì bị nó bắt, nó vô, nó dăng, nó xé
Từ đó
Khắp mường, khắp rừng
Đều sợ con moong hung ác
đều khóc khi thấy dấu chân moong
Đâu hôm
Con moong bắt lợn, bắt gà
Sang ra
Con moong bắt trâu, bắt ngựa
Nửa ngày
Con moong bắt người đi rừng
Vô người đi đường đi sá
Vồ cả bà Lang Khương đi về nhà ngoại
Bắt ông Lang Vống đi thăm nhà anh em
Mường dưới, mường trên
Phải chạy moong cả đêm cả ngày
Sợ con moong vuốt dài
Mắt lôi hung dữ
Thứ moong gớm gớm
Đi sớm
Moong bắt người đi sớm
Đi chiều,
Moong bắt người đi chiều
Thế là
Chu chương mường nước
Phải sắm giáo sắm mác
Rèn súng, rèn gươm
Đi săn, moong lồ.
Chuyện nhà Chu đã nhọc
Xác nhà Chu đã lìa
Xin nghe chuyện săn moong lồ
Moong quái, moong gở`, muong: `XXI. TOCH NHÁ CHU
Pở ngáy Tắm Tẹch
Lắc xác trêng cân chu
Lác mú du côống han từa rẻt ròi.
Măng nhá lang ăn mớng, ăn rờ
Lâu Tắm phơ cày ào
Con Tẹch nhào xeo eng
Han từa tềng vái phênh nhá lang
Từng vái táng ngỏc ngò
Táng troong máng ăn nhà nhằ


Rêng nó pồ phè lày chết xoi?
Pồ tà côông ti xím xa cân chu tà, là chu tôống
Pôông thau trày thiếc
Pồ cò côông khiếc của chu váng
Pò cò côông rẩn táng
Rêng nó nha lang cho ha nhín tòi?
Kỉa Cun Tối ý ti tềng
Han từa trěng táng
Mớng hụt ôông lang xa tòn.


Mơi Cun Tối cừ ti ngòn ngón
Lác han từ hẩu vòn xeo
Cho từng mẻo nheo
Trôống tà tòi heo, tòi nhòi.
Lẩu Tắm, con Tẹch mài dài ti pao phêng
Khá lình cai mân nhân tềng kèo
Chẻo chén han từa xa táng
Lâu Tăm, con Tẹch ngờ phố máng nháng
Mênh nhênh lày xa từng rác mà ngò.
Trở chó vên nhá
Han từa cón con tha, con rét con ròi,
Xí mà tà mắt xổ cơn dừ pớn chớn
Xổ cơn hớn pờn chớn.
Mặt piền rêng cắm hắm
Lấu Tắm cấm mộch troòng xương pó
Tành phu lu mặt troồng
Mặt trôồng trủng tồ hô,
Trôồng tan, tang trôồng túng.
Lập tức
Xẻch gươm càn pạc
Cun Táng vảc kiểm càn ngá
Làm lăm ti xa chực chèm
Khắn troòng xương
Tắm, Tẹch quăng pao mặt lình,
Han từa mời rẵng:
-
"Ới ôông lang
Pồ mộch tôi chíu lác xi lác xảc
Trêng tốn Lai Làng, Lai Li,
Nâm xi trêng rè chu, rè lúi,
Lác cửa, lác nhá
Lác pá mái cài con
Mà nhá lang nó ở pạc
Mà mướng rác nó ở phôỗng?
Mặc các lang ngò xeo
Lấu Tắm tréo lêng cửa voòng
Lế doóng khàn ma pô
Dân cooc khần mà pồ, ma pá,
Khàn rắng:
- "Ma ôông ở nó hãy vến hầu iềng
Ma pồ ở chiềng nó hãy vến mà bênh con?
Xí là.
Trới rổi cơn mưa dâm
Phâm phâm khẩm nẹt
Tốch tén, tén xắt
Lỏn tiêm, tiêm xói.
Ừn eng Tắm, Tẹch dảy chói xa phèng
Chắn luôn xa tôống
Chắn xuồng rứng cân tô
Chắn pao phu hòn caán,
Chăắn xa hòn khu
Lú pao rứng khăng côốc
Chắn dôỗc xa bải náy
Chắn ti chắn laái
Trồn vẩt khòi vẩt hơi.
Nhá lang păng hăng tềnh pắt xôối mế
Xương mế, Tắm Tẹch lày phải trồ vến
Xa nộp xân, nộp xảc.
Cun Khương pảo lấu Tắm, con Tẹch:
- "Pay vến pán cửa, pàn nhá
Pàn ná cao, rôộc caán
Mua àn cho nhá lang chìn con voọc
Mộch trăm con méo
Xì vá ní mời àn
Naán ní mời xoong.
Tăm, Tẹch ti xa
Măng xổ cơn dừ pắng xắng
Xương xân, xương mế, khét nhá lang cớ rì,
Từng khừa táng nhám hỉ nhám hương
Nhàm xương nhám haái,
Ay kia phè nhám í xương,
Ay í mênh nhênh từng laái loói loọc.
Xí rối xúi xáy cò mú rá ti hài
Phảy triêng xooc ti qua
Hỏi xa tán xôn ha nhám hỉ:
- "Nhám hỉ mấn chi xôn à?
Nhá cò pua chi mà pay xa nhám haái?
Lấu Tắm lế xay ào
Lau rảc mặt kều kào mời vée
Mú rá măng xa í xật xoot rọc.
Mời pảo tán xôn:
- "Thôi thôi Tắm à,
Nhám chi Tẹch ới,
Han xôn tứng ngối nhám chi hỉ hỉ,
Tứng nhám xế pún tá mà xương.
Tưng nhám hương, nhám hooc mà rù,
Tà rêng xí ní
Cảc xôn hãy lễ xooc puộc pao tuôi cày voọc
Lế xoỏc pao tuôi cày méo,
Tể rée leo lêng nhá chu, nhá lúi.
Măng lới chi con xiềng rì
Lấu Tắm, con Tẹch
Xẻch ốch trở pài lái nhá
Trắng lới, trắng lè mú rá tì hài
Páy xiếng rêng mẫn
Han từa phui lơng lớng troong nò.
Han từa măng hả troong xân troong lắng,
Lấu Tắm ước rứng chăng cón mỏi,
Con Tẹch ước hòn chăng cón măng mai,
Pắt àn voọc, àn méo
Puộc xooc nhếu nhếu tung quay tuôi phè
Tổch củi pao tuôi phóng ngớng.
Nhá chu chẵn lêng túng túng
Rớng cả tốn Lán mùn con Ai,
Tràng cả tốn Lai Li Lai Láng.
Chằm mưới chìn ngáy
Khoi háy háy mưới chìnêm,
Chằn hết quân, hểt tẩt,
Chắn hểt nhá, hềt tuún
Chắn luún nhá kho khinh,
Chắn hết rinh Cun Tối,
Chắn khập pạc ngai váng
Chắn puông xa tốn xa xoòng
Chằn cả àng tru ăn,
Củi lan tềnh pứng nó
Khòi chua lua tềng rì
Rế rứng rế cỏ
Raạch phúu, cán hòn,
Ừn máng nhá lang
Tung hoãng que chèm lấu Tắm, con Tẹch,
Rỏ mơi, ùn eng Tắm, Tẹch
Tà chắn duông trêng tốn, xuồng rôộc, trưa ná.
Lấu Tắm mắt piền hoà
Con Tạch mắt ấn che,
Chun pao cố cân khi khừa khà
Nhá lang ti qua chăng hay, chăng kỉa,
Măng mai, Lang Cun Khương lế tao chèm loăng quăng
Chèm nhông nhang pao cân khi khừa tôống,
Cho hả lóng, há dừ
Hả cày khà que rẻt chăng rêng.
Cá ngớ, cân khi cò màu toỏ too
Màu doỏ nỏ chan màu khi
Xương lấu Tắm, con Tẹch cớ ní
Tà piền rêng cân khi cón dom màu xật.
Màu cón ngọt mà loón chăng cón bươn.
Màu phè chảy pao cố cấn cá
Cân cá lày piền xa con moong mệch,
Màu chảy tềnh pún xâu trột
Pún xây trột piền rêng con moong han,
Màu chảy pao rứng khăng khai
Rừng khăng khai piền rêng con moong pa, moong pảy,
Cò mộch tía màu ròi roói
Piền xa con moong mắt cưới hờn hớn.
Con moong náy tướng vướng,
Cả rứng, cả truông
Chăng moong nó cả pắng moong rì.
Khẩm tôông,
Moong moọc moòng moọc pốt,
Phét tèng
Rée moọc mặt, moọc xai
Rai ré mắt roó,
Choó rée mắt pó, mắt ti,
Vềnh vàng lố lí khoang lưng, khoọc rôồng,
Rée í chôồng con hiêu khao,
Mơi nó lày hay cáo, hay cành?
Mặt tràng nhơ môn tiêm, cày nền tràm
Moòng pốt nhơ cày liếm pài cớ nôống?
Phá chăng xiêng, chăng léng
Ay chẳn chăng lanh
Xì rée pắt, xée vố, rée chểch.
Pở rì,
Cả rứng, chu chương
Tếu rưởi rưởi con moong cở,
Tếu lở ngả khi kỉa tồ chó moong,
Trốc hôm
Con moong pắt cùn, pắt kha
Tràng xa, con moong păr tru, pắt ngưứa,
Nửa ngáy
Con moong pắt moón ti rứng,
Vố moón ti táng, ti khà
Vố cả pá Lang Cun Khương ti pơ nhá môống,
Pắt phải ôông lang vôồng ti oong nhá ùn nhá eng
Mướng tìn mướng trêng
Phải chắn con moong cả têm, cả ngáy,
Rưởi con moong pốt dái
Mặt rée lối pung hung,
Xừ moong kên moong cơ.
Ti khờm
Moong bắt moón ti khờm,
Ti khuống, moong pắt moón ti khuống
Xí là,
Chu chương mướng rác,
Phải phằm dào, phằm mác
Rén khùng, rén gươm,
Ti thăn cho xoong cày con moong lố.
Chiến nhá chu tà nhoọc
Xảc poỏc nhá chu tà lía,
Cườn trằng phang rằng khảc
Chiến toọt moong kên, moong cở`, context: "Sự xung đột xã hội nổ ra khi kẻ thù hung tợn phóng hỏa đốt phá nhà Chu. Thể hiện nỗi đau thương và sự căm phẫn kêu gọi nghĩa sĩ đứng dậy dẹp loạn." },
  { id: 22, name: "Săn Moong Lồ", epoch: 5, kinh: `XXII. SĂN MOONG LỒ
Con moong lồ, lúc còn nhỏ bằng con mèo
Nằm cheo queo trong bụi lá lốt
Ngày một, nó bắt gà
Ngày hai, nó bắt lợn
Ngày ba, nó bắt bò
Ngày bốn, nó bắt trâu
Thứ năm dấu chân moong bằng miệng bát
Dấu moong nổi vằn bông chu
Moong nằm sấp thì to bằng nong
Nanh bày, nanh cong nhọn hoắt
Mắt trợn trừng hau háu
Moong gầm như sấm rền
Bước chân ra ruộng
Dấu chân moong bằng sá bừa
Bước chân ra rừng
Dâu chân moong bằng vạt cày
Moong mỗi bữa một to
Moong mỗi ngày một lớn
Moong nằm rừng - kêu là moong mật
Nằm cửa rừng - gọi là moong hai
Nằm dưới gốc chò - gọi là moong bốn moong năm
Năm quanh rừng - là moong sáu
Năm rừng vâu - là moong bảy
Nhảy rừng ổi - là moong tám
Vọt rừng chám - là moong chín
Đến rừng me mịn - là moong mười
Lúc nhỏ ăn nòng nọc
Lúc lớn, ăn gà ăn trâu
An bò, ăn ngựa
Có bữa, vố luôn cả người
Móc con ngươi ăn nhếu nháo
Mỗi ngày moong lồ cao vượt
Mỗi bữa moong lồ to bè
Lội khe không ướt móng
Moong đứng, tột khoang chân trời
Moong ngồi, chiếm mười nương chín rẫy
Moong gầm, trôi cả mây
Moong thét, tan cả mù
Người ta đôn, con moong lồ vênh vang
Ăn chín ngàn rừng xanh ăn xuống
Ăn trăm chốn rừng già ăn ra
Đi vào ăn da
Trở ra ăn thịt
Ăn hết con nít
An đến ông già
Trăm người, trăm nhà
Phải đi sắn moong
Đến sớm ngày mai
Nhà ai không có cơm thì đố lúa mà xay
Nhà ai không có cá thì tát đầm mà bắt
Phải đi sẵn moong
Người mang lưới ba nghìn mắt
Người mang dây ba nghìn sải
Chọn ngày lành tháng tốt
Mà hội chu chương
Sáng ngày hôm sau đi sắn sớm sớm
Đem một bầy chó lớn
Đem một toán chó sản
Vượt qua mười dốc, trăm đèo
Đến đồi lim lớn
Đến chốn si, da
Dấu moong qua
Mọi người theo hướng đó
Họ săn vào rừng gianh
Gặp cây không dám chặt cành
Sợ con moong lồng lộn
Thấy con moong lớn
Mình bằng quả đồi
Vú bằng gò mối
Lông moong vắn vện
Mắt moong rực hồng
Đuôi moong bằng cây vông
Vuốt sắc như gai bố kết
Moong nắm, đồi bé không che hết hông
Moong ngôi, núi lớn không che hệt vu
Đã biết vùng nằm của con thú
Lang Cun Khương và Cun Tàng
Hò đàng dưới hò lên
Cồng săn trên gõ xuống
Moong giật mình luống cuống
Nhào vào rừng vo
Vào gò rừng vớt
Gặp đất rừng giang
Chó sủa oang oang
Cồng phang rối rối
Moong lồ nhào chạy bổ
Moong lồ cố chạy dài
Chui ngay vào núi Kem "
Chui quàng vào núi Khến
Hang kẹp đá chẹn
Kem, Khến giữ moong
Đợi chu chương ập lại
Gậy bổ xuống như rang
Gậy phang xuống như sét
Lây giáo mà đâm
Lấy giáo mà phóng
Chém chết con moong lố
Nhà lang gọi cả mường dựng lên
Một nửa người khiêng đầu đàng dưới
Một nửa người khiêng đầu đàng trên
Mang về nhà lang làm thịt
Người Lào đến trước lấy được da đàng hông
Nên con gái Lào dệt phá đẹp như bông ()
Mường trong đến tiếp, lột da đàng lưng
Nên biết thêu thùa hình lưng ngựa
Người Tày đến muộn
Phải lấy da đàng đuôi
Chỉ biết thêu hình con sâu, con ong
Dân Mường một lòng
Giữ lấy da trước ngực
Nên con gái Mường biết dệt đầu váy con hươu
Thêu được hình yêu yêu để đùm vú
Người Kinh người Chợ
Ở ngái, ở xa
Đến chỉ còn thịt pha, lòng, mỡ
Chặt ống để bỏ
Mở ống để mang
Nên người Kinh biết nấu thịt ngon
Để truyền cho người mường trên, mường dưới.`, muong: `XXII. TOỌT MOONG LỐ
Con moong lố khí nhỏ, xảc pắng cày méo
Tẩy cheo keo troong pún xâu trột,
Ngáy mộch rée pắt kha,
Ngáy han rée pắt cùn,
Ngáy pa, rée pắt pó,
Ngáy pồn, rée pắt tru,
Ngáy răm, tồ chó moong tà pắng cày meéng toói
Lố moong rổi pôông chu
Tảy chập khập, moong náy cớ cày rôồng,
Neeng chồng ngồng, coong coong lẻm lém,
Mặt trớn tráo trớn trẹc,
Moong râm nhơ khẩm tôông,
Pước chó xa trưa
Tồ chó moong pắng poỏc pứa
Pước chó khừa rù
Tổ chó moong pẳng loòng cắn
Moỏng mộch pừa mộch cả,
Moong mộch khờ mộch náy
Tảy ở rứng, rố vée moong mộch,
Tảy cửa rù, rố vée moong han,
Tày tan dan cô củ, rô vée moong mệch,
Têch nhệch tìn cố cân nhá roó, rì là moong pồn, moong răm,
Tảy quân voăn rứng khăng là moong phàu
Tảy cầu rẩu rứng vẩu là moong pảy.
Tảy ở rứng ổi là moong xàm,
Vọt phang rứng tràm là moong chìn
Pền dần rứng mee, rứng miín là mưới
Khí nhỏ ăn ôn ôn,
Khí khôn ăn kha, ăn ngứa
Ăn pó ăn cùn,
Cò pừa nhàm luôn cả moón
Vooc con ngai ăn nhều nhào,
Mổi ngáy moong lố cao tường vướng,
Mỗi pừa, moong lố náy xa ra
Uốc hòn chăng ưởt moòng
Moong từng tột vàng trới,
Moong ngối chật mưới ràn roong,
Moong hoòng trôi cả mân,
Moong rêng tan cả mú,
Maáng tốn vée, con moong lố vềng vàng,
An chìn nghín rứng khăng xeeng ăn xuồng,
Ăng trăm thung rù rá ăn xa,
Ti pao ăn ta
Trở xa ăn xịt,
An hết con rẻt
Ăn tềng ôông rá
Trăm moón trăm nhá
Phải ti thăn moong
Tềng khờm ngáy dao
Nhá ay chăng cò cơm xì tổ ló má
Nhá ay chăng cò cà xì trổ ao, xảt lum,
Tể cò cơm túm ti toọt moong
Vang cày lài xen pa pa nghín mặt
Vang rái buộc pa nghín khải xay,
Choón ngáy xổch, khàng leéng
Mà hồi chu chương
Tràng rớng ngáy khau ti thăn moong cho khờm.
Doong mộch tán chò náy
Loói mộch àng chò thăn,
Măn xeo mưới ngôn u, ngôn choòng,
Tếch rứng khăng lim cả,
Tềnh chá là khi, ta,
Tầm kỉa tô chó moong qua,
Ang thăn vớ vớ que xeo khoòng rì,
Àng thăn que phang rứng tang tang,
Trành phang tôn gieng gieng
Ràng cân chăng tàm pẻe céeng
Ti cho êm êm tể con moong chăng pồng nồng,
Kỉa xật cày moong tướng vướng
Poỏc mếng păng cày pơới pa nghín, tốn pài,
Trày ú cớ cày có mồn
Lôông moong vánh lánh tánh,
Mặt moong han han, hờ hớng.
Tuôi moong păng cân chôông pôông,
Pốt khắc nhơ khoóng chôống quết,
Moong tảy, tốn ủt chăng chee tủa lưng
Moong ngối, tốn u chăng chee hểt ú.
Tà mắt púng tảy cố con moong lố,
Lang Cun Khương, côống Cun Táng
Táng tìn pao có kèo lêng
Côống thăn táng trêng kèo xuồng
Moong vắt cá ngớ pường nhường
Tuông pao thung tang tang,
Chò thăn hanh hanh
Côống phang hổi hổi,
Moong lố chắn hải hải
Chắn mải nhải hắn hắn
Chun nhăn pao tốn Kem
Chun nhen pao tốn Khền
Hang tà kẹp, phúu tà kền
Kem, khên chín mong
Tưới chu chương ập laái,
Câấy pổ xuồng nhơ rang
Câấy phang xuông nhơ phét,
Lễ mác mà tâm
Lễ dào mà puông
Chèm chết con moong lố.
Nhá lang rố cả chu chương tưứng lêng
Mộch nửa moón, rướng táng tin
Mộch vàng moón rướng táng trổc
Dong vến nhá lang nàng xịt
Moón Láo tềng trưởc lế àn ta rôồng
Rêng con mài Láo hoọc chuông àn phài nhơ pôông va
Mướng troong têng, lốt ta lưng mang
Tà mắt xúa nàng lưng ngưứa,
Moón Táy tềng lở pừa Phải lế ta táng tuôi
Rêng tà mắt xúa nàng con rôi, con oong,
Chu chương mướng rảc mộch loóng
Chín lế ta pán rương
Cho con mài Mướng àn mắt chuông lố trốc vằn con rai
Xúa àn lố lánh phui phay túm trày ú.
Moón Chếch, moón Chớơ
Ở ngài ở ngân
Tênh khau, chỉ cón xịt, ta, loóng, mờ
Chạch ổng tế tuôn tra
Vở ồng tể lế vến
Rêng chi, moón Chếnh tà hay nồ ngon tờng xịt
Tể tà là chiiến laái cho mướng trêng, mướng tìn.`, context: "Chiến công lẫy lừng tập hợp trai tráng săn tiêu diệt Moong Lồ (thú dữ khổng lồ phá hoại xóm làng). Minh chứng cho tinh thần đại đoàn kết bất khuất." },
  { id: 23, name: "Đánh Cá điên, qua điên", epoch: 5, kinh: `XXIII. SĂN CÁ ĐIÊN - SĂN QUẠ ĐIÊN
Ớ bãi làm thịt con moong lồ
Còn rớt thừa hai, ba tảng phổi
Đà chó săn ăn phải
Hóa ra chó điên
Đuổi cắn người chu chương mường nước
Ai thấy chó cũng sợ
Nghe chó sủa đã gờm.
Mọi người lại phải đi giết chó điên
Quẳng xác xuống sông, xuống suối
Xác chó bồng bềnh trôi dạt
Cá nuốt vào một bữa
Cá mửa ra một ngày
Cá quay quay, hóa thành cá dại.
Cá dại ở đầu sông Ải (1)
Cá dại ở giải sông Âm (2)
Hôm ấy
Cun Khương đi quăng chài
Cun Tàng đi thả lưới
Gặp đàn cá mương xúm lại
Gặp đàn cá mái kéo vào
Đông hơn đàn kiến
Kín cả mặt sông.
Con cắn vào lưng
Con xông vào bụng
Con đè lưng mà đớp
Con đè vào khớp mà nhai
Con đè vào tay mà cắn
Con tìm trán mà đâm
Con tìm cằm mà đáp
Con sáp lại đằng sau
Con bâu đầy trước ngực
Con dứt dái tai
Con nhai mí mắt
Con cắt sống mũi
Con dụi cánh tay.
Cun Khương tối mặt tối mày
Cun Tàng sứt tai chảy máu
Tìm con dao sâu, dao chẳng đem đi
Tìm dao nắm chì, không mang đi nốt.
Nhớ cây gươm tốt, gươm để ở nhà
Tìm nó xen ba, nỏ ta đâu mất
Cun Khương phát khóc
Cun Tàng kêu trời:
-
"Ới, chu chương
Cứu anh em tôi với!"
Mường Rậm kéo đi rầm rầm
Mường Rộc kéo đến ào ào
Tay kiếm tay dao
Xuống sông chém cá dại
Người thì chém dọc
Kẻ thì phạt ngang
Bầy cá mương dạt sang bên trái
Đàn cá mái kéo về đàng sau
Tướng cá Ngạo định lặn xuống vực sâu
Nhưng đã bị dân mường chặt cổ
Kéo xác lên bờ
Phơi khô dưới nắng
Hôm nay tốt nắng
Bầy quạ khát nước tìm sông
Khô áo, khô lông
Muốn tìm nước tắm
Con quạ nghe mùi nằng nặng
Con quạ ngửi mùi hôi hôi
Nên bay đên tận nơi
Để tìm mồi tìm miếng
Cánh con quạ liệng
Miệng con quạ kêu
Cả đàn về theo
Cả bầy kéo đến
Thấy cá chết trương
ụng như trống cá
ả đàn kéo lài
Ria bụng, rỉa đầu
Bầy quạ ăn no
Xuống sông uống nước
Con bay lên trước
Con bay nối đuôi
Nghe nhức trong đầu
Nghe đau trong bụng
Nó bay về
Đậu nóc nhà quan
Lang Cun Khương váng óc
Cun Tồi, Cun Tàng đau đầu
Sai con ở con hầu
Ra đuổi bầy quạ dữ
Đuổi từ cành rủ
Quạ sang cành cao
Đuổi từ cành xoan
Quạ sang cành sổ
Đuổi từ cành đỗ
Quạ sang cành na
Quạ lên mái nhà
Quạ kêu "Quạ, quạ"...
Cun Khương nghe tức
Nhằm con quạ khoang
Rút tên ra bắn
Tên bay mau mau
Cắm vào trước ngực
Quạ khoang cúi gục
Đôi cánh xoã như áo tơi
Cả bầy quạ kéo đến nơi
Con dang cánh đỡ đàng đầu
Con lấy mỏ cắn lông đuôi
Con bay bên dưới
Con lượn bên trên
Đưa con quạ tướng, khoang ngực
Đưa con quạ tướng, khoang đầu
Bay qua sông sâu
Bay vào rừng rậm.`, muong: `XXIII. THĂN CÀ RỐ CÀ RAÁI, THĂN ẢC QUÀI ẢC KÊN
Ở àng mấn xịt nàng con moong lố
Cón xứa han pa meéng lóm lá
Tán chò ăn phải
Hòà xa chò raái chò rôố
Que cành chu chương mướng rác,
Ay kía chò í rưởi
Măng chò tèe í chớn
Chu chương lày phải ti teèng chò điên, chò rố
Lác xảc chó rố xuồng khôông, xuồng hòn
Chò rồi lòm tòm tôm phôm,
Cà lồm pao mộch pừa
Cà vả xa mộch ngáy
Cà loay loay piền rêng cà daái.
Cà rố ở ngoón khôông Ải
Cà daái ở dải khôông Âm
Ngáy rì,
Cun Khương ti trẻe chán khôông cài,
Cun Táng ti trẻe lài khôông khu,
Cò tán cà mương mương pu pít,
Cò tán cà mài mài kèo pao,
Nhao nhao hơn tán kiền,
Kin hìn mặt khôông,
Con cành pao lưng
Con tuông pao tá
Con tée lưng mà táp
Con tée khởp mà nhay.
Con tée xay mà cành,
Con xím tràn mà tâm
Con xâm ngâm càng càng,
Con ngàng laái táng khau,
Con pu pen táng ức,
Con dốc trày xai,
Con nhay vén mặt
Con cạp khôống mùi
Con tủi cèng xay.
Cun Khương xồn mặt xồn máy
Cun Táng khểch xai, chảy vủ chảy màu.
Xím con tao phàu, tao chăng dom ti
Xím tao nằm chí, í chăng dom xeo nốt,
Nhờ cân gươm cón xổch xì tể ở nhá,
Xím nà xen pa, nà pố táng no rối rà,
Cun Khương bệp nhém
Cun Táng rôô trới:
-
"Ới chu chương mướng rác,
Tứng lác ùn máng mô tôi.
Măng lới chi con xiềng rì
Mướng Rấm, mướng Rôộc kèo tềng nháo nháo,
Xay lú, xay tao
Xuồng khôông chèm cá daái,
Khá xì chèm chiêu táng doọc
Ôông xì thoọc chăm táng ngang,
Tán cà mương tráng táng chăm
Tán cà trang phang táng chiêu.
Tường cà Ngaáo nghều ngào vực khu
Roo mơi tà cò moón pu xeo chạch cooc
Kèo xảc lêng nầm
Tải rằng phoòng cho khô cho khanh.
Mửa ní xốch rằng
Tán ảc toòng dắng nầm khôông
Khô ào, khô lông
Mònh xím rác chày mỏ choỏ cèng.
Con ác măng múi teng
Ac măng múi hôi
Tà păn vến tềng phúng tềng nơi
Tể xím mối xím méng,
Cèng con ác liềng liêng
Meéng con ác quà qua,
Cả tán ác vến xeo
Tán ác cheo chao kèo tềng.
Kia cà chết trềng ềng
Trôông cà nhơ cày troồng
Cả tán cà puông pu
Xia trốc, xỉa tá
Ăn xứa ăn roo
Xuông khôông òng rác
Con nhao lêng trưởc
Con dớc nồn tuôi
Măng nhực troong cỏc
Măng hoỏc troong rương,
Phè păn nhăng vền rù,
Phè lày păn chở vến nhá
Rùm trêng nooc nhá cun quan
Lang Cun Khương măng ác rôố loong tràn
Cun Tối, Cun Táng tau u
Khai con ở, con hấu
Xa que tán ma ảc rì,
Que ở céng xể xể
Ảc lày pể phang céng cao vao,
Que phang céng tu tu
Ác lày pu phang céng phổ
Que phang céng mờ
Ác lày xờ rờ céng na,
Ác lày trở laái màng pài nhá
Lày xa hế rêng râm: "Quà, quá...
Cun Khương tà là măng pực troong nò
Lế nà nhắm con ảc lang
Cang laán xa panh
Laán păn ti nhằng nhắng
Cắm pao ửc con ảc lang
Ác lang páng ngáng lanh quay lở lật,
Han cèng ngật vật nhơ cày ào tơi,
Cả tán ảc kèo tềnh poi
Con trẻe cèng nhoi táng trốc,
Con lế moỏ khốp lôông tuôi,
Con păn nơng nhuôi pang tìn
Con pín táng trêng,
Tưa con ác chua lang ửc
Tưa àn con ác tực lang trốc
Păn ngượch ngượch qua kháo
Păn tao phao pao rứng khăng tằm dắm.`, context: "Cuộc chiến chế ngự dòng nước dữ chống lại loài cá điên và thuồng luồng phá hoại lưới chài, bảo vệ nguồn nước trong mát yên bình cho bà con." },
  { id: 24, name: "Đánh Ma ruộng", epoch: 5, kinh: `XXIV. GIẶC MA RUỘNG
Toóng Ín chết biến nên cây cỏ
Được làm ma giữ đồng
Buổi sớm
Chàng giận Lang Cun Khương
Buổi chiều
Chàng giận Cun Tồi, Cun Tàng
Rằng:
Nói tiếng không giữ tiếng
Ăn lời chẳng giữ lời
Bảo: Để Toóng In chết một nơi
Cho ngôi giữ phân ruộng
Làm ma thiêng cho mưa kéo xuống
Làm ma ruộng để ăn cơm mới tháng mười
Bây giờ đã chín lần cơm ruộng
Đã bảy lần cơm nương
Không thấy nhà lang cúng kiêng
Cun Khương không màng
Cun Tàng không cúng
Cun Tồi không khói xuống
Làng nước không khói hương
Toóng In tủi hờn
Mặt đỏ hăng hăng
Chân đi dữ dữ
Đội mũ bảy mào
Vác dao chín lưỡi
Đi chặt các Cun Tồi, Cun Tàng
Đi xé lòng Lang Cun Khương
Toóng Ín xăm xăm bước vào đồi bái
Hối hối bước vào đổi nhà
Gọi ba hồn Cun Tồi
Gọi ba vía Cun Tàng
Vía ở đâu ra chịu ăn roi cây giang
Chịu mang hèo tre, hèo hóp
Chịu đánh mười chín roi mây
Rồi Toóng In ngồi trên ngọn cây tre sau nhà


Chân gác lên cây đa sau cứa
Lính đầu đen vây kín ruộng mạ
Lính đầu đỏ vây kín cầu thang
Hế cun ra
Là cho lính đánh
Lính Toóng In kéo đặc như cỏ
Cản gió đùng đùng
Nhằm ngõ nhà lang mà đi, mà đến
Có đứa lính cai cả
Có đứa ở cai hầu
D i n g o c h a n c a u
Nó nghe tiếng hú
Nghe tiếng ồn ổn
Nghe ma reo dữ dữ
Ngó thấy ma lố nhố
Súng ná ngênh ngang
Nó chạy vội về dinh Cun Tàng
Sang nhà Cun Khương, Cun Tồi
Cun Tôi hỏi:
- "Mày gặp cáo, đụng hùm
Hay no cơm say rượu
Sao phải chạy lăng xăng?"
Cun Khương hỏi:
- "Mày bị ong khoái, ong bò đuổi đốt.
Trông mặt mày hốt hốt mà ghê?"
Cun Tàng lại hỏi:
- "Mày bị ai chửi, ai chê
Mày bị ai đè, ai doạ
Mà mắt trằng dại dại
Mà má trằng bời bời?"
Lúc ấy,
Đứa lính cai cả
Đứa ở cai hầu
Chắp tay, vội tâu
Kể từng sự việc
Nghe xong, Cun Tàng hỏi:
-''Có giặc mường trên kéo đến
Hay mường dưới kéo về?"
Cun Tồi bảo:
- "Giặc nào thì giặc
Cứ ra ngó xem
Lấy binh ra che, ra đỡ
Ta chẳng phải đất khó
Ta không phải làng nghèo
Mà phải thua, phải thiệt"
Lúc ấy,
Chớp giật nên lũ
Sét phá nên mưa
Người đi ra phải khóc
Cây móc bị ngập
Gà ấp phải sương
Nai đi bỏ đường ăn lá
Rái cá theo hâu
Con bò, con trâu không chịu thở
Cây cỏ thắng làm cành
Cái nồi, cái sanh không làm quai
Lang Cun Khương đoán biết:
- "Chẳng phải ma gì
Không phải ma ngoài giặc lạ
Chính là Toóng In làm giặc
Nó làm giận làm dữ
Nó đánh trẻ đánh trêu
Ơi binh mường!
Hãy mau mau dẹp yên
Chặn quân trên rừng tràn xuống
Đánh tan giặc ma ruộng tràn về".
Lúc ấy,
Toóng Ín cho ông tướng rắn đi nghe
Tướng rằn chạy về vội bảo:
- "Ông ơi, ông à!
Nhà lang còn bày rượu
Nhà cun mặc quần áo vội vàng
Binh mường đến ùn ùn
Dân mường đến lũ lữ".
Lập tức,
Toóng In thúc quân ma đi vội
Hội ma binh mau mau
Cắt cứ:
Lũ ma đó ăn sáng
Đi đánh phía mặt trời mọc
Lũ ma có nọc ăn trưa
Đi đánh phía mặt trời lặn
Ma rắn đánh vào phía cửa
Ma lửa đánh vào phía rừng
Ma mỏ vàng đánh vào sân
Ma tám chân trèo lên đánh nóc
Từ cửa đánh vào
Chặt đầu chém cổ
Đứa ở mặc đứa ở
Kẻ hầu mặc kẻ hầu
Đụng đứa nào, chặt đầu đứa ấy
Để nhà lang biết thân
Lo nuôi thân, giữ mường nên yên nên ấm
Khi ấy
Bên nhà lang
Quân Cun Khương kéo đi ra rả
Cắt Cun Tồi giữ vườn.
Cắt Cun Tàng giữ chặng
Đến đêm, đụng lính Toóng Ín giữa ruộng
Rạng ngày mới đánh nhau
Rừng cây đố ào ào
Khói đen cuộn cao, cuộn khắp
Toóng In đuổi Lang Cun Khương
Ra giữa rừng cây sếu
Đến bên sông Rồng
Lang Cun Khương quay lưng đánh trả
Toóng Ín đập rồn trăm roi
Cun khương đánh dài trăm dáo
Toóng In toạc quần rách áo
Chân vấp cây ngã dồn
Lang Cun Khương bị rắn cuốn chân
Múa dáo đâm ngang đâm dọc
Thọc dáo, vừa gạt, vừa phang
Toóng Ín bỗng lăn quay xuống nước
Lang Cun Khương muốn đuổi muốn vượt
Đứa hầu bảo: "Rượt chẳng nên
Để Toóng Ín được sống
Nó bỏ kiếm làm ma giữ ruộng
Đã lạn xuông với vua Long Lương
ang Cun Khương gọi binh về mườn
Cun Tồi, Cun Tàng ra chào, ra đón.
Hãy nghe chuyện Toóng Ín đi xuống
Ở mường Thủy phủ Long Vương.`, muong: `XXIV. TÈNG GIẶC MA TRỦA
Toóng In chết piền rêng cân cỏ cỏ
An mấn ma khừa tôống
Pơn khờm
Eng tửc Lang Cun Khương
Pơn khuống
Eng xổ dừ Cun Tối, Cun Táng,
Rắng là:
Vée xiềng chăng chín lế xiềng
Ăn lối chăng chín tủa lới,
Pảo vée: Tể hoo chềt mộch nơi
Cho ngối chín phấn cơm trưa, ná
Mấn ma xiêng cho mưa kéo xuồng.
Mấn ma tôống tể ăn cơm loo mời khàng mưới.
Chớ ní, tà chìn pơn cơm loó mời
Tà pảy pơn loó roóng
Mà chăng kỉa nhá lang tơm lởi cày chi?
Cun Khương chăng máng
Cun Táng chăng tơm chăng tẻng
Cun Tôi chăng nghéng trẻe hương
Mướng rảc chăng xương xôông cho poòng khòi?
Toóng In xổ dừ pàng cháng
Mặt too păng hăng
Chó ti pờng nhớng
Tưới mù pảy máo
Quảc tao chìn lài
Ti lêng chạch xảc Cun Tối, Cun Táng,
Ti phanh chếch hoóng Lang Cun Khương,
Toóng In xăm văm pước pao tôốn pài
Mài nhài pước tềng tốn nhá
Rôố pa vài Cun Tối
Lôi pảy vài Cun Táng
Vài Cun Khương ở nó xa ăn roi cân tang tang,
Chíu vang héo pheo, héo hoỏp,
Chíu tành coóp nhoỏp mưới roi mê,
Toóng In ngối tê nhê trêng ngoón pheo khau nhá,
Chó các lêng cân ta khau cứa,
Linh trốc dấm pịt kin trưa nhá,
Lình trốc toỏ pịt kìn ngôn man,
Tể Cun xa can
Là cho linh tèng.
Lình Tóng In kìn hìn nhơ cỏ cỏ
Cản xoò túng túng
Nhắm ngỏ nhá cun lang mà lao, mà tềng,
Cò lấu lình cai cả
Cò từa ở cai hấu
Từng ở chân cấu
Rée măng xiềng hù
Xiềng chú phôn nhốn,
Măng ma khỏn la khơn lôi,
Kỉa tán ma bồi dồi
Khùng nà nghếm ngám,
Rée chắn vối têng rinh Cun Táng
Phang nhá Cun Tôi, Cun Khương
Cun Tối poi thăm:
- "Dâu tầm tra húm hay là cào ra
Hay phay cơm, dàng rááo?
Mà chắn lào ngào lướng ngướng?
Cun Khương í poi:
- "Dâu phải oong phài, oong póo xốt
Nó pán mặt dợt dợt pon non?
Cun Táng lày poi:
- "Pay phải ay pời, ay chê
Dâu nế ay que, ay mạt,
Mà mặt tà trăng ợt
Mà ổt ổt cơ nôống?
Lúc ní,
Từa lình cai cả
Từa ở cai hấu
Chắp xay hấu tâu
Lảo lảo vée việc,
Măng xoong, Cun Táng lày poi:
- "Cò giặc mướng trêng kèo tềng
Hay mướng tìn kèo vến?
Cun Tối pảo:
- "Giặc nóo xì giặc
Cừ nháo xa mà hấu
Lế lình xa chee, xa dở,
Ha chăng phải tất khoò
Ha chăng phải chùa nghéo
Mà phải xua, phải xiệt.
Khí rì,
Chởp rệch rêng lù
Phẻt phố rêng mưa.
Moón ti xa hơ hơ lày nhám,
Cân mặc lớ lượt
Kha ổp phải khúng, phải khương,
Rai ti lắc táng ăn là;
Xài cà xeo hấu
Pó, tru chăng chíu thở,
Khăng cả chăng tơm céng.
Nối, seng chăng quai xuộc luộc
Lang Cun Khương ước kỉa:
- "Chăng phải ma gì
Chăng phải ma chi, giặc cỏ,
Ní là lấu Toòng In mấn giặc,
Rée mấn dừ, mấn hớn,
Rée tèng trả tèng trêu,
Ơi chu chương mướng rác.
Mau mau mà dẹp yên cho àn.
Ngàng táng trêng rứng trán xuồng,
Tèng choo rồng ma trưa tom vến.
Lúc ní, Toóng In cho tường xành ti trằng
Tường xành păng hăng vến pảo:
- "Ôông ới,
Nhá lang cón páy raáo
Nha Cun mặc xôồng ào vối váng
Binh mướng túng túng tà tềnh
Chu chương tà dềnh dềnh tấy cửa tấy nhá
Lập tửc,
Toóng In thúc quân ma ti tèng
Déng ma binh mau mau
Cảch cử
Tán ma toỏ ăn tràng
Ti tèng pang mặt ma trới moọc,
Tán ma trè ngoọc ăn khoi
Tèng pang mặt trới vến.
Ma xành tèng pao cửa,
Ma củi, ma cở tèng pang rúng
Ma Mỏ váng xì tèng pao phêng,
Ma xàm chó tréo lêng tèng noỏc,
Pửa cửa tèng pao
Chạch hấu, chèm trốc
Từa ở mặc từa ở
Lấu hấu mặc lâu hấu,
Chám từa no chèm mau từa rì.
Tể nhá lang mắt chề
Tể nhá lang cò ì ruôi binh chiểm mướng.
Mửa ní,
Pang nhá lang,
Binh Cun Khương kèo ti nhả nhả,
Binh Cun Tối chín ngỏ chín vướn,
Cho Cun Táng chín uông, chín chẳng,
Têng pơn têm, tầm tra lình Toóng In chín trưa,
Rớng ngáy mời tèng phôố
Trc cân rà rà,
Khòi dấm nhá nhà lếnh lếnh,
Toóng In que Lang Cun Khương
Xa khừa pưa khăng khền
Tềng pền khôông Rôống
Lang Cun Khương quay lưng tèng trả,
Toóng In tập rả trăm roi,
Cun Khương tênh daái trăm dào,
Toóng In rác xôông, dạc ào,
Chớ pẩp ngào cân, lở vớng,
Lang Cun Khương phải xành quần chó
Múa dào váy vó tâm ngang, tâm doọc,
Choọc dao gạt lày phang,
Toong In cá ngớ lanh quảng xuông rác
Lang Cun Khương mònh ruột
Từa hấu pảo:
- "Ruột í chăng cò rêng
Tể Toóng In àn khỏi, àn khôổng
Rée lác kiểm mấn ma trưa
Tà uốc xuồng ôống vua Long Vương Trỉ Phủ.
Lang Cun Khương rô binh trở pài lài mướng,
Cun Tối, Cun Táng xa cháo, xa tòn.
Tà là trăng chiên Toóng In ti xuông
Ở mướng Trỉ Phủ Long Vương.`, context: "Nghi lễ cúng trừ tà ma phá hại mùa màng lúa nước, gọi vía lúa thiêng trở về đầy bồ đầy kho nâng đỡ cuộc sống ấm no tràn đầy." },
  { id: 25, name: "Đánh Ma may Ma lang", epoch: 5, kinh: `XXV. GIẶC MA MAY - GIẶC MA LANG


Toóng Ín thua trận
Đành bỏ ruộng đồng
Xuống với Long Vương
Kêu xin Vua nước.
Vua nước bèn cho Toóng Ín
Làm ma may - cướp đường
Làm ma lang - giữ sông giữ bến.
Lên đồng ăn cơm mới tháng chín
Về bến, uống rượu tháng năm
Lũ ầm ầm thì đi chơi, đi dạo
Ngày lạnh, tháng ráo
Đi bắt con gái mải chơi
Đi bắt con trai mải nhởi
Đưa về dinh về trại
Làm lính cho quan Ba Ba
Bắt con nít làm đứa coi nhà
Bắt ông già về làm uông làm chặng (1).
Toóng Ín được mặc áo mặc quần
Quần rộng vằn lưng cá chép
Áo đẹp tựa vây cá mè
Đầu rõ đầu cá trê
Mắt lè lè cá ngạo.
Ma may cử Toóng Ín làm thầy
Thầy dẫn lính ma may ngược bến
Thầy dẫn lính lên bờ
Toóng Ín có mào đỏ to to.
Co ro lưng rồng uốn éo
Đứng trông lên nẻo ruộng
Toóng In sai cá Ngào chín vây
Bơi theo suối dò đường dò lối
Sai tướng Ba Ba
Lặn xuống thủy Phủ Long Vương
Xin vua nước hãy thương
Cho đánh Lang Cun Cần
Cá Ngào đi dò đi xét
Bị lính Cun Khương tóm được
Bị mắc lưng vào chài bảy thước chín gang
Cá Ngào gọi oai oái
Tướng Ba Ba ngoi vội lên
Thây người ta kéo chài giật giật
Lật lưới ào ào
Tướng Ba Ba bổ nhào
Lao về tin cùng Toóng Ín
Rằng:
- "Cá Ngào bị bắt lôi lên
Cá phải chịu đồng
Sông đành chịu cạn
Cá Ngào mắc nạn
Xin tướng cất quân
Đánh vào dinh vào cửa
Có lệnh Long Vương Thủy phủ
Chớ đánh nhau lâu
Mà hại chu chương mường nước".
Toóng Ín đã được tiếng
Vua Bạc Đầu đã mở miệng mở lời
Ban sớm dâng nước lên chân đồi
Ban chiều dâng nước lên ăn giếng
Bắt lấy con chiền chiện
Hỏi chuyện nhà cun lang
Chiền chiện bảo rằng:
- "Lang Cun Khương đang đánh trống
Làm gạo, làm cơm
Đơm đăng đầu sông
Đơm đó đầu nguồn
Bắt lươn bắt chạch
Cúng ma nhà cho sang
Cúng ma làng cho yên
Nhưng không cúng ma giữ đầm
Không có cổ cúng thần giữ ruộng
Được lời chiên chiện
Toóng In chọn tháng chọn ngày
Lên ngã đồng, ngả sông đóng trại
Toóng Ín chờ tướng Ba Ba
Ngược đồi bái đóng dinh
Đúng ngày lành tháng bảy
Gọi nước, đánh Cun Khương
Đánh Dịt Dàng, Cun Tổi
Phá nơi ăn, ngăn ở
Phá đụn lúa, nương khoai
Lúc ấy Dịt Dàng bận đi săn
Cá Ngào kéo nước lên quấy
Cun Tồi, Cun Tàng lấy bẩy
Đành chịu chết oan
Chịu để ma may, ma lang tóm lấy
Tướng Ba Ba trói lôi đi
Mũi sặc nước phò phè
Tai nghe u ù
Cun Tàng bị giải sang cửa quan
Giải sang cửa vua
Toóng ín đã đổi dạng
Đã thay mạng đổi hình
Mặt người, nhưng tay chân vẫn như rồng rắn
Ưc trắng lang
Lưng rắn rồng.
Cun Tàng không biết đó là Toóng In
Không biết đó là em cùng nòi
Chẳng biết đó là người cùng cha
Toóng In đội mũ mào đỏ đi ra
Cun Tàng ngó lại
Toóng Ín xách gươm ngà đi vô
Cun Tàng ngó vô
Lâu lâu Toóng In mới nói
-
"Ới ới! Anh Cun Tang
Thằng Toóng In này chế chương
Chết nhũn, chết xác
Để ba anh có gác tía nhà chu
Ây thế mà ba anh lại nuốt lời
Không thèm thắp hương, cúng khói".
Cun Tàng nghe xong
Lòng bừng bừng nổi giận:
- "Ma sao trói tao hờ hờ
Chẳng đưa tao ra mà giết
Toóng In nó sống khôn chết thiêng
Này là thần giữ đồng
Đang làm lang giữ ruộng, giữ lúa
Tháng năm tao cúng cho ăn lúa trổ
Tháng chín tháng mười tao cúng cơm tráng, cá kho
Nhà tao đâu họ với ma
Không dây dưa đưa đến nòi rồng rắn".
Toóng Ín nghe Cun Tàng chửi mắng
Đòi tướng Ba Ba sang
Lệnh răng:
- Hãy gọi lính cá trê, cá bống
Mặc quần văn xanh xám
Mặc áo xanh, tím, sọc đỏ
Chong chóng kéo lên bờ sông Cái
Lên bãi sông con
Đánh úp nhà lang
Khi trời còn mù mù ám ám".
Chu chương mường nước
Kéo binh đầy ruộng
Kéo ngưới đầy sông
Tìm xác Cun Tang
Lang Cun Khương đi đầu
Đụng phải quân nào đánh tan quân ấy
Hô quân đón đánh
Rao lính đánh đồn
Toàn quân cá Ngạnh
Toàn lính cá Ngào
Đứa cầm đầu có râu
Rõ là ma Long Vương Thủy phủ
Lang Cun Khương hô binh đánh trả
Cá đỏ thét to:
- "Ta chẳng được ở nhà chu
Ta phải thù nhà lụi
Ta chết đi, chết lại
Để nhà lang ăn sướng ở lành
Ta chịu làm ma giữ đồng
Làm thân giữ cơm, giữ lúa
Ăn cơm, ăn cá
Người dâng cổ tháng năm
Thê mà riêng ta
Chẳng ai cúng tế
Nhà thờ vẹo vẹo
Lat buộc xiêu xiêu
Lần trước ta lên theo
Nhà vua còn đánh
Đâm ta chết, hóa rồng, hóa rắn
Lần này ta làm ông vua
Ta là Toóng In nơi thủy phủ
Cho nước lên giữ nhà
Hò lính lên giữ của".
Liền đó
Lang Cun Khương múa gươm buộc vải đỏ
Trả vào con rồng xanh
Con rồng sọc vằn lưng đỏ
Vừa mới xưng là kẻ khó
Vừa kêu nói họ hàng
Bảo nó là Toóng in cải dạng
Rằng:
- "Hỡi con ma đỏ
Này họ ma rồng
Cun Tàng mày phải tha
Còn nhà ta, đâu có quen với rồng với rắn".
Toóng Ín múa gươm chém trả
Lũ lụt ầm ẩm
Gươm chặt đi, gươm phang lại
Gươm chặt trái, gươm phang phải
Toóng Ín bải hoải
Sức kiệt tủy xương
Liền chạy lấy mặt
Trốn thoát giữa đồng
Lang Cun Khương lao gươm theo
Toóng In đâm nhào ra sông cái
Rồng chết lăn giữa bãi
Rồng quấy cát bay mù
Giặc ma may đã thua
Giặc ma lang ùa về sông về bến
Để lại xác rồng vằn vện
Chết rũ thối cả mường
Có con quạ thấy thương
Tha thịt rồng về đá Hang Trống
Tha xương rồng về đá chùa chiền Hang Hao
Trao hồn con rồng
Đứng chầu tren nóc nhà, nóc đá ('
Vua trời khen loài quạ
Cho quạ từ nay
Ăn lòng, ăn thịt
Ai mô thịt giưa sóng
AI lam long giữa bên
Phải phơi lòng ruột
Mời qua tới ăn
Giặc ma ruộng đã ngăn
Giặc ma may, ma lang đã diệt
Nhà lang đã mạnh
Mường nước đã sang
Cun Cần rước Dịt Dàng
Về Đồng chì tam quan kẻ Chợ.`, muong: `XXV. GIẶC MA MAY, GIẶC MA


Toóng In xua xiệt
Phải lác trưa ná,
Xuồng ôống Long Vương
Van cườn vua rác
Vua rảc phải cho Toong In
Mẫn ma may cướp táng
Mấn ma lang cướp khà, chín khôông, chín hòn.
Lêng tôống ăn cơm loó mời khàng chìn
Vến pền còng ráo khàng răm,
Lụt phâm phâm xì ti nhởn luồng.
Ngay téeng khàng xào
Ti pắt con mài mải phui,
Ti pắt ôông vảo mãi dôống,
Tưa vến rinh, vến traái,
Pắt con rẻt rời mân từa pú nhá.
Pắt khá rá vến cho mấn nổ uông nồ chăẳng.
Toóng In àn mặc xôồng, mặc ào
Xôồng lánh tánh nàng lố cà vén,
Ao rón rén nhơ mang cà mé
Trốc cà khiên lé kée.
Mặt cà ngaáo phè phè chăng chê.
Ma may cho Toóng In mấn xây
Tưa linh ma may ngược pên
Rần lình ma máy lêng nầm,
Toóng In cò máo too too
Cò lưng rôống uồn eo
Từng vôông lêng tôống ná
Lày nhờ têng chú chăm Lang Cun Cân


Toóng In tà khai cà ngaáo chìn pi chìn pai,
Pơi xeo hòn tòn táng tòn khoòng,
Khai tường tải moòng
Lắn xuồng trỉ phủ Long Vương
Cườn Vua Rác cò loóng xương
Cho lêng tèng chôi Lang Cun Cấn.
Cà Ngaáo ti roó táng
Láng láng lình Cun Khương pắt àn
Quềng quàng phải cày lài xen cú
Cà Ngaáo lu lu pôồng nhôồng,
Tường Tải rôồng lênh
Kia moón tang tum queng kèo chán cập cật.
Lật lài xen cứ nhao nhao,
Tường tải nhếu nhaác,
Lao pao pảo Toóng In
Rắng:
- "Cà Ngaáo tà vắc lài
Máng tròi lôi lêng,
Khôông chíu caán
Cà vắc náan cườn tường ti teèng.
Phèeng phéeng pao rinh, pao cửa,
Cò lếng Long Vương Trỉ Phủ
Tứng ham teèng lôô,
Mà khố khá chu chương mướng rác,
Toóng In tà àn lới, àn xiềng
Vua pạc trốc tà vởi meng cho ti,
Pơn khờm tà ướng rảc lênh chân tốn
Pơn hôm tá ướng rảc lêng ăn chiềng.
Pắt lêế con chẳng - chiiến
Poi chiến nhá vua lang Cun
Chắng - chiến pảo véc
- "Lang Cun Khương tang mải teèng trôông
Mẫn cào, mân cơm,
Tưởc rành trốc khôông
Tưởc rấu ngoọc hòn,
Pắt lươnh pắt chẹch,
Lởi ma nhá cho khang,
Tổm ma tốn cho yên cho ẩm,
Rỏ mơi chăng cò lởi ma chín tấm
Chăng rêng vâm lởi xấn chín trưa,
Ma may, ma lang chăng àn chuống
An lới chi con chẳng - chilến
Toóng In chón khàng, chón ngáy
Lêng ngả tôống, ngả khôông toòng traái.
Toóng in tưới tường tải
Ngược tôốn pài toòng rinh,
Troong ngáy reéng khàng pảy,
Rôo rác teèng Cun Khương
Tèeng Dịt Dáng, Cun Tôi
Phà nơi ăn, ngắn ở
Phà tuún loo, roong khoai
Lúc rì, Dịt Dáng muốt ti thăn
Cá Ngaáo nhướng rảc lêng quầy nhày,
Cun Tôi, Cun Táng run pày pày
Phải chíu ngắm ngòi chết oan
Chíu tế cho ma may, ma lang pắt lế.
Tường tái tròi lôi ti
Phặc rác mùi ò e
Xai chi ù ú
Cun Táng tà giải phang cửa quan
Giải lan phang cửa vua
Toóng In chớ ní tà xôống va tổi ràng
Tà thay máng tối hính
Mặt moón, roo mơi chó, xay là xành
Úc tành trành
Lưng rôống váng
Cun Táng chăng mắt ní là lấu Toóng In,
Chăng hay ní là ùn côống nói
Chăng mắt ní là ùn côống pồ
Toóng In tới mù máo toỏ ti xa
Cun Táng ngò laái
Toóng In xẽch gươm ngá ti pao
Cun Táng ngò xeo.
Lô lô Toóng In mời vée:
- "Oi, eng Cun Táng
Lâu Toóng In ní chết chương
Chết phếnh, chết rù
Tể pa ùn eng nhá ngái cò nhá lúi, nhá chu,
Xí mà các ngái eng lốm xiêng
Chăng xém tơm hương, xớ khòi.
Cun Táng trằng doóng
Loóng păng hăng dừ dừ
- "Ma nó tròi ho dờ dờ
Chăng lế tao xa mà poỏ tỉ
Toóng In rée khôồng khôn, chết xiêng
Chớ ní tang àn mấn xấn chín tôống
Tang là ôông lang chín cơm, chín ná.
Khàng răm ho lởi cho ăn loó trổ
Khàng chìn, khàng mưới ho lởi cho cơm trẵng, cà kho.
Nhá ho chăng cò nói côống ma
Chăng dây do côống ma rôống, xành.
Toóng In măng Cun Táng vằng
Tói tường tải phang
Pão tra:
- "Hãy rôố lình cà kên, cà pôồng
Mặc xôồng lánh tánh
Mặc ào xeng toỏ, xìa
Mau mau kèo lêng nầm khôông cài
Lêng tềng bải khôông con
Tèng úp nhá lang
Pở khí khúng khương àm nàm.
Chu chương mướng rác
Rối mò, cỏ trôồng
Kèo lình tây trưa
Kèo moón tấy khôông
Xím xác Cun Táng
Cò Lang Cun Khương ti trưởc
Tâm phải giặc nó tèng tan giặc rề.
Hô quân tòn phèe
Rao lình teèng rốn
Khôm quân cà nghéng
Ránh lình cà ngaáo
Từa cấm tấu cò xô
Ró là con ma Long Vương Trỉ Phủ.
Lang Cun Khương hô binh teèng trả
Cà toỏ hẻt lêng:
- "Ho chăng àn ở nhá chu
Ho phải chú nhá lúi,
Ho chết ti, chết laái
Tể nhá lang ăn khung, ở leéng
Ho chíu mấn ma chín tôống
Mấn xấn chín cơm, chín loó
An cơm, ăn cà
Moón lởi cổ khàng năm,
Xí mà xân ho
Chắng ay iềng lởi
Nhá ho xiêu lẻe,
Puộc pẻe xiêu xao
Pở trưởc tà lêng xeo
Nhá vua cón teèng
Tâm ho chết xa xành, xa rôống
Chớ ní ho àn mấn vua ôông
Ho là Toóng In vua ùn Trỉ Phủ
Cho rảc lêng chín cửa
Rốố lình lêng chín nhá,
Liến rì,
Lang Cun Khương mừa gươm puộc tua too
Trỏ pao con rôống xeng
Con rôống khoọc lánh tánh toỏ lưng tàng xàng
Tàm dơ dẻn là ùn máng cun lang
Rắng:
- "Con ma toỏ kia,
Hó ma rôống nờ,
Cun Táng dâu phải tha
Nói nhá ho chăng cò quen rôống xành.
Toóng In mừa gươm teèng trả,
Mưa lụt rả rả
Gươm chả ti, gươm chèm laái
Gươm chạch chiêu, gươm chéo chăm.
Toóng In băn nhăn
Khửc măng miệt kiệt
Phải chắn xù mặt
Puông lật khừa tôống
Lang Cun Khương páng gươm xeo
Toóng In nháo phang khôông cài,
Con rôống chết lanh khừa pài


Rôống khày tất tung túng túng,
Giặc ma may tà xua
Giặc ma lang phải pu vến pên
Têê laái xác rôống lành tành
Chết hồi xầm cả mướng,
Cò con ác kỉa xương
Côông xịt rôống vến trày phúu Hang Trôồng
Côông xịt rôống vến phúu Chúa Chiến Hang Hao.
Trao vài con rôống
Từng chấu chôông vôông trêng nooc nhá nghé pở rì,
Vua Trới khen tán ác
Cho ác àn pở ní
Ăn loóng, ăn xịt
Ay nàng moong khừa khôông
Ay phổch loóng khừa pên
Phải dên loóng rọch
Mới con ác tềnh ăn,
Giặc ma trưa tà ngăn
Giặc ma may, ma lang tà triệt,
Nhá lang tà liệp liệp
Mướng rác tà khang
Cun Cấn rởc Dịt Dáng
Vên Tôông chí tam quan kẻ chớ.`, context: "Vượt qua thử thách bệnh tật dịch bệnh hoành hành thung lũng cổ xưa, thầy Mo cúng chữa bệnh trừ tà giữ sức khỏe cho dân làng hanh thông thái bình." },
  { id: 26, name: "Lo quần áo", epoch: 6, kinh: `XXVI. ĐƯA VUA VỀ ĐỒNG CHÌ TAM QUAN KẺ CHỢ
Rạng sớm
Hội chu, hội chương
Hội mường, hội nước
Chín đàn trống chiêng đi trước
Mười phương séc bùa đi sau
Có lính đi đầu vác gươm vác dáo
Kẻ dẫn đầu ở mường cây gạo ('
Người khóa đuôi ở đạo Pồng Pêu (2)
Con gái rẩm rì đầu sông
Con trai đã vào núi cái
Ông già đi men bờ rẫy
Bà giải men ruông, men nương
Áo đẹp quần chùng như ong như bướm
Quạ bay, quạ kêu loạn
Bướm bay lại, bướm kinh
Nai thấy nai giật mình
Trút thấy, trút chui xuống lồ
Con cua tọt vào hàm đá
Cá thấy, cá lặn xuống sông
Người mường trên kéo lại
Người mường dưới kéo lên
Nghe rằng:
- "Ai chưa có cơm thì đi giã lúa
Ai chư có cá thì tát đầm tát ao
Sáng ngày hôm sau đi đưa vua cho sớm
Xin mường cho bốn mươi trai tơ
Bốn trục trai thanh
Mặc áo kiệu kẻ vàng
Mặc quần sang nẹp đỏ
Đội mũ mào gõ kiến
Xin mường sắm đủ trống chiêng
Gióng bảy ngày chín đêm
Xin mường lo đuốc lo đèn
Đốt lên cho lụi nắng
Xin mường cho trăm gánh cơm trắng
Xin mường cho chín gánh thịt khô
Mang đi ăn tháng, ăn ngày
Con gái mang vòng bạc đầy tay
Con trai buộc vải vào cổ tay cho hồn cứng cáp
Xin mường đi đủ già đủ trẻ
Có khỏe có gây
Xin mường loan cho nhau hay
Bày cho nhau tường tỏ
Xin mường mang theo gươm có vỏ
Mang theo dáo có chuôi
Để răn bảo đứa nào làm giặc
Xin mường cầm theo mác
Đế phòng giặc loạn đổi chu
Phòng giặc ở bến sông rộng
Thế rồi
Ngôi trên kiệu đòn rồng
Vua trông ra ruộng
Ngó xuống sông bến
Quay lại dòm mường
Chẳng thấy còn có giặc
Chẳng còn vấp nạn ma
Chỉ còn thấy đàn cò bay lượn
Thây đàn bò đi ăn
Thấy con trâu giữa bãi
Thấy con gái vác nước
Thấy đàn vạc đi ăn
Thấy đàn nai chạy rong
Dịt Dàng mừng lắm lắm
Nghe tiếng gáy gà trống
Nó dạy bảo vua
Có về Đồng chì tam quan kẻ Chợ
Vẫn nhớ trở về đất Tổ
Hãy nhớ nơi đất nhà
Ngày rằm đi qua
Ngày xa nhắn đến
Nhớ chốn đẻ được cây si
Cây si chia mường chia nước
Nơi đẻ ra lửa
Nơi đẻ ra nhà
Nơi có cây chu tá, là chu tôông
Bông thau quả thiếc
Nơi có người dạy dệt
Nơi có thơ biết thêu
Thế rồi
Vua lại ngó ra bến
Nhìn lại sông
Thấy người đông ngóng đợi
Đủ mặt đứa ở, con hầu
Đủ mặt kẻ có râu, người đẹp lão
Vua liền vén tay áo
Trỏ tay dặn cụ già:
- "Các ông giải ơi!
Các ông là cha là tổ
Ông quay về cho đỡ
Ở nhà hãy lành sức, lành thân
Đừng quá chân, qua núi".
Ong già cúi lặng nói:
- "Nhà vua chớ ai ngại
Lão còn đưa chân tới ngọn sông
Lão còn đi thông ngọn núi
Muốn tiền vua đến đổi bái
Đưa vua tới cật mường
Dẫu có mục xương, cũng là hả dạ".
Liền đó
Vua lại nhìn xa nữa
Thấy cỏ cây mọc giăng
Lá xanh chồi
Lá mới uốn
Tay vua bè một ngọn
Rắc lá xuống lòng đường
Dặn chu chương làm ăn no đủ
Từ nay về sau
Ngày này ngày đến
Đất đã nên đã tỏ
Ngõ đã nên đã thành
Người hay ăn hay làm
Chuyện đã nên trọn
Đẻ đất, đẻ người
Chuyện cứ nên vui
Ai còn nghe dang dở
Đã nghe rồi nghe nữa
Nghe đến mai sau
Chuyện mở đầu theo năm lành, tháng tốt
Này đất, này mường
Này chu, này chương
Này lửa, này nước
Mặt trời đã rạng
Mặt tháng đã tường ('
Đã sáng chu
Đã sáng chương
Sáng mường
Sáng nước.`, muong: `XXVI. TỦA VUA VẾN TÔỐNG CHÍ TAM QUAN KẺ CHỚ
Rớng tràng,
Hối chu hối chương
Hối mướng, hối rảc
Chìn doóng trôồng chiêng ti trưởc
Mưới phướng púa ti khau.
Cò lình ti tấu quảc gươm, quảc dào,
Khá rẩn táng ở mướng cân cào
Khá ti pọt tuôi ở tất táo Pồng Pêu,
Con mài xăn xeo trốc kháo
Oông vảo tà pao tốn cài,
Ôông rá men mài nhài nầm roóng
Ao xổch, xôồng léng nhơ cong, nhơ pườm pườm.
Ác păn qua chao nhườn nhườn
Pườm pườm păn làng troóng treéng,
Rai kỉa moón chăng chẵn
Xên kỉa moón phải chun xuông hù.
Cua cua tọch pao hám phúu
Cà rù kỉa phải lú xuồng khôông,
Moón mướng trêng kèo laái
Moón mướng tìn kèo lêng,
Măng vée:
- "Ay chưa cò cơm xì ti tấm loó
Ay chưa cò cà xì ti trổ lum, trổ ao,.
Ngáy dao ti tưa vua cho dờm dớm,
Cườn mướng cho pồn mươi vảo chòn
Pồn mươi vảo nôống
Mặc ào kiếu kẻe váng
Mặc xôồng khang nẹp too,
Tôối mù máo èeng mò
Cườn mướng phằm tô trôồng chiêng
Giàng pảy ngáy chìn têm
Cườn mướng loo tô tiêm, tén
Tổch lêng choo luún cày rằng.
Cườn mướng cho trăm triêng cơm chả cào trằng,
Cườn mướng phằm chìn mươi triêng xịt khô.
Vang ti ăn khàng, ăn ngáy
Con mài treo voóng pạc troòng xay
Con từa puộc khái vài cho cừng văn vài luồng.
Cườn mướng ti tô
Rẻt rá non nôống
Cườn mướng pố cho tô
Hó cho khá mắt àn
Cườn mướng vang xeo gươm căm pỏ,
Vang xeo dào cò nằm
Tể khiếc ngăn từa nó mấn giặc
Cườn mướng vang xeo mắc
Tể ngăn giặc tốn Chu
Lo giặc ở pền kháo
Xí rối,
Ngối trêng kiếu tón rôống
Vua ngoòng xa trưa
Ngò tưa xuồng pền
Quay xêm dóm mướng,
Chắng cón kỉa ở no cò poòng cày tán giặc dà,
Chăng cón pẩp pà cày lán tán ma,
Chỉ cón kỉa có có păn la
Kỉa pó pa ăn àng,
Kỉa tru toòng khừa bải
Kỉa con mài quảc rảc vần vắn,
Kỉa tán vạc ti ăn
Kỉa rai chắn duông dờn dớn,
Dịt Dáng mớng lờng lờng,
Măng xiêng kha khôồng cần
Rée rắn pảo vua ha
Cò vến tất tôống chí tam quan kẻe chớ
Phải trật vến tẩt cổ tà
Hảy nhờ chồn tẩt quên nhá
Ngáy rằm ti qua
Ngáy xa nhăm nhe mà tếng
Nhờ lé cày chồn tẻe àn cân khi,
Cân khi tà chia rêng mướng, rạch àn rảc
Púng tẻe xa củi
Tược tẻe xa nhá,
Púng tà cò cân chu tà, là chu tôống
Pôông thau trày thiếc.
Tất cò mù táy chuông pải
Mướng tà cò moón dói cho hay xúa.
Xí là,
Vua lày ngò xa càng pai, càng pên
Hầu vườn laái càng khôông
Kỉa moón đông đông hiên hiến,
Tô mặt từa ở, con hấu
Tô khá cò xô, xổch cồ,
Vua liến vèn xay ào
Ngào xay rắn ôông ráa
- "Cảc cồ tà ới,
Cảc ôông là cốc các,
Oông quay laái cho léng
Ở quên cho ngón xân, ngón nghỉ.
Tứng má qua chó ti xa mấn chi
Ôông rá cùi trốc thưa vée:
- "Nhá vua tứng má cò lo
Óông rá cón tưa chó vua tưa càng khôông, ngón rù,
Mònh tưa vua qua trảng pài
Tưa vua xẩp xài cật mướng
Trắm tró mục xương tà măng hả nò.
Liến rì,
Vua lày hầu xa vôông
Kia cò cân moọc ráng ráng
Là tang xang chôn ngoón,
Là mời uồn mời phoong,
Xay vua pẻe mộch quá
Roi xa loóng con khà
Tể răắn chu chương mướng rác
Van an reng roo
Cơm kho lóo xiềng.
Pở ní vến khau
Ngáy xeo, ngáy tềng
Tất tà rêng tà tỏo,
Ngỏ tà quen, tà khám
Moón tà hay ăn, hay mãn rêng pua cày việc.
Chiến tà rêng khổm rằng
Tẻe tẩt, tẩt páng láng
Tée mướng mướng pờng lướng
Tée moon moón phui phay.
Chiiến cón măng phui
Ay cón trắng lui xui lở cở
Tà trắng, rối cón mònh trằng nửa,
Tủa trắng xeo may khau,
Chiến "Tẻch tất, lẻe rảc" ní
Xeo năm léng, khàng xốch
Tất ới, mướng ới,
Chu ới, chương ới,
Củi nớ, rảc nớ
Mặt trơi tàng raáng
Mặt khàng tưởng vướng
Tà tràng trợt chu chương,
Tà tràng mướng
Tràng rác.
Kỉa noỏc Chướng Lấm, chớơ Tràng,
Kèo xuông khôông Vò Dón, Vò Li,
Kèo chu ti mướng Râấm, mướng Khòi,
Kèo tềng mướng Côi, mướng Gió,
Kèo qua mướng Cưứa, mướng Vang,
Kèo chu qua pưa có Rỏo, Ná ổt
Kèo xa tất Cun Xưa, táo Pắp
Kèo nấp nấp tềng đến đái Vua Ôông kẻ chớ,
Qua cấu Xành, cấu Rôống,
Qua cấu Rôống, cấu Nooc
Cấu ôông Vua Ao ơ lày ước
Kèo chu xước ngược qua tốn Tiến Tiên,
Kèo xa tẩt mướng Quyền, mướng Láang
Tốn con ma nhả vái tèng xuồng
Tốn con ma môông tèng lêng
Phải kèo chu trở vền câu ôông Rôông, câu Noỏc,
Tềng tất tôống chí tam quan kẻ chớ.
Lúc ní,
Cun Tôi, Cun Táng, Lang Cun Khương
Phải mấn tớ chầy nộp gố
Phải mấn thổ nộp chu
Tớ nộp nhá vua thu, nhá vua tà nhấn
Nhá vua thưởng côông
Cun Tối răm trăm nèn váng,
Cun Táng răm trăm nèn pạc,
Lang Cun Khương àn thưởng cày voò rác tiên.
Tể mấn cổ kệch gia chiến
Chiến tiến tiên tể laái.
Xí rối,
Chu chương àn trở pài lài nhá thăm tra du dá con cài
Mướng rảc àn trở lái quên quén thăm pồ, bò mế,
Nghỉ mộch ngáy cho nôống
Lày trở pao mấn nhá chu cho lang
Cày chiiến rởc mấn nhá chu, nhá chương
Cườn mướng ha hãy trẵng phang rằng nữa.`, context: "Ý chí kiên cường dũng mãnh đốn đổ cây Chu thần khổng lồ ngăn trở mặt trời, mở rộng ánh sáng rực rỡ chiếu rọi thung lũng gieo trồng mùa màng." }
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
          <p style="white-space: pre-line; font-style: italic; font-family: var(--font-body); font-size: 1.25rem; color: var(--primary-red); border-left: 2px SOLID var(--accent-gold); padding-left: 16px; margin-bottom: 24px; line-height:1.7;">
            ${tale.kinh}
          </p>
          <p><strong>Ý nghĩa cốt truyện:</strong></p>
          <p style="line-height:1.6; font-size:1.15rem; line-height:1.75; color:rgba(34,23,16,0.88);">${tale.context}</p>
        </div>
        <div id="text-muong" class="bilingual-text">
          <p><strong>Phiên âm Mường cổ:</strong></p>
          <p style="white-space: pre-line; font-style: italic; font-family: var(--font-body); font-size: 1.25rem; color: var(--primary-red); border-left: 2px SOLID var(--accent-gold); padding-left: 16px; line-height:1.7;">
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

let pannellumViewerInstance = null;

function initVRInteraction() {
  const pnmContainer = document.getElementById('panorama');
  if (!pnmContainer) return;

  const loader = document.getElementById('loader');

  if (loader) {
    loader.style.opacity = '1';
    loader.style.visibility = 'visible';
  }

  // Destroy previous viewer instance if re-initializing to avoid WebGL context collision
  if (pannellumViewerInstance) {
    try {
      pannellumViewerInstance.destroy();
    } catch(e) {}
    pannellumViewerInstance = null;
  }

  pnmContainer.innerHTML = '';

  try {
    if (typeof pannellum !== 'undefined') {
      pannellumViewerInstance = pannellum.viewer('panorama', {
        "type": "equirectangular",
        "panorama": "VR360/photo360.jpg",
        "autoLoad": true,
        "autoRotate": -1.5,
        "autoRotateInactivityDelay": 3000,
        "showControls": false,
        "hfov": 100,
        "minHfov": 45,
        "maxHfov": 120,
        "pitch": 0,
        "yaw": 0,
        "compass": false,
        "friction": 0.08,
        "touchPanSpeedCoeff": 1
      });

      pannellumViewerInstance.on('load', function() {
        if (loader) {
          loader.style.opacity = '0';
          loader.style.visibility = 'hidden';
        }
      });

      pannellumViewerInstance.on('error', function(err) {
        console.warn("Pannellum load error:", err);
        if (loader) {
          loader.style.opacity = '0';
          loader.style.visibility = 'hidden';
        }
      });
    }
  } catch (err) {
    console.warn("Pannellum initialization error:", err);
    if (loader) {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
    }
  }

  // Controls Logic
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out');
  const btnRotate = document.getElementById('btn-rotate');
  const btnReset = document.getElementById('btn-reset');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnHelp = document.getElementById('btn-help');
  const helpModal = document.getElementById('help-modal');
  const modalClose = document.getElementById('modal-close');

  if (btnZoomIn) {
    btnZoomIn.onclick = () => {
      if (pannellumViewerInstance) {
        pannellumViewerInstance.setHfov(pannellumViewerInstance.getHfov() - 10);
      }
    };
  }

  if (btnZoomOut) {
    btnZoomOut.onclick = () => {
      if (pannellumViewerInstance) {
        pannellumViewerInstance.setHfov(pannellumViewerInstance.getHfov() + 10);
      }
    };
  }

  let isRotating = true;
  if (btnRotate) {
    btnRotate.onclick = () => {
      if (!pannellumViewerInstance) return;
      if (isRotating) {
        pannellumViewerInstance.stopAutoRotate();
        btnRotate.classList.remove('active');
        isRotating = false;
      } else {
        pannellumViewerInstance.startAutoRotate(-2);
        btnRotate.classList.add('active');
        isRotating = true;
      }
    };
  }

  if (btnReset) {
    btnReset.onclick = () => {
      if (pannellumViewerInstance) {
        pannellumViewerInstance.setPitch(0);
        pannellumViewerInstance.setYaw(0);
        pannellumViewerInstance.setHfov(100);
      }
    };
  }

  if (btnFullscreen) {
    const stageWrapper = document.getElementById('vr360-stage-wrapper');
    btnFullscreen.onclick = () => {
      if (!document.fullscreenElement) {
        const target = stageWrapper || document.documentElement;
        target.requestFullscreen().catch(err => {
          console.warn("Fullscreen error:", err);
        });
        btnFullscreen.innerHTML = '<i class="fa-solid fa-compress"></i>';
      } else {
        document.exitFullscreen();
        btnFullscreen.innerHTML = '<i class="fa-solid fa-expand"></i>';
      }
    };

    document.onfullscreenchange = () => {
      if (!document.fullscreenElement) {
        btnFullscreen.innerHTML = '<i class="fa-solid fa-expand"></i>';
      } else {
        btnFullscreen.innerHTML = '<i class="fa-solid fa-compress"></i>';
      }
    };
  }

  if (btnHelp && helpModal) {
    btnHelp.onclick = () => {
      helpModal.classList.add('active');
    };
  }

  if (modalClose && helpModal) {
    modalClose.onclick = () => {
      helpModal.classList.remove('active');
    };
  }

  if (helpModal) {
    helpModal.onclick = (e) => {
      if (e.target === helpModal) {
        helpModal.classList.remove('active');
      }
    };
  }

  // Handle Tab Switcher VR/3D
  const btnTabVR = document.getElementById('btn-tab-vr');
  const btnTab3D = document.getElementById('btn-tab-3d');
  const paneTabVR = document.getElementById('pane-tab-vr');
  const paneTab3D = document.getElementById('pane-tab-3d');

  if (btnTabVR && btnTab3D && paneTabVR && paneTab3D) {
    btnTabVR.onclick = () => {
      btnTabVR.classList.add('active');
      btnTab3D.classList.remove('active');
      paneTabVR.classList.add('active');
      paneTab3D.classList.remove('active');
      if (pannellumViewerInstance) {
        setTimeout(() => pannellumViewerInstance.resize(), 100);
      }
    };

    btnTab3D.onclick = () => {
      btnTab3D.classList.add('active');
      btnTabVR.classList.remove('active');
      paneTab3D.classList.add('active');
      paneTabVR.classList.remove('active');
      if (typeof renderActive3DModel === 'function') {
        renderActive3DModel('house');
      }
    };
  }
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
    if (current3DModel === 'gong' || current3DModel === 'house') return; // Skip custom drag for GLB model-viewer
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
    if (current3DModel === 'gong' || current3DModel === 'house') return; // Skip custom touch for GLB model-viewer
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

  const stage = document.getElementById('model-3d-stage');

  let modelSrc = '';
  let modelTitle = '';

  if (type === 'house') {
    modelSrc = "3d%20glb/nhasan.glb";
    modelTitle = "Mô hình 3D Nhà Sàn Mường";
  } else if (type === 'gong') {
    modelSrc = "3d%20glb/round%20metal%20doorknob%203d%20model.glb";
    modelTitle = "Mô hình 3D Cồng Chiêng Cổ";
  }

  if (modelSrc) {
    container.innerHTML = `
      <model-viewer 
        src="${modelSrc}" 
        camera-controls 
        auto-rotate 
        shadow-intensity="1.8" 
        exposure="1.25"
        bounds="tight"
        field-of-view="32deg"
        style="width: 100%; height: 100%; min-height: 520px; background: transparent;"
        alt="${modelTitle}">
      </model-viewer>
    `;
    if (stage) stage.style.cursor = 'default';
    return;
  }
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

function initTransparentImages() {
  document.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src');
    if (src && (src.includes('muong_stilt_house_hero.png') || src.includes('muong_stilt_house_kitchen.png') || src.includes('muong_mo_ritual.png'))) {
      const removeBackground = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);

          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          // Remove white/near-white pixels
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // If the pixel is very close to white, make it transparent
            if (r > 240 && g > 240 && b > 240) {
              data[i + 3] = 0;
            }
          }

          ctx.putImageData(imgData, 0, 0);
          img.src = canvas.toDataURL();
        } catch (e) {
          console.warn("Could not remove background due to CORS/security restriction:", e);
        }
      };

      if (img.complete) {
        removeBackground();
      } else {
        img.onload = removeBackground;
      }
    }
  });
}
