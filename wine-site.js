/* GLOBAL COLORS */
const gold = 'rgba(212, 185, 120, 0.95)';
const goldDeep = 'rgba(160, 130, 70, 0.95)';
const ivory = 'rgba(245, 240, 225, 0.9)';
const noir = 'rgba(20, 20, 22, 0.9)';
const olive = 'rgba(120, 140, 90, 0.85)';
const bgDark = '#0b0b0d';

/* ------------------------------
   LOADER
------------------------------ */
function initLoader() {
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => loader.classList.add('hide'), 600);
  });
}

/* ------------------------------
   HEADER SCROLL
------------------------------ */
function initHeaderScroll() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* ------------------------------
   MOBILE NAV
------------------------------ */
function initNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  if (!navToggle || !navList) return;

  navToggle.addEventListener('click', () => {
    navList.classList.toggle('open');
  });

  navList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
    });
  });
}

/* ------------------------------
   LANGUAGE SWITCH + URL PARAM
------------------------------ */
function applyLanguage(lang) {
  const jaEls = document.querySelectorAll('.ja');
  const enEls = document.querySelectorAll('.en');

  if (lang === 'en') {
    jaEls.forEach((el) => (el.style.display = 'none'));
    enEls.forEach((el) => (el.style.display = 'block'));
  } else {
    jaEls.forEach((el) => (el.style.display = 'block'));
    enEls.forEach((el) => (el.style.display = 'none'));
  }

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function updateLangParam(lang) {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  window.history.replaceState({}, '', url.toString());
}

function initLanguageSwitch() {
  const params = new URLSearchParams(window.location.search);
  const initialLang = params.get('lang') === 'en' ? 'en' : 'ja';
  applyLanguage(initialLang);

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      applyLanguage(lang);
      updateLangParam(lang);
    });
  });
}

/* ------------------------------
   GSAP REVEAL + GRAPH FADE
------------------------------ */
function initReveal() {
  gsap.registerPlugin(ScrollTrigger);

  const isLight = document.body.classList.contains('theme-light');
  const initialOpacity = isLight ? 0.25 : 0;

  document.querySelectorAll('.reveal').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: initialOpacity, y: 40, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      },
    );
  });

  document.querySelectorAll('.graph-fade').forEach((card) => {
    gsap.fromTo(
      card,
      { opacity: initialOpacity, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%' },
      },
    );
  });
}

/* ------------------------------
   VANTA FOG
------------------------------ */
function initVanta() {
  VANTA.FOG({
    el: '#vanta-bg',
    highlightColor: 0xd4b978,
    midtoneColor: 0x111111,
    lowlightColor: 0x050506,
    baseColor: 0x050506,
    blurFactor: 0.35,
    speed: 0.8,
    zoom: 1.2,
  });
}

/* ------------------------------
   CHART.JS COMMON OPTIONS
------------------------------ */
const commonLegend = {
  labels: { color: ivory },
};
const commonTooltip = {
  backgroundColor: noir,
  titleColor: gold,
  bodyColor: ivory,
};

function initChart(id, config) {
  const el = document.getElementById(id);
  if (el) new Chart(el, config);
}

