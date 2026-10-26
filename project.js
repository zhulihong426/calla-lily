const works = window.PORTFOLIO_WORKS || [];
const requestedId = new URLSearchParams(window.location.search).get('work') || '01';
const currentIndex = Math.max(0, works.findIndex((work) => work.id === requestedId));
const work = works[currentIndex];

if (work) {
  const nextWork = works[(currentIndex + 1) % works.length];
  const setText = (id, text) => {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  };

  document.title = `${work.title} · ${work.subtitle} | 主立红`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', `${work.title}——${work.subtitle}，主立红设计作品详情。`);
  setText('project-number', work.id);
  setText('project-category', work.category);
  setText('project-year', work.year);
  setText('project-title', work.title);
  setText('project-subtitle', work.subtitle);
  setText('project-english', work.english);
  setText('project-intro', work.description);
  setText('project-fact', work.fact);
  setText('project-scope', work.scope);
  setText('project-cover-number', `${work.id} — 06`);
  setText('project-next-title', nextWork.title);

  const cover = document.getElementById('project-cover');
  cover.src = work.cover;
  cover.alt = `${work.title}${work.subtitle}主图`;

  const tags = document.getElementById('project-tags');
  work.tags.forEach((tag) => {
    const span = document.createElement('span');
    span.textContent = tag;
    tags.appendChild(span);
  });

  const gallery = document.getElementById('project-gallery');
  work.images.forEach((image, index) => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const caption = document.createElement('figcaption');
    img.src = image.src;
    img.alt = image.alt;
    img.loading = 'lazy';
    caption.innerHTML = `<span>${image.caption}</span><span>0${index + 2} / 04</span>`;
    figure.append(img, caption);
    gallery.appendChild(figure);
  });

  const nextLink = document.getElementById('project-next');
  nextLink.href = `project.html?work=${nextWork.id}`;
  nextLink.setAttribute('aria-label', `查看下一个作品：${nextWork.title}`);
}
