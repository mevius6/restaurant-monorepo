const parsedUrl = new URL(window.location.href);
const doc = document,
      root = doc.documentElement;

// https://github.com/tc39/proposal-dynamic-import
/* eslint-disable no-unused-vars */
(async () => {
  const toggle = await import('./modules/theme-switcher.js').then(() => {
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
    const hero = await import('./modules/hero');
    const reveal = await import('./modules/reveal-effect');
    const parallax = await import('./modules/parallax');
    const map = await import('./modules/map');

    loadReviews().then(() => loadCarousel());
    loadCardFeed();
  }
  if (
    parsedUrl.pathname === '/about' ||
    parsedUrl.pathname === '/about.html'
  ) {
    const slideshow = await import('./modules/slideshow');
  }
  if (
    parsedUrl.pathname === '/menu' ||
    parsedUrl.pathname === '/menu.html'
  ) {
    const slideshow = await import('./modules/slideshow');
    const tabs = await import('./modules/tabs');
    const pdf = await import('./modules/pdf-viewer');
  }
  if (
    parsedUrl.pathname === '/atm' ||
    parsedUrl.pathname === '/atm.html'
  ) {
    const pano = await import('./modules/panorama');
  }
  if (
    parsedUrl.pathname === '/gallery' ||
    parsedUrl.pathname === '/gallery.html'
  ) {
    const slideshow = await import('./modules/slideshow');
  }

  loadNav();
})();
/* eslint-enable no-unused-vars */

async function loadNav() {
  const { default: DisclosureForNav } = await import('./modules/nav');

  // eslint-disable-next-line no-unused-vars
  const disclosure = new DisclosureForNav(doc.querySelector('.nav-button'));
}

async function loadCarousel() {
  const { default: Carousel } = await import('./modules/carousel');

  const el = doc.querySelector('[data-id="reviews"]');
  // eslint-disable-next-line no-unused-vars
  const carousel = new Carousel(el, {
    control: 'dots',
    offset: 'half',
    reveal: 'true',
  });
}

async function loadReviews() {
  const { default: Reviews } = await import('./modules/reviews');

  // eslint-disable-next-line no-undef
  const firstReview = review1;
  const loadTrigger = createObserver(firstReview);

  loadTrigger.then(() => {
    // eslint-disable-next-line no-unused-vars
    const reviews = new Reviews(firstReview.parentNode);
  });
}

async function loadCardFeed() {
  const { default: CardFeed } = await import('./modules/card-feed');

  // eslint-disable-next-line no-undef
  const firstPost = post1;
  const loadTrigger = createObserver(firstPost);

  loadTrigger.then(() => {
    // eslint-disable-next-line no-unused-vars
    const feed = new CardFeed(firstPost.parentNode);
  });
}

async function createObserver(el, ops={}) {
  let isIntersecting;

  if (Object.entries(ops).length === 0) {
    ops.root = el.parentNode;
    ops.rootMargin = '0px';
    ops.threshold = 0;
  }

  const observer = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      // console.log(entries);
      ({ isIntersecting } = entry);
      if (isIntersecting) observer.unobserve(entry.target);
    }
  });
  observer.observe(el, ops);

  return isIntersecting;
}
