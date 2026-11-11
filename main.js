document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const progressBar = document.querySelector('.scroll-progress span');
const sections = document.querySelectorAll('main section[id], footer[id]');
const navLinks = document.querySelectorAll('.main-nav a[data-section]');
const revealItems = document.querySelectorAll('.reveal');
const heroEnterButton = document.querySelector('.hero-button');

document.body.classList.add('hero-gated');
if (heroEnterButton) heroEnterButton.setAttribute('aria-expanded', 'false');

navLinks.forEach((link) => {
  const word = document.createElement('span');
  word.className = 'menu-word';
  word.setAttribute('aria-hidden', 'true');
  [...link.dataset.menu].forEach((character, index) => {
    const letter = document.createElement('span');
    letter.className = 'menu-char';
    letter.style.setProperty('--char-index', index);
    letter.textContent = character;
    word.appendChild(letter);
  });
  link.replaceChildren(word);
  link.classList.add('menu-ready');
});

heroEnterButton?.addEventListener('click', (event) => {
  event.preventDefault();
  if (!document.body.classList.contains('hero-gated')) {
    document.querySelector('#about')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    return;
  }

  document.body.classList.remove('hero-gated');
  heroEnterButton.setAttribute('aria-expanded', 'true');
  requestAnimationFrame(() => {
    document.querySelector('#about')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
});

const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  const heroText = heroTitle.textContent.trim();
  heroTitle.setAttribute('aria-label', heroText);
  heroTitle.textContent = '';

  const typedText = document.createElement('span');
  typedText.className = 'type-text';
  typedText.setAttribute('aria-hidden', 'true');
  const typeCursor = document.createElement('span');
  typeCursor.className = 'type-cursor';
  typeCursor.setAttribute('aria-hidden', 'true');
  heroTitle.append(typedText, typeCursor);

  if (reduceMotion) {
    typedText.textContent = heroText;
    heroTitle.dataset.text = heroText;
  } else {
    let typedIndex = 0;
    setTimeout(() => {
      const typingTimer = setInterval(() => {
        typedIndex += 1;
        const currentText = heroText.slice(0, typedIndex);
        typedText.textContent = currentText;
        heroTitle.dataset.text = currentText;
        if (typedIndex >= heroText.length) clearInterval(typingTimer);
      }, 45);
    }, 300);
  }
}

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
    const wasActive = link.classList.contains('active');
    link.classList.toggle('active', isActive);
    if (isActive && !wasActive && !reduceMotion) {
      link.classList.remove('is-revealing');
      void link.offsetWidth;
      link.classList.add('is-revealing');
    }
    if (isActive) link.setAttribute('aria-current', 'location');
    else {
      link.classList.remove('is-revealing');
      link.removeAttribute('aria-current');
    }
  });

  document.body.classList.toggle('is-creative-active', current === 'creative');
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

function createCreativeFigure(image, index, total, hidden = false) {
  const figure = document.createElement('figure');
  if (hidden) figure.setAttribute('aria-hidden', 'true');
  const img = document.createElement('img');
  const caption = document.createElement('figcaption');
  img.src = image.src;
  img.alt = hidden ? '' : image.alt;
  img.loading = 'lazy';
  caption.innerHTML = `<span>${image.caption}</span><span>${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>`;
  figure.append(img, caption);
  return figure;
}

function buildInfiniteTrack(images) {
  const track = document.createElement('div');
  track.className = 'creative-slider-track';
  const figures = images.map((image, index) => createCreativeFigure(image, index, images.length));
  figures.forEach((figure) => track.appendChild(figure));
  figures.forEach((figure) => {
    const clone = figure.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
  return track;
}

function createFolderCard(item, index, hidden = false) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'folder-card';
  card.dataset.creative = item.work;
  card.style.setProperty('--folder-tilt', `${(index % 3 - 1) * 1.4}deg`);
  if (hidden) {
    card.setAttribute('aria-hidden', 'true');
    card.tabIndex = -1;
  } else {
    card.setAttribute('aria-label', `查看${item.image.caption}详情`);
  }

  const tab = document.createElement('span');
  tab.className = 'folder-tab';
  tab.textContent = item.tab;
  const img = document.createElement('img');
  img.src = item.image.src;
  img.alt = hidden ? '' : item.image.alt;
  img.loading = 'lazy';
  const caption = document.createElement('span');
  caption.className = 'folder-caption';
  caption.innerHTML = `<span>${item.image.caption}</span><span>${String(index + 1).padStart(2, '0')} / 06</span>`;
  card.append(tab, img, caption);
  return card;
}

function buildFolderTrack() {
  const items = [
    ...creativeWorks.poster.images.map((image, index) => ({
      image,
      work: 'poster',
      tab: `POSTER / ${String(index + 1).padStart(2, '0')}`
    })),
    ...creativeWorks.photography.images.map((image, index) => ({
      image,
      work: 'photography',
      tab: `PHOTO / ${String(index + 3).padStart(2, '0')}`
    }))
  ];
  const track = document.createElement('div');
  track.className = 'folder-track';
  const cards = items.map((item, index) => createFolderCard(item, index));
  cards.forEach((card) => track.appendChild(card));
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.tabIndex = -1;
    track.appendChild(clone);
  });
  return track;
}

