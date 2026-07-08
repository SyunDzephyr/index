/* GLOBAL COLORS */
const gold = 'rgba(212, 185, 120, 0.95)';
const goldDeep = 'rgba(160, 130, 70, 0.95)';
const ivory = 'rgba(245, 240, 225, 0.9)';
const noir = 'rgba(20, 20, 22, 0.9)';
const olive = 'rgba(120, 140, 90, 0.85)';
const bgDark = '#0b0b0d';

/* LOADER */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hide'), 600);
});

/* HEADER SCROLL */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

/* MOBILE NAV */
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
navToggle.addEventListener('click', () => {
  navList.classList.toggle('open');
});

/* LANGUAGE SWITCH */
document.querySelectorAll('.lang-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;

    document
      .querySelectorAll('.lang-btn')
      .forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    document
      .querySelectorAll('.ja')
      .forEach((el) => (el.style.display = lang === 'ja' ? 'block' : 'none'));
    document
      .querySelectorAll('.en')
      .forEach((el) => (el.style.display = lang === 'en' ? 'block' : 'none'));
  });
});

/* GSAP REVEAL */
gsap.registerPlugin(ScrollTrigger);
document.querySelectorAll('.reveal').forEach((el) => {
  gsap.fromTo(
    el,
    { opacity: 0, y: 40, scale: 0.98 },
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

/* VANTA FOG */
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

/* CHART.JS HELPER */
function initChart(id, config) {
  const el = document.getElementById(id);
  if (el) new Chart(el, config);
}

/* PLUGIN: ANNOTATION */
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

/* 1. ブドウ品種構成 */
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
    plugins: {
      legend: { labels: { color: ivory } },
      tooltip: {
        backgroundColor: noir,
        titleColor: gold,
        bodyColor: ivory,
      },
    },
  },
});

/* 2. 成分（基準値付き） */
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
    plugins: {
      legend: { labels: { color: ivory } },
      tooltip: {
        backgroundColor: noir,
        titleColor: gold,
        bodyColor: ivory,
      },
    },
  },
});

/* 3. 味わいレーダー（視認性アップ） */
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
        ticks: { color: ivory, beginAtZero: true, max: 5 },
      },
    },
    plugins: {
      legend: { labels: { color: ivory } },
      tooltip: {
        backgroundColor: noir,
        titleColor: gold,
        bodyColor: ivory,
      },
    },
  },
});

/* 4. 熟成期間 */
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
    plugins: {
      legend: { labels: { color: ivory } },
      tooltip: {
        backgroundColor: noir,
        titleColor: gold,
        bodyColor: ivory,
      },
    },
  },
});

/* 5. 土壌構成 */
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
  options: {
    plugins: {
      legend: { labels: { color: ivory } },
      tooltip: {
        backgroundColor: noir,
        titleColor: gold,
        bodyColor: ivory,
      },
    },
  },
});

/* 6. 標高帯の分布 */
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
    plugins: {
      legend: { labels: { color: ivory } },
      tooltip: {
        backgroundColor: noir,
        titleColor: gold,
        bodyColor: ivory,
      },
    },
  },
});

/* 7. 収穫時期の推移 */
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
    plugins: {
      legend: { labels: { color: ivory } },
      tooltip: {
        backgroundColor: noir,
        titleColor: gold,
        bodyColor: ivory,
      },
    },
  },
});

/* 8. 香りの層・泡・余韻 */
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
    plugins: {
      legend: { labels: { color: ivory } },
      tooltip: {
        backgroundColor: noir,
        titleColor: gold,
        bodyColor: ivory,
      },
    },
  },
});