/* Annotation plugin */
Chart.register({
  id: 'customLine',
  afterDraw(chart) {
    const ctx = chart.ctx;
    const yScale = chart.scales['y'];

    if (chart.config.options.customLine) {
      const { value, color } = chart.config.options.customLine;
      const y = yScale.getPixelForValue(value);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(chart.chartArea.left, y);
      ctx.lineTo(chart.chartArea.right, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }
  },
});

/* ------------------------------
   INIT CHARTS
------------------------------ */
function initCharts() {
  /* 1. Grape composition */
  initChart('grapeChart', {
    type: 'pie',
    data: {
      labels: ['Macabeo', 'Parellada', 'Xarel·lo'],
      datasets: [
        {
          data: [40, 30, 30],
          backgroundColor: [gold, goldDeep, olive],
          borderColor: bgDark,
          borderWidth: 2,
        },
      ],
    },
    options: {
      plugins: { legend: commonLegend, tooltip: commonTooltip },
    },
  });

  /* 2. Components */
  initChart('componentChart', {
    type: 'bar',
    data: {
      labels: [
        'アルコール度数（12% / 一般：11.5〜12.5%）',
        '酸度（6.8 g/L / 一般：5.5〜7.5）',
        '残糖度（8 g/L / Brut：0〜12）',
      ],
      datasets: [
        {
          label: '数値',
          data: [12, 6.8, 8],
          backgroundColor: ['#d4b978', '#4db6ac', '#f48fb1'],
          borderColor: ['#bfa86a', '#3a8f87', '#d06c92'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      customLine: { value: 12, color: '#d4b978' },
      scales: {
        x: { ticks: { color: ivory } },
        y: { ticks: { color: ivory }, beginAtZero: true },
      },
      plugins: { legend: commonLegend, tooltip: commonTooltip },
    },
  });

  /* 3. Taste radar */
  initChart('tasteChart', {
    type: 'radar',
    data: {
      labels: [
        '果実味（4.2）',
        '酸（4.0）',
        'ミネラル（4.5）',
        '泡の繊細さ（4.3）',
        '余韻（4.6）',
        '香りの層（4.4）',
      ],
      datasets: [
        {
          label: 'Brut Reserva Heredad',
          data: [4.2, 4.0, 4.5, 4.3, 4.6, 4.4],
          backgroundColor: 'rgba(212,185,120,0.18)',
          borderColor: gold,
          borderWidth: 2,
          pointBackgroundColor: goldDeep,
          pointBorderColor: gold,
        },
      ],
    },
    options: {
      scales: {
        r: {
          angleLines: { color: '#444' },
          grid: { color: '#444' },
          pointLabels: { color: ivory },
          ticks: {
            color: ivory,
            beginAtZero: true,
            max: 5,
            backdropColor: 'rgba(0,0,0,0)',
            showLabelBackdrop: false,
          },
        },
      },
      plugins: { legend: commonLegend, tooltip: commonTooltip },
    },
  });

  /* 4. Aging */
  initChart('agingChart', {
    type: 'line',
    data: {
      labels: ['瓶詰め直後', '12ヶ月', '24ヶ月', '30ヶ月'],
      datasets: [
        {
          label: '複雑さのレベル',
          data: [1.5, 3.2, 4.3, 4.7],
          borderColor: gold,
          backgroundColor: 'rgba(212,185,120,0.18)',
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      scales: {
        x: { ticks: { color: ivory } },
        y: { ticks: { color: ivory }, beginAtZero: true, max: 5 },
      },
      plugins: { legend: commonLegend, tooltip: commonTooltip },
    },
  });

  /* 5. Soil */
  initChart('soilChart', {
    type: 'pie',
    data: {
      labels: ['石灰質', '粘土質', '砂質'],
      datasets: [
        {
          data: [50, 30, 20],
          backgroundColor: [gold, goldDeep, olive],
          borderColor: bgDark,
          borderWidth: 2,
        },
      ],
    },
    options: { plugins: { legend: commonLegend, tooltip: commonTooltip } },
  });

  /* 6. Altitude */
  initChart('altitudeChart', {
    type: 'bar',
    data: {
      labels: ['低地', '中標高', '高地'],
      datasets: [
        {
          label: '畑の割合',
          data: [20, 60, 20],
          backgroundColor: gold,
          borderColor: goldDeep,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        x: { ticks: { color: ivory } },
        y: { ticks: { color: ivory }, beginAtZero: true },
      },
      plugins: { legend: commonLegend, tooltip: commonTooltip },
    },
  });

  /* 7. Harvest */
  initChart('harvestChart', {
    type: 'line',
    data: {
      labels: ['8月末', '9月上旬', '9月中旬'],
      datasets: [
        {
          label: '収穫量のピーク',
          data: [30, 60, 40],
          borderColor: gold,
          backgroundColor: 'rgba(212,185,120,0.18)',
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      scales: {
        x: { ticks: { color: ivory } },
        y: { ticks: { color: ivory }, beginAtZero: true },
      },
      plugins: { legend: commonLegend, tooltip: commonTooltip },
    },
  });

  /* 8. Aroma / bubbles / finish */
  initChart('aromaChart', {
    type: 'bar',
    data: {
      labels: [
        '柑橘（4.3）',
        '白い花（3.8）',
        'トースト（4.1）',
        'ナッツ（3.9）',
        '泡のきめ細かさ（4.5）',
        '余韻の長さ（4.7）',
      ],
      datasets: [
        {
          label: '印象の強さ',
          data: [4.3, 3.8, 4.1, 3.9, 4.5, 4.7],
          backgroundColor: olive,
          borderColor: '#9fb58a',
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        x: { ticks: { color: ivory } },
        y: { ticks: { color: ivory }, beginAtZero: true, max: 5 },
      },
      plugins: { legend: commonLegend, tooltip: commonTooltip },
    },
  });

  /* Aroma Wheel (Deep Dive) */
  initChart('aromaWheelChart', {
    type: 'polarArea',
    data: {
      labels: ['Citrus', 'White Flowers', 'Stone Fruit', 'Toast', 'Nutty'],
      datasets: [
        {
          data: [4.3, 3.8, 4.0, 4.1, 3.9],
          backgroundColor: [
            'rgba(212,185,120,0.4)',
            'rgba(160,130,70,0.4)',
            'rgba(120,140,90,0.4)',
            'rgba(244,143,177,0.4)',
            'rgba(77,182,172,0.4)',
          ],
          borderColor: bgDark,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        r: {
          ticks: { color: ivory, beginAtZero: true, max: 5 },
          grid: { color: '#444' },
        },
      },
      plugins: { legend: commonLegend, tooltip: commonTooltip },
    },
  });
}

/* ------------------------------
   PAIRING DETAIL
------------------------------ */
const pairingData = {
  seafood: {
    titleJa: 'Seafood Pairing',
    titleEn: 'Seafood Pairing',
    items: [
      {
        nameJa: '牡蠣 × Brut Reserva Heredad',
        nameEn: 'Oysters × Brut Reserva Heredad',
        descJa: 'ミネラル感と塩味が泡の繊細さと完璧に調和。',
        descEn:
          'Minerality and salinity align perfectly with the fine bubbles.',
        recipeJa: 'レモンを絞るだけで完成。',
        recipeEn: 'Simply squeeze lemon over chilled oysters.',
        img: 'https://wine-link.net/cache/images/recipe/20/b0/9de9a4c45dcfca31d24f3fb261985d7f21ca20b0.600x600.cut.jpg',
      },
      {
        nameJa: '帆立のバターソテー',
        nameEn: 'Butter‑seared Scallops',
        descJa: '甘みとコクがワインの果実味を引き立てる。',
        descEn: 'Sweetness and richness highlight the wine’s fruit character.',
        recipeJa: 'バターで片面1分ずつ焼くだけ。',
        recipeEn: 'Sear each side for a minute in butter.',
        img: 'https://img.kewpie.co.jp/recipes_src/recipe/img/large/BFH0000972_1L.jpg',
      },
    ],
  },

  cheese: {
    titleJa: 'Cheese Pairing',
    titleEn: 'Cheese Pairing',
    items: [
      {
        nameJa: 'ブリーチーズ',
        nameEn: 'Brie',
        descJa: 'クリーミーさが泡の繊細さと相性抜群。',
        descEn: 'Creaminess pairs beautifully with the fine mousse.',
        recipeJa: '常温に戻してクラッカーと一緒に。',
        recipeEn: 'Serve at room temperature with crackers.',
        img: './img/bully-cheese.png',
      },
      {
        nameJa: 'コンテチーズ',
        nameEn: 'Comté',
        descJa: 'ナッツのような香りが香りの層と重なる。',
        descEn: 'Nutty notes echo the wine’s layered aromas.',
        recipeJa: '薄くスライスしてそのまま。',
        recipeEn: 'Slice thinly and serve as is.',
        img: './img/wine-konte-cheese.png',
      },
    ],
  },

  home: {
    titleJa: 'Home Dining',
    titleEn: 'Home Dining',
    items: [
      {
        nameJa: '白身魚のグリル',
        nameEn: 'Grilled White Fish',
        descJa: '軽やかな旨味が果実味と調和。',
        descEn: 'Delicate umami harmonizes with the fruit.',
        recipeJa: '塩・オリーブオイルで焼くだけ。レモンを添えると完璧。',
        recipeEn: 'Grill with salt and olive oil; finish with lemon.',
        img: './img/shiromi-grilled-fish.png',
      },
      {
        nameJa: '天ぷら（海老・野菜）',
        nameEn: 'Tempura (Shrimp & Vegetables)',
        descJa: '揚げ物の香ばしさが余韻の長さとマッチ。',
        descEn: 'The toasted notes match the long finish.',
        recipeJa: '市販の天ぷら粉でOK。揚げたてを塩で。',
        recipeEn: 'Use tempura batter mix; serve freshly fried with salt.',
        img: './img/tempura.png',
      },
    ],
  },
};

function initPairingDetail() {
  const detail = document.getElementById('pairing-detail');
  if (!detail) return;

  document.querySelectorAll('.pairing-card').forEach((card) => {
    card.addEventListener('click', () => {
      const type = card.dataset.type;
      const data = pairingData[type];
      if (!data) return;

      const currentLang =
        document.querySelector('.lang-btn.active')?.dataset.lang || 'ja';

      detail.innerHTML = `
        <div class="pairing-detail-box">
          <h3>${currentLang === 'ja' ? data.titleJa : data.titleEn}</h3>
          ${data.items
            .map(
              (item) => `
            <div class="pairing-item">
              <img src="${item.img}" alt="${
                currentLang === 'ja' ? item.nameJa : item.nameEn
              }">
              <div>
                <h4>${currentLang === 'ja' ? item.nameJa : item.nameEn}</h4>
                <p>${currentLang === 'ja' ? item.descJa : item.descEn}</p>
                <p><strong>${
                  currentLang === 'ja' ? '簡単レシピ：' : 'Quick recipe: '
                }</strong> ${
                  currentLang === 'ja' ? item.recipeJa : item.recipeEn
                }</p>
              </div>
            </div>
          `,
            )
            .join('')}
        </div>
      `;

      gsap.fromTo(
        detail.querySelector('.pairing-detail-box'),
        { opacity: 0, y: 40, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
      );
    });
  });
}

/* ------------------------------
   THEME TOGGLE
------------------------------ */
function initThemeToggle() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const body = document.body;
    const isLight = body.classList.toggle('theme-light');
    body.classList.toggle('theme-dark', !isLight);

    const icon = btn.querySelector('.theme-toggle-icon');
    if (icon) icon.textContent = isLight ? '☀' : '☾';

    // テーマ切り替え後に Reveal を再初期化
    initReveal();
  });
}

/* ------------------------------
   SCROLL LINE ANIMATION (Deep Dive)
------------------------------ */
function initScrollLine() {
  const line = document.querySelector('.deep-line');
  const section = document.getElementById('deep-dive');
  if (!line || !section) return;

  window.addEventListener('scroll', () => {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      const visible = 1 - Math.max(0, rect.top) / (rect.height + windowHeight);

      const scale = Math.min(Math.max(visible, 0), 1);
      line.style.transform = `scaleY(${scale})`;
    }
  });
}

/* ------------------------------
   AUDIO GUIDE
------------------------------ */
function initAudioGuide() {
  const audioButtons = document.querySelectorAll('.audio-btn');
  let audio = null;

  audioButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.audio;
      if (!src) return;

      if (!audio) audio = new Audio(src);
      audio.src = src;
      audio.currentTime = 0;
      audio.play();
    });
  });
}

/* ------------------------------
   SERVICE WORKER
------------------------------ */
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}

/* ------------------------------
   INIT ALL
------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initHeaderScroll();
  initNav();
  initLanguageSwitch();
  initReveal();
  initVanta();
  initCharts();
  initPairingDetail();
  initThemeToggle();
  initScrollLine();
  initAudioGuide();
  initServiceWorker();
});
