const parsedUrl = new URL(window.location.href);
const doc = document,
      root = doc.documentElement;

// https://github.com/tc39/proposal-dynamic-import
// https://github.com/parcel-bundler/parcel/issues/1401

const modules = {
  toggle: import('./theme-switcher.js'),
  map: import('./map.js'),
  hero: import('./hero.js'),
  reveal: import('./reveal-effect.js'),
  parallax: import('./parallax.js'),
};

async function loadModule(name) {
  const module = await modules[name];
  return module;
}

/* eslint-disable no-unused-vars */
(async () => {
  // const toggle = await import('./theme-switcher.js').then(() => {
  loadModule('toggle').then(() => {
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

    loadReviews().then(() => loadCarousel());
    loadCardFeed();
  }
  if (
    parsedUrl.pathname === '/about' ||
    parsedUrl.pathname === '/about.html'
  ) {
    const slideshow = await import('./slideshow.js');
  }
  if (
    parsedUrl.pathname === '/menu' ||
    parsedUrl.pathname === '/menu.html'
  ) {
    const slideshow = await import('./slideshow.js');
    const tabs = await import('./tabs.js');
    const pdf = await import('./pdf-viewer');
  }
  if (
    parsedUrl.pathname === '/atm' ||
    parsedUrl.pathname === '/atm.html'
  ) {
    const panorama = await import('./panorama.js');
  }
  if (
    parsedUrl.pathname === '/gallery' ||
    parsedUrl.pathname === '/gallery.html'
  ) {
    const slideshow = await import('./slideshow.js');
  }

  loadNav();
})();
/* eslint-enable no-unused-vars */

async function loadNav() {
  const { default: DisclosureForNav } = await import('./nav.js');
  // eslint-disable-next-line no-unused-vars
  const navBtn = new DisclosureForNav(doc.querySelector('.nav-button'));
}

async function loadReviews() {
  const { default: Reviews } = await import('./reviews.js');

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

async function loadCarousel() {
  // eslint-disable-next-line no-unused-vars
  const carousel = await import('./carousel');
}
