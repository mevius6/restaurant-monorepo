const parsedUrl = new URL(window.location.href);
const doc = document,
      root = doc.documentElement;

// https://github.com/tc39/proposal-dynamic-import
// https://github.com/parcel-bundler/parcel/issues/1401

/* eslint-disable no-unused-vars */
(async () => {
  const toggle = await import('./theme-switcher.js').then(() => {
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
    const feed = await import('./card-feed.js');
    const reveal = await import('./reveal-effect.js');
    const parallax = await import('./parallax.js');
    const map = await import('./map.js');

    loadReviews().then(() => loadCarousel());
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
    const masonry = await import('./masonry-fallback.js');
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
  // eslint-disable-next-line no-undef
  const firstEl = review1; // doc.getElementById('review1');
  // eslint-disable-next-line no-unused-vars
  const reviews = new Reviews(firstEl.parentNode);
}

async function loadCarousel() {
  // eslint-disable-next-line no-unused-vars
  const carousel = await import('./carousel');
}
