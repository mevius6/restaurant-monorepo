const parsedUrl = new URL(window.location.href);
const doc = document,
      root = doc.documentElement;
const path = './modules';

const modules = {
  carousel: import(`${path}/carousel.js`),
  hero: import(`${path}/hero.js`),
  map: import(`${path}/map.js`),
  mode: import(`${path}/theme-switcher.js`),
  pano: import(`${path}/panorama.js`),
  parallax: import(`${path}/parallax.js`),
  pdf: import(`${path}/pdf-viewer.js`),
  reveal: import(`${path}/reveal-effect.js`),
  slides: import(`${path}/slideshow.js`),
  tabs: import(`${path}/tabs.js`),
};

async function loadModule(name) {
  const module = await modules[name]
    .then(() => console.log(`модуль ${name} импортирован 💫`));
  return module;
}

(async () => {
  loadModule('mode').then(() => {
    const themeSwitch = doc.querySelector('theme-switch');
    root.setAttribute('data-theme-style', themeSwitch.mode === 'dark'
      ? 'dark'
      : 'light'
    );
    themeSwitch.addEventListener('colorschemechange', () => {
      root.dataset.themeStyle = themeSwitch.mode;
    });
  });

  if (
    parsedUrl.pathname === '/' ||
    parsedUrl.pathname === '/index.html'
  ) {
    loadModule('hero')
      .then (() => loadModule('reveal'))
      .then (() => loadModule('parallax'))
      .then (() => loadModule('map'));

    loadReviews().then(() => loadModule('carousel'));
    loadCardFeed();
  }
  if (
    parsedUrl.pathname === '/about' ||
    parsedUrl.pathname === '/about.html'
  ) {
    loadModule('slides');
  }
  if (
    parsedUrl.pathname === '/menu' ||
    parsedUrl.pathname === '/menu.html'
  ) {
    loadModule('slides')
      .then (() => loadModule('tabs'))
      .then (() => loadModule('pdf'));
  }
  if (
    parsedUrl.pathname === '/atm' ||
    parsedUrl.pathname === '/atm.html'
  ) {
    loadModule('pano');
  }
  if (
    parsedUrl.pathname === '/gallery' ||
    parsedUrl.pathname === '/gallery.html'
  ) {
    loadModule('slides');
  }

  loadNav();
})();

async function loadNav() {
  const { default: DisclosureForNav } = await import('./nav.js');
  // eslint-disable-next-line no-unused-vars
  const navBtn = new DisclosureForNav(doc.querySelector('.nav-button'));
}

async function loadReviews() {
  const { default: Reviews } = await import('./modules/reviews.js');

  const scrollRoot = document.querySelector('[data-id="reviews"]');
  // eslint-disable-next-line no-undef
  const firstReview = review1;

  const options = {
    root: scrollRoot,
    rootMargin: '0px',
    threshold: 0,
  }

  const loadObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      // console.log(entries);
      if (entry.isIntersecting) {
        // eslint-disable-next-line no-unused-vars
        const reviews = new Reviews(firstReview.parentNode);
        observer.unobserve(entry.target);
      }
    }
  });
  loadObserver.observe(firstReview, options);
}

async function loadCardFeed() {
  const { default: CardFeed } = await import('./card-feed.js');

  const scrollRoot = document.querySelector('[data-id="posts"]');
  // eslint-disable-next-line no-undef
  const firstPost = post1;

  const options = {
    root: scrollRoot,
    rootMargin: '0px',
    threshold: 0,
  }

  const loadObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      // console.log(entries);
      if (entry.isIntersecting) {
        // eslint-disable-next-line no-unused-vars
        const feed = new CardFeed(firstPost.parentNode);
        observer.unobserve(entry.target);
      }
    }
  });
  loadObserver.observe(firstPost, options);
}
