document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const progressBar = document.querySelector('.scroll-progress span');
const sections = document.querySelectorAll('main section[id], footer[id]');
const navLinks = document.querySelectorAll('.main-nav a[data-section]');
const revealItems = document.querySelectorAll('.reveal');

function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  if (progressBar) progressBar.style.width = `${Math.min(100, progress)}%`;

  let current = '';
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - window.innerHeight * 0.35) current = section.id;
  });
  navLinks.forEach((link) => {
    const isActive = link.dataset.section === current;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      updateScrollUI();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });
window.addEventListener('resize', updateScrollUI);
updateScrollUI();

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const portrait = document.querySelector('.portrait-wrap');
if (portrait) {
  portrait.addEventListener('click', () => portrait.classList.toggle('is-focused'));
  portrait.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      portrait.classList.toggle('is-focused');
    }
  });
}

const workRows = document.querySelectorAll('.work-row[data-work]');
const previewLink = document.querySelector('.preview-link');
const previewImage = previewLink?.querySelector('img');
const previewNumber = document.querySelector('#preview-number');
const works = window.PORTFOLIO_WORKS || [];

function setWorkPreview(index) {
  const work = works[index];
  if (!work || !previewLink || !previewImage) return;
  workRows.forEach((row, rowIndex) => row.classList.toggle('is-active', rowIndex === index));
  previewImage.src = work.cover;
  previewImage.alt = `${work.title}${work.subtitle}主图预览`;
  previewLink.href = `project.html?work=${work.id}`;
  previewLink.setAttribute('aria-label', `查看${work.title}作品详情`);
  if (previewNumber) previewNumber.textContent = `${work.id} / 06`;
}

workRows.forEach((row, index) => {
  row.addEventListener('mouseenter', () => setWorkPreview(index));
  row.addEventListener('focus', () => setWorkPreview(index));
  if (works[index]) {
    const image = new Image();
    image.src = works[index].cover;
  }
});

const creativeWorks = {
  poster: {
    kicker: 'POSTER DESIGN / 02 WORKS',
    title: '海报设计',
    description: '围绕校园活动主题与传播节奏，完成主视觉构思、信息层级、线上长图与线下宣传物料，让活动信息更快被看见、被理解。',
    points: [
      '多人多足挑战赛：从 0 到 1 策划，结合线上海报预热与线下宣传，144 人参赛，完赛率超 95%。',
      '校园十佳歌手大赛：搭建“主视觉海报 + 直播互动”宣发矩阵，活动报名覆盖率达学院在校生 10% 以上。'
    ],
    layout: 'is-poster',
    images: [
      { src: 'assets/img/poster-challenge.png', caption: '多人多足挑战赛 · 活动宣传海报', alt: '燃动青春趣创精彩多人多足挑战赛宣传海报' },
      { src: 'assets/img/poster-singer.png', caption: '校园十佳歌手大赛 · 活动宣传长图', alt: '艺苑杯校园十佳歌手大赛活动宣传长图' }
    ]
  },
  photography: {
    kicker: 'PHOTOGRAPHY / 04 WORKS',
    title: '摄影',
    description: '记录不同时间、天气与场景中的光影变化，关注建筑、水岸与日常景物在瞬间形成的秩序和情绪。',
    points: [
      '从夜色灯光、港口日光、落日逆光与古建筑细节中捕捉空间氛围。',
      '通过构图、色彩与明暗对比保留现场感受。'
    ],
    layout: 'is-photography',
    images: [
      { src: 'assets/img/photo-bridge-night.jpg', caption: '江桥夜色', alt: '夜色中灯光映照的江桥' },
      { src: 'assets/img/photo-harbor-ship.jpg', caption: '港口泊船', alt: '海面上停泊的大型货船' },
      { src: 'assets/img/photo-sunset-bridge.jpg', caption: '落日桥影', alt: '落日逆光中的桥梁与水面' },
      { src: 'assets/img/photo-plum-architecture.jpg', caption: '腊梅与古建', alt: '古建筑旁的腊梅树' }
    ]
  }
};

const creativeCards = document.querySelectorAll('[data-creative]');
const creativeModal = document.getElementById('creative-modal');
const creativeModalKicker = document.getElementById('creative-modal-kicker');
const creativeModalTitle = document.getElementById('creative-modal-title');
const creativeModalDescription = document.getElementById('creative-modal-description');
const creativeModalGallery = document.getElementById('creative-modal-gallery');
const creativeCloseButton = creativeModal?.querySelector('.creative-close');
let creativeTrigger = null;

function openCreativeModal(key) {
  const work = creativeWorks[key];
  if (!work || !creativeModal || !creativeModalGallery) return;

  creativeTrigger = document.activeElement;
  creativeModalKicker.textContent = work.kicker;
  creativeModalTitle.textContent = work.title;
  creativeModalDescription.textContent = work.description;
  creativeModalGallery.className = `creative-gallery ${work.layout}`;
  creativeModalGallery.innerHTML = '';

  const points = document.createElement('ul');
  points.className = 'creative-points';
  work.points.forEach((point) => {
    const item = document.createElement('li');
    item.textContent = point;
    points.appendChild(item);
  });
  creativeModalGallery.appendChild(points);

  work.images.forEach((image, index) => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const caption = document.createElement('figcaption');
    img.src = image.src;
    img.alt = image.alt;
    img.loading = 'lazy';
    caption.innerHTML = `<span>${image.caption}</span><span>${String(index + 1).padStart(2, '0')} / ${String(work.images.length).padStart(2, '0')}</span>`;
    figure.append(img, caption);
    creativeModalGallery.appendChild(figure);
  });

  creativeModal.hidden = false;
  document.body.classList.add('creative-modal-open');
  creativeCloseButton?.focus();
}

function closeCreativeModal() {
  if (!creativeModal || creativeModal.hidden) return;
  creativeModal.hidden = true;
  document.body.classList.remove('creative-modal-open');
  if (creativeTrigger instanceof HTMLElement) creativeTrigger.focus();
}

creativeCards.forEach((card) => {
  card.addEventListener('click', () => openCreativeModal(card.dataset.creative));
});

creativeModal?.querySelectorAll('[data-creative-close]').forEach((element) => {
  element.addEventListener('click', closeCreativeModal);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeCreativeModal();
});