const creativeCards = document.querySelectorAll('[data-creative]');
const creativeModal = document.getElementById('creative-modal');
const creativeModalPanel = creativeModal?.querySelector('.creative-modal-panel');
const creativeModalKicker = document.getElementById('creative-modal-kicker');
const creativeModalTitle = document.getElementById('creative-modal-title');
const creativeModalDescription = document.getElementById('creative-modal-description');
const creativeModalGallery = document.getElementById('creative-modal-gallery');
const creativeCloseButton = creativeModal?.querySelector('.creative-close');
const creativeFolderReel = document.getElementById('creative-folder-reel');
let creativeTrigger = null;

if (creativeFolderReel) {
  creativeFolderReel.appendChild(buildFolderTrack());
  creativeFolderReel.addEventListener('click', (event) => {
    const card = event.target.closest('.folder-card[data-creative]');
    if (card) openCreativeModal(card.dataset.creative, card);
  });
}

function setModalMorph(trigger) {
  if (!creativeModalPanel) return;

  const triggerRect = trigger?.getBoundingClientRect?.();
  if (!triggerRect) {
    creativeModalPanel.style.setProperty('--morph-x', '0px');
    creativeModalPanel.style.setProperty('--morph-y', '40px');
    creativeModalPanel.style.setProperty('--morph-scale-x', '.82');
    creativeModalPanel.style.setProperty('--morph-scale-y', '.82');
    return;
  }

  const previousTransform = creativeModalPanel.style.transform;
  const previousTransition = creativeModalPanel.style.transition;
  creativeModalPanel.style.transition = 'none';
  creativeModalPanel.style.transform = 'none';
  const panelRect = creativeModalPanel.getBoundingClientRect();
  creativeModalPanel.style.transform = previousTransform;
  creativeModalPanel.style.transition = previousTransition;

  const scaleX = Math.max(.2, Math.min(1, triggerRect.width / panelRect.width));
  const scaleY = Math.max(.2, Math.min(1, triggerRect.height / panelRect.height));
  const translateX = triggerRect.left + triggerRect.width / 2 - (panelRect.left + panelRect.width / 2);
  const translateY = triggerRect.top + triggerRect.height / 2 - (panelRect.top + panelRect.height / 2);

  creativeModalPanel.style.setProperty('--morph-x', `${translateX}px`);
  creativeModalPanel.style.setProperty('--morph-y', `${translateY}px`);
  creativeModalPanel.style.setProperty('--morph-scale-x', `${scaleX}`);
  creativeModalPanel.style.setProperty('--morph-scale-y', `${scaleY}`);
}

function openCreativeModal(key, trigger) {
  const work = creativeWorks[key];
  if (!work || !creativeModal || !creativeModalGallery) return;

  creativeTrigger = trigger || document.activeElement;
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

  if (work.layout === 'is-photography') {
    creativeModalGallery.appendChild(buildInfiniteTrack(work.images));
    creativeModalGallery.classList.add('is-infinite');
  } else {
    work.images.forEach((image, index) => creativeModalGallery.appendChild(createCreativeFigure(image, index, work.images.length)));
    creativeModalGallery.classList.remove('is-infinite');
  }

  creativeModal.hidden = false;
  creativeModal.classList.remove('is-open', 'is-closing');
  setModalMorph(trigger);
  document.body.classList.add('creative-modal-open');
  requestAnimationFrame(() => creativeModal.classList.add('is-open'));
  creativeCloseButton?.focus();
}

function closeCreativeModal() {
  if (!creativeModal || creativeModal.hidden) return;
  creativeModal.classList.remove('is-open');
  creativeModal.classList.add('is-closing');
  setTimeout(() => {
    creativeModal.hidden = true;
    creativeModal.classList.remove('is-closing');
    document.body.classList.remove('creative-modal-open');
    if (creativeTrigger instanceof HTMLElement) creativeTrigger.focus();
    creativeTrigger = null;
  }, 320);
}

creativeCards.forEach((card) => {
  card.addEventListener('click', () => openCreativeModal(card.dataset.creative, card));
});

creativeModal?.querySelectorAll('[data-creative-close]').forEach((element) => {
  element.addEventListener('click', closeCreativeModal);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeCreativeModal();
});
